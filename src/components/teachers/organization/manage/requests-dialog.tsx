"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    CheckCircle2,
    XCircle,
    Loader2,
    RotateCcw,
    LogOut,
    UserCheck,
} from "lucide-react"
import { type Trainer } from "@/data/trainers-data"
import { getInitials } from "@/utils/helpers/get-initials"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// Accept Dialog
// ─────────────────────────────────────────────

export interface AcceptDialogProps {
    open: boolean
    onOpenChange: (v: boolean) => void
    trainer: Trainer | null
    isProcessing: boolean
    onConfirm: (note: string) => void
}

export function AcceptTeacherDialog({
    open,
    onOpenChange,
    trainer,
    isProcessing,
    onConfirm,
}: AcceptDialogProps) {
    const [note, setNote] = useState("")

    const handleConfirm = () => { onConfirm(note); setNote("") }
    const handleClose = () => { setNote(""); onOpenChange(false) }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-sm rounded-2xl border-none shadow-2xl bg-white p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-5 pb-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <DialogTitle className="text-base font-bold text-slate-900 leading-none">
                            Terima Guru?
                        </DialogTitle>
                    </div>
                </DialogHeader>
                <div className="px-6 pt-2 pb-4 space-y-4">
                    <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                        Setelah disetujui, sistem akan otomatis mengirimkan email notifikasi jadwal wawancara ke alamat email calon guru.
                    </p>
                    {trainer && (
                        <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                            <div className="w-10 h-10 rounded-full bg-emerald-100/80 flex-shrink-0 relative overflow-hidden">
                                {trainer.avatar
                                    ? <img src={trainer.avatar} alt="avatar" className="object-cover w-full h-full" />
                                    : <div className="w-full h-full flex items-center justify-center"><UserCheck className="w-5 h-5 text-emerald-600" /></div>
                                }
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-[13px] font-bold text-slate-800 uppercase">{trainer.name}</h4>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Calon Guru Organisasi</p>
                            </div>
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                            Catatan <span className="text-slate-400 font-medium normal-case tracking-normal">(opsional)</span>
                        </Label>
                        <Textarea
                            placeholder="Tambahkan catatan untuk guru ini, misal: penempatan kelas, jadwal orientasi, dll..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="min-h-[90px] rounded-xl border border-emerald-200 focus:border-emerald-400 bg-white text-sm p-3 resize-none transition-all"
                        />
                    </div>
                </div>
                <DialogFooter className="px-6 pb-6 pt-2 gap-2">
                    <Button
                        variant="outline"
                        className="h-10 px-5 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-sm"
                        onClick={handleClose}
                        disabled={isProcessing}
                    >
                        Batal
                    </Button>
                    <Button
                        className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-100 transition-all active:scale-[0.98] flex items-center gap-2 text-sm"
                        onClick={handleConfirm}
                        disabled={isProcessing}
                    >
                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Terima
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─────────────────────────────────────────────
// Reject Dialog
// ─────────────────────────────────────────────

export interface RejectDialogProps {
    open: boolean
    onOpenChange: (v: boolean) => void
    trainer: Trainer | null
    isProcessing: boolean
    onConfirm: (reason: string, note: string) => void
}

const REJECT_REASONS = [
    "Tidak memenuhi kriteria",
    "Kuota guru penuh",
    "Dokumen tidak lengkap",
    "Lainnya",
]

export function RejectTeacherDialog({
    open,
    onOpenChange,
    trainer,
    isProcessing,
    onConfirm,
}: RejectDialogProps) {
    const [reason, setReason] = useState<string>("")
    const [note, setNote] = useState("")

    const handleConfirm = () => {
        if (!reason) { toast.error("Harap pilih alasan penolakan terlebih dahulu."); return }
        onConfirm(reason, note); setReason(""); setNote("")
    }
    const handleClose = () => { setReason(""); setNote(""); onOpenChange(false) }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[480px] border-none shadow-2xl rounded-2xl p-0 overflow-hidden bg-white flex flex-col max-h-[90vh]">
                <div className="px-7 pt-7 pb-4 flex-shrink-0">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                            <XCircle className="w-7 h-7 text-rose-600" />
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-xl font-bold text-slate-900 leading-tight">Tolak Guru?</DialogTitle>
                            <DialogDescription className="text-sm font-medium text-slate-500">
                                Pilih alasan penolakan untuk memberitahu calon guru.
                            </DialogDescription>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-7 pb-2">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-bold text-slate-600">Alasan Penolakan</Label>
                            <span className="text-[10px] bg-rose-50 text-rose-500 border border-rose-100 px-2 py-0.5 rounded-full font-bold">Wajib</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {REJECT_REASONS.map((r) => (
                                <div
                                    key={r}
                                    onClick={() => { setReason(r); if (r !== "Lainnya") setNote("") }}
                                    className={`flex items-center space-x-3 p-3.5 rounded-xl border transition-all cursor-pointer ${reason === r ? "border-rose-200 bg-rose-50/40 shadow-sm" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"}`}
                                >
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${reason === r ? "border-rose-500 bg-rose-500" : "border-slate-300"}`}>
                                        {reason === r && <CheckCircle2 className="w-3 h-3 text-white stroke-[3]" />}
                                    </div>
                                    <span className={`text-sm font-semibold transition-colors ${reason === r ? "text-rose-700" : "text-slate-600"}`}>{r}</span>
                                </div>
                            ))}
                        </div>
                        {reason === "Lainnya" && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                <Label className="text-xs font-bold text-rose-600 uppercase tracking-wide">
                                    Tulis Alasan Lainnya <span className="text-rose-400">*</span>
                                </Label>
                                <Textarea
                                    placeholder="Jelaskan alasan penolakan secara spesifik..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="min-h-[90px] rounded-xl border border-rose-200 focus:border-rose-400 bg-rose-50/30 text-sm p-3 resize-none transition-all"
                                    autoFocus
                                />
                            </div>
                        )}
                        {reason && reason !== "Lainnya" && (
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    Catatan Tambahan <span className="text-slate-400 font-medium normal-case tracking-normal">(opsional)</span>
                                </Label>
                                <Textarea
                                    placeholder="Catatan tambahan untuk calon guru ini..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="min-h-[90px] rounded-xl border border-slate-200 focus:border-rose-400 bg-white text-sm p-3 resize-none transition-all"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-3 px-7 py-5 border-t border-slate-100 flex-shrink-0">
                    <Button
                        variant="outline"
                        className="h-10 px-5 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-sm"
                        onClick={handleClose}
                        disabled={isProcessing}
                    >
                        Batal
                    </Button>
                    <Button
                        className="h-10 px-6 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-md shadow-rose-100 transition-all active:scale-[0.98] flex items-center gap-2 text-sm"
                        onClick={handleConfirm}
                        disabled={isProcessing || !reason || (reason === "Lainnya" && !note.trim())}
                    >
                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Tolak
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─────────────────────────────────────────────
// Restore Dialog
// ─────────────────────────────────────────────

export interface RestoreDialogProps {
    open: boolean
    onOpenChange: (v: boolean) => void
    trainer: Trainer | null
    isProcessing: boolean
    onConfirm: () => void
}

export function RestoreTeacherDialog({
    open,
    onOpenChange,
    trainer,
    isProcessing,
    onConfirm,
}: RestoreDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm rounded-2xl border-none shadow-2xl bg-white p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-5 pb-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <RotateCcw className="w-5 h-5 text-emerald-500" />
                        </div>
                        <DialogTitle className="text-base font-bold text-slate-900 leading-none">
                            Kembalikan Pengajuan?
                        </DialogTitle>
                    </div>
                </DialogHeader>
                <div className="px-6 pt-2 pb-4 space-y-4">
                    <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                        Status pengajuan guru ini akan dikembalikan ke{" "}
                        <span className="font-bold text-emerald-600">Menunggu</span>. Admin dapat meninjau dan memutuskan kembali.
                    </p>
                    {trainer && (
                        <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/70">
                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                {trainer.avatar
                                    ? <img src={trainer.avatar} alt="avatar" className="object-cover w-full h-full" />
                                    : <div className="w-full h-full bg-emerald-100 flex items-center justify-center"><span className="text-emerald-600 font-bold text-xs">{getInitials(trainer.name)}</span></div>
                                }
                            </div>
                            <div>
                                <h4 className="text-[13px] font-bold text-slate-800">{trainer.name}</h4>
                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">Status saat ini: Ditolak</p>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter className="px-6 pb-6 pt-2 gap-2">
                    <Button
                        variant="outline"
                        className="h-10 px-5 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-sm"
                        onClick={() => onOpenChange(false)}
                        disabled={isProcessing}
                    >
                        Batal
                    </Button>
                    <Button
                        className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-100 transition-all active:scale-[0.98] flex items-center gap-2 text-sm"
                        onClick={onConfirm}
                        disabled={isProcessing}
                    >
                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                        Kembalikan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─────────────────────────────────────────────
// Remove Dialog
// ─────────────────────────────────────────────

export interface RemoveDialogProps {
    open: boolean
    onOpenChange: (v: boolean) => void
    trainer: Trainer | null
    isProcessing: boolean
    onConfirm: (reason: string, note: string) => void
}

const REMOVE_REASONS = [
    "Kinerja tidak memenuhi standar",
    "Melanggar peraturan organisasi",
    "Mengundurkan diri",
    "Kontrak berakhir",
    "Lainnya",
]

export function RemoveTeacherDialog({
    open,
    onOpenChange,
    trainer,
    isProcessing,
    onConfirm,
}: RemoveDialogProps) {
    const [reason, setReason] = useState<string>("")
    const [note, setNote] = useState("")

    const handleConfirm = () => {
        if (!reason) { toast.error("Harap pilih alasan pengeluaran terlebih dahulu."); return }
        onConfirm(reason, note); setReason(""); setNote("")
    }
    const handleClose = () => { setReason(""); setNote(""); onOpenChange(false) }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[480px] border-none shadow-2xl rounded-2xl p-0 overflow-hidden bg-white flex flex-col max-h-[90vh]">
                <div className="px-7 pt-7 pb-4 flex-shrink-0">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <LogOut className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-xl font-bold text-slate-900 leading-tight">Keluarkan Guru?</DialogTitle>
                            <DialogDescription className="text-sm font-medium text-slate-500">
                                Guru ini akan dikeluarkan dari keanggotaan organisasi Anda.
                            </DialogDescription>
                        </div>
                    </div>
                    {trainer && (
                        <div className="flex items-center gap-3 p-3 bg-red-50/60 rounded-xl border border-red-100/70 mt-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                {trainer.avatar
                                    ? <img src={trainer.avatar} alt="avatar" className="object-cover w-full h-full" />
                                    : <div className="w-full h-full bg-red-100 flex items-center justify-center"><span className="text-red-600 font-bold text-xs">{getInitials(trainer.name)}</span></div>
                                }
                            </div>
                            <div>
                                <h4 className="text-[13px] font-bold text-slate-800">{trainer.name}</h4>
                                <p className="text-[10px] text-red-600 font-bold uppercase tracking-wide">Anggota Organisasi</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto px-7 pb-2">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-bold text-slate-600">Alasan Pengeluaran</Label>
                            <span className="text-[10px] bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded-full font-bold">Wajib</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {REMOVE_REASONS.map((r) => (
                                <div
                                    key={r}
                                    onClick={() => { setReason(r); if (r !== "Lainnya") setNote("") }}
                                    className={`flex items-center space-x-3 p-3.5 rounded-xl border transition-all cursor-pointer ${reason === r ? "border-red-200 bg-red-50/50 shadow-sm" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"}`}
                                >
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${reason === r ? "border-red-500 bg-red-500" : "border-slate-300"}`}>
                                        {reason === r && <CheckCircle2 className="w-3 h-3 text-white stroke-[3]" />}
                                    </div>
                                    <span className={`text-sm font-semibold transition-colors ${reason === r ? "text-red-700" : "text-slate-600"}`}>{r}</span>
                                </div>
                            ))}
                        </div>
                        {reason === "Lainnya" && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                <Label className="text-xs font-bold text-red-600 uppercase tracking-wide">
                                    Tulis Alasan Lainnya <span className="text-red-400">*</span>
                                </Label>
                                <Textarea
                                    placeholder="Jelaskan alasan pengeluaran secara spesifik..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="min-h-[90px] rounded-xl border border-red-200 focus:border-red-400 bg-red-50/30 text-sm p-3 resize-none transition-all"
                                    autoFocus
                                />
                            </div>
                        )}
                        {reason && reason !== "Lainnya" && (
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    Catatan <span className="text-slate-400 font-medium normal-case tracking-normal">(opsional)</span>
                                </Label>
                                <Textarea
                                    placeholder="Catatan tambahan untuk guru yang dikeluarkan..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="min-h-[80px] rounded-xl border border-slate-200 focus:border-red-300 bg-white text-sm p-3 resize-none transition-all"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-3 px-7 py-5 border-t border-slate-100 flex-shrink-0">
                    <Button
                        variant="outline"
                        className="h-10 px-5 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-sm"
                        onClick={handleClose}
                        disabled={isProcessing}
                    >
                        Batal
                    </Button>
                    <Button
                        className="h-10 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-100 transition-all active:scale-[0.98] flex items-center gap-2 text-sm"
                        onClick={handleConfirm}
                        disabled={isProcessing || !reason || (reason === "Lainnya" && !note.trim())}
                    >
                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                        Keluarkan
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}