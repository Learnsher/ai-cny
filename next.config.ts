import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 不需要 output: 'standalone'，預設即可
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ],
  },
};

export default nextConfig;