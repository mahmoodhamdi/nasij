/**
 * Receipt rendering. Two outputs:
 *  - HTML for browser print (default).
 *  - ESC/POS byte stream for thermal printers via a Web Serial / HID adapter.
 *
 * Layout is mirrored for Arabic — the caller passes the locale.
 */

export interface ReceiptLine {
  titleEn: string;
  titleAr?: string;
  quantity: number;
  unitPriceMinor: number;
  lineTotalMinor: number;
}

export interface ReceiptInput {
  storeName: string;
  storeLine1: string;
  receiptNumber: string;
  cashier: string;
  registerName: string;
  placedAt: Date;
  locale: 'ar' | 'en';
  lines: ReceiptLine[];
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
  tenderedMinor?: number;
  changeMinor?: number;
  paymentMethod: 'cash' | 'card' | 'split';
  footerNote?: string;
}

const formatEgp = (minor: number, locale: 'ar' | 'en'): string =>
  new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2,
  }).format(minor / 100);

const formatDateTime = (date: Date, locale: 'ar' | 'en'): string =>
  new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);

const LABELS = {
  ar: {
    receipt: 'إيصال',
    cashier: 'الكاشير',
    register: 'الكاسير',
    subtotal: 'المجموع الفرعي',
    discount: 'الخصم',
    tax: 'الضريبة',
    total: 'الإجمالي',
    tendered: 'المدفوع',
    change: 'الباقي',
    payment: 'طريقة الدفع',
    cash: 'نقدي',
    card: 'بطاقة',
    split: 'دفع مقسّم',
    thanks: 'شكرًا لزيارتك',
  },
  en: {
    receipt: 'Receipt',
    cashier: 'Cashier',
    register: 'Register',
    subtotal: 'Subtotal',
    discount: 'Discount',
    tax: 'Tax',
    total: 'Total',
    tendered: 'Tendered',
    change: 'Change',
    payment: 'Payment',
    cash: 'Cash',
    card: 'Card',
    split: 'Split',
    thanks: 'Thank you for your visit',
  },
} as const;

export const renderReceiptHtml = (input: ReceiptInput): string => {
  const labels = LABELS[input.locale];
  const dir = input.locale === 'ar' ? 'rtl' : 'ltr';
  const safeText = (s: string) =>
    s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

  const lineRows = input.lines
    .map((line) => {
      const title = input.locale === 'ar' && line.titleAr ? line.titleAr : line.titleEn;
      return `<tr>
        <td>${line.quantity} × ${safeText(title)}</td>
        <td style="text-align:end">${formatEgp(line.lineTotalMinor, input.locale)}</td>
      </tr>`;
    })
    .join('');

  return `<!doctype html>
<html lang="${input.locale}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <title>${labels.receipt} ${safeText(input.receiptNumber)}</title>
  <style>
    body { font-family: ui-monospace, monospace; max-width: 280px; margin: 0 auto; padding: 12px; }
    h1 { font-size: 14px; text-align: center; margin: 0 0 4px; }
    .meta { font-size: 11px; text-align: center; margin-bottom: 12px; }
    table { width: 100%; font-size: 12px; border-collapse: collapse; }
    table tr td { padding: 2px 0; }
    .totals { margin-top: 8px; border-top: 1px dashed currentColor; padding-top: 8px; font-size: 12px; }
    .total-row { display:flex; justify-content:space-between; }
    .grand { font-weight: 700; font-size: 14px; }
    footer { margin-top: 12px; text-align: center; font-size: 11px; }
  </style>
</head>
<body>
  <h1>${safeText(input.storeName)}</h1>
  <div class="meta">
    ${safeText(input.storeLine1)}<br/>
    ${labels.receipt}: ${safeText(input.receiptNumber)}<br/>
    ${labels.register}: ${safeText(input.registerName)} · ${labels.cashier}: ${safeText(input.cashier)}<br/>
    ${formatDateTime(input.placedAt, input.locale)}
  </div>
  <table>${lineRows}</table>
  <div class="totals">
    <div class="total-row"><span>${labels.subtotal}</span><span>${formatEgp(input.subtotalMinor, input.locale)}</span></div>
    ${input.discountMinor > 0 ? `<div class="total-row"><span>${labels.discount}</span><span>−${formatEgp(input.discountMinor, input.locale)}</span></div>` : ''}
    <div class="total-row"><span>${labels.tax}</span><span>${formatEgp(input.taxMinor, input.locale)}</span></div>
    <div class="total-row grand"><span>${labels.total}</span><span>${formatEgp(input.totalMinor, input.locale)}</span></div>
    <div class="total-row"><span>${labels.payment}</span><span>${labels[input.paymentMethod]}</span></div>
    ${input.tenderedMinor !== undefined ? `<div class="total-row"><span>${labels.tendered}</span><span>${formatEgp(input.tenderedMinor, input.locale)}</span></div>` : ''}
    ${input.changeMinor !== undefined ? `<div class="total-row"><span>${labels.change}</span><span>${formatEgp(input.changeMinor, input.locale)}</span></div>` : ''}
  </div>
  <footer>${safeText(input.footerNote ?? labels.thanks)}</footer>
</body>
</html>`;
};

/**
 * Minimal ESC/POS encoding for the same content. Real-world drivers will
 * extend this with cuts, drawers, barcodes — for now we ship plain text
 * with the standard initialization and line feeds.
 */
export const renderReceiptEscPos = (input: ReceiptInput): Uint8Array => {
  const ESC = 0x1b;
  const LF = 0x0a;
  const out: number[] = [ESC, 0x40]; // initialize printer

  const pushLine = (text: string) => {
    for (const ch of text) out.push(ch.charCodeAt(0) & 0xff);
    out.push(LF);
  };

  pushLine(input.storeName);
  pushLine(input.storeLine1);
  pushLine(`#${input.receiptNumber}`);
  pushLine('-'.repeat(32));
  for (const line of input.lines) {
    const title = input.locale === 'ar' && line.titleAr ? line.titleAr : line.titleEn;
    pushLine(`${line.quantity}x ${title}`);
    pushLine(`     ${(line.lineTotalMinor / 100).toFixed(2)} EGP`);
  }
  pushLine('-'.repeat(32));
  pushLine(`TOTAL ${(input.totalMinor / 100).toFixed(2)} EGP`);
  pushLine('');
  pushLine(input.footerNote ?? 'Thank you');

  return Uint8Array.from(out);
};
