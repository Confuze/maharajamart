import { getTranslations, setRequestLocale } from "next-intl/server";
import ProductCard from "@/src/components/ProductCard";
import { localeType } from "@/src/i18n/routing";
import { miniSearch } from "@/src/lib/minisearch";
import prisma from "@/src/lib/prisma";

export const dynamic = "auto";

export default async function Search({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: localeType }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { q } = await searchParams;

  if (typeof q !== "string" || q == "") return "400 bad request";

  const t = await getTranslations("Search");
  const t2 = await getTranslations("Category");

  const results = miniSearch.search(q, { prefix: true, fuzzy: 0.2 });

  return (
    <>
      <h1 className="font-serif text-center lg:text-left lg:pl-20 text-4xl lg:text-5xl text-secondary my-8">
        {t("title")}: {q}
      </h1>
      <div className="w-full gap-4 lg:gap-8 overflow-hidden px-4 lg:px-20 -w-full grid auto-rows-min grid-cols-2 lg:grid-cols-5">
        {results.map(async (result, index) => {
          const product = await prisma.product.findUnique({
            where: { id: result.id },
            include: { category: true },
          });
          if (!product) return;
          return (
            <div key={index}>
              <ProductCard locale={locale} product={product} />
            </div>
          );
        }) || t2("noProudcts")}
      </div>
    </>
  );
}
