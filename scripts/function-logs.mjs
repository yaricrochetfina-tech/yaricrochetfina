// Muestra los logs recientes de una Edge Function. Uso: node scripts/function-logs.mjs stripe-webhook
import { readFileSync } from 'node:fs';
const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n').filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const fn = process.argv[2] || 'stripe-webhook';
const res = await fetch(
  `https://api.supabase.com/v1/projects/tgwidfzvwlvsemzsiogh/analytics/endpoints/logs?sql=${encodeURIComponent(
    `select timestamp, event_message from ${process.argv[3] || "function_logs"} order by timestamp desc limit 60`
  )}`,
  { headers: { Authorization: `Bearer ${env.SUPABASE_ACCESS_TOKEN}` } }
);
const body = await res.json();
if (process.env.DEBUG) console.log(JSON.stringify(body).slice(0, 500));
if (!res.ok) { console.error(res.status, JSON.stringify(body).slice(0, 300)); process.exit(1); }
for (const r of (body.result || []).reverse()) console.log(new Date(r.timestamp / 1000).toISOString(), r.event_message);
