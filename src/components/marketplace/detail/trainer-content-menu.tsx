"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Star, GraduationCap,
    BookOpen, ThumbsUp, Quote, Sparkles,
    Video, ExternalLink, Award, Image as ImageIcon, Play, ChevronRight
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"

import { useI18n } from "@/components/providers/i18n-provider"
import { RATING_DIST, METHOD_DESCRIPTIONS } from "@/data/trainers-data"
import { TrainerReview } from "./trainer-review"

interface TrainerContentMenuProps {
    trainer: any
    setPreviewItem: (item: any) => void
    activeTab?: string
    setActiveTab?: (tab: string) => void
    userId?: string
}

export function TrainerContentMenu({ trainer, setPreviewItem, activeTab = "info", setActiveTab, userId }: TrainerContentMenuProps) {
    const { t, locale } = useI18n()
    const router = useRouter()

    const getRelativeDate = (dateStr: string) => {
        const d = new Date(dateStr)
        const now = new Date()
        const days = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
        if (days === 0) return locale === 'id' ? 'Hari ini' : 'Today'
        if (days < 7) return locale === 'id' ? `${days} hari yang lalu` : `${days} days ago`
        const weeks = Math.floor(days / 7)
        if (weeks < 5) return locale === 'id' ? `${weeks} minggu yang lalu` : `${weeks} weeks ago`
        const months = Math.floor(days / 30)
        if (months < 12) return locale === 'id' ? `${months} bulan yang lalu` : `${months} months ago`
        const years = Math.floor(days / 365)
        return locale === 'id' ? `${years} tahun yang lalu` : `${years} years ago`
    }

    const formatDateWithTimezone = (dateStr: string) => {
        const d = new Date(dateStr)
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        const dateF = d.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        const timeF = d.toLocaleTimeString(locale === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' })
        return `${dateF}, ${timeF} (${tz})`
    }



    // Helper to get embed URL
    const getEmbedUrl = (url: string) => {
        if (!url) return ""
        if (url.includes("embed")) return url
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
        const match = url.match(regExp)
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl h-12 p-1 shadow-sm mb-5">
                <TabsTrigger value="info" className="flex-1 rounded-lg h-9 text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md gap-1.5 transition-all">
                    <BookOpen className="h-3.5 w-3.5" />
                    {t("marketplace_detail.tab_profil", "Profil")}
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex-1 rounded-lg h-9 text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md gap-1.5 transition-all">
                    <ImageIcon className="h-3.5 w-3.5" />
                    {t("marketplace_detail.tab_galeri", "Galeri")}
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1 rounded-lg h-9 text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md gap-1.5 transition-all">
                    <Star className="h-3.5 w-3.5" />
                    {t("marketplace_detail.tab_ulasan", "Ulasan")}
                </TabsTrigger>
            </TabsList>

            {/* ===== TAB: INFORMASI ===== */}
            <TabsContent value="info" className="space-y-6 mt-0">
                {/* Tentang Pengajar */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Quote className="h-4 w-4 text-emerald-600" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{t("marketplace_detail.about_teacher", "Tentang Guru")}</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{trainer.bio}</p>
                </div>

                {/* Tentang Kursus */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{t("marketplace_detail.tab_kurikulum", "Kurikulum")}</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {trainer.courseDescription || t("marketplace_detail.course_desc_fallback", `Kursus ini dirancang untuk membantu Anda menguasai {{specialization}} dengan bimbingan langsung dari {{name}}. Setiap sesi berlangsung selama 60 menit secara online melalui video call, dengan materi yang disesuaikan dengan kemampuan dan kebutuhan masing-masing santri.`, { specialization: trainer.specialization.join(', '), name: trainer.name })}
                    </p>
                </div>

                {/* Metode Pembelajaran */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                            <GraduationCap className="h-4 w-4 text-teal-600" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{t("marketplace_detail.teaching_methods", "Metode Mengajar")}</h3>
                    </div>
                    <div className="space-y-3">
                        {trainer.methods.map((method: string) => {
                            const desc = METHOD_DESCRIPTIONS[method] || { summaryKey: "marketplace_detail.method_default_desc", defaultSummary: "Metode pembelajaran Al-Quran yang teruji.", icon: "📘" }
                            return (
                                <div key={method} className="p-4 rounded-xl bg-slate-50 dark:bg-gray-700/30 border border-slate-100 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-800 transition-colors group">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xl">{desc.icon}</span>
                                        <h4 className="text-sm font-black text-slate-800 dark:text-white">{method}</h4>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-9">{t(desc.summaryKey, desc.defaultSummary)}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Video Bacaan */}
                {trainer.videoUrls && trainer.videoUrls.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-purple-100 dark:border-purple-900/30 p-5 md:p-6 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0">
                                <Video className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider leading-none">{t("marketplace_detail.video_bacaan", "Video Bacaan")}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {trainer.videoUrls.filter((url: string) => url.trim() !== "").map((url: string, index: number) => {
                                const title = trainer.videoTitles?.[index] || ""
                                return (
                                    <div key={index} className="flex flex-col group rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all">
                                        <div
                                            className="relative aspect-video w-full overflow-hidden cursor-pointer"
                                            onClick={() => setPreviewItem({
                                                type: 'video',
                                                url: url,
                                                title: title,
                                                media: trainer.videoUrls.filter((v: string) => v.trim() !== "").map((v: string, i: number) => ({
                                                    type: 'video',
                                                    url: v,
                                                    title: trainer.videoTitles?.[i] || ""
                                                }))
                                            })}
                                        >
                                            <iframe
                                                src={getEmbedUrl(url)}
                                                title={title}
                                                className="absolute inset-0 w-full h-full pointer-events-none"
                                                allowFullScreen
                                            ></iframe>
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all z-10">
                                                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                                    <ExternalLink className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        {title && (
                                            <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 min-h-[40px] flex items-center">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <Video className="h-3 w-3 text-emerald-500 shrink-0" />
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                                                        {title}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Sertifikasi */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <Award className="h-4 w-4 text-yellow-600" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{t("marketplace_detail.certifications", "Sertifikasi")}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {trainer.certifications.map((cert: any, idx: number) => (
                            <div key={cert.name} className="group rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-gray-700/30 hover:shadow-md transition-all">
                                <div
                                    className="aspect-[16/9] relative bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/10 dark:via-amber-900/10 dark:to-orange-900/10 overflow-hidden cursor-pointer group"
                                    onClick={() => setPreviewItem({
                                        type: 'image',
                                        url: cert.url,
                                        title: cert.name,
                                        media: trainer.certifications.map((c: any) => ({
                                            type: 'image',
                                            url: c.url,
                                            title: c.name
                                        }))
                                    })}
                                >
                                    <img
                                        src={cert.url}
                                        alt={cert.name}
                                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-all">
                                        <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
                                            <ExternalLink className="h-4 w-4 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="text-xs font-bold text-slate-800 dark:text-white leading-snug truncate">{cert.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </TabsContent>

            {/* ===== TAB: GALERI ===== */}
            <TabsContent value="gallery" className="mt-0">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-orange-600" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{t("marketplace_detail.tab_galeri", "Galeri")}</h3>
                    </div>

                    {trainer.gallery && trainer.gallery.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {trainer.gallery.map((item: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="group relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-lg transition-all"
                                    onClick={() => setPreviewItem({
                                        type: item.type === 'video' ? 'video' : 'image',
                                        url: item.url,
                                        title: item.title,
                                        media: trainer.gallery.map((g: any) => ({
                                            type: g.type === 'video' ? 'video' : 'image',
                                            url: g.url,
                                            title: g.title
                                        }))
                                    })}
                                >
                                    {item.type === 'video' ? (
                                        <>
                                            <img src={item.thumbnail || item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/50 transition-all">
                                                <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-2xl group-hover:scale-110 transition-transform">
                                                    <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all">
                                                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
                                                    <ExternalLink className="h-4 w-4 text-white" />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-1.5">
                                            {item.type === 'video' ? <Video className="h-3 w-3 text-white/70" /> : <ImageIcon className="h-3 w-3 text-white/70" />}
                                            <p className="text-white text-[10px] md:text-xs font-bold truncate">{item.title || (item.type === 'video' ? 'Video Aktivitas' : 'Foto Aktivitas')}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <ImageIcon className="h-10 w-10 mb-3 opacity-40" />
                            <p className="text-sm font-medium">{t("marketplace_detail.no_gallery", "Belum ada galeri")}</p>
                        </div>
                    )}
                </div>
            </TabsContent>

            {/* ===== TAB: ULASAN ===== */}
            <TabsContent value="reviews" className="mt-0">
                <TrainerReview trainer={trainer} isOwner={userId === trainer.id || true} />
            </TabsContent>
        </Tabs>
    )
}
