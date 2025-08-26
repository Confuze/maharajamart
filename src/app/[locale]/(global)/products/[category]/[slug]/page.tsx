// TODO: pagination IF there are many more products

import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import placeholder from "@/public/picturePlaceholder.png";
import ProductForm from "@/src/components/ProductForm";
import ProductCard from "@/src/components/ProductCard";
import prisma from "@/src/lib/prisma";
import { getLocalisedName } from "@/src/data/products";
import { localeType } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true, category: { select: { slug: true } } },
  });

  return products.map((product) => {
    return {
      category: product.category.slug,
      slug: product.slug,
    };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const locale = (await getLocale()) as localeType;
  const product = await prisma.product.findUnique({
    where: { slug: slug, category: { slug: category } },
  })!;

  if (!product) return notFound();

  return {
    title: getLocalisedName(locale, product),
  };
}

export default async function Product({
  params,
}: {
  params: Promise<{ category: string; slug: string; locale: localeType }>;
}) {
  const { category, slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Layout.products");
  const t2 = await getTranslations("Category");
  const product = await prisma.product.findUnique({
    where: { slug: slug, category: { slug: category } },
    include: { category: true },
  });
  if (!product) return notFound();

  const productsCount = await prisma.product.count({
    where: {
      category: { slug: category },
      archived: false,
    },
  });
  const skip = Math.floor(Math.random() * (productsCount - 4));
  const suggested = await prisma.product.findMany({
    where: {
      category: { slug: category },
      archived: false,
      id: { not: product.id },
    },
    skip: skip,
    take: 4,
    include: { category: true },
  });

  return (
    <div className="p-8 lg:p-0 pt-8 lg:flex lg:justify-center">
      <div className="lg:w-3/5">
        <section className="gap-4 lg:gap-20 flex justify-center flex-col lg:flex-row">
          {(product.imageUrl || product.imageStoredInFs) && (
            <div className="relative lg:basis-2/5 h-[30vh] lg:h-[70vh] border-4 overflow-hidden border-secondary rounded-3xl">
              <Image
                className="object-contain text-[0] bg-white bg-cover"
                placeholder={`data:image/${placeholder}`}
                quality={75}
                fill
                src={
                  product.imageStoredInFs
                    ? `/api/publicAssets/uploads/${product.id}.webp`
                    : product.imageUrl || placeholder
                }
                alt={getLocalisedName(locale, product)}
              />
            </div>
          )}
          <div className="lg:basis-3/5">
            <ProductForm product={product}></ProductForm>
          </div>
        </section>
        <section className="mt-8 lg:mt-16">
          <h1 className="mb-6 text-secondary font-serif text-3xl">
            {t("suggested")}
          </h1>
          <div className="w-full gap-8 overflow-hidden grid auto-rows-min grid-cols-2 lg:grid-cols-4">
            {suggested.map((product, index) => {
              return (
                <div key={index}>
                  <ProductCard locale={locale} product={product} />
                </div>
              );
            }) || t2("noProudcts")}
          </div>
        </section>
      </div>
    </div>
  );
}
