import createNextIntlPlugin from "next-intl/plugin";
import withPlaiceholder from "@plaiceholder/next";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default withNextIntl(withPlaiceholder(nextConfig));
