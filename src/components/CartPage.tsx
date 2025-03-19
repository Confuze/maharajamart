"use client";

import { useCartState } from "../lib/useStore";
import { products } from "../data/products";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useMemo } from "react";
import { Link } from "../i18n/navigation";
import CartItem from "./CartItem";

function CartPage() {
  const state = useCartState();
  const t = useTranslations("Cart");
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
      <div className="flex flex-col-reverse lg:flex-row gap-16">
        <div className="basis-3/5">
          <div className="flex justify-between mb-8">
            <h1 className="font-serif text-3xl lg:text-5xl text-secondary">
              {t("cart")}
            </h1>
            <p className="text-xl lg:text-3xl">
              {itemCount} {t("items")}
            </p>
          </div>
          <div className="flex flex-col gap-8">
            {state &&
              Object.keys(state).map((key) => {
                const cartItem = state[key]!;

                return <CartItem cartItem={cartItem} key={key} />;
              })}
          </div>
        </div>
        <div className="w-full lg:sticky lg:top-6 self-start basis-2/5 h-[60vh] lg:bg-background2 rounded-xl lg:rounded-2xl lg:p-8 flex flex-col gap-6 justify-between lg:border-2 border-secondary border-opacity-25">
          <div>
            <h2 className="mb-4 text-secondary font-serif text-4xl">
              {t("summary")}
            </h2>
            <div className="flex justify-between lg:text-xl">
              <span className="">{t("productPrice")}</span>
              <span className="font-bold text-right">{productsPrice} zł</span>
            </div>
            <div className="flex justify-between lg:text-xl">
              <span className="">{t("deliveryFee")}</span>
              <span className="font-bold text-right">
                {t("addedAtCheckout")}
              </span>
            </div>
            <div className="flex justify-between lg:text-xl">
              <span className="">{t("transactionFee")}</span>
              <span className="font-bold text-right">
                {t("addedAtCheckout")}
              </span>
            </div>
            <hr className="my-3 border-primary border-t-1" />
            <div className="flex justify-between text-lg lg:text-xl text-secondary">
              <h3 className="">{t("totalPrice")}</h3>
              <span className="font-bold text-right">{productsPrice} zł</span>
            </div>
          </div>
          <Link
            className={cn(
              (itemCount === 0 || state == null) && "pointer-events-none",
              "lg:mt-16 w-full",
            )}
            href={itemCount === 0 || state == null ? "" : "/checkout"}
          >
            <Button
              disabled={itemCount === 0 || state == null}
              size="lg"
              className="w-full"
            >
              {t("proceed")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
