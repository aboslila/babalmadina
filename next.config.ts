import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Without this, Next.js walks up and finds a stray lockfile in the user's
  // home directory, then treats that as the workspace root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
