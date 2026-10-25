-- Fix Critical Security Issue: Remove public read access to customer data

-- Drop the overly permissive SELECT policy on orders table
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;

-- Drop the overly permissive SELECT policy on order_items table
DROP POLICY IF EXISTS "Order items are viewable with orders" ON public.order_items;

-- Note: INSERT policies remain active so orders can still be created
-- When authentication is implemented, add proper SELECT policies like:
-- CREATE POLICY "Users can view their own orders" ON public.orders
--   FOR SELECT USING (auth.uid()::text = user_id);
