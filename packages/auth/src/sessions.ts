import { createHash, randomBytes } from 'node:crypto';

const TOKEN_BYTES = 32;
export const defaultSessionTtlMs = 30 * 24 * 60 * 60 * 1000;

export const generateSessionToken = (): string => randomBytes(TOKEN_BYTES).toString('base64url');

export const hashSessionToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');

export const sessionExpiry = (now: Date, ttlMs: number = defaultSessionTtlMs): Date =>
  new Date(now.getTime() + ttlMs);

export const isSessionExpired = (expiresAt: Date, now: Date = new Date()): boolean =>
  expiresAt.getTime() <= now.getTime();
