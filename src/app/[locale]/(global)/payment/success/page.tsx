import { localeType } from "@/src/i18n/routing";
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
    title: t("success"),
  };
}

export default async function Contact({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Checkout");

  return (
    <div className="px-8 lg:px-[25%]">
      <h1 className="my-4 text-3xl lg:text-5xl font-serif text-secondary">
        {t("success")}
      </h1>
      <p>{t("successDesc")}</p>
    </div>
  );
}
