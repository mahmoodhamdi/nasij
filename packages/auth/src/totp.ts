import { createHmac, randomBytes } from 'node:crypto';

const TOTP_STEP_SECONDS = 30;
const TOTP_DIGITS = 6;
const SECRET_BYTES = 20;

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const base32Encode = (buffer: Uint8Array): string => {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      out += BASE32_ALPHABET[(value >>> bits) & 0b11111];
    }
  }
  if (bits > 0) {
    out += BASE32_ALPHABET[(value << (5 - bits)) & 0b11111];
  }
  return out;
};

const base32Decode = (encoded: string): Uint8Array => {
  const cleaned = encoded.replace(/=+$/g, '').toUpperCase();
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of cleaned) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) {
      throw new Error('Invalid base32 character.');
    }
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((value >>> bits) & 0xff);
    }
  }
  return Uint8Array.from(bytes);
};

export const generateTotpSecret = (): string => base32Encode(randomBytes(SECRET_BYTES));

const hotp = (secret: Uint8Array, counter: bigint): string => {
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(counter);
  const hmac = createHmac('sha1', Buffer.from(secret)).update(counterBuffer).digest();
  const offset = hmac[hmac.length - 1]! & 0x0f;
  const binary =
    ((hmac[offset]! & 0x7f) << 24) |
    ((hmac[offset + 1]! & 0xff) << 16) |
    ((hmac[offset + 2]! & 0xff) << 8) |
    (hmac[offset + 3]! & 0xff);
  return String(binary % 10 ** TOTP_DIGITS).padStart(TOTP_DIGITS, '0');
};

export const generateTotpCode = (
  secret: string,
  now: Date = new Date(),
  stepSeconds: number = TOTP_STEP_SECONDS,
): string => {
  const counter = BigInt(Math.floor(now.getTime() / 1000 / stepSeconds));
  return hotp(base32Decode(secret), counter);
};

export const verifyTotpCode = (
  secret: string,
  code: string,
  now: Date = new Date(),
  options: { window?: number; stepSeconds?: number } = {},
): boolean => {
  const { window = 1, stepSeconds = TOTP_STEP_SECONDS } = options;
  if (!/^\d+$/.test(code) || code.length !== TOTP_DIGITS) return false;
  const decoded = base32Decode(secret);
  const baseCounter = BigInt(Math.floor(now.getTime() / 1000 / stepSeconds));
  for (let i = -window; i <= window; i += 1) {
    const expected = hotp(decoded, baseCounter + BigInt(i));
    if (expected === code) return true;
  }
  return false;
};
