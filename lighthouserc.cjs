/**
 * Lighthouse CI config for the storefront.
 *
 * Runs in CI against the built Next.js app. Pages are sampled three times
 * per run; the median of the three is used to evaluate the budgets. Mobile
 * preset only (storefront is mobile-first; admin and POS are not part of
 * the Lighthouse budget).
 */
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/en',
        'http://localhost:3000/en/shop',
        'http://localhost:3000/en/p/kaftan-amber',
        'http://localhost:3000/en/cart',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'mobile',
        skipAudits: ['canonical'],
        chromeFlags: '--no-sandbox',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'interactive': ['warn', { maxNumericValue: 3000 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
