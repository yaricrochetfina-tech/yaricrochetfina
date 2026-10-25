import { supabase } from '@/integrations/supabase/client';
import type { CartItem } from '@/types';
import { resolveProductImage } from '@/lib/imageResolver';

export type CheckoutErrorCode =
  | 'generic'
  | 'emptyCart'
  | 'invalidCart'
  | 'outOfStock'
  | 'invalidCountry'
  | 'rateLimited'
  | 'invalidOrigin'
  | 'config'
  | 'network';

export class CheckoutError extends Error {
  code: CheckoutErrorCode;
  constructor(code: CheckoutErrorCode) {
    super(code);
    this.name = 'CheckoutError';
    this.code = code;
  }
}

const KNOWN_CODES: CheckoutErrorCode[] = [
  'emptyCart',
  'invalidCart',
  'outOfStock',
  'invalidCountry',
  'rateLimited',
  'invalidOrigin',
  'config',
];

/** Stripe necesita URLs absolutas para mostrar la imagen del producto. */
export const getAbsoluteImageUrl = (imagePath: string): string => {
  const resolved = resolveProductImage(imagePath);
  if (/^https?:\/\//.test(resolved)) return resolved;
  if (resolved.startsWith('data:')) return '';
  return `${window.location.origin}${resolved.startsWith('/') ? '' : '/'}${resolved}`;
};

const extractErrorCode = async (error: unknown): Promise<CheckoutErrorCode> => {
  const err = error as { name?: string; context?: Response };
  if (err?.name === 'FunctionsFetchError') return 'network';
  if (err?.context && typeof err.context.json === 'function') {
    try {
      const body = await err.context.json();
      if (KNOWN_CODES.includes(body?.code)) return body.code as CheckoutErrorCode;
    } catch {
      /* respuesta sin JSON */
    }
  }
  return 'generic';
};

interface CheckoutParams {
  items: CartItem[];
  shippingCountry: string;
  email: string;
  name?: string;
  language: string;
}

/**
 * Crea una sesión de Stripe Checkout en el servidor y devuelve la URL de pago.
 * El servidor recalcula precios, stock y envío: el cliente solo envía IDs y cantidades.
 */
export const createCheckoutSession = async ({
  items,
  shippingCountry,
  email,
  name,
  language,
}: CheckoutParams): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body: {
      items: items.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
        image: getAbsoluteImageUrl(item.product.image),
      })),
      shippingCountry,
      customerEmail: email,
      customerName: name || '',
      language,
    },
  });

  if (error) {
    console.error('Checkout error:', error);
    throw new CheckoutError(await extractErrorCode(error));
  }

  if (!data?.url) {
    throw new CheckoutError('generic');
  }

  return data.url as string;
};
