import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Drops the "X-Powered-By: Next.js" response header — no functional
  // value to visitors, just free reconnaissance for an attacker.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        // Matches any Supabase project's storage domain, so this keeps
        // working regardless of which project ref is configured in env.
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stops the browser from guessing content types away from what
          // the server declared — a classic vector for turning an
          // uploaded/served file into executable script.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Blocks this site (dashboard included) from being framed by
          // another site, which is what clickjacking relies on.
          { key: "X-Frame-Options", value: "DENY" },
          // Sends the full referrer to same-origin navigations (useful for
          // analytics) but only the origin, not the full path/query, to
          // other sites — avoids leaking e.g. a gallery slug or search
          // params to third-party destinations.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Explicitly denies access to device APIs this site never uses.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
