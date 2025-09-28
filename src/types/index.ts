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
}

export type ProductStyle = 'Boho Chic' | 'Hippie' | 'Vintage' | 'Shabby Chic' | 'Traditional';

export type ProductCategory = 'Blusas' | 'Gilets';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  message: string;
  rating: number;
  style: ProductStyle;
}

export interface ArtisanProcess {
  step: number;
  title: string;
  description: string;
  icon: string;
}