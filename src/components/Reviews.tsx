import { useTranslations } from "next-intl";
import Review from "./Review";
import { parseInt } from "lodash";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

function Reviews() {
  const t = useTranslations("Home.reviews");

  const keys: ("1" | "2" | "3")[] = ["1", "2", "3"]; // As ridiculous as this looks, it's still much simpler than using the recommended next-intl method

  return (
    <section>
      <Carousel
        className="lg:overflow-visible mb-8 lg:mb-20 mx-10 lg:mx-48"
        opts={{
          breakpoints: { "(min-width: 1024px)": { active: false } },
        }}
      >
        <CarouselContent
          active={false}
          className="lg:*:basis-1/3 -w-full -mr-32"
        >
          {keys.map((key) => {
            // WARN: score should definitely not be a string but for whatever reason this is the only way that works.
            return (
              <CarouselItem key={key} className="pr-32">
                <Review
                  title={t(`${key}.title`)}
                  review={t(`${key}.review`)}
                  score={parseInt(t(`${key}.score`))}
                ></Review>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

export default Reviews;
