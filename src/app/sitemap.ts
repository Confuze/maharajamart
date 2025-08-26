import type { MetadataRoute } from "next";
import prisma from "../lib/prisma";

function genSite(
  route: string,
  changeFrequency?:
    | "yearly"
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "never",
  priority?: number,
) {
  return {
    url: `${process.env.PUBLIC_URL}/${route}`,
    lastModified: new Date(),
    changeFrequency: changeFrequency || "monthly",
    priority: priority || 0.5,
    alternatives: {
      languages: {
        pl: `${process.env.PUBLIC_URL}/pl/${route}`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productCount = await prisma.product.count({
    where: { archived: false },
  });
  const pageCount = Math.ceil(productCount / 50);

  const categories = await prisma.category.findMany({
    where: { archived: false },
    select: { slug: true },
  });

  const products = await prisma.product.findMany({
    select: { slug: true, category: { select: { slug: true } } },
  });

  return [
    genSite("", "monthly", 1),
    genSite("about", "monthly", 0.7),
    genSite("branches", "monthly", 0.7),
    genSite("cart", "always", 0),
    genSite("checkout", "always", 0),
    genSite("order-cancellation", "always", 0.8),
    genSite("payment/redirect", "always", 0),
    genSite("payment/success", "never", 0),
    genSite("products/search", "always", 0.25),
    ...[...Array(pageCount).keys()].map((i) => {
      return genSite(`products/all/${i + 1}`, "weekly", i === 0 ? 0.8 : 0.35);
    }),
    ...categories.map((category) => {
      return genSite(`products/${category.slug}/`, "weekly", 0.7);
    }),
    ...products.map((product) => {
      return genSite(
        `products/${product.category.slug}/${product.slug}`,
        "weekly",
      );
    }),
  ];
}
