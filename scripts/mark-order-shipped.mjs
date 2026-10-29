#!/usr/bin/env node
/**
 * Marca un pedido como enviado y envía el correo de tracking al cliente.
 *
 * Uso:
 *   node scripts/mark-order-shipped.mjs <orderId> "<carrier>" "<trackingNumber>" [trackingUrl]
 *
 * Requiere en .env.local:
 *   VITE_SUPABASE_URL
 *   ORDER_ADMIN_SECRET   (o SUPABASE_SERVICE_ROLE_KEY)
 */
import { readFileSync } from 'node:fs';

const loadEnv = (name) => {
  try {
    return Object.fromEntries(
      readFileSync(new URL(`../${name}`, import.meta.url), 'utf8')
        .split('\n')
        .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
        .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
    );
  } catch {
    return {};
  }
};

const env = { ...loadEnv('.env'), ...loadEnv('.env.local') };
const args = process.argv.slice(2).filter((a) => a !== '--resend');
const resend = process.argv.includes('--resend');
const [orderId, carrier, trackingNumber, trackingUrl] = args;

if (!orderId || !carrier || !trackingNumber) {
  console.error(
    'Uso: node scripts/mark-order-shipped.mjs <orderId> "<carrier>" "<trackingNumber>" [trackingUrl] [--resend]'
  );
  process.exit(1);
}

const base = (env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const secret = env.ORDER_ADMIN_SECRET || env.SUPABASE_SERVICE_ROLE_KEY;
if (!base || !secret) {
  console.error('Falta VITE_SUPABASE_URL u ORDER_ADMIN_SECRET / SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const res = await fetch(`${base}/functions/v1/mark-order-shipped`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-order-admin-secret': secret,
  },
  body: JSON.stringify({
    orderId,
    carrier,
    trackingNumber,
    trackingUrl: trackingUrl || undefined,
    resend,
  }),
});

const body = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error('Error', res.status, body);
  process.exit(1);
}
console.log(JSON.stringify(body, null, 2));
