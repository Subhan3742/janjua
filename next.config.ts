import type { NextConfig } from "next";

/** Allow Supabase Storage to serve gallery images through next/image. */
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
    /**
     * The placeholder artwork in /public/images is vector. These files are
     * authored in this repo (scripts/generate-placeholders.mjs), and the
     * sandbox CSP below stops any SVG from executing script when rendered
     * through the optimizer.
     */
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  poweredByHeader: false,
};

export default nextConfig;
