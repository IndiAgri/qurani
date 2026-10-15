"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { useI18n } from "@/components/providers/i18n-provider"
import { DUMMY_TRAINERS } from "@/data/trainers-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Plus, Video, Phone, MoreHorizontal,
    Smile, Paperclip, Mic, Send, ChevronLeft,
    CheckCheck, Check, Minimize2,
    Search as SearchIcon, Trash2, Ban, Archive, User as UserIcon,
    CornerUpRight, Star as StarIcon, Pencil, Sparkles, RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

// Coherent Initial Dummy Data matching Qurani screenshot
const DUMMY_MESSAGES_DATA: Record<string, {
    id: number | string;
    text: string;
    sender: "user" | "trainer";
    time: string;
    read: boolean;
}[]> = {
    "1": [
        { id: 101, text: "Assalamualaikum Ustadz Rafi, perkenalkan saya Virly. Saya ingin mendaftar program tahsin untuk perbaikan bacaan saya.", sender: "user", time: "09:00 AM", read: true },
        { id: 102, text: "Waalaikumussalam Mbak Virly. Alhamdulillah, selamat datang! Untuk program tahsin kita mulai dari evaluasi makhraj dan tajwid dasar terlebih dahulu supaya saya tahu titik mana yang perlu diprioritaskan.", sender: "trainer", time: "09:05 AM", read: true },
        { id: 103, text: "Baik Ustadz. Kira-kira berapa sesi yang dibutuhkan untuk pemula seperti saya? Saya sudah bisa baca tapi masih banyak yang tidak tepat.", sender: "user", time: "09:10 AM", read: true },
        { id: 104, text: "Untuk pemula yang sudah bisa baca, biasanya 8-10 sesi sudah cukup untuk memperbaiki makhraj dan memahami hukum tajwid dasar. Nanti kita evaluasi lagi setelah 4 sesi pertama.", sender: "trainer", time: "09:15 AM", read: true },
        { id: 105, text: "Kita bisa mulai Senin depan jam 19.30 WIB via Zoom ya, Mbak. Ustadz akan kirimkan link Zoom dan modul PDF materinya sebelum sesi pertama.", sender: "trainer", time: "05:21 PM", read: false },
    ],
    "2": [
        { id: 201, text: "Assalamualaikum Ustadzah Nur Aisyah, anak saya Zaki ingin mulai setoran hafalan. Kami mau mulai dari juz 30.", sender: "user", time: "08:00 AM", read: true },
        { id: 202, text: "Waalaikumussalam. Bismillah, juz 30 memang tempat terbaik untuk memulai hafalan. Boleh tahu usia Zaki berapa ya Bu?", sender: "trainer", time: "08:10 AM", read: true },
        { id: 203, text: "Zaki baru 9 tahun Ustadzah, tapi alhamdulillah sudah lancar membaca Al-Qur'an.", sender: "user", time: "08:12 AM", read: true },
        { id: 204, text: "MasyaAllah, usia yang sangat ideal untuk menghafal! Di usia 9 tahun memori anak masih sangat kuat dan fleksibel. InsyaAllah prosesnya akan lebih mudah.", sender: "trainer", time: "08:15 AM", read: true },
        { id: 205, text: "Bu, mau info ya — untuk hari ini jadwal setoran Zaki dimajukan jadi jam 15.30 WIB karena ada rapat koordinasi guru. Mohon konfirmasinya apakah Zaki bisa hadir di jam tersebut.", sender: "trainer", time: "10:04 AM", read: false },
    ],
    "3": [
        { id: 301, text: "Assalamualaikum Ustadz Zain. Saya sudah ngaji sejak kecil tapi merasa bacaan saya masih belum benar tajwidnya, terutama di bagian-bagian tertentu.", sender: "user", time: "02:00 PM", read: true },
        { id: 302, text: "Waalaikumussalam. Tidak apa-apa, justru kesadaran itu yang penting. Banyak orang ngaji puluhan tahun tapi tidak sadar ada kesalahan. Kita perbaiki bersama insyaAllah.", sender: "trainer", time: "02:10 PM", read: true },
        { id: 303, text: "Boleh saya tanya, bagian tajwid mana yang paling sering Anda rasa masih kurang tepat?", sender: "trainer", time: "02:11 PM", read: true },
        { id: 304, text: "Di bagian ghunnah dan ikhfa sering tertukar Ustadz, juga kadang panjang pendeknya mad masih sering salah.", sender: "user", time: "02:15 PM", read: true },
        { id: 305, text: "Baik, di pertemuan berikutnya kita akan fokus latihan ghunnah, ikhfa, dan praktik hukum mad. Tolong siapkan mushaf ya, kita akan latihan langsung dari ayat-ayat Al-Qur'an.", sender: "trainer", time: "Yesterday", read: false },
    ],
    "4": [
        { id: 401, text: "Assalamualaikum Ustadzah Fatima. Saya sangat tertarik untuk belajar tilawah Al-Qur'an dengan lagu, khususnya lagu Bayyati karena menurut saya paling indah.", sender: "user", time: "Yesterday", read: true },
        { id: 402, text: "Waalaikumussalam. Wah, selera Anda bagus sekali! Bayyati memang salah satu lagu yang paling populer dan banyak digunakan di acara-acara resmi. Pilihan yang tepat!", sender: "trainer", time: "Yesterday", read: true },
        { id: 403, text: "Sebelum kita mulai, saya mau tanya dulu — apakah Anda sebelumnya pernah belajar maqamat atau ilmu lagu Al-Qur'an sama sekali?", sender: "trainer", time: "Yesterday", read: true },
        { id: 404, text: "Belum sama sekali Ustadzah. Ini benar-benar pertama kali saya belajar tilawah secara formal.", sender: "user", time: "Yesterday", read: true },
        { id: 405, text: "Nanti saya kirim contoh audio untuk Anda dengarkan sebelum sesi berikutnya ya.", sender: "trainer", time: "13 days ago", read: true },
    ],
    "5": [
        { id: 501, text: "Ustadz Ibrahim, saya ingin memulai program tahfidz. Target saya adalah hafal minimal 1 juz dalam 1 bulan. Apakah itu target yang realistis?", sender: "user", time: "2 days ago", read: true },
        { id: 502, text: "InsyaAllah sangat bisa! Target 1 juz per bulan itu standar yang realistis bahkan konservatif. Asalkan konsisten latihan minimal 30 menit per hari dan rutin murajaah.", sender: "trainer", time: "2 days ago", read: true },
        { id: 503, text: "Kita bagi menjadi sekitar 20-30 ayat baru per hari, sisanya untuk murajaah hafalan lama. Dengan ritme ini insyaAllah 1 juz bisa selesai dalam 3-4 minggu.", sender: "trainer", time: "2 days ago", read: true },
        { id: 504, text: "Jazakallah khair Ustadz, insyaAllah saya siap. Besok saya akan video call jam 20.00 ya.", sender: "user", time: "2 days ago", read: true },
        { id: 505, text: "Siap, ditunggu ya! Semangat hafalannya.", sender: "trainer", time: "2 days ago", read: true },
    ],
    "6": [
        { id: 601, text: "Assalamualaikum Ustadzah Diyah. Anak saya Alya baru berusia 5 tahun, apakah sudah bisa mulai belajar Iqro atau masih terlalu kecil?", sender: "user", time: "Yesterday", read: true },
        { id: 602, text: "Waalaikumussalam Bu. Wah, 5 tahun itu justru usia yang sangat ideal untuk mulai mengenal Al-Qur'an! Otak anak di usia itu seperti spons, sangat mudah menyerap hal baru.", sender: "trainer", time: "Yesterday", read: true },
        { id: 603, text: "Metode yang saya pakai untuk anak usia dini sangat menyenangkan — kita mulai dari mengenal huruf hijaiyah sambil bermain, bernyanyi, dan menggunakan gambar berwarna supaya Alya tidak bosan.", sender: "trainer", time: "Yesterday", read: true },
        { id: 604, text: "MasyaAllah Ustadzah, semoga Allah mudahkan. Kalau begitu kapan kita bisa mulai? Saya ingin Alya segera kenal huruf-huruf hijaiyah.", sender: "user", time: "Yesterday", read: true },
        { id: 605, text: "Baik insyaAllah Sabtu pagi jam 09.00 kita mulai. Sampai jumpa!", sender: "trainer", time: "Yesterday", read: true },
    ],
}

const TRAINER_AUTO_REPLIES = [
    "Waalaikumussalam warahmatullah. Baik, pesan sudah saya terima. InsyaAllah saya jadwalkan.",
    "Alhamdulillah, terima kasih atas konfirmasinya. Sampai bertemu di sesi berikutnya ya!",
    "Siap, materi pembelajaran dan catatan evaluasi akan segera saya kirimkan ke sini.",
    "Barakallah fiik, tetap semangat terus dalam mempelajari dan menghafal Al-Qur'an ya!",
    "Baik, insyaAllah kita mulai tepat waktu sesuai jadwal yang sudah disepakati.",
]

export function MarketplaceChatPage() {
    const { locale } = useI18n()
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = useParams()
    
    const idFromPath = params?.id as string | undefined
    const initialId = idFromPath || searchParams.get('id')
    
    const [selectedId, setSelectedId] = useState<string | null>(initialId || null)
    const [inputText, setInputText] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isNewChatOpen, setIsNewChatOpen] = useState(false)
    const [senderRole, setSenderRole] = useState<"user" | "trainer">("user")
    const [autoReplyEnabled, setAutoReplyEnabled] = useState(true)

    const scrollRef = useRef<HTMLDivElement>(null)

    const [chatMessages, setChatMessages] = useState<Record<string, {
        id: number | string;
        text: string;
        sender: "user" | "trainer";
        time: string;
        read: boolean;
    }[]>>(DUMMY_MESSAGES_DATA)

    // Sync across tabs in real-time using BroadcastChannel and localStorage
    useEffect(() => {
        // 1. Initial load from localStorage
        try {
            const savedData = localStorage.getItem('mq_chat_history');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                setChatMessages(prev => ({
                    ...prev,
                    ...parsed
                }));
            }
        } catch (e) {}

        // 2. BroadcastChannel for instant real-time sync across open tabs
        let channel: BroadcastChannel | null = null;
        try {
            channel = new BroadcastChannel('qurani_chat_channel');
            channel.onmessage = (event) => {
                if (event.data?.type === 'SYNC_CHATS' && event.data?.payload) {
                    setChatMessages(event.data.payload);
                }
            };
        } catch (e) {}

        // 3. Storage event listener (standard browser cross-tab sync fallback)
        const handleStorage = (event: StorageEvent) => {
            if (event.key === 'mq_chat_history' && event.newValue) {
                try {
                    const parsed = JSON.parse(event.newValue);
                    setChatMessages(parsed);
                } catch (err) {}
            }
        };
        window.addEventListener('storage', handleStorage);

        return () => {
            channel?.close();
            window.removeEventListener('storage', handleStorage);
        };
    }, []);

    // Keep URL parameter synchronized
    useEffect(() => {
        if (idFromPath) {
            setSelectedId(idFromPath)
        }
    }, [idFromPath])

    const allTrainers = [...DUMMY_TRAINERS]
    const defaultSixIds = DUMMY_TRAINERS.slice(0, 6).map(dt => dt.id)
    const relevantTrainers = allTrainers.filter(t => 
        (chatMessages[t.id] && chatMessages[t.id].length > 0) ||
        defaultSixIds.includes(t.id) ||
        t.id === selectedId
    )

    const recentChats = relevantTrainers.map((trainer) => {
        const trainerMsgs = chatMessages[trainer.id] || []
        const lastMsgObj = trainerMsgs[trainerMsgs.length - 1]
        const unreadCount = trainerMsgs.filter(m => m.sender === "trainer" && !m.read).length
        const fullText = lastMsgObj ? lastMsgObj.text : "Belum ada pesan"
        const previewText = fullText.length > 38 ? fullText.slice(0, 38) + "..." : fullText

        return {
            id: trainer.id,
            name: trainer.name,
            avatar: trainer.avatar,
            lastMessage: previewText,
            time: lastMsgObj ? lastMsgObj.time : "",
            unread: unreadCount,
            online: ["1", "3", "6"].includes(trainer.id) || trainer.id === selectedId,
            lastMsgId: lastMsgObj ? Number(lastMsgObj.id) : 0
        }
    }).sort((a, b) => {
        if (a.lastMsgId > 10000 && b.lastMsgId > 10000) return b.lastMsgId - a.lastMsgId;
        if (a.lastMsgId > 10000) return -1;
        if (b.lastMsgId > 10000) return 1;
        return a.id.localeCompare(b.id, undefined, { numeric: true });
    })

    const filteredChats = recentChats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const activeChat = recentChats.find(c => c.id === selectedId)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [selectedId, chatMessages])

    const saveAndBroadcast = (updated: Record<string, any[]>) => {
        setChatMessages(updated);
        try {
            localStorage.setItem('mq_chat_history', JSON.stringify(updated));
            const channel = new BroadcastChannel('qurani_chat_channel');
            channel.postMessage({ type: 'SYNC_CHATS', payload: updated });
            channel.close();
        } catch (e) {}
    }

    const markAsRead = (chatId: string) => {
        if (!chatId) return
        setChatMessages(prev => {
            const hasUnread = (prev[chatId] || []).some(m => m.sender === "trainer" && !m.read)
            if (!hasUnread) return prev
            const updated = {
                ...prev,
                [chatId]: (prev[chatId] || []).map(msg =>
                    msg.sender === "trainer" && !msg.read ? { ...msg, read: true } : msg
                )
            };
            saveAndBroadcast(updated);
            return updated;
        })
    }

    const handleSend = () => {
        if (!inputText.trim() || !selectedId) return
        const currentId = selectedId
        const newMsgText = inputText.trim()
        const currentRole = senderRole
        
        const now = new Date()
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })

        const newMsg = {
            id: Date.now(),
            text: newMsgText,
            sender: currentRole,
            time: timeStr,
            read: currentRole === "user" ? false : true
        }

        setChatMessages(prev => {
            const updated = {
                ...prev,
                [currentId]: [...(prev[currentId] || []), newMsg]
            };
            saveAndBroadcast(updated);
            return updated;
        })

        setInputText("")

        // If user sent a message as "user" and auto-reply is on, simulate trainer reply after 1.5s
        if (currentRole === "user" && autoReplyEnabled) {
            setTimeout(() => {
                const replyText = TRAINER_AUTO_REPLIES[Math.floor(Math.random() * TRAINER_AUTO_REPLIES.length)]
                const replyMsg = {
                    id: Date.now() + 1,
                    text: replyText,
                    sender: "trainer" as const,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                    read: true
                }
                setChatMessages(prev => {
                    const withReply = {
                        ...prev,
                        [currentId]: [...(prev[currentId] || []), replyMsg]
                    };
                    saveAndBroadcast(withReply);
                    return withReply;
                })
            }, 1400)
        }
    }

    return (
        <div className="flex w-full h-[calc(100vh-64px)] bg-white overflow-hidden">
            {/* Left Column: Chats List */}
            <div className={cn(
                "w-full md:w-[320px] lg:w-[360px] border-r border-gray-100 bg-white flex flex-col shrink-0 transition-all duration-300 absolute md:relative z-20 h-full",
                !isSidebarOpen && "-translate-x-full md:translate-x-0 md:w-0"
            )}>
                {/* Header & Search */}
                <div className="p-5 pb-3 space-y-3.5 shrink-0">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Chats</h1>
                        <button
                            type="button"
                            onClick={() => setIsNewChatOpen(true)}
                            className="size-8 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200/80 flex items-center justify-center text-gray-600 transition cursor-pointer"
                            title="Mulai Chat Baru"
                        >
                            <Plus className="size-4.5 stroke-[2.5]" />
                        </button>
                    </div>

                    <div className="relative">
                        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Chats search..."
                            className="pl-10 pr-4 h-10 bg-gray-50/80 border border-gray-100 rounded-xl text-xs font-medium w-full text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition"
                        />
                    </div>
                </div>

                {/* Contact List */}
                <ScrollArea className="flex-1 overflow-x-hidden">
                    <div className="px-3 pb-4 space-y-0.5">
                        {filteredChats.map((chat) => {
                            const isSelected = selectedId === chat.id
                            return (
                                <button
                                    key={chat.id}
                                    onClick={() => {
                                        setSelectedId(chat.id)
                                        markAsRead(chat.id)
                                        if (window.innerWidth < 1024) setIsSidebarOpen(false)
                                        router.push(`/${locale || "en"}/chat/${chat.id}`, { scroll: false })
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 rounded-2xl transition-all relative text-left cursor-pointer",
                                        isSelected
                                            ? "bg-[#f1f5f9] text-gray-900 font-medium"
                                            : "hover:bg-gray-50/80 text-gray-700"
                                    )}
                                >
                                    {isSelected && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00875a] rounded-r-full" />
                                    )}

                                    <div className="relative shrink-0">
                                        <Avatar className="size-11 border border-gray-100 shadow-2xs">
                                            <AvatarImage src={chat.avatar} className="object-cover" />
                                            <AvatarFallback className="text-xs font-bold bg-emerald-100 text-emerald-800">
                                                {chat.name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        {chat.online && (
                                            <span className="absolute bottom-0 right-0 size-3 bg-[#00875a] border-2 border-white rounded-full shadow-2xs"></span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 pr-1">
                                        <div className="flex justify-between items-baseline mb-1 gap-1">
                                            <p className="font-semibold text-gray-900 truncate text-[13px]">
                                                {chat.name}
                                            </p>
                                            <span className="text-[10px] text-gray-400 font-medium shrink-0">
                                                {chat.time}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-2 overflow-hidden">
                                            <p className={cn(
                                                "text-xs truncate flex-1",
                                                chat.unread > 0 ? "text-gray-900 font-semibold" : "text-gray-500"
                                            )}>
                                                {chat.lastMessage}
                                            </p>
                                            {chat.unread > 0 && (
                                                <Badge className="h-4.5 min-w-[18px] px-1.5 bg-[#00875a] hover:bg-[#00875a] border-0 text-[10px] font-bold rounded-full text-white flex items-center justify-center shrink-0">
                                                    {chat.unread}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}

                        {filteredChats.length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-xs text-gray-400">Tidak ada percakapan ditemukan</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Right Column: Chat Conversation or Empty State */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden relative min-w-0">
                {selectedId && activeChat ? (
                    <>
                        {/* Conversation Header */}
                        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white z-10 shrink-0">
                            <div className="flex items-center gap-3 min-w-0">
                                <button
                                    type="button"
                                    className="md:hidden -ml-2 rounded-lg p-1.5 hover:bg-gray-100 text-gray-600 transition"
                                    onClick={() => setIsSidebarOpen(true)}
                                >
                                    <ChevronLeft className="size-5" />
                                </button>

                                <div className="relative shrink-0">
                                    <Avatar className="size-10 border border-gray-100">
                                        <AvatarImage src={activeChat.avatar} className="object-cover" />
                                        <AvatarFallback className="font-bold text-xs bg-emerald-100 text-emerald-800">
                                            {activeChat.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    {activeChat.online && (
                                        <span className="absolute bottom-0 right-0 size-2.5 bg-[#00875a] border-2 border-white rounded-full"></span>
                                    )}
                                </div>

                                <div className="flex flex-col min-w-0">
                                    <h2 className="font-bold text-gray-900 text-sm sm:text-base leading-tight truncate">
                                        {activeChat.name}
                                    </h2>
                                    <p className="text-[11px] text-[#00875a] font-medium">
                                        {activeChat.online ? "Online" : "Terakhir dilihat 2 jam yang lalu"}
                                    </p>
                                </div>
                            </div>

                            {/* Header Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                {/* Interactive 2-Tab Role Switcher */}
                                <Button variant="outline" size="icon" className="size-9 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">
                                    <Video className="size-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="size-9 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">
                                    <Phone className="size-4" />
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger className="size-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer border-0 bg-transparent p-0">
                                        <MoreHorizontal className="size-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-xl border-gray-100">
                                        <DropdownMenuItem className="rounded-lg py-2 cursor-pointer flex items-center gap-2 text-xs">
                                            <UserIcon className="size-4 text-gray-500" />
                                            <span>Lihat profil</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
                                            className="rounded-lg py-2 cursor-pointer flex items-center gap-2 text-xs"
                                        >
                                            <Sparkles className="size-4 text-amber-500" />
                                            <span>Balas Otomatis: {autoReplyEnabled ? "Aktif" : "Nonaktif"}</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="my-1 bg-gray-100" />
                                        <DropdownMenuItem
                                            onClick={() => {
                                                const resetData = { ...DUMMY_MESSAGES_DATA }
                                                saveAndBroadcast(resetData)
                                            }}
                                            className="rounded-lg py-2 cursor-pointer flex items-center gap-2 text-xs text-amber-600"
                                        >
                                            <RefreshCw className="size-4" />
                                            <span>Reset ke dummy</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Message Stream */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#f8fafc]/50 flex flex-col">
                            {(selectedId ? chatMessages[selectedId] || [] : []).map((msg) => {
                                const isUser = msg.sender === "user"
                                return (
                                    <div key={msg.id} className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
                                        <div className={cn("max-w-[85%] md:max-w-[65%] flex flex-col", isUser ? "items-end" : "items-start")}>
                                            <div className={cn("flex items-center gap-1.5 group/msg", isUser ? "flex-row-reverse" : "flex-row")}>
                                                <div className={cn(
                                                    "px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed transition-all break-words shadow-2xs",
                                                    isUser
                                                        ? "bg-[#00875a] text-white rounded-br-xs"
                                                        : "bg-white text-gray-800 rounded-bl-xs border border-gray-200/80"
                                                )}>
                                                    {msg.text}
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="size-7 rounded-full opacity-0 group-hover/msg:opacity-100 transition-opacity text-gray-400 hover:bg-gray-100 flex items-center justify-center cursor-pointer border-0 bg-transparent p-0">
                                                        <MoreHorizontal className="size-3.5" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align={isUser ? "end" : "start"} className="w-32 rounded-xl p-1 shadow-lg border-gray-100">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setChatMessages(prev => {
                                                                    const updated = {
                                                                        ...prev,
                                                                        [selectedId!]: (prev[selectedId!] || []).filter(m => m.id !== msg.id)
                                                                    };
                                                                    saveAndBroadcast(updated);
                                                                    return updated;
                                                                });
                                                            }}
                                                            className="rounded-lg py-1.5 cursor-pointer flex items-center gap-2 text-xs text-red-600"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                            <span>Hapus</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className={cn("flex items-center gap-1.5 mt-1 px-1", isUser ? "justify-end" : "justify-start")}>
                                                <span className="text-[10px] font-medium text-gray-400 uppercase">{msg.time}</span>
                                                {isUser && (
                                                    msg.read
                                                        ? <CheckCheck className="size-3.5 text-[#00875a]" />
                                                        : <Check className="size-3.5 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Input Footer */}
                        <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                            <div className="max-w-4xl mx-auto flex items-center gap-2 bg-gray-50/90 p-1.5 rounded-2xl border border-gray-200/80">
                                <div className="flex items-center text-gray-400">
                                    <button type="button" className="size-9 rounded-xl hover:bg-white flex items-center justify-center hover:text-gray-600 transition cursor-pointer">
                                        <Smile className="size-5" />
                                    </button>
                                    <button type="button" className="size-9 rounded-xl hover:bg-white flex items-center justify-center hover:text-gray-600 transition cursor-pointer">
                                        <Paperclip className="size-5" />
                                    </button>
                                    <button type="button" className="size-9 rounded-xl hover:bg-white flex items-center justify-center hover:text-gray-600 transition cursor-pointer">
                                        <Mic className="size-5" />
                                    </button>
                                </div>

                                <input
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            handleSend()
                                        }
                                    }}
                                    placeholder="Tuliskan pesan..."
                                    className="flex-1 bg-transparent border-none text-xs sm:text-sm text-gray-800 focus:outline-none placeholder:text-gray-400 px-2"
                                />

                                <button
                                    type="button"
                                    onClick={handleSend}
                                    disabled={!inputText.trim()}
                                    className={cn(
                                        "rounded-xl size-9 flex items-center justify-center transition-all cursor-pointer",
                                        inputText.trim()
                                            ? "bg-[#00875a] hover:bg-[#007a51] text-white shadow-xs"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    )}
                                >
                                    <Send className="size-4" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Empty State matching screenshot */
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-white select-none">
                        <div className="size-20 rounded-full bg-[#f8fafc] border border-gray-100 flex items-center justify-center mb-2 shadow-2xs">
                            <Archive className="size-9 text-gray-300" strokeWidth={1.5} />
                        </div>
                        <div className="max-w-sm space-y-2">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                                Belum ada pesan dipilih
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed max-w-[280px] mx-auto">
                                Pilih salah satu percakapan dari daftar di sebelah kiri untuk mulai membaca.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Dialog: Mulai Chat Baru */}
            <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
                <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6 border border-gray-100 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-gray-900">
                            Mulai Chat Baru
                        </DialogTitle>
                        <DialogDescription className="text-xs text-gray-500">
                            Pilih guru atau pengajar yang ingin Anda hubungi.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 max-h-[360px] overflow-y-auto py-2 pr-1">
                        {allTrainers.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setSelectedId(t.id)
                                    setIsNewChatOpen(false)
                                    router.push(`/${locale || "en"}/chat/${t.id}`, { scroll: false })
                                }}
                                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition border border-gray-100 text-left cursor-pointer"
                            >
                                <Avatar className="size-10 border border-gray-100">
                                    <AvatarImage src={t.avatar} className="object-cover" />
                                    <AvatarFallback className="font-bold text-xs bg-emerald-100 text-emerald-800">
                                        {t.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-gray-900 truncate">{t.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{t.specialization?.join(", ") || "Guru Al-Qur'an"}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
