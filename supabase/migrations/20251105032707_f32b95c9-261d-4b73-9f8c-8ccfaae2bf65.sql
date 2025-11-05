-- Add stock quantity tracking to products table
ALTER TABLE products ADD COLUMN stock_quantity integer DEFAULT 1;

-- Create function to decrement stock after purchases
CREATE OR REPLACE FUNCTION decrement_stock(
  p_product_id uuid,
  p_quantity integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Decrement stock quantity
  UPDATE products
  SET stock_quantity = stock_quantity - p_quantity
  WHERE id = p_product_id;
  
  -- Mark as out of stock if quantity reaches 0 or below
  UPDATE products
  SET in_stock = false
  WHERE id = p_product_id
  AND stock_quantity <= 0;
END;
$$;