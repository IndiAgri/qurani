"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useI18n } from "@/components/providers/i18n-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    UserCheck,
    UserX,
    Search,
    Star,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    BookOpen,
    RotateCcw,
    Filter,
    ChevronDown,
    ArrowUpDown,
    MoreVertical,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { getInitials } from "@/utils/helpers/get-initials"
import { DUMMY_TRAINERS, type Trainer } from "@/data/trainers-data"
import { toast } from "sonner"

// Import semua dialog dari file terpisah
import {
    AcceptTeacherDialog,
    RejectTeacherDialog,
    RestoreTeacherDialog,
    RemoveTeacherDialog,
} from "./requests-dialog"

// ─────────────────────────────────────────────
// Main Page — hanya satu export yaitu default
// ─────────────────────────────────────────────

export default function TeacherJoinRequestsPage() {
    const params = useParams()
    const router = useRouter()
    const { locale } = useI18n()
    const orgId = params.orgId as string

    const [searchQuery, setSearchQuery] = useState("")
    const [methodFilter, setMethodFilter] = useState("All")
    const [sortBy, setSortBy] = useState("newest")
    const [isProcessing, setIsProcessing] = useState(false)

    const [acceptDialog, setAcceptDialog] = useState<{ open: boolean; trainer: Trainer | null }>({ open: false, trainer: null })
    const [rejectDialog, setRejectDialog] = useState<{ open: boolean; trainer: Trainer | null }>({ open: false, trainer: null })
    const [restoreDialog, setRestoreDialog] = useState<{ open: boolean; trainer: Trainer | null }>({ open: false, trainer: null })
    const [removeDialog, setRemoveDialog] = useState<{ open: boolean; trainer: Trainer | null }>({ open: false, trainer: null })

    const [requests, setRequests] = useState(() => {
        if (typeof window === "undefined") return []
        const acceptedIds = JSON.parse(localStorage.getItem("org_accepted_trainers") || "[]")
        const rejectedIds = JSON.parse(localStorage.getItem("org_rejected_trainers") || "[]")
        const teacherPending = JSON.parse(localStorage.getItem("teacher_pending_joins") || "[]")

        let initialData = DUMMY_TRAINERS.map((t) => {
            let status = "pending"
            if (acceptedIds.includes(t.id)) status = "accepted"
            if (rejectedIds.includes(t.id)) status = "rejected"
            return { ...t, reqStatus: status }
        })

        if (teacherPending.includes(orgId) && !acceptedIds.includes("current-user") && !rejectedIds.includes("current-user")) {
            initialData = [{
                id: "current-user",
                name: "Ustadz Somad (Anda)",
                username: "somad_user",
                avatar: "https://ui-avatars.com/api/?name=Somad&background=059669&color=fff",
                bio: "Pengajar Tahfidz & Tahsin profesional dengan pengalaman 10 tahun.",
                rating: 5.0,
                specialization: ["Tahfidz", "Tahsin"],
                methods: ["Iqro", "Wafa"],
                reqStatus: "pending",
            } as unknown as Trainer & { reqStatus: string }, ...initialData]
        }
        return initialData
    })

    const filteredBySearch = useMemo(() => {
        let result = requests
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            result = result.filter(t =>
                t.name.toLowerCase().includes(q) ||
                t.bio.toLowerCase().includes(q) ||
                t.specialization.some((s: string) => s.toLowerCase().includes(q))
            )
        }
        if (methodFilter !== "All") {
            result = result.filter(t => t.methods.includes(methodFilter as never))
        }
        result = [...result].sort((a, b) => {
            if (sortBy === "name") return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            return 0
        })
        return result
    }, [searchQuery, requests, methodFilter, sortBy])

    const pendingRequests = filteredBySearch.filter(r => r.reqStatus === "pending")
    const acceptedRequests = filteredBySearch.filter(r => r.reqStatus === "accepted")
    const rejectedRequests = filteredBySearch.filter(r => r.reqStatus === "rejected")

    const navigateToMarketplace = (id: string) => router.push(`/${locale}/marketplace/teacher/${id}`)

    const handleAccept = async (note: string) => {
        const trainer = acceptDialog.trainer
        if (!trainer) return
        setIsProcessing(true)
        await new Promise(r => setTimeout(r, 800))
        setRequests(prev => prev.map(r => r.id === trainer.id ? { ...r, reqStatus: "accepted" } : r))
        const acceptedIds = JSON.parse(localStorage.getItem("org_accepted_trainers") || "[]")
        if (!acceptedIds.includes(trainer.id)) localStorage.setItem("org_accepted_trainers", JSON.stringify([...acceptedIds, trainer.id]))
        toast.success(`${trainer.name} disetujui untuk wawancara!`, { description: "Notifikasi jadwal wawancara telah dikirimkan ke email guru." })
        setTimeout(() => router.push(`/${locale}/organization/dashboard/${orgId}/teachers`), 1000)
        setIsProcessing(false)
        setAcceptDialog({ open: false, trainer: null })
    }

    const handleReject = async (reason: string, note: string) => {
        const trainer = rejectDialog.trainer
        if (!trainer) return
        setIsProcessing(true)
        await new Promise(r => setTimeout(r, 800))
        setRequests(prev => prev.map(r => r.id === trainer.id ? { ...r, reqStatus: "rejected" } : r))
        const rejectedIds = JSON.parse(localStorage.getItem("org_rejected_trainers") || "[]")
        if (!rejectedIds.includes(trainer.id)) localStorage.setItem("org_rejected_trainers", JSON.stringify([...rejectedIds, trainer.id]))
        toast.error(`Pengajuan ${trainer.name} ditolak.`, { description: `Alasan: ${reason}${note ? `. ${note}` : ""}` })
        setIsProcessing(false)
        setRejectDialog({ open: false, trainer: null })
    }

    const handleRestore = async () => {
        const trainer = restoreDialog.trainer
        if (!trainer) return
        setIsProcessing(true)
        await new Promise(r => setTimeout(r, 800))
        setRequests(prev => prev.map(r => r.id === trainer.id ? { ...r, reqStatus: "pending" } : r))
        const rejectedIds: string[] = JSON.parse(localStorage.getItem("org_rejected_trainers") || "[]")
        localStorage.setItem("org_rejected_trainers", JSON.stringify(rejectedIds.filter(id => id !== trainer.id)))
        toast.info(`Pengajuan ${trainer.name} dikembalikan ke status Menunggu.`)
        setIsProcessing(false)
        setRestoreDialog({ open: false, trainer: null })
    }

    const handleRemove = async (reason: string, note: string) => {
        const trainer = removeDialog.trainer
        if (!trainer) return
        setIsProcessing(true)
        await new Promise(r => setTimeout(r, 800))
        setRequests(prev => prev.map(r => r.id === trainer.id ? { ...r, reqStatus: "rejected" } : r))
        const acceptedIds: string[] = JSON.parse(localStorage.getItem("org_accepted_trainers") || "[]")
        localStorage.setItem("org_accepted_trainers", JSON.stringify(acceptedIds.filter(id => id !== trainer.id)))
        const rejectedIds = JSON.parse(localStorage.getItem("org_rejected_trainers") || "[]")
        if (!rejectedIds.includes(trainer.id)) localStorage.setItem("org_rejected_trainers", JSON.stringify([...rejectedIds, trainer.id]))
        toast.warning(`${trainer.name} telah dikeluarkan dari organisasi.`, { description: `Alasan: ${reason}${note ? `. ${note}` : ""}` })
        setIsProcessing(false)
        setRemoveDialog({ open: false, trainer: null })
    }

    const handleResetSimulation = () => {
        localStorage.removeItem("org_accepted_trainers")
        localStorage.removeItem("org_rejected_trainers")
        localStorage.removeItem("org_deleted_trainers")
        localStorage.removeItem("teacher_pending_joins")
        setRequests(DUMMY_TRAINERS.map(t => ({ ...t, reqStatus: "pending" })))
        toast.info("Simulasi berhasil di-reset ke kondisi awal")
    }

    // ── Card Components ──

    const PendingCard = ({ trainer, idx }: { trainer: Trainer & { reqStatus: string }; idx: number }) => (
        <Card
            className="border-none shadow-sm hover:shadow-md transition-all group rounded-3xl overflow-hidden bg-white dark:bg-slate-900 cursor-pointer"
            onClick={() => navigateToMarketplace(trainer.id)}
        >
            <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                    <div className="p-6 lg:p-8 flex flex-col sm:flex-row gap-6 flex-1 min-w-0">
                        <div className="shrink-0 flex sm:flex-col items-center gap-3">
                            <Avatar className="h-20 w-20 border-4 border-slate-50 shadow-sm transition-transform group-hover:scale-105">
                                <AvatarImage src={trainer.avatar} className="object-cover" />
                                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-lg">{getInitials(trainer.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                                <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
                                <span className="text-xs font-black text-amber-700">{trainer.rating}</span>
                            </div>
                        </div>
                        <div className="space-y-3 flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{trainer.name}</h3>
                                    <p className="text-[11px] font-bold text-emerald-600 mt-0.5">@{trainer.username || trainer.name.toLowerCase().replace(/\s+/g, "_")}</p>
                                </div>
                                <div
                                    title={idx === 0 ? "28 Mei 2026, 14:30 WIB" : idx === 1 ? "28 Mei 2026, 09:30 WIB" : "27 Mei 2026, 16:00 WIB"}
                                    className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full shrink-0 cursor-help"
                                >
                                    <Calendar className="h-3 w-3" />
                                    {idx === 0 ? "Hari Ini" : idx === 1 ? "5 jam lalu" : "Kemarin"}
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-2">{trainer.bio}</p>
                            <div className="flex items-center gap-2 text-slate-400 pt-1">
                                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                                <span className="text-[11px] font-bold uppercase tracking-tight">{trainer.methods.join(", ")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50/10 px-5 py-6 flex flex-col items-center justify-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 w-full lg:w-44 shrink-0">
                        <Button
                            onClick={(e) => { e.stopPropagation(); setAcceptDialog({ open: true, trainer }) }}
                            className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-emerald-600/10 active:scale-95 transition-all"
                        >
                            <UserCheck className="h-4 w-4 mr-2" /> Terima
                        </Button>
                        <Button
                            variant="outline"
                            onClick={(e) => { e.stopPropagation(); setRejectDialog({ open: true, trainer }) }}
                            className="w-full h-9 bg-white border-slate-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-black uppercase text-[10px] tracking-widest rounded-xl active:scale-95 transition-all"
                        >
                            <UserX className="h-4 w-4 mr-2" /> Tolak
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    const AcceptedCard = ({ trainer }: { trainer: Trainer & { reqStatus: string } }) => (
        <Card
            className="border-none shadow-sm hover:shadow-md transition-all group rounded-3xl overflow-visible bg-white cursor-pointer border-l-4 border-l-emerald-500"
            onClick={() => navigateToMarketplace(trainer.id)}
        >
            <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden">
                    <div className="p-6 lg:p-8 flex flex-col sm:flex-row gap-6 flex-1 min-w-0">
                        <div className="shrink-0 flex sm:flex-col items-center gap-3">
                            <Avatar className="h-20 w-20 border-4 border-slate-50 shadow-sm transition-transform group-hover:scale-105">
                                <AvatarImage src={trainer.avatar} className="object-cover" />
                                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-lg">{getInitials(trainer.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                                <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
                                <span className="text-xs font-black text-amber-700">{trainer.rating}</span>
                            </div>
                        </div>
                        <div className="space-y-3 flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{trainer.name}</h3>
                                    <p className="text-[11px] font-bold text-emerald-600 mt-0.5">@{trainer.username || trainer.name.toLowerCase().replace(/\s+/g, "_")}</p>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full shrink-0">
                                    <CheckCircle2 className="h-3 w-3" /> Anggota Organisasi
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-2">{trainer.bio}</p>
                            <div className="flex items-center gap-2 text-slate-400 pt-1">
                                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                                <span className="text-[11px] font-bold uppercase tracking-tight">{trainer.methods.join(", ")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-5 py-6 lg:w-44 shrink-0 flex flex-col items-center justify-center gap-2 bg-emerald-50/20 border-t lg:border-t-0 lg:border-l border-slate-100 overflow-visible">
                        <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 py-1.5 font-bold uppercase text-[10px] tracking-widest rounded-full shadow-sm whitespace-nowrap">
                            Diterima
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    const RejectedCard = ({ trainer }: { trainer: Trainer & { reqStatus: string } }) => (
        <Card
            className="border-none shadow-sm hover:shadow-md transition-all group rounded-3xl overflow-visible bg-white cursor-pointer border-l-4 border-l-rose-400 opacity-80 hover:opacity-100"
            onClick={() => navigateToMarketplace(trainer.id)}
        >
            <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden">
                    <div className="p-6 lg:p-8 flex flex-col sm:flex-row gap-6 flex-1 min-w-0">
                        <div className="shrink-0">
                            <Avatar className="h-16 w-16 border-2 border-slate-50 grayscale shadow-sm">
                                <AvatarImage src={trainer.avatar} className="object-cover" />
                                <AvatarFallback className="bg-slate-200 text-slate-500 font-bold">{getInitials(trainer.name)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="space-y-2 flex-1 pt-1 min-w-0">
                            <h3 className="text-lg font-bold text-slate-900 uppercase line-through decoration-slate-300">{trainer.name}</h3>
                            <p className="text-xs text-rose-500 font-bold italic">&quot;Tidak memenuhi standar organisasi.&quot;</p>
                        </div>
                    </div>
                    <div className="px-5 py-6 lg:w-44 shrink-0 flex flex-col items-center justify-center gap-2 bg-rose-50/30 border-t lg:border-t-0 lg:border-l border-slate-100 overflow-visible">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-rose-100 text-rose-700 border-none px-3 py-1.5 font-bold uppercase text-[10px] tracking-widest rounded-full shadow-sm whitespace-nowrap">
                                Ditolak
                            </Badge>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center transition-all active:scale-95 shrink-0"
                                        title="Opsi"
                                    >
                                        <MoreVertical className="h-3.5 w-3.5 text-slate-500" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="bottom"
                                    align="end"
                                    sideOffset={6}
                                    className="z-50 rounded-xl border border-slate-100 shadow-2xl p-1 w-48 bg-white"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1.5 tracking-wider">
                                        Kelola Pengajuan
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-slate-100 my-1" />
                                    <DropdownMenuItem
                                        onClick={() => setRestoreDialog({ open: true, trainer })}
                                        className="rounded-lg font-semibold text-xs px-2.5 py-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 focus:text-emerald-700 focus:bg-emerald-50 cursor-pointer gap-2"
                                    >
                                        <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                                        Kembalikan Pengajuan
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    const EmptyState = ({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) => (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Icon className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">{desc}</p>
        </div>
    )

    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 7

    const paginatedData = (data: (Trainer & { reqStatus: string })[]) => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        return data.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }

    const renderPagination = (totalItems: number) => {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
        if (totalPages <= 1) return null

        return (
            <Pagination className="mt-8 mb-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                            <PaginationLink
                                onClick={() => setCurrentPage(i + 1)}
                                isActive={currentPage === i + 1}
                                className="cursor-pointer"
                            >
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        )
    }

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-700 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Permintaan Guru</h1>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetSimulation}
                    className="h-10 px-4 rounded-xl border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50 transition-all font-bold text-xs gap-2"
                >
                    <RotateCcw className="h-4 w-4" /> Reset Simulasi
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
                <div className="relative flex flex-1 w-full max-w-md">
                    <Input
                        placeholder="Cari nama atau keahlian calon guru..."
                        className="pr-12 h-10 text-xs rounded-xl border border-slate-100 focus:border-emerald-500/50 focus-visible:ring-0 transition-all font-medium"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <button
                        type="button"
                        tabIndex={-1}
                        onMouseDown={(e) => e.preventDefault()}
                        className="absolute right-0 top-0 h-10 w-10 rounded-r-xl bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center transition-all"
                    >
                        <Search className="h-4 w-4 text-white" />
                    </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-10 px-4 rounded-xl border border-slate-100 text-slate-600 gap-2 font-bold text-[10px] uppercase tracking-wider hover:bg-slate-50 bg-white">
                                <Filter className="h-3.5 w-3.5 text-slate-400" />
                                {methodFilter === "All" ? "Metode: Semua" : `Metode: ${methodFilter}`}
                                <ChevronDown className="h-3 w-3 text-slate-300" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-xl border-none shadow-2xl p-1 w-48">
                            <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase p-2">Saring Metode</DropdownMenuLabel>
                            {["All", "Iqro", "Ummi", "Tilawati", "Qiroati", "Yanbu'a", "Al-Baghdadi", "Dirosa", "Wafa"].map(m => (
                                <DropdownMenuItem key={m} onClick={() => setMethodFilter(m)} className="rounded-lg font-bold text-xs p-2.5">
                                    {m === "All" ? "Semua Metode" : m}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-10 px-4 rounded-xl border border-slate-100 text-slate-600 gap-2 font-bold text-[10px] uppercase tracking-wider hover:bg-slate-50 bg-white">
                                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                                {sortBy === "newest" ? "Terbaru" : sortBy === "oldest" ? "Terlama" : "Nama (A-Z)"}
                                <ChevronDown className="h-3 w-3 text-slate-300" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-xl border-none shadow-2xl p-1 w-48">
                            <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase p-2">Urutkan Berdasarkan</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setSortBy("newest")} className="rounded-lg font-bold text-xs p-2.5">Terbaru</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("oldest")} className="rounded-lg font-bold text-xs p-2.5">Terlama</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("name")} className="rounded-lg font-bold text-xs p-2.5">Nama (A-Z)</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="pending" className="w-full" onValueChange={() => setCurrentPage(1)}>
                <TabsList className="bg-transparent border-b border-gray-200 rounded-none w-full justify-start h-auto p-0 gap-6">
                    {[
                        { value: "pending", label: `Menunggu (${pendingRequests.length})` },
                        { value: "accepted", label: `Diterima (${acceptedRequests.length})` },
                        { value: "rejected", label: `Ditolak (${rejectedRequests.length})` },
                    ].map(tab => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent data-[state=active]:text-emerald-600 px-1 py-3 font-medium transition-all"
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                    <div className="space-y-4">
                        {pendingRequests.length > 0
                            ? paginatedData(pendingRequests).map((t, i) => (
                                <PendingCard key={t.id} trainer={t} idx={(currentPage - 1) * ITEMS_PER_PAGE + i} />
                            ))
                            : <EmptyState icon={Clock} title="Belum ada pengajuan" desc="Belum ada guru yang mengajukan bergabung." />
                        }
                    </div>
                    {renderPagination(pendingRequests.length)}
                </TabsContent>

                <TabsContent value="accepted" className="mt-6">
                    <div className="space-y-4">
                        {acceptedRequests.length > 0
                            ? paginatedData(acceptedRequests).map((t) => <AcceptedCard key={t.id} trainer={t} />)
                            : <EmptyState icon={CheckCircle2} title="Belum ada guru diterima" desc="Belum ada pengajuan yang disetujui." />
                        }
                    </div>
                    {renderPagination(acceptedRequests.length)}
                </TabsContent>

                <TabsContent value="rejected" className="mt-6">
                    <div className="space-y-4">
                        {rejectedRequests.length > 0
                            ? paginatedData(rejectedRequests).map((t) => <RejectedCard key={t.id} trainer={t} />)
                            : <EmptyState icon={XCircle} title="Belum ada yang ditolak" desc="Belum ada pengajuan yang ditolak." />
                        }
                    </div>
                    {renderPagination(rejectedRequests.length)}
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <AcceptTeacherDialog
                open={acceptDialog.open}
                onOpenChange={(v) => setAcceptDialog(prev => ({ ...prev, open: v }))}
                trainer={acceptDialog.trainer}
                isProcessing={isProcessing}
                onConfirm={handleAccept}
            />
            <RejectTeacherDialog
                open={rejectDialog.open}
                onOpenChange={(v) => setRejectDialog(prev => ({ ...prev, open: v }))}
                trainer={rejectDialog.trainer}
                isProcessing={isProcessing}
                onConfirm={handleReject}
            />
            <RestoreTeacherDialog
                open={restoreDialog.open}
                onOpenChange={(v) => setRestoreDialog(prev => ({ ...prev, open: v }))}
                trainer={restoreDialog.trainer}
                isProcessing={isProcessing}
                onConfirm={handleRestore}
            />
            <RemoveTeacherDialog
                open={removeDialog.open}
                onOpenChange={(v) => setRemoveDialog(prev => ({ ...prev, open: v }))}
                trainer={removeDialog.trainer}
                isProcessing={isProcessing}
                onConfirm={handleRemove}
            />
        </div>
    )
}