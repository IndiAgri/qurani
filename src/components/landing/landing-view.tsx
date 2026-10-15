"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight, Play, ExternalLink, BookOpen } from "lucide-react";
import { Footer } from "@/components/landing/footer";

const CAROUSEL_ITEMS = [
  {
    id: 1,
    tag: "Memorization",
    subtitle: "Mistake Detection",
    description:
      "Our flagship feature: Tarteel's AI will detect missed, incorrect and skipped words in your recitation AND alert you in real time!",
    img: "/img/carousel/carousel1.webp",
  },
  {
    id: 2,
    tag: "Memorization Planning",
    subtitle: "",
    description:
      "Tailor your memorization journey to your learning style and preferences using Tarteel's intuitive planning tools.",
    img: "/img/carousel/carousel2.webp",
  },
  {
    id: 3,
    tag: "Goals",
    subtitle: "",
    description:
      "Set goals for yourself as you memorize the Quran, track your daily targets, and stay consistent on your journey.",
    img: "/img/carousel/carousel3.webp",
  },
];

const HEADLINES = ["Memorize anytime", "Memorize anywhere", "Memorize everywhere"];

const PODCAST_VIDEOS = [
  {
    id: "hwig-OJz88Y",
    date: "25.07.2025",
    title: "Quran revision Burnout? Try This 20-Minute Plan!",
    speaker: "Dari Younus Rahman | re:Verses Episode 51",
    url: "https://youtu.be/hwig-OJz88Y?si=iQXitkyAJC-64PaL",
  },
  {
    id: "ptmfvHHuXKU",
    date: "27.04.2025",
    title: "How to Practically Do Tadabbur of The Quran | Ust. Dawoud Yahya",
    speaker: "re:Verses Episode 49",
    url: "https://youtu.be/ptmfvHHuXKU?si=P5VDFkdyHQcA0IZr",
  },
  {
    id: "Pjwr276ALGU",
    date: "14.04.2025",
    title: "How to Improve Your Tajweed | Ust. Dawoud Yahya",
    speaker: "re:Verses Episode 48",
    url: "https://youtu.be/Pjwr276ALGU?si=meQhGXK7GdVLMSJn",
  },
  {
    id: "8CJDo4FS-Sg",
    date: "19.03.2025",
    title: "How to Memorize the Quran with a Busy Schedule",
    speaker: "Ust. Dawoud Yahya | re:Verses Episode 47",
    url: "https://youtu.be/8CJDo4FS-Sg?si=UhH4e0y9Zg-I3rpI",
  },
  {
    id: "6fvIMcigRsk",
    date: "02.03.2025",
    title: "Why Most People Struggle With Memorizing the Quran",
    speaker: "Ust. Dawoud Yahya re:Verses Episode 46",
    url: "https://youtu.be/6fvIMcigRsk?si=KI2HLqNP3eemkI8S",
  },
  {
    id: "r93czlwot1k",
    date: "19.01.2025",
    title: "The Quran Journey, Traits of the True Carriers of the Quran",
    speaker: "Ahmad Al-Qattani re:Verses Episode 4",
    url: "https://youtu.be/r93czlwot1k?si=vyqp0cjmVjKGTIpu",
  },
];

const ARTICLES = [
  {
    id: "art-1",
    date: "20.08.2025",
    title: "How to Prepare for Ramadan 2026 - Starting Now (6-Month Plan)",
    tag: "Ramadan Prep",
    videoId: "jY4XAavPfdc",
    url: "https://youtu.be/jY4XAavPfdc?si=UOm52J1YsGl8bjcT",
  },
  {
    id: "art-2",
    date: "18.08.2025",
    title: "Spaced Repetition and Quran Memorization: How to Make Your Hifz Stick for Life",
    tag: "Methodology",
    videoId: "rwwOzt0HDhQ",
    url: "https://youtu.be/rwwOzt0HDhQ?si=AIij60ZlRz67AgXh",
  },
  {
    id: "art-3",
    date: "15.08.2025",
    title: "The 6446 Method for Quran Memorization",
    tag: "Technique",
    videoId: "jY4XAavPfdc",
    url: "https://youtu.be/jY4XAavPfdc?si=UOm52J1YsGl8bjcT",
  },
  {
    id: "art-4",
    date: "15.08.2025",
    title: "8 Simple Ways to Restart Your Quran Journey | Sh. Ahmad Al Nufais",
    tag: "Inspiration",
    videoId: "rwwOzt0HDhQ",
    url: "https://youtu.be/rwwOzt0HDhQ?si=AIij60ZlRz67AgXh",
  },
  {
    id: "art-5",
    date: "13.08.2025",
    title: "On Happiness, Gratitude and Not Just Waiting For the Milestones",
    tag: "Mindset",
    videoId: "jY4XAavPfdc",
    url: "https://youtu.be/jY4XAavPfdc?si=UOm52J1YsGl8bjcT",
  },
  {
    id: "art-6",
    date: "11.08.2025",
    title: "How to Memorize the Quran with a Busy Schedule",
    tag: "Daily Routine",
    videoId: "rwwOzt0HDhQ",
    url: "https://youtu.be/rwwOzt0HDhQ?si=AIij60ZlRz67AgXh",
  },
];

export function LandingView({ locale = "en" }: { locale?: string }) {
  const [headlineIndex, setHeadlineIndex] = React.useState(0);
  const [carouselIndex, setCarouselIndex] = React.useState(0);
  const carouselRef = React.useRef<HTMLDivElement>(null);

  // Rotate hero headlines smoothly
  React.useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % HEADLINES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : CAROUSEL_ITEMS.length - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev < CAROUSEL_ITEMS.length - 1 ? prev + 1 : 0));
  };

  const loginHref = locale ? `/${locale}/login` : "/login";
  const registerHref = locale ? `/${locale}/register` : "/register";

  return (
    <div className="min-h-screen w-full bg-white flex flex-col font-sans select-none overflow-x-hidden">
      {/* 1. HERO BANNER WITH BACKGROUND VIDEO (FULL VIEWPORT) */}
      <section className="relative w-full h-screen min-h-screen overflow-hidden flex flex-col justify-between p-6 sm:p-10 md:p-12">
        {/* Background Video (Fills entire screen) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center scale-100 sm:scale-105 transition-transform duration-1000"
        >
          <source src="/videos/V-utama.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 pointer-events-none" />

        {/* Floating Top Navigation Header (Pill Bar matching original) */}
        <header className="relative z-20 w-full max-w-4xl mx-auto pt-2">
          <div className="w-full rounded-full bg-black/50 hover:bg-black/60 backdrop-blur-lg px-5 py-2.5 flex items-center justify-between border border-white/15 shadow-xl transition">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="size-9 sm:size-10 rounded-full bg-[#00875a] text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-md border border-white/30 group-hover:scale-105 transition">
                Q
              </div>
            </Link>

            {/* Log in Button */}
            <Link
              href={loginHref}
              className="px-5 py-1.5 sm:py-2 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium tracking-wide transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
            >
              Log in
            </Link>
          </div>
        </header>

        {/* Hero Title & Call To Action */}
        <div className="relative z-10 max-w-5xl mx-auto w-full my-auto text-left px-4 sm:px-6">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-none drop-shadow-lg transition-all duration-700">
              {HEADLINES[headlineIndex]}
            </h1>
            <div className="w-28 sm:w-36 h-2 bg-white rounded-full shadow-md" />
          </div>

          <div className="mt-8 sm:mt-10">
            <Link
              href={registerHref}
              className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 rounded-full bg-black/45 hover:bg-black/65 text-white border border-white/30 backdrop-blur-md text-sm sm:text-base font-semibold transition shadow-xl cursor-pointer hover:translate-x-1 hover:border-white/50 active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="size-4 sm:size-5" />
            </Link>
          </div>
        </div>

        {/* Bottom space filler for layout balance */}
        <div className="relative z-10 h-6" />
      </section>

      {/* 2. FEATURE SECTION: "Memorize more" */}
      <section className="w-full py-16 sm:py-24 px-6 sm:px-12 md:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading, Subtitle, Get Started Button */}
          <div className="lg:col-span-4 space-y-6 pt-2">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Memorize more
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-sm">
              Make your memorization a Premium experience.
            </p>
            <div>
              <Link
                href={registerHref}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#111927] hover:bg-black text-white text-xs sm:text-sm font-semibold shadow-md transition cursor-pointer hover:scale-105 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Right Column: Carousel Feature Cards */}
          <div className="lg:col-span-8 flex flex-col">
            <div
              ref={carouselRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {CAROUSEL_ITEMS.map((item, idx) => {
                const isActive = idx === carouselIndex;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                      isActive ? "opacity-100 scale-100" : "opacity-90 hover:opacity-100"
                    }`}
                  >
                    {/* Header info */}
                    <div className="space-y-1 mb-4 min-h-[90px]">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900">
                        {item.tag}
                      </h3>
                      {item.subtitle && (
                        <p className="text-xs font-medium text-[#00875a]">
                          {item.subtitle}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Phone Frame Mockup Container */}
                    <div className="relative w-full aspect-[9/14] rounded-2xl overflow-hidden bg-gradient-to-b from-[#e67e22] via-[#d35400] to-[#c0392b] p-2 sm:p-2.5 shadow-md flex items-center justify-center border-4 border-gray-900/10">
                      <div className="relative w-full h-full rounded-xl overflow-hidden bg-white shadow-inner">
                        <Image
                          src={item.img}
                          alt={item.tag}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slider Navigation Arrows */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous slide"
                className="size-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next slide"
                className="size-9 rounded-full bg-gray-800 hover:bg-black text-white flex items-center justify-center transition cursor-pointer hover:scale-105 active:scale-95"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PODCAST & VIDEO HIGHLIGHTS (re:Verses) */}
      <section className="w-full py-16 bg-[#fbfdfc] border-t border-b border-gray-100 px-6 sm:px-12 md:px-20">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3">
                <Play className="size-3 fill-emerald-600 text-emerald-600" />
                <span>re:Verses Podcast</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Deepen Your Quranic Connection
              </h2>
              <p className="text-sm text-gray-500 mt-2 max-w-xl">
                Tune in to practical advice, tajweed reflections, and heartfelt guidance from renowned teachers and students of knowledge.
              </p>
            </div>
            <a
              href="https://youtu.be/hwig-OJz88Y"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#00875a] hover:text-[#006946] transition group"
            >
              <span>Watch all episodes</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
            </a>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {PODCAST_VIDEOS.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 overflow-hidden"
              >
                {/* Thumbnail Container */}
                <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
                  <Image
                    src={`https://img.youtube.com/vi/${item.id}/hqdefault.jpg`}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                  
                  {/* Play badge */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-12 rounded-full bg-white/90 text-emerald-700 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#00875a] group-hover:text-white transition duration-300 backdrop-blur-xs">
                      <Play className="size-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Date badge */}
                  <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white/90 bg-black/60 px-2.5 py-0.5 rounded-md backdrop-blur-xs">
                    {item.date}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-emerald-700 transition leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-1 font-medium">
                      {item.speaker}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold pt-1">
                    <span>Watch on YouTube</span>
                    <ExternalLink className="size-3.5 opacity-80" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ARTICLES & HIFZ TIPS SECTION */}
      <section className="w-full py-16 sm:py-20 px-6 sm:px-12 md:px-20 max-w-7xl mx-auto">
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <BookOpen className="size-3" />
              <span>Articles & Guides</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Actionable Strategies for Memorization
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Proven habits, memory techniques, and schedules to help you retain every Ayah with consistency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-6 rounded-2xl bg-white border border-gray-200/90 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      {article.tag}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {article.date}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition leading-snug">
                    {article.title}
                  </h3>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="group-hover:text-gray-900 font-medium">Learn more</span>
                  <ArrowRight className="size-4 text-emerald-600 group-hover:translate-x-1 transition" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <Footer />
    </div>
  );
}

export default LandingView;
