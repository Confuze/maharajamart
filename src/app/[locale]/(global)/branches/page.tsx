import { use } from "react";
import { localeType } from "@/src/i18n/routing";
import Branch from "@/src/components/Branch";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import maharajaWro from "@/public/maharajaWro.jpg";
import maharajaPoz from "@/public/maharajaPoz.jpg";
import restaurant from "@/public/restaurant.jpg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Branches" });
  return {
    title: t("title"),
  };
}

export default function Branches({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Branches");

  return (
    <div className="px-8 lg:px-[30%]">
      <h1 className="my-6 text-3xl lg:text-5xl font-serif text-secondary">
        {t("title")}
      </h1>
      <div className="flex flex-col gap-4">
        <Branch
          name="Maharaja Mart Wrocław"
          image={maharajaWro}
          open={t("maharajaOpen")}
          location="Stawowa 12, 50-018 Wrocław"
          locationURL="https://maps.app.goo.gl/LzFCmQjoyY1L1Grm6"
          phone="537 354 886"
        />
        <Branch
          name="Maharaja Mart Poznań"
          image={maharajaPoz}
          open={t("maharajaOpen")}
          location="Gwarna 9, 61-702 Poznań"
          locationURL="https://maps.app.goo.gl/zseBqKVYRgk6Ntj87"
          phone="575 543 954"
        />
        <Branch
          name={t("restaurant")}
          description={t("restaurantDesc")}
          image={restaurant}
          open={t("restaurantOpen")}
          location="Hugona Kołłątaja 22, 50-002 Wrocław"
          locationURL="https://maps.app.goo.gl/6sA1ywm9DhQLJZeb7"
          phone="511 365 829"
        />
      </div>
    </div>
  );
}
