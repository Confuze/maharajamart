import { products } from "@/src/app/data/products";
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
      {products[category].displayName[locale]}
      {Object.keys(catProducts).map((product) => (
        <Link href={`/products/${category}/${product}`} key={product}>
          {catProducts[product].displayName[locale]}
        </Link>
      ))}
    </>
  );
}
