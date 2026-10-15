"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Calendar, Clock, Video, Link2, Users, FileText,
    CheckCircle2, CalendarClock, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// ─── Shared Schedule Content ──────────────────────────────────────────────────
// Komponen ini dipakai bersama di halaman Konfirmasi maupun Reschedule
function JadwalDetail() {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                    <span className="text-[12px] font-semibold text-slate-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Tanggal
                    </span>
                    <div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-center text-slate-700">
                        Minggu, 12 Juli 2026
                    </div>
                </div>
                <div className="space-y-2">
                    <span className="text-[12px] font-semibold text-slate-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" /> Waktu
                    </span>
                    <div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-center text-slate-700">
                        12.00 – 13.00 WIB
                    </div>
                </div>
            </div>

            <Separator className="bg-slate-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                    <span className="text-[12px] font-semibold text-slate-700 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-500" /> Tim Penyeleksi
                    </span>
                    <div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-center text-slate-700">
                        Hamid Al-Hafidz
                    </div>
                </div>
                <div className="space-y-2">
                    <span className="text-[12px] font-semibold text-slate-700 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-emerald-500" /> Metode
                    </span>
                    <div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-center text-slate-700">
                        Online (Zoom / Google Meet)
                    </div>
                </div>
            </div>

            <Separator className="bg-slate-100" />

            <div className="space-y-2">
                <span className="text-[12px] font-semibold text-slate-700 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-emerald-500" /> Link Pertemuan
                </span>
                <div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-center text-slate-700">
                    <a
                        href="#"
                        className="text-emerald-600 hover:text-emerald-700 hover:underline break-all block"
                    >
                        https://us05web.zoom.us/j/8286064247?pwd=CWNog9Kh0E96B6LYRS0NMerOuOqPQW.1
                    </a>
                </div>
            </div>

            <Separator className="bg-slate-100" />

            <div className="space-y-2">
                <span className="text-[12px] font-semibold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-500" /> Catatan Persiapan
                </span>
                <div className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm whitespace-pre-wrap min-h-[80px] text-slate-700 italic">
                    &quot;Persiapkan untuk hafalanmu selama ini karena nanti saya akan pilih acak untuk tes seleksi&quot;
                </div>
            </div>
        </div>
    );
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface KonfirmasiSeleksiProps {
    /** "konfirmasi" = halaman konfirmasi kehadiran | "reschedule" = halaman reschedule */
    mode: "konfirmasi" | "reschedule";
    onConfirm?: () => void;
    onReschedule?: (reason: string) => void;
    isConfirmed?: boolean;
    isRescheduled?: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function KonfirmasiSeleksi({ mode, onConfirm, onReschedule, isConfirmed, isRescheduled }: KonfirmasiSeleksiProps) {
    const [showDialog, setShowDialog] = useState(false);
    const [dialogType, setDialogType] = useState<"confirm" | "reschedule">("confirm");
    const [selectedRescheduleReason, setSelectedRescheduleReason] = useState<string>("");
    const [rescheduleReason, setRescheduleReason] = useState("");
    const [internalIsDone, setInternalIsDone] = useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const isDone = (mode === "konfirmasi" && isConfirmed) || (mode === "reschedule" && isRescheduled) || internalIsDone;

    // ── Halaman Konfirmasi ─────────────────────────────────────────────────
    if (mode === "konfirmasi") {
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="bg-white border-slate-200/80 shadow-sm p-5 md:p-6 gap-4 space-y-0 flex flex-col">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-800">Jadwal Seleksi</h3>
                    </div>

                    {/* Shared content */}
                    <div>
                        <JadwalDetail />
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                        {isDone ? (
                            <Button disabled className="font-semibold bg-emerald-600 text-white opacity-80">
                                {isConfirmed ? "Kehadiran Terkonfirmasi" : isRescheduled || dialogType === "reschedule" ? "Reschedule Terkirim" : "Terkonfirmasi"}
                            </Button>
                        ) : (
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setDialogType("reschedule");
                                        setShowDialog(true);
                                    }}
                                >
                                    Jadwal Ulang
                                </Button>
                                <Button
                                    onClick={() => {
                                        setDialogType("confirm");
                                        setShowDialog(true);
                                    }}
                                    className="font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    Konfirmasi
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Popup Konfirmasi */}
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent className={dialogType === "confirm" ? "sm:max-w-sm" : "sm:max-w-md"} onOpenAutoFocus={(e) => e.preventDefault()}>
                        <DialogHeader>
                            <DialogTitle>
                                {dialogType === "confirm" ? "Konfirmasi Kehadiran" : "Ajukan Reschedule Jadwal?"}
                            </DialogTitle>
                        </DialogHeader>
                        {dialogType === "confirm" ? (
                            <div className="py-2">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Apakah Anda yakin dapat hadir pada jadwal seleksi berikut?
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 py-2">
                                <p className="text-[13px] text-slate-500">
                                    Pilih alasan pengajuan jadwal ulang untuk memberitahu kami.
                                </p>
                                <div className="flex items-center justify-between">
                                    <Label className="text-[12px] font-bold text-slate-700">Alasan Jadwal Ulang</Label>
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">Wajib</span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {[
                                        "Ada keperluan mendadak",
                                        "Jadwal berbenturan dengan kegiatan lain",
                                        "Kendala transportasi atau perjalanan",
                                        "Kendala teknis untuk seleksi online",
                                        "Lainnya"
                                    ].map((reason) => {
                                        const isSelected = selectedRescheduleReason === reason;
                                        return (
                                            <div
                                                key={reason}
                                                className={cn(
                                                    "flex items-center space-x-3 rounded-xl border p-4 transition-colors cursor-pointer",
                                                    isSelected ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 hover:bg-slate-50"
                                                )}
                                                onClick={() => {
                                                    setSelectedRescheduleReason(reason);
                                                    if (reason === "Lainnya") {
                                                        setTimeout(() => textareaRef.current?.focus(), 50);
                                                    }
                                                }}
                                            >
                                                <div className={cn(
                                                    "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border",
                                                    isSelected ? "bg-emerald-500 border-emerald-500" : "border-slate-300 bg-transparent"
                                                )}>
                                                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                                                </div>
                                                <span className={cn("text-[13px] font-medium w-full", isSelected ? "text-emerald-700" : "text-slate-700")}>
                                                    {reason}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {selectedRescheduleReason === "Lainnya" && (
                                    <Textarea
                                        ref={textareaRef}
                                        placeholder="Tuliskan alasan lainnya..."
                                        value={rescheduleReason}
                                        onChange={(e) => setRescheduleReason(e.target.value)}
                                        className="resize-none min-h-[80px] text-[13px]"
                                    />
                                )}
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowDialog(false)}>
                                {dialogType === "confirm" ? "Kembali" : "Batal"}
                            </Button>
                            {dialogType === "confirm" ? (
                                <Button
                                    onClick={() => {
                                        setShowDialog(false);
                                        setInternalIsDone(true);
                                        onConfirm?.();
                                        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                >
                                    Hadir
                                </Button>
                            ) : (
                                <Button
                                    disabled={!selectedRescheduleReason || (selectedRescheduleReason === "Lainnya" && !rescheduleReason.trim())}
                                    onClick={() => {
                                        setShowDialog(false);
                                        setInternalIsDone(true);
                                        const finalReason = selectedRescheduleReason === "Lainnya" ? rescheduleReason : selectedRescheduleReason;
                                        onReschedule?.(finalReason);
                                        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                >
                                    Kirim
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </motion.div>
        );
    }

    // ── Halaman Reschedule ─────────────────────────────────────────────────
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="bg-white border-slate-200/80 shadow-sm p-5 md:p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-800">Jadwal Seleksi</h3>
                </div>

                {/* Shared content */}
                <div>
                    <JadwalDetail />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                    {isDone ? (
                        <Button disabled className="font-semibold bg-emerald-600 text-white opacity-80">
                            Reschedule Terkirim
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setShowDialog(true)}
                            variant="outline"
                        >
                            Jadwal Ulang
                        </Button>
                    )}
                </div>
            </Card>

            {/* Popup Reschedule */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>
                            Ajukan Reschedule Jadwal?
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-2">
                        <p className="text-[13px] text-slate-500">
                            Pilih alasan pengajuan jadwal ulang untuk memberitahu kami.
                        </p>
                        <div className="flex items-center justify-between">
                            <Label className="text-[12px] font-bold text-slate-700">Alasan Jadwal Ulang</Label>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">Wajib</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                "Ada keperluan mendadak",
                                "Jadwal berbenturan dengan kegiatan lain",
                                "Kendala transportasi atau perjalanan",
                                "Kendala teknis untuk seleksi online",
                                "Lainnya"
                            ].map((reason) => {
                                const isSelected = selectedRescheduleReason === reason;
                                return (
                                    <div
                                        key={reason}
                                        className={cn(
                                            "flex items-center space-x-3 rounded-xl border p-4 transition-colors cursor-pointer",
                                            isSelected ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 hover:bg-slate-50"
                                        )}
                                        onClick={() => {
                                            setSelectedRescheduleReason(reason);
                                            if (reason === "Lainnya") {
                                                setTimeout(() => textareaRef.current?.focus(), 50);
                                            }
                                        }}
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border",
                                            isSelected ? "bg-emerald-500 border-emerald-500" : "border-slate-300 bg-transparent"
                                        )}>
                                            {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                                        </div>
                                        <span className={cn("text-[13px] font-medium w-full", isSelected ? "text-emerald-700" : "text-slate-700")}>
                                            {reason}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {selectedRescheduleReason === "Lainnya" && (
                            <Textarea
                                ref={textareaRef}
                                placeholder="Tuliskan alasan lainnya..."
                                value={rescheduleReason}
                                onChange={(e) => setRescheduleReason(e.target.value)}
                                className="resize-none min-h-[80px] text-[13px]"
                            />
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDialog(false)}>
                            Batal
                        </Button>
                        <Button
                            disabled={!selectedRescheduleReason || (selectedRescheduleReason === "Lainnya" && !rescheduleReason.trim())}
                            onClick={() => {
                                setShowDialog(false);
                                setInternalIsDone(true);
                                const finalReason = selectedRescheduleReason === "Lainnya" ? rescheduleReason : selectedRescheduleReason;
                                onReschedule?.(finalReason);
                                setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                            Kirim
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
