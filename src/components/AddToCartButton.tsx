"use client";

import { useTranslations } from "next-intl";
import { CardInfo } from "./ProductCard";
import { generateKey, useAppStore } from "../lib/storage";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useCartState } from "../lib/useStore";
import { Link } from "../navigation";

function AddToCartButton({
  product,
  quantity,
}: {
  product: CardInfo;
  quantity: number;
}) {
  const t = useTranslations("Layout.products");
  const t2 = useTranslations("Product");
  const t3 = useTranslations("Cart");
  const { addCartItem } = useAppStore();
  const state = useCartState();

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!product.slug) return;
    if (
      (state![generateKey(product.category, product.slug)]?.quantity || 0) +
        quantity >
      100
    )
      return toast.error(t2("maxQuantity"));
    // INFO: why is it quantity || 0? because quantity can be undefined and you can't add a number to undefined so this is the fastest way to cover the case when the product was never added since 1 is always lesser.

    addCartItem({
      productSlug: product.slug,
      categorySlug: product.category,
      quantity: quantity,
    });
    toast(t2("added"), {
      description: t2("addedDescription", {
        quantity: quantity,
        name: product.displayName,
      }),
      action: (
        <Link className="w-full basis-1/3" href="/cart">
          {" "}
          {/* Using basis is a hacky solution but it works and for whatever reason css won't let w-max or anything else work for this */}
          <Button variant="link" className="p-0 w-full">
            {t3("cart")}
          </Button>
        </Link>
      ),
    });
  }
  return (
    <Button
      size="sm"
      className="rounded-full text-nowrap lg:rounded-xl h-8 lg:h-min lg:aspect-auto p-2 aspect-square lg:py-2 lg:px-4"
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
