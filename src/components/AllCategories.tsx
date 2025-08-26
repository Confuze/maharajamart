import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";
import { Link } from "../i18n/navigation";
import { categoryIcons } from "../lib/categoryIcons";
import { localeType } from "../i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import prisma from "../lib/prisma";
import { getLocalisedCategory } from "../data/products";

async function AllCategories() {
  const t = await getTranslations("Home");
  const locale = (await getLocale()) as localeType;
  const categories = await prisma.category.findMany({
    where: { archived: false },
  });

  return (
    <Carousel
      className="mx-4 lg:mx-20"
      id="allCategories"
      opts={{
        containScroll: "keepSnaps",
        slidesToScroll: 4,
        breakpoints: { "(min-width: 1024px)": { slidesToScroll: 10 } },
      }}
    >
      <div className="flex justify-between mb-4 items-center">
        <h1 className="font-serif text-2xl lg:text-5xl text-secondary">
          {t("categories")}
        </h1>
        <div className="-mb-4 flex items-center gap-x-2">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
      <CarouselContent className="-mr-4 -mb-4 -w-full grid grid-rows-2 auto-cols-categoriesMobile lg:auto-cols-categoriesDesktop grid-flow-col">
        {categories.map((category) => {
          // eslint-disable-next-line
          const image: any = (categoryIcons as any)[category.slug]; // hacky, but there isn't really a better way to do this. Just gotta trust that the names match.
          return (
            <Link href={`/products/${category.slug}`} key={category.id}>
              <CarouselItem className="pr-4 pb-4">
                <div className="w-full h-full flex items-center justify-center flex-col bg-background2 rounded-xl p-2 lg:p-6 border lg:border-2 border-secondary border-opacity-25 duration-150 hover:shadow-[0_0_.75rem_0rem_rgba(0,0,0,0.2)] hover:scale-[97.5%]">
                  <Image
                    src={image}
                    alt="category icon"
                    className="w-2/5 lg:px-4 aspect-square opacity-75"
                  />
                  <p className="text-center font-serif text-sm lg:text-xl">
                    {getLocalisedCategory(locale, category)}
                  </p>
                </div>
              </CarouselItem>
            </Link>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}

export default AllCategories;
