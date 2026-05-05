import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["@neondatabase/serverless"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
}

export default nextConfig