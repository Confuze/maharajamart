import { Clock, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { Link } from "../navigation";

function Footer() {
  const t = useTranslations("Layout.infobar");
  return (
    <footer className="*:flex *:gap-1 *:items-center text-xl mt-20 p-16 bg-secondary text-background">
      <h1 className="text-5xl font-serif font-bold mb-4">MAHARAJA MART</h1>
      <p className="">
        <Clock className="h-5" /> {t("open")} 7:00 - 16:00
      </p>
      <Link href="https://maps.app.goo.gl/TeojK7BkL4xveWmFA">
        <MapPin className="h-5" />
        Stawowa 12, 50-018 Wrocław
      </Link>
      <Link href="tel:+48537354886">
        <Phone className="h-5" />
        537 354 886
      </Link>
    </footer>
  );
}

export default Footer;
