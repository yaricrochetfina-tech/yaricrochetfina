import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { normalizeLanguage } from '@/i18n/config';
import es from '@/i18n/locales/es.json';

// Los productos se guardan en español en la base de datos. Para los materiales,
// si no existe una traducción en `product_translations`, se traducen mediante
// el diccionario `productData.materials` (clave inversa a partir del texto en español).
const materialKeyBySpanish: Record<string, string> = Object.fromEntries(
  Object.entries(es.productData.materials).map(([key, value]) => [value.toLowerCase(), key])
);

export const useProductTranslation = (product: Product) => {
  const { i18n, t } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage || i18n.language);

  const { data: translation } = useQuery({
    queryKey: ['product-translation', product.id, language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_translations')
        .select('name, description, materials')
        .eq('product_id', product.id)
        .eq('language', language)
        .maybeSingle();

      if (error) {
        console.error('Error fetching translation:', error);
        return null;
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
    // El español es el idioma original del catálogo: no hace falta consultar traducciones.
    enabled: !!product.id && language !== 'es',
  });

  const fallbackMaterials =
    language === 'es'
      ? product.materials
      : product.materials.map((material) => {
          const key = materialKeyBySpanish[material.trim().toLowerCase()];
          return key ? t(`productData.materials.${key}`) : material;
        });

  return {
    name: translation?.name || product.name,
    description: translation?.description || product.description,
    materials: translation?.materials?.length ? translation.materials : fallbackMaterials,
  };
};
