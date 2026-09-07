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
  async redirects() {
    return [
      // The old Vercel-assigned URL still resolves (Vercel keeps it as an
      // alias) — redirect it to the real domain so visitors, old links, and
      // search engines converge on one canonical host instead of splitting
      // signals across two working URLs for the same content.
      {
        source: "/:path*",
        has: [{ type: "host", value: "tshabu-productions.vercel.app" }],
        destination: "https://tshabuproductions.co.za/:path*",
        permanent: true,
      },
      // Same reasoning for www — one canonical host (the bare apex domain).
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.tshabuproductions.co.za" }],
        destination: "https://tshabuproductions.co.za/:path*",
        permanent: true,
      },
    ];
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
