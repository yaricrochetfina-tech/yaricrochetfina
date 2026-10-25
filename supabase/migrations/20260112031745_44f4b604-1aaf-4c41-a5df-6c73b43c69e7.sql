-- Fix PUBLIC_DATA_EXPOSURE: Orders exposed via email matching
-- Solution: Use access tokens instead of email-based RLS for customer order access

-- 1. Add access_token column to orders table for secure order access
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS access_token TEXT UNIQUE DEFAULT gen_random_uuid()::text;

-- 2. Create index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_orders_access_token ON public.orders(access_token);

-- 3. Drop the vulnerable email-based policy
DROP POLICY IF EXISTS "Customers can view own orders" ON public.orders;

-- 4. Drop the vulnerable email-based policy on order_items
DROP POLICY IF EXISTS "Customers can view own order items" ON public.order_items;

-- Note: Admin policies remain intact
-- Customers will now access their orders via access_token through an edge function
-- The access_token will be sent in the order confirmation email