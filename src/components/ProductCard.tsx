import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addItem(product);
    
    // Add a small delay for better UX
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const getStyleColor = (style: string) => {
    const colors = {
      'Boho Chic': 'bg-primary/10 text-primary',
      'Hippie': 'bg-accent/10 text-accent',
      'Vintage': 'bg-secondary/10 text-secondary',
      'Shabby Chic': 'bg-pink-100 text-pink-700',
      'Traditional': 'bg-amber-100 text-amber-700',
    };
    return colors[style as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="card-product group">
      {/* Image */}
      <div className="relative overflow-hidden h-64 bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Style badge */}
        <Badge 
          className={`absolute top-3 left-3 ${getStyleColor(product.style)}`}
        >
          {product.style}
        </Badge>

        {/* Stock status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-red-500 text-white">
              Agotado
            </Badge>
          </div>
        )}

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onViewDetails(product)}
              className="bg-white/90 hover:bg-white text-foreground"
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Button>
            {product.inStock && (
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="btn-hero"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {isAdding ? 'Agregando...' : 'Comprar'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Product info */}
      <div className="p-6">
        <h3 className="font-playfair text-xl font-semibold mb-2 text-foreground">
          {product.name}
        </h3>
        
        <p className="text-warm text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </div>
          
            {product.inStock && (
              <Button
                onClick={handleAddToCart}
                disabled={isAdding}
                size="sm"
                className="btn-outline-warm"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {isAdding ? 'Agregando...' : 'Pieza Única'}
              </Button>
            )}
        </div>

        {/* Materials */}
        <div className="mt-4 flex flex-wrap gap-1">
          {product.materials.slice(0, 2).map((material, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs text-muted-foreground"
            >
              {material}
            </Badge>
          ))}
          {product.materials.length > 2 && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              +{product.materials.length - 2} más
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};