// TODO: Add subtitle for each category (not yet sure if this is a good idea)

import ProductCard from "@/src/components/ProductCard";
import { products } from "@/src/data/products";
import { localeType } from "@/src/i18n/routing";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense, use } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Layout.nav" });
  return {
    title: t("allProducts"),
  };
}

export default function Products({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Layout.nav");
  const t2 = useTranslations("Category");

  return (
    <>
      <h1 className="font-serif text-center lg:text-left lg:pl-20 text-4xl lg:text-5xl text-secondary my-8">
        {t("allProducts")}
      </h1>
      <div className="w-full gap-4 lg:gap-8 overflow-hidden px-4 lg:px-20 -w-full grid auto-rows-min grid-cols-2 lg:grid-cols-5">
        {Object.keys(products).map((categoryKey) => {
          const catProducts = products[categoryKey].products;
          return (
            <Suspense fallback={<p>{t2("loading")}</p>} key={categoryKey}>
              {Object.keys(catProducts).map((productKey) => {
                const product = catProducts[productKey];

                return (
                  <div key={productKey}>
                    <ProductCard
                      locale={locale}
                      product={{
                        ...product,
                        category: categoryKey,
                        slug: productKey,
                      }}
                    />
                  </div>
                );
              })}
            </Suspense>
          );
        }) || t2("noProudcts")}
      </div>
    </>
  );
}
