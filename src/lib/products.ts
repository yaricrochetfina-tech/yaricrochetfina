import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { Product, ProductCategory, ProductStyle } from '@/types';

type ProductRow = Database['public']['Tables']['products']['Row'];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Blusas',
  'Gilets',
  'Chalecos',
  'Túnicas',
  'Vestidos',
  'Abrigo',
  'Ponchos',
  'Tops',
];

/** Convierte una fila de la tabla `products` al tipo `Product` usado por la interfaz. */
export const mapDbProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  price: Number(row.price),
  style: row.style as ProductStyle,
  category: row.category as ProductCategory,
  image: row.image,
  description: row.description,
  materials: row.materials ?? [],
  inStock: row.in_stock && (row.stock_quantity ?? 1) > 0,
  stockQuantity: row.stock_quantity ?? 1,
  images: row.images && row.images.length > 0 ? row.images : undefined,
  videoUrl: row.video_url || undefined,
  youtubeShortUrl: row.youtube_short_url || undefined,
});

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapDbProduct);
};
