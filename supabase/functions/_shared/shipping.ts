// Fuente única de verdad para las tarifas de envío.
//
// Este archivo NO tiene dependencias para poder ser importado tanto por las
// Edge Functions (Deno) como por el frontend (Vite, alias "@shared/shipping").
// Así, el importe que ve el cliente en el carrito es exactamente el que
// cobra Stripe.
//
// Tarifas en unidades de la moneda de la tienda, desde Montreal (Canadá).
export const SHIPPING_COUNTRIES = [
  { code: 'CA', rate: 15 },
  { code: 'US', rate: 25 },
  { code: 'MX', rate: 30 },
  { code: 'GB', rate: 35 },
  { code: 'FR', rate: 35 },
  { code: 'DE', rate: 35 },
  { code: 'ES', rate: 35 },
  { code: 'IT', rate: 35 },
  { code: 'BR', rate: 40 },
  { code: 'AR', rate: 40 },
  { code: 'AU', rate: 45 },
  { code: 'JP', rate: 45 },
] as const;

export type ShippingCountryCode = (typeof SHIPPING_COUNTRIES)[number]['code'];

export const SHIPPING_COUNTRY_CODES = SHIPPING_COUNTRIES.map((c) => c.code) as [
  ShippingCountryCode,
  ...ShippingCountryCode[],
];

export const DEFAULT_SHIPPING_COUNTRY: ShippingCountryCode = 'CA';

// Plazo estimado de entrega (días hábiles).
export const DELIVERY_MIN_DAYS = 7;
export const DELIVERY_MAX_DAYS = 14;

export const isShippingCountry = (code: unknown): code is ShippingCountryCode =>
  typeof code === 'string' && SHIPPING_COUNTRIES.some((c) => c.code === code);

export const getShippingRate = (code: string): number | null =>
  SHIPPING_COUNTRIES.find((c) => c.code === code)?.rate ?? null;
