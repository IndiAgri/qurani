"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useInView } from "framer-motion"
import {
    ShieldCheck, Sparkles, Crown, Clock, Wallet, Heart,
    CheckCircle2, ChevronRight, BookOpen, Percent,
    Users, Star, Award
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Footer } from "@/components/landing/footer"

function AnimatedCounter({ value, duration = 1.5, delay = 0, isDecimal = false }: { value: number, duration?: number, delay?: number, isDecimal?: boolean }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, value, {
                duration,
                delay,
                onUpdate: (latest) => setCount(latest),
                ease: "circOut"
            });
            return controls.stop;
        }
    }, [isInView, value, duration, delay]);

    return <span ref={ref}>{isDecimal ? count.toFixed(1) : Math.round(count)}</span>;
}

const REPUTATION_LEVELS = [
    {
        id: 'recommended',
        title: "Direkomendasikan",
        desc: "Status awal yang diberikan setelah verifikasi dokumen dan kualitas video Al-Fatihah Anda.",
        icon: ShieldCheck,
        color: "amber",
        description: "Telah melalui proses kurasi ketat oleh tim ahli My-Qurani, menjamin kualitas standar pengajaran.",
        teacherName: "Ustadzah Ratna",
        teacherImg: "https://c.superprof.com/i/m/21187269/600/20251128151124/21187269.webp",
        highlight: "Ustadzah Ratna adalah mitra terpilih dengan rekam jejak pengajaran yang sangat disiplin dan terstruktur."
    },
    {
        id: 'super',
        title: "Guru Super",
        icon: Sparkles,
        color: "emerald",
        description: "Gelar bagi pengajar dengan ulasan positif konsisten dan cara mengajar yang sangat interaktif.",
        teacherName: "Ustadz Rafi",
        teacherImg: "https://c.superprof.com/i/m/17191274/600/20220817152315/17191274.webp",
        highlight: "Ustadz Rafi dikenal karena energinya yang luar biasa dalam mencetak santri yang semangat belajar Al-Quran."
    },
    {
        id: 'ambassador',
        title: "Duta Besar",
        icon: Crown,
        color: "indigo",
        description: "Tingkat tertinggi bagi pengajar inspiratif yang memberikan kontribusi luar biasa bagi komunitas.",
        teacherName: "Ustadzah Zain",
        teacherImg: "https://c.superprof.com/i/m/17384281/600/20230520125508/17384281.webp",
        highlight: "Ustadzah Zain adalah pilar utama pendidikan tingkat ahli dengan dedikasi tinggi mencetak generasi penghafal Al-Quran."
    }
]

function ReputationSection() {
    const [activeTab, setActiveTab] = useState(1);
    const activeLevel = REPUTATION_LEVELS[activeTab];

    return (
        <section className="py-24 relative bg-white dark:bg-slate-950 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-4xl font-bold mb-6 tracking-tighter text-slate-900 dark:text-white"
                    >
                        Jenjang Karir & Reputasi
                    </motion.h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-base font-medium">
                        Dapatkan pengakuan dan lencana spesial seiring dengan dedikasi Anda dalam membimbing santri di My-Qurani.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-5 space-y-4">
                        {REPUTATION_LEVELS.map((level, i) => {
                            const Icon = level.icon;
                            return (
                                <motion.div
                                    key={level.id}
                                    onClick={() => setActiveTab(i)}
                                    className={cn(
                                        "p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start gap-4",
                                        activeTab === i
                                            ? "bg-white dark:bg-slate-900 shadow-xl border-slate-200 dark:border-slate-800"
                                            : "bg-white/50 dark:bg-slate-900/30 border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg",
                                        activeTab === i
                                            ? level.color === 'emerald' ? "bg-emerald-600 text-white" :
                                                level.color === 'amber' ? "bg-amber-500 text-white" :
                                                    "bg-indigo-600 text-white"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                    )}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className={cn(
                                            "text-lg font-bold transition-colors",
                                            activeTab === i ? "text-slate-900 dark:text-white" : "text-slate-400"
                                        )}>{level.title}</h3>
                                        {activeTab === i && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="text-xs text-slate-500 mt-2 leading-relaxed"
                                            >
                                                {level.description}
                                            </motion.p>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    <div className="lg:col-span-7 relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeLevel.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative w-full max-w-2xl mx-auto overflow-visible"
                            >
                                {/* Header Banner */}
                                <div className="h-40 bg-slate-100 dark:bg-slate-800 relative overflow-hidden rounded-t-3xl">
                                    <img
                                        src="https://i.pinimg.com/1200x/ed/1b/af/ed1baf2de9582f0b415dcf49e5d5bd7c.jpg"
                                        className="w-full h-full object-cover opacity-100"
                                        alt="Banner"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/40 dark:from-slate-900/40 via-transparent to-transparent" />
                                </div>

                                {/* Profile Content */}
                                <div className="p-10 pt-0 pb-20 -mt-16 relative z-10">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden shadow-xl bg-white mb-4"
                                    >
                                        <img src={activeLevel.teacherImg} className="w-full h-full object-cover" alt={activeLevel.teacherName} />
                                    </motion.div>

                                    <div className="flex items-center gap-5">
                                        <motion.h4
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-3xl font-bold text-slate-900 dark:text-white tracking-tighter"
                                        >
                                            {activeLevel.teacherName}
                                        </motion.h4>

                                        <div className="relative">
                                            {/* Level Badge Icon */}
                                            <motion.div
                                                animate={{
                                                    y: [0, -4, 0],
                                                    rotate: [0, 2, -2, 0]
                                                }}
                                                transition={{
                                                    duration: 4,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                className={cn(
                                                    "w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg",
                                                    activeLevel.color === 'emerald' ? "bg-emerald-600" :
                                                        activeLevel.color === 'amber' ? "bg-amber-500" :
                                                            "bg-indigo-600"
                                                )}
                                            >
                                                <activeLevel.icon className="w-6 h-6" />
                                            </motion.div>

                                            {/* Premium Tooltip */}
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                key={activeLevel.id}
                                                className={cn(
                                                    "absolute left-full ml-5 top-1/2 -translate-y-1/2 w-72 p-6 rounded-3xl shadow-2xl border-0 z-50",
                                                    activeLevel.color === 'emerald' ? "bg-emerald-600" :
                                                        activeLevel.color === 'amber' ? "bg-amber-500" :
                                                            "bg-indigo-600"
                                                )}
                                            >
                                                {/* Arrow */}
                                                <div className={cn(
                                                    "absolute right-full top-1/2 -translate-y-1/2 border-[8px] border-transparent",
                                                    activeLevel.color === 'emerald' ? "border-r-emerald-600" :
                                                        activeLevel.color === 'amber' ? "border-r-amber-500" :
                                                            "border-r-indigo-600"
                                                )} />
                                                <p className="text-white text-[11px] font-bold leading-relaxed">
                                                    {activeLevel.highlight}
                                                </p>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}

import { usePathname } from "next/navigation"
import { marketplaceApi, TeacherApplication } from "@/lib/marketplace-api"

export function TeachLandingPage({ locale }: { locale?: string }) {
    const pathname = usePathname();
    const currentLocale = locale || (pathname?.startsWith("/id") ? "id" : pathname?.startsWith("/en") ? "en" : "en");
    const isId = currentLocale === "id";
    const [existingApp, setExistingApp] = useState<TeacherApplication | null>(null);

    useEffect(() => {
        marketplaceApi.getTeacherApplication().then((app) => {
            if (app) setExistingApp(app);
        });
    }, []);

    return (
        <div className="min-h-screen w-full bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-x-hidden">
            <section className="relative pt-6 pb-20 md:pt-10 md:pb-36 overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[1000px] bg-gradient-to-b from-emerald-50/50 via-white to-transparent dark:from-emerald-950/20 dark:via-slate-950 dark:to-transparent -z-10" />
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-200/20 dark:bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-teal-200/20 dark:bg-teal-500/10 blur-[120px] rounded-full" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mb-6 sm:mb-8"
                            >
                                <Sparkles className="w-4 h-4" />
                                {isId ? "Bergabunglah dengan 500+ Pengajar Pilihan" : "Join 500+ Handpicked Teachers"}
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6 leading-[1.15]"
                            >
                                {isId ? "Bagikan Ilmu," : "Share Knowledge,"} <br />
                                <span className="text-[#00875a] dark:text-emerald-400">
                                    {isId ? "Tebar Keberkahan." : "Spread Blessings."}
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed font-normal"
                            >
                                {isId
                                    ? "Transformasi cara Anda mengajar Al-Quran. My-Qurani menyediakan platform profesional untuk menghubungkan Anda dengan santri di seluruh dunia."
                                    : "Transform the way you teach Al-Quran. My-Qurani provides a professional platform connecting you with students worldwide."}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            >
                                <Link href={`/${currentLocale}/teachers/forms`} className="w-full sm:w-auto">
                                    <Button className="bg-[#00875a] hover:bg-[#007a51] text-white rounded-2xl px-10 h-14 text-base sm:text-lg font-bold shadow-[0_15px_30px_-8px_rgba(0,135,90,0.3)] hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto">
                                        {existingApp ? (isId ? "Edit / Ajukan Ulang" : "Edit Application") : (isId ? "Mulai Mengajar Sekarang" : "Start Teaching Now")}
                                    </Button>
                                </Link>

                                {existingApp && (
                                    <Link href={`/${currentLocale}/teachers/pending`} className="w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            className="border-emerald-600/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-2xl px-8 h-14 text-base font-bold shadow-sm hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2.5"
                                        >
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                                            {isId ? "Lihat Status Pengajuan" : "Application Status"}
                                        </Button>
                                    </Link>
                                )}
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex-1 relative min-h-[500px] hidden lg:flex items-center justify-center"
                        >
                            <motion.div
                                animate={{ y: [0, -15, 0], rotate: [-1, 1, -1] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-20 w-[280px] h-[350px] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800"
                            >
                                <img
                                    src="https://c.superprof.com/i/m/17191274/600/20220817152315/17191274.webp"
                                    alt="Ustadz Rafi"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 20, 0], rotate: [2, -2, 2] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 right-0 z-10 w-[220px] h-[280px] rounded-[32px] overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 opacity-90"
                            >
                                <img
                                    src="https://c.superprof.com/i/m/21187269/600/20251128151124/21187269.webp"
                                    alt="Ustadzah Ratna"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>

                            <motion.div
                                animate={{ x: [0, 15, 0], y: [0, -10, 0], rotate: [-2, 2, -2] }}
                                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-10 left-[-20px] z-30 w-[180px] h-[240px] rounded-[28px] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800"
                            >
                                <img
                                    src="https://c.superprof.com/i/m/17384281/600/20230520125508/17384281.webp"
                                    alt="Ustadzah Zain"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -25, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-4 left-10 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-[24px] shadow-2xl border border-white/50 dark:border-slate-700"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white">10k+</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                                            {isId ? "Santri Aktif" : "Active Students"}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-4 right-10 z-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-4 px-8 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700 flex flex-col items-center gap-1"
                            >
                                <div className="flex items-center gap-2 text-amber-500 mb-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                                    ))}
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="font-black text-2xl text-slate-900 dark:text-white leading-none">4.9/5.0</span>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">
                                        {isId ? "Rating Kepuasan Santri" : "Student Satisfaction Rating"}
                                    </span>
                                </div>
                            </motion.div>

                            <div className="absolute inset-0 bg-emerald-400/10 dark:bg-emerald-500/5 blur-[100px] rounded-full -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-16 relative bg-white dark:bg-slate-950 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-500/5 blur-[100px] rounded-full"
                    />
                    <motion.div
                        animate={{ x: [0, -40, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-purple-200/20 dark:bg-purple-500/5 blur-[120px] rounded-full"
                    />
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl md:text-4xl font-bold mb-4 tracking-tighter"
                        >
                            Kenapa pengajar terbaik bergabung di My-Qurani
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        <motion.div
                            initial={{ opacity: 0, x: -15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="md:col-span-5 bg-emerald-50 dark:bg-emerald-900/10 p-10 rounded-[32px] flex flex-col group hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="relative z-10 mb-8">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-2xl font-bold mb-3 font-serif text-emerald-950 dark:text-emerald-100 leading-tight">Sistem Bagi Hasil Adil</h3>
                                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm text-emerald-500 group-hover:scale-110 transition-transform">
                                        <Wallet className="w-6 h-6" />
                                    </div>
                                </div>
                                <p className="text-emerald-800/70 dark:text-emerald-400/60 leading-relaxed text-sm max-w-[90%]">
                                    Dapatkan penghasilan maksimal dari setiap sesi mengajar. Fokuslah pada kualitas bimbingan, biar kami yang urus pemasarannya.
                                </p>
                            </div>

                            <div className="relative z-10 space-y-4 mb-10">
                                {["Pencairan dana cepat ke rekening", "Tanpa biaya langganan bulanan", "Laporan penghasilan transparan"].map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                        </div>
                                        <span className="text-sm font-bold text-emerald-900/70 dark:text-emerald-400">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto relative z-10">
                                <div className="flex items-end gap-3">
                                    <div className="text-7xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter leading-none">
                                        <AnimatedCounter value={90} delay={0.3} />%
                                    </div>
                                    <div className="pb-1">
                                        <p className="text-emerald-600/60 dark:text-emerald-400/40 text-[10px] font-black uppercase tracking-widest leading-tight">Hak Anda</p>
                                        <p className="text-emerald-600/60 dark:text-emerald-400/40 text-[10px] font-black uppercase tracking-widest leading-tight">Sepenuhnya</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </motion.div>

                        <div className="md:col-span-4 flex flex-col gap-5">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="flex-1 bg-blue-50 dark:bg-blue-900/10 p-6 rounded-[28px] group hover:shadow-xl transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <h3 className="text-xl font-bold font-serif text-blue-950 dark:text-blue-100">Sistem Mengajar Mudah</h3>
                                </div>
                                <p className="text-blue-800/70 dark:text-blue-400/60 text-sm leading-relaxed">
                                    Kelola jadwal mengajar, daftar murid, hingga absensi otomatis dalam satu dashboard yang simpel dan praktis.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="flex-1 bg-slate-50 dark:bg-slate-800/20 p-6 rounded-[28px] group hover:shadow-xl transition-all duration-500 border border-slate-100 dark:border-slate-800"
                            >
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                                        <Clock className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <h3 className="text-xl font-bold font-serif text-slate-950 dark:text-blue-100">Atur Jadwal Sendiri</h3>
                                </div>
                                <p className="text-slate-800/70 dark:text-slate-400/60 text-sm leading-relaxed">
                                    Bebas tentukan waktu mengajar Anda sendiri. Sesuaikan sesi dengan kesibukan harian Anda tanpa tekanan.
                                </p>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="md:col-span-3 bg-purple-50 dark:bg-purple-900/10 p-8 rounded-[32px] flex flex-col justify-between group hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="mb-4 inline-block"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                </motion.div>
                                <h3 className="text-2xl font-bold mb-3 font-serif text-purple-950 dark:text-purple-100 leading-tight">Jangkauan Murid Luas</h3>
                                <p className="text-purple-800/70 dark:text-purple-400/60 leading-relaxed text-sm">
                                    Temukan calon santri dari seluruh Indonesia dengan dukungan pemasaran penuh dari ekosistem My-Qurani.
                                </p>
                            </div>
                            <div className="mt-8 relative z-10">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="inline-block"
                                >
                                    <span className="text-5xl font-black text-purple-600 dark:text-purple-400 tracking-tighter">
                                        <AnimatedCounter value={2.5} isDecimal={true} delay={0.6} /> x
                                    </span>
                                </motion.div>
                                <p className="text-purple-600/60 dark:text-purple-400/40 text-[10px] font-bold uppercase tracking-widest mt-1">Peluang Mendapat Santri</p>
                            </div>
                            {/* Floating Decorative Icon */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -bottom-4 -right-4 w-24 h-24 text-purple-500/5"
                            >
                                <Crown className="w-full h-full" />
                            </motion.div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* 3. REPUTATION - INTERACTIVE SPOTLIGHT PREVIEW (FULLY FUNCTIONAL) */}
            <ReputationSection />

            {/* 4. HAK & KEWAJIBAN - PROFESSIONAL COMMITMENT */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Kewajiban Card */}
                        <div className="group bg-white dark:bg-slate-900/50 p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                <BookOpen className="w-32 h-32 text-emerald-600" />
                            </div>
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                                    <BookOpen className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold tracking-tighter">Kewajiban Guru</h3>
                            </div>
                            <ul className="space-y-6">
                                {[
                                    "Mematuhi seluruh kode etik dan peraturan di Platform Qurani.",
                                    "Kontribusi platform sebesar 10% dari nominal biaya kursus.",
                                    "Menjamin standar kualitas pengajaran yang tinggi dan interaktif.",
                                    "Menjaga profesionalitas dan adab selama sesi bimbingan."
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <div className="mt-1.5 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-sm">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Hak Card */}
                        <div className="group bg-emerald-600 dark:bg-emerald-600 p-12 rounded-3xl shadow-2xl shadow-emerald-500/20 relative overflow-hidden text-white transition-all duration-500 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                            <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <CheckCircle2 className="w-32 h-32 text-white" />
                            </div>
                            <div className="flex items-center gap-4 mb-10 relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold tracking-tighter">Hak Guru</h3>
                            </div>
                            <ul className="space-y-6 relative z-10">
                                {[
                                    "Membantu pemasaran untuk mendapatkan peserta didik.",
                                    "Administrasi pemesanan yang terorganisir.",
                                    "Menerima pembayaran biaya kursus mengaji Al-Quran.",
                                    "Mengembangkan networking & pertemanan dengan para ahli Al-Quran."
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <div className="mt-1.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        </div>
                                        <p className="text-emerald-50 font-bold leading-relaxed text-sm">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FAQ SECTION - CLEARING DOUBTS */}
            <section className="py-24 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4 tracking-tighter text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6 items-start">
                        {/* Left Column */}
                        <div className="space-y-4">
                            {[
                                {
                                    q: "Bagaimana sistem pembayaran di platform ini?",
                                    a: "Pembayaran dilakukan secara otomatis setelah sesi selesai dikonfirmasi oleh santri. Dana akan masuk ke saldo akun Anda dan dapat ditarik kapan saja ke rekening bank pilihan Anda."
                                },
                                {
                                    q: "Apakah saya bisa mengatur jadwal mengajar sendiri?",
                                    a: "Sangat bisa! Anda memiliki kontrol penuh 100% atas kalender Anda. Anda bisa membuka atau menutup slot waktu mengajar kapan pun Anda inginkan."
                                },
                                {
                                    q: "Apakah ada biaya pendaftaran untuk menjadi guru?",
                                    a: "Sama sekali tidak ada biaya pendaftaran. My-Qurani hanya mengambil bagi hasil sebesar 10% dari setiap transaksi yang berhasil untuk biaya operasional platform."
                                },
                                {
                                    q: "Dokumen apa saja yang diperlukan untuk verifikasi?",
                                    a: "Anda perlu menyiapkan KTP/Identitas diri, sertifikat keahlian (jika ada), dan video singkat pembacaan Al-Fatihah untuk kurasi kualitas tajwid."
                                }
                            ].map((item, i) => (
                                <FAQItem key={i} question={item.q} answer={item.a} index={i + 1} />
                            ))}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            {[
                                {
                                    q: "Bagaimana jika santri membatalkan pesanan mendadak?",
                                    a: "Kami memiliki kebijakan perlindungan pengajar. Jika santri membatalkan kurang dari 24 jam sebelum sesi dimulai, Anda tetap akan menerima kompensasi sesuai ketentuan."
                                },
                                {
                                    q: "Apakah ada pelatihan bagi pengajar baru?",
                                    a: "Ya! Kami menyediakan sesi onboarding dan pelatihan berkala untuk membantu Anda meningkatkan kualitas pengajaran serta cara mengelola profil agar lebih menarik."
                                },
                                {
                                    q: "Apakah saya bisa mengajar lebih dari satu kategori?",
                                    a: "Tentu bisa. Anda dapat menambahkan spesialisasi tambahan (Tahfidz, Tahsin, Bahasa Arab, dll) selama Anda lulus tahap kurasi untuk masing-masing bidang tersebut."
                                },
                                {
                                    q: "Berapa lama proses verifikasi akun saya?",
                                    a: "Proses verifikasi biasanya memakan waktu 1-3 hari kerja setelah Anda melengkapi seluruh data profil dan mengunggah video sampel pengajaran."
                                }
                            ].map((item, i) => (
                                <FAQItem key={i + 4} question={item.q} answer={item.a} index={i + 5} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            <Footer />
        </div>
    )
}

// Helper Component for FAQ Accordion
function FAQItem({ question, answer, index }: { question: string, answer: string, index: number }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={`group rounded-2xl border transition-all duration-500 overflow-hidden ${isOpen ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-500/5' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 shadow-sm'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 text-left flex items-center justify-between gap-6 group"
            >
                <div className="flex items-center gap-5">
                    <span className={`text-xs font-black w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600'}`}>
                        {String(index).padStart(2, '0')}
                    </span>
                    <span className={`font-bold transition-colors ${isOpen ? 'text-emerald-900 dark:text-emerald-100' : 'text-slate-900 dark:text-white group-hover:text-emerald-700'}`}>
                        {question}
                    </span>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-emerald-600 text-white rotate-180' : 'bg-slate-50 dark:bg-slate-800 text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-500'}`}>
                    <ChevronRight className="w-4 h-4" />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                    >
                        <div className="px-19 pb-6 pr-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-emerald-100/50 dark:border-emerald-800/50 pt-4">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
