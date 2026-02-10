import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Limit the number of workers to prevent database connection exhaustion
    cpus: 1,
    workerThreads: false,
  },
};

export default nextConfig;
