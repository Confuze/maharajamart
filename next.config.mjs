import createNextIntlPlugin from "next-intl/plugin";
import withPlaiceholder from "@plaiceholder/next";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    minimumCacheTTL: 0,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/:locale/products/",
        destination: "/:locale/products/all/1",
        permanent: true,
      },
      {
        source: "/:locale/products/all",
        destination: "/:locale/products/all/1",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*{/}?",
        headers: [
          {
            key: "X-Accel-Buffering",
            value: "no",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(withPlaiceholder(nextConfig));
