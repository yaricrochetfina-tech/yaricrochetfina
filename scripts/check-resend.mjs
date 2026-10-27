// Comprueba RESEND_API_KEY (en .env.local) y qué dominios tiene verificados la cuenta.
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const res = await fetch('https://api.resend.com/domains', {
  headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` },
});
const body = await res.json();
console.log('HTTP', res.status);
if (res.status === 401 || res.status === 403) {
  // Una clave "solo envío" no puede listar dominios: es válida pero restringida.
  console.log(body.name, '-', body.message);
} else {
  console.log('Dominios:', (body.data || []).map((d) => `${d.name} (${d.status})`).join(', ') || '(ninguno)');
}
