import { localeType } from "@/src/i18n/routing";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import React, { use } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "OrderCancellation" });
  return { title: t("title") };
}

function OrderCancellation({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations("OrderCancellation");

  return (
    <div className="px-8 lg:px-[25%]">
      <h1 className="my-6 text-3xl lg:text-5xl font-serif text-secondary">
        {t("title")}
      </h1>
      <p>{t("description")}</p>
    </div>
  );
}

export default OrderCancellation;
