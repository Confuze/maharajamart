import { useLocale, useTranslations } from "next-intl";
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
import CartButton from "./CartButton";
import SearchInput from "./SearchInput";

export default function Navbar() {
  const locale = useLocale();
  const t = useTranslations("Layout.nav");

  return (
    <nav className="hidden max-w-full min-w-0 lg:flex w-full justify-between items-center px-24 py-4 font-bold text-xl">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/about">{t("about")}</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/branches">
              {t("branches")}
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/order-cancellation">
              {t("orderCancellation")}
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{t("products")}</NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-[30vw] grid gap-x-4 grid-cols-3">
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
      <div className="flex gap-16 shrink max-w-full">
        <SearchInput />
        <LanguagePicker />
        <CartButton />
      </div>
    </nav>
  );
}
