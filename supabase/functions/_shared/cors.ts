// Utilidades de CORS compartidas por las Edge Functions.
//
// Orígenes permitidos = dominios por defecto del proyecto + SITE_URL + ALLOWED_ORIGINS
// (lista separada por comas). Para probar en local añade, por ejemplo:
//   supabase secrets set ALLOWED_ORIGINS=http://localhost:8080
// Para un dominio propio:
//   supabase secrets set SITE_URL=https://www.tu-dominio.com

const DEFAULT_ORIGINS = [
  'https://www.yaricrochet.com',
  'https://yaricrochet.com',
  'https://yaricrochetfina.vercel.app',
];

const normalize = (url: string): string => url.trim().replace(/\/+$/, '');

export const getAllowedOrigins = (): string[] => {
  const fromEnv = (Deno.env.get('ALLOWED_ORIGINS') || '')
    .split(',')
    .map(normalize)
    .filter(Boolean);
  const siteUrl = Deno.env.get('SITE_URL');
  return Array.from(
    new Set([...DEFAULT_ORIGINS, ...fromEnv, ...(siteUrl ? [normalize(siteUrl)] : [])])
  );
};

/** URL pública principal del sitio (para enlaces en correos y redirecciones por defecto). */
export const getSiteUrl = (): string => {
  const siteUrl = Deno.env.get('SITE_URL');
  return siteUrl ? normalize(siteUrl) : DEFAULT_ORIGINS[0];
};

export const getCorsHeaders = (origin: string | null): Record<string, string> | null => {
  if (!origin || !getAllowedOrigins().includes(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    Vary: 'Origin',
  };
};

export const jsonResponse = (
  body: unknown,
  status: number,
  corsHeaders: Record<string, string> | null,
  extraHeaders: Record<string, string> = {}
): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...(corsHeaders ?? {}), 'Content-Type': 'application/json', ...extraHeaders },
  });

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
