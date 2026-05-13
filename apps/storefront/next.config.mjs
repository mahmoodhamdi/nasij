// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    typedRoutes: true,
  },
  transpilePackages: ['@nasij/ui', '@nasij/i18n', '@nasij/auth', '@nasij/api', '@nasij/db'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
