import { products } from "@/src/data/products";
import { unstable_setRequestLocale } from "next-intl/server";
import Image from "next/image";
import placeholder from "@/public/picturePlaceholder.png";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import ProductForm from "@/src/components/ProductForm";

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
  const t = useTranslations("Product");
  const t2 = useTranslations("Layout.products");

  return (
    <section className="pt-8 flex justify-center">
      <div className="w-3/5 gap-20 flex justify-center">
        {product.picture && (
          <div className="relative basis-2/5 h-[70vh] border-4 overflow-hidden border-secondary rounded-3xl">
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
        <ProductForm
          product={{ ...product, productSlug: slug, categorySlug: category }}
        ></ProductForm>
      </div>
    </section>
  );
}
