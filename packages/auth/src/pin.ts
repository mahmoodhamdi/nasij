import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LEN = 32;
const SALT_BYTES = 16;
const SCRYPT_N = 1 << 14;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const FORMAT_VERSION = 'scrypt-pin-v1';

const PIN_RE = /^\d{4,8}$/;
const SEQUENTIAL = ['01234567', '12345678', '23456789', '0123456789'];
const REPEAT_RE = /^(\d)\1+$/;

export interface PinValidationIssue {
  code: 'invalid-format' | 'repeated-digits' | 'sequential';
  message: string;
}

export const validatePin = (pin: string): PinValidationIssue[] => {
  const issues: PinValidationIssue[] = [];
  if (!PIN_RE.test(pin)) {
    issues.push({ code: 'invalid-format', message: 'PIN must be 4–8 digits.' });
    return issues;
  }
  if (REPEAT_RE.test(pin)) {
    issues.push({ code: 'repeated-digits', message: 'PIN cannot be all the same digit.' });
  }
  if (SEQUENTIAL.some((seq) => seq.includes(pin) || seq.split('').reverse().join('').includes(pin))) {
    issues.push({ code: 'sequential', message: 'PIN must not be sequential.' });
  }
  return issues;
};

export const hashPin = (pin: string): string => {
  const issues = validatePin(pin);
  if (issues.length > 0) {
    throw new Error(`Weak PIN: ${issues.map((i) => i.code).join(',')}`);
  }
  const salt = randomBytes(SALT_BYTES);
  const derived = scryptSync(pin, salt, KEY_LEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
  return `${FORMAT_VERSION}$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString('hex')}$${derived.toString('hex')}`;
};

export const verifyPin = (pin: string, storedHash: string): boolean => {
  const parts = storedHash.split('$');
  if (parts.length !== 6) return false;
  const [version, nStr, rStr, pStr, saltHex, expectedHex] = parts;
  if (version !== FORMAT_VERSION) return false;
  if (!nStr || !rStr || !pStr || !saltHex || !expectedHex) return false;
  const n = Number(nStr);
  const r = Number(rStr);
  const p = Number(pStr);
  if (!Number.isFinite(n) || !Number.isFinite(r) || !Number.isFinite(p)) return false;
  let derived: Buffer;
  try {
    derived = scryptSync(pin, Buffer.from(saltHex, 'hex'), KEY_LEN, { N: n, r, p });
  } catch {
    return false;
  }
  const expected = Buffer.from(expectedHex, 'hex');
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(derived, expected);
};
