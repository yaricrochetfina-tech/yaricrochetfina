-- Fix RLS policy for products - change from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;

CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
TO public
USING (true);