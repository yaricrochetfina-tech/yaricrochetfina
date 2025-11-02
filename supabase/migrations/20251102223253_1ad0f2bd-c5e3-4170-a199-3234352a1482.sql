-- CRITICAL SECURITY FIX: Remove policies that allow anyone to create orders
-- This prevents price manipulation and fraud

DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;

-- Orders and order_items can now ONLY be created by Edge Functions using service role key
-- This ensures all prices are validated server-side and payments are verified