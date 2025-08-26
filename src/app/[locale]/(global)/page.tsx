import CTACarousel from "@/src/components/CTACarousel";
import CTASecetion from "@/src/components/CTASecetion";
import FeaturedCarousel from "@/src/components/FeaturedCarousel";
import Image from "next/image";
import scooter from "@/public/scooter.svg";
import AllCategories from "@/src/components/AllCategories";
import Reviews from "@/src/components/Reviews";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeType } from "@/src/i18n/routing";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <>
      <CTASecetion
        title={t("hero.title")}
        description={t("hero.description")}
        ctaUrl="#featured"
        ctaText={t("hero.cta")}
        hero
      >
        <CTACarousel />
      </CTASecetion>
      <Reviews />
      <FeaturedCarousel />
      <CTASecetion
        title={t("delivery.title")}
        description={t("delivery.description")}
        ctaUrl="#allCategories"
        ctaText={t("delivery.cta")}
        reverse
      >
        <Image src={scooter} alt="Image of a delivery scooter" />
      </CTASecetion>
      <AllCategories />
    </>
  );
}
