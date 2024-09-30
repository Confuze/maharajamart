"use client";

import { useTranslations } from "next-intl";
import { CardInfo } from "./ProductCard";
import { generateKey, useCartStore } from "../lib/storage";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import useCartState from "../lib/useStore";

function AddToCartButton({ product }: { product: CardInfo }) {
  const t = useTranslations("Layout.products");
  const t2 = useTranslations("Product");
  const { addCartItem } = useCartStore();
  const state = useCartState();

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!product.slug) return;
    if (
      (state![generateKey(product.category, product.slug)]?.quantity || 0) + 1 >
      100
    )
      return toast.error(t2("maxQuantity"));
    // INFO: why is it quantity || 0? because quantity can be undefined and you can't add a number to undefined so this is the fastest way to cover the case when the product was never added since 1 is always lesser.

    addCartItem({
      productSlug: product.slug,
      categorySlug: product.category,
      quantity: 1,
    });
    toast(t2("added"), {
      description: t2("addedDescription", {
        quantity: 1,
        name: product.displayName,
      }),
    });
  }
  return (
    <Button
      size="sm"
      className="rounded-full lg:rounded-xl h-8 lg:h-auto lg:aspect-auto p-2 aspect-square lg:py-2 lg:px-4"
      onClick={
        product.slug
          ? (e) => {
              onClick(e);
            }
          : () => {}
      }
    >
      <ShoppingCart
        className={cn(
          !product.price && "hidden",
          "text-background2 w-5 h-5 lg:hidden",
        )}
      />
      <div className="hidden lg:block">
        {product.price ? t("addToCart") : t("details")}
      </div>
    </Button>
  );
}

export default AddToCartButton;
