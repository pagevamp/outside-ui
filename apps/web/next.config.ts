import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    serverComponentsHmrCache: true,
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
