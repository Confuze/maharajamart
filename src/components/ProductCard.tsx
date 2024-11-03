"use client";

import Image from "next/image";
import { Product, products } from "../data/products";
import { useTranslations } from "next-intl";
import placeholder from "@/public/picturePlaceholder.png";
import { Link } from "../navigation";
import AddToCartButton from "./AddToCartButton";
import { Input } from "./ui/input";
import { useMemo, useState } from "react";
import { useAppStore } from "../lib/storage";
import { useCartState } from "../lib/useStore";

interface ProductInfo extends Product {
  category: string;
  slug: string;
  link?: never;
}

interface PromotionInfo extends Product {
  link: string;
  category?: never;
  slug?: never;
  price?: never;
}

export type CardInfo = ProductInfo | PromotionInfo;

function ProductCard({
  product,
  locale,
}: {
  product: CardInfo;
  locale: "en" | "pl";
}) {
  const t = useTranslations("Layout.products");
  const state = useCartState();
  const [quantity, setQuantity] = useState(1);
  const isAddedToCart = useMemo(() => {
    let productFound = false;
    if (!state) return false;

    Object.keys(state).forEach((key) => {
      if (
        state[key].categorySlug === product.category &&
        state[key].productSlug === product.slug
      ) {
        productFound = true;
      }
    });
    return productFound;
  }, [product, state]);

  return (
    <Link
      href={product.link || `/products/${product.category}/${product.slug}`}
      className="w-full h-full "
    >
      <div className="flex flex-col bg-background2 w-full h-full p-2 lg:p-6 rounded-xl duration-150 hover:shadow-[0_0_.75rem_0rem_rgba(0,0,0,0.2)] hover:scale-[97.5%]">
        <div className="flex-grow bg-white lg:border-4 lg:border-secondary overflow-hidden rounded-lg lg:rounded-3xl relative w-full aspect-square">
          <Image
            className="text-[0] bg-cover"
            style={{ backgroundImage: `url(${placeholder.src})` }}
            quality={75}
            fill
            src={product.picture || ""}
            alt={product.displayName}
          />
        </div>
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <p className="font-serif leading-none mt-2 text-secondary">
              {product.category
                ? products[product.category].displayName[locale]
                : t("promotion")}
            </p>
            <div className="flex gap-2 justify-between">
              <h1>{product.displayName}</h1>
              {product.price && (
                <p className="text-nowrap">{product.price * quantity} zł</p>
              )}
            </div>
            <p className="text-sm text-secondary">
              {isAddedToCart && t("alreadyInCart")}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-end grow gap-2 justify-between">
            <Input
              type="number"
              value={quantity}
              className="max-w-16"
              min={1}
              max={99}
              onClick={(e) => {
                e.preventDefault();
              }}
              onChange={(e) => {
                setQuantity(parseInt(e.target.value));
              }}
            />
            <AddToCartButton quantity={quantity} product={product} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
