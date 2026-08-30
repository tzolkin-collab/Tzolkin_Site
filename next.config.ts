import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
  },
  async redirects() {
    return [
      {
        source: '/serviços',
        destination: '/servicos',
        permanent: true,
      },
      {
        source: '/servi%C3%A7os',
        destination: '/servicos',
        permanent: true,
      },
      {
        source: '/produtos',
        destination: '/servicos',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
