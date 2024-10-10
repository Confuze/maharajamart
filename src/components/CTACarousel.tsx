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
import meats from "@/public/homeSlider/meat.png";
import vegetables from "@/public/homeSlider/vegetables.png";
import products from "@/public/homeSlider/products.png";
import groceries from "@/public/homeSlider/groceries.png";

const slides: { image: StaticImageData; alt: string }[] = [
  // WARN: Delete optional image property, it's only there until I get the actual images
  { image: groceries, alt: "Picture of indian groceries" },
  { image: vegetables, alt: "Picture of vegetables" },
  { image: products, alt: "Picture of indian products" },
  { image: meats, alt: "Picture of meat" },
];

function CTACarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const { selectedIndex, onDotButtonClick } = useDotButton(api);
  return (
    <>
      <Carousel
        plugins={[Autoplay({ delay: 3000 })]}
        setApi={setApi}
        className="h-full top-0 bottom-0 left-0 right-0"
      >
        <CarouselContent className="h-full *:flex *:justify-center *:items-center">
          {slides.map((slide, index) => {
            return (
              <CarouselItem className="" key={index}>
                {slide.image ? (
                  <Image
                    loading={index == 0 ? "eager" : "lazy"}
                    className="w-2/3"
                    src={slide.image}
                    alt={slide.alt}
                  />
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
