import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    domains: ['images.unsplash.com', 'utfs.io'],
  },
};

export default nextConfig;