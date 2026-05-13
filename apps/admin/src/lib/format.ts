export const formatPriceEgp = (minor: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2,
  }).format(minor / 100);

export const formatDateShort = (input: string | Date): string =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(input));
