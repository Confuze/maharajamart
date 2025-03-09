import RedirectPage from "@/src/components/RedirectPage";
import { localeType } from "@/src/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
function Redirect({ params }: { params: Promise<{ locale: localeType }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return <RedirectPage />;
}

export default Redirect;
