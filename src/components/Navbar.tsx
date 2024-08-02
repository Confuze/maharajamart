import { useTranslations } from "next-intl";
import { Link } from "@/src/navigation";
import LanguagePicker from "./LanguagePicker";
import { products } from "@/src/data/products";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { ShoppingBasket } from "lucide-react";

export default function Navbar({ locale }: { locale: string }) {
  const t = useTranslations("Layout.nav");

  return (
    <nav className="w-full flex justify-between items-center px-20 py-4 font-bold text-xl">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/">{t("home")}</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/about">{t("about")}</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/contact">
              {t("contact")}
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{t("products")}</NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-[30vw] grid grid-cols-3">
              <NavigationMenuLink
                className="text-sm font-medium decoration-background text-background"
                href="/products"
              >
                {t("allProducts")}
              </NavigationMenuLink>
              {Object.keys(products).map((key) => {
                const category = products[key];

                return (
                  <NavigationMenuLink
                    className="text-sm font-medium decoration-background text-background"
                    href={`/products/${key}`}
                    key={key}
                  >
                    {category.displayName[locale as "en" | "pl"]}
                  </NavigationMenuLink>
                );
              })}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex gap-20">
        <LanguagePicker locale={locale} />
        <Link href="/cart" className="flex items-center">
          <ShoppingBasket className="h-8 mr-1" /> Cart
        </Link>
      </div>
    </nav>
  );
}
