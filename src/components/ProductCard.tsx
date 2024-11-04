"use client";

import Image from "next/image";
import { Product, products } from "../data/products";
import { useTranslations } from "next-intl";
import placeholder from "@/public/picturePlaceholder.png";
import { Link } from "../navigation";
import AddToCartButton from "./AddToCartButton";
import { Input } from "./ui/input";
import { useMemo, useRef, useState } from "react";
import { useCartState } from "../lib/useStore";
import { cn } from "../lib/utils";
import { z } from "zod";
import { Minus, Plus } from "lucide-react";

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
  cutTitle,
  locale,
}: {
  product: CardInfo;
  cutTitle?: boolean;
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
  const schema = z.number().min(1).max(99);
  const [valid, setValid] = useState(true);
  const inputRef = useRef(null);

  return (
    <Link
      href={product.link || `/products/${product.category}/${product.slug}`}
      className="w-full h-full"
      onClick={(e) => {
        const tag = (e.target as HTMLLinkElement).localName;

        if (tag == "input" || tag == "button" || tag == "svg" || tag == "path")
          e.preventDefault();
      }}
    >
      <div className="flex flex-col overflow-visible bg-background2 w-full h-full p-2 lg:p-6 rounded-xl duration-150 hover:shadow-[0_0_.75rem_0rem_rgba(0,0,0,0.2)] hover:brightness-95">
        <div className="bg-white lg:border-4 lg:border-secondary overflow-hidden rounded-lg lg:rounded-3xl relative w-full aspect-square">
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
              <h1
                className={cn(
                  cutTitle && "line-clamp-2 lg:line-clamp-3 text-ellipsis",
                )}
              >
                {product.displayName}
              </h1>
              {product.price && (
                <p className="text-nowrap">{product.price * quantity} zł</p>
              )}
            </div>
            <p className="text-sm text-secondary">
              {isAddedToCart && t("alreadyInCart")}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-end grow gap-2 justify-between">
            <div className="flex gap-1">
              <button
                onClick={() => {
                  if (!inputRef.current) return;
                  const numberValue = parseInt(
                    (inputRef.current as HTMLInputElement).value,
                  );
                  if (numberValue - 1 > 99 || numberValue - 1 < 1) return;
                  (inputRef.current as HTMLInputElement).value = (
                    numberValue - 1
                  ).toString();

                  setQuantity(numberValue - 1);
                }}
                className="bg-white rounded border border-neutral-200 px-1 hover:brightness-90 transition"
              >
                <Minus className="h-4 w-4" />
              </button>
              <Input
                type="number"
                className={cn(
                  !valid && "border-red-600",
                  "max-w-12 no-increment",
                )}
                defaultValue={1}
                min={1}
                max={99}
                ref={inputRef}
                onKeyDown={(
                  // INFO: Prevents the enter key from submitting the form (why isn't this an option in react-hook-form???)
                  e: React.KeyboardEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >,
                ) => {
                  e.key === "Enter" && e.preventDefault();
                }}
                onChange={(e) => {
                  if (!schema.safeParse(parseInt(e.target.value)).success)
                    return setValid(false);
                  else if (!valid) setValid(true);
                  setQuantity(parseInt(e.target.value));
                }}
              />
              <button
                onClick={() => {
                  if (!inputRef.current) return;
                  const numberValue = parseInt(
                    (inputRef.current as HTMLInputElement).value,
                  );
                  if (numberValue + 1 > 99 || numberValue + 1 < 1) return;
                  (inputRef.current as HTMLInputElement).value = (
                    numberValue + 1
                  ).toString();

                  setQuantity(numberValue + 1);
                }}
                className="bg-white rounded border border-neutral-200 px-1 hover:brightness-90 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <AddToCartButton quantity={quantity} product={product} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
