-- Reseñas reales de clientas, con foto opcional de la prenda.
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  comment text NOT NULL,
  photo_url text,
  rating smallint NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reviews_author_name_len CHECK (char_length(trim(author_name)) BETWEEN 2 AND 80),
  CONSTRAINT reviews_comment_len CHECK (char_length(trim(comment)) BETWEEN 10 AND 600)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create reviews"
  ON public.reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can delete reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews (created_at DESC);

-- Fotos de reseñas (lectura pública, subida anónima limitada).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Review photos are publicly readable" ON storage.objects;
CREATE POLICY "Review photos are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-photos');

DROP POLICY IF EXISTS "Anyone can upload review photos" ON storage.objects;
CREATE POLICY "Anyone can upload review photos"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'review-photos');

DROP POLICY IF EXISTS "Admins can delete review photos" ON storage.objects;
CREATE POLICY "Admins can delete review photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'review-photos' AND public.has_role(auth.uid(), 'admin'::app_role));
