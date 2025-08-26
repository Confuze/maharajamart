// TODO: Sorting maybe?

import ProductCard from "@/src/components/ProductCard";
import { getLocalisedCategory } from "@/src/data/products";
import { localeType } from "@/src/i18n/routing";
import prisma from "@/src/lib/prisma";
import { Category as CategoryType } from "@prisma/client";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const result = await prisma.category.findMany({
    where: { archived: false },
    select: { slug: true },
  });
  return result.map((category) => {
    return {
      category: category.slug,
    };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: localeType; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const categoryDocument = (await prisma.category.findUnique({
    where: { slug: category },
    select: {
      name: true,
      namePl: true,
    },
  })) as CategoryType;

  return {
    title: getLocalisedCategory(locale, categoryDocument),
  };
}

export default async function Category({
  params,
}: {
  params: Promise<{ category: string; locale: localeType }>;
}) {
  const { category, locale } = await params;

  setRequestLocale(locale);
  const categoryDocument = await prisma.category.findUnique({
    where: { slug: category },
  });
  if (!categoryDocument) return notFound();
  const catProducts = await prisma.product.findMany({
    where: { category: { id: categoryDocument.id }, archived: false },
    include: { category: true },
  });
  const t = await getTranslations("Category");

  return (
    <>
      <h1 className="font-serif text-center lg:text-left lg:pl-20 text-4xl lg:text-5xl text-secondary my-8">
        {getLocalisedCategory(locale, categoryDocument)}
      </h1>
      <div className="w-full gap-4 lg:gap-8 overflow-hidden px-4 lg:px-20 -w-full grid auto-rows-min grid-cols-2 lg:grid-cols-5">
        {catProducts.map((product) => {
          return (
            <div key={product.id}>
              <ProductCard locale={locale} product={product} />
            </div>
          );
        }) || t("noProudcts")}
      </div>
    </>
  );
}
