import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false, // Disable strict mode to suppress warnings
  experimental: {
    turbopack: {
      root: process.cwd(),
    },
  },
};

export default nextConfig;
