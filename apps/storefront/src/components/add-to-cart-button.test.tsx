import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

import { AddToCartButton } from './add-to-cart-button.js';
import { CartProvider } from './cart-provider.js';

const INPUT = {
  productSlug: 'kaftan',
  variantSku: 'NSJ-KFT-AMB-M-AMBER',
  titleAr: 'قفطان',
  titleEn: 'Kaftan',
  unitPriceMinor: 240_000,
};

describe('AddToCartButton', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders label by default and switches to successLabel after a click', () => {
    render(
      <CartProvider>
        <AddToCartButton input={INPUT} label="Add to cart" successLabel="Added" />
      </CartProvider>,
    );
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(screen.getByRole('button', { name: 'Added' })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeInTheDocument();
  });

  it('respects disabled', () => {
    render(
      <CartProvider>
        <AddToCartButton input={INPUT} label="Add" successLabel="Done" disabled />
      </CartProvider>,
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
