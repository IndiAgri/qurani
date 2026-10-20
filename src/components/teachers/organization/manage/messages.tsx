"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useI18n } from "@/components/providers/i18n-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
    Plus, MoreHorizontal,
    Paperclip, Send, ChevronLeft,
    CheckCheck, Clock, Search as SearchIcon, Trash2, Ban, Archive, User as UserIcon,
    CornerUpRight, CheckCircle2, CornerDownRight, MailOpen, Mail
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Helper: format timestamp → Today / Yesterday / Monday / 12/3/2026
function formatMsgDate(isoString: string): string {
    if (!isoString) return ''
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return ''
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const diffDays = Math.round((startOfToday.getTime() - startOfDate.getTime()) / 86400000)
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'long' })
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

// Dummy Inquiries Data - matches DUMMY_TRAINERS.slice(12, 17) used in requests page
const DUMMY_INQUIRIES = [
    { id: "c1", name: "Ustadz Hilman", email: "ustadz.hilman@gmail.com", avatar: "https://c.superprof.com/i/m/14833246/600/20240806081212/14833246.webp", status: "unread" },
    { id: "c2", name: "Ustadzah Rania Humaira", email: "rania.humaira@mail.com", avatar: "https://c.superprof.com/i/m/14813982/600/20240523070530/14813982.webp", status: "read" },
    { id: "c3", name: "Ustadz Yusuf", email: "ustadz.yusuf@mail.com", avatar: "https://c.superprof.com/i/m/39221662/300/20251021143924/39221662.webp", status: "replied" },
    { id: "c4", name: "Ustadzah Afra", email: "ustadzah.afra@yahoo.com", avatar: "https://c.superprof.com/i/m/25294883/600/20250918154052/25294883.webp", status: "unread" },
    { id: "c5", name: "Ustadz Fatih Karim", email: "fatih.karim@gmail.com", avatar: "https://c.superprof.com/i/m/26943889/300/20230623105433/26943889.webp", status: "read" },
]

const now = new Date()
const DUMMY_MESSAGES: Record<string, any[]> = {
    "c1": [ // Today
        {
            id: 101,
            text: "Assalamualaikum admin,\n\nNama Lengkap: Ustadz Hilman Fauzi\nEmail: ustadz.hilman@gmail.com\nKategori: Pendaftaran Pengajar\n\nPerkenalkan, saya dari Depok dengan spesialisasi Tahsin dan Tajwid, 5 tahun pengalaman mengajar di berbagai masjid.\n\nSaya tertarik bergabung dengan organisasi ini sebagai pengajar. Apakah saat ini masih membuka pendaftaran guru baru?\n\nWassalamualaikum.",
            sender: "user",
            timestamp: new Date(now.getTime() - 10 * 60000).toISOString()
        },
    ],
    "c2": [ // Yesterday
        {
            id: 201,
            text: "Assalamualaikum,\n\nNama Lengkap: Ustadzah Rania Humaira\nEmail: rania.humaira@mail.com\nKategori: Pendaftaran Pengajar\n\nSaya bersertifikat Metode Ummi dari Bogor, spesialis tahfidz dan tahsin untuk anak-anak usia dini.\n\nMohon informasi lebih lanjut mengenai alur pendaftaran pengajar di organisasi ini.",
            sender: "user",
            timestamp: new Date(now.getTime() - 27 * 3600000).toISOString()
        },
        {
            id: 202,
            text: "Waalaikumussalam Ustadzah Rania,\n\nTerima kasih telah menghubungi kami! Alur pendaftaran pengajar cukup mudah:\n1. Isi formulir di aplikasi\n2. Tim kami akan review profil Ustadzah\n3. Jika lolos seleksi, akan ada konfirmasi dalam 3 hari kerja\n\nSilakan lanjutkan prosesnya melalui tombol Request di halaman profil Ustadzah.\n\nSalam,\nAdmin Organisasi",
            sender: "org",
            timestamp: new Date(now.getTime() - 25 * 3600000).toISOString() // 25 jam lalu → Yesterday
        },
    ],
    "c3": [ // Nama hari (3 hari lalu)
        {
            id: 301,
            text: "Selamat siang admin,\n\nNama Lengkap: Ustadz Yusuf Abdurrahman\nEmail: ustadz.yusuf@mail.com\nKategori: Pendaftaran Pengajar\n\nSaya dari Tangerang, sudah 15 tahun mengajar tahfidz. Saya mengirimkan permohonan bergabung melalui aplikasi. Apakah ada syarat tambahan yang perlu saya lengkapi?\n\nTerima kasih.",
            sender: "user",
            timestamp: new Date(now.getTime() - 3 * 86400000 + 1 * 3600000).toISOString()
        },
        {
            id: 302,
            text: "Waalaikumussalam Ustadz Yusuf,\n\nTerima kasih atas minat bergabungnya. Pengajuan Anda sudah kami terima dan sedang dalam proses review oleh tim kami.\n\nUntuk dokumen tambahan, mohon siapkan fotokopi syahadah dan CV singkat. Kami akan menghubungi Ustadz kembali dalam 2-3 hari kerja.\n\nSalam,\nAdmin Organisasi",
            sender: "org",
            timestamp: new Date(now.getTime() - 3 * 86400000 + 2 * 3600000).toISOString() // 3 hari lalu → nama hari
        },
    ],
    "c4": [ // Nama hari (5 hari lalu)
        {
            id: 401,
            text: "Halo admin,\n\nNama Lengkap: Ustadzah Afra Salimah\nEmail: ustadzah.afra@yahoo.com\nKategori: Pertanyaan Umum\n\nSaya dari Bekasi, spesialisasi Tajwid dengan metode Qiroati dan Tartil. Saya ingin menanyakan apakah ada kelas yang membutuhkan pengajar tajwid saat ini?\n\nJazakallah khair.",
            sender: "user",
            timestamp: new Date(now.getTime() - 5 * 86400000).toISOString()
        },
    ],
    "c5": [ // Format tanggal (10 hari lalu)
        {
            id: 501,
            text: "Assalamualaikum,\n\nNama Lengkap: Ustadz Fatih Karim\nEmail: fatih.karim@gmail.com\nKategori: Kerjasama Organisasi\n\nSaya dari Jakarta Selatan, memiliki Ijazah Sanad Riwayat Hafs dan sudah 20 tahun mengajar. Saya tertarik membuka kelas sanad dan talaqqi di bawah naungan organisasi ini.\n\nApakah bisa kita jadwalkan pertemuan untuk diskusi lebih lanjut?",
            sender: "user",
            timestamp: new Date(now.getTime() - 10 * 86400000).toISOString()
        },
        {
            id: 502,
            text: "Waalaikumussalam Ustadz Fatih,\n\nMasyaAllah, pengalaman 20 tahun tentu sangat berharga. Kami sangat tertarik untuk berdiskusi lebih lanjut.\n\nBoleh kami hubungi melalui email fatih.karim@gmail.com untuk penjadwalan?\n\nSalam,\nAdmin Organisasi",
            sender: "org",
            timestamp: new Date(now.getTime() - 9 * 86400000).toISOString() // 9 hari lalu → dd/m/yyyy
        },
    ],
}

function MessagesContent() {
    const { locale } = useI18n()
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialId = searchParams.get('id')
    const [selectedId, setSelectedId] = useState<string | null>(initialId)
    const [inputText, setInputText] = useState("")
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [messagesState, setMessagesState] = useState<Record<string, any[]>>(DUMMY_MESSAGES)

    const inquiriesList = DUMMY_INQUIRIES.map((c) => {
        const msgs = messagesState[c.id] || []
        const lastMsgObj = msgs[msgs.length - 1]
        const unreadCount = msgs.filter(m => m.sender === "user" && c.status === "unread").length
        const fullText = lastMsgObj ? lastMsgObj.text.replace(/\n/g, ' ') : "Belum ada pesan"
        const previewText = fullText.length > 50 ? fullText.slice(0, 50) + "..." : fullText

        return {
            ...c,
            lastMessage: previewText,
            timeAgo: lastMsgObj ? formatMsgDate(lastMsgObj.timestamp) : "",
            unread: unreadCount,
        }
    })

    const activeInquiry = inquiriesList.find(c => c.id === selectedId)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [selectedId, messagesState])

    const handleSend = () => {
        if (!inputText.trim() || !selectedId) return
        const currentId = selectedId
        const newMsg = {
            id: Date.now(),
            text: inputText,
            sender: "org",
            timestamp: new Date().toISOString()
        }
        setMessagesState(prev => ({
            ...prev,
            [currentId]: [...(prev[currentId] || []), newMsg]
        }))
        setInputText("")
    }

    return (
        <div className="flex w-full h-[calc(100vh-64px)] bg-white dark:bg-slate-950 overflow-hidden">
            {/* Left Sidebar (Inquiry List) */}
            <div className={cn(
                "w-full md:w-[340px] lg:w-[400px] border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col shrink-0 transition-all duration-300 absolute md:relative z-20 h-full",
                !isSidebarOpen && "-translate-x-full md:translate-x-0 md:w-0"
            )}>
                <div className="p-5 space-y-4 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400">
                            {inquiriesList.length} Messages
                        </Badge>
                    </div>
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Cari nama atau email..."
                            className="pl-9 h-10 bg-slate-100/50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium w-full focus-visible:ring-1 focus-visible:ring-emerald-500"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1 overflow-x-hidden">
                    <div className="p-3">
                        {inquiriesList.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => {
                                    setSelectedId(chat.id)
                                    if (window.innerWidth < 768) setIsSidebarOpen(false)
                                }}
                                className={cn(
                                    "w-full flex flex-col gap-2 p-3.5 rounded-2xl transition-all mb-1.5 relative group text-left",
                                    selectedId === chat.id
                                        ? "bg-slate-100 dark:bg-slate-800/80"
                                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                                )}
                            >
                                {selectedId === chat.id && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-emerald-500 rounded-r-full" />
                                )}
                                <div className="flex items-center gap-3 w-full">
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <Avatar className="h-12 w-12 shadow-sm border border-slate-50 dark:border-slate-800">
                                            <AvatarImage src={chat.avatar} className="object-cover" />
                                            <AvatarFallback className="text-xs font-bold">{chat.name[0]}</AvatarFallback>
                                        </Avatar>
                                        {chat.status === "unread" && (
                                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></span>
                                        )}
                                    </div>

                                    {/* Content Info */}
                                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                                        <div className="flex justify-between items-baseline gap-2">
                                            <p className="font-bold text-slate-900 dark:text-white truncate text-sm">{chat.name}</p>
                                            <span className="text-[10px] text-slate-400 font-bold shrink-0">{chat.timeAgo}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 w-full">
                                            {chat.status !== "unread" && (
                                                <CheckCheck className="h-3 w-3 text-emerald-500 shrink-0" />
                                            )}
                                            <p className={cn(
                                                "text-xs line-clamp-1 leading-tight flex-1",
                                                chat.status === "unread" ? "text-slate-900 dark:text-slate-100 font-extrabold" : "text-slate-500 dark:text-slate-400 font-medium"
                                            )}>
                                                {chat.lastMessage}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Right Side (Main Conversation) */}
            <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden relative min-w-0">
                {selectedId && activeInquiry ? (
                    <>
                        {/* Header */}
                        <div className="h-[76px] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white dark:bg-slate-900 z-10 shrink-0">
                            <div className="flex items-center gap-4 min-w-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden -ml-2 rounded-full h-9 w-9 shrink-0 bg-slate-100"
                                    onClick={() => setIsSidebarOpen(true)}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <Avatar className="h-10 w-10 shadow-sm shrink-0">
                                    <AvatarImage src={activeInquiry.avatar} className="object-cover" />
                                    <AvatarFallback className="font-bold">{activeInquiry.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <h2 className="font-black text-slate-900 dark:text-white text-lg leading-tight tracking-tight truncate flex items-center gap-2">
                                        {activeInquiry.name}
                                    </h2>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                            <Mail className="h-3 w-3" />
                                            <span>{activeInquiry.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-9 w-9 rounded-full text-slate-400">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl border-slate-100 dark:border-slate-800">
                                        <DropdownMenuItem className="rounded-xl py-2 cursor-pointer flex items-center gap-2">
                                            <UserIcon className="h-4 w-4" />
                                            <span className="font-semibold text-sm">Lihat Profil</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-xl py-2 cursor-pointer flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                            <span className="font-semibold text-sm">Tandai Selesai</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="my-1.5 bg-slate-100 dark:bg-slate-800" />
                                        <DropdownMenuItem className="rounded-xl py-2 cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950">
                                            <Trash2 className="h-4 w-4" />
                                            <span className="font-semibold text-sm">Hapus Pesan</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Thread Area (Email-like) */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 flex flex-col relative w-full h-full max-w-4xl mx-auto custom-scrollbar">
                            <div className="flex-1 flex flex-col space-y-6 pb-6 w-full">
                                {(selectedId ? messagesState[selectedId] || [] : []).map((msg, i, arr) => {
                                    const msgDate = formatMsgDate(msg.timestamp);
                                    const prevMsgDate = i > 0 ? formatMsgDate(arr[i - 1].timestamp) : null;
                                    const showDateLabel = msgDate !== prevMsgDate;

                                    return (
                                        <div key={msg.id} className="flex flex-col w-full">
                                            {/* WA-style Date Group Label */}
                                            {showDateLabel && (
                                                <div className="flex justify-center mb-4 mt-2">
                                                    <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px] px-3 py-1 rounded-full shadow-sm text-center">
                                                        {msgDate}
                                                    </div>
                                                </div>
                                            )}

                                            <div className={cn(
                                                "w-fit max-w-[90%] md:max-w-[80%] p-4 shadow-sm border relative pb-8",
                                                msg.sender === "org"
                                                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 ml-auto rounded-2xl rounded-tr-sm"
                                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 mr-auto rounded-2xl rounded-tl-sm"
                                            )}>
                                                <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap md:pr-12">
                                                    {msg.text}
                                                </div>

                                                {/* WA-style Time at bottom right */}
                                                <div className="absolute bottom-4 right-6 flex items-center justify-end gap-1">
                                                    <p className="text-[10px] font-bold text-slate-400">
                                                        {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                    </p>
                                                    {msg.sender === "org" && (
                                                        <CheckCheck className="w-3.5 h-3.5 text-emerald-500 ml-0.5" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Reply Input Area */}
                        <div className="p-3 md:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
                            <div className="max-w-4xl mx-auto flex flex-col gap-1.5">
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 overflow-hidden focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring transition-all shadow-sm">
                                    <Textarea
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Ketikkan balasan untuk pengguna ini..."
                                        className="min-h-[60px] border-none bg-transparent resize-none focus-visible:ring-0 p-3 text-sm"
                                    />
                                    <div className="flex items-center justify-between p-1.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex gap-1 ml-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
                                                <Paperclip className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Button
                                            onClick={handleSend}
                                            disabled={!inputText.trim()}
                                            className={cn(
                                                "rounded-lg h-8 px-4 text-xs font-bold transition-all gap-1.5",
                                                inputText.trim()
                                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                                    : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                                            )}
                                        >
                                            Kirim
                                            <Send className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Empty State UI */
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-50/50 dark:bg-slate-900/40">
                        <div className="h-24 w-24 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-2 shadow-sm ring-4 ring-slate-50 dark:ring-slate-900">
                            <MailOpen className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                        </div>
                        <div className="max-w-sm space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Kotak Masuk Organisasi</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[280px] mx-auto">
                                Pilih salah satu pesan dari daftar di sebelah kiri untuk melihat detail dan membalas pertanyaan.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function OrgMessagesPage() {
    return (
        <MessagesContent />
    )
}
