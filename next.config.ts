import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  async rewrites() {
    const backendUrl = (process.env.LARAVEL_BACKEND_URL || "http://host.docker.internal:8000").replace(/\/$/, "");
    return [
      {
        source: "/backend/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/backend/sanctum/csrf-cookie",
        destination: `${backendUrl}/sanctum/csrf-cookie`,
      },
      {
        source: "/storage/:path*",
        destination: `${backendUrl}/storage/:path*`,
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
