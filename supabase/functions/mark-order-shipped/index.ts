import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { z } from 'https://esm.sh/zod@3.22.4';
import { getSiteUrl, jsonResponse } from '../_shared/cors.ts';
import { sendShippingEmail } from '../stripe-webhook/emails.ts';

/**
 * Marca un pedido como enviado y avisa al cliente por correo con el tracking.
 *
 * Autenticación: cabecera `x-order-admin-secret` = secreto ORDER_ADMIN_SECRET
 * (o, como respaldo, el mismo valor que SUPABASE_SERVICE_ROLE_KEY solo en llamadas
 * servidor→servidor; preferible ORDER_ADMIN_SECRET).
 *
 * Body JSON:
 * {
 *   "orderId": "uuid",
 *   "carrier": "Canada Post",
 *   "trackingNumber": "123...",
 *   "trackingUrl": "https://..." // opcional
 *   "resend": false // opcional: reenviar correo si ya estaba shipped
 * }
 */

const bodySchema = z.object({
  orderId: z.string().uuid(),
  carrier: z.string().trim().min(1).max(120),
  trackingNumber: z.string().trim().min(1).max(120),
  trackingUrl: z.string().trim().url().max(2000).optional().nullable(),
  resend: z.boolean().optional().default(false),
});

const isAuthorized = (req: Request): boolean => {
  const provided = req.headers.get('x-order-admin-secret')?.trim() || '';
  if (!provided) return false;
  const adminSecret = Deno.env.get('ORDER_ADMIN_SECRET')?.trim();
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim();
  return Boolean(
    (adminSecret && provided === adminSecret) || (serviceKey && provided === serviceKey)
  );
};

serve(async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, null);
  }

  if (!isAuthorized(req)) {
    return jsonResponse({ error: 'Unauthorized' }, 401, null);
  }

  try {
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonResponse(
        { error: 'Invalid request', details: parsed.error.flatten() },
        400,
        null
      );
    }

    const { orderId, carrier, trackingNumber, trackingUrl, resend } = parsed.data;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: order, error: lookupError } = await supabase
      .from('orders')
      .select(
        'id, customer_name, customer_email, language, status, tracking_number, tracking_carrier'
      )
      .eq('id', orderId)
      .maybeSingle();

    if (lookupError) {
      console.error('Order lookup failed:', lookupError);
      return jsonResponse({ error: 'Lookup failed' }, 500, null);
    }
    if (!order) {
      return jsonResponse({ error: 'Order not found' }, 404, null);
    }

    const alreadyShipped = order.status === 'shipped';
    if (alreadyShipped && !resend) {
      const sameTracking =
        order.tracking_number === trackingNumber && order.tracking_carrier === carrier;
      if (sameTracking) {
        return jsonResponse(
          { ok: true, alreadyShipped: true, email: 'skipped' },
          200,
          null
        );
      }
      return jsonResponse(
        {
          error: 'Order already shipped',
          hint: 'Pass resend: true to update tracking and email the customer again',
        },
        409,
        null
      );
    }

    const shippedAt = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'shipped',
        tracking_carrier: carrier,
        tracking_number: trackingNumber,
        tracking_url: trackingUrl || null,
        shipped_at: shippedAt,
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Failed to mark order shipped:', updateError);
      return jsonResponse({ error: 'Update failed' }, 500, null);
    }

    const emailStatus = await sendShippingEmail({
      orderId: order.id,
      siteUrl: getSiteUrl(),
      language: order.language || 'es',
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      carrier,
      trackingNumber,
      trackingUrl: trackingUrl || null,
    });

    console.log('Order marked shipped:', orderId, { emailStatus, carrier });

    return jsonResponse(
      {
        ok: true,
        orderId,
        status: 'shipped',
        shippedAt,
        email: emailStatus,
      },
      200,
      null
    );
  } catch (error) {
    console.error('mark-order-shipped error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500, null);
  }
});
