import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// No CORS needed for server-to-server webhook from Stripe

serve(async (req) => {
  // Webhooks don't need CORS - they come directly from Stripe servers
  // Return 405 for unsupported methods
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!stripeKey || !webhookSecret) {
      throw new Error('Stripe keys not configured');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the signature from headers
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('No stripe-signature header found');
      return new Response('No signature', { status: 400 });
    }

    // Get raw body for signature verification
    const body = await req.text();
    
    let event: Stripe.Event;

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('Webhook signature verified:', event.type);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signature verification failed';
      console.error('Webhook signature verification failed:', errorMessage);
      return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('Processing completed checkout session:', session.id);

      try {
        // Parse items from metadata
        const items = JSON.parse(session.metadata?.items || '[]');
        const shippingCountry = session.metadata?.shipping_country || '';
        const customerName = session.metadata?.customer_name || session.customer_details?.name || '';
        const customerEmail = session.customer_details?.email || '';
        const customerPhone = session.customer_details?.phone || null;

        // Calculate totals
        const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        
        // Shipping rates (must match checkout function)
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
        const totalAmount = subtotal + shippingCost;

        // Create order record
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            customer_email: customerEmail,
            customer_name: customerName,
            customer_phone: customerPhone,
            total_amount: totalAmount,
            shipping_cost: shippingCost,
            shipping_country: shippingCountry,
            status: 'paid',
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .select()
          .single();

        if (orderError) {
          console.error('Error creating order:', orderError);
          throw orderError;
        }

        console.log('Order created:', order.id);

        // Create order items
        const orderItems = items.map((item: any) => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.price,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('Error creating order items:', itemsError);
          throw itemsError;
        }

        console.log('Order items created:', orderItems.length);

        // Update product stock (decrement)
        for (const item of items) {
          const { error: stockError } = await supabase.rpc('decrement_stock', {
            product_id: item.product_id,
            quantity: item.quantity,
          });

          if (stockError) {
            console.error('Error updating stock for product:', item.product_id, stockError);
            // Continue even if stock update fails to not block order creation
          }
        }

        console.log('Order processing completed successfully');

      } catch (error) {
        console.error('Error processing order:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        // Return 500 to indicate processing failure
        return new Response(
          JSON.stringify({ error: 'Order processing failed', details: errorMessage }),
          { 
            headers: { 'Content-Type': 'application/json' },
            status: 500 
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Webhook handler error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
