import { useTranslations } from "next-intl";
import Review from "./Review";
import { parseInt } from "lodash";

function Reviews() {
  const t = useTranslations("Home.reviews");

  const keys: ("1" | "2" | "3")[] = ["1", "2", "3"]; // As ridiculous as this looks, it's still much simpler than using the recommended next-intl method

  return (
    <section className="flex justify-center *:basis-1/3 pb-20 px-48 gap-48">
      {keys.map((key) => {
        // WARN: score should definitely not be a string but for whatever reason this is the only way that works.
        return (
          <Review
            key={key}
            title={t(`${key}.title`)}
            review={t(`${key}.review`)}
            score={parseInt(t(`${key}.score`))}
          ></Review>
        );
      })}
    </section>
  );
}

export default Reviews;
