import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { z } from 'https://esm.sh/zod@3.22.4';

// Allowed origins for CORS - restrict to specific domains
const allowedOrigins = [
  'https://dlmdegdpdnxoixfophlx.lovable.app',
  'https://yari-crochet-fina.lovable.app',
  // Add any custom domains here
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
};

// Simple in-memory rate limiting (per instance)
// For production with multiple instances, use Redis or database-based rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 checkout sessions per minute per IP

const checkRateLimit = (clientIp: string): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const record = rateLimitMap.get(clientIp);
  
  // Clean up old entries periodically
  if (rateLimitMap.size > 10000) {
    const cutoff = now - RATE_LIMIT_WINDOW_MS;
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < cutoff) {
        rateLimitMap.delete(key);
      }
    }
  }
  
  if (!record || now >= record.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count };
};

// Input validation schema
const cartItemSchema = z.object({
  product: z.object({
    id: z.string().uuid('Invalid product ID'),
    name: z.string().max(200, 'Product name too long'),
    price: z.number().positive('Price must be positive'),
    image: z.string().max(2000).optional().default(''),
  }),
  quantity: z.number().int('Quantity must be an integer').positive('Quantity must be positive').max(100, 'Maximum quantity is 100'),
});

const ALLOWED_COUNTRIES = ['MX', 'US', 'CA', 'FR', 'ES', 'IT', 'DE', 'GB'] as const;

const checkoutRequestSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'Cart cannot be empty').max(50, 'Too many items in cart'),
  shippingCountry: z.enum(ALLOWED_COUNTRIES, { 
    errorMap: () => ({ message: 'Invalid shipping country' })
  }),
  customerEmail: z.string().email('Invalid email format').max(255, 'Email too long').optional(),
  customerName: z.string().max(200, 'Name too long').optional(),
});

// Escape HTML to prevent XSS in error messages
const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Map internal errors to safe user-facing messages
const getSafeErrorMessage = (error: unknown): string => {
  console.error('Checkout error:', error);
  
  if (error instanceof z.ZodError) {
    // Return first validation error (already safe since it's from our schema)
    return error.errors[0]?.message || 'Invalid request data';
  }
  
  if (error instanceof Error) {
    // Map specific errors to generic messages
    if (error.message.includes('not found')) {
      return 'One or more products are unavailable';
    }
    if (error.message.includes('out of stock')) {
      return 'Some items are no longer in stock';
    }
    if (error.message.includes('STRIPE_SECRET_KEY')) {
      return 'Payment system configuration error';
    }
  }
  
  return 'Unable to process your request. Please try again.';
};

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting - get client IP
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('x-real-ip') || 
                   'unknown';
  
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    console.warn('Rate limit exceeded for IP:', clientIp);
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again in a minute.' }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
        status: 429,
      }
    );
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Parse and validate input
    const rawBody = await req.json();
    const validatedInput = checkoutRequestSchema.parse(rawBody);
    const { items, shippingCountry, customerEmail, customerName } = validatedInput;

    console.log('Creating checkout session for:', { itemsCount: items.length, shippingCountry });

    // Create Supabase client to validate products
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch real product data from database to validate prices and stock
    const productIds = items.map(item => item.product.id);
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('id, name, price, in_stock')
      .in('id', productIds);

    if (dbError || !dbProducts) {
      console.error('Failed to validate products:', dbError);
      return new Response(
        JSON.stringify({ error: 'Unable to validate products. Please try again.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Validate each item against database
    const validatedItems = items.map(item => {
      const dbProduct = dbProducts.find(p => p.id === item.product.id);
      
      if (!dbProduct) {
        throw new Error(`Product ${item.product.id} not found`);
      }
      
      if (!dbProduct.in_stock) {
        throw new Error(`Product "${escapeHtml(dbProduct.name)}" is out of stock`);
      }
      
      // Use database price and name, not client-provided values
      return {
        product: {
          id: dbProduct.id,
          name: dbProduct.name,
          price: Number(dbProduct.price),
          image: item.product.image || '',
        },
        quantity: item.quantity,
      };
    });

    console.log('Products validated successfully');

    // Shipping rates by country (in USD)
    const shippingRates: Record<string, number> = {
      'MX': 15.00,
      'US': 25.00,
      'CA': 25.00,
      'FR': 35.00,
      'ES': 35.00,
      'IT': 35.00,
      'DE': 35.00,
      'GB': 35.00,
    };

    const shippingCost = shippingRates[shippingCountry];

    // Helper to validate image URLs for Stripe (must be absolute https URLs)
    const isValidImageUrl = (url: string): boolean => {
      return url.startsWith('https://') && url.length < 2000;
    };

    // Create line items for Stripe using validated data
    const lineItems = validatedItems.map(item => {
      const images = isValidImageUrl(item.product.image) ? [item.product.image] : [];
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            images,
          },
          unit_amount: Math.round(item.product.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Add shipping as a line item
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Envío a ${shippingCountry}`,
          images: [],
        },
        unit_amount: Math.round(shippingCost * 100),
      },
      quantity: 1,
    });

    // Use validated origin for redirect URLs
    const validatedOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${validatedOrigin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${validatedOrigin}/payment/cancel`,
      customer_email: customerEmail,
      metadata: {
        customer_name: customerName || '',
        shipping_country: shippingCountry,
        items: JSON.stringify(validatedItems.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        }))),
      },
      shipping_address_collection: {
        allowed_countries: [...ALLOWED_COUNTRIES],
      },
    });

    console.log('Checkout session created:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    const safeMessage = getSafeErrorMessage(error);
    return new Response(
      JSON.stringify({ error: safeMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error instanceof z.ZodError ? 400 : 500,
      }
    );
  }
});