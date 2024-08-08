import ProductCard, { CardInfo } from "@/src/components/ProductCard";
import { products } from "@/src/data/products";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { useTranslations } from "next-intl";
import { cn } from "../lib/utils";

const featured: CardInfo[] = [
  // INFO: This is just placeholder, there will be actual featured products here
  { ...Object.values(products.cosmetics.products)[1], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[2], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[3], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[4], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[5], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[6], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[7], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[8], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[9], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[10], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[11], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[12], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[13], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[14], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[15], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[16], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[17], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[18], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[19], category: "cosmetics" },
  { ...Object.values(products.cosmetics.products)[20], category: "cosmetics" },
];

function FeaturedCarousel({ locale }: { locale: "en" | "pl" }) {
  const t = useTranslations("Home");

  return (
    <Carousel
      className="mx-20"
      id="featured"
      opts={{
        containScroll: "keepSnaps",
        slidesToScroll: 4,
        breakpoints: { "(min-width: 1024px)": { slidesToScroll: 5 } },
      }}
    >
      <div className="flex justify-between mb-4 items-center">
        <h1 className="font-serif text-5xl text-secondary">{t("featured")}</h1>
        <div className="-mb-4 flex items-center gap-x-2">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
      <CarouselContent className="-mr-8 -mb-8 lg:-mb-0 -w-full grid grid-rows-2 lg:grid-rows-1 auto-cols-featuredMobile lg:auto-cols-featuredDesktop grid-flow-col">
        {featured.map((featuredItem, index) => {
          return (
            <CarouselItem
              className={cn(index % 2 && "topSlide", "pb-8 lg:pb-0 pr-8")}
              key={index}
            >
              <ProductCard locale={locale} product={featuredItem} />{" "}
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}

export default FeaturedCarousel;
