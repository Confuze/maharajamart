import { useState, useEffect } from "react";
import { ICart, IStore, useAppStore } from "./storage";
import { formSchema } from "../lib/zodSchemas";
import { z } from "zod";

export const useCartState = () => {
  const result = useAppStore((state) => state.cart);
  const [data, setData] = useState<ICart>();

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
