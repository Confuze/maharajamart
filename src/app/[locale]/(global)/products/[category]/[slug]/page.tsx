import { products } from "@/src/data/products";
import { unstable_setRequestLocale } from "next-intl/server";
import Image from "next/image";
import placeholder from "@/public/picturePlaceholder.png";
import { useTranslations } from "next-intl";
import ProductForm from "@/src/components/ProductForm";
import { Metadata } from "next";
import ProductCard from "@/src/components/ProductCard";
import { useMemo } from "react";

export const dynamic = "error";

export function generateStaticParams() {
  const paramsArray: unknown[] = [];
  Object.keys(products).map((category) => {
    return Object.keys(products[category].products).forEach((element) => {
      paramsArray.push({
        category: category,
        slug: element,
      });
    });
  });

  return paramsArray;
}

export async function generateMetadata({
  params: { category, slug },
}: {
  params: { category: string; slug: string };
}): Promise<Metadata> {
  return {
    title: products[category].products[slug]!.displayName,
  };
}

export default function Product({
  params: { locale, category, slug },
}: {
  params: { locale: "en" | "pl"; category: string; slug: string };
}) {
  unstable_setRequestLocale(locale);
  const t = useTranslations("Layout.products");
  const t2 = useTranslations("Category");
  const product = products[category].products[slug];
  const catProducts = products[category].products;
  const randomSuggested = useMemo(() => {
    const productsCopy = {
      ...catProducts,
    };
    delete productsCopy[slug]; // remove current product from array of possible recommended products
    const newProducts = Object.keys(productsCopy);
    const generateRandomProduct = () => {
      const generatedNumber = Math.random() * newProducts.length;
      return newProducts.splice(generatedNumber, 1)[0];
    };

    return [
      generateRandomProduct(),
      generateRandomProduct(),
      generateRandomProduct(),
      generateRandomProduct(),
    ];
  }, [catProducts, slug]);

  return (
    <div className="p-8 lg:p-0 pt-8 lg:flex lg:justify-center">
      <div className="lg:w-3/5">
        <section className="gap-4 lg:gap-20 flex justify-center flex-col lg:flex-row">
          {product.picture && (
            <div className="relative lg:basis-2/5 h-[30vh] lg:h-[70vh] border-4 overflow-hidden border-secondary rounded-3xl">
              <Image
                className="object-contain text-[0] bg-white bg-cover"
                placeholder={`data:image/${placeholder}`}
                quality={75}
                fill
                src={product.picture}
                alt={product.displayName}
              />
            </div>
          )}
          <div className="lg:basis-3/5">
            <ProductForm
              product={{
                ...product,
                productSlug: slug,
                categorySlug: category,
              }}
            ></ProductForm>
          </div>
        </section>
        <section className="mt-8 lg:mt-16">
          <h1 className="mb-6 text-secondary font-serif text-3xl">
            {t("suggested")}
          </h1>
          <div className="w-full gap-8 overflow-hidden grid auto-rows-min grid-cols-2 lg:grid-cols-4">
            {randomSuggested.map((key, index) => {
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
            }) || t2("noProudcts")}
          </div>
        </section>
      </div>
    </div>
  );
}
