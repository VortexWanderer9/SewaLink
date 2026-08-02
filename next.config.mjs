/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "sewalink-storage.nyc3.cdn.digitaloceanspaces.com" },
      { protocol: "https", hostname: "sewalink-storage.sgp1.cdn.digitaloceanspaces.com" },
      { protocol: "https", hostname: "cdn.sewalinknepal.com" },
      { protocol: "https", hostname: "**.gravatar.com" },
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
};

export default nextConfig;
