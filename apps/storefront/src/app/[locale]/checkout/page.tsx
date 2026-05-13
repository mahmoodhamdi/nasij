'use client';

import Link from 'next/link';
import { use, useState } from 'react';

import { formatCurrency, isLocale, type Locale } from '@nasij/i18n';
import { Button, Input, Label } from '@nasij/ui';
import { computeCartTotals } from '@nasij/api/cart';

import { useCart } from '~/components/cart-provider.js';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const LABELS = {
  ar: {
    title: 'إتمام الشراء',
    contact: 'بيانات التواصل',
    shipping: 'العنوان',
    review: 'مراجعة الطلب',
    payment: 'الدفع',
    next: 'التالي',
    back: 'رجوع',
    placeOrder: 'تأكيد الطلب',
    empty: 'سلتك فارغة.',
    continue: 'متابعة التسوق',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    name: 'الاسم بالكامل',
    line1: 'العنوان',
    city: 'المدينة',
    region: 'المحافظة',
    postalCode: 'الرمز البريدي',
    paymentMethod: 'طريقة الدفع',
    cardLabel: 'بطاقة',
    codLabel: 'الدفع عند الاستلام',
    subtotal: 'المجموع الفرعي',
    shippingFee: 'الشحن',
    tax: 'الضريبة (14%)',
    total: 'الإجمالي',
    success: 'تم استلام طلبك',
  },
  en: {
    title: 'Checkout',
    contact: 'Contact',
    shipping: 'Shipping address',
    review: 'Review',
    payment: 'Payment',
    next: 'Continue',
    back: 'Back',
    placeOrder: 'Place order',
    empty: 'Your cart is empty.',
    continue: 'Continue shopping',
    email: 'Email',
    phone: 'Phone',
    name: 'Full name',
    line1: 'Address',
    city: 'City',
    region: 'Governorate',
    postalCode: 'Postal code',
    paymentMethod: 'Payment method',
    cardLabel: 'Card',
    codLabel: 'Cash on delivery',
    subtotal: 'Subtotal',
    shippingFee: 'Shipping',
    tax: 'Tax (14%)',
    total: 'Total',
    success: 'Order received',
  },
} as const;

type Step = 'contact' | 'shipping' | 'payment' | 'success';

const SHIPPING_MINOR = 5000;
const TAX_BP = 1400;

const CheckoutPage = ({ params }: PageProps) => {
  const { locale: localeParam } = use(params);
  const locale: Locale = isLocale(localeParam) ? localeParam : 'ar';
  const labels = LABELS[locale];
  const { cart, subtotalMinor } = useCart();
  const [step, setStep] = useState<Step>('contact');

  if (cart.lines.length === 0 && step !== 'success') {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="font-display-latin text-3xl text-text">{labels.title}</h1>
        <p className="mt-6 text-text-muted">{labels.empty}</p>
        <Button asChild className="mt-6">
          <Link href={`/${locale}/shop`}>{labels.continue}</Link>
        </Button>
      </main>
    );
  }

  const totals = computeCartTotals(
    cart.lines.map((l) => ({
      sku: l.variantSku,
      unitPriceMinor: l.unitPriceMinor,
      quantity: l.quantity,
    })),
    { taxRateBasisPoints: TAX_BP, shippingMinor: SHIPPING_MINOR },
  );

  if (step === 'success') {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display-latin text-4xl text-text">{labels.success}</h1>
        <p className="mt-4 text-text-muted">
          {locale === 'ar'
            ? 'سنرسل لك تأكيدًا عبر البريد الإلكتروني قريبًا.'
            : 'We will email you a confirmation shortly.'}
        </p>
        <Button asChild className="mt-8">
          <Link href={`/${locale}/shop`}>{labels.continue}</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display-latin text-3xl text-text">{labels.title}</h1>
      <nav aria-label="Checkout steps" className="mt-4 flex gap-4 text-sm text-text-muted">
        {(['contact', 'shipping', 'payment'] as const).map((s, idx) => (
          <span
            key={s}
            aria-current={step === s ? 'step' : undefined}
            className={step === s ? 'font-medium text-text' : ''}
          >
            {idx + 1}. {labels[s]}
          </span>
        ))}
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step === 'contact') setStep('shipping');
            else if (step === 'shipping') setStep('payment');
            else if (step === 'payment') setStep('success');
          }}
          className="flex flex-col gap-6"
        >
          {step === 'contact' ? (
            <fieldset className="flex flex-col gap-4">
              <legend className="font-display-latin text-xl text-text">{labels.contact}</legend>
              <Label htmlFor="email">{labels.email}</Label>
              <Input id="email" type="email" required autoComplete="email" />
              <Label htmlFor="phone">{labels.phone}</Label>
              <Input id="phone" type="tel" required autoComplete="tel" />
            </fieldset>
          ) : null}

          {step === 'shipping' ? (
            <fieldset className="flex flex-col gap-4">
              <legend className="font-display-latin text-xl text-text">{labels.shipping}</legend>
              <Label htmlFor="name">{labels.name}</Label>
              <Input id="name" required autoComplete="name" />
              <Label htmlFor="line1">{labels.line1}</Label>
              <Input id="line1" required autoComplete="address-line1" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="city">{labels.city}</Label>
                  <Input id="city" required autoComplete="address-level2" />
                </div>
                <div>
                  <Label htmlFor="region">{labels.region}</Label>
                  <Input id="region" autoComplete="address-level1" />
                </div>
                <div>
                  <Label htmlFor="postalCode">{labels.postalCode}</Label>
                  <Input id="postalCode" autoComplete="postal-code" />
                </div>
              </div>
            </fieldset>
          ) : null}

          {step === 'payment' ? (
            <fieldset className="flex flex-col gap-4">
              <legend className="font-display-latin text-xl text-text">{labels.payment}</legend>
              <Label className="flex items-center gap-3">
                <input type="radio" name="pm" value="card" defaultChecked />
                {labels.cardLabel}
              </Label>
              <Label className="flex items-center gap-3">
                <input type="radio" name="pm" value="cod" />
                {labels.codLabel}
              </Label>
            </fieldset>
          ) : null}

          <div className="flex gap-3">
            {step !== 'contact' ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (step === 'shipping') setStep('contact');
                  else if (step === 'payment') setStep('shipping');
                }}
              >
                {labels.back}
              </Button>
            ) : null}
            <Button type="submit">
              {step === 'payment' ? labels.placeOrder : labels.next}
            </Button>
          </div>
        </form>

        <aside className="rounded-lg border border-border bg-surface-raised p-6">
          <ul className="flex flex-col gap-2 text-sm">
            {cart.lines.map((line) => (
              <li key={line.variantSku} className="flex justify-between">
                <span className="text-text-muted">
                  {line.quantity} × {locale === 'ar' ? line.titleAr : line.titleEn}
                </span>
                <span>
                  {formatCurrency(line.unitPriceMinor * line.quantity, { locale })}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 flex flex-col gap-1 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-muted">{labels.subtotal}</dt>
              <dd>{formatCurrency(subtotalMinor, { locale })}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">{labels.shippingFee}</dt>
              <dd>{formatCurrency(SHIPPING_MINOR, { locale })}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">{labels.tax}</dt>
              <dd>{formatCurrency(totals.taxMinor, { locale })}</dd>
            </div>
            <div className="mt-2 flex justify-between text-base font-medium">
              <dt>{labels.total}</dt>
              <dd>{formatCurrency(totals.totalMinor, { locale })}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </main>
  );
};

export default CheckoutPage;
