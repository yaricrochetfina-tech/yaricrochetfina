// Crea (o recrea) el webhook de Stripe (modo test) que apunta a la Edge Function
// stripe-webhook y guarda su secreto de firma en .env.local como STRIPE_WEBHOOK_SECRET.
import { readFileSync, appendFileSync, writeFileSync } from 'node:fs';

const ENV_PATH = new URL('../.env.local', import.meta.url);
const parse = () =>
  Object.fromEntries(
    readFileSync(ENV_PATH, 'utf8')
      .split('\n')
      .filter((l) => l.includes('='))
      .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
  );

const env = parse();
const key = env.STRIPE_SECRET_KEY;
if (!key?.startsWith('sk_test_')) throw new Error('Falta STRIPE_SECRET_KEY de test');

const URL_WEBHOOK = 'https://tgwidfzvwlvsemzsiogh.supabase.co/functions/v1/stripe-webhook';
const api = async (path, init = {}) => {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${path}: ${body.error?.message}`);
  return body;
};

const existing = (await api('/webhook_endpoints?limit=100')).data.filter((e) => e.url === URL_WEBHOOK);
if (existing.length && env.STRIPE_WEBHOOK_SECRET) {
  console.log('Ya existe el webhook y el secreto está guardado:', existing[0].id);
  process.exit(0);
}
for (const e of existing) await api(`/webhook_endpoints/${e.id}`, { method: 'DELETE' });

const created = await api('/webhook_endpoints', {
  method: 'POST',
  body: new URLSearchParams({
    url: URL_WEBHOOK,
    'enabled_events[]': 'checkout.session.completed',
    description: 'Yari Crochet Fina - pedidos (test)',
  }),
});

const lines = readFileSync(ENV_PATH, 'utf8').split('\n').filter((l) => !l.startsWith('STRIPE_WEBHOOK_SECRET='));
writeFileSync(ENV_PATH, lines.join('\n').replace(/\n*$/, '\n') + `STRIPE_WEBHOOK_SECRET=${created.secret}\n`);
console.log('Webhook creado:', created.id, '->', created.url, '| secreto guardado en .env.local');
