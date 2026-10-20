"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useI18n } from "@/components/providers/i18n-provider"
import { motion, AnimatePresence } from "framer-motion"
import { MOCK_ORGANIZATIONS, MOCK_ORGANIZATIONS_DETAIL } from "@/data/organizations-data"
import { DUMMY_TRAINERS } from "@/data/trainers-data"
import { getInitials } from "@/utils/helpers/get-initials"
import { TrainerMediaPopup } from "@/components/marketplace/detail/trainer-media-popup"
import {
    MapPin, Calendar, Users, Building,
    ArrowLeft, CheckCircle2,
    MessageSquare, BookOpen, Presentation, Megaphone, Clock, Star, ShieldCheck, Mail,
    Users2, GraduationCap, BarChart3, ArrowUpRight, ChevronRight, XCircle, CheckCircle,
    Sparkles, Languages, ThumbsUp, Loader2, LayoutGrid, ExternalLink, Image as ImageIcon, ArrowRight,
    Play, Video as VideoIcon, Award, Zap, Target, Heart, TrendingUp, FileText, UserCheck,
    BadgeCheck, Banknote, BookMarked, Network, Gift, ChevronDown
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export default function OrganizationExploreDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { locale } = useI18n()
    const orgId = params.orgId as string

    const [previewItem, setPreviewItem] = useState<any>(null)
    const [showJoinDialog, setShowJoinDialog] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [joinStatus, setJoinStatus] = useState<'none' | 'pending'>('none')
    const [activeRequirement, setActiveRequirement] = useState<number | null>(null)

    const org = MOCK_ORGANIZATIONS_DETAIL[orgId] || MOCK_ORGANIZATIONS_DETAIL["ORG-001"]

    const handleJoinRequest = async () => {
        setIsSubmitting(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
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

    const benefits = [
        {
            icon: <Banknote className="h-5 w-5 text-emerald-600" />,
            bg: "bg-emerald-100 dark:bg-emerald-900/30",
            title: "Penghasilan Terstruktur",
            desc: "Dapatkan sistem penggajian yang transparan dan terjadwal setiap bulan langsung dari organisasi."
        },
        {
            icon: <Network className="h-5 w-5 text-blue-600" />,
            bg: "bg-blue-100 dark:bg-blue-900/30",
            title: "Jaringan Guru Luas",
            desc: "Bergabung dengan komunitas pengajar berpengalaman dan perluas koneksi dakwah Anda."
        },
        {
            icon: <GraduationCap className="h-5 w-5 text-purple-600" />,
            bg: "bg-purple-100 dark:bg-purple-900/30",
            title: "Pelatihan & Sertifikasi",
            desc: "Ikuti program pelatihan rutin dan dapatkan sertifikasi resmi yang meningkatkan kredibilitas Anda."
        },
        {
            icon: <BookMarked className="h-5 w-5 text-orange-600" />,
            bg: "bg-orange-100 dark:bg-orange-900/30",
            title: "Kurikulum Terstandar",
            desc: "Gunakan kurikulum terstandar yang sudah teruji dan mudah diterapkan dalam sesi mengajar."
        },
        {
            icon: <Gift className="h-5 w-5 text-pink-600" />,
            bg: "bg-pink-100 dark:bg-pink-900/30",
            title: "Fasilitas & Tunjangan",
            desc: "Nikmati berbagai fasilitas seperti ruang kelas, materi ajar digital, dan tunjangan hari raya."
        },
        {
            icon: <TrendingUp className="h-5 w-5 text-teal-600" />,
            bg: "bg-teal-100 dark:bg-teal-900/30",
            title: "Perkembangan Karir",
            desc: "Naiki jenjang karir dari guru biasa hingga koordinator program dengan jalur yang jelas."
        },
    ]

    const requirements = [
        {
            icon: <FileText className="h-5 w-5 text-slate-600" />,
            title: "Dokumen Identitas",
            desc: "KTP atau identitas resmi yang masih berlaku untuk verifikasi data diri.",
            detail: "Scan atau foto KTP dengan kualitas jelas. Dokumen harus masih berlaku dan nama harus sesuai dengan akun yang terdaftar."
        },
        {
            icon: <BookOpen className="h-5 w-5 text-slate-600" />,
            title: "Sanad / Ijazah Mengajar",
            desc: "Bukti kemampuan membaca atau menghafal Al-Qur'an dari guru yang bersanad.",
            detail: "Ijazah dari pondok pesantren, lembaga tahfidz, atau guru bersanad yang diakui. Minimal mampu membaca Al-Qur'an dengan tajwid yang benar."
        },
        {
            icon: <UserCheck className="h-5 w-5 text-slate-600" />,
            title: "Profil Lengkap",
            desc: "Lengkapi profil Qurani dengan foto, bio, dan riwayat pengalaman mengajar.",
            detail: "Foto profil profesional, bio minimal 100 karakter, serta daftar pengalaman mengajar atau pendidikan yang relevan."
        },
        {
            icon: <BadgeCheck className="h-5 w-5 text-slate-600" />,
            title: "Verifikasi Akun",
            desc: "Akun Qurani harus sudah terverifikasi nomor telepon dan email.",
            detail: "Verifikasi email dan nomor WhatsApp aktif diperlukan agar dapat dihubungi oleh admin organisasi."
        },
    ]

    const programs = [
        {
            icon: <BookOpen className="h-5 w-5 text-emerald-600" />,
            badge: "Unggulan",
            badgeColor: "bg-emerald-100 text-emerald-700",
            title: "Tahsin Al-Qur'an",
            desc: "Program perbaikan bacaan Al-Qur'an untuk segala usia dengan metode Tartil dan Mujawwad.",
            students: "240+",
            duration: "3 Bulan",
            level: "Semua Level"
        },
        {
            icon: <Award className="h-5 w-5 text-purple-600" />,
            badge: "Bersertifikat",
            badgeColor: "bg-purple-100 text-purple-700",
            title: "Tahfidz Intensif",
            desc: "Program menghafal Al-Qur'an 30 juz dengan target hafalan dan muroja'ah terjadwal.",
            students: "180+",
            duration: "12 Bulan",
            level: "Menengah - Mahir"
        },
        {
            icon: <Users2 className="h-5 w-5 text-blue-600" />,
            badge: "Komunitas",
            badgeColor: "bg-blue-100 text-blue-700",
            title: "Halaqah Rutin",
            desc: "Kajian mingguan mencakup tafsir, hadits, dan fiqh untuk pendalaman ilmu agama.",
            students: "320+",
            duration: "Mingguan",
            level: "Semua Level"
        },
        {
            icon: <GraduationCap className="h-5 w-5 text-orange-600" />,
            badge: "Anak-anak",
            badgeColor: "bg-orange-100 text-orange-700",
            title: "TPA / TPQ",
            desc: "Pendidikan Al-Qur'an untuk anak usia 5-15 tahun dengan kurikulum yang menyenangkan.",
            students: "400+",
            duration: "Fleksibel",
            level: "Pemula"
        },
    ]

    return (
        <div className="min-h-screen pb-24 bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">
            {/* Photo Banner */}
            <div className="h-40 md:h-56 w-full relative overflow-hidden bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <img src={org.banner} alt="Banner" className="w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30"></div>
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

                {/* Explore badge on banner */}
                <div className="absolute top-4 right-4 md:top-6 md:right-8 z-30">
                    <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
                        🔍 Explore Organisasi
                    </span>
                </div>
            </div>

            {/* FULL WIDTH HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-slate-700 shadow-sm relative z-20"
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 pb-6 md:pb-8">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                        {/* Logo */}
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

                        {/* Title & Meta */}
                        <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 mt-2 md:mt-4">
                            <div className="space-y-2">
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col items-start gap-1.5">
                                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                            {org.name}
                                        </h1>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 shadow-none font-black px-2 py-0.5">
                                                {org.category}
                                            </Badge>
                                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 shadow-none font-bold px-2 py-0.5 text-[11px]">
                                                ✓ Terverifikasi
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-500 dark:text-slate-400 font-bold text-xs md:text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-emerald-600" />
                                        <span>{org.city}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-emerald-600" />
                                        <span>{org.memberCount} Guru Aktif</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4 text-emerald-600" />
                                        <span>500+ Santri</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-emerald-600" />
                                        <span>Berdiri 2015</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="text-center bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-lg font-black text-slate-900 dark:text-white">4.9</p>
                                    <p className="text-[10px] text-slate-500 font-bold flex items-center gap-0.5">
                                        <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-500" />Rating
                                    </p>
                                </div>
                                <div className="text-center bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-lg font-black text-slate-900 dark:text-white">4</p>
                                    <p className="text-[10px] text-slate-500 font-bold">Program</p>
                                </div>
                                <div className="text-center bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-lg font-black text-slate-900 dark:text-white">9th</p>
                                    <p className="text-[10px] text-slate-500 font-bold">Tahun</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

                    {/* LEFT COLUMN: Tabbed Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-8"
                    >
                        <Tabs defaultValue="info" className="w-full">
                            <TabsList className="w-full flex-wrap bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl h-auto p-1 shadow-sm mb-5">
                                <TabsTrigger value="info" className="flex-1 min-w-[100px] rounded-lg h-9 text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md gap-1.5 transition-all">
                                    <Building className="h-3.5 w-3.5" />
                                    Profil
                                </TabsTrigger>
                                <TabsTrigger value="benefits" className="flex-1 min-w-[100px] rounded-lg h-9 text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md gap-1.5 transition-all">
                                    <Gift className="h-3.5 w-3.5" />
                                    Keuntungan
                                </TabsTrigger>
                                <TabsTrigger value="programs" className="flex-1 min-w-[100px] rounded-lg h-9 text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md gap-1.5 transition-all">
                                    <BookOpen className="h-3.5 w-3.5" />
                                    Program
                                </TabsTrigger>
                                <TabsTrigger value="teachers" className="flex-1 min-w-[100px] rounded-lg h-9 text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md gap-1.5 transition-all">
                                    <Users className="h-3.5 w-3.5" />
                                    Pengajar
                                </TabsTrigger>
                                <TabsTrigger value="gallery" className="flex-1 min-w-[100px] rounded-lg h-9 text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md gap-1.5 transition-all">
                                    <ImageIcon className="h-3.5 w-3.5" />
                                    Galeri
                                </TabsTrigger>
                            </TabsList>

                            {/* TAB: PROFIL */}
                            <TabsContent value="info" className="space-y-5 mt-0">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 md:p-8 shadow-sm space-y-8">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-widest flex items-center gap-2 mb-3">
                                            <Building className="w-4 h-4 text-emerald-600" />
                                            Tentang Organisasi
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                                            {org.description}
                                        </p>
                                    </div>

                                    <div className="py-6 border-y border-slate-100 dark:border-slate-800 space-y-6">
                                        {org.vision && (
                                            <div>
                                                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-widest flex items-center gap-2 mb-3">
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
                                                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-widest flex items-center gap-2 mb-3">
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

                                    {/* VIDEO */}
                                    <div className="pt-2">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0">
                                                <VideoIcon className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-wider">Video Kegiatan</h3>
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
                                                        <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{video.title}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* TAB: KEUNTUNGAN */}
                            <TabsContent value="benefits" className="space-y-5 mt-0">
                                {/* Benefits Grid */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 md:p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                            <Sparkles className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-wider">Keuntungan Bergabung</h3>
                                            <p className="text-[11px] text-slate-500 font-medium">Apa yang Anda dapatkan sebagai pengajar</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {benefits.map((b, i) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 hover:bg-emerald-50/30 dark:hover:border-emerald-900 transition-all group">
                                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", b.bg)}>
                                                    {b.icon}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">{b.title}</h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{b.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Requirements / Syarat Bergabung */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 md:p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                            <FileText className="h-4 w-4 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-wider">Syarat Bergabung</h3>
                                            <p className="text-[11px] text-slate-500 font-medium">Pastikan Anda memenuhi semua persyaratan</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {requirements.map((req, i) => (
                                            <div key={i} className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                                                <button
                                                    className="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-left"
                                                    onClick={() => setActiveRequirement(activeRequirement === i ? null : i)}
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                                                        {req.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-black text-slate-900 dark:text-white">{req.title}</p>
                                                        <p className="text-[11px] text-slate-500 font-medium truncate">{req.desc}</p>
                                                    </div>
                                                    <ChevronDown className={cn("h-4 w-4 text-slate-400 shrink-0 transition-transform", activeRequirement === i && "rotate-180")} />
                                                </button>
                                                <AnimatePresence>
                                                    {activeRequirement === i && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-5 py-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                                                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{req.detail}</p>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            {/* TAB: PROGRAM */}
                            <TabsContent value="programs" className="space-y-5 mt-0">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 md:p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <BookOpen className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-wider">Program Organisasi</h3>
                                            <p className="text-[11px] text-slate-500 font-medium">Program pengajaran yang tersedia</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {programs.map((prog, i) => (
                                            <div key={i} className="flex flex-col rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:border-emerald-200 hover:shadow-sm transition-all group">
                                                <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 flex-1">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                                                            {prog.icon}
                                                        </div>
                                                        <span className={cn("text-[10px] font-black px-2 py-1 rounded-md", prog.badgeColor)}>
                                                            {prog.badge}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1.5">{prog.title}</h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{prog.desc}</p>
                                                </div>
                                                <div className="px-4 py-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold">
                                                            <Users className="w-3 h-3" />
                                                            {prog.students}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold">
                                                            <Clock className="w-3 h-3" />
                                                            {prog.duration}
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                                                        {prog.level}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            {/* TAB: PENGAJAR */}
                            <TabsContent value="teachers" className="space-y-4 mt-0">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-widest">Daftar Pengajar</h3>
                                        <span className="text-xs text-slate-500 font-bold bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                                            {org.memberCount} Guru
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {DUMMY_TRAINERS.slice(1, Math.min(7, org.memberCount + 1)).map((trainer: any) => (
                                            <div key={trainer.id} className="flex flex-row h-24 bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700/80 rounded-xl overflow-hidden hover:border-emerald-200 hover:shadow-sm transition-all group">
                                                <div className="w-24 shrink-0 bg-slate-100 dark:bg-slate-800">
                                                    <img src={trainer.avatar} className="w-full h-full object-cover" alt={trainer.name} onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + trainer.name + '&background=059669&color=fff' }} />
                                                </div>
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

                            {/* TAB: GALERI */}
                            <TabsContent value="gallery" className="mt-0 space-y-6">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 md:p-8 shadow-sm">
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                            <Sparkles className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-wider">Galeri Aktivitas</h3>
                                    </div>
                                    {(() => {
                                        const baseActivities = org.activities || []
                                        const displayActivities = [...baseActivities].slice(0, 4)
                                        if (displayActivities.length > 1) {
                                            displayActivities[1] = {
                                                ...displayActivities[1],
                                                description: "Dokumentasi Wisuda & Kegiatan",
                                                images: [displayActivities[1].image, "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800"],
                                                videoUrls: ["https://www.youtube.com/watch?v=UbWZkVIEjrI"],
                                                isAlbum: true
                                            }
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
                                                            onClick={() => setPreviewItem({ media: mediaList, url: mediaList[0].url, title: item.description })}
                                                        >
                                                            <div className="relative aspect-video w-full overflow-hidden">
                                                                <img src={item.image} alt={item.description} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                                {totalMedia > 1 && (
                                                                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md flex items-center gap-1.5 border border-white/10 z-20">
                                                                        <LayoutGrid className="h-3 w-3" />
                                                                        {totalMedia} Media
                                                                    </div>
                                                                )}
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                                                    <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
                                                                        <ExternalLink className="h-3.5 w-3.5 text-white" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="px-3 py-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
                                                                <div className="flex items-center gap-2">
                                                                    <ImageIcon className="h-3.5 w-3.5 text-emerald-500" />
                                                                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
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

                    {/* RIGHT SIDEBAR: Join Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-4 space-y-5"
                    >
                        {/* JOIN CTA CARD */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden sticky top-24">
                            {joinStatus === 'none' ? (
                                <>
                                    {/* Gradient Header */}
                                    <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 px-5 py-6 relative overflow-hidden">
                                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                                                    <Zap className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-xs font-black text-emerald-100 tracking-wider">OPEN RECRUITMENT</span>
                                            </div>
                                            <h3 className="font-black text-xl text-white tracking-tight leading-tight mb-1">
                                                Bergabunglah Bersama Kami!
                                            </h3>
                                            <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                                                Jadilah bagian dari keluarga besar {org.name} dan berkontribusi dalam dakwah Islam.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-700 border-b border-slate-100 dark:border-slate-700">
                                        {[
                                            { label: "Guru", value: org.memberCount },
                                            { label: "Santri", value: "500+" },
                                            { label: "Program", value: "4" }
                                        ].map((s, i) => (
                                            <div key={i} className="py-3 text-center">
                                                <p className="text-base font-black text-slate-900 dark:text-white">{s.value}</p>
                                                <p className="text-[10px] text-slate-500 font-bold">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mini benefit list */}
                                    <div className="p-4 space-y-2.5">
                                        {[
                                            { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />, text: "Penghasilan rutin & terstruktur" },
                                            { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />, text: "Kurikulum & materi sudah disiapkan" },
                                            { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />, text: "Komunitas guru yang suportif" },
                                            { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />, text: "Pelatihan & sertifikasi berkala" },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2.5">
                                                {item.icon}
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.text}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="p-4 pt-0 space-y-2.5">
                                        <Button
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-950/20 text-sm"
                                            onClick={() => setShowJoinDialog(true)}
                                        >
                                            <UserCheck className="h-4 w-4 mr-2" />
                                            Daftar Bergabung
                                        </Button>
                                        <p className="text-center text-[10px] text-slate-400 font-medium">
                                            Proses review 1–3 hari kerja · Gratis
                                        </p>
                                    </div>

                                    {/* Rating */}
                                    <div className="mx-4 mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-900/30 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[1,2,3,4,5].map(s => (
                                                    <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                            <span className="text-xs font-black text-yellow-800 dark:text-yellow-500">4.9</span>
                                        </div>
                                        <span className="text-[10px] text-yellow-700 dark:text-yellow-600 font-bold">dari 48 ulasan guru</span>
                                    </div>
                                </>
                            ) : (
                                /* PENDING STATE */
                                <>
                                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 px-5 py-6 relative overflow-hidden">
                                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                                        <div className="relative z-10 flex flex-col items-center text-center">
                                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                                                <Clock className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="font-black text-lg text-white mb-1">Menunggu Persetujuan</h3>
                                            <p className="text-xs text-amber-100 font-medium">Permintaan bergabung Anda sedang ditinjau oleh admin organisasi.</p>
                                        </div>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/20">
                                            <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                            <p className="text-xs text-amber-800 dark:text-amber-400 font-medium leading-relaxed">
                                                Permintaan Anda sudah diterima. Admin akan menghubungi melalui email atau WhatsApp dalam 1–3 hari kerja.
                                            </p>
                                        </div>
                                        <div className="space-y-2 text-xs font-bold text-slate-500">
                                            <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Profil terkirim</div>
                                            <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-amber-400" /> Menunggu review admin</div>
                                            <div className="flex items-center gap-2 opacity-40"><XCircle className="w-3.5 h-3.5" /> Konfirmasi bergabung</div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* LOCATION CARD */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden p-5 space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-emerald-600" />
                                    Lokasi Organisasi
                                </h3>
                                <p className="text-[11px] text-slate-500 font-medium">Kunjungi kami untuk informasi lebih lanjut.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-900/50 shadow-inner">
                                <div className="h-48 relative w-full overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-2xl">
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
                    </motion.div>

                </div>
            </div>

            <TrainerMediaPopup previewItem={previewItem} setPreviewItem={setPreviewItem} />

            {/* JOIN DIALOG */}
            <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
                <DialogContent className="sm:max-w-[460px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black">Konfirmasi Bergabung</DialogTitle>
                        <DialogDescription>
                            Anda akan mengajukan permintaan bergabung ke <strong>{org.name}</strong>. Admin akan meninjau profil pengajar Anda dalam 1–3 hari kerja.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-3">
                        <p className="text-xs font-black text-slate-500 tracking-wider uppercase">Yang akan dikirimkan ke admin:</p>
                        {[
                            { icon: <UserCheck className="w-4 h-4 text-emerald-600" />, text: "Data profil dan foto Anda" },
                            { icon: <Star className="w-4 h-4 text-yellow-500" />, text: "Rating dan ulasan sebagai pengajar" },
                            { icon: <BookOpen className="w-4 h-4 text-blue-600" />, text: "Riwayat metode dan pengalaman mengajar" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="gap-3 font-bold mt-2">
                        <Button variant="outline" onClick={() => setShowJoinDialog(false)} disabled={isSubmitting} className="rounded-xl">
                            Batal
                        </Button>
                        <Button
                            onClick={handleJoinRequest}
                            disabled={isSubmitting}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Memproses...</>
                            ) : (
                                <><UserCheck className="mr-2 h-4 w-4" />Kirim Permintaan</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}