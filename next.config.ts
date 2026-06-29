import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
  async redirects() {
    return [
      // Route static prototype booking CTAs into the wired Next.js wizard.
      {
        source: "/booking.html",
        destination: "/book",
        permanent: false,
      },
      // Route static prototype dashboard into the wired Next.js app (Clerk auth + Supabase).
      {
        source: "/dashboard.html",
        destination: "/dashboard",
        permanent: false,
      },
      // Deprecate legacy admin routes in favour of /ops.
      {
        source: "/admin",
        destination: "/ops",
        permanent: false,
      },
      {
        source: "/admin/:path*",
        destination: "/ops",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
