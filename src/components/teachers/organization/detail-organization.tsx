"use client"

import { use, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useI18n } from "@/components/providers/i18n-provider"
import { motion, AnimatePresence } from "framer-motion"
import { MOCK_ORGANIZATIONS, MOCK_ORGANIZATIONS_DETAIL } from "@/data/organizations-data"
import { DUMMY_TRAINERS } from "@/data/trainers-data"
import { getInitials } from "@/utils/helpers/get-initials"
import { TrainerMediaPopup } from "@/components/marketplace/detail/trainer-media-popup"
import { ChatDialog } from "@/components/marketplace/chat-dialog"
import {
    MapPin, Calendar, Users, Building,
    ArrowLeft, CheckCircle2,
    MessageSquare, BookOpen, Presentation, Megaphone, Clock, Star, ShieldCheck, Mail,
    Users2, GraduationCap, BarChart3, ArrowUpRight, ChevronRight, XCircle, CheckCircle,
    Sparkles, Languages, ThumbsUp, Loader2, LayoutGrid, ExternalLink, Image as ImageIcon, ArrowRight,
    Play, Video as VideoIcon, Award
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const recentActivities = [
    { user: "Ustadz Hanif", action: "menyelesaikan sesi", target: "Kelas Tahsin - Ahmad Rizky", time: "15 menit lalu", route: "programs" },
    { user: "Siti Fatimah", action: "mendaftar sebagai murid baru", target: "", time: "2 jam lalu", route: "students" },
]

export default function OrganizationDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { locale } = useI18n()
    const orgId = params.orgId as string

    const [previewItem, setPreviewItem] = useState<any>(null)
    const [showJoinDialog, setShowJoinDialog] = useState(false)
    const [showContactDialog, setShowContactDialog] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Get organization data or fallback
    const org = MOCK_ORGANIZATIONS_DETAIL[orgId] || MOCK_ORGANIZATIONS_DETAIL["ORG-001"]

    // Real-time join status simulation
    const [joinStatus, setJoinStatus] = useState<'none' | 'pending' | 'joined'>(() => {
        if (typeof window === 'undefined') return 'none'
        const acceptedOrgs = JSON.parse(localStorage.getItem('org_accepted_trainers') || '[]')
        // In this simulation, if 'current-user' is accepted, it means THIS teacher is joined
        if (acceptedOrgs.includes('current-user')) return 'joined'

        const pendingOrgs = JSON.parse(localStorage.getItem('teacher_pending_joins') || '[]')
        if (pendingOrgs.includes(orgId)) return 'pending'

        return 'none'
    })

    const nav = (path: string) => router.push(`/${locale}/organization/${orgId}/${path}`)

    const handleJoinRequest = async () => {
        setIsSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Save to simulation storage
        const pendingOrgs = JSON.parse(localStorage.getItem('teacher_pending_joins') || '[]')
        if (!pendingOrgs.includes(orgId)) {
            localStorage.setItem('teacher_pending_joins', JSON.stringify([...pendingOrgs, orgId]))
        }

        setIsSubmitting(false)
        setJoinStatus('pending')
        setShowJoinDialog(false)
        toast.success("Permintaan bergabung berhasil dikirim!", {
            description: "Admin yayasan akan meninjau profil kamu dalam 1-3 hari kerja.",
        })
    }

    return (
        <div className="min-h-screen pb-24 bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">
            {/* Photo Banner */}
            <div className="h-32 md:h-48 w-full relative overflow-hidden bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <img
                    src={org.banner}
                    alt="Banner"
                    className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

                {/* Back Button Overlay */}
                <div className="absolute top-4 left-4 md:top-6 md:left-8 z-30">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/20 shadow-lg rounded-xl h-9 px-4 text-xs font-bold transition-all"
                        onClick={() => router.push(`/${locale}/teacher/organizations`)}
                    >
                        <ArrowLeft className="mr-1.5 h-4 w-4" />
                        Kembali ke Daftar
                    </Button>
                </div>
            </div>

            {/* =========== FULL WIDTH HEADER =========== */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-slate-700 shadow-sm relative z-20"
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 pb-6 md:pb-8">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                        {/* Logo Container */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-xl shrink-0 border border-slate-100 dark:border-slate-700 relative z-10 -mt-16 md:-mt-20"
                        >
                            <Avatar className="h-28 w-28 md:h-40 md:w-40 rounded-xl overflow-hidden bg-emerald-50">
                                <AvatarImage src={org.logo} alt={org.name} className="object-cover" />
                                <AvatarFallback className="text-3xl font-black text-emerald-700">
                                    {getInitials(org.name)}
                                </AvatarFallback>
                            </Avatar>
                        </motion.div>

                        {/* Title & Meta Info */}
                        <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 mt-2 md:mt-4">
                            <div className="space-y-2">
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col items-start gap-1">
                                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                            {org.name}
                                        </h1>
                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 shadow-none font-black px-2 py-0.5">
                                            {org.category}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-500 dark:text-slate-400 font-bold text-xs md:text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-emerald-600" />
                                        <span>{org.city}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-emerald-600" />
                                        <span>Berdiri {org.foundedYear || "2010"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-emerald-600" />
                                        <span>{org.memberCount} Guru</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons (Right) */}
                            <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                                {joinStatus === 'none' && (
                                    <Button
                                        className="rounded-xl h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg shadow-emerald-200 dark:shadow-emerald-950/20"
                                        onClick={() => setShowJoinDialog(true)}
                                    >
                                        Gabung Sekarang
                                    </Button>
                                )}
                                {joinStatus === 'pending' && (
                                    <Button
                                        disabled
                                        className="rounded-xl h-11 px-6 bg-slate-100 text-slate-400 font-black border border-slate-200"
                                    >
                                        <Clock className="h-4 w-4 mr-2" />
                                        Menunggu Persetujuan
                                    </Button>
                                )}
                                {joinStatus === 'joined' && (
                                    <Button
                                        className="rounded-xl h-11 px-6 bg-emerald-50 text-emerald-700 border border-emerald-100 font-black"
                                        onClick={() => router.push(`/${locale}/teacher/organizations/${orgId}/dashboard`)}
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Kelola Pengajar
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    className="rounded-xl h-11 px-5 border-slate-200 dark:border-slate-700 font-bold text-slate-600 shadow-sm"
                                    onClick={() => setShowContactDialog(true)}
                                >
                                    <Mail className="h-4 w-4 mr-2 text-emerald-600" />
                                    Hubungi Kami
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                {/* =========== MAIN CONTENT GRID =========== */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    {/* Left Column: Tabbed Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-8"
                    >
                        <Tabs defaultValue={joinStatus === 'joined' ? "my-dashboard" : "info"} className="w-full">
                            <TabsList className="w-full flex-wrap bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl h-auto p-1 shadow-sm mb-5">
                                {joinStatus === 'joined' && (
                                    <TabsTrigger value="my-dashboard" className="flex-1 min-w-[120px] rounded-lg h-9 text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md gap-1.5 transition-all">
                                        <Presentation className="h-3.5 w-3.5" />
                                        Kelas Saya
                                    </TabsTrigger>
                                )}
                                <TabsTrigger value="info" className="flex-1 min-w-[120px] rounded-lg h-9 text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md gap-1.5 transition-all text-center">
                                    <BookOpen className="h-3.5 w-3.5" />
                                    Profil
                                </TabsTrigger>
                                <TabsTrigger value="colleagues" className="flex-1 min-w-[120px] rounded-lg h-9 text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md gap-1.5 transition-all">
                                    <Users className="h-3.5 w-3.5" />
                                    {joinStatus === 'joined' ? "Guru Lain" : "Daftar Guru"}
                                </TabsTrigger>
                                <TabsTrigger value="activities" className="flex-1 min-w-[120px] rounded-lg h-9 text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md gap-1.5 transition-all">
                                    <ImageIcon className="h-3.5 w-3.5" />
                                    Galeri
                                </TabsTrigger>
                            </TabsList>

                            {/* ===== TAB: MY DASHBOARD (Joined only) ===== */}
                            {joinStatus === 'joined' && (
                                <TabsContent value="my-dashboard" className="space-y-6 mt-0">
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
                                        <div className="flex items-center gap-2.5 mb-6">
                                            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                <BookOpen className="h-4 w-4 text-emerald-600" />
                                            </div>
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-wider">Jadwal Mengajar Saya</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {org.classes.map((cls: any) => (
                                                <div key={cls.id} className="border border-slate-100 dark:border-slate-700 rounded-xl p-4 bg-slate-50/50 dark:bg-gray-900/20 hover:border-emerald-300 transition-all cursor-pointer">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">{cls.name}</h4>
                                                        <span className="shrink-0 text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                                                            {cls.status}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                            {cls.time}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                            <Users className="w-3.5 h-3.5 text-slate-400" />
                                                            {cls.students} Santri Aktif
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>
                            )}

                            {/* ===== TAB: INFO ===== */}
                            <TabsContent value="info" className="space-y-6 mt-0">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 md:p-8 shadow-sm space-y-8">
                                    {/* TENTANG ORGANISASI */}
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-widest justify-start flex items-center gap-2 mb-3">
                                            <Building className="w-4 h-4 text-emerald-600" />
                                            Tentang Organisasi
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                                            {org.description}
                                        </p>
                                    </div>




                                    {/* VISI & MISI (Gabungan) */}
                                    <div className="py-6 border-y border-slate-100 dark:border-slate-800 space-y-6">
                                        {org.vision && (
                                            <div>
                                                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-widest justify-start flex items-center gap-2 mb-3">
                                                    <Star className="w-4 h-4 text-emerald-600" />
                                                    Visi
                                                </h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                                    &quot;{org.vision}&quot;
                                                </p>
                                            </div>
                                        )}
                                        {org.mission && (
                                            <div>
                                                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-widest justify-start flex items-center gap-2 mb-3">
                                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                                    Misi
                                                </h3>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                                    {org.mission.map((m: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                                            {m}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* VIDEO DOKUMENTASI (Paling Bawah) */}
                                    <div className="pt-2">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0">
                                                <VideoIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-wider leading-none">Video Kegiatan</h3>

                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { url: "https://www.youtube.com/embed/UbWZkVIEjrI", title: "Kegiatan Belajar Mengajar Rutin" },
                                                { url: "https://www.youtube.com/embed/yWb9DyLZ_Mk", title: "Wisuda Santri & Khotmil Qur'an" },
                                                { url: "https://www.youtube.com/embed/u1Tei-_XGOM", title: "Bakti Sosial & Santunan Yatim" },
                                            ].map((video, idx) => (
                                                <div key={idx} className="flex flex-col group rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all">
                                                    <div
                                                        className="relative aspect-video w-full overflow-hidden cursor-pointer"
                                                        onClick={() => setPreviewItem({ type: 'video', url: video.url, title: video.title })}
                                                    >
                                                        <img
                                                            src={`https://img.youtube.com/vi/${video.url.split('/').pop()?.split('?')[0]}/maxresdefault.jpg`}
                                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            alt={video.title}
                                                        />
                                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-all z-10">
                                                            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-2xl group-hover:scale-110 transition-transform">
                                                                <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
                                                        <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-slate-600 transition-colors">
                                                            {video.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>


                            {/* ===== TAB: GURU LAIN ===== */}
                            <TabsContent value="colleagues" className="space-y-4 mt-0">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-widest">Daftar Pengajar</h3>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {DUMMY_TRAINERS.slice(1, Math.min(7, org.memberCount + 1)).map((trainer: any) => (
                                            <div key={trainer.id} className="flex flex-row h-24 bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700/80 rounded-xl overflow-hidden hover:border-emerald-200 hover:shadow-sm transition-all group">
                                                {/* Image Section */}
                                                <div className="w-24 shrink-0 bg-slate-100 dark:bg-slate-800">
                                                    <img src={trainer.avatar} className="w-full h-full object-cover" alt={trainer.name} onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + trainer.name + '&background=059669&color=fff' }} />
                                                </div>
                                                {/* Info Section */}
                                                <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
                                                    <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-emerald-600/70 tracking-wider">
                                                        <BookOpen className="w-3 h-3 text-emerald-600" />
                                                        <span className="truncate">{trainer.methods.join(", ")}</span>
                                                    </div>
                                                    <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                                        {trainer.name}
                                                    </h4>
                                                    <div className="flex items-center gap-x-3 mt-1.5 text-[11px] text-slate-500">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
                                                            <span className="font-bold text-slate-700 dark:text-slate-300">{trainer.rating}</span>
                                                        </div>
                                                        <span className="text-slate-300 dark:text-slate-600">•</span>
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            <span className="truncate">{trainer.city || 'Depok'}, {trainer.province || 'Jawa Barat'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {org.memberCount > 6 && (
                                        <div className="flex justify-center text-center mt-6">
                                            <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-xs font-bold gap-2 rounded-xl">
                                                Lihat Semua {org.memberCount} Pengajar
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* ===== TAB: GALERI ===== */}
                            {/* ===== TAB: GALERI ===== */}
                            <TabsContent value="activities" className="mt-0 space-y-6">
                                {/* ===== SECTION: GALLERY ===== */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 md:p-8 shadow-sm">
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                            <Sparkles className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-wider">Galeri Aktivitas</h3>
                                    </div>

                                    {/* Transforming one item to Hybrid for demonstration as per user request */}
                                    {(() => {
                                        const baseActivities = org.activities || []
                                        const displayActivities = [...baseActivities].slice(0, 4)

                                        // Make the 2nd item hybrid if we have enough items
                                        displayActivities[1] = {
                                            ...displayActivities[1],
                                            description: "Dokumentasi Wisuda & Kegiatan",
                                            images: [displayActivities[1].image, "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800"],
                                            videoUrls: ["https://www.youtube.com/watch?v=UbWZkVIEjrI", "https://www.youtube.com/watch?v=yWb9DyLZ_Mk"],
                                            isAlbum: true
                                        }

                                        return displayActivities.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {displayActivities.map((item: any, idx: number) => {
                                                    const mediaList = [
                                                        ...(item.images || [item.image]).map((img: string) => ({ type: 'image' as const, url: img })),
                                                        ...(item.videoUrls || []).map((v: string) => ({ type: 'video' as const, url: v }))
                                                    ];
                                                    const totalMedia = mediaList.length;

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="flex flex-col group rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all cursor-pointer"
                                                            onClick={() => {
                                                                setPreviewItem({
                                                                    media: mediaList,
                                                                    url: mediaList[0].url,
                                                                    title: item.description
                                                                })
                                                            }}
                                                        >
                                                            <div className="relative aspect-video w-full overflow-hidden">
                                                                <img src={item.image} alt={item.description} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                                                                {/* Indicator for Hybrid/Album */}
                                                                {totalMedia > 1 && (
                                                                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md flex items-center gap-1.5 border border-white/10 z-20">
                                                                        <LayoutGrid className="h-3 w-3" />
                                                                        {totalMedia} Media
                                                                    </div>
                                                                )}

                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                                                    <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
                                                                        {item.videoUrls?.length > 0 ? <VideoIcon className="h-3.5 w-3.5 text-white" /> : <ExternalLink className="h-3.5 w-3.5 text-white" />}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="px-3 py-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
                                                                <div className="flex items-center gap-2">
                                                                    {item.videoUrls?.length > 0 ? <VideoIcon className="h-3.5 w-3.5 text-emerald-500" /> : <ImageIcon className="h-3.5 w-3.5 text-emerald-500" />}
                                                                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-slate-600 transition-colors tracking-tight">
                                                                        {item.description || 'Foto Aktivitas'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                                <ImageIcon className="h-10 w-10 mb-3 opacity-40" />
                                                <p className="text-sm font-medium">Belum ada galeri</p>
                                            </div>
                                        )
                                    })()}
                                </div>
                            </TabsContent>

                        </Tabs>
                    </motion.div>

                    {/* =========== RIGHT SIDEBAR =========== */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-4"
                    >
                        {joinStatus === 'joined' ? (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xl overflow-hidden sticky top-24">
                                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-5 py-6 text-center relative overflow-hidden text-white">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <CheckCircle2 className="w-24 h-24" />
                                    </div>
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-inner mb-3 border border-white/30">
                                            <ShieldCheck className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="font-black text-lg tracking-tight mb-0.5">Pengajar Aktif</h3>
                                        <p className="text-xs text-emerald-100 font-medium">Sejak {org.joinedDate}</p>
                                    </div>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                            <p className="text-[10px] text-slate-500 font-bold mb-1">Total Santri</p>
                                            <p className="text-xl font-black text-slate-800 dark:text-white">{org.myStats.studentsActive}</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                            <p className="text-[10px] text-slate-500 font-bold mb-1">Jam Mengajar</p>
                                            <p className="text-xl font-black text-slate-800 dark:text-white">{org.myStats.totalHours}</p>
                                        </div>
                                    </div>
                                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-xl border border-yellow-100 dark:border-yellow-900/30 flex items-center justify-between">
                                        <span className="text-xs font-bold text-yellow-800 dark:text-yellow-500">Rating Performa</span>
                                        <div className="flex items-center gap-1 font-black text-sm">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                                            {org.myStats.rating}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 rounded-xl shadow-md" onClick={() => router.push(`/${locale}/organization/dashboard/${orgId}/payouts`)}>
                                        Tarik Penghasilan
                                    </Button>
                                    <Button variant="outline" className="w-full border-slate-200 text-slate-500 font-bold h-10 rounded-xl" onClick={() => router.push(`/${locale}/organization/${orgId}/settings`)}>
                                        Pengaturan
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden sticky top-24 p-5 space-y-5">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-widest flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-emerald-600" />
                                        Lokasi Organisasi
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-medium">Kunjungi kami untuk informasi lebih lanjut.</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-900/50 shadow-inner">
                                        {/* Embedded Google Map */}
                                        <div className="h-56 relative w-full overflow-hidden bg-slate-100 dark:bg-slate-800 group rounded-2xl">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                frameBorder="0"
                                                scrolling="no"
                                                marginHeight={0}
                                                marginWidth={0}
                                                src={`https://maps.google.com/maps?q=${encodeURI(org.address + ', ' + org.city)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                                className="absolute inset-0"
                                            />
                                        </div>
                                        <div className="p-4 flex gap-4 items-start border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-gray-800">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                                                <Building className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div className="space-y-1.5 flex-1">
                                                <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{org.city}</p>
                                                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{org.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            <TrainerMediaPopup
                previewItem={previewItem}
                setPreviewItem={setPreviewItem}
            />

            {/* JOIN CONFIRMATION DIALOG */}
            <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Gabung Organisasi</DialogTitle>
                        <DialogDescription>
                            Anda akan mengajukan permintaan bergabung ke <strong>{org.name}</strong>. Admin akan meninjau profil pengajar Anda.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-4">
                        <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900 group">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                                <Users2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Bangun Relasi</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Perluas jangkauan dakwah dan bangun relasi antar sesama guru di bawah naungan organisasi.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900 group">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Ikuti Galeri & Kegiatan</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Ikuti berbagai kegiatan seru untuk menambah wawasan dan meningkatkan kualitas pengajaran Anda.</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-3 font-bold mt-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowJoinDialog(false)}
                            disabled={isSubmitting}
                            className="rounded-xl"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleJoinRequest}
                            disabled={isSubmitting}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                "Gabung"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* CONTACT FORM DIALOG */}
            <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                <DialogContent className="sm:max-w-[480px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black text-slate-900 dark:text-white">Hubungi Kami</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700 dark:text-slate-300 tracking-wider">Nama Lengkap</label>
                            <input
                                type="text"
                                placeholder="Masukkan nama Anda"
                                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700 dark:text-slate-300 tracking-wider">Email</label>
                            <input
                                type="email"
                                placeholder="email@contoh.com"
                                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700 dark:text-slate-300 tracking-wider">Kategori</label>
                            <Select>
                                <SelectTrigger className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 transition-all font-medium">
                                    <SelectValue placeholder="Pilih kategori pertanyaan" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                    <SelectItem value="umum" className="rounded-lg font-medium py-2.5">Pertanyaan Umum</SelectItem>
                                    <SelectItem value="pendaftaran" className="rounded-lg font-medium py-2.5">Pendaftaran Pengajar</SelectItem>
                                    <SelectItem value="kerjasama" className="rounded-lg font-medium py-2.5">Kerjasama Organisasi</SelectItem>
                                    <SelectItem value="masalah" className="rounded-lg font-medium py-2.5">Laporan Masalah</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700 dark:text-slate-300 tracking-wider">Pesan</label>
                            <textarea
                                rows={4}
                                placeholder="Tuliskan pertanyaan atau pesan Anda di sini..."
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-3">
                        <Button variant="outline" onClick={() => setShowContactDialog(false)} className="rounded-xl font-bold">
                            Batal
                        </Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                            onClick={() => {
                                setShowContactDialog(false)
                                toast.success("Pesan terkirim! Kami akan segera menghubungi Anda.")
                            }}
                        >

                            Kirim
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}
