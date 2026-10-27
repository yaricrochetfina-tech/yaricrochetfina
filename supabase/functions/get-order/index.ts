import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { getCorsHeaders, jsonResponse } from '../_shared/cors.ts';
import { checkRateLimit, getClientIp } from '../_shared/rateLimit.ts';

// Devuelve un pedido a partir de un identificador secreto que solo conoce quien compró:
//  - `token`: access_token enviado en el correo de confirmación, o
//  - `session_id`: id de la sesión de Stripe Checkout (llega en la URL de retorno tras pagar).
// Acepta GET (?token=...) y POST ({ token } | { session_id }).

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SESSION_ID_REGEX = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return corsHeaders ? new Response(null, { headers: corsHeaders }) : new Response(null, { status: 204 });
  }

  if (!corsHeaders) {
    return jsonResponse({ error: 'Forbidden' }, 403, null);
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders);
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Límite de consultas por IP para impedir que se adivinen identificadores.
    const rateLimit = await checkRateLimit(
      supabaseUrl,
      supabaseServiceKey,
      getClientIp(req),
      'get_order',
      60,
      60
    );
    if (!rateLimit.allowed) {
      return jsonResponse({ error: 'Too many requests' }, 429, corsHeaders);
    }

    let token: string | null = null;
    let sessionId: string | null = null;

    if (req.method === 'GET') {
      const url = new URL(req.url);
      token = url.searchParams.get('token');
      sessionId = url.searchParams.get('session_id');
    } else {
      const body = await req.json().catch(() => ({}));
      token = typeof body?.token === 'string' ? body.token : null;
      sessionId = typeof body?.session_id === 'string' ? body.session_id : null;
    }

    if (!token && !sessionId) {
      return jsonResponse({ error: 'Missing order reference' }, 400, corsHeaders);
    }
    if (token && !UUID_REGEX.test(token)) {
      return jsonResponse({ error: 'Invalid token format' }, 400, corsHeaders);
    }
    if (!token && sessionId && !SESSION_ID_REGEX.test(sessionId)) {
      return jsonResponse({ error: 'Invalid session format' }, 400, corsHeaders);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const query = supabase.from('orders').select(`
        id,
        customer_name,
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
      `);

    const { data: order, error: orderError } = await (token
      ? query.eq('access_token', token)
      : query.eq('stripe_session_id', sessionId!)
    ).maybeSingle();

    if (orderError) {
      console.error('Order lookup error:', orderError);
      return jsonResponse({ error: 'Internal server error' }, 500, corsHeaders);
    }
    if (!order) {
      return jsonResponse({ error: 'Order not found' }, 404, corsHeaders);
    }

    // Solo se devuelven datos no sensibles (sin IDs de Stripe ni email).
    return jsonResponse(
      {
        order: {
          id: order.id,
          customer_name: order.customer_name,
          total_amount: Number(order.total_amount),
          shipping_cost: Number(order.shipping_cost),
          shipping_country: order.shipping_country,
          status: order.status,
          created_at: order.created_at,
          items: order.order_items,
        },
      },
      200,
      corsHeaders
    );
  } catch (error) {
    console.error('Get order error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500, corsHeaders);
  }
});
