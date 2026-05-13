/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { typedRoutes: true },
  transpilePackages: ['@nasij/ui', '@nasij/i18n', '@nasij/auth', '@nasij/api', '@nasij/db'],
};

export default nextConfig;
