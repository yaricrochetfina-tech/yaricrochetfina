import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { fetchProducts, PRODUCT_CATEGORIES } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Product, ProductCategory } from '@/types';

const isProductCategory = (value: string | null): value is ProductCategory =>
  !!value && PRODUCT_CATEGORIES.includes(value as ProductCategory);

export const ProductsSection = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaParam = searchParams.get('categoria');
  const categoryFromUrl: ProductCategory | 'all' = isProductCategory(categoriaParam)
    ? categoriaParam
    : 'all';
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(categoryFromUrl);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60,
  });

  // Abre el detalle de un producto a partir de ?product=<id> (enlaces compartidos).
  const productParam = searchParams.get('product');
  useEffect(() => {
    if (!productParam || products.length === 0) return;
    const product = products.find((p) => p.id === productParam);
    if (product) {
      setSelectedProduct(product);
      document.getElementById('colecciones')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [productParam, products]);

  const handleCloseModal = () => {
    setSelectedProduct(null);
    if (searchParams.has('product')) {
      const next = new URLSearchParams(searchParams);
      next.delete('product');
      setSearchParams(next, { replace: true });
    }
  };

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) => selectedCategory === 'all' || product.category === selectedCategory
      ),
    [products, selectedCategory]
  );

  // Solo se muestran las categorías que tienen productos.
  const availableCategories = useMemo(
    () => PRODUCT_CATEGORIES.filter((category) => products.some((p) => p.category === category)),
    [products]
  );

  const selectCategory = (category: ProductCategory | 'all') => {
    setSelectedCategory(category);
    const next = new URLSearchParams(searchParams);
    if (category === 'all') next.delete('categoria');
    else next.set('categoria', category);
    setSearchParams(next, { replace: true });
  };

  return (
    <section id="colecciones" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-section-title">{t('products.title')}</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12" role="group" aria-label={t('products.title')}>
          <button
            type="button"
            onClick={() => selectCategory('all')}
            aria-pressed={selectedCategory === 'all'}
            className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
          >
            {t('products.allCategories')}
          </button>
          {availableCategories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => selectCategory(category)}
              aria-pressed={selectedCategory === category}
              className={`filter-chip ${selectedCategory === category ? 'active' : ''}`}
            >
              {t(`categories.${category}`)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-12 text-warm text-lg" role="status">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            {t('products.loading')}
          </div>
        ) : isError ? (
          <div className="text-center py-12 space-y-4" role="alert">
            <p className="text-warm text-lg">{t('products.errorLoading')}</p>
            <Button variant="outline" onClick={() => refetch()}>
              {t('common.tryAgain')}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onViewDetails={setSelectedProduct} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-warm text-lg">{t('products.noProducts')}</p>
              </div>
            )}
          </>
        )}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={handleCloseModal} />
      )}
    </section>
  );
};
