import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin-maharajamart/",
    },
    sitemap: `https://${process.env.PUBLIC_URL}/sitemap.xml`,
  };
}
