"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useI18n } from "@/components/providers/i18n-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Calendar,
    Users2,
    GraduationCap,
    BarChart3,
    Clock,
    ArrowUpRight,
    ChevronRight,
    CheckCircle2,
    XCircle,
} from "lucide-react"
import { getInitials } from "@/utils/helpers/get-initials"
import { DUMMY_TRAINERS, type Trainer } from "@/data/trainers-data"
import { MOCK_ORGANIZATIONS_DETAIL } from "@/data/organizations-data"
import { toast } from "sonner"

// ── Import shared dialog components from requests page ──
import {
    AcceptTeacherDialog,
    RejectTeacherDialog,
} from "./requests-dialog"

const recentActivities = [
    { id: "13", user: "Ustadz Hilman", type: "teacher", action: "menyelesaikan sesi", target: "Kelas Tahsin - Ahmad Rizky", time: "15 menit lalu", route: "programs" },
    { id: "ST-001", user: "Siti Fatimah", type: "student", action: "mendaftar sebagai murid baru", target: "", time: "2 jam lalu", route: "students" },
    { id: "14", user: "Ustadzah Rania Humaira", type: "teacher", action: "mengirim laporan evaluasi", target: "Kelas Tahfidz Putri", time: "3 jam lalu", route: "programs" },
    { id: "15", user: "Ustadz Yusuf", type: "teacher", action: "mengajukan verifikasi berkas", target: "— menunggu review", time: "Hari Ini", route: "requests" },
]

export default function OrganizationAdminDashboard() {
    const params = useParams()
    const router = useRouter()
    const { locale } = useI18n()
    const orgId = params.orgId as string

    const [timeFilter, setTimeFilter] = useState("all")
    const [isProcessing, setIsProcessing] = useState(false)
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
    const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false)
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)

    const orgData = MOCK_ORGANIZATIONS_DETAIL[orgId] || MOCK_ORGANIZATIONS_DETAIL["ORG-001"]
    const orgName = orgData.name

    const nav = (path: string) => router.push(`/${locale}/organization/dashboard/${orgId}/${path}`)

    const [pendingRequests, setPendingRequests] = useState(() =>
        DUMMY_TRAINERS.slice(12, 14).map(t => ({
            id: t.id,
            name: t.name,
            username: t.username || t.name.toLowerCase().replace(/\s+/g, "_"),
            avatar: t.avatar,
            subject: "Mengajukan bergabung",
            time: "2 jam lalu",
            trainer: t,
        }))
    )

    const handleActionClick = (e: React.MouseEvent, type: "accept" | "reject", trainer: Trainer) => {
        e.stopPropagation()
        setSelectedTrainer(trainer)
        if (type === "accept") setIsAcceptDialogOpen(true)
        if (type === "reject") setIsRejectDialogOpen(true)
    }

    const handleAccept = async (note: string) => {
        if (!selectedTrainer) return
        setIsProcessing(true)
        await new Promise(resolve => setTimeout(resolve, 800))

        const acceptedIds = JSON.parse(localStorage.getItem("org_accepted_trainers") || "[]")
        if (!acceptedIds.includes(selectedTrainer.id)) {
            localStorage.setItem("org_accepted_trainers", JSON.stringify([...acceptedIds, selectedTrainer.id]))
        }

        toast.success(`${selectedTrainer.name} berhasil bergabung dengan organisasi Anda!`, {
            description: note ? `Catatan: ${note}` : undefined,
        })

        setPendingRequests(prev => prev.filter(r => r.id !== selectedTrainer.id))
        setIsProcessing(false)
        setIsAcceptDialogOpen(false)
        setSelectedTrainer(null)
    }

    const handleReject = async (reason: string, note: string) => {
        if (!selectedTrainer) return
        setIsProcessing(true)
        await new Promise(resolve => setTimeout(resolve, 800))

        const rejectedIds = JSON.parse(localStorage.getItem("org_rejected_trainers") || "[]")
        if (!rejectedIds.includes(selectedTrainer.id)) {
            localStorage.setItem("org_rejected_trainers", JSON.stringify([...rejectedIds, selectedTrainer.id]))
        }

        toast.error(`Pengajuan ${selectedTrainer.name} telah ditolak.`, {
            description: `Alasan: ${reason}${note ? `. ${note}` : ""}`,
        })

        setPendingRequests(prev => prev.filter(r => r.id !== selectedTrainer.id))
        setIsProcessing(false)
        setIsRejectDialogOpen(false)
        setSelectedTrainer(null)
    }

    return (
        <div className="pt-2 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">{orgName}</h1>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Periode:</span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">Bulan Ini</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => nav("teachers")}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between pb-2">
                            <p className="text-sm font-medium text-gray-500">Guru Tersedia</p>
                            <Users2 className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-2xl font-bold">{orgData.adminStats.teachers}</h2>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px]">+1 minggu ini</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => nav("students")}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between pb-2">
                            <p className="text-sm font-medium text-gray-500">Murid Aktif</p>
                            <GraduationCap className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-2xl font-bold">{orgData.adminStats.activeStudents}</h2>
                            <p className="text-xs text-gray-400">murid terdaftar</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => nav("requests")}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between pb-2">
                            <p className="text-sm font-medium text-gray-500">Pengajuan Masuk</p>
                            <BarChart3 className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-2xl font-bold">{orgData.adminStats.pendingRequests}</h2>
                            <p className="text-xs text-gray-400">menunggu review</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between pb-2">
                            <p className="text-sm font-medium text-gray-500">Sesi Selesai</p>
                            <Clock className="h-4 w-4 text-amber-600" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-2xl font-bold">{orgData.adminStats.sessionsCompleted}</h2>
                            <div className="flex items-center text-xs text-emerald-600">
                                <ArrowUpRight className="h-3 w-3" />8%
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Aktivitas */}
                <Card className="lg:col-span-2 h-full flex flex-col">
                    <CardHeader className="pb-2 flex-none">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">Aktivitas Terkini</CardTitle>
                            <Button variant="ghost" size="sm" className="text-emerald-600 text-xs font-bold gap-1 px-3 border border-emerald-100 hover:bg-emerald-50 bg-white" onClick={() => nav("teachers")}>
                                Semua <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-y-auto">
                        <div className="divide-y divide-gray-100 dark:divide-gray-800 mt-2">
                            {recentActivities.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                                    onClick={() => nav(item.route)}
                                >
                                    <div className="flex-1 min-w-0 pr-4">
                                        <p className="text-sm text-gray-600 truncate flex items-center">
                                            <span
                                                className="font-bold text-emerald-600 hover:underline mr-1 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (item.type === "teacher") router.push(`/${locale}/organization/dashboard/${orgId}/profile/${item.id}`)
                                                    else router.push(`/${locale}/organization/dashboard/${orgId}/students`)
                                                }}
                                            >
                                                {item.user}
                                            </span>
                                            <span className="truncate">{item.action}{item.target && <span className="font-semibold text-gray-800 ml-1">{item.target}</span>}</span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 font-medium">{item.time}</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Permintaan Guru */}
                <Card className="h-full flex flex-col">
                    <CardHeader className="pb-2 flex-none">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">Permintaan Guru</CardTitle>
                            <Button variant="ghost" size="sm" className="text-emerald-600 text-xs font-bold gap-1 px-3 border border-emerald-100 hover:bg-emerald-50 bg-white" onClick={() => nav("requests")}>
                                Semua <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                        <div className="space-y-6 mt-4">
                            {pendingRequests.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-300 mb-2" />
                                    <p className="text-sm font-medium text-slate-400">Semua pengajuan telah diproses</p>
                                    <Button variant="ghost" size="sm" className="mt-2 text-emerald-600 text-xs" onClick={() => nav("requests")}>
                                        Lihat semua →
                                    </Button>
                                </div>
                            ) : (
                                pendingRequests.map((req, idx) => (
                                    <div key={req.id} className="space-y-3 cursor-pointer group" onClick={() => router.push(`/${locale}/organization/dashboard/${orgId}/profile/${req.id}`)}>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-slate-100">
                                                <AvatarImage src={req.avatar} className="object-cover" />
                                                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-bold">
                                                    {getInitials(req.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors truncate">{req.name}</h4>
                                                <p className="text-[10px] font-bold text-emerald-600">@{req.username}</p>
                                                <p className="text-xs text-gray-500 font-medium">{req.subject}</p>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-medium flex-shrink-0">{req.time}</p>
                                        </div>
                                        <div className="flex gap-2 pl-[52px]">
                                            <Button
                                                size="sm"
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-bold h-8 text-[10px] uppercase tracking-wider"
                                                onClick={(e) => handleActionClick(e, "accept", req.trainer as Trainer)}
                                            >
                                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Terima
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-100 shadow-sm font-bold h-8 text-[10px] uppercase tracking-wider"
                                                onClick={(e) => handleActionClick(e, "reject", req.trainer as Trainer)}
                                            >
                                                <XCircle className="h-3.5 w-3.5 mr-1.5" /> Tolak
                                            </Button>
                                        </div>
                                        {idx < pendingRequests.length - 1 && <div className="border-b border-gray-100 pt-3" />}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Shared Dialogs (imported from requests page) ── */}
            <AcceptTeacherDialog
                open={isAcceptDialogOpen}
                onOpenChange={setIsAcceptDialogOpen}
                trainer={selectedTrainer}
                isProcessing={isProcessing}
                onConfirm={handleAccept}
            />
            <RejectTeacherDialog
                open={isRejectDialogOpen}
                onOpenChange={setIsRejectDialogOpen}
                trainer={selectedTrainer}
                isProcessing={isProcessing}
                onConfirm={handleReject}
            />
        </div>
    )
}