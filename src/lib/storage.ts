import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ICartItem {
  quantity: number;
  categorySlug: string;
  productSlug: string;
}

export interface ICart {
  [key: string]: ICartItem;
}

export interface IStore {
  cart: ICart;
  updateCart: (newCart: ICart) => void;
  updateCartItem: (cartItem: ICartItem) => void;
  addCartItem: (cartItem: ICartItem) => void;
  removeCartItem: (cartItem: ICartItem) => void;
}

// the store itself does not need any change
export const useCartStore = create<IStore>()(
  persist(
    (set, get) => ({
      cart: {},
      updateCart: (newCart: ICart) => {
        set({ cart: { ...get().cart, ...newCart } });
      },
      updateCartItem: (cartItem: ICartItem) => {
        // INFO: The difference between this and the addCartItem method is this doesn't increment quantity when the item already exists, just overrides it.
        set({
          cart: {
            ...get().cart,
            [generateKey(cartItem.categorySlug, cartItem.productSlug)]:
              cartItem,
          },
        });
      },
      addCartItem: (cartItem: ICartItem) => {
        const key = generateKey(cartItem.categorySlug, cartItem.productSlug);
        if (get().cart[key]) {
          const newQuantity = get().cart[key].quantity + cartItem.quantity;
          set({
            cart: {
              ...get().cart,
              [key]: {
                ...(get().cart[key] as ICartItem),
                quantity: newQuantity, // INFO: The type casting and the non-null assertion is there because typescript thinks get().cart[key] can be undefined even though the if statement checks exactly that. (It assumes it can change since get() is a function, but it never can)
              },
            },
          });
        } else {
          set({
            cart: {
              ...get().cart,
              [generateKey(cartItem.categorySlug, cartItem.productSlug)]:
                cartItem,
            },
          });
        }
      },
      removeCartItem: (cartItem: ICartItem) => {
        let newCart = get().cart;

        delete newCart[
          generateKey(cartItem.categorySlug, cartItem.productSlug)
        ];

        set({
          cart: { ...newCart }, // INFO: Must create copy of newCart, otherwise react thinks it hasn't changed because it compares by reference
        });
      },
    }),
    {
      name: "cart",
    },
  ),
);

export function generateKey(categorySlug: string, productSlug: string): string {
  return categorySlug + "__" + productSlug;
}
