// Envía un correo de prueba con Resend. Uso: node scripts/send-test-email.mjs <desde> <para>
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const [from = 'YariCrochetFina <onboarding@resend.dev>', to = 'yaricrochetfina@gmail.com'] = process.argv.slice(2);

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    from,
    to: [to],
    subject: 'Prueba de correo - Yari Crochet Fina',
    html: '<p>Si lees esto, Resend está configurado correctamente para la tienda.</p>',
  }),
});
console.log('HTTP', res.status, JSON.stringify(await res.json()));
