// Prueba E2E del flujo de compra (Stripe en modo TEST, Supabase real).
//   node scripts/e2e-purchase.mjs create   -> crea una sesión de Checkout con 1 producto y muestra la URL de pago
//   node scripts/e2e-purchase.mjs verify   -> comprueba pedido, líneas, stock descontado y entrega del webhook
// Las credenciales se leen de .env.local y .env (nunca se imprimen).
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const load = (name) =>
  Object.fromEntries(
    readFileSync(new URL(`../${name}`, import.meta.url), 'utf8')
      .split('\n')
      .filter((l) => l.includes('='))
      .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
  );
const env = { ...load('.env'), ...load('.env.local') };
const REF = 'tgwidfzvwlvsemzsiogh';
const BASE = `https://${REF}.supabase.co`;
const STATE = '/tmp/e2e-state.json';

const sql = (query) => {
  const out = execFileSync('npx', ['--yes', 'supabase@latest', 'db', 'query', '--linked', query], {
    env: process.env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  const json = out
    .slice(out.indexOf('{'), out.lastIndexOf('}') + 1)
    .replace(/\n\s*"warning":.*\n/, '\n')
    .replace(/,(\s*[}\]])/g, '$1');
  return JSON.parse(json).rows;
};
const ok = (cond, msg) => console.log(`${cond ? '✅' : '❌'} ${msg}`) || (cond ? 0 : (process.exitCode = 1));

const mode = process.argv[2];

if (mode === 'create') {
  const [product] = sql(
    "select id, name, price, stock_quantity from products where in_stock and stock_quantity > 0 order by name limit 1"
  );
  console.log('Producto de prueba:', product.name, '| precio', product.price, '| stock antes:', product.stock_quantity);

  const res = await fetch(`${BASE}/functions/v1/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: env.VITE_SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      Origin: process.env.E2E_ORIGIN || 'https://www.yaricrochet.com',
    },
    body: JSON.stringify({
      items: [{ id: product.id, quantity: 1, image: '' }],
      shippingCountry: 'CA',
      customerEmail: 'yaricrochetfina@gmail.com',
      customerName: 'Cliente de Prueba',
      language: 'es',
    }),
  });
  const body = await res.json();
  ok(res.status === 200 && !!body.url, `stripe-checkout respondió ${res.status} ${body.url ? '(URL de pago recibida)' : JSON.stringify(body)}`);
  if (!body.url) process.exit(1);
  const sessionId = body.url.match(/(cs_test_[A-Za-z0-9]+)/)?.[1];
  writeFileSync(STATE, JSON.stringify({ productId: product.id, name: product.name, stockBefore: product.stock_quantity, sessionId, url: body.url }));
  console.log('Sesión:', sessionId);
  console.log('URL:', body.url);
}

if (mode === 'verify') {
  const st = JSON.parse(readFileSync(STATE, 'utf8'));
  let order;
  for (let i = 0; i < 20 && !order; i++) {
    [order] = sql(`select id, status, total_amount, customer_email, shipping_address is not null as has_addr, access_token from orders where stripe_session_id = '${st.sessionId}'`);
    if (!order) await new Promise((r) => setTimeout(r, 3000));
  }
  ok(!!order, 'El webhook creó el pedido');
  if (!order) process.exit(1);
  ok(order.status === 'paid', `Estado del pedido = ${order.status}`);
  ok(order.has_addr, 'Se guardó la dirección de envío');
  console.log('Total:', order.total_amount, '| email:', order.customer_email);

  const items = sql(`select product_id, quantity, price_at_purchase from order_items where order_id = '${order.id}'`);
  ok(items.length === 1 && items[0].quantity === 1, `Líneas del pedido: ${JSON.stringify(items)}`);

  const [after] = sql(`select stock_quantity, in_stock from products where id = '${st.productId}'`);
  ok(after.stock_quantity === st.stockBefore - 1, `Stock ${st.stockBefore} -> ${after.stock_quantity} (in_stock=${after.in_stock})`);

  // Idempotencia: la API de get-order devuelve el pedido con el token
  const r = await fetch(`${BASE}/functions/v1/get-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: env.VITE_SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${env.VITE_SUPABASE_PUBLISHABLE_KEY}`, Origin: process.env.E2E_ORIGIN || 'https://www.yaricrochet.com' },
    body: JSON.stringify({ session_id: st.sessionId }),
  });
  ok(r.status === 200, `get-order por session_id respondió ${r.status}`);
}
