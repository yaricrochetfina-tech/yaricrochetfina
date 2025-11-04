import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface CheckoutRequest {
  items: CartItem[];
  shippingCountry: string;
  customerEmail?: string;
  customerName?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    const { items, shippingCountry, customerEmail, customerName }: CheckoutRequest = await req.json();

    console.log('Creating checkout session for:', { itemsCount: items.length, shippingCountry });

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
      'default': 40.00,
    };

    const shippingCost = shippingRates[shippingCountry] || shippingRates.default;

    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          images: [item.product.image],
        },
        unit_amount: Math.round(item.product.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

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

    const origin = req.headers.get('origin') || 'https://dlmdegdpdnxoixfophlx.lovable.app';

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
      customer_email: customerEmail,
      metadata: {
        customer_name: customerName || '',
        shipping_country: shippingCountry,
        items: JSON.stringify(items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        }))),
      },
      shipping_address_collection: {
        allowed_countries: ['MX', 'US', 'CA', 'FR', 'ES', 'IT', 'DE', 'GB'],
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
    console.error('Error creating checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});