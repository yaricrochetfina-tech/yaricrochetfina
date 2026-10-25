// Comprueba que STRIPE_SECRET_KEY (en .env.local) es válida y es de modo test.
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const key = env.STRIPE_SECRET_KEY;
if (!key?.startsWith('sk_test_')) {
  console.error('STRIPE_SECRET_KEY no existe o no es una clave de test (sk_test_...)');
  process.exit(1);
}

const res = await fetch('https://api.stripe.com/v1/balance', {
  headers: { Authorization: `Bearer ${key}` },
});
const body = await res.json();
if (!res.ok) {
  console.error('Stripe respondió', res.status, body.error?.message);
  process.exit(1);
}
console.log('Clave válida. livemode =', body.livemode, '| monedas disponibles:', body.available.map((a) => a.currency).join(', ') || '(sin saldo)');
