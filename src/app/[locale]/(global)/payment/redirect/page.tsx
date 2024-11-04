import RedirectPage from "@/src/components/RedirectPage";
import { unstable_setRequestLocale } from "next-intl/server";
function Redirect({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return <RedirectPage />;
}

export default Redirect;
