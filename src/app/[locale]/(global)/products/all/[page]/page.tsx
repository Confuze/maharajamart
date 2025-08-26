import prisma from "@/src/lib/prisma";
import ProductCard from "@/src/components/ProductCard";
import { localeType } from "@/src/i18n/routing";
import { parseInt } from "lodash";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";

export async function generateStaticParams() {
  const productCount = await prisma.product.count({
    where: { archived: false },
  });
  const pageCount = Math.ceil(productCount / 50);

  const params = [...Array(pageCount).keys()].map((i) => {
    return {
      page: (i + 1).toString(),
    };
  });

  return params;
}

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

export default async function Products({
  params,
}: {
  params: Promise<{ page: string; locale: localeType }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const q = (await params).page || "1";
  const page = parseInt(q) || 1;

  const productCount = await prisma.product.count({
    where: { archived: false },
  });
  const pageCount = Math.ceil(productCount / 50);

  const t = await getTranslations("Layout.nav");
  const t2 = await getTranslations("Category");

  const products = await prisma.product.findMany({
    where: { archived: false },
    include: { category: true },
    take: 50,
    skip: (page - 1) * 50,
  });

  return (
    <>
      <h1 className="font-serif text-center lg:text-left lg:pl-20 text-4xl lg:text-5xl text-secondary my-8">
        {t("allProducts")}
      </h1>
      <div className="w-full gap-4 lg:gap-8 overflow-hidden px-4 lg:px-20 -w-full grid auto-rows-min grid-cols-2 lg:grid-cols-5">
        <Suspense fallback={<p>{t2("loading")}</p>}>
          {products.map((product) => {
            return (
              <div key={product.id}>
                <ProductCard locale={locale} product={product} />
              </div>
            );
          })}
        </Suspense>
      </div>
      <Pagination className="mt-8 w-full">
        <PaginationContent className="flex justify-center w-full gap-6">
          <PaginationPrevious
            href={`/products/all/${page - 1}`}
            isActive={page !== 1}
          />

          <p>{t2("pagination", { index: page, pageCount: pageCount })}</p>

          <PaginationNext
            href={`/products/all/${page + 1}`}
            isActive={page !== pageCount}
          />
        </PaginationContent>
      </Pagination>
    </>
  );
}
