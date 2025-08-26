// Necessary data:
// Email
// Name and surname
// Adress
// Zip code
// City
// Phone number

import { localeType } from "@/src/i18n/routing";
import CheckoutForm from "@/src/components/CheckoutForm";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CartRevalidator from "@/src/components/CartRevalidator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Checkout" });
  return {
    title: t("title"),
  };
}

export default async function Checkout({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex justify-center">
      <CartRevalidator cache={false} />
      <CheckoutForm />
    </div>
  );
}
