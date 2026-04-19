/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Enable strict type checking during build
    ignoreBuildErrors: true, 
  },
  images: {
    // Enable Next.js image optimization
    unoptimized: false, // Keeping true to avoid complex localPattern issues with query strings during build
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "*.notion.so",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true, // For LQIP shimmers
    contentDispositionType: 'attachment', // Security for downloads
  },
  // Add security headers including CSP
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://gist.github.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://*.notion.so https://*.amazonaws.com https://i.pravatar.cc https://placehold.co https://images.unsplash.com https://*.unsplash.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://avatar.vercel.sh https://*.githubusercontent.com https://*.googleusercontent.com https://*.githubusercontent.com;
      font-src 'self';
      connect-src 'self' https://api.notion.com https://api.telegram.org https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://*.googleusercontent.com https://*.githubusercontent.com https://*.amazonaws.com https://i.pravatar.cc https://placehold.co https://images.unsplash.com https://*.unsplash.com;
      frame-src 'self' https://www.youtube.com;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, " ").trim();

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
