import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  cacheComponents: true,
  logging: {
    browserToTerminal: "warn",
    fetches: {
      fullUrl: true,
    },
  },
  typedRoutes: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
    typedEnv: true,
  },
};

export default nextConfig;
