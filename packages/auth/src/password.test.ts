import { describe, it, expect } from 'vitest';

import { hashPassword, validatePasswordStrength, verifyPassword } from './password.js';

const STRONG = 'Tr@v3l-Far!And-Wide';

describe('validatePasswordStrength', () => {
  it('accepts a strong password', () => {
    expect(validatePasswordStrength(STRONG)).toEqual([]);
  });

  it('flags too-short', () => {
    const issues = validatePasswordStrength('aA1!');
    expect(issues.find((i) => i.code === 'too-short')).toBeDefined();
  });

  it('flags missing-lowercase', () => {
    const issues = validatePasswordStrength('ABCDEF1234!@');
    expect(issues.find((i) => i.code === 'missing-lowercase')).toBeDefined();
  });

  it('flags missing-uppercase', () => {
    const issues = validatePasswordStrength('abcdef1234!@');
    expect(issues.find((i) => i.code === 'missing-uppercase')).toBeDefined();
  });

  it('flags missing-digit', () => {
    const issues = validatePasswordStrength('Abcdefghij!@');
    expect(issues.find((i) => i.code === 'missing-digit')).toBeDefined();
  });

  it('flags missing-symbol', () => {
    const issues = validatePasswordStrength('Abcdef1234ZZ');
    expect(issues.find((i) => i.code === 'missing-symbol')).toBeDefined();
  });

  it('flags too-common', () => {
    const issues = validatePasswordStrength('password');
    expect(issues.find((i) => i.code === 'too-common')).toBeDefined();
  });
});

describe('hashPassword & verifyPassword', () => {
  it('rejects weak input', () => {
    expect(() => hashPassword('weakpass')).toThrow();
  });

  it('produces different hashes for the same password (salt)', () => {
    const a = hashPassword(STRONG);
    const b = hashPassword(STRONG);
    expect(a).not.toBe(b);
  });

  it('verifies a correct password', () => {
    expect(verifyPassword(STRONG, hashPassword(STRONG))).toBe(true);
  });

  it('rejects an incorrect password', () => {
    expect(verifyPassword('WrongP@ss12345!', hashPassword(STRONG))).toBe(false);
  });

  it('rejects malformed stored hashes', () => {
    expect(verifyPassword(STRONG, 'not-a-hash')).toBe(false);
    expect(verifyPassword(STRONG, 'x$y$z$w$a$b$c')).toBe(false);
    expect(verifyPassword(STRONG, 'other$1$1$1$aa$bb')).toBe(false);
    expect(verifyPassword(STRONG, 'scrypt-v1$NaN$1$1$aa$bb')).toBe(false);
    expect(verifyPassword(STRONG, 'scrypt-v1$32768$8$1$$bb')).toBe(false);
  });

  it('returns false when stored hash length differs after derive', () => {
    expect(verifyPassword(STRONG, 'scrypt-v1$32768$8$1$00$00')).toBe(false);
  });

  it('catches scrypt parameter errors and returns false', () => {
    // Negative N triggers scrypt error which we catch.
    expect(verifyPassword(STRONG, 'scrypt-v1$-1$8$1$00$' + '00'.repeat(64))).toBe(false);
  });
});
