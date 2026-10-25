-- Correcciones necesarias para que el flujo de compra con Stripe funcione de extremo a extremo.

-- 1) El webhook de Stripe registra los pedidos pagados con estado 'paid', pero la restricción
--    original solo permitía ('pending', 'processing', 'completed', 'cancelled'), por lo que el
--    INSERT fallaba y NINGÚN pedido pagado se guardaba. Se amplía la lista de estados.
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled', 'refunded'));

-- 2) Guardar la dirección de envío y el idioma del cliente (antes la dirección solo existía en Stripe).
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS language text DEFAULT 'es';

-- 3) Evitar stock negativo y asegurar que las piezas agotadas se marquen como no disponibles.
UPDATE public.products SET stock_quantity = 1 WHERE stock_quantity IS NULL;
UPDATE public.products SET in_stock = false WHERE stock_quantity <= 0;
ALTER TABLE public.products ALTER COLUMN stock_quantity SET DEFAULT 1;
ALTER TABLE public.products ALTER COLUMN stock_quantity SET NOT NULL;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_stock_quantity_check;
ALTER TABLE public.products ADD CONSTRAINT products_stock_quantity_check CHECK (stock_quantity >= 0);

-- 4) decrement_stock: sin renombrar parámetros (p_product_id, p_quantity), idempotente en cuanto a
--    límites y sin dejar stock negativo. Solo ejecutable con la service role (Edge Functions).
CREATE OR REPLACE FUNCTION public.decrement_stock(p_product_id uuid, p_quantity integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be positive';
  END IF;

  IF p_quantity > 100 THEN
    RAISE EXCEPTION 'Quantity exceeds maximum allowed';
  END IF;

  UPDATE public.products
  SET stock_quantity = GREATEST(0, stock_quantity - p_quantity),
      in_stock = (GREATEST(0, stock_quantity - p_quantity) > 0)
  WHERE id = p_product_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.decrement_stock(uuid, integer) FROM public;
REVOKE EXECUTE ON FUNCTION public.decrement_stock(uuid, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.decrement_stock(uuid, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_stock(uuid, integer) TO service_role;
