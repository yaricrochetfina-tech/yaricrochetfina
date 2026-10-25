-- Create storage bucket for OG images (product previews for social sharing)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'og-images', 
  'og-images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access to OG images
CREATE POLICY "OG images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'og-images');

-- Allow admins to upload OG images
CREATE POLICY "Admins can upload OG images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'og-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update OG images
CREATE POLICY "Admins can update OG images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'og-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete OG images
CREATE POLICY "Admins can delete OG images"
ON storage.objects FOR DELETE
USING (bucket_id = 'og-images' AND has_role(auth.uid(), 'admin'::app_role));