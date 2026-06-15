import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Required for Render (Node.js server) deployment ──────────────────────
  output: 'standalone',
  turbopack: {
    root: __dirname, // Silence workspace-root-detection warning
  },
  compress: true,
  poweredByHeader: false,
  images: {
    // Optimization enabled — Next.js will auto-convert to WebP/AVIF and resize
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 604800, // Cache optimized images for 7 days on Render
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      // Render deployments (covers *.onrender.com previews)
      { protocol: 'https', hostname: '**.onrender.com', pathname: '/**' },
    ],
  },
  // Aggressive HTTP caching headers
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=2592000' },
        ],
      },
      {
        source: '/api/products',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=600' },
        ],
      },
    ];
  },
};

export default nextConfig;
