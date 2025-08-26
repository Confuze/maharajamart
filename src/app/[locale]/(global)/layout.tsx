import "@/src/styles/globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { fontSans, fontSerif } from "../../fonts";
import Navbar from "@/src/components/Navbar";
import { cn } from "@/src/lib/utils";
import InfoBar from "@/src/components/InfoBar";
import backgroundImageSrc from "@/public/background.webp";
import Footer from "@/src/components/Footer";
import { Toaster } from "@/src/components/ui/sonner";
import { getImageProps } from "next/image";
import { localeType, routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";

export const dynamic = "error";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    template: "%s - Maharaja Mart",
    default: "Maharaja Mart",
  },
  description: "Website for the Maharaja Mart Shop",
};

function getBackgroundImage(srcSet = "") {
  const imageSet = srcSet
    .split(", ")
    .map((str) => {
      const [url, dpi] = str.split(" ");
      return `url("${url}") ${dpi}`;
    })
    .join(", ");
  return `image-set(${imageSet})`;
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const {
    props: { srcSet },
  } = getImageProps({
    alt: "Background image",
    src: backgroundImageSrc,
  });
  const backgroundImage = getBackgroundImage(srcSet);

  const { locale } = await params;
  if (!routing.locales.includes(locale as localeType)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html className="min-h-full relative scroll-smooth" lang={locale}>
      <body
        className={cn(
          "min-h-screen h-full text-primary bg-repeat bg-backround font-sans antialiased",
          fontSans.variable,
          fontSerif.variable,
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <div
            style={{
              backgroundImage,
            }}
            className="bg-repeat bg-[length:100%] z-[-1] absolute bottom-0 left-0 right-0 top-0 overflow-hidden opacity-5"
          />
          <InfoBar />
          <Navbar />
          <main className="min-h-[90vh]">{children}</main>
          <Footer />
          <Toaster richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
