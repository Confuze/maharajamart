import { localeType } from "@/src/i18n/routing";
import CartPage from "@/src/components/CartPage";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CartRevalidator from "@/src/components/CartRevalidator";

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
export default async function Cart({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <CartRevalidator />
      <CartPage />
    </>
  );
}
