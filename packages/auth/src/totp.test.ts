import { describe, it, expect } from 'vitest';

import { generateTotpCode, generateTotpSecret, verifyTotpCode } from './totp.js';

const FIXED_TIME = new Date('2026-01-01T00:00:00Z');

describe('generateTotpSecret', () => {
  it('produces a base32 string', () => {
    const s = generateTotpSecret();
    expect(s).toMatch(/^[A-Z2-7]+$/);
  });

  it('does not repeat across many calls', () => {
    const set = new Set(Array.from({ length: 200 }, () => generateTotpSecret()));
    expect(set.size).toBe(200);
  });
});

describe('generateTotpCode', () => {
  it('produces 6 digits for a known secret', () => {
    const code = generateTotpCode('JBSWY3DPEHPK3PXP', FIXED_TIME);
    expect(code).toMatch(/^\d{6}$/);
  });

  it('produces the same code within the same step', () => {
    const secret = generateTotpSecret();
    expect(generateTotpCode(secret, FIXED_TIME)).toBe(
      generateTotpCode(secret, new Date(FIXED_TIME.getTime() + 5000)),
    );
  });
});

describe('verifyTotpCode', () => {
  const SECRET = generateTotpSecret();

  it('accepts the current code', () => {
    const code = generateTotpCode(SECRET, FIXED_TIME);
    expect(verifyTotpCode(SECRET, code, FIXED_TIME)).toBe(true);
  });

  it('accepts a code from the previous step within window', () => {
    const past = new Date(FIXED_TIME.getTime() - 30_000);
    const code = generateTotpCode(SECRET, past);
    expect(verifyTotpCode(SECRET, code, FIXED_TIME, { window: 1 })).toBe(true);
  });

  it('rejects a code outside the window', () => {
    const farPast = new Date(FIXED_TIME.getTime() - 5 * 60_000);
    const code = generateTotpCode(SECRET, farPast);
    expect(verifyTotpCode(SECRET, code, FIXED_TIME, { window: 1 })).toBe(false);
  });

  it('rejects malformed input', () => {
    expect(verifyTotpCode(SECRET, 'abcdef', FIXED_TIME)).toBe(false);
    expect(verifyTotpCode(SECRET, '12345', FIXED_TIME)).toBe(false);
    expect(verifyTotpCode(SECRET, '1234567', FIXED_TIME)).toBe(false);
  });

  it('respects a custom step', () => {
    const code = generateTotpCode(SECRET, FIXED_TIME, 60);
    expect(verifyTotpCode(SECRET, code, FIXED_TIME, { stepSeconds: 60 })).toBe(true);
  });

  it('throws on invalid base32 secret', () => {
    expect(() => generateTotpCode('!!!', FIXED_TIME)).toThrow();
  });
});
