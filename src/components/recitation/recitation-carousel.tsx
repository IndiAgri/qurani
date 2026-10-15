"use client";

import * as React from "react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    src: "/img/carousel/carousel1.webp",
    alt: "Children learning Quran",
  },
  {
    id: 2,
    src: "/img/carousel/carousel2.webp",
    alt: "Quran on Rehal with golden crescent moon",
  },
  {
    id: 3,
    src: "/img/carousel/carousel3.webp",
    alt: "Teacher teaching students Quran",
  },
];

export function RecitationCarousel() {
  // Default to slide 1 (which is carousel2.webp, matching the screenshot)
  const [current, setCurrent] = React.useState(1);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[380px] lg:h-full min-h-[380px] rounded-2xl overflow-hidden shadow-sm bg-black/5 select-none">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={index === 1}
          />
        </div>
      ))}

      {/* Dark gradient overlay at bottom for dots contrast */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent z-20 pointer-events-none" />

      {/* Dots Indicator */}
      <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              index === current
                ? "w-2.5 h-2.5 bg-white scale-110 shadow-sm"
                : "w-2 h-2 bg-white/60 hover:bg-white/90"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
