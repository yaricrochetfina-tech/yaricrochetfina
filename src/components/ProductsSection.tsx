import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { products } from '@/data/mockData';
import { Product, ProductStyle, ProductCategory } from '@/types';

const styles: ProductStyle[] = ['Boho Chic', 'Hippie', 'Vintage', 'Shabby Chic', 'Traditional'];
const categories: ProductCategory[] = ['Blusas', 'Gilets', 'Chalecos', 'Túnicas', 'Vestidos'];

export const ProductsSection = () => {
  const { t } = useTranslation();
  const [selectedStyle, setSelectedStyle] = useState<ProductStyle | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product => {
    const styleMatch = selectedStyle === 'all' || product.style === selectedStyle;
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    return styleMatch && categoryMatch;
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
        <div className="flex flex-wrap justify-center gap-3 mb-6">
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

        {/* Style filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedStyle('all')}
            className={`filter-chip ${selectedStyle === 'all' ? 'active' : ''}`}
          >
            {t('products.allStyles')}
          </button>
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`filter-chip ${selectedStyle === style ? 'active' : ''}`}
            >
              {t(`styles.${style}`)}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={setSelectedProduct}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-warm text-lg">
              {t('products.noProducts')}
            </p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};