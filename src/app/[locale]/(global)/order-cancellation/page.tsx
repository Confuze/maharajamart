import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import React from "react";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "pl" };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "OrderCancellation" });
  return { title: t("title") };
}

function OrderCancellation({ locale }: { locale: string }) {
  unstable_setRequestLocale(locale);

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
