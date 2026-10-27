#!/usr/bin/env node
/**
 * Asocia los YouTube Shorts del canal @yarifina con los productos de Supabase.
 *
 *   npm run match:shorts              # simulación (no escribe)
 *   npm run match:shorts -- --apply   # actualiza youtube_short_url
 *   npm run match:shorts -- --apply --force   # sobrescribe URLs ya asignadas
 *
 * Lee .env y .env.local. Para escribir necesita SUPABASE_SERVICE_ROLE_KEY
 * o SUPABASE_ACCESS_TOKEN (Management API).
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const CHANNEL_HANDLE = 'yarifina';
const SHORTS_TAB_PARAMS = 'EgZzaG9ydHPyBgUKA5oBAA==';
const MIN_SCORE = 0.65;
const MIN_OVERLAP = 2;
const SKIP_PRODUCT_NAMES = new Set(['Chaleco Corto Vintage Azul']);

const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply');
const FORCE = args.has('--force');

const loadEnvFile = (name) => {
  try {
    return Object.fromEntries(
      readFileSync(new URL(`../${name}`, import.meta.url), 'utf8')
        .split('\n')
        .filter((line) => line.includes('=') && !line.trim().startsWith('#'))
        .map((line) => [line.slice(0, line.indexOf('=')).trim(), line.slice(line.indexOf('=') + 1).trim()])
    );
  } catch {
    return {};
  }
};

const env = { ...loadEnvFile('.env'), ...loadEnvFile('.env.local'), ...process.env };
const supabaseUrl = env.VITE_SUPABASE_URL;
const projectRef = supabaseUrl?.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
const handle = (env.YOUTUBE_HANDLE || CHANNEL_HANDLE).replace(/^@/, '');

if (!supabaseUrl) {
  console.error('Falta VITE_SUPABASE_URL en .env');
  process.exit(1);
}

const CANON = {
  blouse: 'blusa',
  tunique: 'tunica',
  gilet: 'gilet',
  chaleco: 'gilet',
  ceinture: 'fajon',
  fajon: 'fajon',
  nuancee: 'matizado',
  nuance: 'matizado',
  matizado: 'matizado',
  dentelle: 'encaje',
  encaje: 'encaje',
  franges: 'franjas',
  franjas: 'franjas',
  papillon: 'mariposa',
  mariposa: 'mariposa',
  creme: 'crema',
  crema: 'crema',
  croisee: 'cruzada',
  croise: 'cruzada',
  cruzada: 'cruzada',
  citron: 'citron',
  vert: 'verde',
  verde: 'verde',
  marine: 'marina',
  marina: 'marina',
  rayures: 'rayas',
  rayas: 'rayas',
  fleurs: 'flores',
  flores: 'flores',
  brillant: 'brillo',
  brillo: 'brillo',
  noir: 'negro',
  noire: 'negro',
  negro: 'negro',
  negra: 'negro',
  bleue: 'azul',
  bleu: 'azul',
  azul: 'azul',
  rose: 'rosa',
  rosa: 'rosa',
  longue: 'larga',
  larga: 'larga',
  manches: 'mangas',
  mangas: 'mangas',
  pointe: 'punta',
  punta: 'punta',
  rouge: 'roja',
  roja: 'roja',
  blanc: 'blanco',
  blanche: 'blanco',
  blanco: 'blanco',
  blanca: 'blanco',
  multicolore: 'multicolor',
  multicolor: 'multicolor',
  court: 'corto',
  courte: 'corto',
  corto: 'corto',
  corta: 'corto',
  mandalas: 'mandala',
  mandala: 'mandala',
  granny: 'granny',
  boho: 'boho',
  estilo: 'estilo',
  style: 'estilo',
  poncho: 'poncho',
  top: 'top',
  vestido: 'vestido',
  robe: 'vestido',
  tunica: 'tunica',
  blusa: 'blusa',
  cafe: 'cafe',
  cielo: 'cielo',
  delicada: 'delicada',
  oversized: 'oversized',
  abrigo: 'abrigo',
  beige: 'beige',
  chocolate: 'chocolate',
  floral: 'floral',
  elegante: 'elegante',
  especial: 'especial',
  vintage: 'vintage',
};

const STOP = new Set([
  'edicion',
  'unica',
  'edition',
  'unique',
  'vendido',
  'handmade',
  'fashion',
  'crochet',
  'knitting',
  'knittig',
  'knit',
  'model',
  'mode',
  'yarifina',
  'hechoamano',
  'fashionshow',
  'beauty',
  'newcollection',
  'onlineshop',
  'fashionstyle',
  'fashionweek',
  'short',
  'shorts',
  'pieza',
  'play',
  'reproducir',
  'visualizaciones',
  'con',
  'avec',
  'and',
  'the',
  'una',
  'uno',
  'des',
  'les',
  'une',
  'pour',
  'para',
]);

const stripAccents = (value) =>
  value.normalize('NFD').replace(/\p{M}+/gu, '');

const tokenize = (value) => {
  const cleaned = stripAccents(String(value || '').toLowerCase())
    .replace(/#\w+/g, ' ')
    .replace(/[^a-z0-9ñ\s-]/g, ' ');
  const tokens = [];
  for (const raw of cleaned.split(/\s+/)) {
    const mapped = CANON[raw] || raw;
    if (!mapped || mapped.length < 2 || STOP.has(mapped) || STOP.has(raw)) continue;
    tokens.push(mapped);
  }
  return tokens;
};

const scoreMatch = (productNames, shortTitle) => {
  const shortTokens = tokenize(shortTitle);
  const shortSet = new Set(shortTokens);
  const shortText = shortTokens.join(' ');
  let best = 0;
  for (const name of productNames) {
    const productTokens = tokenize(name);
    if (!productTokens.length || !shortTokens.length) continue;
    const productSet = new Set(productTokens);
    const overlap = [...productSet].filter((token) => shortSet.has(token));
    const unionSize = new Set([...productSet, ...shortSet]).size;
    const jaccard = unionSize ? overlap.length / unionSize : 0;
    const coverage = overlap.length / productSet.size;
    const productText = productTokens.join(' ');
    const productInShort = productTokens.length >= 2 && shortText.includes(productText);
    const shortInProduct = shortTokens.length >= 3 && productText.includes(shortText);
    const phrase = productInShort || shortInProduct;
    if (!phrase && overlap.length < MIN_OVERLAP) continue;
    const total = jaccard * 0.4 + coverage * 0.6 + (phrase ? 0.35 : 0);
    if (total > best) best = total;
  }
  return best;
};

const extractLockups = (node, acc = []) => {
  if (!node || typeof node !== 'object') return acc;
  if (node.shortsLockupViewModel) acc.push(node.shortsLockupViewModel);
  for (const value of Object.values(node)) {
    if (value && typeof value === 'object') extractLockups(value, acc);
  }
  return acc;
};

const shortFromLockup = (lockup) => {
  const videoId = lockup?.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId;
  const primary = lockup?.overlayMetadata?.primaryText || {};
  const title =
    primary.content ||
    primary.simpleText ||
    primary.runs?.[0]?.text ||
    lockup?.accessibilityText ||
    '';
  return videoId ? { videoId, title: String(title).replace(/\s+/g, ' ').trim() } : null;
};

const fetchJson = async (url, options) => {
  const res = await fetch(url, options);
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const detail = typeof body === 'string' ? body.slice(0, 300) : JSON.stringify(body)?.slice(0, 300);
    throw new Error(`${res.status} ${url} ${detail || ''}`.trim());
  }
  return body;
};

const resolveChannelId = async (channelHandle) => {
  const html = await fetch(`https://www.youtube.com/@${channelHandle}`, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  }).then((res) => res.text());
  const match =
    html.match(/rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[^"]+)"/) ||
    html.match(/channel_id=(UC[A-Za-z0-9_-]+)/) ||
    html.match(/"browseId":"(UC[^"]+)"/);
  if (!match) throw new Error(`No se pudo resolver el canal @${channelHandle}`);
  return match[1];
};

const fetchShorts = async (channelId) => {
  const shorts = [];
  const seen = new Set();
  let continuation;
  for (let page = 0; page < 8; page += 1) {
    const payload = {
      context: { client: { clientName: 'WEB', clientVersion: '2.20251001.00.00', hl: 'es' } },
      browseId: channelId,
      params: SHORTS_TAB_PARAMS,
      ...(continuation ? { continuation } : {}),
    };
    const data = await fetchJson('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      body: JSON.stringify(payload),
    });
    for (const lockup of extractLockups(data)) {
      const short = shortFromLockup(lockup);
      if (!short || seen.has(short.videoId)) continue;
      seen.add(short.videoId);
      shorts.push(short);
    }
    continuation = JSON.stringify(data).match(/"continuation":"([^"]+)"/)?.[1];
    if (!continuation) break;
  }
  return shorts;
};

const getServiceRoleKey = async () => {
  if (env.SUPABASE_SERVICE_ROLE_KEY) return env.SUPABASE_SERVICE_ROLE_KEY;
  if (!env.SUPABASE_ACCESS_TOKEN || !projectRef) return null;
  const keys = await fetchJson(`https://api.supabase.com/v1/projects/${projectRef}/api-keys`, {
    headers: { Authorization: `Bearer ${env.SUPABASE_ACCESS_TOKEN}` },
  });
  const service = Array.isArray(keys) ? keys.find((key) => key.name === 'service_role' || key.id === 'service_role') : null;
  return service?.api_key || null;
};

const ensureColumn = async (accessToken) => {
  if (!accessToken || !projectRef) return false;
  await fetchJson(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query:
        "ALTER TABLE public.products ADD COLUMN IF NOT EXISTS youtube_short_url text; NOTIFY pgrst, 'reload schema';",
    }),
  });
  return true;
};

const toShortUrl = (videoId) => `https://www.youtube.com/shorts/${videoId}`;

const extractVideoId = (url) => {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return trimmed.match(
    /(?:youtube\.com\/(?:embed\/|shorts\/|live\/|v\/|watch\?(?:.*&)?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  )?.[1];
};

const main = async () => {
  console.log(`Canal: @${handle}`);
  console.log(`Modo: ${APPLY ? (FORCE ? 'escribir (force)' : 'escribir') : 'simulación (añade --apply para guardar)'}\n`);

  const serviceKey = await getServiceRoleKey();
  const anonKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!anonKey && !serviceKey) {
    console.error('Falta VITE_SUPABASE_PUBLISHABLE_KEY o SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  if (APPLY) {
    if (!serviceKey) {
      console.error('Para --apply hace falta SUPABASE_SERVICE_ROLE_KEY o SUPABASE_ACCESS_TOKEN en .env.local');
      process.exit(1);
    }
    try {
      await ensureColumn(env.SUPABASE_ACCESS_TOKEN);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Columna youtube_short_url lista.\n');
    } catch (error) {
      console.warn('No se pudo asegurar la columna vía Management API:', error.message);
      console.warn('Si falla el UPDATE, aplica la migración supabase/migrations/20261027180000_add_youtube_short_url.sql\n');
    }
  }

  const supabase = createClient(supabaseUrl, serviceKey || anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, video_url, youtube_short_url')
    .order('name');
  if (productsError && /youtube_short_url/.test(productsError.message || '')) {
    const retry = await supabase.from('products').select('id, name, video_url').order('name');
    products = (retry.data || []).map((row) => ({ ...row, youtube_short_url: null }));
    productsError = retry.error;
  }
  if (productsError) throw productsError;

  const { data: translations, error: translationsError } = await supabase
    .from('product_translations')
    .select('product_id, name');
  if (translationsError) throw translationsError;

  const namesByProduct = new Map();
  for (const product of products) {
    namesByProduct.set(product.id, new Set([product.name]));
  }
  for (const row of translations || []) {
    namesByProduct.get(row.product_id)?.add(row.name);
  }

  const channelId = await resolveChannelId(handle);
  const shorts = await fetchShorts(channelId);
  console.log(`Productos: ${products.length} | Shorts en @${handle}: ${shorts.length}\n`);

  const candidates = [];
  for (const product of products) {
    if (SKIP_PRODUCT_NAMES.has(product.name)) continue;
    const names = [...(namesByProduct.get(product.id) || [product.name])];
    for (const short of shorts) {
      const score = scoreMatch(names, short.title);
      if (score >= MIN_SCORE) candidates.push({ score, product, short });
    }
  }
  candidates.sort((a, b) => b.score - a.score);

  const assignedProducts = new Set();
  const assignedVideos = new Set();
  const matches = [];
  for (const candidate of candidates) {
    if (assignedProducts.has(candidate.product.id) || assignedVideos.has(candidate.short.videoId)) continue;
    assignedProducts.add(candidate.product.id);
    assignedVideos.add(candidate.short.videoId);
    matches.push(candidate);
  }

  // Si un producto ya tiene video_url y no hubo coincidencia, se reutiliza el id.
  for (const product of products) {
    if (SKIP_PRODUCT_NAMES.has(product.name)) continue;
    if (assignedProducts.has(product.id)) continue;
    const fallbackId = extractVideoId(product.youtube_short_url) || extractVideoId(product.video_url);
    if (!fallbackId) continue;
    assignedProducts.add(product.id);
    matches.push({
      score: 1,
      product,
      short: { videoId: fallbackId, title: '(desde video_url / youtube_short_url existente)' },
      fallback: true,
    });
  }

  const updates = [];
  console.log('Coincidencias:');
  for (const { score, product, short, fallback } of matches) {
    const url = toShortUrl(short.videoId);
    const already = product.youtube_short_url;
    const skip = already && already === url;
    const blocked = already && already !== url && !FORCE;
    const action = skip ? 'igual' : blocked ? 'omitido (ya tenía otra URL; usa --force)' : APPLY ? 'actualizar' : 'pendiente';
    console.log(
      `  ${score.toFixed(2)}  ${product.name.padEnd(38)} ← ${short.title.slice(0, 64)}${fallback ? ' [respaldo]' : ''}`
    );
    console.log(`         ${url}  [${action}]`);
    if (!skip && !blocked) updates.push({ id: product.id, youtube_short_url: url });
  }

  const unmatched = products.filter((product) => !assignedProducts.has(product.id));
  if (unmatched.length) {
    console.log('\nSin Short coincidente (el botón se ocultará):');
    for (const product of unmatched) console.log(`  - ${product.name}`);
  }

  const unused = shorts.filter((short) => !assignedVideos.has(short.videoId));
  if (unused.length) {
    console.log('\nShorts sin producto:');
    for (const short of unused) console.log(`  - ${short.title} (${toShortUrl(short.videoId)})`);
  }

  if (!APPLY) {
    console.log(`\nSimulación: ${updates.length} producto(s) se actualizarían. Ejecuta:\n  npm run match:shorts -- --apply`);
    return;
  }

  if (!updates.length) {
    console.log('\nNada que actualizar.');
    return;
  }

  let ok = 0;
  for (const row of updates) {
    let error;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      ({ error } = await supabase.from('products').update({ youtube_short_url: row.youtube_short_url }).eq('id', row.id));
      if (!error || !/schema cache/.test(error.message || '')) break;
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    if (error) {
      console.error(`Error al actualizar ${row.id}:`, error.message);
      process.exitCode = 1;
    } else {
      ok += 1;
    }
  }
  console.log(`\nActualizados ${ok}/${updates.length} producto(s).`);
};

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
