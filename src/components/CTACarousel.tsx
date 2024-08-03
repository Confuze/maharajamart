"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  DotButton,
  useDotButton,
} from "@/src/components/ui/carousel";
import Image, { StaticImageData } from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useState } from "react";

const slides: { image?: StaticImageData; alt: string }[] = [
  // WARN: Delete optional image property, it's only there until I get the actual images
  { alt: "Image 1" },
  { alt: "Image 2" },
  { alt: "Image 3" },
  { alt: "Image 4" },
  { alt: "Image 5" },
];

function CTACarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api);
  return (
    <>
      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        setApi={setApi}
        className="h-full"
      >
        <CarouselContent className="h-full *:flex *:justify-center *:items-center">
          {slides.map((slide, index) => {
            return (
              <CarouselItem key={index}>
                {slide.image ? (
                  <Image src={slide.image} alt={slide.alt} />
                ) : (
                  <p>Pls send me the images dawg</p>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="flex justify-center items-center">
          {slides.map((_, index) => {
            return (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={`${index !== selectedIndex && "opacity-50"} mr-1 h-3 w-3 bg-neutral-400 rounded-full`}
              ></DotButton>
            );
          })}
        </div>
      </Carousel>
    </>
  );
}

export default CTACarousel;
