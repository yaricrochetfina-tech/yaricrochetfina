-- Add RLS policy for customers to view their own orders by email
-- This allows authenticated users to see orders matching their verified email

CREATE POLICY "Customers can view own orders"
ON orders FOR SELECT
TO authenticated
USING (
  customer_email = (auth.jwt() ->> 'email')
);

-- Also add policy for customers to view their own order items
CREATE POLICY "Customers can view own order items"
ON order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.customer_email = (auth.jwt() ->> 'email')
  )
);