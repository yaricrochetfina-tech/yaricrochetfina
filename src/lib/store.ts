import {
  DELIVERY_MAX_DAYS,
  DELIVERY_MIN_DAYS,
  SHIPPING_COUNTRIES,
  getShippingRate,
  isShippingCountry,
  DEFAULT_SHIPPING_COUNTRY,
} from '@shared/shipping';
import type { ShippingCountryCode } from '@shared/shipping';

export {
  DELIVERY_MAX_DAYS,
  DELIVERY_MIN_DAYS,
  SHIPPING_COUNTRIES,
  getShippingRate,
  isShippingCountry,
  DEFAULT_SHIPPING_COUNTRY,
};
export type { ShippingCountryCode };

/** Moneda en la que cobra Stripe (código ISO 4217 en mayúsculas). */
export const CURRENCY = ((import.meta.env.VITE_STORE_CURRENCY as string | undefined) || 'USD').toUpperCase();

/** URL pública del sitio para compartir enlaces. */
export const getSiteUrl = (): string =>
  ((import.meta.env.VITE_SITE_URL as string | undefined) || window.location.origin).replace(/\/$/, '');

/** Formatea un importe, p. ej. "$35.00 USD". */
export const formatPrice = (amount: number): string => `$${Number(amount || 0).toFixed(2)} ${CURRENCY}`;

/** Nombre localizado del país a partir de su código ISO (usa Intl, no requiere traducciones manuales). */
export const getCountryName = (code: string, language: string): string => {
  try {
    return new Intl.DisplayNames([language], { type: 'region' }).of(code) || code;
  } catch {
    return code;
  }
};

/** Correo de contacto de la tienda. */
export const CONTACT_EMAIL = 'yaricrochetfina@gmail.com';
