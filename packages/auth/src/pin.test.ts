import { describe, it, expect } from 'vitest';

import { hashPin, validatePin, verifyPin } from './pin.js';

describe('validatePin', () => {
  it('accepts a strong PIN', () => {
    expect(validatePin('8392')).toEqual([]);
  });

  it.each(['abc', '123', '123456789', ''])('rejects invalid-format %p', (pin) => {
    expect(validatePin(pin).some((i) => i.code === 'invalid-format')).toBe(true);
  });

  it('rejects repeated digits', () => {
    expect(validatePin('1111').some((i) => i.code === 'repeated-digits')).toBe(true);
  });

  it.each(['1234', '4321', '5678', '8765'])('rejects sequential %p', (pin) => {
    expect(validatePin(pin).some((i) => i.code === 'sequential')).toBe(true);
  });
});

describe('hashPin & verifyPin', () => {
  it('rejects a weak PIN at hash time', () => {
    expect(() => hashPin('1111')).toThrow();
  });

  it('verifies a correct PIN', () => {
    const h = hashPin('8392');
    expect(verifyPin('8392', h)).toBe(true);
  });

  it('rejects an incorrect PIN', () => {
    expect(verifyPin('0000', hashPin('8392'))).toBe(false);
  });

  it('returns false on malformed stored hash', () => {
    expect(verifyPin('8392', 'nonsense')).toBe(false);
    expect(verifyPin('8392', 'a$b$c$d$e$f$g')).toBe(false);
    expect(verifyPin('8392', 'wrong$16384$8$1$aa$bb')).toBe(false);
    expect(verifyPin('8392', 'scrypt-pin-v1$NaN$8$1$aa$bb')).toBe(false);
    expect(verifyPin('8392', 'scrypt-pin-v1$16384$8$1$$bb')).toBe(false);
  });

  it('returns false when derived length differs', () => {
    expect(verifyPin('8392', 'scrypt-pin-v1$16384$8$1$00$00')).toBe(false);
  });

  it('catches scrypt errors and returns false', () => {
    expect(verifyPin('8392', 'scrypt-pin-v1$-1$8$1$00$' + '00'.repeat(32))).toBe(false);
  });
});
