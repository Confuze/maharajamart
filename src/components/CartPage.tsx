"use client";

import useCartState from "../lib/useStore";
import { products } from "../data/products";
import placeholder from "@/public/picturePlaceholder.png";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useMemo, useRef } from "react";
import { Link } from "../navigation";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useCartStore } from "../lib/storage";
import { parseInt } from "lodash";
import { X } from "lucide-react";

function CartPage() {
  const state = useCartState();
  const t = useTranslations("Cart");
  const t2 = useTranslations("Product");
  const { updateCartItem, removeCartItem } = useCartStore();
  const productsPrice = useMemo(() => {
    let price = 0;
    if (!state) return price;

    Object.keys(state).forEach((key) => {
      const cartItem = state[key]!;
      const product =
        products[cartItem.categorySlug].products[cartItem.productSlug];
      price += cartItem.quantity * product.price!;
    });

    return price;
  }, [state]);

  const deliveryFee = productsPrice >= 200 ? 0 : 20;

  const itemCount = useMemo(() => {
    if (!state) return;
    let count = 0;
    Object.keys(state).forEach((key) => {
      count += state[key].quantity;
    });
    return count;
  }, [state]);

  return (
    <div className="mt-8 px-8 lg:px-[15vw]">
      <div className="flex justify-between mb-8">
        <h1 className="font-serif text-3xl lg:text-5xl text-secondary">
          {t("cart")}
        </h1>
        <p className="text-xl lg:text-3xl">
          {itemCount} {t("items")}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 *:col-span-2 gap-8">
        {state &&
          Object.keys(state).map((key) => {
            const cartItem = state[key]!;
            const product =
              products[cartItem.categorySlug].products[cartItem.productSlug];

            return (
              <div
                className={cn(
                  key === Object.keys(state)[Object.keys(state).length - 1] &&
                    Object.keys(state).length % 2 &&
                    "lg:!col-middle",
                  "bg-background2 p-4 lg:p-8 rounded-xl flex gap-4 h-full items-start",
                )}
                key={key}
              >
                <div className="bg-white lg:border-4 lg:border-secondary overflow-hidden rounded-lg lg:rounded-2xl relative w-full aspect-square basis-3/12 h-[unset]">
                  <Image
                    className="text-[0] bg-cover bg-center w-full aspect-square"
                    style={{ backgroundImage: `url(${placeholder.src})` }}
                    placeholder={`data:image/${placeholder}`}
                    quality={75}
                    fill
                    src={product.picture || ""}
                    alt={product.displayName}
                  />
                </div>
                <div className="basis-5/12">
                  <Link
                    href={`/products/${cartItem.categorySlug}/${cartItem.productSlug}/`}
                  >
                    <h3 className="font-serif text-lg lg:text-2xl text-secondary text-pretty hover:underline">
                      {product.displayName}
                    </h3>
                  </Link>
                  <div className="flex justify-between">
                    <p>
                      {t("totalPrice")}
                      {product.price! * cartItem.quantity} zł
                    </p>
                  </div>
                </div>
                <div className="basis-4/12 gap-3 group flex">
                  <div className="grow">
                    <Label
                      htmlFor="quantity"
                      className="group-has-[:invalid]:text-red-600"
                    >
                      {t2("quantity")}
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      className="w-full"
                      placeholder="Please choose amount"
                      min={1}
                      max={100}
                      required
                      defaultValue={cartItem.quantity}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value);
                        if (parsed % 1 !== 0 || parsed > 100 || parsed < 1)
                          return console.log("invalid");
                        updateCartItem({
                          // WARN: This is maybe not very efficient
                          ...cartItem,
                          quantity: parsed,
                        });
                      }}
                    />
                    <p className="text-red-600 hidden group-has-[:invalid]:inline">
                      {t2("maxQuantity")}
                    </p>
                  </div>
                  <X
                    className="w-8 h-8 cursor-pointer"
                    strokeWidth={1}
                    onClick={() => {
                      removeCartItem(cartItem);
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
      <div className="flex flex-col lg:flex-row gap-6 justify-between mt-8">
        <div className="lg:basis-1/3">
          <div className="flex justify-between font-serif text-2xl lg:text-4xl text-secondary">
            <h3 className="">{t("totalPrice")}</h3>
            <span className="font-bold text-right">
              {productsPrice + deliveryFee} zł
            </span>
          </div>
          <div className="flex justify-between lg:text-xl">
            <span className="">{t("productPrice")}</span>
            <span className="font-bold text-right">{productsPrice} zł</span>
          </div>
          <div className="flex justify-between lg:text-xl">
            <span className="">{t("deliveryFee")}</span>
            <span className="font-bold text-right">{deliveryFee} zł</span>
          </div>
          <div className="flex justify-between lg:text-xl">
            <span className="">{t("transactionFee")}</span>
            <span className="font-bold text-right">{t("addedAtCheckout")}</span>
          </div>
        </div>
        <Button size="lg">{t("proceed")}</Button>
      </div>
    </div>
  );
}

export default CartPage;
