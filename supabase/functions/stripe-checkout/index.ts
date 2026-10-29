import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { z } from 'https://esm.sh/zod@3.22.4';
import { getCorsHeaders, jsonResponse } from '../_shared/cors.ts';
import { checkRateLimit, getClientIp } from '../_shared/rateLimit.ts';
import { assertLiveStripeForProduction } from '../_shared/stripeMode.ts';
import {
  DELIVERY_MAX_DAYS,
  DELIVERY_MIN_DAYS,
  SHIPPING_COUNTRY_CODES,
  getShippingRate,
} from '../_shared/shipping.ts';

// Códigos de error que entiende el frontend (src/lib/checkout.ts) y traduce al idioma del usuario.
type ErrorCode =
  | 'generic'
  | 'emptyCart'
  | 'invalidCart'
  | 'outOfStock'
  | 'invalidCountry'
  | 'rateLimited'
  | 'invalidOrigin'
  | 'config';

class CheckoutError extends Error {
  constructor(public code: ErrorCode, public status = 400) {
    super(code);
  }
}

const RATE_LIMIT_ACTION = 'stripe_checkout';
const RATE_LIMIT_MAX_REQUESTS = 10; // sesiones de pago por minuto y por IP
const RATE_LIMIT_WINDOW_SECONDS = 60;

const LANGUAGES = ['es', 'fr', 'en'] as const;

const requestSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        quantity: z.number().int().positive().max(100),
        image: z.string().max(2000).optional().default(''),
      })
    )
    .min(1)
    .max(50),
  shippingCountry: z.enum(SHIPPING_COUNTRY_CODES),
  customerEmail: z.string().trim().email().max(255).optional(),
  customerName: z.string().trim().max(200).optional(),
  language: z.enum(LANGUAGES).optional().default('es'),
});

const SHIPPING_LABELS: Record<(typeof LANGUAGES)[number], string> = {
  es: 'Envío con seguimiento desde Montreal',
  fr: 'Livraison avec suivi depuis Montréal',
  en: 'Tracked shipping from Montreal',
};

const mapError = (error: unknown): { code: ErrorCode; status: number } => {
  if (error instanceof CheckoutError) return { code: error.code, status: error.status };
  if (error instanceof z.ZodError) {
    const path = error.errors[0]?.path?.[0];
    if (path === 'shippingCountry') return { code: 'invalidCountry', status: 400 };
    if (path === 'items') return { code: error.errors[0]?.code === 'too_small' ? 'emptyCart' : 'invalidCart', status: 400 };
    return { code: 'invalidCart', status: 400 };
  }
  return { code: 'generic', status: 500 };
};

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (!corsHeaders) {
    return jsonResponse({ error: 'Invalid origin', code: 'invalidOrigin' satisfies ErrorCode }, 403, null);
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed', code: 'generic' satisfies ErrorCode }, 405, corsHeaders);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(
    supabaseUrl,
    supabaseKey,
    clientIp,
    RATE_LIMIT_ACTION,
    RATE_LIMIT_MAX_REQUESTS,
    RATE_LIMIT_WINDOW_SECONDS
  );
  if (!rateLimit.allowed) {
    console.warn('Rate limit exceeded for IP:', clientIp);
    const retryAfter = rateLimit.resetAt
      ? Math.max(1, Math.ceil(rateLimit.resetAt - Date.now() / 1000))
      : 60;
    return jsonResponse(
      { error: 'Too many requests', code: 'rateLimited' satisfies ErrorCode },
      429,
      corsHeaders,
      { 'Retry-After': String(retryAfter) }
    );
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY is not configured');
      throw new CheckoutError('config', 500);
    }

    try {
      assertLiveStripeForProduction(stripeKey, origin);
    } catch (modeError) {
      console.error(modeError instanceof Error ? modeError.message : modeError);
      throw new CheckoutError('config', 500);
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const { items, shippingCountry, customerEmail, customerName, language } = requestSchema.parse(
      await req.json()
    );

    // Se agrupan las líneas repetidas del mismo producto.
    const quantities = new Map<string, { quantity: number; image: string }>();
    for (const item of items) {
      const current = quantities.get(item.id);
      quantities.set(item.id, {
        quantity: (current?.quantity ?? 0) + item.quantity,
        image: current?.image || item.image,
      });
    }

    // Precio, nombre y stock se leen SIEMPRE de la base de datos: nunca se confía en el cliente.
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('id, name, price, in_stock, stock_quantity')
      .in('id', Array.from(quantities.keys()));

    if (dbError || !dbProducts) {
      console.error('Failed to validate products:', dbError);
      throw new CheckoutError('generic', 500);
    }

    const validatedItems = Array.from(quantities.entries()).map(([id, { quantity, image }]) => {
      const product = dbProducts.find((p) => p.id === id);
      if (!product) throw new CheckoutError('invalidCart');
      const stock = product.stock_quantity ?? 1;
      if (!product.in_stock || stock <= 0 || quantity > stock) {
        throw new CheckoutError('outOfStock', 409);
      }
      return { id: product.id, name: product.name, price: Number(product.price), quantity, image };
    });

    const currency = (Deno.env.get('STORE_CURRENCY') || 'cad').toLowerCase();
    const shippingRate = getShippingRate(shippingCountry);
    if (shippingRate === null) throw new CheckoutError('invalidCountry');

    const lineItems = validatedItems.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
          // Stripe solo admite imágenes con URL https absoluta.
          images: item.image.startsWith('https://') ? [item.image] : [],
          metadata: { product_id: item.id },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Las URL de retorno solo usan orígenes autorizados (ya validado por CORS).
    const successOrigin = origin!;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      locale: language,
      customer_email: customerEmail,
      phone_number_collection: { enabled: true },
      // Solo se permite el país elegido en el carrito: es el país por el que se calculó el envío.
      shipping_address_collection: { allowed_countries: [shippingCountry] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: Math.round(shippingRate * 100), currency },
            display_name: SHIPPING_LABELS[language],
            delivery_estimate: {
              minimum: { unit: 'business_day', value: DELIVERY_MIN_DAYS },
              maximum: { unit: 'business_day', value: DELIVERY_MAX_DAYS },
            },
          },
        },
      ],
      success_url: `${successOrigin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${successOrigin}/payment/cancel`,
      metadata: {
        customer_name: customerName || '',
        shipping_country: shippingCountry,
        language,
        site_url: successOrigin,
      },
    });

    console.log('Checkout session created:', session.id, { items: validatedItems.length, shippingCountry });

    return jsonResponse({ url: session.url }, 200, corsHeaders);
  } catch (error) {
    console.error('Checkout error:', error);
    const { code, status } = mapError(error);
    return jsonResponse({ error: code, code }, status, corsHeaders);
  }
});
