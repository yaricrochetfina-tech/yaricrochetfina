import { useCart } from '@/hooks/useCart';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export const ShoppingCart = () => {
  const { t } = useTranslation();
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal, clearCart } = useCart();

  const handleCheckout = () => {
    alert('¡Funcionalidad de checkout próximamente! Gracias por tu interés en nuestros productos artesanales.');
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-playfair text-2xl">
            {t('cart.title')}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <h3 className="font-playfair text-xl">{t('cart.empty')}</h3>
              <p className="text-warm">
                {t('products.description')}
              </p>
              <Button onClick={closeCart} className="btn-hero">
                {t('hero.cta')}
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 space-y-4 py-6 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="card-warm">
                    <div className="flex space-x-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">
                              {item.product.name}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {item.product.style}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.product.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="font-semibold text-primary">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold">{t('cart.total')}:</span>
                  <span className="font-bold text-2xl text-primary">
                    ${getTotal().toFixed(2)}
                  </span>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full btn-hero text-lg py-3"
                  >
                    {t('cart.checkout')}
                  </Button>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={closeCart}
                      className="flex-1"
                    >
                      {t('cart.continueShopping')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="flex-1 text-destructive border-destructive hover:bg-destructive hover:text-white"
                    >
                      {t('cart.clearCart')}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};