import { ReactNode } from "react";
import { Link } from "../navigation";
import { Button } from "./ui/button";

function CTASecetion({
  title,
  description,
  ctaText,
  ctaUrl,
  children,
}: {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  children: ReactNode;
}) {
  return (
    <section className="text-background min-h-[70vh] w-11/12 p-32 rounded-[32px] bg-primary flex mx-auto mt-14 mb-20">
      <div className="basis-5/12">
        <h1
          className="font-bold font-serif text-6xl mb-8"
          dangerouslySetInnerHTML={{ __html: title }} // The html comes from a local  file so it's completely safe, using this so the <br> tags in the translations work
        ></h1>
        <p className="text-2xl">{description}</p>
        <Button asChild size="cta" className="mt-12">
          <Link href={ctaUrl}>{ctaText}</Link>
        </Button>
      </div>
      <div className="basis-7/12">{children}</div>
    </section>
  );
}

export default CTASecetion;
