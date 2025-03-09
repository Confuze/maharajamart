import { use } from "react";
import { localeType } from "@/src/i18n/routing";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: t("title") };
}

export default function About({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("About");

  return (
    <div className="px-8 lg:px-[25%]">
      <h1 className="my-4 text-3xl lg:text-5xl font-serif text-secondary">
        {t("title")}
      </h1>
      <article
        className="[&>h3]:text-xl [&>h3]:my-2 [&>h3]:font-bold"
        dangerouslySetInnerHTML={{ __html: t.raw("content") }}
      ></article>
    </div>
  );
}
