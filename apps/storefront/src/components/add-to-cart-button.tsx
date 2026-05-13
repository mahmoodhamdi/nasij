'use client';

import { useState } from 'react';

import { Button } from '@nasij/ui';

import { useCart } from './cart-provider.js';
import type { AddToCartInput } from '~/lib/cart-store.js';

interface AddToCartButtonProps {
  input: AddToCartInput;
  label: string;
  successLabel: string;
  disabled?: boolean;
}

export const AddToCartButton = ({ input, label, successLabel, disabled }: AddToCartButtonProps) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <Button
      size="lg"
      onClick={() => {
        addItem(input);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1800);
      }}
      disabled={disabled}
      aria-live="polite"
    >
      {added ? successLabel : label}
    </Button>
  );
};
