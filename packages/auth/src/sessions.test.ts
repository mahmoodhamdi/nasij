import { describe, it, expect } from 'vitest';

import {
  defaultSessionTtlMs,
  generateSessionToken,
  hashSessionToken,
  isSessionExpired,
  sessionExpiry,
} from './sessions.js';

describe('generateSessionToken', () => {
  it('produces a base64url token of expected length', () => {
    const token = generateSessionToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    // 32 bytes -> 43 base64url chars (no padding)
    expect(token.length).toBeGreaterThanOrEqual(40);
  });

  it('does not repeat across many calls', () => {
    const set = new Set(Array.from({ length: 200 }, () => generateSessionToken()));
    expect(set.size).toBe(200);
  });
});

describe('hashSessionToken', () => {
  it('is deterministic for the same input', () => {
    expect(hashSessionToken('abc')).toBe(hashSessionToken('abc'));
  });

  it('changes on different input', () => {
    expect(hashSessionToken('abc')).not.toBe(hashSessionToken('abd'));
  });
});

describe('sessionExpiry', () => {
  it('defaults to 30 days from now', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    const exp = sessionExpiry(now);
    expect(exp.getTime() - now.getTime()).toBe(defaultSessionTtlMs);
  });

  it('respects a custom ttl', () => {
    const now = new Date(0);
    const exp = sessionExpiry(now, 5000);
    expect(exp.getTime()).toBe(5000);
  });
});

describe('isSessionExpired', () => {
  it('is true when expiry is in the past', () => {
    expect(isSessionExpired(new Date(0), new Date(1))).toBe(true);
  });

  it('is false when expiry is in the future', () => {
    expect(isSessionExpired(new Date(10), new Date(1))).toBe(false);
  });

  it('uses now() as default', () => {
    expect(isSessionExpired(new Date(Date.now() + 1_000_000))).toBe(false);
  });
});
