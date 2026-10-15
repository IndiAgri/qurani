"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    src: "/banner-guru/banner1.png",
    alt: "Tingkatkan Kualitas Bacaan Bersama Ahlinya",
    href: "/teachers",
  },
  {
    id: 2,
    src: "/banner-guru/banner2.png",
    alt: "Bagikan Ilmu, Tuai Keberkahan Jariyah",
    href: "/teachers/registers",
  },
  {
    id: 3,
    src: "/banner-guru/banner3.png",
    alt: "Belajar Al-Qur'an Bersama Guru Bersertifikat",
    href: "/teachers",
  },
  {
    id: 4,
    src: "/banner-guru/banner4.png",
    alt: "Program Tahsin dan Tahfidz Qurani",
    href: "/teachers",
  },
];

export function TeacherBanner() {
  const pathname = usePathname();
  const currentLocale = pathname?.startsWith("/id") ? "id" : "en";
  const [current, setCurrent] = React.useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[400px] rounded-3xl overflow-hidden shadow-md group">
      {/* Banner Slides */}
      {banners.map((banner, index) => {
        const fullHref = `/${currentLocale}${banner.href.startsWith("/") ? "" : "/"}${banner.href}`;
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {banner.href ? (
              <Link href={fullHref} className="block w-full h-full relative cursor-pointer group/slide">
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover/slide:scale-[1.01]"
                  priority={index === 0}
                />
              </Link>
            ) : (
              <Image
                src={banner.src}
                alt={banner.alt}
                fill
                className="object-cover object-center"
                priority={index === 0}
              />
            )}
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-xs transition z-20 cursor-pointer"
      >
        <ChevronLeft className="size-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-xs transition z-20 cursor-pointer"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Go to banner slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              index === current
                ? "w-6 h-2 bg-white rounded-full shadow-sm"
                : "w-2 h-2 bg-white/60 hover:bg-white/90"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
