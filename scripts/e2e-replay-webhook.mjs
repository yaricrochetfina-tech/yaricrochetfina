// Reenvía al webhook un evento checkout.session.completed firmado (con STRIPE_WEBHOOK_SECRET)
// para la sesión pagada de la última prueba. Muestra la respuesta, incluido el estado de los correos.
// Uso: node scripts/e2e-replay-webhook.mjs [veces]
import { readFileSync } from 'node:fs';
import { createHmac } from 'node:crypto';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n').filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const st = JSON.parse(readFileSync('/tmp/e2e-state.json', 'utf8'));
const times = Number(process.argv[2] || 1);

const sres = await fetch(`https://api.stripe.com/v1/checkout/sessions/${st.sessionId}`, {
  headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
});
const session = await sres.json();
console.log('Sesión en Stripe:', session.id, '| payment_status =', session.payment_status);

for (let i = 1; i <= times; i++) {
  const payload = JSON.stringify({
    id: `evt_replay_${Date.now()}_${i}`,
    object: 'event',
    type: 'checkout.session.completed',
    api_version: '2023-10-16',
    created: Math.floor(Date.now() / 1000),
    data: { object: session },
  });
  const t = Math.floor(Date.now() / 1000);
  const sig = createHmac('sha256', env.STRIPE_WEBHOOK_SECRET).update(`${t}.${payload}`).digest('hex');
  const res = await fetch('https://tgwidfzvwlvsemzsiogh.supabase.co/functions/v1/stripe-webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Stripe-Signature': `t=${t},v1=${sig}` },
    body: payload,
  });
  console.log(`Envío ${i}: HTTP ${res.status}`, await res.text());
}
