import { useState, useEffect } from "react";
import { ICartContents, useAppStore } from "./storage";
import { formSchema } from "../lib/zodSchemas";
import { z } from "zod";

export const useCartState = () => {
  const result = useAppStore((state) => state.cart.contents);
  const [data, setData] = useState<ICartContents>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export const useCartId = () => {
  const result = useAppStore((state) => state.cart.id);
  const [data, setData] = useState<string>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export const useFormState = () => {
  const result = useAppStore((state) => state.checkoutFormValues);
  const [data, setData] = useState<z.infer<typeof formSchema>>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};
