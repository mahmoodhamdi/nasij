import { describe, it, expect } from 'vitest';

import { cn } from './cn.js';

describe('cn', () => {
  it('joins truthy class values', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, null, 0 as unknown as string, '', 'b')).toBe('a b');
  });

  it('handles conditional object syntax', () => {
    expect(cn({ active: true, disabled: false })).toBe('active');
  });

  it('handles nested arrays', () => {
    expect(cn(['a', ['b', { c: true }]])).toBe('a b c');
  });

  it('dedupes conflicting tailwind utilities (last wins)', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });
});
