export const namespaces = [
  'common',
  'storefront',
  'admin',
  'pos',
  'auth',
  'checkout',
  'email',
  'errors',
] as const;

export type Namespace = (typeof namespaces)[number];
