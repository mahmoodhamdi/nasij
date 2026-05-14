import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LEN = 64;
const SALT_BYTES = 16;
const SCRYPT_N = 1 << 15; // 32k cost factor — adjust per benchmark
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_MAX_MEM = 128 * SCRYPT_N * SCRYPT_R * 2;
const FORMAT_VERSION = 'scrypt-v1';

const MIN_LEN = 12;
const COMMON_WEAK = new Set([
  'password',
  '12345678',
  '123456789',
  'qwerty',
  'letmein',
  'welcome',
  'admin1234',
  'iloveyou',
]);

export interface PasswordStrengthIssue {
  code:
    | 'too-short'
    | 'missing-lowercase'
    | 'missing-uppercase'
    | 'missing-digit'
    | 'missing-symbol'
    | 'too-common';
  message: string;
}

export const validatePasswordStrength = (password: string): PasswordStrengthIssue[] => {
  const issues: PasswordStrengthIssue[] = [];
  if (password.length < MIN_LEN) {
    issues.push({ code: 'too-short', message: `Password must be at least ${MIN_LEN} characters.` });
  }
  if (!/[a-z]/.test(password)) {
    issues.push({ code: 'missing-lowercase', message: 'Must include a lowercase letter.' });
  }
  if (!/[A-Z]/.test(password)) {
    issues.push({ code: 'missing-uppercase', message: 'Must include an uppercase letter.' });
  }
  if (!/\d/.test(password)) {
    issues.push({ code: 'missing-digit', message: 'Must include a digit.' });
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    issues.push({ code: 'missing-symbol', message: 'Must include a symbol.' });
  }
  if (COMMON_WEAK.has(password.toLowerCase())) {
    issues.push({ code: 'too-common', message: 'Password is too common.' });
  }
  return issues;
};

export const hashPassword = (password: string): string => {
  const issues = validatePasswordStrength(password);
  if (issues.length > 0) {
    throw new Error(`Weak password: ${issues.map((i) => i.code).join(',')}`);
  }
  const salt = randomBytes(SALT_BYTES);
  const derived = scryptSync(password, salt, KEY_LEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P, maxmem: SCRYPT_MAX_MEM });
  return `${FORMAT_VERSION}$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString('hex')}$${derived.toString('hex')}`;
};

export const verifyPassword = (password: string, storedHash: string): boolean => {
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
    derived = scryptSync(password, Buffer.from(saltHex, 'hex'), KEY_LEN, { N: n, r, p, maxmem: 128 * n * r * 2 });
  } catch {
    return false;
  }
  const expected = Buffer.from(expectedHex, 'hex');
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(derived, expected);
};
