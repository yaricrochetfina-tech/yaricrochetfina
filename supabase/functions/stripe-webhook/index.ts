import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { getSiteUrl } from '../_shared/cors.ts';
import { sendOrderEmails } from './emails.ts';

// Webhook servidor a servidor: no necesita CORS. La autenticidad se garantiza con la firma de Stripe.

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

serve(async (req) => {
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
      httpClient: Stripe.createFetchHttpClient(),
    });
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature', { status: 400 });
    }

    // Cuerpo en bruto: imprescindible para verificar la firma.
    const body = await req.text();

    let event: Stripe.Event;
    try {
      // En Deno la verificación debe ser asíncrona (SubtleCrypto).
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret,
        undefined,
        Stripe.createSubtleCryptoProvider()
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signature verification failed';
      console.error('Webhook signature verification failed:', message);
      return new Response(`Webhook Error: ${message}`, { status: 400 });
    }

    if (event.type !== 'checkout.session.completed') {
      return json({ received: true });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Processing completed checkout session:', session.id);

    if (session.payment_status !== 'paid') {
      // Solo se aceptan pedidos pagados (con tarjeta el pago es inmediato).
      console.warn('Session completed but not paid:', session.id, session.payment_status);
      return json({ received: true, ignored: 'not_paid' });
    }

    // Idempotencia: Stripe puede reenviar el mismo evento; si el pedido ya existe, no se duplica.
    const { data: existing } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_session_id', session.id)
      .maybeSingle();
    if (existing) {
      console.log('Order already processed for session:', session.id);
      return json({ received: true, duplicate: true });
    }

    // Líneas de compra reales (producto, cantidad y precio cobrado), tal como las registró Stripe.
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
      expand: ['data.price.product'],
    });

    const items = lineItems.data
      .map((line) => {
        const product = line.price?.product as Stripe.Product | undefined;
        return {
          product_id: product?.metadata?.product_id ?? '',
          name: line.description || product?.name || '',
          quantity: line.quantity ?? 0,
          unit_price: (line.price?.unit_amount ?? 0) / 100,
        };
      })
      .filter((item) => item.product_id && item.quantity > 0);

    if (items.length === 0) {
      // Respuesta 200 para que Stripe no reintente indefinidamente; queda registrado para revisión manual.
      console.error('No valid line items for session (manual review required):', session.id);
      return json({ received: true, warning: 'manual_review_required', session_id: session.id });
    }

    const details = session.customer_details;
    // El evento llega con la versión de API configurada en el webhook de Stripe: en las versiones
    // recientes los datos de envío están en `collected_information.shipping_details`; en las
    // antiguas, en `shipping_details`. Se aceptan ambas.
    type ShippingDetails = { name?: string | null; address?: Stripe.Address | null };
    const rawSession = session as unknown as {
      shipping_details?: ShippingDetails | null;
      collected_information?: { shipping_details?: ShippingDetails | null } | null;
    };
    const shipping = rawSession.collected_information?.shipping_details ?? rawSession.shipping_details ?? null;
    const shippingCountry =
      session.metadata?.shipping_country || shipping?.address?.country || details?.address?.country || '';
    const customerName = shipping?.name || details?.name || session.metadata?.customer_name || '';
    const customerEmail = details?.email || session.customer_email || '';
    const language = session.metadata?.language || 'es';
    const totalAmount = (session.amount_total ?? 0) / 100;
    const shippingCost = (session.total_details?.amount_shipping ?? 0) / 100;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: details?.phone || null,
        total_amount: totalAmount,
        shipping_cost: shippingCost,
        shipping_country: shippingCountry,
        shipping_address: shipping
          ? { name: shipping.name ?? null, ...(shipping.address ?? {}) }
          : null,
        language,
        status: 'paid',
        stripe_session_id: session.id,
        stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
      })
      .select()
      .single();

    if (orderError) {
      if (orderError.code === '23505') {
        // Carrera entre dos entregas del mismo evento: el otro proceso ya creó el pedido.
        return json({ received: true, duplicate: true });
      }
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    const { error: itemsError } = await supabase.from('order_items').insert(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.unit_price,
      }))
    );

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Se revierte el pedido para que el reintento de Stripe pueda crearlo completo.
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    // Descuento de stock (las piezas únicas pasan a "agotado").
    for (const item of items) {
      const { error: stockError } = await supabase.rpc('decrement_stock', {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      });
      if (stockError) {
        // No se bloquea el pedido (ya está pagado), pero queda registrado para corregirlo a mano.
        console.error('Error updating stock for product:', item.product_id, stockError);
      }
    }

    console.log('Order created:', order.id);

    // Correos de confirmación (cliente y dueña). Un fallo aquí nunca debe invalidar el pedido.
    let emails: Awaited<ReturnType<typeof sendOrderEmails>> | { error: string } = { error: 'not_sent' };
    try {
      emails = await sendOrderEmails({
        orderId: order.id,
        accessToken: order.access_token,
        siteUrl: session.metadata?.site_url || getSiteUrl(),
        language,
        customerName,
        customerEmail,
        customerPhone: details?.phone || null,
        shippingAddress: shipping?.address ?? null,
        shippingName: shipping?.name ?? null,
        shippingCountry,
        items,
        shippingCost,
        totalAmount,
        currency: (session.currency || 'usd').toUpperCase(),
      });
    } catch (emailError) {
      console.error('Order emails failed (order was saved):', emailError);
      emails = { error: 'exception' };
    }

    // `emails` permite ver en Stripe (Webhooks > intentos de entrega) si se enviaron los correos.
    return json({ received: true, order_id: order.id, emails });
  } catch (error) {
    console.error('Webhook handler error:', error);
    // 500 → Stripe reintentará la entrega del evento.
    return json({ error: 'Webhook processing failed' }, 500);
  }
});
