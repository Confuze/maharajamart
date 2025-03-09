// Necessary data:
// Email
// Name and surname
// Adress
// Zip code
// City
// Phone number

import { use } from "react";
import { localeType } from "@/src/i18n/routing";
import CheckoutForm from "@/src/components/CheckoutForm";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

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

export default function Checkout({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <div className="flex justify-center">
      <CheckoutForm />
    </div>
  );
}
