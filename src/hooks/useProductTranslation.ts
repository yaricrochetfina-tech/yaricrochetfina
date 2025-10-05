import { useTranslation } from 'react-i18next';
import { productTranslations } from '@/data/productTranslations';
import { Product } from '@/types';

export const useProductTranslation = (product: Product) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as 'es' | 'fr' | 'en';
  
  const translatedProduct = productTranslations[currentLanguage]?.products.find(
    p => p.id === product.id
  );

  return {
    name: translatedProduct?.name || product.name,
    description: translatedProduct?.description || product.description,
    materials: translatedProduct?.materials || product.materials,
  };
};
