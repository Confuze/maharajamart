"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "../lib/storage";
import { useCart } from "../lib/useStore";
import { revalidateCart } from "../lib/revalidateCart";
import { toast } from "sonner";
import { useTranslations } from "use-intl";

// WARN: this is probably kind of not working with the suspense boundary properly, might wanna fix
function CartRevalidator({ cache = true }) {
  const cart = useCart();
  const { updateCart } = useAppStore();
  const t = useTranslations("Cart");
  const revalidated = useRef(false);

  useEffect(() => {
    (async () => {
      if (!cart?.id || revalidated.current) return;
      if (cache && cart.lastRevalidated + 60 * 60000 > Date.now()) return; // skip check if cart has already been revalidated within the last hour

      const { newCart, changed } = await revalidateCart(cart);

      updateCart({
        id: cart.id,
        lastRevalidated: Date.now(),
        contents: newCart,
      });
      revalidated.current = true;

      if (changed)
        toast.info(t("updated.title"), {
          description: t("updated.description", { quantity: changed }),
        });
    })();
  }, [cart, cache, t, updateCart]);

  return null;
}

export default CartRevalidator;
