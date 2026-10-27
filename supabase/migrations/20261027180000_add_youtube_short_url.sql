-- Enlace al YouTube Short de cada pieza (se abre en una pestaña nueva desde la tienda).
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS youtube_short_url text;

COMMENT ON COLUMN public.products.youtube_short_url IS
  'URL del YouTube Short asociado a la pieza; si es nulo, la tienda oculta el botón.';
