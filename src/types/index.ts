export interface Product {
  id: string;
  name: string;
  price: number;
  style: ProductStyle;
  category: ProductCategory;
  image: string;
  description: string;
  materials: string[];
  inStock: boolean;
  /** Unidades disponibles (las piezas únicas tienen 1). */
  stockQuantity?: number;
  images?: string[];
  videoUrl?: string;
}

export type ProductStyle = 'Boho Chic' | 'Hippie' | 'Vintage' | 'Shabby Chic' | 'Traditional';

export type ProductCategory = 'Blusas' | 'Gilets' | 'Chalecos' | 'Túnicas' | 'Vestidos' | 'Abrigo' | 'Ponchos' | 'Tops';

export interface CartItem {
  product: Product;
  quantity: number;
}
