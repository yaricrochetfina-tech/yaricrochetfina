-- Datos de envío / tracking para notificar al cliente cuando el pedido sale.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tracking_carrier text,
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS tracking_url text,
  ADD COLUMN IF NOT EXISTS shipped_at timestamptz;

COMMENT ON COLUMN public.orders.tracking_carrier IS 'Empresa de transporte (Canada Post, UPS, etc.)';
COMMENT ON COLUMN public.orders.tracking_number IS 'Número de seguimiento del envío';
COMMENT ON COLUMN public.orders.tracking_url IS 'Enlace opcional de rastreo del transportista';
COMMENT ON COLUMN public.orders.shipped_at IS 'Momento en que se marcó el pedido como enviado';
