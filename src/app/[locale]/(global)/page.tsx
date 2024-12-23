import CTACarousel from "@/src/components/CTACarousel";
import CTASecetion from "@/src/components/CTASecetion";
import FeaturedCarousel from "@/src/components/FeaturedCarousel";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import Image from "next/image";
import scooter from "@/public/scooter.svg";
import AllCategories from "@/src/components/AllCategories";
import Reviews from "@/src/components/Reviews";

export default function Home({
  params: { locale },
}: {
  params: { locale: "en" | "pl" };
}) {
  unstable_setRequestLocale(locale);
  const t = useTranslations("Home");

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
      <FeaturedCarousel locale={locale} />
      <CTASecetion
        title={t("delivery.title")}
        description={t("delivery.description")}
        ctaUrl="#allCategories"
        ctaText={t("delivery.cta")}
        reverse
      >
        <Image src={scooter} alt="Image of a delivery scooter" />
      </CTASecetion>
      <AllCategories locale={locale} />
    </>
  );
}
