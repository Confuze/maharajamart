import ProductCard from "@/src/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { cn } from "../lib/utils";
import { localeType } from "../i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import prisma from "../lib/prisma";

async function FeaturedCarousel() {
  const t = await getTranslations("Home");
  const locale = (await getLocale()) as localeType;
  const featured = await prisma.product.findMany({
    where: { archived: false, featured: true },
    take: 20,
    include: { category: true },
  });

  return (
    <Carousel
      className="mx-4 lg:mx-20"
      id="featured"
      opts={{
        containScroll: "keepSnaps",
        slidesToScroll: 4,
        breakpoints: { "(min-width: 1024px)": { slidesToScroll: 5 } },
      }}
    >
      <div className="flex justify-between mb-4 items-center">
        <h1 className="font-serif text-2xl lg:text-5xl text-secondary">
          {t("featured")}
        </h1>
        <div className="lg:-mb-4 flex items-center gap-x-2">
          <CarouselPrevious className="" />
          <CarouselNext />
        </div>
      </div>
      <CarouselContent className="-mr-4 lg:-mr-8 -mb-4 lg:-mb-0 -w-full grid grid-rows-2 lg:grid-rows-1 auto-cols-featuredMobile lg:auto-cols-featuredDesktop grid-flow-col">
        {featured.map((featuredItem, index) => {
          return (
            <CarouselItem
              className={cn(
                index % 2 && "topSlide",
                "pb-4 lg:pb-0 pr-4 lg:pr-8",
              )}
              key={index}
            >
              <ProductCard locale={locale} product={featuredItem} cutTitle />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}

export default FeaturedCarousel;
