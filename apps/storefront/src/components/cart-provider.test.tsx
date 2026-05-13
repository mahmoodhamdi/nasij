import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { CartProvider, useCart } from './cart-provider.js';

const PRODUCT = {
  productSlug: 'kaftan',
  variantSku: 'NSJ-KFT-AMB-M-AMBER',
  titleAr: 'قفطان',
  titleEn: 'Kaftan',
  unitPriceMinor: 240_000,
};

describe('CartProvider / useCart', () => {
  it('starts empty', () => {
    window.localStorage.clear();
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotalMinor).toBe(0);
  });

  it('addItem adds and persists', () => {
    window.localStorage.clear();
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    act(() => result.current.addItem(PRODUCT));
    expect(result.current.itemCount).toBe(1);
    expect(result.current.subtotalMinor).toBe(240_000);
    expect(window.localStorage.getItem('nasij.cart.v1')).not.toBeNull();
  });

  it('updateItem changes quantity', () => {
    window.localStorage.clear();
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    act(() => result.current.addItem(PRODUCT));
    act(() => result.current.updateItem(PRODUCT.variantSku, 3));
    expect(result.current.itemCount).toBe(3);
  });

  it('removeItem drops the line', () => {
    window.localStorage.clear();
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    act(() => result.current.addItem(PRODUCT));
    act(() => result.current.removeItem(PRODUCT.variantSku));
    expect(result.current.itemCount).toBe(0);
  });

  it('useCart outside provider throws', () => {
    expect(() => renderHook(() => useCart())).toThrow(/CartProvider/);
  });
});
