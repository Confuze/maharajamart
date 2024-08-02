import CTASecetion from "@/src/components/CTASecetion";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
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
      />
    </>
  );
}
