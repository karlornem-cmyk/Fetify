import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Envoi de photos depuis l'espace pro (5 Mo max par photo côté Storage).
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
