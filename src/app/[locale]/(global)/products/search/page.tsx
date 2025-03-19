import { getLocale, getTranslations } from "next-intl/server";
import { products } from "@/src/data/products";
import ProductCard from "@/src/components/ProductCard";
import { localeType } from "@/src/i18n/routing";
import { miniSearch } from "@/src/lib/minisearch";

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;

  if (typeof q !== "string" || q == "") return "400 bad request";

  const locale = (await getLocale()) as localeType;
  const t = await getTranslations("Search");
  const t2 = await getTranslations("Category");

  const results = miniSearch.search(q, { prefix: true, fuzzy: 0.2 });

  return (
    <>
      <h1 className="font-serif text-center lg:text-left lg:pl-20 text-4xl lg:text-5xl text-secondary my-8">
        {t("title")}: {q}
      </h1>
      <div className="w-full gap-4 lg:gap-8 overflow-hidden px-4 lg:px-20 -w-full grid auto-rows-min grid-cols-2 lg:grid-cols-5">
        {results.map((result, index) => {
          const product = products[result.category].products[result.slug];
          return (
            <div key={index}>
              <ProductCard
                locale={locale}
                product={{
                  ...product,
                  category: result.category as string,
                  slug: result.slug as string,
                }}
              />
            </div>
          );
        }) || t2("noProudcts")}
      </div>
    </>
  );
}
