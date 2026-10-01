import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/alimentos/:path*',
        destination: '/:path*',
      },
      {
        source: '/alimentos',
        destination: '/',
      },
    ];
  },
};

export default nextConfig;
