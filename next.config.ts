import type { NextConfig } from "next";

const THREE_SCENE_REGEX = /src[\\/]+components[\\/]+three[\\/]+/;

const nextConfig: NextConfig = {
  webpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.module.rules.push({
        test: /\.(jsx|tsx)$/,
        exclude: [/node_modules/, THREE_SCENE_REGEX],
        enforce: "pre",
        use: "@dyad-sh/nextjs-webpack-component-tagger",
      });
    }
    return config;
  },
};

export default nextConfig;