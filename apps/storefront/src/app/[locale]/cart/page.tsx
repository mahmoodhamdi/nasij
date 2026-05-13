'use client';

import Link from 'next/link';
import { use } from 'react';

import { formatCurrency, isLocale, type Locale } from '@nasij/i18n';
import { Button } from '@nasij/ui';

import { useCart } from '~/components/cart-provider.js';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const LABELS = {
  ar: {
    title: 'السلة',
    empty: 'سلتك فارغة.',
    continueShopping: 'متابعة التسوق',
    subtotal: 'المجموع الفرعي',
    checkout: 'إتمام الشراء',
    remove: 'إزالة',
    quantity: 'الكمية',
  },
  en: {
    title: 'Cart',
    empty: 'Your cart is empty.',
    continueShopping: 'Continue shopping',
    subtotal: 'Subtotal',
    checkout: 'Checkout',
    remove: 'Remove',
    quantity: 'Quantity',
  },
} as const;

const CartPage = ({ params }: PageProps) => {
  const { locale: localeParam } = use(params);
  const locale: Locale = isLocale(localeParam) ? localeParam : 'ar';
  const labels = LABELS[locale];
  const { cart, removeItem, updateItem, subtotalMinor } = useCart();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display-latin text-4xl font-medium text-text">{labels.title}</h1>

      {cart.lines.length === 0 ? (
        <section className="mt-10 flex flex-col items-start gap-4">
          <p className="text-text-muted">{labels.empty}</p>
          <Button asChild>
            <Link href={`/${locale}/shop`}>{labels.continueShopping}</Link>
          </Button>
        </section>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <ul className="flex flex-col divide-y divide-border">
            {cart.lines.map((line) => (
              <li key={line.variantSku} className="flex items-start gap-4 py-4">
                <div className="size-24 shrink-0 rounded-md bg-surface-sunken" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-medium text-text">
                    {locale === 'ar' ? line.titleAr : line.titleEn}
                  </p>
                  <p className="mt-1 text-xs text-text-subtle">{line.variantSku}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <label htmlFor={`qty-${line.variantSku}`} className="sr-only">
                      {labels.quantity}
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
                      className="w-20 rounded border border-border px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(line.variantSku)}
                      className="text-sm text-text-subtle underline-offset-4 hover:text-danger hover:underline"
                    >
                      {labels.remove}
                    </button>
                  </div>
                </div>
                <span className="font-medium text-text">
                  {formatCurrency(line.unitPriceMinor * line.quantity, { locale })}
                </span>
              </li>
            ))}
          </ul>

          <aside className="rounded-lg border border-border bg-surface-raised p-6">
            <dl className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <dt className="text-text-muted">{labels.subtotal}</dt>
                <dd className="font-medium text-text">
                  {formatCurrency(subtotalMinor, { locale })}
                </dd>
              </div>
            </dl>
            <Button asChild size="lg" className="mt-6 w-full">
              <Link href={`/${locale}/checkout`}>{labels.checkout}</Link>
            </Button>
          </aside>
        </div>
      )}
    </main>
  );
};

export default CartPage;
