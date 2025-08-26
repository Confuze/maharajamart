"use client";

import { useRef, useState } from "react";
import { ICartItem, useAppStore } from "../lib/storage";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import placeholder from "@/public/picturePlaceholder.png";
import { Link } from "../i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { z } from "zod";
import { getLocalisedName } from "../data/products";
import { localeType } from "../i18n/routing";

function CartItem({ item }: { item: ICartItem }) {
  const { updateCartItem, removeCartItem } = useAppStore();
  const locale = useLocale() as localeType;
  const schema = z.number().min(1).max(99);
  const inputRef = useRef(null);
  const [valid, setValid] = useState(true);
  const t = useTranslations("Cart");

  const onQuantityUpdate = (newQuantity: number) => {
    updateCartItem({
      ...item,
      quantity: newQuantity,
    });
  };

  return (
    <div className="bg-background2 border lg:border-2 border-secondary border-opacity-25 p-3 lg:p-5 rounded-lg lg:rounded-xl flex gap-4 h-full justify-between">
      <div className="flex gap-4 lg:gap-8 items-start basis-10/12">
        <div className="bg-white overflow-hidden rounded-md relative w-1/5 aspect-square h-fit lg:h-unset">
          <Image
            className="text-[0] bg-cover bg-center w-full aspect-square"
            style={{ backgroundImage: `url(${placeholder.src})` }}
            placeholder={`data:image/${placeholder}`}
            quality={75}
            fill
            src={
              item.imageStoredInFs
                ? `/api/publicAssets/uploads/${item.id}.webp`
                : item.imageUrl || placeholder
            }
            alt={getLocalisedName(locale, item)}
          />
        </div>
        <div>
          <Link href={`/products/${item.category.slug}/${item.slug}/`}>
            <h3 className="font-serif text-lg lg:text-2xl text-secondary text-pretty hover:underline">
              {getLocalisedName(locale, item)}
            </h3>
          </Link>
          <div className="text-xs lg:text-base">
            <p>
              {t("singlePrice")}
              {item.price!} zł
            </p>
          </div>
          <div className="mt-3">
            <label htmlFor="quantityInput" className="text-xs">
              {t("quantity")}
            </label>
            <div className="flex flex-shrink flex-wrap items-end gap-2 justify-between">
              <div className="flex gap-1">
                <button
                  aria-label={t("decQuantity")}
                  onClick={() => {
                    if (!inputRef.current) return;
                    const numberValue = parseInt(
                      (inputRef.current as HTMLInputElement).value,
                    );
                    if (numberValue - 1 > 99 || numberValue - 1 < 1) return;
                    (inputRef.current as HTMLInputElement).value = (
                      numberValue - 1
                    ).toString();

                    onQuantityUpdate(numberValue - 1);
                  }}
                  className="bg-white rounded border border-neutral-200 px-1 hover:brightness-90 transition"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <Input
                  id="quantityInput"
                  type="number"
                  className={cn(
                    !valid && "border-red-600",
                    "max-w-8 no-increment px-1 text-center",
                  )}
                  defaultValue={item.quantity}
                  min={1}
                  max={99}
                  ref={inputRef}
                  onKeyDown={(
                    // INFO: Prevents the enter key from submitting the form (why isn't this an option in react-hook-form???)
                    e: React.KeyboardEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                  onChange={(e) => {
                    if (!schema.safeParse(parseInt(e.target.value)).success)
                      return setValid(false);
                    else if (!valid) setValid(true);
                    onQuantityUpdate(parseInt(e.target.value));
                  }}
                />
                <button
                  aria-label={t("incQuantity")}
                  onClick={() => {
                    if (!inputRef.current) return;
                    const numberValue = parseInt(
                      (inputRef.current as HTMLInputElement).value,
                    );
                    if (numberValue + 1 > 99 || numberValue + 1 < 1) return;
                    (inputRef.current as HTMLInputElement).value = (
                      numberValue + 1
                    ).toString();

                    onQuantityUpdate(numberValue + 1);
                  }}
                  className="bg-white rounded border border-neutral-200 px-1 hover:brightness-90 transition"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  aria-label={t("incQuantity")}
                  className="bg-white rounded border border-neutral-200 px-1 hover:brightness-90 transition ml-1"
                >
                  <X
                    className="w-4 h-4"
                    strokeWidth={2}
                    onClick={() => {
                      removeCartItem(item.id);
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2 className="font-bold text-xl lg:text-2xl w-full basis-2/12 text-right text-nowrap">
        {item.price! * item.quantity} zł
      </h2>
    </div>
  );
}

export default CartItem;
