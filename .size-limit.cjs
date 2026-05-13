/**
 * Bundle-size budgets enforced in CI. Pulled from per-app build outputs after
 * `pnpm build`. Adjust budgets only by raising tickets with rationale.
 */
module.exports = [
  {
    name: 'storefront / route shell (gz)',
    path: 'apps/storefront/.next/static/chunks/main-*.js',
    gzip: true,
    limit: '70 KB',
  },
  {
    name: 'storefront / framework chunk (gz)',
    path: 'apps/storefront/.next/static/chunks/framework-*.js',
    gzip: true,
    limit: '50 KB',
  },
  {
    name: 'admin / route shell (gz)',
    path: 'apps/admin/.next/static/chunks/main-*.js',
    gzip: true,
    limit: '80 KB',
  },
  {
    name: 'pos / entry (gz)',
    path: 'apps/pos/dist/assets/index-*.js',
    gzip: true,
    limit: '120 KB',
  },
];
