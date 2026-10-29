/**
 * Evita cobrar (o aparentar cobrar) con claves de prueba en el dominio de producción.
 * Las Edge Functions leen STRIPE_SECRET_KEY de los secretos de Supabase; no hay claves
 * hardcodeadas en el frontend.
 */
export const isStripeTestSecret = (secretKey: string | undefined | null): boolean =>
  Boolean(secretKey?.startsWith('sk_test_'));

/** Clasifica el secreto sin revelarlo (para diagnósticos seguros). */
export const classifyStripeSecret = (
  secretKey: string | undefined | null
): 'missing' | 'live' | 'test' | 'key_id' | 'publishable' | 'other' => {
  if (!secretKey) return 'missing';
  if (secretKey.startsWith('sk_live_')) return 'live';
  if (secretKey.startsWith('sk_test_')) return 'test';
  // Panel nuevo de Stripe: a veces se copia el ID (mk_...) en lugar del valor secreto.
  if (secretKey.startsWith('mk_')) return 'key_id';
  if (secretKey.startsWith('pk_')) return 'publishable';
  return 'other';
};

export const isProductionSiteOrigin = (origin: string | null | undefined): boolean => {
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname.toLowerCase();
    return host === 'yaricrochet.com' || host === 'www.yaricrochet.com';
  } catch {
    return false;
  }
};

/**
 * Si la petición viene de la tienda en producción y la clave secreta es de test,
 * se lanza un error claro en lugar de abrir Checkout en modo prueba.
 */
export const assertLiveStripeForProduction = (
  secretKey: string | undefined | null,
  origin: string | null | undefined
): void => {
  if (isProductionSiteOrigin(origin) && isStripeTestSecret(secretKey)) {
    throw new Error(
      'STRIPE_SECRET_KEY is still in test mode (sk_test_...). Set the live key (sk_live_...) in Supabase Edge Function secrets before accepting real payments on yaricrochet.com.'
    );
  }
};
