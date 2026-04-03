import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
        port: '',
        pathname: '/igdb/**',
      },
      {
        protocol: 'https',
        hostname: '**.igdb.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
