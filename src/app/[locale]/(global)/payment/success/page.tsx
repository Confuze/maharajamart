import { localeType } from "@/src/i18n/routing";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Checkout" });
  return {
    title: t("success"),
  };
}

export default function Contact({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Checkout");

  return (
    <div className="px-8 lg:px-[25%]">
      <h1 className="my-4 text-3xl lg:text-5xl font-serif text-secondary">
        {t("success")}
      </h1>
      <p>{t("successDesc")}</p>
    </div>
  );
}
