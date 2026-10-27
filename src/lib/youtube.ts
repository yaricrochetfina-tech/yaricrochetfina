const VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/;
const VIDEO_ID_IN_URL_RE =
  /(?:youtube\.com\/(?:embed\/|shorts\/|live\/|v\/|watch\?(?:.*&)?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

/** Extrae el identificador de 11 caracteres de una URL de YouTube (watch, embed, Short o youtu.be). */
export const extractYoutubeId = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (VIDEO_ID_RE.test(trimmed)) return trimmed;
  return trimmed.match(VIDEO_ID_IN_URL_RE)?.[1];
};

/** Normaliza cualquier URL de YouTube a `https://www.youtube.com/shorts/<id>`. */
export const toYoutubeShortUrl = (url?: string | null): string | undefined => {
  const id = extractYoutubeId(url);
  return id ? `https://www.youtube.com/shorts/${id}` : undefined;
};

/** Embed del Short para reproducirlo en la tienda, sin salir a YouTube. */
export const toYoutubeEmbedSrc = (url?: string | null): string | undefined => {
  const id = extractYoutubeId(url);
  if (!id) return undefined;
  const params = new URLSearchParams({
    autoplay: '1',
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
    loop: '1',
    playlist: id,
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
};

const PRODUCTS_WITHOUT_SHORT = new Set(['Chaleco Corto Vintage Azul']);

/** Prefiere `youtubeShortUrl` y, si no hay, reutiliza `videoUrl` (p. ej. un embed antiguo). */
export const getProductShortUrl = (product: {
  name?: string | null;
  youtubeShortUrl?: string | null;
  videoUrl?: string | null;
}): string | undefined => {
  if (product.name && PRODUCTS_WITHOUT_SHORT.has(product.name.trim())) return undefined;
  return toYoutubeShortUrl(product.youtubeShortUrl) || toYoutubeShortUrl(product.videoUrl);
};
