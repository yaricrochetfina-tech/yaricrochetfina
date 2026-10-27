import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCart, getMaxQuantity } from '@/hooks/useCart';
import type { Product } from '@/types';

/** Añade un producto al carrito mostrando el aviso correspondiente. Devuelve true si se añadió. */
export const useAddToCart = () => {
  const { t } = useTranslation();
  const addItem = useCart((state) => state.addItem);
  const openCart = useCart((state) => state.openCart);

  return useCallback(
    (product: Product, productName?: string): boolean => {
      const result = addItem(product);
      const name = productName || product.name;

      if (result === 'added') {
        toast.success(t('products.addedToCart', { name }), {
          action: { label: t('products.viewCart'), onClick: openCart },
        });
        return true;
      }

      if (result === 'limit') {
        const max = getMaxQuantity(product);
        toast.info(t('products.limitReached', { count: Number.isFinite(max) ? max : 1 }));
      } else {
        toast.error(t('products.unavailable'));
      }
      return false;
    },
    [addItem, openCart, t]
  );
};
