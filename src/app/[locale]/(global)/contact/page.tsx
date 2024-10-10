import { Link } from "@/src/navigation";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "pl" };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Contact" });
  return {
    title: t("title"),
  };
}

export default function Contact({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = useTranslations("Contact");

  return (
    <div className="px-8 lg:px-[25%]">
      <h1 className="my-4 text-3xl lg:text-5xl font-serif text-secondary">
        {t("title")}
      </h1>
      <p>
        {t("content")}
        <Link className="text-blue-400" href="tel:+48537354886">
          537 354 886
        </Link>
      </p>
    </div>
  );
}
