import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración de imágenes
  images: {
    domains: [
      'assets.coingecko.com',
      'coin-images.coingecko.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Optimizaciones experimentales
  experimental: {
    optimizePackageImports: ['framer-motion', '@heroicons/react'],
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
