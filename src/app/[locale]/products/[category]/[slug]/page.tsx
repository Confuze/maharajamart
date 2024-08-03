import { products } from "@/src/data/products";
import { unstable_setRequestLocale } from "next-intl/server";
import Image from "next/image";

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
  const product = products[category].products[slug];
  return (
    <section className="p-8">
      {product.picture && (
        <div className="relative w-2/5 h-[70vh] border-4 overflow-hidden border-secondary rounded-3xl">
          <Image
            fill
            className="object-cover"
            src={product.picture}
            alt={product.displayName}
          />
        </div>
      )}
      <h1>{product.displayName}</h1>
      {product.price} zł
    </section>
  );
}
