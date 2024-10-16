"use client";

import { useEffect } from "react";
import { useAppStore } from "../lib/storage";

function ClearCart() {
  const { updateCart } = useAppStore();

  useEffect(() => {
    updateCart({});
  }, [updateCart]);

  return <></>;
}

export default ClearCart;
