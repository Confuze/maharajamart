"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import LanguagePicker from "./LanguagePicker";
import CartButton from "./CartButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { products } from "../data/products";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "../i18n/navigation";
import { Menu } from "lucide-react";

function MobileNav() {
  const locale = useLocale();
  const t = useTranslations("Layout");
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent className="w-5/6 bg-background2 text-primary">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="font-bold text-lg">
          <div className="flex justify-between mt-6 mb-8">
            <LanguagePicker />
            <CartButton
              onClick={() => {
                setSheetOpen(false);
              }}
            />
          </div>
          <div className="*:block *:mb-2">
            <Link
              onClick={() => {
                setSheetOpen(false);
              }}
              href="/"
            >
              {t("nav.home")}
            </Link>
            <Link
              onClick={() => {
                setSheetOpen(false);
              }}
              href="/about"
            >
              {t("nav.about")}
            </Link>
            <Link
              onClick={() => {
                setSheetOpen(false);
              }}
              href="/branches"
            >
              {t("nav.branches")}
            </Link>
            <Link
              onClick={() => {
                setSheetOpen(false);
              }}
              href="/order-cancellation"
            >
              {t("nav.orderCancellation")}
            </Link>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-bold p-0 pb-2">
                  {t("nav.products")}
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-2 gap-2">
                  <Link
                    onClick={() => {
                      setSheetOpen(false);
                    }}
                    className="text-sm font-medium"
                    href="/products"
                  >
                    {t("nav.allProducts")}
                  </Link>
                  {Object.keys(products).map((key) => {
                    const category = products[key];

                    return (
                      <Link
                        onClick={() => {
                          setSheetOpen(false);
                        }}
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
  );
}

export default MobileNav;
