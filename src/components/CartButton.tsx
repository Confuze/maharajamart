"use client";

import { ShoppingBasket } from "lucide-react";
import { Link } from "../i18n/navigation";
import { useCartState } from "../lib/useStore";
import React, { useMemo } from "react";
import { useTranslations } from "next-intl";

interface CartButtonProps {
  mobile?: boolean;
  [key: string]: unknown;
}

function CartButton({ mobile = false, ...props }: CartButtonProps) {
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
    <Link className="flex items-center relative" {...props} href="/cart">
      <ShoppingBasket className="mr-1" size={20} />{" "}
      <p className={mobile ? "hidden" : ""}>{t("cart")}</p>
      <div
        className={
          mobile
            ? "hidden"
            : "bg-secondary p-[3px] flex items-center justify-center rounded-full min-h-5 min-w-5 aspect-square absolute -bottom-[1px] -left-2 text-background text-xs text-center"
        }
      >
        <p>{itemCount}</p>
      </div>
    </Link>
  );
}

export default CartButton;
