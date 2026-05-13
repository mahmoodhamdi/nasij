import { describe, it, expect } from 'vitest';

import { generateId, isId } from './ids.js';

describe('generateId', () => {
  it('returns a string with the requested prefix', () => {
    const id = generateId('usr');
    expect(id.startsWith('usr_')).toBe(true);
  });

  it('returns a stable shape (prefix + underscore + 26 base32 chars)', () => {
    const id = generateId('ord');
    expect(id).toMatch(/^ord_[0-9A-Z]{26}$/);
  });

  it('does not collide across many calls', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => generateId('prd')));
    expect(ids.size).toBe(1000);
  });

  it.each(['', 'A', 'too-long-prefix', '1usr', 'usr-'])(
    'rejects invalid prefix %p',
    (prefix) => {
      expect(() => generateId(prefix)).toThrow();
    },
  );
});

describe('isId', () => {
  it('accepts a well-formed id', () => {
    expect(isId(generateId('usr'))).toBe(true);
  });

  it('accepts an id matching the expected prefix', () => {
    const id = generateId('ord');
    expect(isId(id, 'ord')).toBe(true);
  });

  it('rejects an id with the wrong prefix when one is required', () => {
    const id = generateId('ord');
    expect(isId(id, 'usr')).toBe(false);
  });

  it('rejects strings without an underscore', () => {
    expect(isId('justastring')).toBe(false);
  });

  it('rejects empty prefix', () => {
    expect(isId('_AAAAAAAAAAAAAAAAAAAAAAAAAA')).toBe(false);
  });

  it('rejects body containing lowercase or invalid characters', () => {
    expect(isId('usr_lowercasebodybodybodybod')).toBe(false);
    expect(isId('usr_!@#$$$$$$$$$$$$$$$$$$$$')).toBe(false);
  });

  it('rejects body of wrong length', () => {
    expect(isId('usr_TOO_SHORT')).toBe(false);
    expect(isId(`usr_${'A'.repeat(50)}`)).toBe(false);
  });

  it('rejects an invalid prefix (e.g. uppercase) regardless of body', () => {
    expect(isId('USR_AAAAAAAAAAAAAAAAAAAAAAAAAA')).toBe(false);
  });
});
