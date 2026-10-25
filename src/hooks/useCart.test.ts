import { beforeEach, describe, expect, it } from 'vitest';
import { useCart } from './useCart';
import type { Product } from '@/types';

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'p1',
  name: 'Blusa de prueba',
  price: 35,
  style: 'Boho Chic',
  category: 'Blusas',
  image: '/src/assets/blusa-boho-multicolor.png',
  description: 'Descripción',
  materials: ['Hilo de algodón'],
  inStock: true,
  stockQuantity: 1,
  ...overrides,
});

describe('useCart', () => {
  beforeEach(() => {
    useCart.setState({ items: [], isOpen: false, shippingCountry: 'CA' });
  });

  it('añade un producto y calcula subtotal y cantidad', () => {
    expect(useCart.getState().addItem(makeProduct())).toBe('added');
    expect(useCart.getState().getItemCount()).toBe(1);
    expect(useCart.getState().getSubtotal()).toBe(35);
  });

  it('no permite superar el stock de una pieza única', () => {
    const product = makeProduct();
    useCart.getState().addItem(product);
    expect(useCart.getState().addItem(product)).toBe('limit');
    expect(useCart.getState().items[0].quantity).toBe(1);

    useCart.getState().updateQuantity('p1', 5);
    expect(useCart.getState().items[0].quantity).toBe(1);
  });

  it('permite varias unidades si hay stock', () => {
    const product = makeProduct({ stockQuantity: 3 });
    useCart.getState().addItem(product);
    useCart.getState().addItem(product);
    useCart.getState().updateQuantity('p1', 3);
    expect(useCart.getState().getItemCount()).toBe(3);
    expect(useCart.getState().getSubtotal()).toBe(105);
  });

  it('rechaza productos agotados', () => {
    expect(useCart.getState().addItem(makeProduct({ inStock: false }))).toBe('unavailable');
    expect(useCart.getState().items).toHaveLength(0);
  });

  it('elimina el artículo si la cantidad es 0 o negativa', () => {
    useCart.getState().addItem(makeProduct({ stockQuantity: 5 }));
    useCart.getState().updateQuantity('p1', 0);
    expect(useCart.getState().items).toHaveLength(0);
  });

  it('sincroniza con el catálogo: actualiza precios y retira lo no disponible', () => {
    useCart.getState().addItem(makeProduct({ id: 'a', price: 35 }));
    useCart.getState().addItem(makeProduct({ id: 'b', price: 40 }));

    const removed = useCart
      .getState()
      .syncWithCatalog([makeProduct({ id: 'a', price: 50 }), makeProduct({ id: 'b', inStock: false })]);

    expect(removed.map((p) => p.id)).toEqual(['b']);
    expect(useCart.getState().items).toHaveLength(1);
    expect(useCart.getState().items[0].product.price).toBe(50);
  });

  it('solo acepta países de envío válidos', () => {
    useCart.getState().setShippingCountry('MX');
    expect(useCart.getState().shippingCountry).toBe('MX');
    useCart.getState().setShippingCountry('ZZ');
    expect(useCart.getState().shippingCountry).toBe('MX');
  });
});
