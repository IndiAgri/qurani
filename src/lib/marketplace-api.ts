import { supabase, isSupabaseConfigured } from "./supabase";

export interface SessionDetailItem {
  id: number;
  title: string;
  status: "scheduled" | "completed" | "cancelled";
  date: string;
  time: string;
  meetingPlatform?: string;
  videoConferenceUrl?: string;
}

export interface MarketplaceOrder {
  id: string; // e.g. "INV-1789973730001"
  transactionId?: string;
  date: string; // ISO
  userId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  trainerId: string;
  trainerName: string;
  trainerAvatar: string;
  packageId: string;
  packageName: string;
  method: string;
  mode: "Online" | "Offline";
  offlineLocationType?: string;
  description?: string;
  features?: string[];
  sessions: number;
  price: number; // Final total amount
  subtotal: number;
  serviceFee: number;
  tax: number;
  discountAmount?: number;
  voucherCode?: string;
  status: "pending" | "waiting_approval" | "success" | "cancelled" | "refunded";
  paymentMethod: string;
  paymentStatus: string; // e.g. "Menunggu Pembayaran", "Lunas", "Dibatalkan/Kedaluwarsa"
  expiryDate?: string;
  sessionDetails?: SessionDetailItem[];
}

export interface TeacherApplication {
  status?: string;
  formData?: {
    headline?: string;
    bio?: string;
    location?: string;
    language?: string;
    expertise?: string[];
    hourlyRate?: string | number;
    categoryIds?: string[];
    experienceYears?: string;
    isOnline?: boolean;
    isOffline?: boolean;
  };
  certifications?: any[];
  portfolioItems?: any[];
  submittedAt?: string;
}

export const INITIAL_DUMMY_ORDERS: MarketplaceOrder[] = [
  {
    id: "INV-1789973730001",
    date: "2026-04-15T09:00:00Z",
    trainerName: "Nur Aisyah",
    trainerAvatar: "https://c.superprof.com/i/m/21187269/600/20251128151124/21187269.webp",
    trainerId: "2",
    packageName: "Tahsin Dasar",
    method: "Ummi",
    mode: "Online",
    description: "4x Pertemuan",
    features: ["Jadwal fleksibel", "Konsultasi chat", "Modul PDF Gratis"],
    sessions: 4,
    price: 201600,
    subtotal: 180000,
    serviceFee: 0,
    tax: 21600,
    status: "pending",
    paymentMethod: "Qurani Wallet",
    paymentStatus: "Menunggu Pembayaran",
    customerName: "Fulan bin Fulan",
    customerPhone: "+62 812-3456-7890",
    expiryDate: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
    packageId: "paket4-4x-2",
    sessionDetails: [
      { id: 1, title: "Pertemuan 1", status: "scheduled", date: "03 Sep 2026", time: "09:00" },
      { id: 2, title: "Pertemuan 2", status: "scheduled", date: "06 Sep 2026", time: "09:00" },
      { id: 3, title: "Pertemuan 3", status: "scheduled", date: "10 Sep 2026", time: "09:00" },
      { id: 4, title: "Pertemuan 4", status: "scheduled", date: "13 Sep 2026", time: "09:00" },
    ],
  },
  {
    id: "INV-1789973730002",
    date: "2026-08-01T09:00:00Z",
    trainerName: "Fatima Hassan",
    trainerAvatar: "https://c.superprof.com/i/m/24071303/600/20240614004928/24071303.webp",
    trainerId: "4",
    packageName: "Tafsir Juz Amma",
    method: "Qiroati",
    mode: "Online",
    description: "4x Pertemuan",
    features: ["Jadwal fleksibel", "Modul Digital", "Konsultasi chat"],
    sessions: 4,
    price: 179200,
    subtotal: 160000,
    serviceFee: 0,
    tax: 19200,
    status: "cancelled",
    paymentMethod: "E-Wallet (OVO)",
    paymentStatus: "Gagal/Kedaluwarsa",
    customerName: "Fulan bin Fulan",
    customerPhone: "+62 812-3456-7890",
    packageId: "paket4-4x-4",
    sessionDetails: [
      { id: 1, title: "Pertemuan 1", status: "cancelled", date: "03 Agu 2026", time: "15:00" },
      { id: 2, title: "Pertemuan 2", status: "cancelled", date: "06 Agu 2026", time: "15:00" },
      { id: 3, title: "Pertemuan 3", status: "cancelled", date: "10 Agu 2026", time: "15:00" },
      { id: 4, title: "Pertemuan 4", status: "cancelled", date: "13 Agu 2026", time: "15:00" },
    ],
  },
  {
    id: "INV-1789973730003",
    date: "2026-07-01T10:00:00Z",
    trainerName: "Rafi Andika",
    trainerAvatar: "https://c.superprof.com/i/m/17191274/600/20220817152315/17191274.webp",
    trainerId: "1",
    packageName: "Tahfidz Intensif",
    method: "Wafa",
    mode: "Online",
    description: "1x Pertemuan (Trial / Pengenalan)",
    features: ["Jadwal fleksibel", "Bimbingan 1-on-1"],
    sessions: 1,
    price: 56000,
    subtotal: 50000,
    serviceFee: 0,
    tax: 6000,
    status: "success",
    paymentMethod: "QRIS",
    paymentStatus: "Lunas",
    customerName: "Fulan bin Fulan",
    customerPhone: "+62 812-3456-7890",
    packageId: "single-1",
    sessionDetails: [
      {
        id: 1,
        title: "Pertemuan 1",
        status: "completed",
        date: "05 Jul 2026",
        time: "10:00",
        meetingPlatform: "Google Meet",
        videoConferenceUrl: "https://meet.google.com/abc-def-ghi",
      },
    ],
  },
  {
    id: "INV-1789973730004",
    date: "2026-08-20T08:00:00Z",
    trainerName: "Zain Ali",
    trainerAvatar: "https://c.superprof.com/i/m/17384281/600/20230520125508/17384281.webp",
    trainerId: "3",
    packageName: "Tahfidz Intensif",
    method: "Talaqqi",
    mode: "Online",
    description: "8x Pertemuan (Hemat 10%)",
    features: ["Jadwal fleksibel", "Modul PDF Gratis", "Evaluasi Mingguan", "Konsultasi chat"],
    sessions: 8,
    price: 403200,
    subtotal: 360000,
    serviceFee: 0,
    tax: 43200,
    status: "success",
    paymentMethod: "Bank Transfer (Mandiri)",
    paymentStatus: "Lunas",
    customerName: "Fulan bin Fulan",
    customerPhone: "+62 812-3456-7890",
    packageId: "paket4-8x-3",
    sessionDetails: [
      { id: 1, title: "Pertemuan 1", status: "completed", date: "22 Agu 2026", time: "09:00", meetingPlatform: "Google Meet", videoConferenceUrl: "https://meet.google.com/abc-def-ghi" },
      { id: 2, title: "Pertemuan 2", status: "completed", date: "25 Agu 2026", time: "09:00", meetingPlatform: "Google Meet", videoConferenceUrl: "https://meet.google.com/abc-def-ghi" },
      { id: 3, title: "Pertemuan 3", status: "completed", date: "28 Agu 2026", time: "09:00", meetingPlatform: "Google Meet", videoConferenceUrl: "https://meet.google.com/abc-def-ghi" },
      { id: 4, title: "Pertemuan 4", status: "scheduled", date: "31 Agu 2026", time: "09:00", meetingPlatform: "Google Meet", videoConferenceUrl: "https://meet.google.com/abc-def-ghi" },
    ],
  },
];

const LOCAL_STORAGE_ORDERS_KEY = "qurani_marketplace_orders_v2";

export const marketplaceApi = {
  /**
   * Mengambil semua pesanan (termasuk dummy dan pesanan baru)
   */
  async getAllOrders(): Promise<MarketplaceOrder[]> {
    let storageOrders: MarketplaceOrder[] = [];

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
        if (raw) {
          storageOrders = JSON.parse(raw);
        }
      } catch (e) {
        console.error("Failed to parse orders from localStorage", e);
      }
    }

    // Coba load dari Supabase jika configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("marketplace_orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const mappedDbOrders: MarketplaceOrder[] = data.map((d: any) => ({
            id: d.id,
            transactionId: d.transaction_id,
            date: d.created_at,
            userId: d.user_id,
            customerName: d.customer_name,
            customerEmail: d.customer_email,
            customerPhone: d.customer_phone,
            trainerId: d.trainer_id,
            trainerName: d.trainer_name,
            trainerAvatar: d.trainer_avatar,
            packageId: d.package_id,
            packageName: d.package_name,
            method: d.method || "Ummi",
            mode: d.mode || "Online",
            offlineLocationType: d.offline_location_type,
            sessions: d.sessions || 1,
            price: Number(d.total_price),
            subtotal: Number(d.subtotal),
            serviceFee: Number(d.service_fee || 0),
            tax: Number(d.tax || 0),
            discountAmount: Number(d.discount_amount || 0),
            voucherCode: d.voucher_code,
            status: d.status,
            paymentMethod: d.payment_method,
            paymentStatus: d.payment_status,
            sessionDetails: d.session_details || [],
          }));

          // Merge db orders dengan storageOrders
          for (const dbo of mappedDbOrders) {
            if (!storageOrders.some((so) => so.id === dbo.id)) {
              storageOrders.unshift(dbo);
            }
          }
        }
      } catch (e) {
        console.warn("Supabase fetch orders fallback to storage", e);
      }
    }

    // Merge dengan default dummy orders
    const map = new Map<string, MarketplaceOrder>();
    for (const d of INITIAL_DUMMY_ORDERS) {
      map.set(d.id, d);
    }
    for (const o of storageOrders) {
      map.set(o.id, o);
    }

    return Array.from(map.values()).sort((a, b) => {
      const ta = new Date(a.date).getTime() || 0;
      const tb = new Date(b.date).getTime() || 0;
      return tb - ta;
    });
  },

  /**
   * Mengambil detail satu pesanan berdasarkan ID
   */
  async getOrderById(orderId: string): Promise<MarketplaceOrder | null> {
    const orders = await this.getAllOrders();
    const found = orders.find(
      (o) =>
        o.id === orderId ||
        String(o.id) === String(orderId) ||
        o.transactionId === orderId ||
        `ORD-${o.id}` === orderId
    );
    return found || null;
  },

  /**
   * Menyimpan pesanan baru (sinkron ke Supabase + localStorage + Wallet)
   */
  async saveOrder(order: MarketplaceOrder): Promise<MarketplaceOrder> {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
        const existing: MarketplaceOrder[] = raw ? JSON.parse(raw) : [];
        const idx = existing.findIndex((o) => o.id === order.id);
        if (idx >= 0) {
          existing[idx] = order;
        } else {
          existing.unshift(order);
        }
        localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(existing));

        // Sync legacy teacher_requests jika dibutuhkan
        const rawReq = localStorage.getItem("teacher_requests");
        const reqList = rawReq ? JSON.parse(rawReq) : [];
        reqList.unshift({
          id: order.id,
          transactionId: order.transactionId || order.id,
          trainerName: order.trainerName,
          packageId: order.packageId,
          packageName: order.packageName,
          status: order.status,
          dateApplied: order.date,
        });
        localStorage.setItem("teacher_requests", JSON.stringify(reqList));
      } catch (e) {
        console.error("Failed saving order to localStorage", e);
      }
    }

    // Simpan ke Supabase jika configured
    if (isSupabaseConfigured) {
      try {
        await supabase.from("marketplace_orders").upsert({
          id: order.id,
          transaction_id: order.transactionId || order.id,
          user_id: order.userId || "anonymous",
          customer_name: order.customerName,
          customer_email: order.customerEmail,
          customer_phone: order.customerPhone,
          trainer_id: order.trainerId,
          trainer_name: order.trainerName,
          trainer_avatar: order.trainerAvatar,
          package_id: order.packageId,
          package_name: order.packageName,
          method: order.method,
          mode: order.mode,
          offline_location_type: order.offlineLocationType,
          sessions: order.sessions,
          subtotal: order.subtotal,
          service_fee: order.serviceFee,
          tax: order.tax,
          discount_amount: order.discountAmount || 0,
          voucher_code: order.voucherCode,
          total_price: order.price,
          status: order.status,
          payment_method: order.paymentMethod,
          payment_status: order.paymentStatus,
          session_details: order.sessionDetails || [],
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn("Supabase upsert order fallback", e);
      }
    }

    return order;
  },

  /**
   * Update status pesanan (misal saat pembayaran Midtrans lunas, atau dibatalkan)
   */
  async updateOrderStatus(
    orderId: string,
    status: MarketplaceOrder["status"],
    paymentStatus?: string
  ): Promise<MarketplaceOrder | null> {
    const order = await this.getOrderById(orderId);
    if (!order) return null;

    order.status = status;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    } else {
      order.paymentStatus =
        status === "success" || status === "waiting_approval"
          ? "Lunas"
          : status === "cancelled"
          ? "Dibatalkan"
          : status === "refunded"
          ? "Dana Dikembalikan"
          : "Menunggu Pembayaran";
    }

    return await this.saveOrder(order);
  },

  /**
   * Membatalkan pesanan & mengembalikan dana ke saldo Wallet jika berlaku
   */
  async cancelOrder(
    orderId: string,
    reason: string,
    refundAmount?: number
  ): Promise<MarketplaceOrder | null> {
    const order = await this.getOrderById(orderId);
    if (!order) return null;

    const amount = refundAmount ?? order.price;
    order.status = "cancelled";
    order.paymentStatus = "Dibatalkan / Refund";

    // Catat pembatalan di localStorage
    if (typeof window !== "undefined") {
      try {
        const CANCELLATION_KEY = "qurani_cancellations";
        const REFUND_KEY = "qurani_refunds";
        const existingCancellations: any[] = JSON.parse(
          localStorage.getItem(CANCELLATION_KEY) || "[]"
        );
        existingCancellations.push({
          id: `CXL-${Date.now()}`,
          orderId: order.id,
          reason,
          cancelledAt: new Date().toISOString(),
          status: "success",
        });
        localStorage.setItem(CANCELLATION_KEY, JSON.stringify(existingCancellations));

        // Tambahkan mutasi refund ke dompet
        const savedTx = localStorage.getItem("myqurani_mock_wallet_tx");
        const txs = savedTx ? JSON.parse(savedTx) : [];
        const refundTx = {
          id: `WLT-REF-${Date.now()}`,
          type: "refund",
          amount,
          date: new Date().toISOString(),
          status: "success",
          detail: `Pengembalian saldo dari ${order.trainerName} - ${order.packageName}`,
          teacherName: order.trainerName,
          packageName: order.packageName,
          method: "Saldo Qurani",
        };
        localStorage.setItem(
          "myqurani_mock_wallet_tx",
          JSON.stringify([refundTx, ...txs])
        );

        const refunds: any[] = JSON.parse(localStorage.getItem(REFUND_KEY) || "[]");
        refunds.push({
          id: `RFD-${Date.now()}`,
          orderId: order.id,
          amount,
          method: "qurani_wallet",
          status: "success",
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem(REFUND_KEY, JSON.stringify(refunds));
      } catch (e) {
        console.error("Error updating cancellation & refund", e);
      }
    }

    return await this.saveOrder(order);
  },

  /**
   * Menyimpan formulir pendaftaran calon guru ke Supabase & Local/Session Storage
   */
  async saveTeacherApplication(appData: any) {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("teacher_form_data", JSON.stringify(appData));
        sessionStorage.setItem("teacher_form_data", JSON.stringify(appData));
        localStorage.setItem("teacher_status", appData.status || "pending");
        sessionStorage.setItem("teacher_status", appData.status || "pending");
        localStorage.removeItem("teacher_is_canceled");
        sessionStorage.removeItem("teacher_is_canceled");
      } catch (e) {
        console.error("Failed saving teacher application to storage", e);
      }
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from("teacher_applications").insert({
          headline: appData.formData?.headline,
          bio: appData.formData?.bio,
          location: appData.formData?.location,
          language: appData.formData?.language,
          expertise: appData.formData?.expertise || [],
          category_ids: appData.formData?.categoryIds || [],
          hourly_rate: parseFloat(appData.formData?.hourlyRate) || 0,
          currency: appData.formData?.currency || "IDR",
          experience_years: appData.formData?.experienceYears,
          is_online: appData.formData?.isOnline ?? true,
          is_offline: appData.formData?.isOffline ?? false,
          certifications: appData.certifications || [],
          portfolio_items: appData.portfolioItems || [],
          status: appData.status || "pending",
        });
      } catch (e) {
        console.warn("Supabase teacher application insert fallback", e);
      }
    }
  },

  /**
   * Mengambil data pendaftaran guru terbaru
   */
  async getTeacherApplication(): Promise<TeacherApplication | null> {
    if (typeof window !== "undefined") {
      const raw = sessionStorage.getItem("teacher_form_data") || localStorage.getItem("teacher_form_data");
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch {}
      }
    }
    return null;
  },
};
