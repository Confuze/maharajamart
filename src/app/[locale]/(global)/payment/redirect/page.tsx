import RedirectPage from "@/src/components/RedirectPage";
import { localeType } from "@/src/i18n/routing";
import { setRequestLocale } from "next-intl/server";

async function Redirect({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RedirectPage />;
}

export default Redirect;
