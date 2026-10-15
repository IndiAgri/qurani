"use client";

import React from "react";
import { HelpCircle, Mail, MessageCircle, FileText, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function SupportView() {
  const [ticketSubject, setTicketSubject] = React.useState("");
  const [ticketMessage, setTicketMessage] = React.useState("");
  const [isSent, setIsSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) {
      toast.error("Mohon isi subjek dan pesan bantuan");
      return;
    }

    toast.success("Pesan bantuan terkirim!", {
      description: "Tim Qurani akan merespons melalui email/chat dalam 1x24 jam.",
    });
    setIsSent(true);
  };

  const faqs = [
    {
      q: "Bagaimana cara melakukan setoran hafalan (Recitation)?",
      a: "Buka menu Recitation di sidebar, pilih juz, surah, atau halaman yang ingin disetor, lalu klik Mulai Setoran. Rekam audio atau bacakan langsung kepada pendengar/guru.",
    },
    {
      q: "Bagaimana sistem pembayaran guru di Marketplace?",
      a: "Pembayaran menggunakan gateway Midtrans yang aman mendukung QRIS, Transfer Bank (BCA, BNI, Mandiri, BRI), E-Wallet (GoPay, OVO), dan Saldo Wallet Qurani.",
    },
    {
      q: "Apakah setoran saya dinilai otomatis oleh AI atau manusia?",
      a: "Terdapat dua mode: deteksi pelafalan berbasis AI untuk latihan mandiri, dan evaluasi langsung oleh Guru/Asatidz untuk sertifikasi dan sanad resmi.",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10 space-y-10 font-sans">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2.5">
          <HelpCircle className="size-7 text-[#00875a]" />
          Pusat Bantuan & Dukungan Qurani
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Butuh bantuan terkait akun, pemesanan guru, atau setoran hafalan? Kami siap mendampingi Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3">
          <div className="size-10 rounded-xl bg-emerald-50 text-[#00875a] flex items-center justify-center">
            <Mail className="size-5" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">Email Support</h3>
          <p className="text-xs text-gray-500">support@qurani.app</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3">
          <div className="size-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <MessageCircle className="size-5" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">Live Chat</h3>
          <p className="text-xs text-gray-500">Senin - Ahad: 08:00 - 21:00 WIB</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3">
          <div className="size-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <FileText className="size-5" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">Dokumentasi & Panduan</h3>
          <p className="text-xs text-gray-500">Panduan lengkap fitur hafalan & guru</p>
        </div>
      </div>

      {/* FAQs and Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FAQs */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-gray-900">Pertanyaan Sering Diajukan (FAQ)</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0 space-y-1.5">
                <h4 className="text-xs font-semibold text-gray-800">{faq.q}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-gray-900">Kirim Tiket Bantuan</h2>
          {isSent ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="size-12 text-[#00875a] mx-auto" />
              <h3 className="font-bold text-sm text-gray-900">Tiket Berhasil Terkirim</h3>
              <p className="text-xs text-gray-500">
                Pesan Anda telah kami catat. Tim Customer Support akan menghubungi Anda segera.
              </p>
              <button
                onClick={() => setIsSent(false)}
                type="button"
                className="text-xs font-medium text-[#00875a] hover:underline cursor-pointer"
              >
                Kirim pesan lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Subjek</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Kendala pembayaran guru / bug audio"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Rincian Masalah</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Jelaskan kendala yang Anda alami secara rinci..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a]"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#00875a] hover:bg-[#00734c] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Send className="size-3.5" />
                <span>Kirim Tiket Bantuan</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default SupportView;
