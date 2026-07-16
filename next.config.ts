import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
  },
  async redirects() {
    return [
      // /about merged into the homepage: its sections live at /#story now.
      {
        source: "/about",
        destination: "/#story",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
