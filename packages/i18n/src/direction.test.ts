import { describe, it, expect } from 'vitest';

import { directionFor, isRtl } from './direction.js';

describe('directionFor', () => {
  it('returns rtl for Arabic', () => {
    expect(directionFor('ar')).toBe('rtl');
  });

  it('returns ltr for English', () => {
    expect(directionFor('en')).toBe('ltr');
  });
});

describe('isRtl', () => {
  it('is true only for Arabic', () => {
    expect(isRtl('ar')).toBe(true);
    expect(isRtl('en')).toBe(false);
  });
});
