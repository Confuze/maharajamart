"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useMemo } from "react";
import { useCartState, useFormState } from "../lib/useStore";
import { products } from "../data/products";
import { useRouter } from "../navigation";
import { useAppStore } from "../lib/storage";
import { toast } from "sonner";
import { formSchema } from "../lib/zodSchemas";
import p24logo from "@/public/przelewy24-logo.svg";
import mbankLogo from "@/public/mbank.svg";
import pkoLogo from "@/public/pko.svg";
import pocztowy24logo from "@/public/pocztowy24.svg";
import blikLogo from "@/public/blik.svg";
import Image from "next/image";
import { PhoneInput } from "./PhoneInput";

export default function CheckoutForm() {
  const t = useTranslations("Checkout");
  const t2 = useTranslations("Cart");
  const state = useCartState();
  const formState = useFormState();
  const { updateCheckoutFormValues: updateCheckoutFormValues } = useAppStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(() => {
      return formState
        ? formState
        : {
            name: "",
            email: "",
            phone: "",
            address: "",
            postalCode: "",
            town: "",
            extraInfo: "",
          };
    }, [formState]),
  });

  useEffect(() => {
    if (formState) form.reset(formState);
  }, [formState, form]);

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    updateCheckoutFormValues(values);

    let promiseResolve, promiseReject;

    const promise = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    toast.promise(promise, {
      loading: t("redirecting"),
      success: t("redirecting"),
      error: t("paymentError"),
    });
    try {
      const response = await fetch("/payment/", {
        method: "POST",
        body: JSON.stringify({
          formValues: values,
          cart: state,
        }),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      promiseResolve!();
      router.replace(json.url);
    } catch (error: any) {
      promiseReject!();
      console.error(error.message);
    }
  }

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
  const paymentFee =
    Math.round(((productsPrice + deliveryFee) * 0.0129 + 0.3) * 100) / 100;
  const fullPrice = productsPrice + deliveryFee + paymentFee;

  return (
    <div className="px-8 lg:px-0 lg:w-3/5">
      <Form {...form}>
        <form
          className="flex gap-8 lg:gap-16 flex-col lg:flex-row"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="basis-1/2">
            <h1 className="my-6 text-secondary font-serif text-4xl">
              {t("title")}
            </h1>
            <h3 className="mb-0 font-serif text-2xl">{t("contact")}</h3>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="my-6 mt-3">
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="min-w-48"
                      placeholder="jan@kowalski.pl"
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h3 className="mb-0 font-serif text-2xl">{t("shipping")}</h3>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-6 mt-3">
                  <FormLabel>{t("fullName")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      required
                      className="min-w-48"
                      placeholder="Jan Kowalski"
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="my-6">
                  <FormLabel>
                    <div className="flex gap-2 items-end justify-between">
                      {t("phone")}
                    </div>
                  </FormLabel>
                  <FormControl>
                    <PhoneInput placeholder="123 456 789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="my-6">
                  <FormLabel>{t("address")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="min-w-48"
                      placeholder="Adama Mickiewicza 17B"
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 flex-wrap basis-full md:*:basis-[calc(100%/2-0.5rem)] w-full my-6">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("postalCode")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="min-w-48"
                        placeholder="12-345"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="town"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("town")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="min-w-48"
                        placeholder="Warszawa"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="extraInfo"
              render={({ field }) => (
                <FormItem className="my-6">
                  <FormLabel>{t("extraInfo")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="min-w-48"
                      placeholder={t("extraInfoDesc")}
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="basis-1/2 bg-background2 rounded-xl lg:rounded-3xl p-4 lg:p-8 flex gap-8 flex-col justify-between">
            <div>
              <div className="mb-4 flex justify-between font-serif text-2xl lg:text-4xl text-secondary">
                <h3 className="">{t2("totalPrice")}</h3>
                <span className="font-bold text-right">{fullPrice} zł</span>
              </div>
              <div className="flex justify-between lg:text-xl">
                <span className="">{t2("productPrice")}</span>
                <span className="font-bold text-right">{productsPrice} zł</span>
              </div>
              <div className="flex justify-between lg:text-xl">
                <span className="">{t2("deliveryFee")}</span>
                <span className="font-bold text-right">{deliveryFee} zł</span>
              </div>
              <div className="flex justify-between lg:text-xl">
                <span className="">{t2("transactionFee")}</span>
                <span className="font-bold text-right">{paymentFee} zł</span>
              </div>
            </div>
            <div className="mt-16">
              <div className="flex *:rounded *:basis-[calc(100%/3-0.5rem)] flex-wrap lg:*:basis-[calc(100%/6-0.5rem)] *:h-10 *:p-2 gap-2 *:border-solid *:border-[1px] *:border-neutral-300 *:bg-neutral-50 mb-4">
                <Image
                  src={p24logo}
                  alt="logo of przelewy24, the payment service"
                  className="h-full w-full"
                />
                <Image
                  src={mbankLogo}
                  alt="logo of przelewy24, the payment service"
                  className="h-full w-full"
                />
                <Image
                  src={pkoLogo}
                  alt="logo of przelewy24, the payment service"
                  className="h-full w-full"
                />
                <Image
                  src={pocztowy24logo}
                  alt="logo of przelewy24, the payment service"
                  className="h-full w-full"
                />
                <Image
                  src={blikLogo}
                  alt="logo of przelewy24, the payment service"
                  className="h-full w-full"
                />
                <div className="text-neutral-500  text-center text-sm">+33</div>
              </div>
              <p className="text-sm text-neutral-700">{t("paymentInfo")}</p>
              <Button type="submit" size="lg" className="w-full mt-2">
                <div>{t("pay")}</div>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
