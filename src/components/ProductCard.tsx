"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import placeholder from "@/public/picturePlaceholder.png";
import { Link } from "../i18n/navigation";
import AddToCartButton from "./AddToCartButton";
import { Input } from "./ui/input";
import { useMemo, useState } from "react";
import { useCartState } from "../lib/useStore";
import { cn } from "../lib/utils";
import { CardInfo } from "../lib/prismaTypes";
import { getLocalisedCategory, getLocalisedName } from "../data/products";

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
      if (state[key].id == product.id) {
        productFound = true;
      }
    });
    return productFound;
  }, [product, state]);

  return (
    <Link
      href={`/products/${product.category.slug}/${product.slug}`}
      className="w-full h-full "
      onClick={(e) => {
        const tag = (e.target as HTMLLinkElement).localName;

        if (tag == "input") e.preventDefault();
      }}
    >
      <div className="flex flex-col overflow-visible bg-background2 w-full h-full p-2 lg:p-6 rounded-xl duration-150 hover:shadow-[0_0_.75rem_0rem_rgba(0,0,0,0.2)] hover:scale-[97.5%]">
        <div className="bg-white lg:border-4 lg:border-secondary overflow-hidden rounded-lg lg:rounded-3xl relative w-full aspect-square">
          <Image
            className="text-[0] bg-cover"
            style={{ backgroundImage: `url(${placeholder.src})` }}
            quality={75}
            fill
            src={
              product.imageStoredInFs
                ? `/api/publicAssets/uploads/${product.id}.webp`
                : product.imageUrl || placeholder
            }
            alt={product.name}
          />
        </div>
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <p className="font-serif leading-none mt-2 text-secondary">
              {product.category
                ? getLocalisedCategory(locale, product.category)
                : t("promotion")}
            </p>
            <div className="flex gap-2 justify-between">
              <h1
                className={cn(
                  cutTitle && "line-clamp-2 lg:line-clamp-3 text-ellipsis",
                )}
              >
                {getLocalisedName(locale, product)}
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
            <Input
              type="number"
              name="quantity"
              value={quantity}
              className="max-w-12 no-increment"
              aria-label="quantity"
              min={1}
              max={99}
              // onClick={(e) => {
              //   e.preventDefault();
              // }}
              onKeyDown={(
                // INFO: Prevents the enter key from submitting the form (why isn't this an option in react-hook-form???)
                e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
              ) => {
                if (e.key === "Enter") e.preventDefault();
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
