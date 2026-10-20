"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { StatusPengajuan, PengajuanStatus } from "./status-pengajuan";
import { SubmittedFormData } from "./form-register";
import { Loader2, GraduationCap, Settings, X } from "lucide-react";
import { toast } from "sonner";

export function PendingPageClient() {
  const router = useRouter();
  const [submittedData, setSubmittedData] = useState<SubmittedFormData | null>(null);
  const [status, setStatus] = useState<PengajuanStatus>("pending");
  const [isLoaded, setIsLoaded] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
  const [canceledAt, setCanceledAt] = useState<Date | null>(null);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [isCanceled, setIsCanceled] = useState<boolean>(false);
  const [isDevMenuOpen, setIsDevMenuOpen] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("teacher_form_data") || (typeof window !== "undefined" ? localStorage.getItem("teacher_form_data") : null);
    const savedStatus = (sessionStorage.getItem("teacher_status") || (typeof window !== "undefined" ? localStorage.getItem("teacher_status") : null)) as PengajuanStatus | null;
    const savedCancelReason = sessionStorage.getItem("teacher_cancel_reason") || (typeof window !== "undefined" ? localStorage.getItem("teacher_cancel_reason") : null);
    const savedCanceledAt = sessionStorage.getItem("teacher_canceled_at") || (typeof window !== "undefined" ? localStorage.getItem("teacher_canceled_at") : null);
    const savedIsCanceled = sessionStorage.getItem("teacher_is_canceled") === "true" || (typeof window !== "undefined" ? localStorage.getItem("teacher_is_canceled") === "true" : false);
    
    if (savedStatus) setStatus(savedStatus);
    if (savedCancelReason) setCancelReason(savedCancelReason);
    if (savedCanceledAt) setCanceledAt(new Date(savedCanceledAt));
    if (savedIsCanceled) setIsCanceled(true);

    if (data) {
      setSubmittedData(JSON.parse(data));
      setSubmittedAt(new Date()); 
    } else {
      setSubmittedData({
        formData: {
          headline: "Guru Ngaji",
          location: "Online",
          bio: "Mock Bio",
          categoryIds: ["1"],
          language: "id",
          expertise: [],
          hourlyRate: "0",
          currency: "IDR",
          experienceYears: "1",
          isOnline: true,
          isOffline: false,
        },
        certifications: [],
        portfolioItems: []
      });
      setSubmittedAt(new Date());
    }
    setIsLoaded(true);
  }, []);

  const handleCancelPengajuan = (reason: string) => {
    setCancelReason(reason);
    const now = new Date();
    setCanceledAt(now);
    setIsCanceled(true);
    // DO NOT change status, keep it as it is (pending)
    
    sessionStorage.setItem("teacher_cancel_reason", reason);
    sessionStorage.setItem("teacher_canceled_at", now.toISOString());
    sessionStorage.setItem("teacher_is_canceled", "true");
  };

  const handleDevStatusChange = (s: PengajuanStatus) => {
    setStatus(s);
    sessionStorage.setItem("teacher_status", s);
    // Optional: when changing dev status, we might want to reset the cancel state to simulate fresh state
    if (s !== "pending") {
       setIsCanceled(false);
       sessionStorage.setItem("teacher_is_canceled", "false");
    }

    if (s === "konfirmasi" || s === "jadwal_seleksi") {
      toast.success("Pengajuan Disetujui Admin!", {
        description: "Notifikasi jadwal wawancara telah berhasil dikirimkan ke email guru.",
      });
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] py-6 px-4 md:py-8 md:px-8 font-sans relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-100/30 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-100/20 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* Page Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pendaftaran Guru</h1>
          </div>
        </div>

        {/* Floating Dev Navigator (FAB) */}
        <div className="fixed bottom-6 right-6 z-50">
          <AnimatePresence>
            {isDevMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-16 right-0 mb-2 flex flex-col gap-1.5 p-2 bg-white rounded-2xl shadow-2xl border border-slate-200 w-40"
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase px-2 pt-1 pb-2 border-b border-slate-100 text-center mb-1">
                  Dev Status
                </div>
                {(["pending", "konfirmasi", "ditolak_pengajuan", "diterima", "ditolak_seleksi"] as PengajuanStatus[]).map((s) => {
                  const label = s === "ditolak_pengajuan" ? "Pengajuan Ditolak" 
                              : s === "konfirmasi" ? "Pengajuan Diterima" 
                              : s === "diterima" ? "Seleksi Diterima"
                              : s === "ditolak_seleksi" ? "Seleksi Gagal"
                              : s.replace("_", " ");
                  return (
                  <button
                    key={s}
                    onClick={() => {
                      handleDevStatusChange(s);
                      setIsDevMenuOpen(false);
                    }}
                    className={`px-3 py-2 text-[11px] font-bold rounded-xl capitalize transition-all text-left ${
                      status === s 
                        ? "bg-emerald-50 text-emerald-700" 
                        : "bg-transparent text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </button>
                )})}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsDevMenuOpen(!isDevMenuOpen)}
            className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-slate-800 transition-colors"
          >
            {isDevMenuOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {submittedData && (
              <StatusPengajuan
                status={status}
                submittedData={submittedData}
                onCancelPengajuan={handleCancelPengajuan}
                submittedAt={submittedAt || undefined}
                canceledAt={canceledAt || undefined}
                cancelReason={cancelReason}
                isCanceled={isCanceled}
                rejectionReason={
                  status === 'ditolak_pengajuan'
                    ? "Data pengalaman mengajar belum memenuhi kualifikasi awal."
                    : status === 'ditolak_seleksi'
                    ? "Kemampuan Tahfidz belum memenuhi standar seleksi."
                    : "Kualifikasi tidak memenuhi standar minimal kami."
                }
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
