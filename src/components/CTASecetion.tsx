import { ReactNode } from "react";
import { Link } from "../i18n/navigation";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

function CTASecetion({
  title,
  description,
  ctaText,
  ctaUrl,
  children,
  reverse,
  hero,
}: {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  children: ReactNode;
  reverse?: boolean;
  hero?: boolean;
}) {
  return (
    <section
      className={cn(
        "justify-between flex-col lg:flex-row text-center lg:text-left text-background min-h-[70vh] w-full lg:w-11/12 p-4 pt-10 pb-20 lg:p-32 rounded-3xl lg:rounded-2xl bg-primary flex mx-auto mt-10 lg:mt-14 mb-10 lg:mb-20 gap-12 lg:gap-0",
        hero && "rounded-t-none mt-0",
        reverse && "lg:flex-row-reverse flex-col-reverse",
      )}
    >
      <div className={cn(reverse && "lg:text-right", "basis-5/12")}>
        <h1
          className="font-bold font-serif text-3xl lg:text-6xl mt-4 lg:mt-0 mb-2 lg:mb-8"
          dangerouslySetInnerHTML={{ __html: title }} // The html comes from a local  file so it's completely safe, using this so the <br> tags in the translations work
        ></h1>
        <p className=" lg:text-2xl">{description}</p>
        <Button
          asChild
          variant="cta"
          size="ctaMobile"
          className={cn(
            reverse && "lg:float-right",
            "mt-4 lg:mt-12 lg:text-2xl",
          )}
        >
          <Link href={ctaUrl}>{ctaText}</Link>
        </Button>
      </div>
      <div
        className={cn(
          "flex items-center justify-center grow basis-7/12",
          reverse && "p-6 lg:justify-start",
        )}
      >
        {children}
      </div>
    </section>
  );
}

export default CTASecetion;
