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
import { useCartId, useCartState, useFormState } from "../lib/useStore";
import { products } from "../data/products";
import { useRouter } from "../i18n/navigation";
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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { deliveryPrices } from "../lib/deliveryPrices";

export default function CheckoutForm() {
  const t = useTranslations("Checkout");
  const t2 = useTranslations("Cart");
  const state = useCartState();
  const id = useCartId();
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
            company: "",
            address: "",
            postalCode: "",
            town: "",
            extraInfo: "",
            shippingMethod: "CLOSE_DELIVERY",
          };
    }, [formState]),
  });

  useEffect(() => {
    if (formState) form.reset(formState);
  }, [formState, form]);

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
          cartId: id,
        }),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      promiseResolve!();
      router.replace(json.url);
    } catch (error: unknown) {
      promiseReject!();
      if (error instanceof Error) {
        console.error(error.message);
      }
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
  const deliveryFee =
    productsPrice >= 200 ? 0 : deliveryPrices[form.watch("shippingMethod")];
  const paymentFee =
    Math.round((productsPrice + deliveryFee) * 0.015 * 100) / 100;
  const fullPrice = productsPrice + deliveryFee + paymentFee;

  return (
    <div className="px-8 mt-8 lg:px-0 lg:w-3/5">
      <Form {...form}>
        <form
          className="flex gap-8 lg:gap-16 flex-col lg:flex-row"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="basis-1/2">
            <h1 className="mb-6 text-secondary font-serif text-5xl">
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
              name="company"
              render={({ field }) => (
                <FormItem className="my-6">
                  <FormLabel>
                    <div className="flex gap-2 items-end justify-between">
                      {t("company")} ({t("optional")})
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="min-w-48"
                      placeholder={t("companyPlaceholder")}
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
                  <FormLabel>
                    {t("extraInfo")} ({t("optional")})
                  </FormLabel>
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
            <h3 className="mb-0 font-serif text-2xl">{t("shippingMethod")}</h3>
            <FormField
              control={form.control}
              name="shippingMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    <p>{t("shippingMethodDesc")}</p>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="CLOSE_DELIVERY">
                            <div className="flex gap-4 items-center justify-between">
                              <FormLabel className="text-xs cursor-pointer">
                                <h3 className="text-secondary text-lg mb-2">
                                  {t("shippingMethods.closeDelivery")}
                                </h3>
                                <p> {t("shippingMethods.closeDeliveryDesc")}</p>
                              </FormLabel>
                              <p className="text-nowrap">
                                {productsPrice >= 200
                                  ? 0
                                  : deliveryPrices.CLOSE_DELIVERY}{" "}
                                zł
                              </p>
                            </div>
                          </RadioGroupItem>
                        </FormControl>
                      </FormItem>
                      <FormItem className="space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="COURIER">
                            <div className="flex gap-4 items-center justify-between">
                              <FormLabel className="text-xs cursor-pointer">
                                <h3 className="text-secondary text-lg mb-2">
                                  {t("shippingMethods.courier")}
                                </h3>
                                <p> {t("shippingMethods.courierDesc")}</p>
                              </FormLabel>
                              <p className="text-nowrap">
                                {productsPrice >= 200
                                  ? 0
                                  : deliveryPrices.COURIER}{" "}
                                zł
                              </p>
                            </div>
                          </RadioGroupItem>
                        </FormControl>
                      </FormItem>
                      <FormItem className="space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="PARCEL_MACHINE">
                            <div className="flex gap-4 items-center justify-between">
                              <FormLabel className="text-xs cursor-pointer">
                                <h3 className="text-secondary text-lg mb-2">
                                  {t("shippingMethods.parcelMachine")}
                                </h3>
                                <p> {t("shippingMethods.parcelMachineDesc")}</p>
                              </FormLabel>
                              <p className="text-nowrap">
                                {productsPrice >= 200
                                  ? 0
                                  : deliveryPrices.PARCEL_MACHINE}{" "}
                                zł
                              </p>
                            </div>
                          </RadioGroupItem>
                        </FormControl>
                      </FormItem>
                      <FormItem className="space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="PICKUP_AT_STORE">
                            <div className="flex gap-4 items-center justify-between">
                              <FormLabel className="text-xs cursor-pointer">
                                <h3 className="text-secondary text-lg mb-2">
                                  {t("shippingMethods.pickupAtStore")}
                                </h3>
                                <p> {t("shippingMethods.pickupAtStoreDesc")}</p>
                              </FormLabel>
                              <p className="text-nowrap">
                                {productsPrice >= 200
                                  ? 0
                                  : deliveryPrices.PICKUP_AT_STORE}{" "}
                                zł
                              </p>
                            </div>
                          </RadioGroupItem>
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {productsPrice >= 200 && (
              <p className="mt-2 text-sm leading-none">{t("freeShipping")}</p>
            )}
          </div>
          <div className="lg:sticky lg:top-6 self-start basis-1/2 h-[60vh] bg-background2 rounded-xl lg:rounded-2xl p-4 lg:p-8 flex gap-8 flex-col justify-between border lg:border-2 border-secondary border-opacity-25">
            <div>
              <h2 className="mb-4 text-secondary font-serif text-4xl">
                {t("summary")}
              </h2>
              <div className="flex justify-between lg:text-lg">
                <span className="">{t2("productPrice")}</span>
                <span className="font-bold text-right">{productsPrice} zł</span>
              </div>
              <div className="flex justify-between lg:text-lg">
                <span className="">{t2("deliveryFee")}</span>
                <span className="font-bold text-right">{deliveryFee} zł</span>
              </div>
              <div className="flex justify-between lg:text-lg">
                <span className="">{t2("transactionFee")}</span>
                <span className="font-bold text-right">{paymentFee} zł</span>
              </div>
              <hr className="my-3 border-primary border-t-1" />
              <div className="mb-4 flex justify-between text-lg lg:text-xl text-secondary">
                <h3 className="">{t2("totalPrice")}</h3>
                <span className="font-bold text-right">{fullPrice} zł</span>
              </div>
            </div>
            <div className="mt-16">
              <div className="grid w-full overflow-hidden grid-cols-3 lg:grid-cols-6 *:rounded *:h-10 *:p-2 gap-2 *:border-solid *:border-[1px] *:border-neutral-300 *:bg-neutral-50 mb-4">
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
