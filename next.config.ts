import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    serverActions: {
      // Le formulaire de contact accepte jusqu'à 3 pièces jointes de 3 Mo.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
