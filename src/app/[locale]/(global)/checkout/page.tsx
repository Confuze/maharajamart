// Necessary data:
// Email
// Name and surname
// Adress
// Zip code
// City
// Phone number

import CheckoutForm from "@/src/components/CheckoutForm";
import { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "pl" };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Checkout" });
  return {
    title: t("title"),
  };
}

export default function Checkout({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  return (
    <div className="flex justify-center">
      <CheckoutForm />
    </div>
  );
}
