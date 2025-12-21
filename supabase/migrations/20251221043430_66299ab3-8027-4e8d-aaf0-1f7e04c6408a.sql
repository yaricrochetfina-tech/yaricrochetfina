-- Update decrement_stock function to add caller validation
-- This function should only be called from the edge functions with service role
CREATE OR REPLACE FUNCTION public.decrement_stock(p_product_id uuid, p_quantity integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate inputs
  IF p_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be positive';
  END IF;
  
  IF p_quantity > 100 THEN
    RAISE EXCEPTION 'Quantity exceeds maximum allowed';
  END IF;

  -- Decrement stock quantity atomically
  UPDATE products
  SET stock_quantity = GREATEST(0, stock_quantity - p_quantity)
  WHERE id = p_product_id;
  
  -- Mark as out of stock if quantity reaches 0 or below
  UPDATE products
  SET in_stock = false
  WHERE id = p_product_id
  AND stock_quantity <= 0;
END;
$$;

-- Revoke execute from public and anon, only allow service_role
REVOKE EXECUTE ON FUNCTION public.decrement_stock(uuid, integer) FROM public;
REVOKE EXECUTE ON FUNCTION public.decrement_stock(uuid, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.decrement_stock(uuid, integer) FROM authenticated;

-- Grant only to service_role (used by edge functions)
GRANT EXECUTE ON FUNCTION public.decrement_stock(uuid, integer) TO service_role;

-- Add comment documenting the security requirement
COMMENT ON FUNCTION public.decrement_stock IS 'Decrements product stock. SECURITY DEFINER - Only callable by service_role (edge functions). Input validation enforced.';