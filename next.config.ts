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
    // ── Render fix: bypass /_next/image proxy ───────────────────────────────
    // Cloudinary & Unsplash already serve CDN-optimised images. Re-processing
    // them on Render's limited CPU causes 500/504 errors. Serve URLs directly.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
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
        source: '/api/products',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=600' },
        ],
      },
    ];
  },
};

export default nextConfig;
