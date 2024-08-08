import Image from "next/image";
import { Product, products } from "../data/products";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import placeholder from "@/public/picturePlaceholder.png";

export interface CardInfo extends Product {
  link?: string;
  category?: string;
}

function ProductCard({
  product,
  locale,
}: {
  product: CardInfo;
  locale: "en" | "pl";
}) {
  const t = useTranslations("Layout.products");
  return (
    <div className="flex flex-col bg-background2 rounded-xl w-full h-full p-6">
      <div className="bg-white border-4 border-secondary overflow-hidden rounded-3xl relative w-full aspect-square">
        <Image
          className="text-[0] bg-cover"
          style={{ backgroundImage: `url(${placeholder.src})` }}
          placeholder={`data:image/${placeholder}`}
          quality={75}
          fill
          src={product.picture || ""}
          alt={product.displayName}
        />
      </div>
      <p className="font-serif text-lg leading-none mt-2 text-secondary">
        {product.category
          ? products[product.category].displayName[locale]
          : t("promotion")}
      </p>
      <h1 className="text-xl mb-2">{product.displayName}</h1>
      <div className="flex grow items-end justify-between">
        {product.price && <p>{product.price} zł</p>}
        <Button size="sm">
          {product.price ? t("addToCart") : t("details")}
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
