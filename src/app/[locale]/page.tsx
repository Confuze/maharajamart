import CTACarousel from "@/src/components/CTACarousel";
import CTASecetion from "@/src/components/CTASecetion";
import FeaturedCarousel from "@/src/components/FeaturedCarousel";
import { CardInfo } from "@/src/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/src/components/ui/carousel";
import { products } from "@/src/data/products";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import Image, { StaticImageData } from "next/image";

const slides: { image?: StaticImageData; alt: string }[] = [
  // WARN: Delete optional image property, it's only there until I get the actual images
  { alt: "Image 1" },
  { alt: "Image 2" },
  { alt: "Image 3" },
  { alt: "Image 4" },
  { alt: "Image 5" },
];

const featured: CardInfo[] = [
  { ...products.cosmetics.products[1], category: "cosmetics" },
  { ...products.cosmetics.products[2], category: "cosmetics" },
  { ...products.cosmetics.products[3], category: "cosmetics" },
  { ...products.cosmetics.products[4], category: "cosmetics" },
  { ...products.cosmetics.products[5], category: "cosmetics" },
  { ...products.cosmetics.products[6], category: "cosmetics" },
  { ...products.cosmetics.products[7], category: "cosmetics" },
  { ...products.cosmetics.products[8], category: "cosmetics" },
  { ...products.cosmetics.products[9], category: "cosmetics" },
  { ...products.cosmetics.products[10], category: "cosmetics" },
  { ...products.cosmetics.products[11], category: "cosmetics" },
  { ...products.cosmetics.products[12], category: "cosmetics" },
  { ...products.cosmetics.products[13], category: "cosmetics" },
  { ...products.cosmetics.products[14], category: "cosmetics" },
  { ...products.cosmetics.products[15], category: "cosmetics" },
  { ...products.cosmetics.products[16], category: "cosmetics" },
  { ...products.cosmetics.products[17], category: "cosmetics" },
  { ...products.cosmetics.products[18], category: "cosmetics" },
  { ...products.cosmetics.products[19], category: "cosmetics" },
  { ...products.cosmetics.products[20], category: "cosmetics" },
];

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = useTranslations("Home");

  return (
    <>
      <CTASecetion
        title={t("hero.title")}
        description={t("hero.description")}
        ctaUrl="#featured"
        ctaText={t("hero.cta")}
      >
        <CTACarousel />
      </CTASecetion>
      <FeaturedCarousel />
    </>
  );
}
