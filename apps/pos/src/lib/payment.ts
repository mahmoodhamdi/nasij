/**
 * Pure payment helpers for the POS register.
 *
 * Cash flow: operator types the amount tendered, we compute change.
 * Card flow: the terminal returns an outcome string ("approved" / "declined"
 * / "cancelled"); we coerce it into a known state.
 */

export type PaymentMethod = 'cash' | 'card' | 'split';

export interface CashOutcome {
  method: 'cash';
  tenderedMinor: number;
  changeMinor: number;
}

export const computeCashChange = (totalMinor: number, tenderedMinor: number): CashOutcome => {
  if (totalMinor < 0) throw new Error('totalMinor must be non-negative.');
  if (tenderedMinor < 0) throw new Error('tenderedMinor must be non-negative.');
  if (tenderedMinor < totalMinor) {
    throw new Error('Tendered amount is less than the total.');
  }
  return {
    method: 'cash',
    tenderedMinor,
    changeMinor: tenderedMinor - totalMinor,
  };
};

export type CardTerminalOutcome = 'approved' | 'declined' | 'cancelled' | 'timeout';

export const normalizeCardOutcome = (raw: string): CardTerminalOutcome => {
  const lc = raw.trim().toLowerCase();
  if (lc === 'approved' || lc === 'success' || lc === 'authorized') return 'approved';
  if (lc === 'declined' || lc === 'denied') return 'declined';
  if (lc === 'cancelled' || lc === 'canceled' || lc === 'aborted') return 'cancelled';
  if (lc === 'timeout' || lc === 'timed-out') return 'timeout';
  return 'declined';
};

export interface SplitTender {
  cashMinor: number;
  cardMinor: number;
}

export const validateSplitTender = (totalMinor: number, split: SplitTender): boolean => {
  if (split.cashMinor < 0 || split.cardMinor < 0) return false;
  return split.cashMinor + split.cardMinor >= totalMinor;
};
