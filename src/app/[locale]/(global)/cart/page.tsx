import { use } from "react";
import { localeType } from "@/src/i18n/routing";
import CartPage from "@/src/components/CartPage";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Cart" });
  return {
    title: t("cart"),
  };
}
export default function Cart({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <>
      <CartPage />
    </>
  );
}
