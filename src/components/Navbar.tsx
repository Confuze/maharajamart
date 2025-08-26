import LanguagePicker from "./LanguagePicker";
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
import { getLocale, getTranslations } from "next-intl/server";
import prisma from "../lib/prisma";
import { getLocalisedCategory } from "../data/products";
import { localeType } from "../i18n/routing";
import { Suspense } from "react";

export default async function Navbar() {
  const locale = (await getLocale()) as localeType;
  const t = await getTranslations("Layout.nav");
  const categories = await prisma.category.findMany({
    where: { archived: false },
  });

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
                href="/products/all/1"
              >
                {t("allProducts")}
              </NavigationMenuLink>
              {categories.map((category) => {
                return (
                  <NavigationMenuLink
                    className="text-sm font-medium decoration-background text-background"
                    href={`/products/${category.slug}`}
                    key={category.id}
                  >
                    {getLocalisedCategory(locale, category)}
                  </NavigationMenuLink>
                );
              })}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex gap-16 shrink max-w-full">
        <Suspense>
          <SearchInput />
          <LanguagePicker />
        </Suspense>
        <CartButton />
      </div>
    </nav>
  );
}
