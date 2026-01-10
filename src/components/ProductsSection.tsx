import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductCategory } from '@/types';
import { toast } from 'sonner';

const categories: ProductCategory[] = ['Blusas', 'Gilets', 'Chalecos', 'Túnicas', 'Vestidos'];

export const ProductsSection = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          // Map database schema to Product type
          const mappedProducts: Product[] = data.map(dbProduct => ({
            id: dbProduct.id,
            name: dbProduct.name,
            price: Number(dbProduct.price),
            style: dbProduct.style as Product['style'],
            category: dbProduct.category as ProductCategory,
            image: dbProduct.image,
            description: dbProduct.description,
            materials: dbProduct.materials,
            inStock: dbProduct.in_stock,
            images: dbProduct.images || undefined,
            videoUrl: dbProduct.video_url || undefined,
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error(t('products.errorLoading') || 'Error loading products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [t]);

  // Open product modal from URL parameter
  useEffect(() => {
    const productId = searchParams.get('product');
    if (productId && products.length > 0) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        // Scroll to products section
        document.getElementById('colecciones')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchParams, products]);

  // Handle modal close - clear URL parameter
  const handleCloseModal = () => {
    setSelectedProduct(null);
    // Remove product parameter from URL without page reload
    searchParams.delete('product');
    setSearchParams(searchParams, { replace: true });
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    return categoryMatch;
  });

  return (
    <section id="colecciones" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-section-title">{t('products.title')}</h2>
          <p className="text-warm text-lg max-w-2xl mx-auto">
            {t('products.description')}
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
          >
            {t('products.allCategories')}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`filter-chip ${selectedCategory === category ? 'active' : ''}`}
            >
              {t(`categories.${category}`)}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-warm text-lg">{t('products.loading') || 'Loading products...'}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={setSelectedProduct}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-warm text-lg">
                  {t('products.noProducts')}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
};