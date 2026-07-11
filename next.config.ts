import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compress responses with gzip + brotli (Vercel already does this, but
  // enables it for self-hosted / preview deploys too).
  compress: true,
  // Keep heavy 3D deps server-side-only where possible — they ship to the
  // client bundle anyway via the Canvas, but this prevents accidental SSR
  // evaluation of three.js / postprocessing modules.
  experimental: {
    optimizePackageImports: ["@react-three/drei", "@react-three/fiber"],
  },
  // Aggressive static optimization for the marketing shell — only page.tsx
  // is dynamic (client component), so the rest can prerender.
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
