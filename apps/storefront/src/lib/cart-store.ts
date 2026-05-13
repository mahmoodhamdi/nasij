/**
 * Client-side cart store. Persisted to localStorage for guests; merged into
 * the server cart on sign-in. Pure logic for swapping the storage backend
 * in tests or in the POS offline queue.
 */

export interface CartLine {
  productSlug: string;
  variantSku: string;
  titleAr: string;
  titleEn: string;
  unitPriceMinor: number;
  imageUrl?: string;
  quantity: number;
}

export interface CartState {
  lines: CartLine[];
  updatedAt: number;
}

const EMPTY_CART: CartState = { lines: [], updatedAt: 0 };

export const createEmptyCart = (): CartState => ({ ...EMPTY_CART, updatedAt: Date.now() });

export interface CartStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const STORAGE_KEY = 'nasij.cart.v1';

export const loadCart = (storage: CartStorage): CartState => {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyCart();
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !Array.isArray((parsed as CartState).lines)
    ) {
      return createEmptyCart();
    }
    return parsed as CartState;
  } catch {
    return createEmptyCart();
  }
};

export const persistCart = (storage: CartStorage, cart: CartState): void => {
  storage.setItem(STORAGE_KEY, JSON.stringify(cart));
};

export const clearCart = (storage: CartStorage): void => {
  storage.removeItem(STORAGE_KEY);
};

export interface AddToCartInput {
  productSlug: string;
  variantSku: string;
  titleAr: string;
  titleEn: string;
  unitPriceMinor: number;
  imageUrl?: string;
  quantity?: number;
}

export const addToCart = (cart: CartState, input: AddToCartInput): CartState => {
  const quantity = input.quantity ?? 1;
  if (quantity <= 0) {
    throw new Error('Quantity must be positive.');
  }
  const existing = cart.lines.find((l) => l.variantSku === input.variantSku);
  const nextLines: CartLine[] = existing
    ? cart.lines.map((l) =>
        l.variantSku === input.variantSku ? { ...l, quantity: l.quantity + quantity } : l,
      )
    : [
        ...cart.lines,
        {
          productSlug: input.productSlug,
          variantSku: input.variantSku,
          titleAr: input.titleAr,
          titleEn: input.titleEn,
          unitPriceMinor: input.unitPriceMinor,
          imageUrl: input.imageUrl,
          quantity,
        },
      ];
  return { lines: nextLines, updatedAt: Date.now() };
};

export const updateQuantity = (
  cart: CartState,
  variantSku: string,
  quantity: number,
): CartState => {
  if (quantity < 0) {
    throw new Error('Quantity must be non-negative.');
  }
  if (quantity === 0) {
    return removeFromCart(cart, variantSku);
  }
  return {
    lines: cart.lines.map((l) =>
      l.variantSku === variantSku ? { ...l, quantity } : l,
    ),
    updatedAt: Date.now(),
  };
};

export const removeFromCart = (cart: CartState, variantSku: string): CartState => ({
  lines: cart.lines.filter((l) => l.variantSku !== variantSku),
  updatedAt: Date.now(),
});

export const cartItemCount = (cart: CartState): number =>
  cart.lines.reduce((sum, line) => sum + line.quantity, 0);

export const cartSubtotalMinor = (cart: CartState): number =>
  cart.lines.reduce((sum, line) => sum + line.unitPriceMinor * line.quantity, 0);

export const mergeCarts = (a: CartState, b: CartState): CartState => {
  const linesBySku = new Map<string, CartLine>();
  for (const line of a.lines) linesBySku.set(line.variantSku, line);
  for (const line of b.lines) {
    const existing = linesBySku.get(line.variantSku);
    linesBySku.set(
      line.variantSku,
      existing ? { ...existing, quantity: existing.quantity + line.quantity } : line,
    );
  }
  return { lines: [...linesBySku.values()], updatedAt: Date.now() };
};
