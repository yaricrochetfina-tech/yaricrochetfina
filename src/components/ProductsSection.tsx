import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { products } from '@/data/mockData';
import { Product, ProductStyle } from '@/types';

const styles: ProductStyle[] = ['Boho Chic', 'Hippie', 'Vintage', 'Shabby Chic', 'Traditional'];

export const ProductsSection = () => {
  const [selectedStyle, setSelectedStyle] = useState<ProductStyle | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = selectedStyle === 'all' 
    ? products 
    : products.filter(product => product.style === selectedStyle);

  return (
    <section id="colecciones" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-section-title">Nuestras Colecciones</h2>
          <p className="text-warm text-lg max-w-2xl mx-auto">
            Explora nuestras diferentes colecciones, cada una con su propio carácter y estilo único. 
            Desde el boho chic hasta los diseños tradicionales.
          </p>
        </div>

        {/* Style filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedStyle('all')}
            className={`filter-chip ${selectedStyle === 'all' ? 'active' : ''}`}
          >
            Todos
          </button>
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`filter-chip ${selectedStyle === style ? 'active' : ''}`}
            >
              {style}
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
              No hay productos disponibles en esta categoría por el momento.
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