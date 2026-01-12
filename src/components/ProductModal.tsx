import { useTranslation } from 'react-i18next';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, X, Play, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { ShippingCalculator } from './ShippingCalculator';
import { OptimizedImage } from './ImageOptimization';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import { resolveProductImage } from '@/lib/imageResolver';
import { toast } from 'sonner';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const translatedProduct = useProductTranslation(product);
  const [isAdding, setIsAdding] = useState(false);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Stripe payment link for this product
  const stripePaymentLink = 'https://buy.stripe.com/3cI00i81t0vM6AJ2T2bfO00';

  const handleShare = async () => {
    // Use Edge Function URL for social media crawlers to get proper OG meta tags
    const ogMetaUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/og-meta?product=${product.id}&html=true`;
    const shareData = {
      title: translatedProduct.name,
      text: translatedProduct.description,
      url: ogMetaUrl,
    };

    // Try Web Share API first (mobile-friendly native share)
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // User cancelled or share failed, fallback to clipboard
        if ((error as Error).name !== 'AbortError') {
          console.log('Share failed, falling back to clipboard');
        } else {
          return; // User cancelled, don't show toast
        }
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(ogMetaUrl);
      setLinkCopied(true);
      toast.success(t('products.linkCopied'));
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast.error(t('products.copyError') || 'Error copying link');
    }
  };
  
  const displayImages = product.images && product.images.length > 0 ? product.images : [product.image];

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
            {translatedProduct.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <OptimizedImage
                src={displayImages[selectedImageIndex]}
                alt={`${translatedProduct.name} - Vista ${selectedImageIndex + 1}`}
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
                  {t('products.soldOut')}
                </Badge>
              )}
            </div>
            
            {/* Video Button - Opens in new tab */}
            {product.videoUrl && (
              <Button
                onClick={() => window.open(product.videoUrl, '_blank', 'noopener,noreferrer')}
                className="w-full btn-hero"
                variant="outline"
              >
                <Play className="h-4 w-4 mr-2" />
                {t('products.watchVideo')}
              </Button>
            )}

            {/* Share Button */}
            <Button
              variant="outline"
              onClick={handleShare}
              className="w-full text-muted-foreground hover:text-primary"
            >
              {linkCopied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  {t('products.linkCopied')}
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  {t('products.share')}
                </>
              )}
            </Button>
            
            {/* Thumbnail Gallery */}
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {displayImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 relative rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-primary shadow-lg scale-105' 
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={resolveProductImage(img)}
                      alt={`${t('products.view')} ${index + 1}`}
                      className="w-20 h-20 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                      {index === 0 ? t('products.frontView') : t('products.backView')}
                    </div>
                  </button>
                ))}
              </div>
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
              <h3 className="font-semibold text-lg mb-2">{t('products.descriptionLabel')}</h3>
              <p className="text-warm leading-relaxed">
                {translatedProduct.description}
              </p>
            </div>

            {/* Materials */}
            <div>
              <h3 className="font-semibold text-lg mb-2">{t('products.materials')}</h3>
              <div className="flex flex-wrap gap-2">
                {translatedProduct.materials.map((material, index) => (
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
                  <h3 className="font-semibold text-lg mb-2 text-primary">✨ {t('products.uniquePieceTitle')}</h3>
                  <p className="text-warm text-sm leading-relaxed">
                    {t('products.uniquePieceDescription')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    {t('products.madeIn')}
                  </p>
                </div>

                {/* Shipping Calculator */}
                <ShippingCalculator 
                  productPrice={product.price}
                  stripePaymentLink={stripePaymentLink}
                  onShippingCalculated={(cost, country) => {
                    setShippingCost(cost);
                    setSelectedCountry(country);
                  }}
                />

                {!shippingCost && (
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                    <p className="text-sm text-accent-foreground text-center">
                      👆 Selecciona tu país para calcular el envío y proceder a la compra
                    </p>
                  </div>
                )}
              </div>
            )}

            {!product.inStock && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">
                  {t('products.temporarilyOutOfStock')}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};