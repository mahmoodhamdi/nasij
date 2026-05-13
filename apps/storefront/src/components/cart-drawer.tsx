'use client';

import Link from 'next/link';
import { useState } from 'react';

import { formatCurrency, type Locale } from '@nasij/i18n';
import { Button } from '@nasij/ui';

import { useCart } from './cart-provider.js';

interface CartDrawerProps {
  locale: Locale;
  labels: {
    open: string;
    title: string;
    empty: string;
    subtotal: string;
    checkout: string;
    close: string;
    remove: string;
  };
}

export const CartDrawer = ({ locale, labels }: CartDrawerProps) => {
  const { cart, itemCount, subtotalMinor, removeItem, updateItem } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={labels.open}
        className="relative inline-flex items-center gap-2 rounded-full border border-border-strong px-3 py-1 text-sm text-text-muted hover:text-text"
      >
        {labels.title}
        {itemCount > 0 ? (
          <span
            aria-hidden="true"
            className="inline-flex size-5 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground"
          >
            {itemCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <div
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/30"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={labels.title}
            className="fixed inset-y-0 end-0 z-50 flex w-full max-w-md flex-col bg-surface-raised shadow-xl"
          >
            <header className="flex items-center justify-between border-b border-border p-4">
              <h2 className="font-display-latin text-xl text-text">{labels.title}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={labels.close}
                className="text-text-muted hover:text-text"
              >
                ✕
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.lines.length === 0 ? (
                <p className="text-text-muted">{labels.empty}</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {cart.lines.map((line) => (
                    <li key={line.variantSku} className="flex items-start gap-3">
                      <div className="size-16 shrink-0 rounded-md bg-surface-sunken" aria-hidden="true" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text">
                          {locale === 'ar' ? line.titleAr : line.titleEn}
                        </p>
                        <p className="mt-1 text-xs text-text-subtle">{line.variantSku}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <label className="sr-only" htmlFor={`qty-${line.variantSku}`}>
                            quantity
                          </label>
                          <input
                            id={`qty-${line.variantSku}`}
                            type="number"
                            min={0}
                            max={99}
                            value={line.quantity}
                            onChange={(e) =>
                              updateItem(line.variantSku, Number(e.target.value) || 0)
                            }
                            className="w-16 rounded border border-border px-2 py-1 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeItem(line.variantSku)}
                            aria-label={`${labels.remove} ${line.titleEn}`}
                            className="text-xs text-text-subtle hover:text-danger"
                          >
                            {labels.remove}
                          </button>
                        </div>
                      </div>
                      <span className="text-sm text-text">
                        {formatCurrency(line.unitPriceMinor * line.quantity, { locale })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-border p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-text-muted">{labels.subtotal}</span>
                <span className="font-medium text-text">
                  {formatCurrency(subtotalMinor, { locale })}
                </span>
              </div>
              <Button
                size="lg"
                className="w-full"
                disabled={cart.lines.length === 0}
                asChild={cart.lines.length > 0}
              >
                {cart.lines.length > 0 ? (
                  <Link href={`/${locale}/checkout`} onClick={() => setOpen(false)}>
                    {labels.checkout}
                  </Link>
                ) : (
                  <span>{labels.checkout}</span>
                )}
              </Button>
            </footer>
          </aside>
        </>
      ) : null}
    </>
  );
};
