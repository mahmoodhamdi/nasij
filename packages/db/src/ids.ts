import { randomUUID } from 'node:crypto';

/**
 * Prefixed IDs: `usr_…`, `ord_…`, `prd_…` — easy to recognize in logs and admin UIs,
 * not enumerable, and small enough to use as primary keys.
 *
 * Format: `<prefix>_<26-char crockford base32 of 128 random bits>`.
 *
 * We render UUIDv4 hex without dashes, then encode as Crockford base32 (no I/L/O/U)
 * so the output is human-distinguishable and url-safe.
 */
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

const hexToBytes = (hex: string): Uint8Array => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

const toCrockford = (bytes: Uint8Array): string => {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      out += ALPHABET[(value >>> bits) & 0b11111];
    }
  }
  if (bits > 0) {
    out += ALPHABET[(value << (5 - bits)) & 0b11111];
  }
  return out;
};

const PREFIX_RE = /^[a-z]{2,6}$/;
const ID_BODY_RE = /^[0-9A-Z]{26}$/;

export const generateId = (prefix: string): string => {
  if (!PREFIX_RE.test(prefix)) {
    throw new Error(`Invalid ID prefix "${prefix}" (expected 2-6 lowercase letters).`);
  }
  const hex = randomUUID().replaceAll('-', '');
  const bytes = hexToBytes(hex);
  return `${prefix}_${toCrockford(bytes).slice(0, 26)}`;
};

export const isId = (value: string, prefix?: string): boolean => {
  const sep = value.indexOf('_');
  if (sep < 1) return false;
  const head = value.slice(0, sep);
  const body = value.slice(sep + 1);
  if (!PREFIX_RE.test(head)) return false;
  if (!ID_BODY_RE.test(body)) return false;
  if (prefix !== undefined && head !== prefix) return false;
  return true;
};
