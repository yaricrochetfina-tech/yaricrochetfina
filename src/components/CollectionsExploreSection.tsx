import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, PRODUCT_CATEGORIES } from '@/lib/products';
import type { ProductCategory } from '@/types';

const collectionsPath = (category?: ProductCategory) =>
  category ? `/colecciones?categoria=${encodeURIComponent(category)}` : '/colecciones';

export const CollectionsExploreSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60,
  });

  const availableCategories = useMemo(
    () => PRODUCT_CATEGORIES.filter((category) => products.some((product) => product.category === category)),
    [products]
  );

  const goToCollections = (category?: ProductCategory) => {
    navigate(collectionsPath(category));
  };

  return (
    <section id="colecciones" className="bg-background py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center animate-fade-in-up">
          <h2 className="text-section-title">{t('products.title')}</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3" role="group" aria-label={t('products.title')}>
          <button type="button" onClick={() => goToCollections()} className="filter-chip active">
            {t('products.allCategories')}
          </button>
          {availableCategories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => goToCollections(category)}
              className="filter-chip"
            >
              {t(`categories.${category}`)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
