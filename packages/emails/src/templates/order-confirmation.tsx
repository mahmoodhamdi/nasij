import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

import type { Locale } from '@nasij/i18n';
import { directionFor, formatCurrency } from '@nasij/i18n';

export interface OrderConfirmationProps {
  locale: Locale;
  customerName: string;
  orderNumber: string;
  items: Array<{ titleAr: string; titleEn: string; quantity: number; lineTotalMinor: number }>;
  subtotalMinor: number;
  shippingMinor: number;
  taxMinor: number;
  totalMinor: number;
  currency?: string;
}

const labelsByLocale = {
  ar: {
    preview: (number: string) => `طلبك من نسيج رقم ${number}`,
    title: (name: string) => `شكرًا لك يا ${name}`,
    subtitle: (number: string) => `استلمنا طلبك رقم ${number} وسنتواصل معك بتفاصيل الشحن قريبًا.`,
    items: 'القطع',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    tax: 'الضريبة',
    total: 'الإجمالي',
  },
  en: {
    preview: (number: string) => `Your Nasij order ${number}`,
    title: (name: string) => `Thank you, ${name}`,
    subtitle: (number: string) => `We've received order ${number}. We'll be in touch with shipping details shortly.`,
    items: 'Items',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Tax',
    total: 'Total',
  },
} as const;

export const OrderConfirmationEmail = ({
  locale,
  customerName,
  orderNumber,
  items,
  subtotalMinor,
  shippingMinor,
  taxMinor,
  totalMinor,
  currency = 'EGP',
}: OrderConfirmationProps) => {
  const dir = directionFor(locale);
  const labels = labelsByLocale[locale];

  return (
    <Html lang={locale} dir={dir}>
      <Head />
      <Preview>{labels.preview(orderNumber)}</Preview>
      <Body style={{ backgroundColor: '#fafaf7', fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: 560, margin: '24px auto', padding: 24, background: '#ffffff' }}>
          <Heading style={{ fontSize: 24, color: '#1c1a15' }}>{labels.title(customerName)}</Heading>
          <Text style={{ color: '#454035' }}>{labels.subtitle(orderNumber)}</Text>
          <Hr />
          <Section>
            <Heading as="h2" style={{ fontSize: 16, color: '#1c1a15' }}>
              {labels.items}
            </Heading>
            {items.map((item) => (
              <Text key={`${item.titleEn}-${item.quantity}`} style={{ margin: '6px 0' }}>
                {item.quantity} × {locale === 'ar' ? item.titleAr : item.titleEn} —{' '}
                {formatCurrency(item.lineTotalMinor, { locale, currency })}
              </Text>
            ))}
          </Section>
          <Hr />
          <Section>
            <Text>
              {labels.subtotal}: {formatCurrency(subtotalMinor, { locale, currency })}
            </Text>
            <Text>
              {labels.shipping}: {formatCurrency(shippingMinor, { locale, currency })}
            </Text>
            <Text>
              {labels.tax}: {formatCurrency(taxMinor, { locale, currency })}
            </Text>
            <Text style={{ fontWeight: 600, fontSize: 18 }}>
              {labels.total}: {formatCurrency(totalMinor, { locale, currency })}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
