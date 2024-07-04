import { useTranslations } from "next-intl";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Link } from "@/src/navigation";
import LanguagePicker from "./LanguagePicker";
import * as HoverCard from "@radix-ui/react-hover-card";
import { products } from "../data/products";

export default function Navbar({ locale }: { locale: string }) {
  const t = useTranslations("Layout.nav");

  return (
    <div>
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <div>
                <Link href="/">{t("home")}</Link>
              </div>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <div>
                <Link href="/about">{t("about")}</Link>
              </div>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <div>
                <Link href="/contact">{t("contact")}</Link>
              </div>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>{t("products")}</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link asChild>
                <div>
                  <Link href="/products">{t("allProducts")}</Link>
                </div>
              </NavigationMenu.Link>
              {Object.keys(products).map((key) => {
                const category = products[key];

                return (
                  <NavigationMenu.Link asChild key={key}>
                    <div>
                      <Link href={`/products/${key}`}>
                        {category.displayName[locale as "en" | "pl"]}
                      </Link>
                    </div>
                  </NavigationMenu.Link>
                );
              })}
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Indicator />
        </NavigationMenu.List>

        <NavigationMenu.Viewport />
      </NavigationMenu.Root>
      <LanguagePicker locale={locale} />
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <div>
            <Link href="/cart">Cart</Link>
          </div>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content>content</HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </div>
  );
}
