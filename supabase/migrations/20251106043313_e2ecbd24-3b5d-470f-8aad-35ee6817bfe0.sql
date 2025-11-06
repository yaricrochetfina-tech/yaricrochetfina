-- Create product translations table
CREATE TABLE IF NOT EXISTS public.product_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('es', 'fr', 'en')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  materials TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(product_id, language)
);

-- Enable RLS
ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Product translations are viewable by everyone"
  ON public.product_translations FOR SELECT
  USING (true);

-- Admin-only write access
CREATE POLICY "Admins can insert translations"
  ON public.product_translations FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update translations"
  ON public.product_translations FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete translations"
  ON public.product_translations FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for performance
CREATE INDEX idx_product_translations_lookup 
  ON public.product_translations(product_id, language);

-- Create trigger for updated_at
CREATE TRIGGER update_product_translations_updated_at
  BEFORE UPDATE ON public.product_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();