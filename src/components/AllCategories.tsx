import { useTranslations } from "next-intl";
import { products } from "../data/products";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { cn } from "../lib/utils";
import Image from "next/image";
import rice from "@/public/rice.svg";

function AllCategories({ locale }: { locale: "en" | "pl" }) {
  const t = useTranslations("Home");

  return (
    <Carousel
      className="mx-20"
      id="allCategories"
      opts={{
        containScroll: "keepSnaps",
        slidesToScroll: 6,
        breakpoints: { "(min-width: 1024px)": { slidesToScroll: 14 } },
      }}
    >
      <div className="flex justify-between mb-4 items-center">
        <h1 className="font-serif text-5xl text-secondary">
          {t("categories")}
        </h1>
        <div className="-mb-4 flex items-center gap-x-2">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
      <CarouselContent className="-mr-4 -mb-4 -w-full grid grid-rows-2 auto-cols-categoriesMobile lg:auto-cols-categoriesDesktop grid-flow-col">
        {Object.keys(products).map((key) => {
          return (
            <CarouselItem className="pr-4 pb-4" key={key}>
              <div className="w-full h-full bg-background2 rounded-xl p-2">
                <Image
                  src={rice}
                  alt="rice icon"
                  className="p-12 pb-2 w-full aspect-square"
                />
                <p className="text-center font-serif text-2xl">
                  {products[key].displayName[locale]}
                </p>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}

export default AllCategories;
