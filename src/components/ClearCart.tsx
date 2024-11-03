"use client";

import { useEffect } from "react";
import { useAppStore } from "../lib/storage";
import { useCartId } from "../lib/useStore";

function ClearCart() {
  const { updateCart } = useAppStore();
  const id = useCartId();

  useEffect(() => {
    if (!id) return;

    updateCart({
      id: id,
      contents: {},
    });
  }, [updateCart, id]);

  return <></>;
}

export default ClearCart;
