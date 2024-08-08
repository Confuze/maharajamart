import { Clock, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "../navigation";

function InfoBar() {
  const t = useTranslations("Layout.infobar");

  return (
    <div className="w-full py-2 px-24 flex items-center justify-between text-background bg-secondary">
      <h4 className="font-serif text-xl font-bold">MAHARAJA MART</h4>
      <div className="flex *:flex *:items-center gap-14 content-end text-sm">
        <p className="">
          <Clock className="h-4" /> {t("open")} 7:00 - 16:00
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
    </div>
  );
}

export default InfoBar;
