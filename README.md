# YariCrochetFina

Tienda online de crochet artesanal. Interfaz en español (por defecto), francés e inglés.

- **Frontend:** Vite + React 18 + TypeScript, Tailwind, shadcn/ui, react-i18next, zustand (carrito persistente), React Query.
- **Backend:** Supabase (Postgres + RLS + Edge Functions).
- **Pagos:** Stripe Checkout (el servidor es la fuente de verdad de precios, stock y envío).
- **Correos:** Resend (confirmación de pedido, aviso a la tienda y formulario de contacto).

## Desarrollo local

```sh
npm install
cp .env.example .env      # y rellena los valores
npm run dev               # http://localhost:8080
```

Scripts útiles:

| Comando             | Qué hace                                                   |
| ------------------- | ---------------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo                                     |
| `npm run build`     | Compilación de producción                                  |
| `npm run lint`      | ESLint                                                     |
| `npm run typecheck` | Comprobación de tipos                                      |
| `npm test`          | Tests (carrito, tarifas de envío, paridad de traducciones) |

## Variables de entorno

### Frontend (`.env`)

| Variable                         | Descripción                                                     |
| -------------------------------- | --------------------------------------------------------------- |
| `VITE_SUPABASE_URL`              | URL del proyecto de Supabase                                    |
| `VITE_SUPABASE_PUBLISHABLE_KEY`  | Clave pública (anon) de Supabase                                |
| `VITE_SITE_URL`                  | (Opcional) URL pública del sitio, usada al compartir productos  |
| `VITE_STORE_CURRENCY`            | (Opcional) Moneda mostrada. Por defecto `CAD`                   |

### Secretos de las Edge Functions

El frontend **no** necesita `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe Checkout se crea
en el servidor (`stripe-checkout`) con `STRIPE_SECRET_KEY`.

```sh
supabase secrets set \
  STRIPE_SECRET_KEY=sk_live_... \
  STRIPE_WEBHOOK_SECRET=whsec_... \
  RESEND_API_KEY=re_... \
  RESEND_FROM_EMAIL="Yari Crochet <pedidos@tu-dominio.com>" \
  OWNER_EMAIL=yaricrochetfina@gmail.com \
  ORDER_ADMIN_SECRET=un-secreto-largo \
  SITE_URL=https://www.yaricrochet.com \
  ALLOWED_ORIGINS=https://www.yaricrochet.com \
  STORE_CURRENCY=cad
```

| Variable | Dónde | Producción |
| -------- | ----- | ---------- |
| `STRIPE_SECRET_KEY` | Secretos de Supabase (Edge Functions) | Obligatorio `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Secretos de Supabase | `whsec_...` del webhook **Live** |
| `STORE_CURRENCY` | Secretos de Supabase | `cad` |
| `SITE_URL` / `ALLOWED_ORIGINS` | Secretos de Supabase | `https://www.yaricrochet.com` |

`STORE_CURRENCY` (funciones) y `VITE_STORE_CURRENCY` (frontend) deben coincidir.
El dominio de `RESEND_FROM_EMAIL` debe estar verificado en Resend.

Si `STRIPE_SECRET_KEY` sigue siendo `sk_test_...`, Checkout abre el modo de prueba
(`cs_test_...`) y las tarjetas reales fallan en yaricrochet.com. Tras cambiar a live,
crea un webhook **nuevo** en el Dashboard de Stripe (modo Live) apuntando a
`https://<proyecto>.supabase.co/functions/v1/stripe-webhook` (evento
`checkout.session.completed`) y actualiza `STRIPE_WEBHOOK_SECRET` con su signing secret.

## Puesta en producción

1. **Migraciones:** `supabase db push` (incluye `20260124000000_fix_orders_for_stripe_checkout.sql`, que corrige el estado de los pedidos, añade `shipping_address`/`language` y recrea `decrement_stock`).
2. **Funciones:**
   ```sh
  supabase functions deploy stripe-checkout stripe-webhook get-order send-contact-email og-meta mark-order-shipped
  ```
3. **Webhook de Stripe:** crea un endpoint apuntando a
   `https://<proyecto>.supabase.co/functions/v1/stripe-webhook` con el evento `checkout.session.completed`
   y copia su *signing secret* en `STRIPE_WEBHOOK_SECRET`.
4. **Hosting del frontend:** cualquier hosting estático con *fallback* a `index.html` (SPA).
5. Prueba una compra con las tarjetas de test de Stripe antes de usar claves reales.

## Marcar un pedido como enviado

Cuando despaches un paquete, marca el pedido y el cliente recibe el correo **Pedido enviado**
(con transportista y tracking):

```sh
node scripts/mark-order-shipped.mjs <orderId> "Canada Post" "TRACKING123" "https://enlace-de-rastreo"
```

Requiere el secreto `ORDER_ADMIN_SECRET` (o `SUPABASE_SERVICE_ROLE_KEY`) en `.env.local`.
También puedes llamar a la Edge Function `mark-order-shipped` con la cabecera
`x-order-admin-secret`.

## Flujo de compra

1. El cliente añade piezas al carrito (cantidad limitada por el stock) y elige el país de envío.
2. `stripe-checkout` valida carrito y stock en la base de datos, calcula el envío con `supabase/functions/_shared/shipping.ts` (misma fuente que el frontend) y crea la sesión de Stripe.
3. Tras pagar, Stripe llama a `stripe-webhook`: crea el pedido (idempotente), sus líneas, descuenta stock y envía los correos.
4. `/payment/success` consulta `get-order` y muestra el resumen del pedido.

## Tarifas de envío

Se editan en un único archivo: `supabase/functions/_shared/shipping.ts`
(países admitidos, tarifa y plazo estimado). El frontend las importa mediante el alias `@shared`.

## Traducciones

Los textos están en `src/i18n/locales/{es,en,fr}.json`. Los tests comprueban que los tres
idiomas tienen las mismas claves y que toda clave usada con `t("...")` existe.

## Pruebas del sistema de compra (Stripe en modo test)

Los scripts de `scripts/` leen las credenciales de `.env.local` (ignorado por git):

```
SUPABASE_ACCESS_TOKEN=sbp_...
SUPABASE_DB_PASSWORD=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...      # lo genera setup-stripe-webhook.mjs
RESEND_API_KEY=re_...
```

| Script                                   | Para qué sirve                                                        |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `node scripts/check-stripe.mjs`          | Comprueba que la clave de Stripe es válida y de modo test             |
| `node scripts/setup-stripe-webhook.mjs`  | Crea el webhook en Stripe y guarda su secreto                         |
| `node scripts/e2e-purchase.mjs create`   | Crea una sesión de pago (1 producto) a través de `stripe-checkout`    |
| `node scripts/e2e-pay.mjs`               | Paga esa sesión con la tarjeta de prueba `4242 4242 4242 4242`        |
| `node scripts/e2e-purchase.mjs verify`   | Comprueba pedido, líneas, dirección y stock descontado                |
| `node scripts/e2e-replay-webhook.mjs 2`  | Reenvía el evento firmado (comprueba idempotencia y estado de correos)|
| `node scripts/send-test-email.mjs`       | Envía un correo de prueba con Resend                                  |

Tras una prueba, borra el pedido de test y repón el stock de la pieza usada.
Para producción: cambia a claves `sk_live_...`, vuelve a ejecutar la creación del webhook con la clave live
y verifica un dominio propio en Resend (`RESEND_FROM_EMAIL`).
