// Muestra datos no sensibles de la última sesión de prueba (moneda, importes, URLs de retorno).
import { readFileSync } from 'node:fs';
const env = Object.fromEntries(readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const st = JSON.parse(readFileSync('/tmp/e2e-state.json', 'utf8'));
const s = await (await fetch(`https://api.stripe.com/v1/checkout/sessions/${st.sessionId}`, { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } })).json();
console.log({ status: s.status, payment_status: s.payment_status, currency: s.currency, amount_total: s.amount_total / 100, shipping: s.total_details?.amount_shipping / 100, success_url: s.success_url, cancel_url: s.cancel_url });
