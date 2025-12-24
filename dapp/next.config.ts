import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@fatsolutions/tongo-sdk"],
  /* config options here */
  webpack: (config) => {
    // Fix for packages using ESM imports with .js extensions for .ts files
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
    };
    return config;
  },
};

export default nextConfig;
