"use client";

import { ShoppingBasket } from "lucide-react";
import { Link } from "../navigation";
import { useCartState } from "../lib/useStore";
import { cn } from "../lib/utils";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

function CartButton({ ...props }) {
  const state = useCartState();

  const t = useTranslations("Layout.nav");
  const itemCount = useMemo(() => {
    if (!state) return;
    let count = 0;
    Object.keys(state).forEach((key) => {
      count += state[key].quantity;
    });
    return count;
  }, [state]);

  return (
    <Link href="/cart" className="flex items-center relative" {...props}>
      <ShoppingBasket className="h-8 mr-1" /> {t("cart")}
      <div
        className={cn(
          (!state || Object.keys(state).length == 0) && "hidden",
          "bg-secondary p-[3px] flex items-center justify-center rounded-full min-h-5 min-w-5 aspect-square absolute -bottom-[1px] -left-2 text-background text-xs text-center",
        )}
      >
        <p>{itemCount}</p>
      </div>
    </Link>
  );
}

export default CartButton;
