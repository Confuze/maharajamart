import { Clock, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/navigation";
import MobileNav from "./MobileNav";

function InfoBar({ locale }: { locale: "en" | "pl" }) {
  const t = useTranslations("Layout");

  return (
    <div className="w-full text-sm py-2 px-2 lg:px-24 flex items-center justify-between text-background bg-secondary">
      <Link href="/">
        <h4 className="font-serif text-2xl lg:text-3xl font-bold">
          MAHARAJA MART
        </h4>
      </Link>
      <div className="hidden lg:flex *:flex *:items-center gap-14 content-end ">
        <p className="">
          <Clock className="h-4" /> {t("infobar.open")}
        </p>
        <Link href="https://maps.app.goo.gl/TeojK7BkL4xveWmFA">
          <MapPin className="h-4" />
          Stawowa 12, 50-018 Wrocław
        </Link>
        <Link href="tel:+48537354886">
          <Phone className="h-4" />
          537 354 886
        </Link>
      </div>
      <div className="lg:hidden">
        <MobileNav locale={locale} />
      </div>
    </div>
  );
}

export default InfoBar;
