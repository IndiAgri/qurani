import React, { useState } from "react";
import { FileText, Award, MapPin, Video, ExternalLink } from "lucide-react";
import { TrainerMediaPopup } from "@/components/marketplace/detail/trainer-media-popup";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface EvaluationData {
  nama: string;
  email: string;
  tanggal: string;
  waktu: string;
  metode: string;
  penguji: string;
  spesialisasiPenguji: string;
  nilai: {
    kelancaran: number;
    tajwid: number;
    intonasi: number;
    penampilan: number;
    pengalaman: number;
  };
  rekomendasi: string;
  dokumentasiUrl?: string;
}

const mockData: EvaluationData = {
  nama: "Ahmad Syarif",
  email: "syarif@example.com",
  tanggal: "Minggu, 12 Juli 2026",
  waktu: "12.00 - 13.00 WIB",
  metode: "Online (Zoom / Google Meet)",
  penguji: "Hamid Al-Hafidz",
  spesialisasiPenguji: "Tahfidz & Tajwid",
  nilai: {
    kelancaran: 8,
    tajwid: 8,
    intonasi: 9,
    penampilan: 8,
    pengalaman: 7,
  },
  rekomendasi: "Sangat Direkomendasikan (Mengajar Level Dewasa/Tahfidz)",
  dokumentasiUrl: "https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800"
};

interface EvaluationRegisterProps {
  data?: EvaluationData;
  className?: string;
}

function ScoreBar({ label, score, max = 9 }: { label: string; score: number; max?: number }) {
  const percentage = (score / max) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[13px] font-bold text-slate-700">
        <span>{label}</span>
        <span className="text-emerald-600">{score} <span className="text-slate-400 font-normal">/ {max}</span></span>
      </div>
      <div className="h-2 w-full rounded-full border border-slate-200 bg-slate-50 p-[1px]">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function EvaluationRegister({ data = mockData, className }: EvaluationRegisterProps) {
  const [previewItem, setPreviewItem] = useState<any>(null);

  return (
    <Card className={cn("bg-white border-slate-200/80 shadow-sm p-5 md:p-6 flex flex-col gap-4", className)}>
      {/* Header FormSection Style */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-emerald-600" />
        </div>
        <h3 className="text-sm font-extrabold text-slate-800">Hasil Penilaian Seleksi Anda</h3>
      </div>

      <div className="space-y-6 pt-2">
        {/* Data Seleksi */}
        <div className="space-y-4">
          <h4 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" /> Informasi Seleksi
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">Penguji</Label>
              <div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-center text-slate-700">
                {data.penguji}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">Metode</Label>
              <div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-center text-slate-700">
                {data.metode}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">Tanggal Seleksi</Label>
              <div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-center text-slate-700">
                {data.tanggal}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">Waktu</Label>
              <div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-center text-slate-700">
                {data.waktu}
              </div>
            </div>

          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* Nilai & Kualifikasi */}
        <div className="space-y-4">
          <h4 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" /> Nilai & Kualifikasi
          </h4>

          <div className="space-y-4 px-1">
            <ScoreBar label="Kelancaran Baca" score={data.nilai.kelancaran} />
            <ScoreBar label="Tajwid & Makhraj" score={data.nilai.tajwid} />
            <ScoreBar label="Intonasi Suara" score={data.nilai.intonasi} />
            <ScoreBar label="Penampilan" score={data.nilai.penampilan} />
            <ScoreBar label="Pengalaman" score={data.nilai.pengalaman} />
          </div>

          <div className="pt-2 mt-4">
            <div className="space-y-2">
              <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">Rekomendasi Hasil</Label>
              <div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-center text-slate-700 font-medium h-auto break-words whitespace-normal">
                {data.rekomendasi}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* Foto / Dokumentasi */}
        <div className="space-y-4">
          <h4 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
            <Video className="w-4 h-4 text-emerald-600" /> Dokumentasi Penyeleksian
          </h4>
          {data.dokumentasiUrl ? (
            <div 
              className="relative w-full sm:w-1/2 lg:max-w-sm rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm group cursor-pointer"
              onClick={() => setPreviewItem({ type: "image", url: data.dokumentasiUrl, title: "Bukti Pertemuan Virtual" })}
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={data.dokumentasiUrl} 
                  alt="Dokumentasi Seleksi" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 flex items-center justify-center transition-all">
                  <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
                    <ExternalLink className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                <Video className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="text-xs font-bold text-slate-700 truncate">
                  Bukti Pertemuan Virtual
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/60 rounded-[16px] py-8 px-6 flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden">
              <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center shrink-0 shadow-sm relative z-10 border border-sky-100">
                <Video className="w-6 h-6 text-sky-500" />
              </div>
              <div className="space-y-1 relative z-10 max-w-sm">
                <h4 className="font-extrabold text-slate-800 text-[14px]">Pertemuan dengan calon guru secara virtual</h4>
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                  Metode daring (online). Wawancara dan tes bacaan diverifikasi melalui video conference oleh {data.penguji}.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Image Preview Modal */}
      <TrainerMediaPopup previewItem={previewItem} setPreviewItem={setPreviewItem} />
    </Card>
  );
}

export default EvaluationRegister;
