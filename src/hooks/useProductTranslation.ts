import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

export const useProductTranslation = (product: Product) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as 'es' | 'fr' | 'en';
  
  const { data: translation } = useQuery({
    queryKey: ['product-translation', product.id, currentLanguage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_translations')
        .select('name, description, materials')
        .eq('product_id', product.id)
        .eq('language', currentLanguage)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching translation:', error);
        return null;
      }
      
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    enabled: !!product.id, // Only fetch if product has an ID
  });

  return {
    name: translation?.name || product.name,
    description: translation?.description || product.description,
    materials: translation?.materials || product.materials,
  };
};
