"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, ChevronDown, MessageSquare, Filter } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useI18n } from "@/components/providers/i18n-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { getAllReviews } from "@/lib/booking"
import { RATING_DIST, getDummyReviewsForTrainer } from "@/data/trainers-data"
import { format, formatDistanceToNow } from "date-fns"
import { id as idLocale, enUS as enLocale } from "date-fns/locale"

export function TrainerReview({ trainer, isOwner }: { trainer: any, isOwner?: boolean }) {
    const { t, locale } = useI18n()
    const { profile } = useAuth()
    const [activeFilter, setActiveFilter] = useState<number | null>(null)
    const [visibleCount, setVisibleCount] = useState(5)
    const [visibleRecommendationCount, setVisibleRecommendationCount] = useState(5)
    const [expandedReviews, setExpandedReviews] = useState<number[]>([])
    
    const [reviewsList, setReviewsList] = useState<any[]>([]);

    // Calculate dynamic rating and distribution based on current reviewsList
    const reviewCount = reviewsList.length
    const averageRating = reviewCount > 0 
        ? (reviewsList.reduce((acc, r) => acc + (r.rating || 0), 0) / reviewCount).toFixed(1)
        : (trainer.rating || "0.0")

    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
        if (reviewCount === 0) return RATING_DIST.find(r => r.stars === stars) || { stars, percent: 0 }
        const count = reviewsList.filter(r => Math.floor(r.rating || 0) === stars).length
        return {
            stars,
            percent: Math.round((count / reviewCount) * 100)
        }
    })

    const loadTrainerReviews = () => {
        // Load reviews from localStorage for this teacher
        const localReviews = getAllReviews().filter(
            (r) => String(r.teacherId) === String(trainer.id)
        )
        
        // Map localStorage reviews to display format
        const mappedLocal = localReviews.map((r, idx) => ({
            id: r.id || String(10000 + idx),
            user: profile?.name || r.studentName || "Murid",
            avatar: profile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(r.studentName || 'M')}`,
            rating: r.rating,
            date: r.createdAt,
            comment: r.comment,
            tags: [],
            response: r.response,
            responseDate: r.respondedAt,
            isRecommended: r.isRecommended,
            recommendationText: r.recommendationText,
        }))
        
        const localIds = new Set(mappedLocal.map(r => String(r.id)));
        // Ensure static reviews are loaded even if trainer.reviews is undefined
        const fallbackStaticReviews = trainer.reviews && trainer.reviews.length > 0 
            ? trainer.reviews 
            : getDummyReviewsForTrainer(trainer.id);
            
        const staticReviews = fallbackStaticReviews.filter((r: any) => !localIds.has(String(r.id)));
        
        // Real data on top
        setReviewsList([...mappedLocal, ...staticReviews])
    };

    useEffect(() => {
        loadTrainerReviews();
        window.addEventListener("myqurani_reviews_updated", loadTrainerReviews);
        return () => window.removeEventListener("myqurani_reviews_updated", loadTrainerReviews);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trainer.id])

    const filteredReviews = activeFilter
        ? reviewsList.filter((r: { rating: number }) => Math.floor(r.rating) === activeFilter)
        : reviewsList

    const paginatedReviews = filteredReviews.slice(0, visibleCount)

    const handleFilterChange = (filter: number | null) => {
        setActiveFilter(filter)
        setVisibleCount(5) // Reset visible count on filter change
    }

    const toggleExpand = (id: number) => {
        setExpandedReviews(prev =>
            prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]
        )
    }


    const getRelativeDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr)
            if (isNaN(d.getTime())) return dateStr
            return formatDistanceToNow(d, { addSuffix: true, locale: locale === "id" ? idLocale : enLocale })
                .replace("sekitar ", "")
                .replace("lebih dari ", "")
                .replace("about ", "")
                .replace("over ", "")
        } catch {
            return dateStr
        }
    }

    const formatDateWithTimezone = (dateStr: string) => {
        try {
            const d = new Date(dateStr)
            if (isNaN(d.getTime())) return dateStr
            return format(d, "dd MMM yyyy, HH:mm", { locale: locale === "id" ? idLocale : enLocale })
        } catch {
            return dateStr
        }
    }

    const recommendationReviews = reviewsList.filter((r: any) => r.isRecommended);
    const paginatedRecommendations = recommendationReviews.slice(0, visibleRecommendationCount);

    return (
        <div className="space-y-6">
            {/* Header: Title and Filter */}
            <div className="flex items-center gap-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {t("marketplace_detail.all_reviews", "Penilaian & Ulasan")}
                </h3>

                {/* Filter Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 font-medium h-8">
                      <Filter className="w-4 h-4 text-slate-500" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <DropdownMenuItem onClick={() => handleFilterChange(null)} className={`font-medium cursor-pointer rounded-lg py-2 ${activeFilter === null ? "text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : ""}`}>
                          {t("marketplace_detail.filter_all", "Semua Rating")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />
                        {[5, 4, 3, 2, 1].map(stars => (
                            <DropdownMenuItem key={stars} onClick={() => handleFilterChange(stars)} className={`font-medium cursor-pointer rounded-lg py-2 ${activeFilter === stars ? "text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : ""}`}>
                                Bintang {stars}
                            </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
            </div>

            {/* Rating Summary Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
                <div className="flex flex-row gap-4 md:gap-6 items-center">
                    <div className="flex flex-col items-center gap-1 shrink-0 w-24">
                        <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{averageRating}</span>
                        <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3 w-3 md:h-4 md:w-4 ${i < Math.floor(Number(averageRating)) ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-200"}`}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] md:text-xs text-slate-500 font-medium text-center">
                            ({reviewCount} {locale === "id" ? "ulasan" : "reviews"})
                        </span>
                    </div>
                    <div className="flex-1 w-full space-y-1.5 md:space-y-2">
                        {ratingDistribution.map(r => (
                            <div key={r.stars} className="flex items-center gap-2 md:gap-2.5">
                                <span className="text-[10px] md:text-xs font-bold text-slate-500 w-2 md:w-3 text-right">{r.stars}</span>
                                <Star className="h-2.5 w-2.5 md:h-3 md:w-3 fill-yellow-400 text-yellow-400 shrink-0" />
                                <div className="flex-1 h-1.5 md:h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                                        style={{ width: `${r.percent}%` }}
                                    />
                                </div>
                                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 w-6 md:w-8">{r.percent}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {paginatedReviews.length > 0 ? (
                    paginatedReviews.map((review: {
                        id: number; user: string; avatar: string; rating: number; date: string; comment: string; tags: string[]; response?: string; responseDate?: string; isRecommended?: boolean; recommendationText?: string;
                    }) => {
                        const isExpanded = expandedReviews.includes(review.id)
                        const isLongComment = review.comment.length > 150

                        return (
                            <div
                                key={review.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all space-y-4"
                            >
                                <div className="flex gap-3.5 items-start">
                                    <Avatar className="h-10 w-10 border-2 border-slate-50 dark:border-slate-700 shadow-sm shrink-0">
                                        <AvatarImage src={review.avatar} />
                                        <AvatarFallback className="bg-emerald-50 text-emerald-700 text-xs font-bold">
                                            {review.user[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{review.user}</h4>
                                                <div className="flex items-center gap-3 mt-0.5">
                                                    <div className="flex gap-0.5">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-200"}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    {review.isRecommended && (
                                                        <div className="flex items-center gap-1.5">
                                                            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                                                            <span className="text-[10px] font-bold text-emerald-700">Direkomendasikan</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0 mt-0.5">
                                                <TooltipProvider delayDuration={0}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="text-[10px] text-slate-400 font-medium whitespace-nowrap cursor-help focus:outline-none hover:text-slate-600 transition-colors"
                                                            >
                                                                {getRelativeDate(review.date)}
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top">
                                                            <p className="text-xs">{formatDateWithTimezone(review.date)}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                {/* Action for Owner is removed as per requirements */}
                                            </div>
                                        </div>

                                        {/* Comment Text with Clamp */}
                                        <div className="space-y-1.5">
                                            <p className={`text-sm text-slate-600 dark:text-slate-300 leading-relaxed ${!isExpanded && isLongComment ? 'line-clamp-3' : ''}`}>
                                                {review.comment}
                                            </p>
                                            {isLongComment && (
                                                <button
                                                    onClick={() => toggleExpand(review.id)}
                                                    className="block ml-auto text-[10px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 underline underline-offset-2 transition-colors mt-1"
                                                >
                                                    {isExpanded ? "Sembunyikan" : "Lihat selengkapnya"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Teacher Response Section */}
                                {review.response && (
                                    <div className="ml-10 md:ml-12 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 relative">
                                        {/* Connection line */}
                                        <div className="absolute -left-5 top-4 w-5 h-px bg-slate-200 dark:bg-slate-700"></div>
                                        <div className="absolute -left-5 -top-4 w-px h-8 bg-slate-200 dark:bg-slate-700"></div>

                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1.5">
                                                <MessageSquare className="h-3 w-3 text-emerald-600" />
                                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                                    Balasan dari {trainer.name}
                                                </span>
                                            </div>
                                            {review.responseDate && (
                                                <TooltipProvider delayDuration={0}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="text-[10px] text-slate-400 font-medium cursor-help focus:outline-none hover:text-slate-600 transition-colors"
                                                            >
                                                                {getRelativeDate(review.responseDate)}
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top">
                                                            <p className="text-xs">{formatDateWithTimezone(review.responseDate)}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                        <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {review.response}
                                        </p>
                                    </div>
                                )}


                            </div>
                        )
                    })
                ) : (
                    <div className="text-center py-12 text-slate-500 font-medium bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                        {t("marketplace_detail.no_reviews_filter", "Tidak ada ulasan dengan rating ini.")}
                    </div>
                )}
            </div>

            {/* Load More Button */}
            {filteredReviews.length > visibleCount && (
                <div className="flex justify-end pt-1">
                    <button
                        className="flex items-center gap-1 text-[11px] font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        onClick={() => setVisibleCount(v => v + 5)}
                    >
                        Lihat lebih banyak
                        <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

        </div>
    )
}
