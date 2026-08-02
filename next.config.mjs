/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sewalink-storage.nyc3.cdn.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "sewalink-storage.sgp1.cdn.digitaloceanspaces.com",
      },
      { protocol: "https", hostname: "cdn.sewalinknepal.com" },
      { protocol: "https", hostname: "*.gravatar.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async rewrites() {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
    const realtimeUrl =
      process.env.NEXT_PUBLIC_REALTIME_URL || "http://localhost:3001";

    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiUrl}/:path*`,
      },
      {
        source: "/notifications/:path*",
        destination: `${realtimeUrl}/notifications/:path*`,
      },
      {
        source: "/chat/:path*",
        destination: `${realtimeUrl}/chat/:path*`,
      },
    ];
  },
};

export default nextConfig;
