"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useI18n } from "@/components/providers/i18n-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, GraduationCap, FileText, ArrowRight, BookOpen, Clock, CalendarIcon } from "lucide-react"

export default function OrganizationStudentsPage() {
    const params = useParams()
    const { locale } = useI18n()
    const orgId = params.orgId as string

    // Mock Data
    const students = [
        { id: "S-001", name: "Ahmad Rizky", parent: "Bpk. Abdullah", course: "Tahsin Reguler", assignedTo: "Ustadz Hanif", sessions: "8/12", status: "Aktif", lastSession: "Hari ini, 08:00" },
        { id: "S-002", name: "Siti Fatimah", parent: "Ibu Maryam", course: "Tahfidz Anak", assignedTo: "Ustadzah Sarah", sessions: "2/8", status: "Aktif", lastSession: "Kemarin, 16:00" },
        { id: "S-003", name: "Fatih Ramadhan", parent: "Bpk. Budi", course: "Iqra Dasar", assignedTo: "Ustadz Ziyad", sessions: "15/15", status: "Selesai", lastSession: "12 Mar 2026" },
        { id: "S-004", name: "Nisa Sabyan", parent: "Ibu Khadijah", course: "Tajwid Lanjutan", assignedTo: "Ustadz Hanif", sessions: "4/8", status: "Aktif", lastSession: "Hari ini, 10:00" },
        { id: "S-005", name: "Bimar Abimanyu", parent: "Bpk. Rendra", course: "Tahsin Dewasa", assignedTo: "Ustadzah Sarah", sessions: "1/5", status: "Pending", lastSession: "Belum Dimulai" },
    ]

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Data Murid</h1>
                    <p className="text-slate-500 font-medium">Monitoring murid yang sedang belajar di bawah naungan organisasi Anda.</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Unduh Rekap Nilai
                </Button>
            </div>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Daftar Murid Terdaftar</CardTitle>
                                <CardDescription>Terdapat total 84 murid yang sedang diajar oleh seluruh guru organisasi Anda.</CardDescription>
                            </div>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                placeholder="Cari nama murid atau paket..." 
                                className="pl-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Nama Murid</th>
                                    <th className="px-6 py-4 font-semibold">Program / Guru Pengajar</th>
                                    <th className="px-6 py-4 font-semibold">Progres Sesi</th>
                                    <th className="px-6 py-4 font-semibold">Aktivitas Terakhir</th>
                                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {students.map((student, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold flex items-center justify-center text-slate-600 dark:text-slate-300">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white leading-tight">{student.name}</p>
                                                    <p className="text-xs text-slate-500">Wali: {student.parent}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <BookOpen className="h-3 w-3 text-emerald-600" />
                                                <span className="font-semibold text-slate-700 dark:text-slate-200">{student.course}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1.5">
                                                Oleh: <Badge variant="outline" className="bg-white dark:bg-slate-800 font-medium px-1.5">{student.assignedTo}</Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center justify-between text-xs font-semibold">
                                                    <span className={student.status === 'Selesai' ? 'text-blue-600' : 'text-emerald-600'}>{student.sessions} Sesi</span>
                                                    <span>{student.status}</span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                                                    <div 
                                                        className={`h-1.5 rounded-full ${student.status === 'Selesai' ? 'bg-blue-500' : 'bg-emerald-500'}`} 
                                                        style={{ width: `${(parseInt(student.sessions.split("/")[0]) / parseInt(student.sessions.split("/")[1])) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            <div className="flex items-center gap-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 w-fit px-2 py-1 rounded-md">
                                                <CalendarIcon className="h-3 w-3" />
                                                {student.lastSession}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-bold group-hover:pr-2 transition-all">
                                                Detail
                                                <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
