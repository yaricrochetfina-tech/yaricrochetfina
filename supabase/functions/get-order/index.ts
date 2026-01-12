import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Get access_token from query parameter
    const url = new URL(req.url);
    const accessToken = url.searchParams.get('token');

    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: 'Missing access token' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate token format (should be UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(accessToken)) {
      return new Response(
        JSON.stringify({ error: 'Invalid token format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch order by access token
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        customer_name,
        customer_email,
        total_amount,
        shipping_cost,
        shipping_country,
        status,
        created_at,
        order_items (
          id,
          product_id,
          quantity,
          price_at_purchase,
          products (
            name,
            image
          )
        )
      `)
      .eq('access_token', accessToken)
      .single();

    if (orderError || !order) {
      console.error('Order lookup error:', orderError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return sanitized order data (hide sensitive fields like stripe IDs)
    return new Response(
      JSON.stringify({
        order: {
          id: order.id,
          customer_name: order.customer_name,
          total_amount: order.total_amount,
          shipping_cost: order.shipping_cost,
          shipping_country: order.shipping_country,
          status: order.status,
          created_at: order.created_at,
          items: order.order_items,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Get order error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
