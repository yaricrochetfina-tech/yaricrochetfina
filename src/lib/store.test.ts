import { describe, expect, it } from 'vitest';
import { SHIPPING_COUNTRIES, formatPrice, getCountryName, getShippingRate, isShippingCountry } from './store';

describe('tienda', () => {
  it('formatea precios con dos decimales y moneda', () => {
    expect(formatPrice(35)).toMatch(/^\$35\.00 [A-Z]{3}$/);
  });

  it('todas las tarifas de envío son positivas y no hay países repetidos', () => {
    const codes = SHIPPING_COUNTRIES.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
    SHIPPING_COUNTRIES.forEach((c) => expect(c.rate).toBeGreaterThan(0));
  });

  it('devuelve la tarifa de un país y null si no existe', () => {
    expect(getShippingRate('CA')).toBe(15);
    expect(getShippingRate('XX')).toBeNull();
    expect(isShippingCountry('FR')).toBe(true);
    expect(isShippingCountry('XX')).toBe(false);
  });

  it('traduce los nombres de países al idioma pedido', () => {
    expect(getCountryName('ES', 'es')).toBe('España');
    expect(getCountryName('CA', 'fr')).toBe('Canada');
    expect(getCountryName('JP', 'en')).toBe('Japan');
  });
});
