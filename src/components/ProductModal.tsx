import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Play, Share2, Check, Zap } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ShippingCalculator } from './ShippingCalculator';
import { OptimizedImage } from './ImageOptimization';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import { useAddToCart } from '@/hooks/useAddToCart';
import { useShareProduct } from '@/hooks/useShareProduct';
import { resolveProductImage } from '@/lib/imageResolver';
import { getStyleBadgeColor } from '@/lib/productStyles';
import { formatPrice } from '@/lib/store';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

/** Los vídeos se guardan como URL de incrustación (/embed/); para abrirlos en otra pestaña usamos la URL de visualización. */
const toWatchUrl = (url: string) => url.replace('youtube.com/embed/', 'youtube.com/watch?v=');

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const { t } = useTranslation();
  const addToCart = useAddToCart();
  const addItem = useCart((state) => state.addItem);
  const openCart = useCart((state) => state.openCart);
  const translatedProduct = useProductTranslation(product);
  const { share, linkCopied } = useShareProduct(
    product.id,
    translatedProduct.name,
    translatedProduct.description
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const displayImages =
    product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    if (addToCart(product, translatedProduct.name)) {
      onClose();
    }
  };

  const handleBuyNow = () => {
    // "Comprar ahora": añade la pieza (si ya estaba en el carrito, se mantiene) y abre el carrito para pagar.
    if (addItem(product) !== 'unavailable') {
      onClose();
      openCart();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl pr-6">{translatedProduct.name}</DialogTitle>
          <DialogDescription className="sr-only">{translatedProduct.description}</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Galería */}
          <div className="space-y-4 min-w-0">
            <div className="relative">
              <OptimizedImage
                src={displayImages[selectedImageIndex]}
                alt={t('products.imageAlt', {
                  name: translatedProduct.name,
                  index: selectedImageIndex + 1,
                })}
                thumbnailClassName="w-full h-96 object-cover rounded-lg"
                enableFullView={true}
              />
              <Badge
                className={`absolute top-4 left-4 pointer-events-none ${getStyleBadgeColor(product.style)}`}
              >
                {t(`styles.${product.style}`, product.style)}
              </Badge>
              {!product.inStock && (
                <Badge
                  variant="secondary"
                  className="absolute top-4 right-4 bg-red-500 text-white pointer-events-none"
                >
                  {t('products.soldOut')}
                </Badge>
              )}
            </div>

            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {displayImages.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    aria-label={t('products.imageView', { index: index + 1 })}
                    aria-pressed={selectedImageIndex === index}
                    className={`flex-shrink-0 relative rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-primary shadow-lg'
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={resolveProductImage(img)}
                      alt=""
                      className="w-20 h-20 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                      {t('products.imageView', { index: index + 1 })}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.videoUrl && (
                <Button
                  onClick={() =>
                    window.open(toWatchUrl(product.videoUrl!), '_blank', 'noopener,noreferrer')
                  }
                  variant="outline"
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" aria-hidden="true" />
                  {t('products.watchVideo')}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={share}
                className={`w-full text-muted-foreground hover:text-primary ${
                  product.videoUrl ? '' : 'sm:col-span-2'
                }`}
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

          {/* Detalles */}
          <div className="space-y-6 min-w-0">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                {t(`categories.${product.category}`, product.category)}
              </div>
              <div className="text-3xl font-bold text-primary">{formatPrice(product.price)}</div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">{t('products.descriptionLabel')}</h3>
              <p className="text-warm leading-relaxed">{translatedProduct.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">{t('products.materials')}</h3>
              <div className="flex flex-wrap gap-2">
                {translatedProduct.materials.map((material, index) => (
                  <Badge key={index} variant="outline" className="text-muted-foreground">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>

            {product.inStock ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button onClick={handleAddToCart} variant="outline" size="lg" className="w-full">
                    <ShoppingCart className="h-5 w-5 mr-2" aria-hidden="true" />
                    {t('products.addToCart')}
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    size="lg"
                    className="w-full btn-hero !px-4 !py-2 hover:!scale-100"
                  >
                    <Zap className="h-5 w-5 mr-2" aria-hidden="true" />
                    {t('products.buy')}
                  </Button>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2 text-primary">
                    ✨ {t('products.uniquePieceTitle')}
                  </h3>
                  <p className="text-warm text-sm leading-relaxed">
                    {t('products.uniquePieceDescription')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 italic">{t('products.madeIn')}</p>
                </div>

                <ShippingCalculator productPrice={product.price} />
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">{t('products.temporarilyOutOfStock')}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
