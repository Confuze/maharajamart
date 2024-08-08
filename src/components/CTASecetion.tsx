import { ReactNode } from "react";
import { Link } from "../navigation";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

function CTASecetion({
  title,
  description,
  ctaText,
  ctaUrl,
  children,
  reverse,
}: {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  children: ReactNode;
  reverse?: boolean;
}) {
  return (
    <section
      className={cn(
        reverse && "flex-row-reverse",
        "text-background min-h-[70vh] w-11/12 p-32 rounded-[32px] bg-primary flex mx-auto mt-14 mb-20",
      )}
    >
      <div className={cn(reverse && "text-right", "basis-5/12")}>
        <h1
          className="font-bold font-serif text-6xl mb-8"
          dangerouslySetInnerHTML={{ __html: title }} // The html comes from a local  file so it's completely safe, using this so the <br> tags in the translations work
        ></h1>
        <p className="text-2xl">{description}</p>
        <Button
          asChild
          size="cta"
          className={cn(reverse && "float-right", "mt-12")}
        >
          <Link href={ctaUrl}>{ctaText}</Link>
        </Button>
      </div>
      <div
        className={cn(
          "flex items-center justify-center basis-7/12",
          reverse && "pl-20 justify-start",
        )}
      >
        {children}
      </div>
    </section>
  );
}

export default CTASecetion;
