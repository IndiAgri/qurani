"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Star, MapPin, Briefcase, Heart, MessageSquare, Crown, Sparkles, ShieldCheck, Languages, Clock, GraduationCap, ThumbsUp
} from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { FavoriteButton } from "@/components/favorites/favorite-button"
import { getAllReviews } from "@/lib/booking"
import { useState, useEffect } from "react"

import { useI18n } from "@/components/providers/i18n-provider"
import { ArrowLeft } from "lucide-react"

interface TrainerProfileHeaderProps {
    trainer: any
    liked: boolean
    setLiked: (val: boolean) => void
    setIsChatOpen: (val: boolean) => void
    router: any
    onReviewClick?: () => void
}

const getBadgeStyles = (t: any, type?: string, name: string = "Guru") => {
    switch (type) {
        case "duta-besar":
            return {
                label: t("marketplace_detail.badge_duta_besar", "Duta Besar"),
                description: t("marketplace_detail.badge_duta_besar_desc", `${name} adalah pendidik tingkat ahli...`, { name }),
                icon: <Crown className="w-4 h-4 md:w-5 md:h-5 text-white" />,
                className: "bg-indigo-600 text-white border-indigo-400/30 shadow-[0_4px_20px_-2px_rgba(79,70,229,0.5)]"
            }
        case "guru-super":
            return {
                label: t("marketplace_detail.badge_guru_super", "Guru Super"),
                description: t("marketplace_detail.badge_guru_super_desc", `Dikenal karena cara mengajar...`, { name }),
                icon: <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />,
                className: "bg-emerald-600 text-white border-emerald-400/30 shadow-[0_4px_20px_-2px_rgba(5,150,105,0.5)]"
            }
        case "rekomendasi":
            return {
                label: t("marketplace_detail.badge_rekomendasi", "Rekomendasi"),
                description: t("marketplace_detail.badge_rekomendasi_desc", `Telah melalui proses kurasi...`, { name }),
                icon: <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-white" />,
                className: "bg-amber-500 text-white border-amber-300/30 shadow-[0_4px_20_20px_-2px_rgba(245,158,11,0.5)]"
            }
        default:
            return null
    }
}

export function TrainerProfileHeader({ trainer, liked, setLiked, setIsChatOpen, router, onReviewClick }: TrainerProfileHeaderProps) {
    const { t } = useI18n()

    // Dynamic rating calculation
    const [dynamicRating, setDynamicRating] = useState(trainer.rating || "0.0")
    const [dynamicReviewCount, setDynamicReviewCount] = useState(trainer.reviewCount || 0)
    const [recommendationCount, setRecommendationCount] = useState(0)

    useEffect(() => {
        const localReviews = getAllReviews().filter(
            (r) => String(r.teacherId) === String(trainer.id)
        )
        const staticReviews = trainer.reviews || []
        const totalReviews = localReviews.length + staticReviews.length
        
        if (totalReviews > 0) {
            let totalRating = 0
            let recommended = 0
            localReviews.forEach(r => {
                totalRating += (r.rating || 0)
                if (r.isRecommended === true) recommended++
            })
            staticReviews.forEach((r: any) => {
                totalRating += (r.rating || 0)
                // Jika isRecommended ada, gunakan nilainya. Jika undefined/tidak ada, anggap direkomendasikan jika rating >= 4
                if (r.isRecommended === true || (r.isRecommended === undefined && (r.rating || 0) >= 4)) {
                    recommended++
                }
            })
            
            setDynamicReviewCount(totalReviews)
            setDynamicRating((totalRating / totalReviews).toFixed(1))
            setRecommendationCount(recommended)
        } else {
            setDynamicReviewCount(trainer.reviewCount || 0)
            setDynamicRating(trainer.rating || "0.0")
            // Default mock recommendation count (selalu lebih sedikit dari total review)
            const mockReviewCount = trainer.reviewCount || 0
            setRecommendationCount(Math.max(1, mockReviewCount > 0 ? Math.floor(mockReviewCount * 0.95) : 0))
        }
    }, [trainer.id, trainer.rating, trainer.reviewCount, trainer.reviews])

    return (
        <>
            {/* Photo Banner */}
            <div className="h-32 md:h-48 w-full relative overflow-hidden bg-slate-900">
                <img
                    src={trainer.gallery && trainer.gallery.length > 0 ? trainer.gallery[0].url : "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2000"}
                    alt="Banner"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                {/* Back Button Overlay */}
                <div className="absolute top-4 left-4 md:top-6 md:left-8 z-30">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/20 shadow-lg rounded-xl h-9 px-4 text-xs font-bold transition-all"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="mr-1.5 h-4 w-4" />
                        {t("marketplace_detail.back_button", "Kembali")}
                    </Button>
                </div>
            </div>

            {/* =========== FULL WIDTH PROFILE HEADER =========== */}
            <div className="w-full bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-slate-700 shadow-sm relative z-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8 pb-6 md:pb-8">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
                        {/* Avatar Container */}
                        <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-xl shrink-0 border border-slate-100 dark:border-slate-700 relative z-10 -mt-16 md:-mt-20">
                            <Avatar className="h-32 w-32 md:h-44 md:w-44 rounded-full overflow-hidden bg-slate-100">
                                <AvatarImage src={trainer.avatar} alt={trainer.name} className="object-cover" />
                                <AvatarFallback className="text-3xl font-black bg-emerald-50 text-emerald-700">
                                    {trainer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Info & Actions Wrapper */}
                        <div className="flex-1 flex flex-col md:flex-row justify-between items-center md:items-start w-full gap-4 md:gap-6 mt-2 md:mt-6 text-center md:text-left">
                            {/* Text Info */}
                            <div className="space-y-2">
                                <div className="flex flex-col gap-1">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                            {trainer.name}
                                        </h1>
                                        {trainer.badgeType && (
                                            <TooltipProvider delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className={cn(
                                                            "flex items-center justify-center h-9 w-9 md:h-11 md:w-11 rounded-2xl border-2 border-white/30 animate-in zoom-in duration-500 shadow-lg shrink-0 cursor-help",
                                                            getBadgeStyles(t, trainer.badgeType, trainer.name)?.className.split(' ').filter(c => !c.startsWith('shadow-')).join(' ')
                                                        )}>
                                                            {getBadgeStyles(t, trainer.badgeType, trainer.name)?.icon}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent
                                                        side="bottom"
                                                        sideOffset={12}
                                                        className={cn(
                                                            "max-w-[280px] p-5 border-0 rounded-[20px] shadow-2xl animate-in fade-in zoom-in-95 duration-200",
                                                            trainer.badgeType === "duta-besar" ? "bg-indigo-600 text-indigo-600" :
                                                                trainer.badgeType === "guru-super" ? "bg-emerald-600 text-emerald-600" :
                                                                    "bg-amber-500 text-amber-500"
                                                        )}
                                                    >
                                                        <p className="text-[13px] text-white font-bold leading-relaxed text-center">
                                                            {getBadgeStyles(t, trainer.badgeType, trainer.name)?.description}
                                                        </p>

                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-2 text-slate-500 dark:text-slate-400 font-bold text-xs md:text-sm mt-2 md:mt-0">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-emerald-600" />
                                        <span>{t("marketplace_detail.guru_prefix", "Guru")} {trainer.specialization[0]}</span>
                                    </div>
                                    <div 
                                        className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full font-black cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors"
                                        onClick={onReviewClick}
                                    >
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="flex items-center">
                                                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-500" />
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-slate-900 text-white border-slate-800">
                                                    <p className="text-xs font-bold">{t("marketplace_detail.rating_label", "Rating Pengajar")}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        {dynamicRating}
                                        <span className="text-yellow-600/60 font-bold ml-1 text-[10px] md:text-xs">{t("marketplace_detail.reviews_count", "({{count}} Ulasan)", { count: dynamicReviewCount.toString() })}</span>
                                    </div>

                                    {/* Recommendation Badge */}
                                    <div 
                                        className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-black cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                                        onClick={onReviewClick}
                                    >
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="flex items-center">
                                                        <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-slate-900 text-white border-slate-800">
                                                    <p className="text-xs font-bold">Direkomendasikan oleh Murid</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <span className="text-[10px] md:text-xs ml-0.5 capitalize">Direkomendasikan</span>
                                        <span className="text-emerald-600/70 font-bold ml-1 text-[10px] md:text-xs">({recommendationCount})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons Row */}
                            <div className="flex items-center justify-center md:justify-start gap-2 w-full md:w-auto mt-4 md:mt-0 shrink-0">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="shrink-0 flex">
                                                <FavoriteButton
                                                    targetType="teacher"
                                                    targetId={trainer.id}
                                                    className={cn(buttonVariants({ variant: "outline", size: "icon" }), "text-slate-500 dark:text-slate-400")}
                                                    iconClassName="w-4 h-4"
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-slate-900 text-white border-slate-800">
                                            <p className="text-xs font-bold">{t("marketplace_detail.favorite_tooltip", "Favorit")}</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Button
                                        className="shrink-0"
                                        onClick={() => setIsChatOpen(true)}
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        {t("marketplace_detail.hubungi_guru", "Hubungi Guru")}
                                    </Button>
                                </TooltipProvider>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Metadata Row */}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-x-8 gap-y-3">
                        <TooltipProvider>
                            <div className="flex items-center gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center cursor-help">
                                            <MapPin className="h-4 w-4 text-emerald-600" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-800">
                                        <p className="text-xs font-bold">{t("marketplace_detail.location_label", "Lokasi Pengajar")}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{trainer.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center cursor-help">
                                            <Clock className="h-4 w-4 text-blue-600" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-800">
                                        <p className="text-xs font-bold">{t("marketplace_detail.experience_label", "Pengalaman Mengajar")}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{t("marketplace_detail.experience_years", "{{count}} Tahun", { count: trainer.experience.toString() })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center cursor-help">
                                            <GraduationCap className="h-4 w-4 text-teal-600" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-800">
                                        <p className="text-xs font-bold">{t("marketplace_detail.specialization_label", "Spesialisasi")}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <div className="flex items-center gap-2">
                                    {trainer.specialization.slice(0, 3).map((s: string, i: number) => (
                                        <span key={s} className="text-xs font-bold text-slate-600 dark:text-slate-300 relative truncate max-w-[100px] md:max-w-none">
                                            {i > 0 && <span className="mr-2 text-slate-300">•</span>}
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center cursor-help">
                                            <Languages className="h-4 w-4 text-indigo-600" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-800">
                                        <p className="text-xs font-bold">{t("marketplace_detail.languages_label", "Bahasa yang Dikuasai")}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                    {trainer.languages && trainer.languages.length > 0 ? trainer.languages.join(", ") : t("marketplace_detail.default_bahasa", "Bahasa Indonesia")}
                                </span>
                            </div>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </>
    )
}

function ArrowLeftIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    )
}
