"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, Maximize2, Send, Paperclip,
    MessageSquare, ShieldCheck, CheckCheck, Check, Clock,
    Smile, Mic, Image as ImageIcon, StickyNote, ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ChatDialogProps {
    trainer: {
        id: string
        name: string
        avatar: string
    }
    locale: string
    isOpen: boolean
    onClose: () => void
}

export function ChatDialog({ trainer, locale, isOpen, onClose }: ChatDialogProps) {
    const router = useRouter()
    const [messages, setMessages] = useState<{
        id: string
        text: string
        sender: "user" | "trainer" | "system"
        time: string
        read: boolean
    }[]>([
        {
            id: "sys-1",
            text: `Anda terhubung dengan ${trainer.name}. Mulailah percakapan dengan sopan.`,
            sender: "system",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: true
        }
    ])
    const [inputText, setInputText] = useState("Assalamualaikum, saya ingin bertanya mengenai program belajar yang tersedia.")
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOpen])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, onClose])

    const handleSend = () => {
        if (!inputText.trim()) return

        const newMessage = {
            id: Date.now().toString(),
            text: inputText,
            sender: "user" as const,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
        }

        setMessages([...messages, newMessage])
        setInputText("")
    }

    const handleExpand = () => {
        router.push(`/${locale}/chat?id=${trainer.id}`)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[9998]"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[95%] max-w-[420px] h-[85vh] max-h-[850px] bg-white dark:bg-slate-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] rounded-[32px] border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10 transition-colors">
                            <div className="flex items-center gap-3.5">
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onClose}>
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <div className="relative">
                                    <Avatar className="h-11 w-11 shadow-sm border border-slate-100 dark:border-slate-700">
                                        <AvatarImage src={trainer.avatar} className="object-cover" />
                                        <AvatarFallback className="bg-emerald-50 text-emerald-700 text-lg font-black">{trainer.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-black text-slate-900 dark:text-white leading-tight">
                                        {trainer.name}
                                    </span>
                                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                        Online
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={handleExpand}>
                                    <Maximize2 className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onClose}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Body */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/20 custom-scrollbar">
                            <div className="flex justify-center mb-5 mx-auto max-w-[90%]">
                                <div className="bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-xl px-4 py-3 text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-3 shadow-sm text-left w-full">
                                    <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-500" />
                                    <span className="font-semibold leading-snug">
                                        Demi keamanan, Jangan melakukan transaksi di luar aplikasi.
                                    </span>
                                </div>
                            </div>

                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex w-full",
                                        msg.sender === "user" ? "justify-end" : "justify-start",
                                        msg.sender === "system" && "justify-center"
                                    )}
                                >
                                    {msg.sender === "system" ? (
                                        <span className="text-[11px] text-slate-400 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-1.5 rounded-full font-bold border border-slate-100 dark:border-slate-700">
                                            {msg.text}
                                        </span>
                                    ) : (
                                        <div
                                            className={cn(
                                                "max-w-[85%] rounded-[24px] px-5 py-3.5 shadow-sm text-sm font-medium",
                                                msg.sender === "user"
                                                    ? "bg-emerald-600 text-white rounded-br-none shadow-emerald-100 dark:shadow-none"
                                                    : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-slate-100 dark:shadow-none"
                                            )}
                                        >
                                            <p className="leading-relaxed">{msg.text}</p>
                                            <div className={cn(
                                                "flex items-center gap-1.5 text-[10px] mt-1.5 opacity-60",
                                                msg.sender === "user" ? "justify-end text-white" : "justify-start text-slate-400"
                                            )}>
                                                {msg.time}
                                                {msg.sender === "user" && (
                                                    msg.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-2xl">
                            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-[28px] p-2 flex items-center gap-1.5 transition-all focus-within:bg-slate-50 dark:focus-within:bg-slate-800 border-2 border-transparent focus-within:border-ring">
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-600 shrink-0 transition-all">
                                    <Smile className="h-6 w-6" />
                                </Button>
                                <Input
                                    placeholder="Ketik pesan..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    className="h-10 text-sm bg-transparent border-none text-slate-900 dark:text-white focus-visible:ring-0 placeholder:text-slate-400 font-bold"
                                />
                                {inputText.trim() ? (
                                    <Button
                                        size="icon"
                                        onClick={handleSend}
                                        className="h-full w-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shrink-0 transition-transform active:scale-90"
                                    >
                                        <Send className="h-5 w-5 ml-0.5" />
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-0.5 px-1">
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-600 shrink-0">
                                            <Mic className="h-6 w-6" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-600 shrink-0">
                                            <ImageIcon className="h-6 w-6" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-600 shrink-0">
                                            <StickyNote className="h-6 w-6" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-600 shrink-0">
                                            <Paperclip className="h-6 w-6" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
