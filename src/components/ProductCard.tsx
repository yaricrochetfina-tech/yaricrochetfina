import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Eye, Share2, Check } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from './ImageOptimization';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import { useAddToCart } from '@/hooks/useAddToCart';
import { useShareProduct } from '@/hooks/useShareProduct';
import { getStyleBadgeColor } from '@/lib/productStyles';
import { formatPrice } from '@/lib/store';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const { t } = useTranslation();
  const addToCart = useAddToCart();
  const translatedProduct = useProductTranslation(product);
  const { share, linkCopied } = useShareProduct(
    product.id,
    translatedProduct.name,
    translatedProduct.description
  );
  const [isAdding, setIsAdding] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, translatedProduct.name);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <article className="card-product group flex flex-col" aria-label={translatedProduct.name}>
      {/* Imagen: al pulsarla se abre el detalle del producto (también en móvil) */}
      <div className="relative overflow-hidden h-64 bg-muted">
        <button
          type="button"
          onClick={() => onViewDetails(product)}
          className="block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          aria-label={`${t('products.viewDetails')}: ${translatedProduct.name}`}
        >
          <OptimizedImage
            src={product.image}
            alt={translatedProduct.name}
            thumbnailClassName="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            enableFullView={false}
          />
        </button>

        <Badge
          className={`absolute top-3 left-3 pointer-events-none ${getStyleBadgeColor(product.style)}`}
        >
          {t(`styles.${product.style}`, product.style)}
        </Badge>

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
            <Badge variant="secondary" className="bg-red-500 text-white">
              {t('products.soldOut')}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
          {t(`categories.${product.category}`, product.category)}
        </div>
        <h3 className="font-playfair text-xl font-semibold mb-2 text-foreground">
          {translatedProduct.name}
        </h3>

        <p className="text-warm text-sm mb-4 line-clamp-2">{translatedProduct.description}</p>

        <div className="mt-auto space-y-4">
          <div className="text-2xl font-bold text-primary">{formatPrice(product.price)}</div>

          <div className="flex flex-wrap gap-1">
            {translatedProduct.materials.slice(0, 2).map((material, index) => (
              <Badge key={index} variant="outline" className="text-xs text-muted-foreground">
                {material}
              </Badge>
            ))}
            {translatedProduct.materials.length > 2 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{translatedProduct.materials.length - 2} {t('products.more')}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(product)}>
              <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
              {t('products.view')}
            </Button>
            {product.inStock ? (
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="btn-hero !px-3 !py-2 hover:!scale-100"
              >
                <ShoppingCart className="h-4 w-4 mr-1" aria-hidden="true" />
                {isAdding ? t('products.adding') : t('products.addToCart')}
              </Button>
            ) : (
              <Button size="sm" disabled>
                {t('products.soldOut')}
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={share}
            className="w-full text-muted-foreground hover:text-primary"
          >
            {linkCopied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-600" aria-hidden="true" />
                {t('products.linkCopied')}
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                {t('products.share')}
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
};
