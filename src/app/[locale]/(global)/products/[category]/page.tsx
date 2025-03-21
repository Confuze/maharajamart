// TODO: Sorting maybe?
// TODO: Search

import ProductCard from "@/src/components/ProductCard";
import { products } from "@/src/data/products";
import { localeType } from "@/src/i18n/routing";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

export function generateStaticParams() {
  return Object.keys(products).map((key) => ({
    category: key,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: localeType; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;

  return {
    title: products[category].displayName[locale],
  };
}

export default function Category({
  params,
}: {
  params: Promise<{ locale: localeType; category: string }>;
}) {
  const { locale, category } = use(params);
  setRequestLocale(locale);
  const catProducts = products[category].products;
  const t = useTranslations("Category");

  return (
    <>
      <h1 className="font-serif text-center lg:text-left lg:pl-20 text-4xl lg:text-5xl text-secondary my-8">
        {products[category].displayName[locale]}
      </h1>
      <div className="w-full gap-4 lg:gap-8 overflow-hidden px-4 lg:px-20 -w-full grid auto-rows-min grid-cols-2 lg:grid-cols-5">
        {Object.keys(catProducts).map((key, index) => {
          const product = catProducts[key];

          return (
            <div key={index}>
              <ProductCard
                locale={locale}
                product={{
                  ...product,
                  category: category,
                  slug: key,
                }}
              />
            </div>
          );
        }) || t("noProudcts")}
      </div>
    </>
  );
}
