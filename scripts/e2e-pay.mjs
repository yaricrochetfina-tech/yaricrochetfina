// Completa el pago de la sesión creada por `e2e-purchase.mjs create` usando Chrome
// (Stripe en modo test, tarjeta 4242 4242 4242 4242).
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';

const st = JSON.parse(readFileSync('/tmp/e2e-state.json', 'utf8'));
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: 'es-ES' });

await page.goto(st.url, { waitUntil: 'domcontentloaded' });
await page.locator('#shippingName').waitFor({ timeout: 30000 });
console.log('Página de pago:', await page.title());

await page.locator('#shippingName').fill('Cliente de Prueba');
await page.getByRole('button', { name: /dirección de forma manual/i }).first().click();
await page.locator('#shippingAddressLine1').fill('1000 Rue Sainte-Catherine Est');
await page.locator('#shippingLocality').fill('Montreal');
await page.locator('select[name="shippingAdministrativeArea"]').selectOption({ label: 'Quebec' }).catch(async () => {
  await page.locator('select[name="shippingAdministrativeArea"]').selectOption({ index: 1 });
});
await page.locator('#shippingPostalCode').fill('H2L 2E3');
await page.locator('#phoneNumber').fill('5145551234');

await page.locator('#cardNumber').fill('4242424242424242');
await page.locator('#cardExpiry').fill('1230');
await page.locator('#cardCvc').fill('123');
await page.screenshot({ path: '/tmp/e2e-checkout-filled.png', fullPage: true });

await page.getByRole('button', { name: /^Pagar/ }).click();
await page.waitForURL(/yaricrochet\.com\/payment\/success|localhost:8080\/payment\/success/, { timeout: 60000 }).catch(() => {});
console.log('URL final:', page.url().replace(/session_id=.*/, 'session_id=…'));
await page.screenshot({ path: '/tmp/e2e-after-pay.png', fullPage: true });
await browser.close();
