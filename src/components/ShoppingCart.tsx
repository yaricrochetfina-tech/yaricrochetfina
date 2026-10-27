import { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Loader2, Truck, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useCart, getMaxQuantity } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { GuestCheckoutDialog } from './GuestCheckoutDialog';
import { resolveProductImage } from '@/lib/imageResolver';
import { CheckoutError, createCheckoutSession } from '@/lib/checkout';
import { mapDbProduct } from '@/lib/products';
import {
  DELIVERY_MAX_DAYS,
  DELIVERY_MIN_DAYS,
  SHIPPING_COUNTRIES,
  formatPrice,
  getCountryName,
  getShippingRate,
} from '@/lib/store';
import { normalizeLanguage } from '@/i18n/config';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import type { CartItem } from '@/types';

const CartItemRow = ({ item }: { item: CartItem }) => {
  const { t } = useTranslation();
  const { removeItem, updateQuantity } = useCart();
  const translated = useProductTranslation(item.product);
  const max = getMaxQuantity(item.product);

  return (
    <div className="card-warm !p-4 hover:!translate-y-0">
      <div className="flex gap-4">
        <img
          src={resolveProductImage(item.product.image)}
          alt={translated.name}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-muted"
        />

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-medium text-foreground leading-snug">{translated.name}</h3>
              <Badge variant="outline" className="text-xs mt-1">
                {t(`styles.${item.product.style}`, item.product.style)}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.product.id)}
              aria-label={t('cart.remove', { name: translated.name })}
              className="h-8 w-8 p-0 flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                aria-label={t('cart.decrease')}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span
                className="font-medium w-8 text-center"
                aria-label={t('cart.quantity')}
                aria-live="polite"
              >
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                disabled={item.quantity >= max}
                aria-label={t('cart.increase')}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="font-semibold text-primary">
              {formatPrice(item.product.price * item.quantity)}
            </div>
          </div>
          {max === 1 && (
            <p className="text-xs text-muted-foreground">{t('cart.uniqueLimit')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const ShoppingCart = () => {
  const { t, i18n } = useTranslation();
  const {
    items,
    isOpen,
    closeCart,
    clearCart,
    getSubtotal,
    shippingCountry,
    setShippingCountry,
    syncWithCatalog,
  } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);

  const language = normalizeLanguage(i18n.resolvedLanguage || i18n.language);
  const subtotal = getSubtotal();
  const shippingCost = getShippingRate(shippingCountry) ?? 0;
  const total = subtotal + shippingCost;

  const countries = useMemo(
    () =>
      SHIPPING_COUNTRIES.map((c) => ({ ...c, name: getCountryName(c.code, language) })).sort(
        (a, b) => a.name.localeCompare(b.name, language)
      ),
    [language]
  );

  // Al abrir el carrito, se actualizan precios y disponibilidad con los datos reales del catálogo.
  const refreshCart = async () => {
    const ids = useCart.getState().items.map((item) => item.product.id);
    if (ids.length === 0) return;

    const { data, error } = await supabase.from('products').select('*').in('id', ids);
    if (error || !data) {
      console.error('Error refreshing cart products:', error);
      return;
    }

    const removed = syncWithCatalog(data.map(mapDbProduct));
    if (removed.length > 0) {
      toast.warning(t('cart.removedUnavailable', { names: removed.map((p) => p.name).join(', ') }));
    }
  };

  useEffect(() => {
    if (isOpen) {
      void refreshCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Si el usuario vuelve desde Stripe con el botón "atrás", se restablece el estado del botón.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setIsProcessing(false);
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  const processCheckout = async (email: string, name?: string) => {
    setIsProcessing(true);

    try {
      const url = await createCheckoutSession({
        items,
        shippingCountry,
        email,
        name,
        language,
      });
      // Redirección a Stripe: se mantiene el estado "procesando" para evitar dobles clics.
      window.location.href = url;
    } catch (error) {
      const code = error instanceof CheckoutError ? error.code : 'generic';
      toast.error(t(`cart.errors.${code}`));
      if (code === 'outOfStock' || code === 'invalidCart') {
        void refreshCart();
      }
      setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user?.email) {
      const meta = session.user.user_metadata ?? {};
      await processCheckout(session.user.email, meta.full_name || meta.name);
    } else {
      setShowGuestDialog(true);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col gap-0 p-0">
          <SheetHeader className="p-6 pb-4 pr-12 border-b border-border">
            <SheetTitle className="font-playfair text-2xl">{t('cart.title')}</SheetTitle>
            <SheetDescription className="sr-only">{t('cart.description')}</SheetDescription>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 p-6">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
              <h3 className="font-playfair text-xl">{t('cart.empty')}</h3>
              <p className="text-warm">{t('cart.emptyDescription')}</p>
              <Button asChild className="btn-hero">
                <Link to="/colecciones" onClick={closeCart}>
                  {t('hero.cta')}
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-4">
                {items.map((item) => (
                  <CartItemRow key={item.product.id} item={item} />
                ))}
              </div>

              <div className="border-t border-border p-6 space-y-4 bg-background">
                {/* País de envío */}
                <div className="space-y-2">
                  <label
                    htmlFor="cart-shipping-country"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Truck className="h-4 w-4" aria-hidden="true" />
                    {t('cart.shippingTo')}
                  </label>
                  <Select value={shippingCountry} onValueChange={setShippingCountry}>
                    <SelectTrigger id="cart-shipping-country">
                      <SelectValue placeholder={t('cart.selectCountry')} />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {t('cart.delivery', { min: DELIVERY_MIN_DAYS, max: DELIVERY_MAX_DAYS })}
                  </p>
                </div>

                {/* Resumen */}
                <dl className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">{t('cart.subtotal')}</dt>
                    <dd>{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">{t('cart.shipping')}</dt>
                    <dd>{formatPrice(shippingCost)}</dd>
                  </div>
                  <div className="flex items-center justify-between text-lg pt-2 border-t border-border">
                    <dt className="font-semibold">{t('cart.total')}</dt>
                    <dd className="font-bold text-2xl text-primary">{formatPrice(total)}</dd>
                  </div>
                </dl>

                <div className="space-y-3">
                  <Button
                    onClick={handleCheckout}
                    className="w-full btn-hero text-lg py-3"
                    disabled={isProcessing}
                  >
                    {isProcessing && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    {isProcessing ? t('common.processing') : t('cart.checkout')}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" aria-hidden="true" />
                    {t('cart.securePayment')}
                  </p>

                  <p className="text-xs text-muted-foreground text-center">
                    <Trans
                      i18nKey="cart.termsNotice"
                      components={{
                        termsLink: (
                          <Link
                            to="/terminos"
                            onClick={closeCart}
                            className="underline underline-offset-2 hover:text-primary"
                          />
                        ),
                      }}
                    />
                  </p>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={closeCart} className="flex-1">
                      {t('cart.continueShopping')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      disabled={isProcessing}
                      className="flex-1 text-destructive border-destructive hover:bg-destructive hover:text-white"
                    >
                      {t('cart.clearCart')}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <GuestCheckoutDialog
        open={showGuestDialog}
        onOpenChange={setShowGuestDialog}
        onSubmit={(email) => processCheckout(email)}
        isProcessing={isProcessing}
      />
    </>
  );
};
