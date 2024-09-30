import "@/src/styles/globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import { locales } from "@/src/config";
import { fontSans, fontSerif } from "../fonts";
import Navbar from "@/src/components/Navbar";
import { cn } from "@/src/lib/utils";
import InfoBar from "@/src/components/InfoBar";
import backgroundImage from "@/public/background.webp";
import Footer from "@/src/components/Footer";
import { Toaster } from "@/src/components/ui/sonner";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    template: "%s - Maharaja Mart",
    default: "Maharaja Mart",
  },
  description: "Website for the Maharaja Mart Shop",
};

export default async function LocaleLayout({
  children,
  params: { locale = "pl" },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html className="min-h-full relative scroll-smooth" lang={locale}>
      <body
        className={cn(
          "min-h-screen h-full bg-repeat bg-backround font-sans antialiased",
          fontSans.variable,
          fontSerif.variable,
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <div
            style={{
              backgroundImage: `url(${backgroundImage.src})`,
            }}
            className="bg-repeat z-[-1] absolute bottom-0 left-0 right-0 top-0 overflow-hidden opacity-5"
          />
          <InfoBar locale={locale} />
          <Navbar locale={locale} />
          <main className="min-h-[90vh]">{children}</main>
          <Footer />
          <Toaster richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
