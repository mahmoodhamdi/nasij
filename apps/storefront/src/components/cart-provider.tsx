'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  addToCart as addToCartFn,
  cartItemCount,
  cartSubtotalMinor,
  createEmptyCart,
  loadCart,
  persistCart,
  removeFromCart as removeFromCartFn,
  updateQuantity as updateQuantityFn,
  type AddToCartInput,
  type CartState,
} from '~/lib/cart-store.js';

interface CartContextValue {
  cart: CartState;
  addItem: (input: AddToCartInput) => void;
  updateItem: (sku: string, quantity: number) => void;
  removeItem: (sku: string) => void;
  itemCount: number;
  subtotalMinor: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartState>(createEmptyCart);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setCart(loadCart(window.localStorage));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    persistCart(window.localStorage, cart);
  }, [cart]);

  const addItem = useCallback((input: AddToCartInput) => {
    setCart((prev) => addToCartFn(prev, input));
  }, []);
  const updateItem = useCallback((sku: string, quantity: number) => {
    setCart((prev) => updateQuantityFn(prev, sku, quantity));
  }, []);
  const removeItem = useCallback((sku: string) => {
    setCart((prev) => removeFromCartFn(prev, sku));
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      addItem,
      updateItem,
      removeItem,
      itemCount: cartItemCount(cart),
      subtotalMinor: cartSubtotalMinor(cart),
    }),
    [cart, addItem, updateItem, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside <CartProvider>.');
  }
  return ctx;
};
