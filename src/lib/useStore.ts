import { useState, useEffect } from "react";
import { ICart, IStore, useCartStore } from "./storage";

const useCartState = () => {
  const result = useCartStore((state) => state.cart);
  const [data, setData] = useState<ICart>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export default useCartState;
