const fs = require('fs');
const filePath = 'src/components/marketplace/orders/marketplace-orders-detail-page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add TrainerMediaPopup and lucide icons import
if (!content.includes('TrainerMediaPopup')) {
  content = `import { TrainerMediaPopup } from "@/components/marketplace/detail/trainer-media-popup"\n` + content;
}
if (!content.includes('UploadCloud')) {
  content = content.replace('X,', 'X,\n    UploadCloud,\n    Image as ImageIcon,\n    Eye,');
}

// 2. Add defaultMeetingProofPhotos and parseMeetingProofPhotos
if (!content.includes('defaultMeetingProofPhotos')) {
  const helpers = `
const defaultMeetingProofPhotos = [
    { type: "image", url: "https://i.pinimg.com/736x/76/94/71/76947128a9a73f4c5179595f419d5805.jpg", title: "Kelas Mengaji Intensif" },
    { type: "image", url: "https://i.pinimg.com/1200x/ed/1b/af/ed1baf2de9582f0b415dcf49e5d5bd7c.jpg", title: "Proses Mengajar Tahsin" },
    { type: "image", url: "https://i.pinimg.com/736x/40/b9/70/40b97054e5e5dba4bc74b9553c982b4d.jpg", title: "Bimbingan Tahfidz Anak" },
    { type: "image", url: "https://i.pinimg.com/736x/3e/44/e7/3e44e7cf3dbe8631d6ca66e26f434fb7.jpg", title: "Diskusi Tajwid & Makhraj" },
    { type: "image", url: "https://i.pinimg.com/1200x/e2/99/ac/e299acfa1cbb7ea1995ef172c21edfcb.jpg", title: "Sesi Belajar Kelompok" }
]

const parseMeetingProofPhotos = (uploadedPhoto: any) => {
    if (!uploadedPhoto) return defaultMeetingProofPhotos
    let photos: string[] = []
    if (typeof uploadedPhoto === "string") {
        try {
            const parsed = JSON.parse(uploadedPhoto)
            if (Array.isArray(parsed)) {
                photos = parsed.map(p => typeof p === "string" ? p : p?.url).filter(Boolean)
            } else {
                photos = [uploadedPhoto]
            }
        } catch {
            photos = [uploadedPhoto]
        }
    } else if (Array.isArray(uploadedPhoto)) {
        photos = uploadedPhoto.map(p => typeof p === "string" ? p : p?.url).filter(Boolean)
    }
    if (photos.length === 0 || (photos.length === 1 && photos[0] === "https://i.pinimg.com/736x/76/94/71/76947128a9a73f4c5179595f419d5805.jpg")) {
        return defaultMeetingProofPhotos
    }
    return photos.map((url, idx) => {
        const found = defaultMeetingProofPhotos.find(p => p.url === url)
        return {
            type: "image",
            url,
            title: found?.title || \`Bukti Pertemuan (\${idx + 1})\`
        }
    })
}
`;
  content = content.replace('const getSessionStatusConfig =', helpers + '\nconst getSessionStatusConfig =');
}

// 3. Add state previewItem
if (!content.includes('const [previewItem, setPreviewItem]')) {
  content = content.replace('const [isChatDialogOpen, setIsChatDialogOpen] = React.useState(false)', 'const [isChatDialogOpen, setIsChatDialogOpen] = React.useState(false)\n    const [previewItem, setPreviewItem] = React.useState<any>(null)');
}

// 4. Update sessionDetails for Pertemuan 1 with meetingPassword and meetingId
content = content.replace(
  '{ id: 1, title: "Pertemuan 1", status: "completed", date: "03 Jul 2026", time: "10:00", meetingPlatform: "Zoom", videoConferenceUrl: "https://zoom.us/j/123456789" },',
  '{ id: 1, title: "Pertemuan 1", status: "completed", date: "03 Jul 2026", time: "10:00", meetingPlatform: "Zoom", videoConferenceUrl: "https://zoom.us/j/1234567890", meetingPassword: "password123", meetingId: "123 456 7890" },'
);

// 5. Replace Dialog Detail Sesi
const dialogOldStart = content.indexOf('{/* ── DIALOG DETAIL SESI ── */}');
const dialogOldEnd = content.indexOf('{/* Lightbox Photo Preview */}', dialogOldStart);

if (dialogOldStart !== -1 && dialogOldEnd !== -1) {
  const newDialogCode = `{/* ── DIALOG DETAIL SESI ── */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="sm:max-w-4xl rounded-3xl border-none shadow-2xl p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh]">
                    <DialogHeader className="px-6 py-5 border-b border-gray-100 bg-white shrink-0 sticky top-0 z-10 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-gray-900 tracking-tight">
                                    {selectedDetailSession?.title || "Detail Pertemuan"}
                                </DialogTitle>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-xs font-semibold text-slate-600">
                                        {order?.orderId || (order?.id?.startsWith("ORD-") ? order.id : \`ORD-\${String(order?.id || "").replace(/\\D/g, "") || order?.id || "-"}\`)}
                                    </span>
                                    <Copy
                                        className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-emerald-500 transition-colors"
                                        onClick={() => {
                                            const idToCopy = order?.orderId || (order?.id?.startsWith("ORD-") ? order.id : \`ORD-\${String(order?.id || "").replace(/\\D/g, "") || order?.id || "-"}\`);
                                            navigator.clipboard.writeText(idToCopy);
                                            toast.success("ID Pesanan disalin!");
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={cn(
                            "px-2.5 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1.5 shadow-sm",
                            selectedDetailSession?.status === "completed" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                                selectedDetailSession?.status === "cancelled" ? "bg-red-50 border-red-200 text-red-600" :
                                    selectedDetailSession?.status === "ongoing" ? "bg-amber-50 border-amber-200 text-amber-700" :
                                        selectedDetailSession?.status === "no_show" ? "bg-red-50 border-red-200 text-red-700" :
                                            "bg-blue-50 border-blue-200 text-blue-700"
                        )}>
                            {selectedDetailSession?.status === "completed" ? (
                                <><CheckCircle2 className="w-3 h-3" /> Selesai</>
                            ) : selectedDetailSession?.status === "cancelled" ? (
                                <><XCircleIcon className="w-3 h-3" /> Dibatalkan</>
                            ) : selectedDetailSession?.status === "ongoing" ? (
                                <><Clock className="w-3 h-3" /> Berlangsung</>
                            ) : selectedDetailSession?.status === "no_show" ? (
                                <><XCircleIcon className="w-3 h-3" /> Tidak Hadir</>
                            ) : (
                                <><CalendarCheck className="w-3 h-3" /> Terjadwal</>
                            )}
                        </div>
                    </DialogHeader>

                    <div className="flex-1 min-h-0 overflow-y-auto p-6">
                        <div className={cn(
                            "grid gap-4",
                            selectedDetailSession?.status === "completed" || selectedDetailSession?.uploadedPhoto
                                ? "grid-cols-1 lg:grid-cols-2"
                                : "grid-cols-1"
                        )}>
                            {/* Kiri: Informasi Pesanan */}
                            <div className="flex flex-col gap-4">
                                <div className="rounded-xl border border-slate-200 p-5 space-y-4">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="w-4 h-4 text-emerald-600" />
                                            <h3 className="text-sm font-semibold text-gray-900">Informasi Pesanan</h3>
                                        </div>
                                        {selectedDetailSession?.isRescheduled && (
                                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                                                Reschedule
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-xs font-medium text-slate-500">Guru</span>
                                            <span className="text-xs font-medium text-slate-800">{order?.trainerName || "-"}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-xs font-medium text-slate-500">Paket</span>
                                            <span className="text-xs font-medium text-slate-800">{order?.packageName || "-"}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-xs font-medium text-slate-500">Tanggal</span>
                                            <span className="text-xs font-medium text-slate-800">{formatDisplayDate(selectedDetailSession?.date) || "-"}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-xs font-medium text-slate-500">Waktu</span>
                                            <span className="text-xs font-medium text-slate-800">{selectedDetailSession?.time ? formatSessionTime(selectedDetailSession.time) : "-"}</span>
                                        </div>
                                        <div className="flex justify-between items-start py-1">
                                            <span className="text-xs font-medium text-slate-500">Metode</span>
                                            <div className="flex flex-col items-end gap-0.5">
                                                <span className="text-xs font-medium text-emerald-600">
                                                    {order?.mode?.toLowerCase() === "offline" || order?.method?.toLowerCase() === "offline" ? "Offline" : "Online"}
                                                </span>
                                                {(order?.mode?.toLowerCase() === "offline" || order?.method?.toLowerCase() === "offline") && order?.offlineLocationType && (
                                                    <span className="text-[10px] font-medium text-slate-500">
                                                        {order.offlineLocationType === "student" ? "Guru datang ke murid" : "Murid datang ke guru"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {(order?.mode?.toLowerCase() === "offline" || order?.method?.toLowerCase() === "offline" || selectedDetailSession?.status === "scheduled" || selectedDetailSession?.status === "completed" || selectedDetailSession?.status === "ongoing" || selectedDetailSession?.status === "no_show") && (
                                            <>
                                                {order?.mode?.toLowerCase() !== "offline" && order?.method?.toLowerCase() !== "offline" ? (
                                                    <>
                                                        <div className="flex justify-between items-center py-1">
                                                            <span className="text-xs font-medium text-slate-500">Platform</span>
                                                            <span className="text-xs font-medium text-slate-800">
                                                                {selectedDetailSession?.meetingPlatform || teacherDefaults?.meetingPlatform || "Zoom"}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center py-1">
                                                            <span className="text-xs font-medium text-slate-500">URL</span>
                                                            <div className="flex items-center gap-1.5">
                                                                <a
                                                                    href={selectedDetailSession?.videoConferenceUrl || teacherDefaults?.videoConferenceUrl || "https://zoom.us/j/1234567890"}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-xs font-medium text-blue-600 hover:underline truncate max-w-[150px]"
                                                                >
                                                                    {selectedDetailSession?.videoConferenceUrl || teacherDefaults?.videoConferenceUrl || "https://zoom.us/j/1234567890"}
                                                                </a>
                                                                <button
                                                                    onClick={() => {
                                                                        const url = selectedDetailSession?.videoConferenceUrl || teacherDefaults?.videoConferenceUrl || "https://zoom.us/j/1234567890";
                                                                        navigator.clipboard.writeText(url);
                                                                        toast.success("URL berhasil disalin");
                                                                    }}
                                                                    className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors"
                                                                >
                                                                    <Copy className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center py-1">
                                                            <span className="text-xs font-medium text-slate-500">Password</span>
                                                            <span className="text-xs font-medium text-slate-800">
                                                                {selectedDetailSession?.meetingPassword || teacherDefaults?.meetingPassword || "password123"}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center py-1">
                                                            <span className="text-xs font-medium text-slate-500">ID Pertemuan</span>
                                                            <span className="text-xs font-medium text-slate-800">
                                                                {selectedDetailSession?.meetingId || teacherDefaults?.meetingId || "123 456 7890"}
                                                            </span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex justify-between items-start gap-4 py-1 pt-2">
                                                        <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Alamat</span>
                                                        <span className="text-xs font-medium text-slate-800 text-right max-w-[60%]">
                                                            {selectedDetailSession?.address || order?.address || order?.location || "Alamat disepakati secara privat."}
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {selectedDetailSession?.status === "no_show" && (
                                        <div className="pt-3 mt-3 border-t border-slate-100">
                                            <h4 className="text-xs font-semibold text-red-600 mb-1.5 flex items-center gap-1.5">
                                                <XCircleIcon className="w-3.5 h-3.5" /> Catatan Guru (Tidak Hadir)
                                            </h4>
                                            <div className="p-3 rounded-lg border bg-red-50/60 border-red-100 text-xs font-medium text-red-800">
                                                {selectedDetailSession?.notes || "Siswa tidak hadir pada waktu pertemuan yang telah dijadwalkan."}
                                            </div>
                                        </div>
                                    )}

                                    {selectedDetailSession?.status === "cancelled" && (
                                        <div className="pt-3 mt-3 border-t border-slate-100">
                                            <h4 className="text-xs font-semibold text-red-600 mb-1.5 flex items-center gap-1.5">
                                                <XCircleIcon className="w-3.5 h-3.5" /> Alasan Pembatalan (Murid)
                                            </h4>
                                            <div className="p-3 rounded-lg border bg-red-50/60 border-red-100 text-xs font-medium text-red-800">
                                                {selectedDetailSession?.cancellationReason || selectedDetailSession?.notes || "Dibatalkan oleh murid."}
                                            </div>
                                        </div>
                                    )}

                                    {selectedDetailSession?.isRescheduled && selectedDetailSession?.rescheduleReason && (
                                        <div className="pt-3 mt-3 border-t border-slate-100">
                                            <h4 className="text-xs font-medium text-slate-500 mb-2">Alasan Reschedule</h4>
                                            <div className="p-3 rounded-lg border bg-orange-50 border-orange-100 text-xs font-medium text-orange-800">
                                                {selectedDetailSession.rescheduleReason}
                                            </div>
                                        </div>
                                    )}

                                    {selectedDetailSession?.notes && selectedDetailSession?.status !== "no_show" && selectedDetailSession?.status !== "cancelled" && (
                                        <div className="pt-3 mt-3 border-t border-slate-100">
                                            <h4 className="text-xs font-medium text-slate-500 mb-2">Catatan Guru</h4>
                                            <div className="p-3 rounded-lg border bg-slate-50 border-slate-200 text-xs text-slate-700">
                                                {selectedDetailSession.notes}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Kanan: Bukti Pertemuan */}
                            {(selectedDetailSession?.status === "completed" || selectedDetailSession?.uploadedPhoto) && (
                                <div className="flex flex-col gap-4">
                                    <div className="rounded-xl border border-slate-200 p-5 space-y-4">
                                        {(() => {
                                            const proofPhotos = parseMeetingProofPhotos(selectedDetailSession?.uploadedPhoto)
                                            return (
                                                <>
                                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                                        <div className="flex items-center gap-2">
                                                            <UploadCloud className="w-4 h-4 text-blue-600" />
                                                            <h3 className="text-sm font-semibold text-gray-900">Bukti Pertemuan</h3>
                                                        </div>
                                                        {proofPhotos.length > 1 && (
                                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                                                {proofPhotos.length} Foto
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div
                                                            className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group hover:shadow-md transition-all duration-300 cursor-pointer mt-1"
                                                            onClick={() => {
                                                                setPreviewItem({
                                                                    type: "image",
                                                                    media: proofPhotos,
                                                                    images: proofPhotos.map(p => p.url),
                                                                    title: "Bukti Pertemuan"
                                                                })
                                                            }}
                                                        >
                                                            <div className="aspect-video relative">
                                                                <img
                                                                    src={proofPhotos[0].url}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                    alt="Bukti Pertemuan"
                                                                />
                                                                <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                                                    <ImageIcon className="w-3 h-3" />
                                                                    <span>{proofPhotos.length} Foto</span>
                                                                </div>
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 flex items-center justify-center transition-all">
                                                                    <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
                                                                        <Eye className="h-4 w-4 text-white" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-white shrink-0 flex justify-end gap-3">
                        <Button
                            onClick={() => setIsDetailDialogOpen(false)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-xl"
                        >
                            Kembali
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Media Lightbox Popup */}
            <TrainerMediaPopup previewItem={previewItem} setPreviewItem={setPreviewItem} />\n\n            `;
  content = content.substring(0, dialogOldStart) + newDialogCode + content.substring(dialogOldEnd);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated session detail dialog in marketplace-orders-detail-page.tsx');
