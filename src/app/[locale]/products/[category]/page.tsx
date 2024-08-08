import ProductCard from "@/src/components/ProductCard";
import { products } from "@/src/data/products";
import { cn } from "@/src/lib/utils";
import { Link } from "@/src/navigation";
import { unstable_setRequestLocale } from "next-intl/server";

export const dynamic = "error";

export function generateStaticParams() {
  return Object.keys(products).map((key) => ({
    category: key,
  }));
}

export default function Category({
  params: { locale, category },
}: {
  params: { locale: "en" | "pl"; category: string };
}) {
  unstable_setRequestLocale(locale);
  const catProducts = products[category].products;

  return (
    <>
      <h1 className="font-serif pl-20 text-5xl text-secondary my-8">
        {products[category].displayName[locale]}
      </h1>
      <div className="w-full gap-8 overflow-hidden px-20 -w-full grid auto-rows-min grid-cols-2 lg:grid-cols-5">
        {Object.keys(catProducts).map((key, index) => {
          const product = catProducts[key];

          return (
            <div key={index}>
              <Link href={`/products/${category}/${key}`} key={key}>
                <ProductCard
                  locale={locale}
                  product={{ ...product, category: category }}
                />{" "}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
