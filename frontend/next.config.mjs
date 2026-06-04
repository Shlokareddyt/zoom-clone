/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingIncludes: {
      '/**': ['./app/**/*'],
    },
  },
};

export default nextConfig;
