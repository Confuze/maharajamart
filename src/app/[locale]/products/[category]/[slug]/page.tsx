import { products } from "@/src/data/products";
import { unstable_setRequestLocale } from "next-intl/server";

export const dynamic = "error";

export function generateStaticParams() {
  const paramsArray: any[] = []; // Don't care, not making another interface just for the params
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

export default function Product({
  params: { locale, category, slug },
}: {
  params: { locale: "en" | "pl"; category: string; slug: string };
}) {
  unstable_setRequestLocale(locale);
  console.log(products, category);
  const product = products[category].products[slug];
  return (
    <>
      <h1>{product.displayName[locale]}</h1>
      {product.description} {product.price} zł
    </>
  );
}
