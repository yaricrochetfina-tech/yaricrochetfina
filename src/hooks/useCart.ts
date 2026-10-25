import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';
import { DEFAULT_SHIPPING_COUNTRY, isShippingCountry } from '@/lib/store';

export type AddItemResult = 'added' | 'limit' | 'unavailable';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  shippingCountry: string;
  addItem: (product: Product) => AddItemResult;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setShippingCountry: (country: string) => void;
  /** Actualiza precios/stock con los datos reales del catálogo y retira lo no disponible. */
  syncWithCatalog: (catalog: Product[]) => Product[];
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

/** Máximo de unidades que se pueden comprar de un producto (las piezas únicas: 1). */
export const getMaxQuantity = (product: Product): number =>
  product.stockQuantity && product.stockQuantity > 0 ? product.stockQuantity : Infinity;

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      shippingCountry: DEFAULT_SHIPPING_COUNTRY,

      addItem: (product: Product) => {
        if (!product.inStock) return 'unavailable';

        const items = get().items;
        const existingItem = items.find((item) => item.product.id === product.id);

        if (existingItem) {
          if (existingItem.quantity >= getMaxQuantity(product)) return 'limit';
          set({
            items: items.map((item) =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: 1 }] });
        }
        return 'added';
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (!Number.isFinite(quantity) || quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.min(Math.floor(quantity), getMaxQuantity(item.product)) }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),

      closeCart: () => set({ isOpen: false }),

      setShippingCountry: (country: string) => {
        if (isShippingCountry(country)) set({ shippingCountry: country });
      },

      syncWithCatalog: (catalog: Product[]) => {
        const removed: Product[] = [];
        const nextItems: CartItem[] = [];

        for (const item of get().items) {
          const fresh = catalog.find((p) => p.id === item.product.id);
          if (!fresh || !fresh.inStock) {
            removed.push(item.product);
            continue;
          }
          nextItems.push({
            product: fresh,
            quantity: Math.min(item.quantity, getMaxQuantity(fresh)),
          });
        }

        set({ items: nextItems });
        return removed;
      },

      getSubtotal: () =>
        get().items.reduce((total, item) => total + item.product.price * item.quantity, 0),

      // Se mantiene por compatibilidad: el total del carrito sin envío es el subtotal.
      getTotal: () => get().getSubtotal(),

      getItemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: 'yari-crochet-cart',
      // No persistimos `isOpen`: el carrito no debe reabrirse solo al recargar la página.
      partialize: (state) => ({ items: state.items, shippingCountry: state.shippingCountry }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<CartStore>),
        isOpen: false,
      }),
    }
  )
);
