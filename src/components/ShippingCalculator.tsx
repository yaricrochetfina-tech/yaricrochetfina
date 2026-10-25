import { useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCart } from '@/hooks/useCart';
import { normalizeLanguage } from '@/i18n/config';
import {
  DELIVERY_MAX_DAYS,
  DELIVERY_MIN_DAYS,
  SHIPPING_COUNTRIES,
  formatPrice,
  getCountryName,
  getShippingRate,
} from '@/lib/store';

interface ShippingCalculatorProps {
  productPrice: number;
}

/**
 * Estimación de envío. Usa las mismas tarifas que el carrito y el servidor
 * (supabase/functions/_shared/shipping.ts), por lo que el importe mostrado es el que se cobra.
 */
export const ShippingCalculator = ({ productPrice }: ShippingCalculatorProps) => {
  const { t, i18n } = useTranslation();
  const selectId = useId();
  const shippingCountry = useCart((state) => state.shippingCountry);
  const setShippingCountry = useCart((state) => state.setShippingCountry);
  const language = normalizeLanguage(i18n.resolvedLanguage || i18n.language);

  const countries = useMemo(
    () =>
      SHIPPING_COUNTRIES.map((c) => ({ ...c, name: getCountryName(c.code, language) })).sort(
        (a, b) => a.name.localeCompare(b.name, language)
      ),
    [language]
  );

  const shippingCost = getShippingRate(shippingCountry);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Truck className="h-5 w-5" aria-hidden="true" />
          {t('cart.shippingCalculator.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor={selectId} className="text-sm font-medium mb-2 block">
            {t('cart.shippingCalculator.country')}
          </label>
          <Select value={shippingCountry} onValueChange={setShippingCountry}>
            <SelectTrigger id={selectId}>
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
        </div>

        {shippingCost !== null && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{t('cart.shippingCalculator.productPrice')}</span>
              <span className="font-medium">{formatPrice(productPrice)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {t('cart.shippingCalculator.shippingTo', {
                  country: getCountryName(shippingCountry, language),
                })}
              </span>
              <span className="font-medium">{formatPrice(shippingCost)}</span>
            </div>
            <div className="border-t border-primary/20 pt-2 flex justify-between items-center">
              <span className="font-semibold text-primary">{t('cart.shippingCalculator.total')}</span>
              <span className="font-bold text-lg text-primary">
                {formatPrice(productPrice + shippingCost)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {t('cart.shippingCalculator.delivery', {
                min: DELIVERY_MIN_DAYS,
                max: DELIVERY_MAX_DAYS,
              })}
            </p>
          </div>
        )}

        <ul className="text-xs text-muted-foreground space-y-1">
          <li>📦 {t('cart.shippingCalculator.insured')}</li>
          <li>🌍 {t('cart.shippingCalculator.worldwide')}</li>
          <li>💝 {t('cart.shippingCalculator.packaging')}</li>
          <li>✉️ {t('cart.shippingCalculator.otherCountry')}</li>
        </ul>
      </CardContent>
    </Card>
  );
};
