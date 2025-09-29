import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { ShippingCalculator } from './ShippingCalculator';
import { OptimizedImage } from './ImageOptimization';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [shippingCost, setShippingCost] = useState<number>(0);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addItem(product);
    
    setTimeout(() => {
      setIsAdding(false);
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <OptimizedImage
              src={product.image}
              alt={product.name}
              thumbnailClassName="w-full h-96 object-cover rounded-lg"
              enableFullView={true}
            />
            <Badge 
              className={`absolute top-4 left-4 ${getStyleColor(product.style)}`}
            >
              {product.style}
            </Badge>
            {!product.inStock && (
              <Badge 
                variant="secondary" 
                className="absolute top-4 right-4 bg-red-500 text-white"
              >
                Agotado
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Price */}
            <div className="text-3xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Descripción</h3>
              <p className="text-warm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Materials */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Materiales</h3>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((material, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-muted-foreground"
                  >
                    {material}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Unique Piece Info and Add to Cart */}
            {product.inStock && (
              <div className="space-y-4">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2 text-primary">✨ Pieza Única e Irrepetible</h3>
                  <p className="text-warm text-sm leading-relaxed">
                    Esta pieza es única en su tipo, tejida completamente a mano por mí, Yaritza Salgado Fina. 
                    Solo está disponible la pieza que se muestra. Una vez vendida, no habrá otra igual.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    Hecho con amor y técnicas ancestrales en Montreal, Canadá
                  </p>
                </div>

                {/* Shipping Calculator */}
                <ShippingCalculator 
                  productPrice={product.price} 
                  onShippingCalculated={setShippingCost}
                />

                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">
                    Total: ${(product.price + shippingCost).toFixed(2)} CAD
                    {shippingCost > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Producto: ${product.price.toFixed(2)} + Envío: ${shippingCost.toFixed(2)}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="btn-hero"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isAdding ? 'Agregando...' : 'Comprar Pieza Única'}
                  </Button>
                </div>
              </div>
            )}

            {!product.inStock && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">
                  Este producto está temporalmente agotado. ¡Vuelve pronto para ver nuevos diseños!
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};