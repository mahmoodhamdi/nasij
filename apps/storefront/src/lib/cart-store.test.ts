import { describe, it, expect, vi } from 'vitest';

import {
  addToCart,
  cartItemCount,
  cartSubtotalMinor,
  clearCart,
  createEmptyCart,
  loadCart,
  mergeCarts,
  persistCart,
  removeFromCart,
  updateQuantity,
  type CartStorage,
} from './cart-store.js';

const makeStorage = (): CartStorage & { _data: Map<string, string> } => {
  const data = new Map<string, string>();
  return {
    _data: data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => {
      data.set(k, v);
    },
    removeItem: (k) => {
      data.delete(k);
    },
  };
};

const PRODUCT = {
  productSlug: 'kaftan',
  variantSku: 'NSJ-KFT-AMB-M-AMBER',
  titleAr: 'قفطان',
  titleEn: 'Kaftan',
  unitPriceMinor: 240_000,
};

describe('createEmptyCart', () => {
  it('returns an empty cart with a timestamp', () => {
    const c = createEmptyCart();
    expect(c.lines).toEqual([]);
    expect(c.updatedAt).toBeGreaterThan(0);
  });
});

describe('addToCart', () => {
  it('adds a new line', () => {
    const c = addToCart(createEmptyCart(), PRODUCT);
    expect(c.lines).toHaveLength(1);
    expect(c.lines[0]!.quantity).toBe(1);
  });

  it('increments quantity for the same sku', () => {
    const c = addToCart(addToCart(createEmptyCart(), PRODUCT), PRODUCT);
    expect(c.lines[0]!.quantity).toBe(2);
  });

  it('respects a custom quantity', () => {
    const c = addToCart(createEmptyCart(), { ...PRODUCT, quantity: 3 });
    expect(c.lines[0]!.quantity).toBe(3);
  });

  it('throws on non-positive quantity', () => {
    expect(() => addToCart(createEmptyCart(), { ...PRODUCT, quantity: 0 })).toThrow();
    expect(() => addToCart(createEmptyCart(), { ...PRODUCT, quantity: -1 })).toThrow();
  });
});

describe('updateQuantity', () => {
  it('changes the quantity', () => {
    const c = updateQuantity(addToCart(createEmptyCart(), PRODUCT), PRODUCT.variantSku, 5);
    expect(c.lines[0]!.quantity).toBe(5);
  });

  it('removes the line when set to 0', () => {
    const c = updateQuantity(addToCart(createEmptyCart(), PRODUCT), PRODUCT.variantSku, 0);
    expect(c.lines).toHaveLength(0);
  });

  it('throws on negative quantity', () => {
    const initial = addToCart(createEmptyCart(), PRODUCT);
    expect(() => updateQuantity(initial, PRODUCT.variantSku, -1)).toThrow();
  });

  it('is a no-op for an unknown sku', () => {
    const initial = addToCart(createEmptyCart(), PRODUCT);
    const next = updateQuantity(initial, 'unknown', 5);
    expect(next.lines).toEqual(initial.lines);
  });
});

describe('removeFromCart', () => {
  it('removes the matching line', () => {
    const initial = addToCart(createEmptyCart(), PRODUCT);
    expect(removeFromCart(initial, PRODUCT.variantSku).lines).toEqual([]);
  });

  it('leaves other lines intact', () => {
    const initial = addToCart(addToCart(createEmptyCart(), PRODUCT), {
      ...PRODUCT,
      variantSku: 'OTHER',
    });
    expect(removeFromCart(initial, 'OTHER').lines).toHaveLength(1);
  });
});

describe('cartItemCount & cartSubtotalMinor', () => {
  it('sums correctly', () => {
    const cart = addToCart(addToCart(createEmptyCart(), PRODUCT), {
      ...PRODUCT,
      variantSku: 'OTHER',
      unitPriceMinor: 50_000,
      quantity: 2,
    });
    expect(cartItemCount(cart)).toBe(3);
    expect(cartSubtotalMinor(cart)).toBe(240_000 + 50_000 * 2);
  });
});

describe('persistCart, loadCart, clearCart', () => {
  it('roundtrips a cart through storage', () => {
    const storage = makeStorage();
    const original = addToCart(createEmptyCart(), PRODUCT);
    persistCart(storage, original);
    const loaded = loadCart(storage);
    expect(loaded.lines).toEqual(original.lines);
  });

  it('returns empty cart when storage is empty', () => {
    expect(loadCart(makeStorage()).lines).toEqual([]);
  });

  it('returns empty cart on parse error', () => {
    const storage = makeStorage();
    storage.setItem('nasij.cart.v1', 'not-json');
    expect(loadCart(storage).lines).toEqual([]);
  });

  it('returns empty cart on shape mismatch', () => {
    const storage = makeStorage();
    storage.setItem('nasij.cart.v1', JSON.stringify({ wrong: 'shape' }));
    expect(loadCart(storage).lines).toEqual([]);
  });

  it('returns empty cart when JSON yields a primitive', () => {
    const storage = makeStorage();
    storage.setItem('nasij.cart.v1', 'null');
    expect(loadCart(storage).lines).toEqual([]);
  });

  it('returns empty cart when storage.getItem throws', () => {
    const storage: CartStorage = {
      getItem: vi.fn(() => {
        throw new Error('boom');
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    expect(loadCart(storage).lines).toEqual([]);
  });

  it('clearCart removes the key', () => {
    const storage = makeStorage();
    persistCart(storage, addToCart(createEmptyCart(), PRODUCT));
    clearCart(storage);
    expect(storage._data.has('nasij.cart.v1')).toBe(false);
  });
});

describe('mergeCarts', () => {
  it('combines lines from both carts', () => {
    const a = addToCart(createEmptyCart(), PRODUCT);
    const b = addToCart(createEmptyCart(), { ...PRODUCT, variantSku: 'OTHER' });
    const merged = mergeCarts(a, b);
    expect(merged.lines).toHaveLength(2);
  });

  it('sums quantities when both carts share a sku', () => {
    const a = addToCart(createEmptyCart(), { ...PRODUCT, quantity: 2 });
    const b = addToCart(createEmptyCart(), { ...PRODUCT, quantity: 3 });
    const merged = mergeCarts(a, b);
    expect(merged.lines).toHaveLength(1);
    expect(merged.lines[0]!.quantity).toBe(5);
  });
});
