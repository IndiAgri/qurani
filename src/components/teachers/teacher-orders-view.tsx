"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  Monitor,
  Home,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

export interface StudentOrder {
  id: string;
  studentName: string;
  studentUsername: string;
  studentAvatar: string;
  packageName: string;
  price: number;
  startDate: string;
  endDate: string;
  mode: "ONLINE" | "OFFLINE";
  locationType?: string;
  locationAddress?: string;
  notes: string;
  status: "pending" | "accepted" | "rejected";
}

const INITIAL_ORDERS: StudentOrder[] = [
  {
    id: "ord-1",
    studentName: "Rizky Pratama",
    studentUsername: "rizky_p",
    studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    packageName: "Paket 10x Pertemuan",
    price: 425000,
    startDate: "15 Mar 2026",
    endDate: "15 Apr 2026",
    mode: "ONLINE",
    notes: "Assalamu'alaikum ustadz, saya ingin fokus melancarkan hafalan Juz 30-29 dan memperbaiki makhraj huruf saya.",
    status: "pending",
  },
  {
    id: "ord-2",
    studentName: "Laila Sari",
    studentUsername: "lailasari",
    studentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    packageName: "Paket 5x Pertemuan",
    price: 225000,
    startDate: "20 Mar 2026",
    endDate: "03 Apr 2026",
    mode: "OFFLINE",
    locationType: "GURU DATANG KE MURID",
    locationAddress: "Perumahan Dago Asri Blok C-15, Kota Bandung",
    notes: "Saya lebih nyaman belajar tatap muka. Mohon dibantu koreksi tajwid dan makhraj secara detail ya ustadz.",
    status: "pending",
  },
  {
    id: "ord-3",
    studentName: "Farhan Maulana",
    studentUsername: "farhan_m",
    studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    packageName: "Paket 10x Pertemuan",
    price: 425000,
    startDate: "25 Mar 2026",
    endDate: "25 Apr 2026",
    mode: "ONLINE",
    notes: "Ingin memantapkan hafalan surat Al-Kahfi dan tahsin Juz 1-3.",
    status: "pending",
  },
  {
    id: "ord-4",
    studentName: "Aisyah Zahra",
    studentUsername: "aisyah_z",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    packageName: "Paket 5x Pertemuan",
    price: 225000,
    startDate: "28 Mar 2026",
    endDate: "12 Apr 2026",
    mode: "OFFLINE",
    locationType: "MURID DATANG KE GURU",
    locationAddress: "Jl. Kebon Sirih No. 1, Menteng, Jakarta Pusat",
    notes: "Bimbingan tahsin talaqqi privat untuk persiapan ujian masuk pondok.",
    status: "pending",
  },
  {
    id: "ord-5",
    studentName: "Dimas Setiawan",
    studentUsername: "dimas_s",
    studentAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    packageName: "Paket 10x Pertemuan",
    price: 425000,
    startDate: "01 Apr 2026",
    endDate: "01 Mei 2026",
    mode: "ONLINE",
    notes: "Fokus hafalan Juz 30 dan latihan irama tilawah tartil.",
    status: "pending",
  },
];

export function TeacherOrdersView({ teacherId = "1" }: { teacherId?: string }) {
  const [orders, setOrders] = useState<StudentOrder[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<"pending" | "accepted" | "rejected">("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const acceptedCount = orders.filter((o) => o.status === "accepted").length;
  const rejectedCount = orders.filter((o) => o.status === "rejected").length;

  const handleAccept = (orderId: string, studentName: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "accepted" as const } : o))
    );
    toast.success(`Pesanan dari ${studentName} berhasil diterima!`);
  };

  const handleReject = (orderId: string, studentName: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "rejected" as const } : o))
    );
    toast.info(`Pesanan dari ${studentName} ditolak.`);
  };

  const filteredOrders = orders.filter((o) => {
    const matchTab = o.status === activeTab;
    const matchSearch =
      searchQuery === "" ||
      o.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.mode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans space-y-6">
      {/* Title Row with Status Badge */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Permintaan Murid
        </h1>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100 shadow-2xs">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{pendingCount} Menunggu Konfirmasi</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-6">
        {/* Search Bar & Filter Button */}
        <div className="flex items-center">
          <div className="flex items-center flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, mode dan paket..."
              className="h-10 w-full rounded-l-2xl border border-r-0 border-gray-200 bg-white px-4 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="button"
              className="h-10 px-4 rounded-r-2xl bg-[#00875a] hover:bg-[#007a51] text-white flex items-center justify-center transition cursor-pointer"
            >
              <Search className="size-4" />
            </button>
          </div>
          <button
            type="button"
            className="h-10 px-3.5 rounded-2xl bg-[#00875a] hover:bg-[#007a51] text-white flex items-center justify-center ml-2.5 transition cursor-pointer shadow-xs"
          >
            <Filter className="size-4" />
          </button>
        </div>

        {/* Tabs Row matching Screenshot 2 */}
        <div className="flex items-center gap-6 border-b border-gray-200/70 pb-0">
          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`pb-2.5 text-xs sm:text-sm transition cursor-pointer ${
              activeTab === "pending"
                ? "text-[#00875a] border-b-2 border-[#00875a] font-bold"
                : "text-gray-500 hover:text-gray-800 font-medium"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("accepted")}
            className={`pb-2.5 text-xs sm:text-sm transition cursor-pointer ${
              activeTab === "accepted"
                ? "text-[#00875a] border-b-2 border-[#00875a] font-bold"
                : "text-gray-500 hover:text-gray-800 font-medium"
            }`}
          >
            Diterima ({acceptedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rejected")}
            className={`pb-2.5 text-xs sm:text-sm transition cursor-pointer ${
              activeTab === "rejected"
                ? "text-[#00875a] border-b-2 border-[#00875a] font-bold"
                : "text-gray-500 hover:text-gray-800 font-medium"
            }`}
          >
            Ditolak ({rejectedCount})
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-gray-100 p-8">
              <p className="text-sm font-semibold text-gray-800">
                Tidak ada permintaan murid
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {activeTab === "pending"
                  ? "Semua permintaan telah diproses."
                  : activeTab === "accepted"
                  ? "Belum ada pesanan yang diterima."
                  : "Belum ada pesanan yang ditolak."}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs hover:shadow-sm transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Column: Student info and Details */}
                  <div className="flex-1 space-y-4">
                    {/* Top Row: Student + Details Grid */}
                    <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                      {/* Student Profile */}
                      <div className="flex items-center gap-3 min-w-[160px]">
                        <div className="relative size-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                          <Image
                            src={order.studentAvatar}
                            alt={order.studentName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 leading-tight">
                            {order.studentName}
                          </h3>
                          <p className="text-xs text-emerald-600 font-medium mt-0.5">
                            @{order.studentUsername}
                          </p>
                        </div>
                      </div>

                      {/* Paket */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 tracking-wider">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          <span>PAKET</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-gray-900 mt-1">
                          {order.packageName}
                        </p>
                      </div>

                      {/* Biaya */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 tracking-wider">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          <span>BIAYA</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-gray-900 mt-1">
                          Rp {order.price.toLocaleString("id-ID")}
                        </p>
                      </div>

                      {/* Rentang */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 tracking-wider">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          <span>RENTANG</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-700 mt-1">
                          {order.startDate} <span className="text-emerald-600 mx-1">-</span> {order.endDate}
                        </p>
                      </div>

                      {/* Mode */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 tracking-wider">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          <span>MODE</span>
                        </div>
                        <div className="mt-1">
                          {order.mode === "ONLINE" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                              <Monitor className="size-3.5" />
                              <span>ONLINE</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border border-gray-200 bg-gray-50 text-gray-600 text-[11px] font-bold">
                              <Home className="size-3.5" />
                              <span>OFFLINE</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Location Info (For Offline) */}
                    {order.locationType && (
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 pt-1">
                        <div className="flex items-center gap-1 text-gray-400 font-bold text-[10px] tracking-wider">
                          <MapPin className="size-3.5 text-emerald-600" />
                          <span>LOKASI</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {order.locationType}
                        </span>
                        <span className="text-gray-700 text-xs">
                          {order.locationAddress}
                        </span>
                      </div>
                    )}

                    {/* Catatan Bubble */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-gray-400 tracking-wider block">
                        CATATAN
                      </span>
                      <div className="bg-white rounded-2xl border border-gray-100 p-3.5 text-xs text-gray-700 max-w-2xl leading-relaxed shadow-2xs">
                        {order.notes}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Action Buttons */}
                  <div className="flex lg:flex-col items-center justify-end gap-2 shrink-0">
                    {order.status === "pending" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAccept(order.id, order.studentName)}
                          className="w-28 py-2.5 rounded-xl bg-[#00875a] hover:bg-[#007a51] text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs text-center"
                        >
                          Terima
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(order.id, order.studentName)}
                          className="w-28 py-2 rounded-xl text-red-500 hover:bg-red-50/60 font-semibold text-xs sm:text-sm transition cursor-pointer text-center"
                        >
                          Kirim
                        </button>
                      </>
                    ) : order.status === "accepted" ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        <CheckCircle2 className="size-4" />
                        <span>Diterima</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-semibold">
                        <XCircle className="size-4" />
                        <span>Ditolak</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
