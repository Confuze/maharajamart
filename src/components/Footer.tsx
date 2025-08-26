import { Clock, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { Link } from "../i18n/navigation";
import { SiFacebook, SiInstagram } from "@icons-pack/react-simple-icons";

function Footer() {
  const t = useTranslations("Layout.infobar");
  return (
    <footer className="*:flex *:gap-1 *:items-center text-md lg:text-xl mt-20 p-4 lg:p-16 bg-secondary text-background">
      <h1 className="text-2xl lg:text-5xl font-serif font-bold mb-4">
        MAHARAJA MART
      </h1>
      <p className="">
        <Clock className="h-4 lg:h-5" /> {t("open")}{" "}
      </p>
      <Link href="https://maps.app.goo.gl/TeojK7BkL4xveWmFA">
        <MapPin className="h-4 lg:h-5" />
        Stawowa 12, 50-018 Wrocław
      </Link>
      <Link href="tel:+48537354886">
        <Phone className="h-4 lg:h-5" />
        537 354 886
      </Link>
      <div className="float !gap-3 mt-3">
        <Link
          target="_blank"
          href="https://www.instagram.com/maharajamartwroclaw"
        >
          <SiInstagram className="h-10 lg:h-14" />
        </Link>
        <Link
          target="_blank"
          href="https://www.facebook.com/profile.php?id=100085702502876&"
        >
          <SiFacebook className="h-10 lg:h-14" />
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
