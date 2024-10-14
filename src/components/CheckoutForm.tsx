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
    toast(t("redirecting"));
    updateCheckoutFormValues(values);

    try {
      const response = await fetch("/payment/", {
        method: "POST",
        body: JSON.stringify({
          formValues: values,
          cart: state,
        }),
      });
      if (!response.ok) {
        toast.error(t("paymentError"), {
          description: response.status,
        });
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      router.replace(json.url);
    } catch (error: any) {
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
            <h1 className="mb-2 text-secondary font-serif text-4xl">
              {t("title")}
            </h1>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-6">
                  <FormLabel>{t("fullName")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
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
              name="email"
              render={({ field }) => (
                <FormItem className="my-6">
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
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="my-6">
                  <FormLabel>{t("phone")}</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      className="min-w-48"
                      placeholder="123 456 789"
                      {...field}
                    ></Input>
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
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem className="my-6">
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
                <FormItem className="my-6">
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
            <FormField
              control={form.control}
              name="extraInfo"
              render={({ field }) => (
                <FormItem className="my-6">
                  <FormLabel>{t("extraInfo")}</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
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
          <div className="basis-1/2 bg-background2 rounded-3xl p-8 flex gap-8 flex-col justify-between">
            <div>
              <div className="flex justify-between font-serif text-2xl lg:text-4xl text-secondary">
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
            <div>
              <p className="text-sm text-neutral-700">{t("paymentInfo")}</p>
              <Button type="submit" size="lg" className="w-full mt-2">
                {t("pay")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
