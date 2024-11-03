import { create } from "zustand";
import { persist } from "zustand/middleware";
import { formSchema } from "../lib/zodSchemas";
import { z } from "zod";

export interface ICartItem {
  quantity: number;
  categorySlug: string;
  productSlug: string;
}

export interface ICartContents {
  [key: string]: ICartItem;
}

export interface ICart {
  id: string;
  contents: ICartContents;
}

export interface IStore {
  cart: ICart;
  checkoutFormValues: z.infer<typeof formSchema>;
  updateCheckoutFormValues: (newValues: z.infer<typeof formSchema>) => void;
  updateCart: (newCart: ICart) => void;
  updateCartItem: (cartItem: ICartItem) => void;
  addCartItem: (cartItem: ICartItem) => void;
  removeCartItem: (cartItem: ICartItem) => void;
  generateNewId: () => void;
}

// NOTE: This may not be the cleanest code. There is a lot of repetition, especially with the id when setting a new cart but I can't think of a cleaner way to write this.
// WARN: REMEMBER, always use copies of the get() method, javascript passes objects by reference, not copy and react doesn't do deep searches so it will consider the object identical, therefore not triggering a rerender.
export const useAppStore = create<IStore>()(
  persist(
    (set, get) => ({
      cart: {
        id: "",
        contents: {},
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
            id: get().cart.id,
            contents: {
              ...get().cart.contents,
              [generateKey(cartItem.categorySlug, cartItem.productSlug)]:
                cartItem,
            },
          },
        });
      },
      addCartItem: (cartItem: ICartItem) => {
        const key = generateKey(cartItem.categorySlug, cartItem.productSlug);
        if (get().cart.contents[key]) {
          const newQuantity =
            get().cart.contents[key].quantity + cartItem.quantity;
          set({
            cart: {
              id: get().cart.id,
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
              id: get().cart.id,
              contents: {
                ...get().cart.contents,
                [generateKey(cartItem.categorySlug, cartItem.productSlug)]:
                  cartItem,
              },
            },
          });
        }
      },
      removeCartItem: (cartItem: ICartItem) => {
        let newCartContents = { ...get().cart.contents };

        delete newCartContents[
          generateKey(cartItem.categorySlug, cartItem.productSlug)
        ];

        set({
          cart: { id: get().cart.id, contents: newCartContents }, // INFO: Must create copy of newCart, otherwise react thinks it hasn't changed because it compares by reference
        });
      },
      generateNewId: () => {
        set({
          cart: {
            id: crypto.randomUUID(),
            contents: get().cart.contents,
          },
        });
      },
    }),
    {
      name: "cart",
      onRehydrateStorage: (state) => {
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
