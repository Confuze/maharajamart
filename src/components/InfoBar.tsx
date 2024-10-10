import { Clock, MapPin, Menu, Phone, ShoppingBasket } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "../navigation";
import { products } from "@/src/data/products";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import LanguagePicker from "./LanguagePicker";
import CartButton from "./CartButton";

function InfoBar({ locale }: { locale: string }) {
  const t = useTranslations("Layout");

  return (
    <div className="w-full text-sm py-2 px-2 lg:px-24 flex items-center justify-between text-background bg-secondary">
      <Link href="/">
        <h4 className="font-serif text-xl font-bold">MAHARAJA MART</h4>
      </Link>
      <div className="hidden lg:flex *:flex *:items-center gap-14 content-end ">
        <p className="">
          <Clock className="h-4" /> {t("infobar.open")} 7:00 - 16:00
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
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent className="w-5/6 bg-background2 text-primary">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="font-bold text-lg">
              <div className="flex justify-between mt-6 mb-8">
                <LanguagePicker locale={locale} />
                <CartButton />
              </div>
              <div className="*:block *:mb-2">
                <Link href="/">{t("nav.home")}</Link>
                <Link href="/about">{t("nav.about")}</Link>
                <Link href="/contact">{t("nav.contact")}</Link>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="font-bold p-0 pb-2">
                      {t("nav.products")}
                    </AccordionTrigger>
                    <AccordionContent className="grid grid-cols-2 gap-2">
                      <Link className="text-sm font-medium" href="/products">
                        {t("nav.allProducts")}
                      </Link>
                      {Object.keys(products).map((key) => {
                        const category = products[key];

                        return (
                          <Link
                            className="text-sm font-medium"
                            href={`/products/${key}`}
                            key={key}
                          >
                            {category.displayName[locale as "en" | "pl"]}
                          </Link>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default InfoBar;
