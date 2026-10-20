"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Users,
    UserPlus,
    Search,
    MoreVertical,
    CheckCircle2,
    Clock,
    XCircle,
    Star,
    Mail,
    Trash2,
    Briefcase,
    Loader2,
    BookOpen,
    Filter,
    ChevronDown,
    SortAsc,
    ArrowUpDown,
    Undo,
    CalendarDays,
    Layers
} from "lucide-react"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger as AlertDialogTriggerBase,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { DUMMY_TRAINERS, type Trainer } from "@/data/trainers-data"
import { ORG_PROGRAMS } from "@/data/organizations-data"
import { getInitials } from "@/utils/helpers/get-initials"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────
// Helper: ambil daftar program berdasarkan orgId.
// Jika orgId tidak cocok dengan key di ORG_PROGRAMS (mis. ID
// dinamis dari DB), fallback ke ORG-001 agar kolom tetap terisi.
// ─────────────────────────────────────────────────────────────
const getOrgPrograms = (orgId: string | undefined) => {
    // Guard: jika orgId kosong/undefined, langsung fallback
    if (!orgId) return ORG_PROGRAMS["ORG-001"] ?? []

    // Coba exact match dulu
    if (ORG_PROGRAMS[orgId]) return ORG_PROGRAMS[orgId]

    // Fallback: cari partial match (misal orgId mengandung "001")
    const matchedKey = Object.keys(ORG_PROGRAMS).find(key =>
        orgId.includes(key) || key.includes(orgId)
    )
    if (matchedKey) return ORG_PROGRAMS[matchedKey]

    // Fallback terakhir: pakai ORG-001 sebagai default
    return ORG_PROGRAMS["ORG-001"] ?? []
}

export default function ManageTeachersPage() {
    const params = useParams()
    const locale = params.locale as string
    const orgId = params.orgId as string

    // Resolve program list sekali, reuse di seluruh komponen
    const orgPrograms = useMemo(() => getOrgPrograms(orgId), [orgId])

    const [teachers, setTeachers] = useState<any[]>([])

    useEffect(() => {
        const inactiveIds = JSON.parse(localStorage.getItem('org_inactive_trainers') || '[]')
        const acceptedIds = JSON.parse(localStorage.getItem('org_accepted_trainers') || '[]')
        const joinDates = JSON.parse(localStorage.getItem('org_trainer_join_dates') || '{}')
        let joinDatesChanged = false

        const getRandomPastDate = () => {
            const start = new Date(2024, 0, 1).getTime()
            const end = new Date().getTime()
            return new Date(start + Math.random() * (end - start)).toISOString()
        }

        const base = DUMMY_TRAINERS.slice(0, 12)
            .map(t => {
                if (!joinDates[t.id]) {
                    joinDates[t.id] = getRandomPastDate()
                    joinDatesChanged = true
                }
                return {
                    ...t,
                    status: inactiveIds.includes(t.id) ? 'Inactive' : 'Active',
                    sessions: Math.floor(Math.random() * 100) + 10,
                    students: Math.floor(Math.random() * 20) + 5,
                    email: t.email || `${t.username || 'guru'}${t.id}@example.com`,
                    address: t.city ? `${t.city}, ${t.province || ''}`.replace(/, $/, "") : (t.location || "Lokasi tidak tersedia"),
                    joinDate: joinDates[t.id]
                }
            })

        const extra = [...acceptedIds]
            .reverse()
            .map(id => {
                if (!joinDates[id]) {
                    joinDates[id] = new Date().toISOString()
                    joinDatesChanged = true
                }
                if (id === 'current-user') {
                    return {
                        id: 'current-user',
                        name: 'Ustadz Somad (Anda)',
                        username: 'somad_user',
                        avatar: 'https://ui-avatars.com/api/?name=Somad&background=059669&color=fff',
                        bio: 'Pengajar Tahfidz & Tahsin profesional dengan pengalaman 10 tahun.',
                        rating: 5.0,
                        specialization: ['Tahfidz', 'Tahsin'],
                        methods: ['Iqro', 'Wafa'],
                        status: inactiveIds.includes(id) ? 'Inactive' : 'Active',
                        sessions: 0,
                        students: 0,
                        email: 'somad@myqurani.com',
                        address: 'Jakarta, Indonesia',
                        joinDate: joinDates[id]
                    }
                }
                return { ...DUMMY_TRAINERS.find(t => t.id === id), joinDate: joinDates[id] }
            })
            .filter(t => t && t.id)
            .map((t: any) => ({
                ...t,
                status: inactiveIds.includes(t.id) ? 'Inactive' : (t.status || 'Pending'),
                sessions: typeof t.sessions === 'number' ? t.sessions : Math.floor(Math.random() * 30) + 2,
                students: typeof t.students === 'number' ? t.students : Math.floor(Math.random() * 10) + 1,
                email: t.email || `${t.username || 'guru'}${t.id}@example.com`,
                address: t.address || (t.city ? `${t.city}, ${t.province || ''}`.replace(/, $/, "") : (t.location || "Lokasi tidak tersedia"))
            }))

        if (joinDatesChanged) {
            localStorage.setItem('org_trainer_join_dates', JSON.stringify(joinDates))
        }

        const combined = [...extra, ...base]
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values())
        setTeachers(unique)
    }, [])

    const handleDeactivateTeacher = (id: string) => {
        setTeachers(prev => prev.map(t => t.id === id ? { ...t, status: 'Inactive' } : t))
        const inactiveIds = JSON.parse(localStorage.getItem('org_inactive_trainers') || '[]')
        if (!inactiveIds.includes(id)) {
            localStorage.setItem('org_inactive_trainers', JSON.stringify([...inactiveIds, id]))
        }
        toast.success("Pengajar telah dinonaktifkan")
    }

    const handleRestoreTeacher = (id: string) => {
        setTeachers(prev => prev.map(t => t.id === id ? { ...t, status: 'Active' } : t))
        const inactiveIds = JSON.parse(localStorage.getItem('org_inactive_trainers') || '[]')
        localStorage.setItem('org_inactive_trainers', JSON.stringify(inactiveIds.filter((iid: string) => iid !== id)))
        toast.success("Pengajar telah diaktifkan kembali")
    }

    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
    const [inviteSearch, setInviteSearch] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [sortBy, setSortBy] = useState("newest")

    const availableToInvite = useMemo(() => {
        return DUMMY_TRAINERS
            .filter(t =>
                t.name.toLowerCase().includes(inviteSearch.toLowerCase()) ||
                t.username?.toLowerCase().includes(inviteSearch.toLowerCase())
            ).slice(0, 5)
    }, [inviteSearch])

    const filteredTeachers = useMemo(() => {
        let result = teachers

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim()
            result = result.filter(t =>
                t.name.toLowerCase().includes(q) ||
                t.username?.toLowerCase().includes(q) ||
                t.email?.toLowerCase().includes(q)
            )
        }

        if (statusFilter !== "All") {
            result = result.filter(t => t.status === statusFilter)
        }

        result = [...result].sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name)
            if (sortBy === "newest") return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
            if (sortBy === "oldest") return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
            return 0
        })

        return result
    }, [teachers, searchQuery, statusFilter, sortBy])

    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 10

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, statusFilter, sortBy])

    const paginatedTeachers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredTeachers.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredTeachers, currentPage])

    const handleInviteTeacher = (trainer: Trainer) => {
        const joinDate = new Date().toISOString()
        const newTeacher = {
            ...trainer,
            status: 'Pending',
            sessions: 0,
            students: 0,
            email: trainer.email || `${trainer.username || 'guru'}${trainer.id}@example.com`,
            address: trainer.city ? `${trainer.city}, ${trainer.province || ''}`.replace(/, $/, "") : (trainer.location || "Lokasi tidak tersedia"),
            joinDate
        }

        setTeachers(prev => [newTeacher, ...prev])

        const acceptedIds = JSON.parse(localStorage.getItem('org_accepted_trainers') || '[]')
        localStorage.setItem('org_accepted_trainers', JSON.stringify([...acceptedIds, trainer.id]))

        const joinDates = JSON.parse(localStorage.getItem('org_trainer_join_dates') || '{}')
        joinDates[trainer.id] = joinDate
        localStorage.setItem('org_trainer_join_dates', JSON.stringify(joinDates))

        toast.success(`${trainer.name} berhasil diundang dan bergabung!`)
        setInviteSearch("")
    }

    const getTrainerTimezone = (city?: string, province?: string): string => {
        const loc = ((city || '') + ' ' + (province || '')).toLowerCase()
        const wit = ['maluku', 'ambon', 'papua', 'jayapura', 'sorong', 'manokwari', 'ternate', 'tidore']
        const wita = ['sulawesi', 'makassar', 'manado', 'palu', 'kendari', 'gorontalo', 'bali', 'denpasar', 'lombok', 'mataram', 'nusa tenggara', 'kalimantan selatan', 'kalimantan timur', 'kalimantan utara', 'banjarmasin', 'samarinda', 'balikpapan', 'tarakan', 'kupang']
        if (wit.some(k => loc.includes(k))) return 'Asia/Jayapura'
        if (wita.some(k => loc.includes(k))) return 'Asia/Makassar'
        return 'Asia/Jakarta'
    }

    const formatDate = (isoString: string) => {
        if (!isoString) return "-"
        return new Date(isoString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    const formatFullDateTime = (isoString: string, timezone?: string) => {
        if (!isoString) return "-"
        const tz = timezone || 'Asia/Jakarta'
        const date = new Date(isoString)
        const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: tz })
        const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: tz }).replace(':', '.')
        const tzLabel = tz === 'Asia/Makassar' ? 'WITA' : tz === 'Asia/Jayapura' ? 'WIT' : 'WIB'
        return `${dateStr} pukul ${timeStr} (${tzLabel})`
    }

    // ─────────────────────────────────────────────────────────
    // FIX UTAMA: getTeacherOrgProgram
    //
    // Sebelumnya: ORG_PROGRAMS[orgId] → selalu undefined karena
    //   orgId = "89800606130110465" (ID dinamis dari DB/URL),
    //   bukan "ORG-001" dst. → programs.length === 0 → return null
    //   → kolom Program & Sesi kosong semua.
    //
    // Sesudahnya: pakai `orgPrograms` yang sudah di-resolve via
    //   getOrgPrograms() di atas (dengan fallback ke ORG-001).
    //   Matching spesialisasi juga diperluas: cek dua arah
    //   (prog.name ⊇ spec ATAU spec ⊇ kata kunci prog).
    // ─────────────────────────────────────────────────────────
    const getTeacherOrgProgram = (guru: any) => {
        // orgPrograms sudah di-resolve dengan fallback, dijamin tidak kosong
        if (orgPrograms.length === 0) return null

        const specs = (guru.specialization || []).map((s: string) => s.toLowerCase())

        // Matching dua arah: nama program mengandung spesialisasi,
        // ATAU spesialisasi mengandung kata kunci dalam nama program
        for (const prog of orgPrograms) {
            const pname = prog.name.toLowerCase()
            const pWords = pname.split(/\s+/)
            if (
                specs.some((s: string) => pname.includes(s)) ||
                specs.some((s: string) => pWords.some(w => s.includes(w) && w.length > 3))
            ) {
                return prog
            }
        }

        // Fallback deterministik berdasarkan hash ID guru
        const hash = String(guru.id)
            .split('')
            .reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0)
        return orgPrograms[hash % orgPrograms.length]
    }

    const activeCount = teachers.filter(t => t.status === 'Active').length
    const pendingCount = teachers.filter(t => t.status === 'Pending').length
    const inactiveCount = teachers.filter(t => t.status === 'Inactive').length

    return (
        <div className="p-6 md:p-8 space-y-4 animate-in fade-in duration-700 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-50/50 via-white to-white min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Daftar Guru</h1>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[
                    { label: "Total Guru", value: teachers.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
                    { label: "Guru Aktif", value: activeCount, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                    { label: "Belum Aktif", value: pendingCount, icon: Clock, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
                    { label: "Tidak Aktif", value: inactiveCount, icon: XCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
                ].map((stat, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow border-none rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", stat.bg)}>
                                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">{stat.value}</h2>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-6">
                {/* Search & Filter Bar Section */}
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl md:rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
                        {/* Kiri: Search Bar */}
                        <div className="relative flex flex-1 w-full max-w-md">
                            <Input
                                placeholder="Cari nama pengajar..."
                                className="pr-12 h-11 text-xs rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 focus:outline-none focus:border-emerald-500/50 focus-visible:ring-0 transition-all font-medium"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onMouseDown={(e) => e.preventDefault()}
                                className="absolute right-0 top-0 h-11 w-11 rounded-r-xl bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center transition-all duration-200 focus:outline-none"
                                aria-label="Cari"
                            >
                                <Search className="h-4 w-4 text-white" />
                            </button>
                        </div>

                        {/* Kanan: Filter & Sortir Grouped */}
                        <div className="flex items-center gap-2 flex-wrap lg:justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-11 px-4 rounded-xl border border-slate-200 text-slate-600 gap-2 font-bold text-[10px] uppercase tracking-wider hover:bg-slate-50 transition-all">
                                        <Filter className="h-3.5 w-3.5 text-slate-400" />
                                        {statusFilter === "All" ? "Status: Semua" : `Status: ${statusFilter === 'Active' ? 'Aktif' : statusFilter === 'Pending' ? 'Belum Aktif' : 'Tidak Aktif'}`}
                                        <ChevronDown className="h-3 w-3 text-slate-300" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="rounded-xl border-none shadow-2xl p-1 w-48">
                                    <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase p-2">Saring Status</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => setStatusFilter("All")} className="rounded-lg font-bold text-xs p-2.5">Semua Status</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("Active")} className="rounded-lg font-bold text-xs p-2.5 text-emerald-600">Aktif</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("Pending")} className="rounded-lg font-bold text-xs p-2.5 text-purple-600">Belum Aktif</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("Inactive")} className="rounded-lg font-bold text-xs p-2.5 text-red-600">Tidak Aktif</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-11 px-4 rounded-xl border border-slate-200 text-slate-600 gap-2 font-bold text-[10px] uppercase tracking-wider hover:bg-slate-50 transition-all">
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

                            <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden md:block" />

                            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-11 px-6 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all font-bold text-[10px] uppercase tracking-wider shrink-0">
                                        <UserPlus className="h-4 w-4" />
                                        Undang Guru
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[380px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white">
                                    <DialogHeader className="p-5 pb-0">
                                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                                            <UserPlus className="h-4 w-4 text-emerald-600" />
                                            Undang Guru
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="p-5 space-y-3">
                                        <div className="relative group w-full">
                                            <Input
                                                placeholder="Cari nama atau username..."
                                                className="pr-12 h-12 rounded-2xl border-none bg-slate-50/50 dark:bg-slate-900/50 shadow-inner ring-1 ring-slate-100 dark:ring-slate-800 focus-visible:ring-2 focus-visible:ring-emerald-500 transition-all font-medium text-sm"
                                                value={inviteSearch}
                                                onChange={(e) => setInviteSearch(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                tabIndex={-1}
                                                onMouseDown={(e) => e.preventDefault()}
                                                className="absolute right-0 top-0 h-12 w-12 rounded-r-2xl bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center transition-all duration-200 focus:outline-none"
                                                aria-label="Cari"
                                            >
                                                <Search className="h-4 w-4 text-white" />
                                            </button>
                                        </div>

                                        <div className="space-y-2 min-h-[160px]">
                                            {inviteSearch.length > 0 ? (
                                                availableToInvite.length > 0 ? (
                                                    availableToInvite.map((trainer) => {
                                                        const isAlreadyMember = teachers.some(t => t.id === trainer.id)
                                                        return (
                                                            <div key={trainer.id} className="flex items-center justify-between p-2 rounded-xl border border-slate-50 hover:bg-slate-50 transition-all group/item">
                                                                <div className="flex items-center gap-2.5">
                                                                    <Avatar className="h-8 w-8 border border-white shadow-sm">
                                                                        <AvatarImage src={trainer.avatar} className="object-cover" />
                                                                        <AvatarFallback className="text-[10px]">{getInitials(trainer.name)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="space-y-0 text-left">
                                                                        <p className="text-[13px] font-bold text-slate-900 line-clamp-1 leading-tight">{trainer.name}</p>
                                                                        <p className="text-[9px] font-bold text-emerald-600 tracking-tight lowercase">@{trainer.username || trainer.id}</p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        if (isAlreadyMember) {
                                                                            toast.info(`${trainer.name} sudah menjadi anggota organisasi.`)
                                                                        } else {
                                                                            handleInviteTeacher(trainer)
                                                                        }
                                                                    }}
                                                                    className={cn(
                                                                        "h-7 px-3 rounded-lg font-bold text-[10px] transition-all border-none",
                                                                        isAlreadyMember
                                                                            ? "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                                                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                                                                    )}
                                                                >
                                                                    {isAlreadyMember ? "Anggota" : "Undang"}
                                                                </Button>
                                                            </div>
                                                        )
                                                    })
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-8 text-center text-slate-300">
                                                        <Search className="h-4 w-4 mb-1" />
                                                        <p className="text-[10px] font-medium">Guru tidak ditemukan</p>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-8 text-center text-slate-200">
                                                    <UserPlus className="h-8 w-8 mb-2" />
                                                    <p className="text-[10px] font-medium italic">Ketik nama guru untuk mulai...</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <DialogFooter className="p-5 pt-2 border-t border-slate-50 flex flex-row items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-xl font-bold text-slate-400 hover:bg-slate-50 text-[11px] h-9 px-4"
                                            onClick={() => setIsInviteDialogOpen(false)}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] h-9 px-6 shadow-sm shadow-emerald-200 transition-all active:scale-95"
                                            onClick={() => setIsInviteDialogOpen(false)}
                                        >
                                            Selesai
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                <Card className="border-none shadow-sm overflow-hidden rounded-2xl md:rounded-3xl">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 text-slate-400 font-bold bg-slate-50/50">
                                        <th className="text-left py-4 px-4 text-[10px] uppercase tracking-wider">Nama Guru</th>
                                        <th className="text-left py-4 px-2 text-[10px] uppercase tracking-wider">Kontak</th>
                                        <th className="text-left py-4 px-2 text-[10px] uppercase tracking-wider">Keahlian</th>
                                        <th className="text-left py-4 px-2 text-[10px] uppercase tracking-wider">Status</th>
                                        <th className="text-left py-4 px-2 text-[10px] uppercase tracking-wider">Bergabung</th>
                                        <th className="text-left py-4 px-2 text-[10px] uppercase tracking-wider">Program & Sesi</th>
                                        <th className="text-center py-4 px-2 text-[10px] uppercase tracking-wider">Murid</th>
                                        <th className="text-center py-4 px-2 text-[10px] uppercase tracking-wider">Rating</th>
                                        <th className="text-right py-4 px-4 text-[10px] uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {paginatedTeachers.length > 0 ? paginatedTeachers.map((guru) => (
                                        <tr key={guru.id} className="hover:bg-emerald-50/30 transition-colors group">
                                            <td className="py-4 px-4">
                                                <Link
                                                    href={`/${locale}/marketplace/teacher/${guru.id}`}
                                                    className="flex items-center gap-3 group/link hover:opacity-80 transition-all"
                                                >
                                                    <Avatar className="h-10 w-10 border border-white shadow-sm ring-2 ring-slate-100">
                                                        <AvatarImage src={guru.avatar} className="object-cover" />
                                                        <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">{getInitials(guru.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold text-slate-900 group-hover/link:text-emerald-600 transition-colors line-clamp-1">{guru.name}</p>
                                                        <p className="text-[10px] font-bold text-emerald-600 tracking-tight lowercase">@{guru.username || guru.id}</p>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="py-4 px-2">
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-1.5 text-slate-600">
                                                        <Mail className="h-3.5 w-3.5 text-emerald-500" />
                                                        <span className="text-xs font-semibold lowercase text-slate-500">{guru.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 ml-5">
                                                        <p className="text-[10px] text-slate-400 font-medium capitalize">
                                                            {guru.address}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {guru.specialization?.slice(0, 2).map((role: string) => (
                                                        <Badge key={role} className="bg-slate-100 text-slate-500 border-none px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">{role}</Badge>
                                                    )) || "Pengajar"}
                                                </div>
                                            </td>
                                            <td className="py-4 px-2">
                                                {guru.status === 'Active' ? (
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-none flex w-fit items-center gap-1 font-bold text-[10px] px-2 py-1">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Aktif
                                                    </Badge>
                                                ) : guru.status === 'Pending' ? (
                                                    <Badge className="bg-blue-50 text-blue-600 border-none flex w-fit items-center gap-1 font-bold text-[10px] px-2 py-1">
                                                        <Clock className="h-3 w-3" />
                                                        Pending
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-red-50 text-red-600 border-none flex w-fit items-center gap-1 font-bold text-[10px] px-2 py-1">
                                                        <XCircle className="h-3 w-3" />
                                                        Tidak Aktif
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="py-4 px-2">
                                                <TooltipProvider delayDuration={100}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center gap-1.5 text-slate-600 cursor-help w-fit group/date">
                                                                <CalendarDays className="h-3.5 w-3.5 text-slate-400 group-hover/date:text-emerald-500 transition-colors" />
                                                                <span className="text-[11px] font-bold border-b border-dashed border-slate-300 group-hover/date:border-emerald-500 group-hover/date:text-emerald-600 transition-colors">{formatDate(guru.joinDate)}</span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-slate-900 text-white border-none rounded-xl text-xs font-medium px-3 py-1.5 shadow-xl shadow-slate-900/20">
                                                            {formatFullDateTime(guru.joinDate, getTrainerTimezone(guru.city, guru.province))}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </td>
                                            <td className="py-4 px-2">
                                                {(() => {
                                                    const prog = getTeacherOrgProgram(guru)
                                                    if (!prog) return <span className="text-slate-300 text-xs">-</span>
                                                    return (
                                                        <div className="flex flex-col gap-1 min-w-[140px]">
                                                            <div className="flex items-center gap-1">
                                                                <Layers className="h-3 w-3 text-emerald-500 shrink-0" />
                                                                <span className="text-[11px] font-bold text-slate-700 leading-tight line-clamp-1">{prog.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 ml-4">
                                                                <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide">{prog.sessionCount} sesi</span>
                                                                <span className="text-[10px] font-bold text-emerald-600">Rp {prog.price.toLocaleString('id-ID')}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                })()}
                                            </td>
                                            <td className="py-4 px-2 text-center text-slate-600 font-bold">{guru.students}</td>
                                            <td className="py-4 px-2 text-center">
                                                <div className="flex justify-center items-center h-full">
                                                    {guru.rating ? (
                                                        <div className="flex flex-col items-center justify-center gap-1">
                                                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-amber-600 font-bold text-[11px]">
                                                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                                                <span>{guru.rating}</span>
                                                            </div>
                                                            <span className="text-[9px] text-slate-400 font-semibold lowercase tracking-tight">({guru.reviewCount || Math.floor(Math.random() * 100) + 10} ulasan)</span>
                                                        </div>
                                                    ) : '-'}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                {guru.status === 'Inactive' ? (
                                                    <Button variant="ghost" size="sm" onClick={() => handleRestoreTeacher(guru.id)} className="h-9 w-9 p-0 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Aktifkan Kembali">
                                                        <Undo className="h-4.5 w-4.5" />
                                                    </Button>
                                                ) : (
                                                    <AlertDialog>
                                                        <AlertDialogTriggerBase>
                                                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Nonaktifkan">
                                                                <Trash2 className="h-4.5 w-4.5" />
                                                            </Button>
                                                        </AlertDialogTriggerBase>
                                                        <AlertDialogContent className="bg-white border-none shadow-2xl rounded-2xl">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="text-xl font-bold text-slate-900">Nonaktifkan Guru?</AlertDialogTitle>
                                                                <AlertDialogDescription className="text-slate-500">
                                                                    Anda akan menonaktifkan <span className="font-bold text-slate-900">{guru.name}</span> dari daftar guru aktif.
                                                                    Data tetap akan tersimpan.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter className="gap-2 sm:gap-0">
                                                                <AlertDialogCancel className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-medium">Batal</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDeactivateTeacher(guru.id)}
                                                                    className="rounded-xl bg-red-600 hover:bg-red-700 text-white border-none font-bold shadow-lg shadow-red-200"
                                                                >
                                                                    Nonaktifkan
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={9} className="py-24 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center">
                                                        <Search className="h-10 w-10 text-slate-200" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-bold text-slate-500 text-lg">Pengajar tidak ditemukan</p>
                                                        <p className="text-sm text-slate-400">Coba gunakan kata kunci pencarian lain</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination Controls */}
                {filteredTeachers.length > ITEMS_PER_PAGE && (
                    <Pagination className="mt-8 mb-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                            {Array.from({ length: Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE) }).map((_, i) => (
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
                                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE), p + 1))}
                                    className={currentPage === Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </div>
    )
}
