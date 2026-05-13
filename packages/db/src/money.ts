/**
 * Money is stored as bigint minor units (e.g. piastres for EGP, cents for USD)
 * to avoid floating point error. Conversion helpers live here.
 */

const DEFAULT_MINOR_UNIT_EXPONENT = 2;

export const toMinorUnits = (
  majorUnits: number,
  minorUnitExponent = DEFAULT_MINOR_UNIT_EXPONENT,
): number => Math.round(majorUnits * 10 ** minorUnitExponent);

export const fromMinorUnits = (
  minorUnits: number,
  minorUnitExponent = DEFAULT_MINOR_UNIT_EXPONENT,
): number => minorUnits / 10 ** minorUnitExponent;

export const formatMinorUnits = (
  minorUnits: number,
  currency: string,
  locale: string,
  minorUnitExponent = DEFAULT_MINOR_UNIT_EXPONENT,
): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: minorUnitExponent,
    maximumFractionDigits: minorUnitExponent,
  }).format(fromMinorUnits(minorUnits, minorUnitExponent));
