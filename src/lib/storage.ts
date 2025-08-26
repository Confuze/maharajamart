// INFO: All data about cart items from the database is saved locally in the store so as not to have
// to fetch the backend every time it needs to be accessed but it can go stale when the data in the db
// updates, therefore it should always be validated before the payment process with the revalidateCart method.
// That way it will match the data retrieved from the database on the backend upon payment.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { formSchema } from "../lib/zodSchemas";
import { z } from "zod";
import { revalidateCart } from "./revalidateCart";

export interface ICartItem {
  quantity: number;
  id: string;
  category: {
    name: string;
    id: string;
    slug: string;
    namePl?: string | null;
    archived: boolean;
  };
  description?: string | null;
  name: string;
  price: number;
  slug: string;
  namePl?: string | null;
  descriptionPl?: string | null;
  categoryId: string;
  archived: boolean;
  imageUrl?: string | null;
  imageStoredInFs?: boolean | null;
}

export interface ICartContents {
  [key: string]: ICartItem;
}

export interface ICart {
  id: string;
  lastRevalidated: number; // not yet used but might come in handy in the future
  contents: ICartContents;
}

export interface IStore {
  cart: ICart;
  checkoutFormValues: z.infer<typeof formSchema>;
  updateCheckoutFormValues: (newValues: z.infer<typeof formSchema>) => void;
  updateCart: (newCart: ICart) => void;
  updateCartItem: (cartItem: ICartItem) => void;
  addCartItem: (cartItem: ICartItem) => void;
  removeCartItem: (id: string) => void;
  generateNewId: () => void;
  revalidateCart: () => Promise<number>;
}

// WARN: REMEMBER, always use copies of the get() method, javascript passes objects by reference, not copy and react doesn't do deep searches so it will consider the object identical, therefore not triggering a rerender.
export const useAppStore = create<IStore>()(
  persist(
    (set, get) => ({
      cart: {
        id: "",
        contents: {},
        lastRevalidated: Date.now(),
      },
      checkoutFormValues: {
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        postalCode: "",
        town: "",
        extraInfo: "",
        shippingMethod: "CLOSE_DELIVERY",
      },
      updateCheckoutFormValues: (newValues: z.infer<typeof formSchema>) => {
        set({ ...get(), checkoutFormValues: newValues });
      },
      updateCart: (newCart: ICart) => {
        set({ cart: newCart });
      },
      updateCartItem: (cartItem: ICartItem) => {
        // INFO: The difference between this and the addCartItem method is this doesn't increment quantity when the item already exists, just overrides it.
        set({
          cart: {
            ...get().cart,
            contents: {
              ...get().cart.contents,
              [cartItem.id]: cartItem,
            },
          },
        });
      },
      addCartItem: (cartItem: ICartItem) => {
        const key = cartItem.id;
        if (get().cart.contents[key]) {
          const newQuantity =
            get().cart.contents[key].quantity + cartItem.quantity;
          set({
            cart: {
              ...get().cart,
              contents: {
                ...get().cart.contents,
                [key]: {
                  ...get().cart.contents[key],
                  quantity: newQuantity,
                },
              },
            },
          });
        } else {
          set({
            cart: {
              ...get().cart,
              contents: {
                ...get().cart.contents,
                [key]: cartItem,
              },
            },
          });
        }
      },
      removeCartItem: (id: string) => {
        const newCartContents = { ...get().cart.contents };

        delete newCartContents[id];

        set({
          cart: {
            ...get().cart,
            contents: newCartContents,
          }, // INFO: Must create copy of newCart, otherwise react thinks it hasn't changed because it compares by reference
        });
      },
      generateNewId: () => {
        set({
          cart: {
            ...get().cart,
            id: crypto.randomUUID(),
          },
        });
      },
      revalidateCart: async () => {
        const { newCart, changed } = await revalidateCart(get().cart);

        set({
          cart: {
            ...get().cart,
            contents: newCart,
            lastRevalidated: Date.now(),
          },
        });
        return changed;
      },
    }),
    {
      name: "cart",
      onRehydrateStorage: () => {
        // Generates a new uuid if one has not been set yet
        return (state, error) => {
          if (error) console.log("Hydration failed, ", error);
          else {
            if (!state) return;
            if (state.cart.id === "") state.generateNewId();
            console.log("Hydration finished");
          }
        };
      },
    },
  ),
);

export function generateKey(categorySlug: string, productSlug: string): string {
  return categorySlug + "__" + productSlug;
}
