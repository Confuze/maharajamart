import Image from "next/image";
import { Product } from "../data/products";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";

export interface CardInfo extends Product {
  link?: string;
  category?: string;
}

function ProductCard({ product }: { product: CardInfo }) {
  const t = useTranslations("Layout.products");

  return (
    <div className="w-full h-full p-4">
      <Image fill src={product.picture || ""} alt={product.displayName} />
      <p>{product.price ? product.category : t("promotion")}</p>
      <h2>{product.price}</h2>
      <div className="flex justify-between">
        <p>{product.price} zł</p>
        <Button size="sm">{t("addToCart")}</Button>
      </div>
    </div>
  );
}

export default ProductCard;
