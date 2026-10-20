"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/components/providers/i18n-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
    Search,
    Users,
    MoreVertical,
    Building2,
    Plus,
    Filter,
    Settings,
    UserMinus,
    Crown,
    Shield,
    FlagIcon,
    X,
    RotateCcw,
    ClockAlert,
    ArchiveRestore,
    Check,
    MapPin,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { MOCK_ORGANIZATIONS, MOCK_ORGANIZATIONS_DETAIL } from "@/data/organizations-data"
import { toast } from "sonner"

export interface CountryData { id: number; name: string }
export interface ProvinceData { id: number; name: string; country_id: number }
export interface CityData { id: number; name: string; state_id: number }

const locationApi = {
    getCountries: async () => ({ success: true, data: [{ id: 1, name: "Indonesia" }] }),
    getStates: async (_countryId: number) => ({
        success: true,
        data: [
            { id: 1, name: "Jawa Timur", country_id: 1 },
            { id: 2, name: "Jawa Barat", country_id: 1 },
            { id: 3, name: "DKI Jakarta", country_id: 1 },
            { id: 4, name: "Jawa Tengah", country_id: 1 },
        ],
    }),
    getCities: async (_stateId: number) => ({
        success: true,
        data: [
            { id: 1, name: "Malang", state_id: 1 },
            { id: 2, name: "Surabaya", state_id: 1 },
            { id: 3, name: "Bandung", state_id: 2 },
            { id: 4, name: "Bogor", state_id: 2 },
            { id: 5, name: "Jakarta Selatan", state_id: 3 },
        ],
    }),
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrgRole = "owner" | "admin" | "member"
export type OrgStatus = "active" | "deleted"

export interface Organization {
    id: string
    name: string
    description: string
    location: string
    city: string
    province: string
    avatar?: string
    banner?: string
    members: number
    createdAt: string
    role: OrgRole
    category?: string
    deleted_at?: string | null
}

const ORG_CATEGORIES = [
    { id: "yayasan", name: "Yayasan" },
    { id: "pesantren", name: "Pesantren / Ma'had" },
    { id: "sekolah", name: "Sekolah Al-Qur'an (RTQ/TPQ)" },
    { id: "komunitas", name: "Komunitas / Majelis" },
]

// ─── Seed Data ────────────────────────────────────────────────────────────────

const LS_KEY = "my_organizations_data_v3"

function mapOrg(org: any, index: number): Organization {
    const detail = MOCK_ORGANIZATIONS_DETAIL[org.id]
    return {
        id: org.id,
        name: org.name,
        description: org.description,
        location: org.location,
        city: org.location,
        province: "",
        avatar: org.logo,
        banner: org.banner,
        members: org.teachers,
        createdAt: detail?.joinedDate || "12 Jan 2026",
        role: index === 0 ? "owner" : "member",
        category: org.type,
        deleted_at: null,
    }
}

function getSeedOrganizations(): Organization[] {
    const joined = MOCK_ORGANIZATIONS.filter((org) => org.isJoined)
    if (joined.length <= 1) {
        const ownerOrg = MOCK_ORGANIZATIONS.find((o) => o.id === "ORG-001")
        const memberOrg = MOCK_ORGANIZATIONS.find((o) => o.id === "ORG-002")
        const seeds: any[] = []
        if (ownerOrg) seeds.push(ownerOrg)
        if (memberOrg) seeds.push(memberOrg)
        return seeds.map(mapOrg)
    }
    return joined.map(mapOrg)
}

function loadOrganizations(): Organization[] {
    if (typeof window === "undefined") return getSeedOrganizations()
    try {
        const raw = localStorage.getItem(LS_KEY)
        if (raw) return JSON.parse(raw) as Organization[]
    } catch { /* ignore */ }
    const seed = getSeedOrganizations()
    localStorage.setItem(LS_KEY, JSON.stringify(seed))
    return seed
}

function saveOrganizations(orgs: Organization[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(LS_KEY, JSON.stringify(orgs))
}

// ─── Animated Card ────────────────────────────────────────────────────────────

interface AnimatedItemProps {
    children: React.ReactNode
    index: number
    delay?: number
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({ children, index, delay = 0.05 }) => {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { amount: 0.2, once: true })
    return (
        <motion.div
            ref={ref}
            initial={{ scale: 0.92, opacity: 0, y: 18 }}
            animate={inView ? { scale: 1, opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.28, delay: delay * index }}
        >
            {children}
        </motion.div>
    )
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function daysLeft(dateString: string): number {
    const target = new Date(dateString)
    const limit = new Date(target)
    limit.setDate(target.getDate() + 7)
    const diff = Math.ceil((limit.getTime() - Date.now()) / 86_400_000)
    return diff > 0 ? diff : 0
}

// ─── Organization Card ────────────────────────────────────────────────────────

interface OrgCardProps {
    org: Organization
    locale: string
    router: any
    onLeave: (org: Organization) => void
    onRestore: (orgId: string) => void
}

function OrgCard({ org, locale, router, onLeave, onRestore }: OrgCardProps) {
    return (
        <div className="relative">
            {org.deleted_at && (
                <div className="absolute -top-2 -left-2 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] sm:text-xs font-semibold tracking-wide uppercase text-rose-200 shadow-lg ring-1 ring-rose-400/30 border border-rose-400/20 bg-gradient-to-r from-rose-500/40 to-red-500/40 dark:from-rose-500/20 dark:to-red-500/20 backdrop-blur supports-[backdrop-filter]:bg-rose/20 hover:ring-rose-300/40 transition z-20 whitespace-nowrap">
                    <ClockAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-200 dark:text-rose-300" />
                    <span className="drop-shadow-sm">{daysLeft(org.deleted_at!)} hari</span>
                </div>
            )}

            <div 
                className={cn(
                    "group overflow-hidden relative rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-xl hover:shadow-slate-200/25 dark:hover:shadow-slate-900/25 transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-600 flex flex-col",
                    !org.deleted_at && "cursor-pointer"
                )}
                onClick={(e) => {
                    if (org.deleted_at) return;
                    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;
                    const url = org.role === "owner" || org.role === "admin" 
                        ? `/${locale}/organizations/${org.id}/manages` 
                        : `/${locale}/organizations/${org.id}`;
                    router.push(url);
                }}
            >
                <div className="relative p-2 pb-0">
                    <div className="relative h-40 w-full overflow-hidden rounded-xl">
                        {org.banner ? (
                            <img src={org.banner} alt={org.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800" />
                        )}
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute top-2 right-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-colors duration-200 cursor-pointer" aria-label="More options">
                                        <MoreVertical className="h-4 w-4 text-white" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-in fade-in-0 zoom-in-95 duration-150">
                                    <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150">
                                        <FlagIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        Laporkan
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                            <Link
                                href={org.role === "owner" || org.role === "admin" ? `/${locale}/organizations/${org.id}/manages` : `/${locale}/organizations/${org.id}`}
                                prefetch={false}
                                onClick={(e) => { if (org.deleted_at) e.preventDefault() }}
                            >
                                <div className="h-14 w-14 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-md flex items-center justify-center overflow-hidden">
                                    {org.avatar ? (
                                        <img src={org.avatar} alt={org.name} className="h-10 w-10 object-contain" />
                                    ) : (
                                        <span className="text-slate-600 dark:text-slate-300 font-bold text-lg">
                                            {org.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 3)}
                                        </span>
                                    )}
                                </div>
                            </Link>
                            {org.role === "owner" && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center z-10">
                                    <Crown className="w-3 h-3 text-white" />
                                </div>
                            )}
                            {org.role === "admin" && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center z-10">
                                    <Shield className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-start justify-between gap-1">
                                <Link
                                    href={org.role === "owner" || org.role === "admin" ? `/${locale}/organizations/${org.id}/manages` : `/${locale}/organizations/${org.id}`}
                                    prefetch={false}
                                    onClick={(e) => { if (org.deleted_at) e.preventDefault() }}
                                    className="font-bold text-base text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1 leading-tight"
                                    title={org.name}
                                >
                                    {org.name}
                                </Link>
                            </div>
                            {org.category && (
                                <Badge className="text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-none font-bold px-1.5 py-0">
                                    {org.category}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed flex-1">
                        {org.description || "Tidak ada deskripsi."}
                    </p>

                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-emerald-600" />
                            <span>{org.members} Anggota</span>
                        </div>
                        {(org.location || org.city) && (
                            <div className="flex items-center gap-1 truncate">
                                <MapPin className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                                <span className="truncate">{org.location || org.city}</span>
                            </div>
                        )}
                    </div>

                    {org.deleted_at ? (
                        <Button onClick={() => onRestore(org.id)} className="w-full rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 border-0 text-white">
                            <ArchiveRestore className="h-4 w-4 mr-2" />
                            Pulihkan
                        </Button>
                    ) : org.role === "owner" || org.role === "admin" ? (
                        <Button onClick={() => router.push(`/${locale}/organizations/${org.id}/manages`)} className="w-full rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0 text-white">
                            <Settings className="h-4 w-4 mr-2" />
                            Kelola
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button onClick={() => router.push(`/${locale}/organizations/${org.id}`)} className="flex-1 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 text-white">
                                <Settings className="h-4 w-4 mr-2" />
                                Detail
                            </Button>
                            <Button onClick={() => onLeave(org)} className="flex-1 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 text-white">
                                <UserMinus className="h-4 w-4 mr-2" />
                                Keluar
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MyOrganizations() {
    const { locale } = useI18n()
    const router = useRouter()

    const [organizations, setOrganizations] = useState<Organization[]>([])
    const [inputValue, setInputValue] = useState("")
    const [searchQuery, setSearchQuery] = useState("")

    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState<"active" | "deleted">("active")
    const [locationFilter, setLocationFilter] = useState({
        country_id: "0", country_name: "",
        province_id: "0", province_name: "",
        city_id: "0", city_name: "",
    })

    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [tempCategory, setTempCategory] = useState("all")
    const [tempStatus, setTempStatus] = useState<"active" | "deleted">("active")
    const [tempLocationFilter, setTempLocationFilter] = useState(locationFilter)

    const [countries, setCountries] = useState<CountryData[]>([])
    const [filterProvinces, setFilterProvinces] = useState<ProvinceData[]>([])
    const [filterCities, setFilterCities] = useState<CityData[]>([])

    const [openFilterCountry, setOpenFilterCountry] = useState(false)
    const [openFilterProvince, setOpenFilterProvince] = useState(false)
    const [openFilterCity, setOpenFilterCity] = useState(false)

    const [showLeaveDialog, setShowLeaveDialog] = useState(false)
    const [isLeaving, setIsLeaving] = useState(false)
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    useEffect(() => { setOrganizations(loadOrganizations()) }, [])

    useEffect(() => {
        const loadCountries = async () => {
            try {
                const result = await locationApi.getCountries()
                if (result.success) setCountries(result.data || [])
            } catch (error) { console.error("Error loading countries:", error) }
        }
        loadCountries()
    }, [])

    useEffect(() => {
        if (!isFilterOpen) return
        const load = async () => {
            if (!tempLocationFilter.country_id || tempLocationFilter.country_id === "0") {
                setFilterProvinces([]); setFilterCities([]); return
            }
            const result = await locationApi.getStates(parseInt(tempLocationFilter.country_id, 10))
            if (result.success) {
                const arr = Array.isArray(result.data) ? result.data : (result.data as any)?.items;
                setFilterProvinces(arr || [])
            } else toast.error((result as any).message || "Error fetching provinces")
        }
        load()
    }, [tempLocationFilter.country_id, isFilterOpen])

    useEffect(() => {
        if (!isFilterOpen) return
        const load = async () => {
            if (!tempLocationFilter.province_id || tempLocationFilter.province_id === "0") {
                setFilterCities([]); return
            }
            const result = await locationApi.getCities(Number(tempLocationFilter.province_id))
            if (result.success) {
                const arr = Array.isArray(result.data) ? result.data : (result.data as any)?.items;
                setFilterCities(arr || [])
            }
        }
        load()
    }, [tempLocationFilter.province_id, isFilterOpen])

    const filtered = useMemo(() => {
        let list = [...organizations]
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            list = list.filter((o) => o.name.toLowerCase().includes(q) || o.description.toLowerCase().includes(q))
        }
        if (selectedStatus === "active") list = list.filter((o) => !o.deleted_at)
        else list = list.filter((o) => !!o.deleted_at && o.role === "owner")
        if (selectedCategory !== "all") list = list.filter((o) => o.category === selectedCategory)
        return list.sort((a, b) => a.name.localeCompare(b.name, locale === "id" ? "id-ID" : "en-US"))
    }, [organizations, searchQuery, selectedStatus, selectedCategory, locale])

    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const pageItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filtered.slice(start, start + itemsPerPage)
    }, [filtered, currentPage, itemsPerPage])

    useEffect(() => setCurrentPage(1), [searchQuery, selectedCategory, selectedStatus, locationFilter])

    const handleLeave = (orgId: string) => {
        setIsLeaving(true)
        setTimeout(() => {
            const updated = organizations.filter((o) => o.id !== orgId)
            setOrganizations(updated)
            saveOrganizations(updated)
            setIsLeaving(false)
            setShowLeaveDialog(false)
            setSelectedOrg(null)
        }, 600)
    }

    const handleRestore = (orgId: string) => {
        const updated = organizations.map((o) => o.id === orgId ? { ...o, deleted_at: null } : o)
        setOrganizations(updated)
        saveOrganizations(updated)
    }

    const openFilter = () => {
        setTempCategory(selectedCategory)
        setTempStatus(selectedStatus)
        setTempLocationFilter({ ...locationFilter })
        setIsFilterOpen(true)
    }

    const applyFilter = () => {
        setSelectedCategory(tempCategory)
        setSelectedStatus(tempStatus)
        setLocationFilter(tempLocationFilter)
        setOpenFilterCountry(false); setOpenFilterProvince(false); setOpenFilterCity(false)
        setCurrentPage(1)
        setIsFilterOpen(false)
    }

    const cancelFilter = () => {
        setTempCategory(selectedCategory)
        setTempStatus(selectedStatus)
        setTempLocationFilter({ ...locationFilter })
        setOpenFilterCountry(false); setOpenFilterProvince(false); setOpenFilterCity(false)
        setIsFilterOpen(false)
    }

    const resetFilter = () => {
        setTempCategory("all")
        setTempStatus("active")
        setTempLocationFilter({ country_id: "0", country_name: "", province_id: "0", province_name: "", city_id: "0", city_name: "" })
    }

    const hasFilter = selectedCategory !== "all"

    return (
        <div className="p-6 space-y-6 w-full">

            {/* ── Header ── */}
            <div className="flex justify-between w-full mx-auto md:max-w-7xl mb-5 px-2 sm:px-0">
                <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                    <Building2 className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-400" />
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Organisasi</h1>
                </div>

                <div className="flex gap-1.5">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => router.push(`/${locale}/organizations/creates`)}
                        className="flex items-center justify-center gap-1 w-auto rounded-lg font-medium transition-all duration-300 text-sm whitespace-nowrap bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:shadow-lg transform hover:scale-105 border-0"
                    >
                        <Plus className="h-4 w-4" />
                        Buat
                    </Button>

                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => router.push(`/${locale}/organizations`)}
                        className="flex items-center justify-center gap-1 w-auto sm:w-24 rounded-lg font-medium transition-all duration-300 text-sm whitespace-nowrap bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:shadow-lg transform hover:scale-105 border-0"
                    >
                        <Search className="h-4 w-4" />
                        Cari
                    </Button>
                </div>
            </div>

            {/* ── Content Card ── */}
            <div className="flex-1 w-full md:max-w-7xl mx-auto p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/20 dark:shadow-gray-800/25 space-y-4 md:space-y-6 overflow-visible min-h-0">

                <div className="flex w-full gap-2">
                    <div className="flex w-full md:max-w-sm lg:max-w-md h-11 rounded-lg border-2 border-gray-200 dark:border-gray-700 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 transition-all overflow-hidden bg-gray-50/80 dark:bg-gray-800/20">
                        <div className="relative flex-1">
                            <Input
                                placeholder="Cari organisasi..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') setSearchQuery(inputValue);
                                }}
                                className="pr-8 h-full text-sm border-0 focus-visible:ring-0 bg-transparent rounded-none"
                            />
                            {inputValue && (
                                <button
                                    onClick={() => { setInputValue(""); setSearchQuery("") }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 z-10"
                                    aria-label="Clear search"
                                >
                                    <X className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                                </button>
                            )}
                        </div>
                        <Button onClick={() => setSearchQuery(inputValue)} className="h-full px-4 border-0 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-0 flex-shrink-0">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={openFilter}
                        className="hidden sm:flex items-center justify-center gap-2 h-10 px-4 rounded-lg font-medium transition-all duration-300 text-sm whitespace-nowrap border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 shadow-sm hover:shadow-md relative flex-shrink-0"
                    >
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                        {hasFilter && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white z-100" />}
                    </Button>
                </div>

                {pageItems.length > 0 && (
                    <div className="flex-1 flex flex-col space-y-6 w-full min-h-0">
                        <div className="flex-shrink-0 flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                <span className="text-sm">Organisasi ({filtered.length})</span>
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible min-h-0">
                            {pageItems.map((org, index) => (
                                <AnimatedItem key={org.id} index={index}>
                                    <OrgCard
                                        org={org}
                                        locale={locale}
                                        router={router}
                                        onLeave={(o) => { setSelectedOrg(o); setShowLeaveDialog(true) }}
                                        onRestore={handleRestore}
                                    />
                                </AnimatedItem>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex-shrink-0 flex justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious onClick={() => { if (currentPage > 1) setCurrentPage(currentPage - 1) }} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                                        </PaginationItem>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <PaginationItem key={page}>
                                                <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page} className="cursor-pointer">{page}</PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext onClick={() => { if (currentPage < totalPages) setCurrentPage(currentPage + 1) }} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </div>
                )}

                {pageItems.length === 0 && (
                    <div className="flex-1 flex items-center justify-center w-full py-5">
                        <div className="text-center">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 md:mb-6">
                                <Building2 className="h-8 w-8 md:h-10 md:w-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <div className="text-slate-600 dark:text-slate-400 text-base md:text-lg font-medium mb-2">
                                {selectedStatus === "deleted" ? "Tidak ada organisasi yang sedang dalam proses penghapusan." : "Belum ada organisasi"}
                            </div>
                            <p className="text-slate-500 dark:text-slate-500 text-sm md:text-base">
                                {selectedStatus === "active" && "Anda belum bergabung atau membuat organisasi. Mulai dengan membuat atau mencari organisasi."}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Leave Dialog ── */}
            <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
                <AlertDialogContent className="dark:bg-gray-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Keluar dari Organisasi</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin keluar dari <strong>{selectedOrg?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-row justify-end gap-2 mt-2">
                        <AlertDialogCancel className="cursor-pointer w-auto px-5" onClick={() => { setShowLeaveDialog(false); setSelectedOrg(null) }}>Batal</AlertDialogCancel>
                        <AlertDialogAction className="cursor-pointer w-auto px-5 bg-red-600 hover:bg-red-700 text-white" onClick={() => handleLeave(selectedOrg!.id)} disabled={isLeaving}>
                            {isLeaving ? "Keluar..." : "Ya, Keluar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ── Filter Dialog ── */}
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogContent className="max-w-2xl z-100">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            Filter
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Kategori</Label>
                            <Select value={tempCategory} onValueChange={(v) => setTempCategory(v || "all")}>
                                <SelectTrigger className="min-h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 mt-1 w-full">
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl z-100">
                                    <SelectItem value="all">Semua</SelectItem>
                                    {ORG_CATEGORIES.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Negara</Label>
                            <Popover open={openFilterCountry} onOpenChange={setOpenFilterCountry}>
                                <PopoverTrigger asChild className="w-full text-left mt-1">
                                    <Button variant="outline">{tempLocationFilter.country_name || "Pilih Negara"}</Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="p-0 z-100">
                                    <Command>
                                        <CommandInput placeholder="Cari Negara" />
                                        <CommandList>
                                            <CommandGroup>
                                                {countries.map((country: CountryData) => {
                                                    const countryId = country.id.toString()
                                                    return (
                                                        <CommandItem className="w-full flex justify-between" onSelect={() => {
                                                            setTempLocationFilter((prev) => {
                                                                const isSelected = prev.country_id === countryId
                                                                return isSelected
                                                                    ? { ...prev, country_id: "0", country_name: "", province_id: "0", province_name: "", city_id: "0", city_name: "" }
                                                                    : { ...prev, country_id: countryId, country_name: country.name, province_id: "0", province_name: "", city_id: "0", city_name: "" }
                                                            })
                                                            setOpenFilterCountry(false); setOpenFilterProvince(false); setOpenFilterCity(false)
                                                        }} value={country.name} key={country.id}>
                                                            {country.name}
                                                            <Check className={`text-red-200 w-4 h-4 ${tempLocationFilter.country_id === countryId ? "opacity-100" : "opacity-0"}`} />
                                                        </CommandItem>
                                                    )
                                                })}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <Label>Provinsi</Label>
                            <Popover open={openFilterProvince} onOpenChange={setOpenFilterProvince}>
                                <PopoverTrigger asChild className="w-full text-left mt-1" disabled={Number(tempLocationFilter.country_id) === 0}>
                                    <Button variant="outline">{tempLocationFilter.province_name || "Pilih Provinsi"}</Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="p-0 z-100">
                                    <Command>
                                        <CommandInput placeholder="Cari Provinsi" />
                                        <CommandList>
                                            <CommandGroup>
                                                {filterProvinces.map((province: ProvinceData) => {
                                                    const provinceId = province.id.toString()
                                                    return (
                                                        <CommandItem className="w-full flex justify-between" onSelect={() => {
                                                            setTempLocationFilter((prev) => {
                                                                const isSelected = prev.province_id === provinceId
                                                                return isSelected
                                                                    ? { ...prev, province_id: "0", province_name: "", city_id: "0", city_name: "" }
                                                                    : { ...prev, province_id: provinceId, province_name: province.name, city_id: "0", city_name: "" }
                                                            })
                                                            setOpenFilterProvince(false); setOpenFilterCity(false)
                                                        }} value={province.name} key={province.id}>
                                                            {province.name}
                                                            <Check className={`text-red-200 w-4 h-4 ${tempLocationFilter.province_id === provinceId ? "opacity-100" : "opacity-0"}`} />
                                                        </CommandItem>
                                                    )
                                                })}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <Label>Kota</Label>
                            <Popover open={openFilterCity} onOpenChange={setOpenFilterCity}>
                                <PopoverTrigger asChild className="w-full text-left mt-1" disabled={Number(tempLocationFilter.province_id) === 0}>
                                    <Button variant="outline">{tempLocationFilter.city_name || "Pilih Kota"}</Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="p-0 z-100">
                                    <Command>
                                        <CommandInput placeholder="Cari Kota" />
                                        <CommandList>
                                            <CommandGroup>
                                                {filterCities.map((city: CityData) => {
                                                    const cityId = city.id.toString()
                                                    return (
                                                        <CommandItem className="w-full flex justify-between" onSelect={() => {
                                                            setTempLocationFilter((prev) => {
                                                                const isSelected = prev.city_id === cityId
                                                                return isSelected
                                                                    ? { ...prev, city_id: "0", city_name: "" }
                                                                    : { ...prev, city_id: cityId, city_name: city.name }
                                                            })
                                                            setOpenFilterCity(false)
                                                        }} value={city.name} key={Number(city.id)}>
                                                            {city.name}
                                                            <Check className={`text-red-200 w-4 h-4 ${tempLocationFilter.city_id === cityId ? "opacity-100" : "opacity-0"}`} />
                                                        </CommandItem>
                                                    )
                                                })}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status</Label>
                            <Select value={tempStatus} onValueChange={(v) => setTempStatus(v as "active" | "deleted")}>
                                <SelectTrigger className="min-h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 mt-1 w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl z-100">
                                    <SelectItem value="active" className="capitalize">Aktif</SelectItem>
                                    <SelectItem value="deleted" className="capitalize">Dihapus</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-between">
                        <Button variant="outline" onClick={resetFilter} className="border-2 border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-600 text-slate-700 dark:text-slate-300 rounded-xl mt-2 sm:mt-0">
                            <RotateCcw className="w-4 h-4 mr-2" />Reset
                        </Button>
                        <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                            <Button variant="outline" onClick={cancelFilter} className="flex-1 sm:flex-none border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl">Batal</Button>
                            <Button onClick={applyFilter} className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">Terapkan</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}