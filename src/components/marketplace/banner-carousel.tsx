"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Sparkles, Award, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

// --- Dummy Data (Simulasi API) ---
export interface BannerData {
    id: string;
    badge?: string;
    title: string;
    desc: string;
    image?: string;
    gradient?: string;
    icon_name?: string;
    page: "marketplace" | "home" | "recitation" | "all";
    status: boolean;
    order_index: number;
    link_url?: string;
}

const DUMMY_API_BANNERS: BannerData[] = [
    {
        id: "bnn-001",
        badge: "Mari Belajar",
        title: "Tingkatkan Kualitas Bacaan Bersama Ahlinya",
        desc: "Perbaiki makhraj dan tajwid dengan pengajar bersertifikat. Kelas privat agar hasil lebih maksimal.",
        gradient: "from-emerald-700 via-emerald-600 to-teal-600",
        icon_name: "Sparkles",
        image: "/banner-guru/banner1.png",
        page: "marketplace",
        status: true,
        order_index: 1,
        link_url: "/marketplace/product/promo-1",
    },
    {
        id: "bnn-002",
        badge: "Peluang Berkah",
        title: "Bagikan Ilmu, Tuai Keberkahan Jariyah",
        desc: "Salurkan ilmu Al-Quran Anda kepada santri di seluruh nusantara. Daftar sebagai pengajar sekarang.",
        gradient: "from-blue-700 via-indigo-600 to-blue-600",
        icon_name: "Award",
        image: "/banner-guru/banner2.png",
        page: "marketplace",
        status: true,
        order_index: 2,
        link_url: "/teachers/registers",
    },
    {
        id: "bnn-003",
        badge: "Inspirasi",
        title: "Cahayakan Hati dengan Tadabbur Al-Quran",
        desc: "Pahami makna setiap ayat yang dibaca untuk kehidupan yang lebih tenang dan terarah.",
        gradient: "from-slate-800 via-slate-900 to-slate-800",
        icon_name: "Heart",
        image: "/banner-guru/banner4.png",
        page: "marketplace",
        status: true,
        order_index: 3,
    },
    {
        id: "bnn-004",
        title: "Banner Non-Aktif",
        desc: "Ini tidak boleh muncul",
        page: "marketplace",
        status: false,
        order_index: 4,
    },
    {
        id: "bnn-005",
        title: "Banner Halaman Lain",
        desc: "Ini untuk halaman home",
        page: "home",
        status: true,
        order_index: 1,
    }
]

// Mapping icon string ke komponen Lucide
const ICON_MAP: Record<string, React.ElementType> = {
    "Sparkles": Sparkles,
    "Award": Award,
    "Heart": Heart,
}

interface BannerCarouselProps {
    page?: "marketplace" | "home" | "recitation" | "all";
}

export default function BannerCarousel({ page = "marketplace" }: BannerCarouselProps) {
    const pathname = usePathname()
    const currentLocale = pathname?.startsWith("/id") ? "id" : "en"
    const [currentBanner, setCurrentBanner] = useState(0)
    const [banners, setBanners] = useState<BannerData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Simulasi Fetch API
    useEffect(() => {
        const fetchBanners = async () => {
            setIsLoading(true)
            // Simulasi delay network 500ms
            await new Promise(resolve => setTimeout(resolve, 500))

            // Filter banner aktif sesuai halaman dan diurutkan berdasarkan order_index
            const filteredBanners = DUMMY_API_BANNERS.filter(
                (b) => (b.page === page || b.page === "all") && b.status === true
            ).sort((a, b) => a.order_index - b.order_index)

            setBanners(filteredBanners)
            setIsLoading(false)
        }

        fetchBanners()
    }, [page])

    // Auto-slide
    useEffect(() => {
        if (banners.length <= 1) return;
        const t = setInterval(() => setCurrentBanner(p => (p + 1) % banners.length), 8000)
        return () => clearInterval(t)
    }, [banners.length])

    const next = () => setCurrentBanner(p => (p + 1) % banners.length)
    const prev = () => setCurrentBanner(p => (p - 1 + banners.length) % banners.length)

    if (isLoading) {
        return (
            <div className="relative aspect-[1585/489] w-full rounded-[20px] bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
        )
    }

    if (banners.length === 0) return null;

    const currentData = banners[currentBanner];
    const Icon = currentData.icon_name && ICON_MAP[currentData.icon_name] ? ICON_MAP[currentData.icon_name] : Sparkles;

    return (
        <div className="relative group overflow-hidden rounded-[20px] shadow-lg bg-slate-100">
            {/* Aspect Ratio Tetap di 1585:489 (~3.24:1) supaya Konsisten & Gak Loncat-loncat */}
            <div className="relative aspect-[1585/489] w-full bg-[#014034]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentBanner}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center text-white overflow-hidden"
                    >
                        {/* Jika Ada Gambar Banner */}
                        {currentData.image ? (
                            <div className="relative w-full h-full">
                                {currentData.link_url ? (
                                    <Link href={currentData.link_url} className="block w-full h-full">
                                        <Image
                                            src={currentData.image}
                                            alt={currentData.title}
                                            fill
                                            className="object-cover object-center"
                                            priority
                                            sizes="100vw"
                                            quality={100}
                                        />
                                    </Link>
                                ) : (
                                    <Image
                                        src={currentData.image}
                                        alt={currentData.title}
                                        fill
                                        className="object-cover object-center"
                                        priority
                                        sizes="100vw"
                                        quality={100}
                                    />
                                )}
                            </div>
                        ) : (
                            /* Mode Teks (Gradient) */
                            <div className={cn(
                                "absolute inset-0 flex items-center p-8 md:p-16 bg-gradient-to-r",
                                currentData.gradient || "from-emerald-700 via-emerald-600 to-teal-600"
                            )}>
                                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none z-0">
                                    <Icon className="w-64 h-64 -rotate-12" />
                                </div>

                                <div className="relative z-10 max-w-3xl space-y-4">
                                    {currentData.badge && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <Badge className="bg-white/20 text-white border-0 backdrop-blur-md px-4 py-1.5 text-xs font-bold">
                                                {currentData.badge}
                                            </Badge>
                                        </motion.div>
                                    )}

                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-2xl md:text-5xl font-black tracking-tight leading-[1.1]"
                                    >
                                        {currentData.title}
                                    </motion.h1>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-emerald-50/90 text-sm md:text-lg max-w-xl font-medium leading-relaxed"
                                    >
                                        {currentData.desc}
                                    </motion.p>

                                    {currentData.link_url && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <Link href={
                                                currentData.link_url.startsWith("/en/") || currentData.link_url.startsWith("/id/")
                                                    ? currentData.link_url.replace(/^\/(?:id|en)\//, `/${currentLocale}/`)
                                                    : `/${currentLocale}${currentData.link_url.startsWith("/") ? "" : "/"}${currentData.link_url}`
                                            }>
                                                <Button className="bg-white text-slate-900 font-bold hover:bg-slate-100 rounded-full h-11 md:h-12 px-8 text-sm md:text-base border-0 shadow-xl mt-2 transition-all hover:scale-105 active:scale-95 cursor-pointer">
                                                    Cek Sekarang
                                                </Button>
                                            </Link>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            {banners.length > 1 && (
                <>
                    <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/30 z-20">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/30 z-20">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* Indicators */}
            {banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentBanner(i)}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-500",
                                currentBanner === i ? "w-8 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
