// Type definitions
export type SessionTime = "morning" | "afternoon" | "night";
export type TeachingMethod = "Iqro" | "Ummi" | "Tilawati" | "Qiroati" | "Yanbu'a" | "Al-Baghdadi" | "Dirosa" | "Wafa" | "Grand PQ" | "An-Nahdliyah" | "Tartil" | "Talaqqi" | "Tafsir";
export type Specialization = "Tahsin" | "Tahfidz" | "Tajwid" | "Tartil" | "Sanad" | "Tafsir";

export interface TimeSlot {
    start: string;
    end: string;
    isBooked?: boolean;
}

export interface DayAvailability {
    day: number; // 0-6 (Sunday-Saturday)
    slots: TimeSlot[];
}

export interface Certification {
    name: string;
    url: string;
}

export interface GalleryItem {
    type: "image" | "video";
    url: string;
    thumbnail?: string; // For videos
    title?: string;
    images?: string[]; // For albums
}

export interface Trainer {
    id: string;
    username?: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    location: string;
    city?: string;
    province?: string;
    email?: string;
    pricePerSession: number;
    methods: TeachingMethod[];
    sessions: SessionTime[];
    specialization: Specialization[];
    bio: string;
    courseDescription?: string;
    certifications: Certification[];
    experience: number;
    isVerified: boolean;
    badgeType?: "duta-besar" | "guru-super" | "rekomendasi";
    availability?: DayAvailability[];
    gallery?: GalleryItem[];
    packages?: CourseDto[];
    holidays?: string[]; // "YYYY-MM-DD" format
    videoUrls?: string[];
    videoTitles?: string[];
    languages?: string[];
    country?: string;
    countryCode?: string; // ISO 3166-1 alpha-2, e.g. "ID", "MY", "SA"
    timezone?: string;   // IANA timezone, e.g. "Asia/Jakarta", "Asia/Riyadh"
    currency?: string;   // ISO 4217, e.g. "IDR", "MYR", "SAR"
    reviews?: any[];
    teachingMode?: "Online" | "Offline" | "Keduanya";
    onlineSettings?: {
        videoConferenceUrl?: string;
        meetingPlatform?: string;
        meetingId?: string;
        meetingPassword?: string;
    };
}


// Descriptive package titles per specialization, per session tier
const SPEC_TITLES: Record<string, { s4: string[], s8: string[], s12: string[] }> = {
    "Tahsin": {
        s4: ["Tahsin Dasar", "Tahsin Pemula"],
        s8: ["Tahsin Intensif", "Tahsin Terapan"],
        s12: ["Tahsin Mahir", "Tahsin Komprehensif"],
    },
    "Tahfidz": {
        s4: ["Tahfidz Pemula", "Hafalan Juz Amma"],
        s8: ["Tahfidz Intensif", "Hafalan Juz 30 Penuh"],
        s12: ["Tahfidz Mahir", "Tahfidz Lanjutan"],
    },
    "Tajwid": {
        s4: ["Tajwid Lanjutan", "Tajwid Praktis"],
        s8: ["Tajwid Intensif", "Tajwid Terapan"],
        s12: ["Tajwid Mahir", "Tajwid Komprehensif"],
    },
    "Tartil": {
        s4: ["Tartil Pemula", "Tartil Fasih"],
        s8: ["Tartil Intensif", "Tartil & Nagham"],
        s12: ["Tartil Mahir", "Tartil Komprehensif"],
    },
    "Tafsir": {
        s4: ["Tafsir Juz Amma", "Tafsir Pemula"],
        s8: ["Tafsir Tematik", "Tafsir Mendalam"],
        s12: ["Tafsir Mahir", "Tafsir Komprehensif"],
    },
    "Sanad": {
        s4: ["Sanad Riwayat Hafs", "Sanad Pemula"],
        s8: ["Sanad Intensif", "Qira'at Sab'ah Dasar"],
        s12: ["Ijazah & Sanad", "Sanad Qira'at Mahir"],
    },
};

const SPEC_DESCS: Record<string, string[]> = {
    "Tahsin": [
        "Pelajari cara membaca Al-Qur'an dengan benar sesuai makhraj dan sifat huruf bersama pengajar bersertifikat.",
        "Evaluasi dan perbaikan bacaan Al-Qur'an secara bertahap dengan metode yang telah terbukti efektif.",
    ],
    "Tahfidz": [
        "Program hafalan Al-Qur'an yang terstruktur dengan metode talaqqi dan muraja'ah rutin.",
        "Bimbingan hafalan Al-Qur'an dengan target yang jelas dan evaluasi berkala bersama hafidz/hafidzah.",
    ],
    "Tajwid": [
        "Kuasai seluruh hukum tajwid dari dasar hingga lanjutan dengan pendekatan praktis dan mudah dipahami.",
        "Belajar tajwid secara sistematis agar bacaan Al-Qur'an sesuai kaidah yang benar.",
    ],
    "Tartil": [
        "Pelajari teknik membaca Al-Qur'an dengan tempo yang tepat, indah, dan sesuai nagham yang benar.",
        "Tingkatkan kefasihan dan keindahan bacaan Al-Qur'an melalui latihan tartil yang terpandu.",
    ],
    "Tafsir": [
        "Pahami makna dan kandungan ayat-ayat Al-Qur'an melalui pendekatan tafsir yang mudah dicerna.",
        "Dalami ilmu tafsir Al-Qur'an secara tematik dan tahlili bersama pengajar berpengalaman.",
    ],
    "Sanad": [
        "Pelajari jalur sanad Al-Qur'an yang mutawatir dengan bimbingan langsung dari pengajar bersanad.",
        "Program ijazah dan sanad Al-Qur'an dengan riwayat Hafs 'an 'Asim yang terpercaya.",
    ],
};

// ── SPEC_SYLLABUS: Silabus per spesialisasi per tier ─────────────────────────
const SPEC_SYLLABUS: Record<string, { s4: any[], s8: any[], s12: any[] }> = {
    "Tahsin": {
        s4: [
            {
                order: 1, title: "Evaluasi Awal & Makhraj Huruf", description: "Penilaian bacaan awal dan penguasaan titik-titik makhraj.", duration: 60, topics: [
                    { order: 1, title: "Evaluasi Bacaan Dasar" },
                    { order: 2, title: "Makhraj Halq, Lisan, Syafatain, Khaisyum" },
                ]
            },
            {
                order: 2, title: "Sifat Huruf", description: "Sifat lazimah yang mempengaruhi cara pelafalan huruf.", duration: 60, topics: [
                    { order: 1, title: "Jahr, Hams, Syiddah, Rakhawah" },
                    { order: 2, title: "Qalqalah, Ghunnah, Tafkhim, Tarqiq" },
                ]
            },
            {
                order: 3, title: "Hukum Nun Mati & Tanwin", description: "Penerapan Izhar, Idgham, Iqlab, dan Ikhfa.", duration: 60, topics: [
                    { order: 1, title: "Izhar Halqi & Idgham (Bighunnah/Bilaghunnah)" },
                    { order: 2, title: "Iqlab & Ikhfa Haqiqi" },
                ]
            },
            {
                order: 4, title: "Hukum Mim Mati & Mad Dasar", description: "Tiga hukum mim mati dan mad thabi'i.", duration: 60, topics: [
                    { order: 1, title: "Ikhfa Syafawi, Idgham Mimi, Izhar Syafawi" },
                    { order: 2, title: "Mad Thabi'i & Mad Wajib Muttashil" },
                ]
            }
        ],
        s8: [
            {
                order: 1, title: "Evaluasi & Makhraj Lengkap", description: "Penilaian awal dan penguasaan 17 titik makhraj.", duration: 60, topics: [
                    { order: 1, title: "Tes Awal Bacaan" }, { order: 2, title: "17 Makhraj Huruf Hijaiyah" },
                ]
            },
            {
                order: 2, title: "Sifat Huruf Lazimah & 'Aridah", description: "Sifat tetap dan situasional pada huruf hijaiyah.", duration: 60, topics: [
                    { order: 1, title: "Sifat Lazimah: Jahr, Hams, Syiddah, Rakhawah" }, { order: 2, title: "Sifat 'Aridah: Qalqalah, Lin, Tafkhim, Tarqiq" },
                ]
            },
            {
                order: 3, title: "Hukum Nun Mati & Tanwin", description: "Empat hukum bacaan secara mendalam.", duration: 60, topics: [
                    { order: 1, title: "Izhar Halqi & Idgham Bighunnah" }, { order: 2, title: "Idgham Bilaghunnah, Iqlab & Ikhfa Haqiqi" },
                ]
            },
            {
                order: 4, title: "Hukum Mim Mati", description: "Penguasaan tiga hukum mim mati.", duration: 60, topics: [
                    { order: 1, title: "Ikhfa Syafawi & Idgham Mimi" }, { order: 2, title: "Izhar Syafawi" },
                ]
            },
            {
                order: 5, title: "Mad Thabi'i & Mad Wajib", description: "Mad asli dan wajib muttashil.", duration: 60, topics: [
                    { order: 1, title: "Mad Thabi'i: Syarat & Ukuran 2 Harakat" }, { order: 2, title: "Mad Wajib Muttashil: 4–5 Harakat" },
                ]
            },
            {
                order: 6, title: "Mad Far'i Lengkap", description: "Semua jenis mad far'i dan ukurannya.", duration: 60, topics: [
                    { order: 1, title: "Jaiz Munfashil, Shilah, 'Aridh Lissukun" }, { order: 2, title: "'Iwad, Tamkin, Lazim, Farq" },
                ]
            },
            {
                order: 7, title: "Hukum Lam Jalalah & Ra'", description: "Tafkhim dan tarqiq pada lam jalalah dan huruf ra'.", duration: 60, topics: [
                    { order: 1, title: "Lam Jalalah: Mufakhkham & Muraqqaq" }, { order: 2, title: "Ra' Tafkhim & Ra' Tarqiq" },
                ]
            },
            {
                order: 8, title: "Idgham Antar Huruf", description: "Idgham Mutamatsilain, Mutajanisain, Mutaqaribain.", duration: 60, topics: [
                    { order: 1, title: "Mutamatsilain & Mutajanisain" }, { order: 2, title: "Mutaqaribain & Contoh dalam Al-Qur'an" },
                ]
            }
        ],
        s12: [
            { order: 1, title: "Orientasi & Evaluasi Awal", duration: 60, topics: [{ order: 1, title: "Tes Bacaan Awal & Peta Jalan 20 Sesi" }] },
            { order: 2, title: "Makhraj Huruf Lengkap", duration: 60, topics: [{ order: 1, title: "17 Titik Makhraj Hijaiyah" }] },
            { order: 3, title: "Sifat Huruf Lazimah", duration: 60, topics: [{ order: 1, title: "Jahr, Hams, Syiddah, Rakhawah, Isti'la', Istifal" }] },
            { order: 4, title: "Sifat Huruf 'Aridah", duration: 60, topics: [{ order: 1, title: "Qalqalah, Ghunnah, Lin, Tafkhim, Tarqiq" }] },
            { order: 5, title: "Hukum Nun Mati & Tanwin", duration: 60, topics: [{ order: 1, title: "Izhar, Idgham, Iqlab, Ikhfa" }] },
            { order: 6, title: "Hukum Mim Mati", duration: 60, topics: [{ order: 1, title: "Ikhfa Syafawi, Idgham Mimi, Izhar Syafawi" }] },
            { order: 7, title: "Mad Thabi'i & Wajib Muttashil", duration: 60, topics: [{ order: 1, title: "Mad Asli & Cabang Wajib" }] },
            { order: 8, title: "Mad Far'i Bag. 1", duration: 60, topics: [{ order: 1, title: "Jaiz Munfashil, Shilah, 'Aridh Lissukun" }] },
            { order: 9, title: "Mad Far'i Bag. 2", duration: 60, topics: [{ order: 1, title: "'Iwad, Tamkin, Lazim, Farq, Badal" }] },
            { order: 10, title: "Hukum Lam Jalalah & Ra'", duration: 60, topics: [{ order: 1, title: "Tafkhim & Tarqiq pada Lam dan Ra'" }] },
            { order: 11, title: "Idgham Mutamatsilain & Mutajanisain", duration: 60, topics: [{ order: 1, title: "Shaghir & Kabir, Contoh dalam Qur'an" }] },
            { order: 12, title: "Idgham Mutaqaribain & Waqaf/Ibtida'", duration: 60, topics: [{ order: 1, title: "Jenis Waqaf & Ibtida' Benar" }] }
        ],
    },
    "Tahfidz": {
        s4: [
            {
                order: 1, title: "Evaluasi & Metode Hafalan", description: "Penilaian awal hafalan dan pengenalan teknik menghafal.", duration: 60, topics: [
                    { order: 1, title: "Evaluasi Hafalan Saat Ini" }, { order: 2, title: "Teknik Talaqqi & Tikrar" },
                ]
            },
            {
                order: 2, title: "Hafalan An-Nas s.d. Al-Kafirun", description: "Memulai hafalan dari surah-surah pendek Juz 30.", duration: 60, topics: [
                    { order: 1, title: "An-Nas, Al-Falaq, Al-Ikhlas, Al-Lahab" }, { order: 2, title: "An-Nashr & Al-Kafirun" },
                ]
            },
            {
                order: 3, title: "Hafalan Al-Kautsar s.d. Al-'Asr", description: "Melanjutkan hafalan Juz 30.", duration: 60, topics: [
                    { order: 1, title: "Al-Kautsar, Al-Ma'un, Quraisy" }, { order: 2, title: "Al-Fil, Al-Humazah, Al-'Asr" },
                ]
            },
            {
                order: 4, title: "Muraja'ah & Sambung Hafalan", description: "Mengulang dan menyambung hafalan yang telah diperoleh.", duration: 60, topics: [
                    { order: 1, title: "Muraja'ah An-Nas s.d. Al-'Asr" }, { order: 2, title: "Hafalan At-Takatsur, Al-Qari'ah, Al-'Adiyat" },
                ]
            }
        ],
        s8: [
            {
                order: 1, title: "Evaluasi & Target Hafalan", description: "Penilaian hafalan awal dan perencanaan target.", duration: 60, topics: [
                    { order: 1, title: "Tes Hafalan Awal" }, { order: 2, title: "Target: Hafalan Juz 30" },
                ]
            },
            {
                order: 2, title: "Hafalan Juz 30 Bag. 1 (An-Nas s.d. Al-Balad)", description: "Menghafal surah-surah Juz 30 pertama.", duration: 60, topics: [
                    { order: 1, title: "An-Nas, Al-Falaq, Al-Ikhlas, Al-Lahab, An-Nashr" }, { order: 2, title: "Al-Kafirun s.d. Al-Balad" },
                ]
            },
            {
                order: 3, title: "Hafalan Juz 30 Bag. 2 (Asy-Syams s.d. Al-Ghasyiyah)", description: "Melanjutkan hafalan Juz 30.", duration: 60, topics: [
                    { order: 1, title: "Asy-Syams, Al-Lail, Ad-Duha, Al-Insyirah" }, { order: 2, title: "At-Tin, Al-'Alaq s.d. Al-Ghasyiyah" },
                ]
            },
            {
                order: 4, title: "Hafalan Juz 30 Bag. 3 (Al-A'la s.d. An-Naba')", description: "Surah-surah panjang Juz 30.", duration: 60, topics: [
                    { order: 1, title: "Al-A'la, At-Thariq, Al-Buruj, Al-Insyiqaq" }, { order: 2, title: "Al-Muthaffifin s.d. An-Naba'" },
                ]
            },
            {
                order: 5, title: "Muraja'ah Juz 30 Menyeluruh", description: "Mengulang seluruh hafalan Juz 30.", duration: 60, topics: [
                    { order: 1, title: "Muraja'ah An-Naba' s.d. Al-Ghasyiyah" }, { order: 2, title: "Muraja'ah Al-A'la s.d. An-Nas" },
                ]
            },
            {
                order: 6, title: "Tasmi' Juz 30 kepada Guru", description: "Setoran hafalan lengkap Juz 30.", duration: 60, topics: [
                    { order: 1, title: "Tasmi' Juz 30 Lengkap" }, { order: 2, title: "Koreksi Makhraj pada Hafalan" },
                ]
            },
            {
                order: 7, title: "Hafalan Juz 29 Pembukaan", description: "Memulai hafalan Juz 29.", duration: 60, topics: [
                    { order: 1, title: "Al-Mursalat & Al-Insan" }, { order: 2, title: "Al-Qiyamah & Al-Mudatsir" },
                ]
            },
            {
                order: 8, title: "Muraja'ah & Hafalan Baru", description: "Muraja'ah terjadwal dan sambung hafalan.", duration: 60, topics: [
                    { order: 1, title: "Teknik Muraja'ah Sabaq Lama" }, { order: 2, title: "Lanjutan Hafalan Juz 29" },
                ]
            }
        ],
        s12: [
            { order: 1, title: "Orientasi & Evaluasi Hafalan Awal", duration: 60, topics: [{ order: 1, title: "Tes Hafalan & Peta Jalan 20 Sesi" }] },
            { order: 2, title: "Teknik Menghafal (Talaqqi & Tikrar)", duration: 60, topics: [{ order: 1, title: "Metode Bin-Nadzhar & Bit-Tahfidz" }] },
            { order: 3, title: "Hafalan Juz 30 Bag. 1 (An-Nas s.d. Al-Kafirun)", duration: 60, topics: [{ order: 1, title: "10 Surah Terakhir Juz 30" }] },
            { order: 4, title: "Hafalan Juz 30 Bag. 2 (Al-Kautsar s.d. An-Naba')", duration: 60, topics: [{ order: 1, title: "Menyelesaikan Seluruh Hafalan Juz 30" }] },
            { order: 5, title: "Muraja'ah Juz 30 Menyeluruh", duration: 60, topics: [{ order: 1, title: "Mengulang Seluruh Hafalan Juz 30" }] },
            { order: 6, title: "Tasmi' Juz 30 kepada Guru", duration: 60, topics: [{ order: 1, title: "Setoran Hafalan & Evaluasi" }] },
            { order: 7, title: "Hafalan Juz 29 Bag. 1", duration: 60, topics: [{ order: 1, title: "Al-Mursalat, Al-Insan, Al-Qiyamah, Al-Mudatsir" }] },
            { order: 8, title: "Hafalan Juz 29 Bag. 2", duration: 60, topics: [{ order: 1, title: "Al-Muzammil s.d. Al-Jinn" }] },
            { order: 9, title: "Muraja'ah Juz 29 & Tasmi'", duration: 60, topics: [{ order: 1, title: "Mengulang dan Menyetorkan Juz 29" }] },
            { order: 10, title: "Muraja'ah Juz 29 & 30 Bersama", duration: 60, topics: [{ order: 1, title: "Sambung-sambung Hafalan Dua Juz" }] },
            { order: 11, title: "Teknik Muraja'ah Jangka Panjang", duration: 60, topics: [{ order: 1, title: "Jadwal Sabaq, Sabaq Lama, Manzil" }] },
            { order: 12, title: "Hafalan Juz 28 Pembukaan", duration: 60, topics: [{ order: 1, title: "Surah-surah Awal Juz 28" }] }
        ],
    },
    "Tajwid": {
        s4: [
            {
                order: 1, title: "Pengantar Tajwid & Hukum Nun Mati", description: "Dasar ilmu tajwid dan hukum nun mati/tanwin.", duration: 60, topics: [
                    { order: 1, title: "Tujuan & Sejarah Ilmu Tajwid" }, { order: 2, title: "Izhar, Idgham, Iqlab, Ikhfa Haqiqi" },
                ]
            },
            {
                order: 2, title: "Hukum Mim Mati & Ghunnah", description: "Hukum mim mati dan sifat ghunnah.", duration: 60, topics: [
                    { order: 1, title: "Ikhfa Syafawi, Idgham Mimi, Izhar Syafawi" }, { order: 2, title: "Ghunnah: Nun & Mim Musyaddadah" },
                ]
            },
            {
                order: 3, title: "Hukum Mad Dasar", description: "Mad thabi'i dan mad far'i paling umum.", duration: 60, topics: [
                    { order: 1, title: "Mad Thabi'i (2 harakat)" }, { order: 2, title: "Mad Wajib Muttashil & Jaiz Munfashil" },
                ]
            },
            {
                order: 4, title: "Tafkhim & Tarqiq + Waqaf", description: "Hukum tebal-tipis bacaan dan cara waqaf.", duration: 60, topics: [
                    { order: 1, title: "Tafkhim & Tarqiq pada Lam & Ra'" }, { order: 2, title: "Jenis Waqaf & Cara Ibtida'" },
                ]
            }
        ],
        s8: [
            { order: 1, title: "Pengantar & Hukum Nun Mati/Tanwin", duration: 60, topics: [{ order: 1, title: "Sejarah Tajwid & Empat Hukum Nun Mati" }] },
            { order: 2, title: "Hukum Mim Mati & Ghunnah", duration: 60, topics: [{ order: 1, title: "Tiga Hukum Mim Mati & Sifat Ghunnah" }] },
            { order: 3, title: "Mad Thabi'i & Mad Wajib", duration: 60, topics: [{ order: 1, title: "Mad Asli & Wajib Muttashil" }] },
            { order: 4, title: "Mad Far'i Lengkap", duration: 60, topics: [{ order: 1, title: "Jaiz Munfashil, Shilah, 'Aridh, 'Iwad, Lazim" }] },
            { order: 5, title: "Tafkhim & Tarqiq", duration: 60, topics: [{ order: 1, title: "Lam Jalalah & Ra' Tafkhim/Tarqiq" }] },
            { order: 6, title: "Idgham (Mutamatsilain, Mutajanisain, Mutaqaribain)", duration: 60, topics: [{ order: 1, title: "Jenis-jenis Idgham Antar Huruf" }] },
            { order: 7, title: "Waqaf & Ibtida'", duration: 60, topics: [{ order: 1, title: "Jenis Waqaf & Cara Memulai Bacaan Kembali" }] },
            { order: 8, title: "Qalqalah & Bacaan Khusus", duration: 60, topics: [{ order: 1, title: "Qalqalah Sughra & Kubra, Nun Wiqayah" }] }
        ],
        s12: [
            { order: 1, title: "Orientasi & Pengantar Ilmu Tajwid", duration: 60, topics: [{ order: 1, title: "Sejarah, Tujuan, dan Manfaat Ilmu Tajwid" }] },
            { order: 2, title: "Hukum Nun Mati & Tanwin", duration: 60, topics: [{ order: 1, title: "Izhar, Idgham, Iqlab, Ikhfa" }] },
            { order: 3, title: "Hukum Mim Mati", duration: 60, topics: [{ order: 1, title: "Ikhfa Syafawi, Idgham Mimi, Izhar Syafawi" }] },
            { order: 4, title: "Sifat Ghunnah", duration: 60, topics: [{ order: 1, title: "Nun & Mim Musyaddadah, Tingkatan Ghunnah" }] },
            { order: 5, title: "Mad Thabi'i", duration: 60, topics: [{ order: 1, title: "Syarat, Huruf & Ukuran Mad Asli" }] },
            { order: 6, title: "Mad Wajib & Jaiz", duration: 60, topics: [{ order: 1, title: "Wajib Muttashil & Jaiz Munfashil" }] },
            { order: 7, title: "Mad Shilah, 'Aridh & 'Iwad", duration: 60, topics: [{ order: 1, title: "Shilah Thawilah/Qashirah & 'Aridh Lissukun" }] },
            { order: 8, title: "Mad Lazim, Farq, Tamkin, Badal", duration: 60, topics: [{ order: 1, title: "Mad-mad Langka & Contohnya" }] },
            { order: 9, title: "Tafkhim & Tarqiq", duration: 60, topics: [{ order: 1, title: "Lam Jalalah & Ra' Tafkhim/Tarqiq" }] },
            { order: 10, title: "Idgham Mutamatsilain & Mutajanisain", duration: 60, topics: [{ order: 1, title: "Shaghir & Kabir" }] },
            { order: 11, title: "Idgham Mutaqaribain", duration: 60, topics: [{ order: 1, title: "Contoh-contoh dalam Al-Qur'an" }] },
            { order: 12, title: "Qalqalah & Nun Wiqayah", duration: 60, topics: [{ order: 1, title: "Qalqalah Sughra, Kubra & Nun Wiqayah" }] }
        ],
    },
    "Tartil": {
        s4: [
            { order: 1, title: "Pengantar Tartil & Evaluasi", duration: 60, topics: [{ order: 1, title: "Konsep Tartil & Evaluasi Bacaan Awal" }] },
            { order: 2, title: "Tempo & Irama Dasar", duration: 60, topics: [{ order: 1, title: "Mengatur Tempo Tadwir, Hadr, Tartil" }] },
            { order: 3, title: "Nagham Dasar: Bayati & Hijaz", duration: 60, topics: [{ order: 1, title: "Pengenalan Maqam Bayati & Hijaz" }] },
            { order: 4, title: "Praktik Nagham pada Surah Pendek", duration: 60, topics: [{ order: 1, title: "Al-Fatihah & Juz 30 dengan Nagham" }] }
        ],
        s8: [
            { order: 1, title: "Pengantar Tartil & Evaluasi", duration: 60, topics: [{ order: 1, title: "Konsep Tartil dan Evaluasi Awal" }] },
            { order: 2, title: "Tempo Bacaan: Tadwir, Hadr, Tartil", duration: 60, topics: [{ order: 1, title: "Tiga Tingkatan Tempo Bacaan" }] },
            { order: 3, title: "Nagham Bayati", duration: 60, topics: [{ order: 1, title: "Qaraar, Nawa, Jawab Bayati" }] },
            { order: 4, title: "Nagham Hijaz", duration: 60, topics: [{ order: 1, title: "Hijaz Ashli & Kar Hijaz" }] },
            { order: 5, title: "Nagham Soba & Rast", duration: 60, topics: [{ order: 1, title: "Maqam Soba & Rast Nabawi" }] },
            { order: 6, title: "Nagham Jiharkah & Sikah", duration: 60, topics: [{ order: 1, title: "Maqam Jiharkah & Sikah" }] },
            { order: 7, title: "Praktik Nagham pada Surah Pilihan", duration: 60, topics: [{ order: 1, title: "Al-Fatihah, Ar-Rahman dengan Nagham" }] },
            { order: 8, title: "Transisi & Kombinasi Maqam", duration: 60, topics: [{ order: 1, title: "Perpindahan Antar Maqam yang Harmonis" }] }
        ],
        s12: [
            { order: 1, title: "Orientasi & Evaluasi Awal", duration: 60, topics: [{ order: 1, title: "Peta Jalan Tartil & Evaluasi Bacaan" }] },
            { order: 2, title: "Tempo Bacaan", duration: 60, topics: [{ order: 1, title: "Tadwir, Hadr, Tartil & Penerapannya" }] },
            { order: 3, title: "Integrasi Tajwid & Nagham", duration: 60, topics: [{ order: 1, title: "Hukum Tajwid dalam Konteks Tartil" }] },
            { order: 4, title: "Maqam Bayati (Dasar)", duration: 60, topics: [{ order: 1, title: "Qaraar, Nawa, Jawab Bayati" }] },
            { order: 5, title: "Maqam Bayati (Lanjutan)", duration: 60, topics: [{ order: 1, title: "Bayati Syuri & Kombinasi" }] },
            { order: 6, title: "Maqam Hijaz", duration: 60, topics: [{ order: 1, title: "Hijaz Ashli & Kar Hijaz" }] },
            { order: 7, title: "Maqam Soba", duration: 60, topics: [{ order: 1, title: "Soba & Soba Ajam" }] },
            { order: 8, title: "Maqam Rast", duration: 60, topics: [{ order: 1, title: "Rast Nabawi & Alan Rast" }] },
            { order: 9, title: "Maqam Nahawand", duration: 60, topics: [{ order: 1, title: "Nahawand Mursail & Mahur" }] },
            { order: 10, title: "Maqam Jiharkah", duration: 60, topics: [{ order: 1, title: "Jiharkah & Variasi" }] },
            { order: 11, title: "Maqam Sikah & 'Iraq", duration: 60, topics: [{ order: 1, title: "Sikah Turki & 'Iraq Ajam" }] },
            { order: 12, title: "Transisi Antar Maqam", duration: 60, topics: [{ order: 1, title: "Teknik Perpindahan Maqam yang Indah" }] }
        ],
    },
    "Tafsir": {
        s4: [
            { order: 1, title: "Pengantar Tafsir & Ulumul Qur'an", duration: 60, topics: [{ order: 1, title: "Sejarah Tafsir & Metode-metodenya" }] },
            { order: 2, title: "Tafsir Surah Al-Fatihah", duration: 60, topics: [{ order: 1, title: "Makna Ayat per Ayat Al-Fatihah" }] },
            { order: 3, title: "Tafsir Juz 30 Bag. 1", duration: 60, topics: [{ order: 1, title: "An-Nas, Al-Falaq, Al-Ikhlas, Al-Lahab, An-Nashr" }] },
            { order: 4, title: "Tafsir Juz 30 Bag. 2", duration: 60, topics: [{ order: 1, title: "Al-Kafirun, Al-Kautsar, Al-Ma'un, Quraisy, Al-Fil" }] }
        ],
        s8: [
            { order: 1, title: "Pengantar & Dasar Tafsir", duration: 60, topics: [{ order: 1, title: "Definisi, Syarat Mufassir & Ulumul Qur'an" }] },
            { order: 2, title: "Metodologi Tafsir", duration: 60, topics: [{ order: 1, title: "Tahlili, Ijmali, Muqaran, Maudhu'i" }] },
            { order: 3, title: "Tafsir Surah Al-Fatihah Menyeluruh", duration: 60, topics: [{ order: 1, title: "Makna Simbolik & Teologis Al-Fatihah" }] },
            { order: 4, title: "Tafsir Juz 30 Bag. 1", duration: 60, topics: [{ order: 1, title: "An-Nas s.d. Al-Kafirun" }] },
            { order: 5, title: "Tafsir Juz 30 Bag. 2", duration: 60, topics: [{ order: 1, title: "Al-Kautsar s.d. Al-'Asr" }] },
            { order: 6, title: "Tafsir Juz 30 Bag. 3", duration: 60, topics: [{ order: 1, title: "At-Takatsur s.d. Al-Zalzalah" }] },
            { order: 7, title: "Tafsir Tematik (Keluarga/Akhlak)", duration: 60, topics: [{ order: 1, title: "Ayat-ayat Pilihan tentang Keluarga" }] },
            { order: 8, title: "Kisah Nabi dalam Qur'an", duration: 60, topics: [{ order: 1, title: "Kisah Nabi Musa & Firaun (Garis Besar)" }] }
        ],
        s12: [
            { order: 1, title: "Orientasi & Ilmu Tafsir", duration: 60, topics: [{ order: 1, title: "Sejarah, Urgensi & Aliran Tafsir" }] },
            { order: 2, title: "Ulumul Qur'an Lanjutan", duration: 60, topics: [{ order: 1, title: "Asbabun Nuzul & Nasikh Mansukh" }] },
            { order: 3, title: "Metode Tafsir Tafshili", duration: 60, topics: [{ order: 1, title: "Tafsir Bil Ma'tsur & Tafsir Bir Ra'yi" }] },
            { order: 4, title: "Tafsir Al-Fatihah & Al-Baqarah (Awal)", duration: 60, topics: [{ order: 1, title: "Ayat 1-5 Al-Baqarah" }] },
            { order: 5, title: "Tafsir Juz 30 Bag. 1", duration: 60, topics: [{ order: 1, title: "An-Nas s.d. Al-Kafirun" }] },
            { order: 6, title: "Tafsir Juz 30 Bag. 2", duration: 60, topics: [{ order: 1, title: "Al-Kautsar s.d. Al-'Asr" }] },
            { order: 7, title: "Tafsir Juz 30 Bag. 3", duration: 60, topics: [{ order: 1, title: "At-Takatsur s.d. Al-Zalzalah" }] },
            { order: 8, title: "Tafsir Juz 30 Bag. 4", duration: 60, topics: [{ order: 1, title: "Al-Bayyinah s.d. Ad-Duha" }] },
            { order: 9, title: "Tafsir Tematik: Ibadah", duration: 60, topics: [{ order: 1, title: "Ayat Shalat, Zakat, Puasa" }] },
            { order: 10, title: "Tafsir Tematik: Akhlak", duration: 60, topics: [{ order: 1, title: "Ayat-ayat tentang Adab & Muamalah" }] },
            { order: 11, title: "Kisah Nabi Ibrahim AS", duration: 60, topics: [{ order: 1, title: "Pelajaran dari Kisah Ibrahim" }] },
            { order: 12, title: "Kisah Nabi Yusuf AS", duration: 60, topics: [{ order: 1, title: "Surah Yusuf (Garis Besar)" }] }
        ],
    },
    "Sanad": {
        s4: [
            { order: 1, title: "Pengantar Sanad & Riwayat", duration: 60, topics: [{ order: 1, title: "Konsep Sanad & Sejarah Periwayatan Qur'an" }] },
            { order: 2, title: "Riwayat Hafs 'an 'Asim", duration: 60, topics: [{ order: 1, title: "Silsilah Sanad & Kekhasan Riwayat Hafs" }] },
            { order: 3, title: "Kaidah Bacaan Riwayat Hafs", duration: 60, topics: [{ order: 1, title: "Kaidah Khusus dalam Riwayat Hafs" }] },
            { order: 4, title: "Qira'at Sab'ah: Pengenalan", duration: 60, topics: [{ order: 1, title: "Tujuh Imam Qira'at & Riwayatnya" }] }
        ],
        s8: [
            { order: 1, title: "Pengantar & Konsep Sanad", duration: 60, topics: [{ order: 1, title: "Definisi, Syarat & Urgensi Sanad" }] },
            { order: 2, title: "Sejarah Periwayatan Al-Qur'an", duration: 60, topics: [{ order: 1, title: "Dari Sahabat hingga Imam Qira'at" }] },
            { order: 3, title: "Riwayat Hafs 'an 'Asim (Mendalam)", duration: 60, topics: [{ order: 1, title: "Silsilah Lengkap & Kekhasan Hafs" }] },
            { order: 4, title: "Kaidah Khusus Riwayat Hafs", duration: 60, topics: [{ order: 1, title: "Perbedaan Hafs dengan Riwayat Lain" }] },
            { order: 5, title: "Pengantar Qira'at Sab'ah", duration: 60, topics: [{ order: 1, title: "Tujuh Imam Qira'at & Dua Riwayatnya" }] },
            { order: 6, title: "Qira'at Nafi' & Ibn Katsir", duration: 60, topics: [{ order: 1, title: "Warsy, Qalun, Al-Bazzi, Qunbul" }] },
            { order: 7, title: "Qira'at Abu 'Amr & Ibn 'Amir", duration: 60, topics: [{ order: 1, title: "Duri, Sus, Hisyam, Ibnu Dzakwan" }] },
            { order: 8, title: "Qira'at Hamzah & Al-Kisa'i", duration: 60, topics: [{ order: 1, title: "Khalaf, Khallad, Abu Harits, Ad-Duri" }] }
        ],
        s12: [
            { order: 1, title: "Orientasi & Konsep Sanad", duration: 60, topics: [{ order: 1, title: "Definisi, Jenis & Urgensi Sanad" }] },
            { order: 2, title: "Sejarah Periwayatan Al-Qur'an", duration: 60, topics: [{ order: 1, title: "Dari Nabi hingga Zaman Kodifikasi" }] },
            { order: 3, title: "Riwayat Hafs 'an 'Asim", duration: 60, topics: [{ order: 1, title: "Silsilah & Kekhasan Hafs" }] },
            { order: 4, title: "Kaidah Khusus Hafs", duration: 60, topics: [{ order: 1, title: "Saktah, Isymam, Imalah & Kaidah Lain" }] },
            { order: 5, title: "Qira'at Sab'ah: Overview", duration: 60, topics: [{ order: 1, title: "7 Imam Qira'at & 14 Riwayat" }] },
            { order: 6, title: "Qira'at Nafi' (Warsy & Qalun)", duration: 60, topics: [{ order: 1, title: "Kekhasan Warsy & Qalun" }] },
            { order: 7, title: "Qira'at Ibn Katsir (Al-Bazzi & Qunbul)", duration: 60, topics: [{ order: 1, title: "Kekhasan Al-Bazzi & Qunbul" }] },
            { order: 8, title: "Qira'at Abu 'Amr (Duri & Sus)", duration: 60, topics: [{ order: 1, title: "Kekhasan Duri & Sus" }] },
            { order: 9, title: "Qira'at Ibn 'Amir (Hisyam & Ibn Dzakwan)", duration: 60, topics: [{ order: 1, title: "Kekhasan Riwayat Syami" }] },
            { order: 10, title: "Qira'at Hamzah (Khalaf & Khallad)", duration: 60, topics: [{ order: 1, title: "Kekhasan Hamzah & Riwayatnya" }] },
            { order: 11, title: "Qira'at Al-Kisa'i (Abu Harits & Duri)", duration: 60, topics: [{ order: 1, title: "Kekhasan Al-Kisa'i" }] },
            { order: 12, title: "Praktik Qira'at Sab'ah (Al-Fatihah)", duration: 60, topics: [{ order: 1, title: "Al-Fatihah dalam 7 Riwayat" }] }
        ],
    },
};

// ── SPEC_OUTCOMES: Hasil belajar per spesialisasi per tier ───────────────────
const SPEC_OUTCOMES: Record<string, { s4: string[], s8: string[], s12: string[] }> = {
    "Tahsin": {
        s4: ["Menguasai seluruh makhraj huruf hijaiyah", "Memahami dan menerapkan sifat-sifat huruf", "Mampu menerapkan hukum nun mati, mim mati, dan mad dasar", "Bisa waqaf dan ibtida' dengan benar", "Membaca Juz 30 dengan tartil"],
        s8: ["Menguasai seluruh hukum tajwid dari dasar hingga lanjutan", "Membaca Al-Qur'an dengan benar sesuai makhraj dan sifat huruf", "Menerapkan semua hukum mad dengan tepat", "Membaca Juz 30 dan surah pilihan dengan tartil", "Mendapatkan sertifikat kelulusan tahsin"],
        s12: ["Membaca Al-Qur'an dengan sempurna sesuai kaidah tajwid", "Menguasai semua hukum bacaan secara menyeluruh", "Mampu mengajarkan dasar-dasar tahsin kepada orang lain", "Membaca surah panjang (Al-Mulk, Ar-Rahman, Yasin) dengan tartil", "Mendapatkan sertifikat tahsin komprehensif"],
    },
    "Tahfidz": {
        s4: ["Hafal minimal 10–15 surah Juz 30", "Mampu melakukan muraja'ah mandiri", "Menerapkan metode talaqqi dengan guru", "Membaca hafalan dengan makhraj yang benar"],
        s8: ["Hafal seluruh Juz 30 (37 surah)", "Mampu melakukan tasmi' kepada guru", "Menerapkan jadwal muraja'ah yang konsisten", "Memulai hafalan Juz 29", "Mendapatkan sertifikat hafal Juz 30"],
        s12: ["Hafal Juz 30 dan sebagian Juz 29", "Menguasai teknik muraja'ah jangka panjang", "Mampu melakukan tasmi' dua juz kepada guru", "Memiliki hafalan yang kokoh dan konsisten", "Mendapatkan sertifikat tahfidz"],
    },
    "Tajwid": {
        s4: ["Menguasai hukum nun mati, mim mati, mad dasar, dan waqaf", "Membaca Al-Fatihah dengan tajwid yang benar", "Menerapkan tafkhim dan tarqiq dengan tepat"],
        s8: ["Menguasai seluruh hukum tajwid dari dasar hingga lanjutan", "Membaca Al-Qur'an dengan menerapkan semua kaidah tajwid", "Mengenal idgham mutamatsilain, mutajanisain, mutaqaribain", "Membaca surah-surah panjang dengan benar", "Mendapatkan sertifikat tajwid"],
        s12: ["Ahli dalam seluruh hukum tajwid Al-Qur'an", "Mampu mengajarkan ilmu tajwid kepada orang lain", "Membaca surah apa saja dengan sempurna sesuai kaidah", "Mendapatkan sertifikat tajwid komprehensif"],
    },
    "Tartil": {
        s4: ["Menguasai tempo bacaan yang tepat (tartil, tadwir, hadr)", "Mengenal dan mempraktikkan maqam Bayati dan Hijaz", "Membaca Al-Fatihah dengan nagham dasar"],
        s8: ["Menguasai minimal 5 maqam utama (Bayati, Hijaz, Soba, Rast, Jiharkah)", "Mampu bertransisi antar maqam dengan halus", "Membaca surah pilihan dengan nagham yang indah", "Mendapatkan sertifikat tartil"],
        s12: ["Menguasai 7 maqam utama secara lengkap", "Mampu berimprovisasi dalam maqam dengan kreatif", "Membaca Al-Qur'an dengan keindahan nagham kelas dunia", "Mampu mengajarkan dasar-dasar nagham", "Mendapatkan sertifikat tartil komprehensif"],
    },
    "Tafsir": {
        s4: ["Memahami tafsir surah-surah Juz 30 yang sering dibaca", "Mampu mengaitkan makna ayat dengan kehidupan sehari-hari", "Mengenal perbedaan metode tafsir"],
        s8: ["Menguasai tafsir Juz 30 secara mendalam", "Mampu menelaah tafsir tematik (aqidah, akhlak, muamalah)", "Mengenal kitab-kitab tafsir klasik dan modern", "Mendapatkan sertifikat tafsir dasar"],
        s12: ["Menguasai ulumul Qur'an secara komprehensif", "Mampu menelaah tafsir dengan metode tahlili dan mawdhu'i", "Memahami tafsir surah-surah penting (Yasin, Al-Kahfi)", "Mendapatkan sertifikat tafsir komprehensif"],
    },
    "Sanad": {
        s4: ["Menguasai dasar-dasar riwayat Hafs 'an 'Asim", "Mengenal pengantar Qira'at Sab'ah", "Mampu membaca dengan isnad yang benar"],
        s8: ["Menguasai riwayat Hafs 'an 'Asim secara mendalam", "Mengenal dan membedakan 7 Qira'at Imam", "Membaca Al-Fatihah dalam beberapa riwayat", "Mendapatkan ijazah dasar riwayat Hafs"],
        s12: ["Menguasai Qira'at Sab'ah secara komprehensif", "Mampu membaca dalam minimal 3 riwayat secara fasih", "Mengenal kitab referensi ilmu Qira'at (Syatibiyah)", "Mendapatkan ijazah sanad resmi"],
    },
};

// ── SPEC_REQUIREMENTS: Persyaratan per spesialisasi per tier ─────────────────
const SPEC_REQUIREMENTS: Record<string, { s4: string[], s8: string[], s12: string[] }> = {
    "Tahsin": {
        s4: ["Bisa membaca huruf hijaiyah", "Komitmen mengulang pelajaran di antara sesi"],
        s8: ["Mampu membaca Al-Qur'an meski belum fasih", "Komitmen belajar rutin selama 10 sesi"],
        s12: ["Mampu membaca Al-Qur'an dengan lancar dasar", "Komitmen penuh 20 sesi tanpa putus", "Bersedia mengerjakan latihan mandiri di luar sesi"],
    },
    "Tahfidz": {
        s4: ["Mampu membaca Al-Qur'an dengan lancar", "Komitmen muraja'ah harian"],
        s8: ["Mampu membaca Al-Qur'an dengan baik", "Memiliki hafalan minimal 10 surah Juz 30", "Bersedia muraja'ah minimal 30 menit per hari"],
        s12: ["Mampu membaca Al-Qur'an dengan tartil", "Memiliki hafalan Juz 30 atau dalam proses", "Berkomitmen muraja'ah intensif setiap hari"],
    },
    "Tajwid": {
        s4: ["Bisa membaca Al-Qur'an (meski belum benar tajwidnya)", "Bersedia latihan membaca mandiri"],
        s8: ["Mampu membaca Al-Qur'an dengan lancar", "Memahami hukum nun mati dan mim mati dasar"],
        s12: ["Mampu membaca Al-Qur'an dengan cukup baik", "Memiliki dasar pengetahuan tajwid", "Berkomitmen latihan membaca mandiri"],
    },
    "Tartil": {
        s4: ["Mampu membaca Al-Qur'an dengan tajwid dasar", "Memiliki rasa musikalitas dasar"],
        s8: ["Mampu membaca Al-Qur'an dengan baik", "Memiliki dasar pengetahuan tajwid yang cukup"],
        s12: ["Mampu membaca Al-Qur'an dengan tartil", "Memiliki pengetahuan tajwid yang baik", "Berkomitmen latihan nagham intensif setiap hari"],
    },
    "Tafsir": {
        s4: ["Mampu membaca Al-Qur'an", "Memiliki Al-Qur'an terjemah"],
        s8: ["Mampu membaca Al-Qur'an dengan cukup baik", "Pengetahuan bahasa Arab dasar (diutamakan, tidak wajib)"],
        s12: ["Mampu membaca Al-Qur'an dengan baik", "Pengetahuan bahasa Arab (lebih diutamakan)", "Bersedia membaca literatur tafsir tambahan"],
    },
    "Sanad": {
        s4: ["Mampu membaca Al-Qur'an dengan tartil", "Memiliki pengetahuan tajwid yang baik"],
        s8: ["Mampu membaca Al-Qur'an dengan benar sesuai tajwid", "Memiliki pengalaman belajar di halaqah Qur'an"],
        s12: ["Hafidz Al-Qur'an atau hafalan minimal 5 juz", "Menguasai tajwid secara komprehensif", "Berkomitmen penuh untuk proses pengambilan ijazah"],
    },
};

// ── SPEC_TARGET: Target murid per spesialisasi per tier ──────────────────────
const SPEC_TARGET: Record<string, { s4: string, s8: string, s12: string }> = {
    "Tahsin": { s4: "Pemula yang ingin memperbaiki bacaan dan memahami dasar-dasar tajwid.", s8: "Pelajar yang serius ingin menguasai tajwid lengkap dan mendapat sertifikasi.", s12: "Siapa saja yang ingin mencapai bacaan Al-Qur'an yang sempurna dari nol hingga mahir." },
    "Tahfidz": { s4: "Pemula hafalan yang ingin menghafal surah-surah Juz 30 dengan bimbingan guru.", s8: "Mereka yang ingin menyelesaikan hafalan Juz 30 dan memulai Juz 29 dengan serius.", s12: "Penghafal serius yang ingin hafal dua juz atau lebih dengan muraja'ah terstruktur." },
    "Tajwid": { s4: "Pembaca Al-Qur'an yang ingin memperbaiki bacaan melalui hukum-hukum tajwid.", s8: "Mereka yang ingin menguasai semua hukum tajwid secara mendalam dan tersertifikasi.", s12: "Mereka yang ingin menjadi ahli tajwid dan mampu mengajarkannya kepada orang lain." },
    "Tartil": { s4: "Pembaca yang ingin memperindah bacaan dengan nagham dan irama yang benar.", s8: "Mereka yang ingin menguasai maqam-maqam utama qira'at dan memperindah bacaan.", s12: "Mereka yang ingin menguasai seni membaca Al-Qur'an (nagham) secara profesional." },
    "Tafsir": { s4: "Muslim yang ingin memahami makna surah-surah yang sering dibaca dalam shalat.", s8: "Mereka yang ingin menelaah tafsir secara lebih mendalam dengan metode tematik.", s12: "Mereka yang ingin menjadi pengkaji Al-Qur'an dengan pemahaman tafsir komprehensif." },
    "Sanad": { s4: "Pelajar yang ingin memahami dasar-dasar ilmu riwayat dan qira'at.", s8: "Mereka yang ingin mengambil ijazah riwayat Hafs dan memahami Qira'at Sab'ah.", s12: "Hafidz yang ingin mengambil ijazah sanad mutawatir secara resmi dari guru bersanad." },
};

// Helper to generate standard packages based on base price
const generateStandardPackages = (basePrice: number, teacherId: string, specializations: string[] = ["Tahsin"]): any[] => {
    const now = new Date().toISOString();

    // Exactly 3 courses: 4, 8, 12 sessions
    const selectedSessions = [4, 8, 12];
    const primarySpec = specializations[0] || "Tahsin";

    return selectedSessions.map((sess, index) => {
        const discount = sess >= 12 ? 0.8 : sess >= 8 ? 0.9 : 1;
        const discountPct = sess >= 12 ? 20 : sess >= 8 ? 10 : 0;

        // Map sess back to existing SPEC data keys to preserve large syllabus contents
        const tierKey = `s${sess}` as keyof typeof SPEC_TITLES[string];

        // Safe access to SPEC dictionaries
        const titles = SPEC_TITLES[primarySpec]?.[tierKey] || ["Paket " + sess + "x Pertemuan"];
        const title = titles[0] || "Paket " + sess + "x Pertemuan";

        const descs = SPEC_DESCS[primarySpec] || ["Pembelajaran komprehensif, evaluasi berkala, jadwal fleksibel."];
        const desc = descs[index % descs.length] || descs[0];

        const syllabusList = SPEC_SYLLABUS[primarySpec]?.[tierKey] || [];
        const outcomesList = SPEC_OUTCOMES[primarySpec]?.[tierKey] || [];
        const requirementsList = SPEC_REQUIREMENTS[primarySpec]?.[tierKey] || [];
        const targetString = SPEC_TARGET[primarySpec]?.[tierKey] || "Siapa saja yang ingin belajar Al-Qur'an.";

        const isOdd = parseInt(teacherId) % 2 !== 0;
        const mode = isOdd ? (index === 0 ? 1 : 2) : 1;
        const courseType = index === 1 ? "group" : "private";

        return {
            id: "paket4-" + sess + "x-" + teacherId,
            teacherId,
            title,
            categoryId: primarySpec === 'Tahsin' ? 3 : primarySpec === 'Tahfidz' ? 4 : primarySpec === 'Tajwid' ? 2 : 1,
            category: primarySpec,
            organizationId: null,
            description: desc,
            shortDescription: sess + "x Pertemuan " + (discountPct > 0 ? "(Hemat " + discountPct + "%)" : ""),
            thumbnail: DUMMY_GALLERY[index % DUMMY_GALLERY.length]?.url || null,
            images: DUMMY_GALLERY.filter(img => img.type === "image").map(img => img.url),
            videoUrl: "https://www.youtube.com/embed/YXBFTo3E2Hk",
            previewUrl: "https://www.youtube.com/embed/I0GtsN9rIyk?si=TWIFrhgr0VKQmQ90",
            level: 1,
            mode: mode,
            courseType: courseType,
            language: "id",
            subtitles: null,
            tags: ["Quran", primarySpec, "Belajar"],
            city: mode !== 1 ? "Jakarta Pusat" : null,
            latitude: null,
            longitude: null,
            timezone: "Asia/Jakarta",
            duration: 60,
            totalSessions: sess,
            syllabus: syllabusList,
            hourlyRate: basePrice,
            sessionPrice: basePrice,
            packagePrice: basePrice * sess,
            discountPrice: discount < 1 ? Math.floor((basePrice * sess) * discount / 1000) * 1000 : null,
            discountUntil: discount < 1 ? new Date(Date.now() + (Math.floor(Math.random() * 72) + 1) * 60 * 60 * 1000).toISOString() : null,
            currency: "IDR",
            isFree: 0,
            maxStudents: courseType === "group" ? 15 : 1,
            minStudents: courseType === "group" ? 5 : 1,
            hasCertificate: sess >= 10 ? 1 : 0,
            certificateTemplateId: null,
            learningOutcomes: outcomesList,
            requirements: requirementsList,
            targetAudience: targetString,
            skills: [],
            ageRestriction: 7,
            metaTitle: null,
            metaDescription: null,
            isActive: true,
            isPublic: true,
            students: ((parseInt(teacherId, 10) || 1) * 7 + sess * 3) % 40 + 10,
            rating: 0,
            reviews: 0,
            createdAt: now,
            updatedAt: now,
            features: ["Video Conference", "Modul PDF", sess >= 10 ? "Sertifikat Digital" : "Catatan Evaluasi"].filter(Boolean)
        };
    });
};



// Konstanta URL Sertifikat - Ganti link di sini dengan foto asli
const URL_CERT_SYAHADAH = "https://tse3.mm.bing.net/th/id/OIP.z34uVsTrOaq4WOpyZV2WCAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3";
const URL_CERT_STANDARDISASI = "https://imgv2-2-f.scribdassets.com/img/document/883288821/original/fde90693d3/1?v=1";
const URL_CERT_LISENSI = "https://i.pinimg.com/736x/0f/33/dc/0f33dcbbb3f07c196d131ef0841fd4bf.jpg";
const URL_CERT_SANAD = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEitomF5w1BLSgZ-Iz8hz3tzIeaqiqPr8isL7tkXBYNMJ2HADX6TkZbGSPAJqjoKQuiry3VdWjFShR97WSJR75SES_ppcTzfsZBiUtp2Pxmw8196sd5guAAVZvgSG0UlQb_CUn7bYjoCNIbLV76LsreSE6cUTM67OWgAXN_Jnsf54ZVmQirUX8IxgpfN/w1200-h630-p-k-no-nu/THUMB.jpg";
const URL_CERT_KOMPETENSI = "https://i.pinimg.com/736x/b2/e7/86/b2e786f063bfd8f2d4fa729e6818a530.jpg";
const URL_CERT_PELATIHAN = "https://i.pinimg.com/736x/63/68/73/63687328b08a6e4aa730c32496035529.jpg";

const DUMMY_GALLERY: GalleryItem[] = [
    { type: "image", url: "https://i.pinimg.com/1200x/ed/1b/af/ed1baf2de9582f0b415dcf49e5d5bd7c.jpg", title: "Proses Mengajar Tahsin" },
    { type: "image", url: "https://i.pinimg.com/736x/40/b9/70/40b97054e5e5dba4bc74b9553c982b4d.jpg", title: "Bimbingan Tahfidz Anak" },
    { type: "image", url: "https://i.pinimg.com/736x/3e/44/e7/3e44e7cf3dbe8631d6ca66e26f434fb7.jpg", title: "Diskusi Tajwid & Makhraj" },
    { type: "image", url: "https://i.pinimg.com/1200x/e2/99/ac/e299acfa1cbb7ea1995ef172c21edfcb.jpg", title: "Sesi Belajar Kelompok" },
    { type: "image", url: "https://i.pinimg.com/736x/76/94/71/76947128a9a73f4c5179595f419d5805.jpg", title: "Kelas Mengaji Intensif" }
];

// Dummy data for marketplace trainers
const DUMMY_TRAINERS_BASE: Trainer[] = [
    {
        // ── Guru 1: INDONESIA (WIB = UTC+7) ──────────────────────────────
        id: "1",
        username: "ustadz_rafi",
        name: "Rafi Andika",
        avatar: "https://c.superprof.com/i/m/17191274/600/20220817152315/17191274.webp",
        rating: 4.9,
        reviewCount: 245,
        location: "Jl. Kebon Sirih No. 1, Menteng, Jakarta Pusat, Indonesia",
        city: "Jakarta Pusat",
        province: "DKI Jakarta",
        country: "Indonesia",
        countryCode: "ID",
        timezone: "Asia/Jakarta",
        currency: "IDR",
        email: "ustadz.rafi@example.com",
        pricePerSession: 50000,
        methods: ["Ummi", "Tilawati"],
        sessions: ["morning", "afternoon", "night"],
        specialization: ["Tahfidz", "Tajwid"],
        bio: "Assalamualaikum, saya Ustadz Rafi dengan pengalaman 10 tahun mengajar tahfidz dan tahsin. Saya bersertifikat dari LIPIA dan telah membimbing ratusan santri untuk menghafal Al-Quran.",
        courseDescription: "Kursus ini dirancang untuk membantu Anda menguasai Tahfidz, Tajwid dengan bimbingan langsung dari Ustadz Rafi. Setiap sesi berlangsung selama 60 menit secara online melalui video call, dengan materi yang disesuaikan dengan kemampuan dan kebutuhan masing-masing santri.",
        certifications: [
            { name: "Syahadah Tahfidz 30 Juz", url: URL_CERT_SYAHADAH },
            { name: "Alumni Pondok Pesantren", url: URL_CERT_SANAD },
            { name: "Standardisasi Pengajar Metode Ummi", url: URL_CERT_STANDARDISASI }
        ],
        experience: 10,
        gallery: DUMMY_GALLERY,
        packages: generateStandardPackages(50000, "1", ["Tahfidz", "Tajwid"]),
        holidays: ["2026-04-10"],
        availability: [
            { day: 1, slots: [{ start: "08:00", end: "09:00" }, { start: "10:00", end: "11:00" }] }, // Mon
            { day: 2, slots: [{ start: "08:00", end: "09:00" }, { start: "13:00", end: "14:00" }] }, // Tue
            { day: 3, slots: [{ start: "09:00", end: "10:00" }, { start: "15:00", end: "16:00" }] }, // Wed
            { day: 4, slots: [{ start: "08:00", end: "09:00" }] }, // Thu
            { day: 5, slots: [{ start: "13:00", end: "15:00" }] }, // Fri
            { day: 6, slots: [{ start: "08:00", end: "10:00" }] }, // Sat
        ],
        isVerified: true,
        badgeType: "duta-besar",
        videoUrls: ["https://www.youtube.com/embed/YXBFTo3E2Hk", "https://www.youtube.com/embed/I0GtsN9rIyk?si=TWIFrhgr0VKQmQ90", "https://www.youtube.com/embed/vrdYQYo-dhM?si=m3xLNl93X7n1L1Xa"],
        videoTitles: ["Tahsin Surah Al-Fatihah", "Murottal Merdu Surah Ar-Rahman", "Tips Menghafal Al-Qur'an Cepat"],
        languages: ["Indonesia", "Inggris", "Arab"],
    },
    {
        // ── Guru 2: JAWA BARAT (WIB) ───────────────────────────────
        id: "2",
        username: "ustazah_nur_aisyah",
        name: "Nur Aisyah",
        avatar: "https://c.superprof.com/i/m/21187269/600/20251128151124/21187269.webp",
        rating: 5.0,
        reviewCount: 189,
        location: "Kota Bandung",
        city: "Bandung",
        province: "Jawa Barat",
        pricePerSession: 45000,
        packages: generateStandardPackages(45000, "2", ["Tahsin", "Tahfidz"]),
        methods: ["Ummi"],
        sessions: ["afternoon", "night"],
        specialization: ["Tahsin", "Tahfidz"],
        bio: "Alhamdulillah, saya mengajar tahsin dan tahfidz khusus untuk muslimah. Berkelulusan dari Universitas Islam Negeri Sunan Gunung Djati. Saya menggunakan metode Ummi yang terbukti efektif untuk pelajar dari semua tingkatan.",
        courseDescription: "Kelas Al-Quran online untuk muslimah. Setiap sesi selama 60 menit melalui video call, disesuaikan dengan kebutuhan dan kemampuan pelajar.",
        certifications: [
            { name: "Ijazah Sanad Al-Quran", url: URL_CERT_SANAD },
            { name: "Standardisasi Pengajar Metode Ummi", url: URL_CERT_STANDARDISASI },
            { name: "Sertifikat Hafalan 30 Juz", url: URL_CERT_SYAHADAH }
        ],
        experience: 8,
        isVerified: true,
        badgeType: "guru-super",
        gallery: DUMMY_GALLERY,

        videoUrls: ["https://www.youtube.com/embed/dx5a_CQTcXw?si=aPeOH8_IHFm6SkKe", "https://www.youtube.com/embed/4JMP9BJm9_Q?si=yTQfNbJc8Lzj0Kgg", "https://www.youtube.com/embed/GicF40DluV8?si=LsfdbsAwibCiNCKR"],
        languages: ["Indonesia", "Sunda", "Inggris"],
    },
    {
        // ── Guru 3: JAWA TIMUR (WIB) ─────────────────────────────
        id: "3",
        username: "ustadzah_zain",
        name: "Zain Ali",
        avatar: "https://c.superprof.com/i/m/17384281/600/20230520125508/17384281.webp",
        rating: 4.8,
        reviewCount: 312,
        location: "Kota Surabaya",
        city: "Surabaya",
        province: "Jawa Timur",
        pricePerSession: 50000,
        packages: generateStandardPackages(50000, "3"),
        methods: ["Tilawati", "Qiroati", "Talaqqi"],
        sessions: ["morning", "night"],
        specialization: ["Tahfidz", "Tajwid", "Tartil", "Sanad"],
        bio: "Hafizah Al-Quran 30 Juz dengan Sanad Muttashil. Saya memiliki ijazah mengajar Qur'an dengan sanad yang bersambung hingga Rasulullah SAW. Berpengalaman mengajar berbagai rentang usia.",
        courseDescription: "Program Tahfidz dan Tajwid intensif dengan metode Talaqqi. Cocok untuk semua level, dari pemula hingga yang ingin memperdalam makhraj dan intonasi.",
        certifications: [
            { name: "Ijazah Sanad Mutashil 30 Juz", url: URL_CERT_SANAD },
            { name: "Syahadah Mengajar Nasional", url: URL_CERT_SYAHADAH },
            { name: "Lisensi Pengajar", url: URL_CERT_LISENSI }
        ],
        experience: 15,
        isVerified: true,
        badgeType: "duta-besar",
        gallery: DUMMY_GALLERY,

        videoUrls: ["https://www.youtube.com/embed/TiD1sOPStA8?si=gWSLBJutxs12pEfu", "https://www.youtube.com/embed/ECGpmzuNiX0?si=Xww90sU8WUAggpq7", ""],
        languages: ["Indonesia", "Arab", "Inggris"],
    },
    {
        // ── Guru 4: DI YOGYAKARTA (WIB) ────────────────
        id: "4",
        username: "ustadzah_fatima",
        name: "Fatima Hassan",
        avatar: "https://c.superprof.com/i/m/24071303/600/20240614004928/24071303.webp",
        rating: 4.9,
        reviewCount: 203,
        location: "Kota Yogyakarta",
        city: "Yogyakarta",
        province: "DI Yogyakarta",
        pricePerSession: 40000,
        packages: generateStandardPackages(40000, "4", ["Tahsin", "Tahfidz", "Tafsir"]),
        methods: ["Ummi", "Tilawati", "Tartil"],
        sessions: ["morning", "night"],
        specialization: ["Tahsin", "Tahfidz", "Tafsir"],
        bio: "Lulusan Universitas Islam Negeri dengan spesialisasi ilmu Al-Quran dan Tafsir. Saya berpengalaman mengajar lebih dari 9 tahun dengan fokus pada perbaikan tajwid dan makhraj yang benar.",
        courseDescription: "Belajar Al-Quran dengan metode terstruktur. Program mencakup tahsin, tahfidz, dan pengenalan dasar tafsir.",
        certifications: [
            { name: "Syahadah Universitas Negeri", url: URL_CERT_SYAHADAH },
            { name: "Ijazah Sanad Hafs 'An 'Ashim", url: URL_CERT_SANAD },
            { name: "Sertifikasi Kompetensi", url: URL_CERT_KOMPETENSI }
        ],
        experience: 9,
        isVerified: true,
        badgeType: "guru-super",
        gallery: DUMMY_GALLERY,

        videoUrls: ["https://www.youtube.com/embed/WTb7_SFbapM", "https://www.youtube.com/embed/ggYryltcAKo?si=pNE6LmUmElJgeLRh", ""],
        languages: ["Indonesia", "Arab"],
    },
    {
        // ── Guru 5: JAWA TENGAH (WIB) ────────
        id: "5",
        username: "ustadz_ibrahim",
        name: "Ibrahim Al-Rashid",
        avatar: "https://c.superprof.com/i/m/17043794/600/20240819163736/17043794.webp",
        rating: 4.7,
        reviewCount: 168,
        location: "Kota Surakarta",
        city: "Surakarta",
        province: "Jawa Tengah",
        pricePerSession: 35000,
        packages: generateStandardPackages(35000, "5"),
        methods: ["Qiroati", "Tartil", "Talaqqi"],
        sessions: ["morning", "afternoon", "night"],
        specialization: ["Tahsin", "Tajwid", "Tartil"],
        bio: "Pengajar bersertifikat spesialis Tahsin dan Tartil. Berpengalaman mengajar di berbagai pondok pesantren dan sekolah berbasis Islam.",
        courseDescription: "Kelas Al-Quran online & offline mencakup Tajwid, Tahsin, dan Tartil untuk semua umur dan tingkat kemampuan.",
        certifications: [
            { name: "Ijazah Pengajar Nasional", url: URL_CERT_SANAD },
            { name: "Sertifikat Hafalan 30 Juz", url: URL_CERT_SYAHADAH },
            { name: "Sertifikasi Tartil", url: URL_CERT_KOMPETENSI }
        ],
        experience: 6,
        isVerified: true,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,

        videoUrls: ["https://www.youtube.com/embed/xbFQeVEyTpQ?si", "https://www.youtube.com/embed/gQYKE-uTprs?si=kGzO5gLJnZUjVDxn", ""],
        languages: ["Indonesia", "Jawa"],
    },
    {
        id: "6",
        username: "ustadzah_diyah",
        name: "Diyah Ayu",
        avatar: "https://c.superprof.com/i/m/17998294/600/20221125115401/17998294.webp",
        rating: 5.0,
        reviewCount: 167,
        location: "Kota Makassar",
        city: "Makassar",
        province: "Sulawesi Selatan",
        pricePerSession: 55000,
        packages: generateStandardPackages(55000, "6"),
        methods: ["Ummi", "Tilawati"],
        sessions: ["morning", "night"],
        specialization: ["Tahfidz"],
        bio: "Khusus untuk muslimah yang ingin menghafal Al-Quran dengan metode yang terstruktur dan menyenangkan. Alhamdulillah sudah membimbing ratusan hafizah.",
        certifications: [
            { name: "Ijazah Sanad Qiroah Sab'ah", url: URL_CERT_SANAD },
            { name: "Juara 1 MHQ Tingkat Provinsi", url: URL_CERT_KOMPETENSI },
            { name: "Alumni Pondok Pesantren", url: URL_CERT_SANAD }
        ],
        experience: 12,
        isVerified: true,
        badgeType: "duta-besar",
        videoUrls: ["https://www.youtube.com/embed/8nIh5y4m9nc", "https://www.youtube.com/embed/WumtHqRjQe8?si=jXWyuhB0OGkncmBW", ""],
        gallery: DUMMY_GALLERY,
        languages: ["Indonesia", "Inggris", "Arab"],
    },
    {
        id: "7",
        username: "ustadzah_nesa",
        name: "Nesa Putri",
        avatar: "https://c.superprof.com/i/m/16538234/600/20250905115105/16538234.webp",
        rating: 4.6,
        reviewCount: 94,
        location: "Kota Semarang",
        city: "Semarang",
        province: "Jawa Tengah",
        pricePerSession: 40000,
        packages: generateStandardPackages(40000, "7"),
        methods: ["Al-Baghdadi", "Qiroati"],
        sessions: ["morning", "night"],
        specialization: ["Tahsin", "Tajwid"],
        bio: "Mengajar tahsin dan tajwid dengan metode klasik yang terbukti efektif. Cocok untuk santri pemula yang ingin belajar membaca Al-Quran dari nol.",
        certifications: [
            { name: "Sertifikat Pelatihan Al-Baghdadi", url: URL_CERT_PELATIHAN },
            { name: "Alumni Pondok Pesantren", url: URL_CERT_SANAD },
            { name: "Pengalaman Guru TPA Kelurahan", url: URL_CERT_PELATIHAN }
        ],
        experience: 5,
        isVerified: true,
        badgeType: "rekomendasi",
        videoUrls: ["https://www.youtube.com/embed/bGIfzn09juQ", "https://www.youtube.com/embed/tdi2kRvTojU?si=Ah0qbO_KqbpIFXXn", ""],
        gallery: DUMMY_GALLERY,
        languages: ["Indonesia", "Jepang"],
    },
    {
        id: "8",
        username: "mariam_husna",
        name: "Mariam Husna",
        avatar: "https://c.superprof.com/i/m/22867720/600/20231011081909/22867720.webp",
        rating: 4.9,
        reviewCount: 211,
        location: "Kota Palembang",
        city: "Palembang",
        province: "Sumatera Selatan",
        pricePerSession: 50000,
        packages: generateStandardPackages(50000, "8"),
        methods: ["Ummi", "Tilawati", "Qiroati"],
        sessions: ["afternoon", "night"],
        specialization: ["Tahsin", "Tahfidz", "Tajwid"],
        bio: "Mengajar dengan berbagai metode untuk menyesuaikan kebutuhan santri. Berpengalaman mengajar anak-anak hingga dewasa dengan pendekatan yang menyenangkan.",
        certifications: [
            { name: "Standardisasi Pengajar Metode Ummi", url: URL_CERT_STANDARDISASI },
            { name: "Lisensi Mengajar Tilawati", url: URL_CERT_LISENSI }
        ],
        experience: 11,
        isVerified: true,
        badgeType: "guru-super",
        videoUrls: ["https://www.youtube.com/embed/Wl5SXIsJchc", "https://www.youtube.com/embed/g4IeQAwadA8?si=CiVvRolzlp4vTG53", ""],
        gallery: DUMMY_GALLERY,
        languages: ["Indonesia", "Inggris", "Mandarin"],
    },
    {
        id: "9",
        username: "muhammad_iqbal",
        name: "Muhammad Iqbal",
        avatar: "https://c.superprof.com/i/m/37081864/600/20250820084011/37081864.webp",
        rating: 4.8,
        reviewCount: 142,
        location: "Kota Balikpapan",
        city: "Balikpapan",
        province: "Kalimantan Timur",
        pricePerSession: 45000,
        packages: generateStandardPackages(45000, "9"),
        methods: ["Tilawati", "Tartil"],
        sessions: ["morning", "night"],
        specialization: ["Tartil", "Tajwid"],
        bio: "Spesialisasi dalam tartil dan tajwid untuk meningkatkan kualitas bacaan Al-Quran. Metode yang saya gunakan mudah dipahami dan diterapkan.",
        certifications: [
            { name: "Syahadah Tahfidz Quran 30 Juz", url: URL_CERT_SYAHADAH },
            { name: "Juara MHQ Tingkat Kota", url: URL_CERT_KOMPETENSI },
            { name: "Lisensi Mengajar Metode Tilawati", url: URL_CERT_LISENSI }
        ],
        experience: 8,
        isVerified: true,
        badgeType: "rekomendasi",
        videoUrls: ["https://www.youtube.com/embed/5xyRpXBO2YM?si=", "https://www.youtube.com/embed/4UjUAF3SgOc?si=9vQ-SPq4fbRsjTDl", ""],
        gallery: DUMMY_GALLERY,
        languages: ["Indonesia", "Arab"],
    },
    {
        id: "10",
        username: "ihza_muhammad",
        name: "Ihza Muhammad",
        avatar: "https://c.superprof.com/i/m/32916748/600/20260121165536/32916748.webp",
        rating: 5.0,
        reviewCount: 178,
        location: "Kota Denpasar",
        city: "Denpasar",
        province: "Bali",
        pricePerSession: 55000,
        packages: generateStandardPackages(55000, "10"),
        methods: ["Ummi"],
        sessions: ["afternoon", "night"],
        specialization: ["Tahfidz"],
        bio: "Alhamdulillah, fokus saya adalah membimbing muslimah untuk menghafal Al-Quran dengan tartil dan makhraj yang benar. Metode Ummi sangat efektif untuk tahfidz.",
        certifications: [
            { name: "Ijazah Sanad Mutashil", url: URL_CERT_SANAD },
            { name: "Standardisasi Pengajar Metode Ummi", url: URL_CERT_STANDARDISASI }
        ],
        experience: 10,
        isVerified: true,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/VXuS2JsfU1w", "https://www.youtube.com/embed/ykmTMKKBLBc?si=CFW3yDbWpwKRHdO0", ""],
        languages: ["Indonesia", "Inggris"],
    },
    {
        id: "11",
        username: "bilal_farhan",
        name: "Bilal Farhan",
        avatar: "https://c.superprof.com/i/m/21146992/600/20220706035710/21146992.webp",
        rating: 4.7,
        reviewCount: 115,
        location: "Kota Malang",
        city: "Malang",
        province: "Jawa Timur",
        pricePerSession: 50000,
        packages: generateStandardPackages(50000, "11"),
        methods: ["Qiroati", "Al-Baghdadi"],
        sessions: ["morning", "night"],
        specialization: ["Tahsin", "Tajwid"],
        bio: "Mengajar dengan sabar dan detail, terutama untuk santri pemula. Metode yang saya gunakan sangat cocok untuk yang baru belajar membaca Al-Quran.",
        certifications: [
            { name: "Lisensi Pengajar Qiroati", url: URL_CERT_LISENSI },
            { name: "Sertifikat Pelatihan Al-Baghdadi", url: URL_CERT_PELATIHAN }
        ],
        experience: 6,
        isVerified: true,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/YXBFTo3E2Hk", "https://www.youtube.com/embed/48F_SSOGR_8?si=c2Bu1P6dnHZC8KSm", ""],
        languages: ["Indonesia", "Arab", "Inggris"],
    },
    {
        id: "12",
        username: "hafsah_amina",
        name: "Hafsah Amina",
        avatar: "https://c.superprof.com/i/m/24836488/600/20230202130552/24836488.webp",
        rating: 4.9,
        reviewCount: 196,
        location: "Kota Surakarta",
        pricePerSession: 60000,
        packages: generateStandardPackages(60000, "12"),
        methods: ["Ummi", "Tilawati"],
        sessions: ["morning", "night"],
        specialization: ["Tahfidz", "Tahsin"],
        bio: "Berpengalaman mengajar tahfidz dan tahsin untuk muslimah dari berbagai usia. Alhamdulillah banyak santri yang berhasil menyelesaikan hafalan mereka.",
        certifications: [
            { name: "Ijazah Sanad Mutashil", url: URL_CERT_SANAD },
            { name: "Standardisasi Pengajar Metode Ummi", url: URL_CERT_STANDARDISASI }
        ],
        experience: 13,
        isVerified: true,
        badgeType: "duta-besar",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/TiD1sOPStA8?si=gWSLBJutxs12pEfu", "https://www.youtube.com/embed/KAX7TONKLL8?si=0yowB4IAt66gtBS2", ""],
        languages: ["Indonesia", "Inggris"],
    },
    {
        id: "13",
        username: "ustadz_hilman",
        name: "Hilman Syah",
        avatar: "https://c.superprof.com/i/m/36293108/600/20250505010914/36293108.webp",
        rating: 4.8,
        reviewCount: 92,
        location: "Kota Depok",
        pricePerSession: 50000,
        packages: generateStandardPackages(50000, "13"),
        methods: ["Qiroati", "Tartil"],
        sessions: ["night"],
        specialization: ["Tahsin", "Tajwid"],
        bio: "Spesialis pembenaran makhraj dan tajwid. Telah mengajar di berbagai masjid di Depok selama 5 tahun.",
        certifications: [
            { name: "Lisensi Pengajar Qiroati", url: URL_CERT_LISENSI },
            { name: "Syahadah Tahfidz 30 Juz", url: URL_CERT_SYAHADAH }
        ],
        experience: 5,
        isVerified: true,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/xbFQeVEyTpQ?si", "https://www.youtube.com/embed/k5xbUXuoO4k?si=_4tgLyOPz3joOi3i", ""],
        languages: ["Indonesia", "Arab"],
    },
    {
        id: "14",
        username: "rania_humaira",
        name: "Rania Humaira",
        avatar: "https://c.superprof.com/i/m/14813982/600/20240523070530/14813982.webp",
        rating: 4.9,
        reviewCount: 156,
        location: "Kota Bogor",
        pricePerSession: 55000,
        packages: generateStandardPackages(55000, "14"),
        methods: ["Ummi", "Al-Baghdadi"],
        sessions: ["morning", "night"],
        specialization: ["Tahfidz", "Tahsin"],
        bio: "Fokus pada hafalan balita dan anak-anak dengan pendekatan bermain sambil belajar. Metode Ummi bersertifikat.",
        certifications: [
            { name: "Standardisasi Pengajar Metode Ummi", url: URL_CERT_STANDARDISASI },
            { name: "Sertifikat Psikologi Anak", url: URL_CERT_PELATIHAN }
        ],
        experience: 8,
        isVerified: true,
        badgeType: "guru-super",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/bGIfzn09juQ", "https://www.youtube.com/embed/nL1Lmf5fgys?si=4zYKJpw_u-C_UoxT", ""],
        languages: ["Indonesia", "Inggris"],
    },
    {
        id: "15",
        username: "ustadz_yusuf",
        name: "Yusuf Mansur",
        avatar: "https://c.superprof.com/i/m/39221662/300/20251021143924/39221662.webp",
        rating: 4.7,
        reviewCount: 310,
        location: "Kota Tangerang",
        pricePerSession: 60000,
        packages: generateStandardPackages(60000, "15"),
        methods: ["Tilawati"],
        sessions: ["morning", "night"],
        specialization: ["Tahfidz"],
        bio: "Membimbing santri untuk menghafal Quran dengan metode visualisasi yang memudahkan ingatan.",
        certifications: [
            { name: "Syahadah Tahfidz Al-Quran", url: URL_CERT_SYAHADAH }
        ],
        experience: 15,
        isVerified: true,
        badgeType: "guru-super",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/YXBFTo3E2Hk", "https://www.youtube.com/embed/1OhgJLIo-Vs?si=GDoINs1kxxYr-6xV", ""],
        languages: ["Indonesia", "Arab", "Inggris"],
    },
    {
        id: "16",
        username: "ustadzah_afra",
        name: "Afra Nabila",
        avatar: "https://c.superprof.com/i/m/25294883/600/20250918154052/25294883.webp",
        rating: 5.0,
        reviewCount: 88,
        location: "Kota Bekasi",
        pricePerSession: 45000,
        packages: generateStandardPackages(45000, "16"),
        methods: ["Qiroati", "Tartil"],
        sessions: ["afternoon", "night"],
        specialization: ["Tajwid"],
        bio: "Mengutamakan ketepatan bacaan dan keindahan irama tartil. Sabar membimbing dari nol.",
        certifications: [
            { name: "Ijazah Sanad Mutashil", url: URL_CERT_SANAD },
            { name: "Sertifikat Kompetensi Tartil", url: URL_CERT_KOMPETENSI }
        ],
        experience: 4,
        isVerified: false,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/xbFQeVEyTpQ?si", "https://www.youtube.com/embed/1VBgQkMvxrc?si=8K6knYBnMc3MRDjI", ""],
        languages: ["Indonesia", "Turki"],
    },
    {
        id: "17",
        username: "fatih_karim",
        name: "Fatih Karim",
        avatar: "https://c.superprof.com/i/m/26943889/300/20230623105433/26943889.webp",
        rating: 4.9,
        reviewCount: 423,
        location: "Jakarta Selatan",
        pricePerSession: 75000,
        packages: generateStandardPackages(75000, "17"),
        methods: ["Ummi", "Talaqqi"],
        sessions: ["morning"],
        specialization: ["Tahfidz", "Sanad"],
        bio: "Membuka kelas khusus pengambilan sanad bacaan Al-Fatihah dan Juz Amma. Terbatas untuk santri serius.",
        certifications: [
            { name: "Ijazah Sanad Riwayat Hafs", url: URL_CERT_SANAD },
            { name: "Sertifikat Talaqqi Indonesia", url: URL_CERT_KOMPETENSI }
        ],
        experience: 20,
        isVerified: true,
        badgeType: "duta-besar",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/xbFQeVEyTpQ?si", "https://www.youtube.com/embed/i4v3VE_qixY?si=08J8rebbjPDVtLM4", ""],
        languages: ["Indonesia", "Arab", "Inggris"],
    },
    {
        id: "18",
        username: "alya_rohali",
        name: "Alya Rohali",
        avatar: "https://c.superprof.com/i/m/17546426/600/20250909071130/17546426.webp",
        rating: 4.5,
        reviewCount: 67,
        location: "Kota Semarang",
        pricePerSession: 40000,
        packages: generateStandardPackages(40000, "18"),
        methods: ["Al-Baghdadi"],
        sessions: ["afternoon", "night"],
        specialization: ["Tahsin"],
        bio: "Guru ngaji privat untuk anak SD-SMP. Belajar membaca huruf hijaiyah dengan lancar dan benar.",
        certifications: [
            { name: "Sertifikat Kompetensi Pengajar", url: URL_CERT_KOMPETENSI }
        ],
        experience: 3,
        isVerified: true,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/YXBFTo3E2Hk", "https://www.youtube.com/embed/pIY8a9Ky-Qs?si=nPzgFQh6gSTnW5G3", ""],
        languages: ["Indonesia", "Inggris"],
    },
    {
        id: "19",
        username: "budi_ashari",
        name: "Budi Ashari",
        avatar: "https://c.superprof.com/i/m/17569933/600/20250528030736/17569933.webp",
        rating: 4.9,
        reviewCount: 220,
        location: "Kota Yogyakarta",
        pricePerSession: 50000,
        packages: generateStandardPackages(50000, "19"),
        methods: ["Tilawati", "Tafsir"],
        sessions: ["morning", "night"],
        specialization: ["Tajwid", "Tafsir"],
        bio: "Selain memperbaiki bacaan, saya juga menyelipkan tadabbur ayat agar santri paham makna yang dibaca.",
        certifications: [
            { name: "Ijazah Lulusan Al-Azhar", url: URL_CERT_SANAD },
            { name: "Lisensi Mengajar Tilawati", url: URL_CERT_LISENSI }
        ],
        experience: 9,
        isVerified: true,
        badgeType: "guru-super",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/YXBFTo3E2Hk", "https://www.youtube.com/embed/VuCVkvDuwK8?si=g4-yR9nWdGifP8uV", ""],
        languages: ["Indonesia", "Arab", "Inggris"],
    },
    {
        id: "20",
        username: "ustadzah_shiren",
        name: "Shiren Sungkar",
        avatar: "https://c.superprof.com/i/m/21681183/600/20221026021743/21681183.webp",
        rating: 4.8,
        reviewCount: 134,
        location: "Kota Malang",
        pricePerSession: 45000,
        packages: generateStandardPackages(45000, "20"),
        methods: ["Qiroati"],
        sessions: ["morning", "night"],
        specialization: ["Tahfidz"],
        bio: "Membimbing setoran hafalan harian secara daring. Disiplin, istiqomah, dan bersahabat.",
        certifications: [
            { name: "Syahadah Tahfidz 30 Juz", url: URL_CERT_SYAHADAH },
            { name: "Lisensi Pengajar Qiroati", url: URL_CERT_LISENSI }
        ],
        experience: 6,
        isVerified: true,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/8nIh5y4m9nc", "https://www.youtube.com/embed/waeB6JYxE2A?si=aMQt0mKm9ngafZAH", "https://www.youtube.com/embed/M0YeMpdjv00?si=Ar_JOJa4-NVj2yRk"],
        languages: ["Indonesia", "Inggris"],
    },
    {
        id: "21",
        username: "ustadzah_risca",
        name: "Risca Amalia",
        avatar: "https://c.superprof.com/i/m/9119832/600/20250915172418/9119832.webp",
        rating: 4.6,
        reviewCount: 42,
        location: "Jakarta Selatan",
        pricePerSession: 85000,
        packages: generateStandardPackages(85000, "21"),
        methods: ["Talaqqi"],
        sessions: ["morning"],
        specialization: ["Tahsin"],
        bio: "Guru privat di Jakarta Selatan. Melayani kelas eksklusif dengan kurikulum personal.",
        certifications: [
            { name: "Sertifikat Kompetensi Talaqqi", url: URL_CERT_KOMPETENSI }
        ],
        experience: 4,
        isVerified: true,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/WTb7_SFbapM", "https://www.youtube.com/embed/brxoWESZLM8?si=OzMfW6qpx9FUj6om", ""],
        languages: ["Indonesia", "Inggris", "Prancis"],
    },
    {
        id: "22",
        username: "miftahuddin",
        name: "Miftahuddin Nur",
        avatar: "https://c.superprof.com/i/m/11946808/300/20251105122731/11946808.webp",
        rating: 4.9,
        reviewCount: 156,
        location: "Kota Malang",
        pricePerSession: 45000,
        packages: generateStandardPackages(45000, "22"),
        methods: ["Yanbu'a", "Iqro"],
        sessions: ["afternoon", "night"],
        specialization: ["Tajwid"],
        bio: "Spesialis metode Yanbu'a di Malang Raya. Berpengalaman 8 tahun mengajar di TPQ unggulan.",
        certifications: [
            { name: "Syahadah Yanbu'a Pusat", url: URL_CERT_SYAHADAH }
        ],
        experience: 8,
        isVerified: true,
        badgeType: "guru-super",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/8nIh5y4m9nc", "https://www.youtube.com/embed/I8NrqQZ0Rtc?si=2w96y01ZY_OPajic", ""],
        languages: ["Indonesia", "Arab"],
    },
    {
        id: "23",
        username: "shafa_marwa",
        name: "Shafa Marwa",
        avatar: "https://c.superprof.com/i/m/26923640/300/20250828080508/26923640.webp",
        rating: 4.8,
        reviewCount: 89,
        location: "Kota Surabaya",
        pricePerSession: 60000,
        packages: generateStandardPackages(60000, "23"),
        methods: ["Wafa", "Iqro"],
        sessions: ["morning", "night"],
        specialization: ["Tahfidz"],
        bio: "Mengajar metode Wafa dengan otak kanan. Belajar Quran jadi lebih mudah dan ceria untuk anak.",
        certifications: [
            { name: "Standardisasi Trainer Wafa", url: URL_CERT_STANDARDISASI }
        ],
        experience: 5,
        isVerified: true,
        badgeType: "guru-super",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/dx5a_CQTcXw?si=aPeOH8_IHFm6SkKe", "https://www.youtube.com/embed/5SoXlqg-9Dk?si=133ED9i7uItviNYN", ""],
        languages: ["Indonesia", "Inggris"],
    },
    {
        id: "24",
        username: "khoirul_anam",
        name: "Khoirul Anam",
        avatar: "https://c.superprof.com/i/m/19651307/300/20221224101949/19651307.webp",
        rating: 4.7,
        reviewCount: 64,
        location: "Kota Blitar",
        pricePerSession: 40000,
        packages: generateStandardPackages(40000, "24"),
        methods: ["An-Nahdliyah", "Tartil"],
        sessions: ["night"],
        specialization: ["Tahsin"],
        bio: "Pengajar An-Nahdliyah di Blitar. Menggunakan ketukan agar bacaan santri stabil dan tartil.",
        certifications: [
            { name: "Sertifikat Kompetensi An-Nahdliyah", url: URL_CERT_KOMPETENSI }
        ],
        experience: 10,
        isVerified: true,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/xbFQeVEyTpQ?si", "https://www.youtube.com/embed/oi0j0AxYxf0?si=sFs15Hi-0Qce9EjA", ""],
        languages: ["Indonesia", "Arab"],
    },
    {
        id: "25",
        username: "ustadzah_ihda",
        name: "Ihda Rania",
        avatar: "https://c.superprof.com/i/m/34214497/300/20251106085913/34214497.webp",
        rating: 5.0,
        reviewCount: 198,
        location: "Jakarta Pusat",
        pricePerSession: 90000,
        packages: generateStandardPackages(90000, "25"),
        methods: ["Tafsir", "Talaqqi"],
        sessions: ["morning", "night"],
        specialization: ["Tafsir", "Sanad"],
        bio: "Mendalami makna Al-Quran dengan tafsir tematik. Cocok untuk profesional yang ingin belajar mendalam.",
        certifications: [
            { name: "Ijazah Master of Tafsir", url: URL_CERT_SANAD },
            { name: "Ijazah Sanad Mutashil", url: URL_CERT_SANAD }
        ],
        experience: 15,
        isVerified: true,
        badgeType: "duta-besar",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/Wl5SXIsJchc", "https://www.youtube.com/embed/Zh8MuZZ3LBw?si=83bZdfkNfVVHOJRm", ""],
        languages: ["Indonesia", "Arab", "Inggris"],
    },
    {
        id: "26",
        username: "aryansah_fajar",
        name: "Aryansah Fajar",
        avatar: "https://c.superprof.com/i/m/22867648/600/20221219134102/22867648.webp",
        rating: 4.9,
        reviewCount: 76,
        location: "Kab. Malang",
        pricePerSession: 45000,
        packages: generateStandardPackages(45000, "26"),
        methods: ["Grand PQ", "Tilawati"],
        sessions: ["afternoon"],
        specialization: ["Tajwid"],
        bio: "Metode Grand PQ untuk dewasa di Malang Selatan. Belajar baca Quran lancar kilat.",
        certifications: [
            { name: "Sertifikat Pelatihan Grand PQ", url: URL_CERT_PELATIHAN }
        ],
        experience: 6,
        isVerified: true,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/r511D8vWP18?si=GQDMAzqVrn1scTT0", "https://www.youtube.com/embed/sChUy34PfBM?si=pbM2PXOI6mmsiH-Z", ""],
        languages: ["Indonesia", "Inggris"],
    },
    {
        id: "27",
        username: "ustadzah_sasti",
        name: "Sasti Larasati",
        avatar: "https://c.superprof.com/i/m/10724140/300/20221121220428/10724140.webp",
        rating: 4.8,
        reviewCount: 52,
        location: "Kab. Blitar",
        pricePerSession: 35000,
        packages: generateStandardPackages(35000, "27"),
        methods: ["Dirosa", "Iqro"],
        sessions: ["morning", "night"],
        specialization: ["Tahsin"],
        bio: "Menggunakan metode Dirosa (Pendidikan Al-Quran Orang Dewasa) di Blitar. Dari nol sampai lancar.",
        certifications: [
            { name: "Standardisasi Dirosa Nasional", url: URL_CERT_STANDARDISASI }
        ],
        experience: 4,
        isVerified: true,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/TiD1sOPStA8?si=yUoEWxtg19IzzIbm", "https://www.youtube.com/embed/vZzakk7QcJI?si=tS3KQxIfpNDKPYU9", ""],
        languages: ["Indonesia", "Melayu"],
    },
    {
        id: "28",
        username: "burhanuddin",
        name: "Burhanuddin Rabbani",
        avatar: "https://c.superprof.com/i/m/34286066/600/20250105165553/34286066.webp",
        rating: 4.6,
        reviewCount: 38,
        location: "Kota Surabaya",
        pricePerSession: 50000,
        packages: generateStandardPackages(50000, "28"),
        methods: ["Yanbu'a"],
        sessions: ["morning", "night"],
        specialization: ["Tajwid"],
        bio: "Membimbing makhraj dengan standar Yanbu'a di Surabaya Timur. Teliti dan detail.",
        certifications: [
            { name: "Ijazah Sanad Yanbu'a", url: URL_CERT_SANAD }
        ],
        experience: 7,
        isVerified: true,
        badgeType: "guru-super",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/-odgOHrUF9Y?si=QCsrAUHTrq7HZy5K", "https://www.youtube.com/embed/FTSdm7nKSt4?si=lLNkNs-cWsdBH5nT", ""],
        languages: ["Indonesia", "Arab"],
    },
    {
        id: "29",
        username: "ustadzah_luthfiyah",
        name: "Amara Jelita",
        avatar: "https://c.superprof.com/i/m/18911622/600/20250624160421/18911622.webp",
        rating: 4.9,
        reviewCount: 84,
        location: "Kota Malang",
        pricePerSession: 50000,
        packages: generateStandardPackages(50000, "29"),
        methods: ["Wafa", "Tartil"],
        sessions: ["afternoon", "night"],
        specialization: ["Tahfidz"],
        bio: "Fokus pada keindahan suara dan kelancaran metode Wafa di Kota Malang.",
        certifications: [
            { name: "Standardisasi Trainer Wafa", url: URL_CERT_STANDARDISASI }
        ],
        experience: 6,
        isVerified: true,
        badgeType: "guru-super",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/gF0aUmXe8dg?si=a7SxvxHWGfs2M-qx", "https://www.youtube.com/embed/NWGBnJLSwe8?si=24Mecx2a1w01-RPL", ""],
        languages: ["Indonesia", "Inggris"],
    },
    {
        id: "30",
        username: "ahmad_fauzi",
        name: "Salman Al-Farisi",
        avatar: "https://c.superprof.com/i/m/20729641/300/20221105224320/20729641.webp",
        rating: 4.7,
        reviewCount: 45,
        location: "Jakarta Timur",
        pricePerSession: 65000,
        packages: generateStandardPackages(65000, "30"),
        methods: ["Grand PQ", "Iqro"],
        sessions: ["night"],
        specialization: ["Tahsin"],
        bio: "Belajar Quran praktis untuk karyawan di Jakarta Timur. Cepat bisa dalam waktu singkat.",
        certifications: [
            { name: "Sertifikat Kompetensi Grand PQ", url: URL_CERT_KOMPETENSI }
        ],
        experience: 5,
        isVerified: true,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/ZYaZ6Odbx_Y?si=HF5T0Sv_Vt6Hiv0M", "https://www.youtube.com/embed/DaUq5FrbQLg?si=e80om5ZjfGwzOYrn", ""],
        languages: ["Indonesia", "Arab"],
    },
    {
        id: "31",
        name: "Hana Pertiwi",
        avatar: "https://c.superprof.com/i/m/14895677/300/20250728072126/14895677.webp",
        rating: 4.8,
        reviewCount: 121,
        location: "Kota Malang",
        pricePerSession: 45000,
        packages: generateStandardPackages(45000, "31"),
        methods: ["Dirosa", "Tafsir"],
        sessions: ["morning", "night"],
        specialization: ["Tafsir"],
        bio: "Menggabungkan belajar baca Quran Dirosa dengan pemahaman tafsir praktis.",
        certifications: [
            { name: "Sertifikat Pelatihan Tahsin", url: URL_CERT_PELATIHAN },
            { name: "Syahadah Tahfidz Al-Quran", url: URL_CERT_SYAHADAH }
        ],
        experience: 9,
        isVerified: true,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/zbhwRZ4NA3A?si=sWMPu5hsxwvKwJrY", "https://www.youtube.com/embed/OKZf1IBWn_A?si=ANrjfMhm_IJ7rSv_", ""],
        languages: ["Indonesia", "Inggris"],
    },
    {
        id: "32",
        name: "Faisal Akbar",
        avatar: "https://c.superprof.com/i/m/11668192/300/20250728190448/11668192.webp",
        rating: 4.5,
        reviewCount: 29,
        location: "Kab. Malang",
        pricePerSession: 40000,
        packages: generateStandardPackages(40000, "32"),
        methods: ["An-Nahdliyah"],
        sessions: ["night"],
        specialization: ["Tahsin"],
        bio: "Penerus metode An-Nahdliyah di Malang Barat. Irama klasik namun efektif.",
        certifications: [
            { name: "Syahadah An-Nahdliyah Pusat", url: URL_CERT_SYAHADAH }
        ],
        experience: 12,
        isVerified: true,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/zXCs33YQ3pE?si=IhIVcMjNEi6e-MbS", "https://www.youtube.com/embed/48F_SSOGR_8?si=QRPAjuEOuIesLC_Q", ""],
        languages: ["Indonesia", "Arab"],
    },
    {
        id: "33",
        name: "Aisyah Putri",
        avatar: "https://c.superprof.com/i/m/17998294/600/20221125115401/17998294.webp",
        rating: 5.0,
        reviewCount: 147,
        location: "Kota Surabaya",
        pricePerSession: 70000,
        packages: generateStandardPackages(70000, "33"),
        methods: ["Tafsir", "Talaqqi"],
        sessions: ["night"],
        specialization: ["Sanad", "Tafsir"],
        bio: "Kajian tafsir dan talaqqi intensif online di Surabaya. Mendalam dan filosofis.",
        certifications: [
            { name: "Ijazah Sanad Mutashil", url: URL_CERT_SANAD },
            { name: "Ijazah Doktor Tafsir Al-Azhar", url: URL_CERT_SANAD }
        ],
        experience: 18,
        isVerified: true,
        badgeType: "duta-besar",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/2_o1elmenEM?si=rHGTuUP9M-vOkI-w", "https://www.youtube.com/embed/4UX3tNoEe04?si=-VQwNCNZclkIAZOV", ""],
        languages: ["Indonesia", "Arab", "Inggris"],
    },
    {
        id: "34",
        name: "M. Anas Mubarok",
        avatar: "https://c.superprof.com/i/m/15264662/300/20250102135536/15264662.webp",
        rating: 4.6,
        reviewCount: 51,
        location: "Kota Blitar",
        pricePerSession: 45000,
        packages: generateStandardPackages(45000, "34"),
        methods: ["Yanbu'a", "Iqro"],
        sessions: ["morning", "night"],
        specialization: ["Tajwid"],
        bio: "Standarisasi Yanbu'a untuk anak-anak Blitar. Pembentukan karakter melalui Quran.",
        certifications: [
            { name: "Ijazah Yanbu'a Pusat", url: URL_CERT_SANAD }
        ],
        experience: 8,
        isVerified: true,
        badgeType: "guru-super",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/TLBg-_OMtCA?si=ywYq4TBYrquYOwE1", "https://www.youtube.com/embed/k5xbUXuoO4k?si=CxtpbAX_YwSyn1Up", ""],
        languages: ["Indonesia", "Inggris"],
    },
    {
        id: "35",
        name: "Elzha Qanita",
        avatar: "https://c.superprof.com/i/m/5932982/600/20220607161647/5932982.webp",
        rating: 4.9,
        reviewCount: 93,
        location: "Jakarta Selatan",
        pricePerSession: 80000,
        packages: generateStandardPackages(80000, "35"),
        methods: ["Wafa", "Talaqqi"],
        sessions: ["afternoon"],
        specialization: ["Tahfidz"],
        bio: "Mengajar hafalan metode Wafa di Jakarta Selatan. Menyenangkan dan cepat hafal.",
        certifications: [
            { name: "Standardisasi Trainer Wafa", url: URL_CERT_STANDARDISASI }
        ],
        experience: 7,
        isVerified: true,
        badgeType: "guru-super",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/TiD1sOPStA8?si=yUoEWxtg19IzzIbm", "https://www.youtube.com/embed/RrVGtZlYlP8?si=ponUZ2suICLEWZNS", ""],
        languages: ["Indonesia", "Inggris", "Arab"],
    },
    {
        id: "36",
        name: "Husein Ja'far",
        avatar: "https://c.superprof.com/i/m/16674865/600/20240809061159/16674865.webp",
        rating: 4.7,
        reviewCount: 162,
        location: "Jakarta Barat",
        pricePerSession: 75000,
        packages: generateStandardPackages(75000, "36"),
        methods: ["Tafsir", "Dirosa"],
        sessions: ["night"],
        specialization: ["Tafsir"],
        bio: "Obrolan tafsir ringan dan belajar Quran Dirosa untuk pemuda Jakarta.",
        certifications: [
            { name: "Ijazah Sanad Tafsir Al-Quran", url: URL_CERT_SANAD }
        ],
        experience: 6,
        isVerified: true,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/hbnRSXEZ0y8?si=pzElU9BfPze8MFqx", "https://www.youtube.com/embed/aBWnBYvBSvw?si=syBQ5ITFZylYEgJp", ""],
        languages: ["Indonesia", "Arab"],
    },
    {
        id: "37",
        name: "Naufal Zaki",
        avatar: "https://c.superprof.com/i/m/36293108/600/20250505010914/36293108.webp",
        rating: 4.8,
        reviewCount: 44,
        location: "Kota Malang",
        pricePerSession: 50000,
        packages: generateStandardPackages(50000, "37"),
        methods: ["An-Nahdliyah", "Grand PQ"],
        sessions: ["morning"],
        specialization: ["Tahsin"],
        bio: "Variasi metode mengajar di Malang sesuai tipe belajar santri. Sabar dan telaten.",
        certifications: [
            { name: "Sertifikat Kompetensi Mengajar", url: URL_CERT_KOMPETENSI }
        ],
        experience: 5,
        isVerified: true,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/-odgOHrUF9Y?si=QCsrAUHTrq7HZy5K", "https://www.youtube.com/embed/-BAo6wW7IHM?si=OwRaaAGjCKqpJRCw", ""],
        languages: ["Indonesia", "Inggris"],
    },
    {
        id: "38",
        name: "Thisya Putri",
        avatar: "https://c.superprof.com/i/m/27178939/600/20251231034158/27178939.webp",
        rating: 4.9,
        reviewCount: 77,
        location: "Kab. Malang",
        pricePerSession: 40000,
        packages: generateStandardPackages(40000, "38"),
        methods: ["Iqro", "Wafa"],
        sessions: ["afternoon"],
        specialization: ["Tahsin"],
        bio: "Membantu anak-anak desa di Malang belajar Quran Iqro dan Wafa.",
        certifications: [
            { name: "Sertifikat Kompetensi Pengajar", url: URL_CERT_KOMPETENSI }
        ],
        experience: 8,
        isVerified: true,
        badgeType: "guru-super",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/gF0aUmXe8dg?si=a7SxvxHWGfs2M-qx", "https://www.youtube.com/embed/aJjXrgxm0vo?si=ZABOY3c0TxcFpket", ""],
        languages: ["Indonesia", "Inggris"],
    },
    {
        id: "39",
        name: "Husnul Khotimah",
        avatar: "https://c.superprof.com/i/m/32046510/600/20240719134840/32046510.webp",
        rating: 4.7,
        reviewCount: 33,
        location: "Kota Blitar",
        pricePerSession: 45000,
        packages: generateStandardPackages(45000, "39"),
        methods: ["Grand PQ", "Dirosa"],
        sessions: ["morning", "night"],
        specialization: ["Tahsin"],
        bio: "Fokus pada mualaf dan pemula di Blitar. Belajar step-by-step sampai fasih.",
        certifications: [
            { name: "Sertifikat Kompetensi Dirosa", url: URL_CERT_KOMPETENSI }
        ],
        experience: 4,
        isVerified: true,
        badgeType: "rekomendasi",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/2_o1elmenEM?si=rHGTuUP9M-vOkI-w", "https://www.youtube.com/embed/YS7WeiCSjGI?si=74OJyGe9pxXcQk4u", ""],
        languages: ["Indonesia", "Arab"],
    },
    {
        id: "40",
        name: "Fateh Muhammad",
        avatar: "https://c.superprof.com/i/m/34286066/600/20250105165553/34286066.webp",
        rating: 4.8,
        reviewCount: 119,
        location: "Kota Surabaya",
        pricePerSession: 60000,
        packages: generateStandardPackages(60000, "40"),
        methods: ["Talaqqi", "An-Nahdliyah"],
        sessions: ["night"],
        specialization: ["Sanad"],
        bio: "Bimbingan Talaqqi bersanad di Surabaya Barat. Melayani perbaikan bacaan intens.",
        certifications: [
            { name: "Ijazah Sanad Matan Jazari", url: URL_CERT_SANAD }
        ],
        experience: 11,
        isVerified: true,
        badgeType: "duta-besar",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/r511D8vWP18?si=GQDMAzqVrn1scTT0", "https://www.youtube.com/embed/JEB-88Hr8A8?si=hpHVx-_NhtvdqE2W", ""],
        languages: ["Indonesia", "Arab", "Inggris"],
    },
    {
        id: "41",
        name: "Zahra Nisa",
        avatar: "https://c.superprof.com/i/m/18795677/600/20230520165733/18795677.webp",
        rating: 4.9,
        reviewCount: 205,
        location: "Jakarta Selatan",
        pricePerSession: 95000,
        packages: generateStandardPackages(95000, "41"),
        methods: ["Yanbu'a", "Tafsir"],
        sessions: ["morning", "night"],
        specialization: ["Tafsir", "Tahfidz"],
        bio: "Elite Quran Coach di Jakarta Selatan. Kurikulum terintegrasi Yanbu'a dan Tafsir.",
        certifications: [
            { name: "Ijazah Yanbu'a Internasional", url: URL_CERT_SANAD }
        ],
        experience: 14,
        isVerified: true,
        badgeType: "duta-besar",
        gallery: DUMMY_GALLERY,
        videoUrls: ["https://www.youtube.com/embed/TiD1sOPStA8?si=yUoEWxtg19IzzIbm", "https://www.youtube.com/embed/waeB6JYxE2A?si=Ooc0bIzBXygRXyAl", ""],
        languages: ["Indonesia", "Arab", "Inggris", "Turki"],
    }
];
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface SyllabusTopicDto {
    order: number
    title: string
    duration: number
}

export interface SyllabusModuleDto {
    order: number
    title: string
    description: string | null
    duration: number | null
    topics: SyllabusTopicDto[]
}
/** Representasi satu kursus — sesuai skema endpoint API */
export interface CourseDto {
    id: string
    teacherId: string

    // Konten utama
    title: string
    categoryId: number | null
    organizationId: number | null
    description: string | null
    shortDescription: string | null
    thumbnail: string | null
    images: string[]
    videoUrl: string | null
    previewUrl: string | null

    // Klasifikasi
    level: number          // 1=Pemula, 2=Menengah, 3=Mahir, 4=Semua Level
    mode: number           // 1=Online, 2=Offline, 3=Hybrid
    courseType: string     // "private" | "group" | "webinar"
    language: string | null
    subtitles: string[] | null

    // Lokasi
    location: string | null
    address: string | null
    countryCode: string | null
    city: string | null
    latitude: number | null
    longitude: number | null
    timezone: string | null

    // Sesi & silabus
    duration: number       // durasi per sesi (menit)
    totalSessions: number
    syllabus: SyllabusModuleDto[]

    // Harga
    hourlyRate: number
    sessionPrice: number | null
    packagePrice: number | null
    discountPrice: number | null
    discountUntil: string | null
    currency: string       // default "IDR"
    isFree: number

    // Kapasitas
    maxStudents: number | null
    minStudents: number | null

    // Sertifikat & kualifikasi
    hasCertificate: number
    certificateTemplateId: number | null
    learningOutcomes: string[] | null
    requirements: string[] | null
    targetAudience: string | null
    skills: string[] | null
    tags: string[] | null
    ageRestriction: number | null

    // SEO
    metaTitle: string | null
    metaDescription: string | null

    // Status — TIDAK ditampilkan di form konten, dikelola dari list/detail
    isActive: boolean
    isPublic: boolean

    // Metadata
    students: number
    rating: number
    reviews: number
    createdAt: string
    updatedAt: string
}

/** Data yang dikirim saat create / update (tanpa id, status, metadata) */
export type CourseCreateInput = Omit<
    CourseDto,
    'id' | 'teacherId' | 'isActive' | 'isPublic' | 'students' | 'rating' | 'reviews' | 'createdAt' | 'updatedAt'
>

export type CourseUpdateInput = Partial<CourseCreateInput> & { isActive?: boolean }

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const COURSE_LS_KEY = "teacher_api_courses_v5"

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readStorage(): CourseDto[] {
    if (typeof window === "undefined") return []
    try {
        const raw = localStorage.getItem(COURSE_LS_KEY)
        return raw ? (JSON.parse(raw) as CourseDto[]) : []
    } catch {
        return []
    }
}

function writeStorage(courses: CourseDto[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(COURSE_LS_KEY, JSON.stringify(courses))
}

function generateId(): string {
    return "course-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7)
}

/**
 * Pastikan seed data ada di localStorage.
 * Dipanggil sekali saat aplikasi pertama kali dimuat.
 */
export function ensureSeedData(): void {
    if (typeof window === "undefined") return
    const existing = readStorage()

    // Cek apakah data paket seed sudah ada di dalam storage. Jika ya, biarkan agar state ter-maintain.
    const hasSeedData = existing.some(c => c.id && c.id.startsWith("paket4-"));
    if (hasSeedData) {
        return;
    }

    const userCreated = existing.filter(c => c.id && !c.id.startsWith("paket-") && !c.id.startsWith("paket2-") && !c.id.startsWith("paket3-") && !c.id.startsWith("paket4-"));
    let allSeedPackages: CourseDto[] = [];
    DUMMY_TRAINERS.forEach(t => {
        if (t.packages) {
            allSeedPackages = [...allSeedPackages, ...t.packages];
        }
    });
    writeStorage([...userCreated, ...allSeedPackages]);
}

/**
 * Pastikan seed data review ada di localStorage.
 * Dipanggil sekali saat aplikasi pertama kali dimuat.
 */
export function ensureReviewSeedData(): void {
    if (typeof window === "undefined") return;
    try {
        const existing = localStorage.getItem("myqurani_dummy_reviews");
        const parsed = existing ? JSON.parse(existing) : [];
        if (parsed.length > 0) return; // Sudah ada review
        
        let allSeedReviews: any[] = [];
        DUMMY_TRAINERS.forEach(t => {
            const staticReviews = getDummyReviewsForTrainer(t.id);
            const mapped = staticReviews.map((r: any) => ({
                id: `DUMMY-REV-${r.id}`,
                bookingId: `DUMMY-BOOKING-${r.id}`,
                courseId: "dummy-course",
                teacherId: t.id,
                studentName: r.user,
                rating: r.rating,
                comment: r.comment,
                createdAt: r.date,
            }));
            allSeedReviews = [...allSeedReviews, ...mapped];
        });
        
        localStorage.setItem("myqurani_dummy_reviews", JSON.stringify(allSeedReviews));
    } catch (e) {
        console.error("Failed to seed reviews", e);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API FUNCTIONS
// Nama & parameter sesuai endpoint API sesungguhnya.
// Nanti cukup ganti isi implementasi dengan fetch() tanpa ubah pemanggil.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/Courses?trainerId={teacherId}
 * Mengembalikan seluruh kursus milik guru tertentu.
 */
export function getCourses(teacherId: string): CourseDto[] {
    const courses = readStorage()
    return courses.filter((c) => c.teacherId === teacherId)
}

/**
 * GET /api/v1/Courses/{id}
 * Mengembalikan satu objek kursus lengkap berdasarkan ID.
 * Mengembalikan null jika tidak ditemukan.
 */
export function getCourseById(courseId: string): CourseDto | null {
    const courses = readStorage()
    return courses.find((c) => c.id === courseId) ?? null
}

/**
 * POST /api/v1/Courses
 * Membuat kursus baru.
 * Default: isActive = true, isPublic = false (status Draft).
 */
export function createCourse(data: CourseCreateInput & { teacherId: string }): CourseDto {
    const courses = readStorage()
    const now = new Date().toISOString()
    const newCourse: CourseDto = {
        ...data,
        id: generateId(),
        isActive: true,
        isPublic: false,
        students: 0,
        rating: 0,
        reviews: 0,
        createdAt: now,
        updatedAt: now,
    }
    courses.unshift(newCourse)
    writeStorage(courses)
    return newCourse
}

/**
 * PUT /api/v1/Courses/{id}
 * Memperbarui field konten kursus (bukan status).
 * Mengembalikan kursus yang telah diperbarui, atau null jika tidak ditemukan.
 */
export function updateCourse(courseId: string, data: CourseUpdateInput): CourseDto | null {
    const courses = readStorage()
    const idx = courses.findIndex((c) => c.id === courseId)
    if (idx === -1) return null
    const updated: CourseDto = {
        ...courses[idx],
        ...data,
        updatedAt: new Date().toISOString(),
    }
    courses[idx] = updated
    writeStorage(courses)
    return updated
}

/**
 * POST /api/v1/Courses/{id}/publish
 * Mempublikasikan kursus ke marketplace (isPublic = true).
 * Mengembalikan kursus yang diperbarui, atau null jika tidak ditemukan.
 */
export function publishCourse(courseId: string): CourseDto | null {
    return updateCourse(courseId, { isPublic: true } as CourseUpdateInput)
}

/**
 * POST /api/v1/Courses/{id}/unpublish
 * Menarik kursus dari marketplace (isPublic = false).
 * Mengembalikan kursus yang diperbarui, atau null jika tidak ditemukan.
 */
export function unpublishCourse(courseId: string): CourseDto | null {
    return updateCourse(courseId, { isPublic: false } as CourseUpdateInput)
}

/**
 * POST /api/v1/Courses/{id}/clone
 * Menduplikasi kursus menjadi kursus baru.
 * Kursus hasil duplikat selalu dimulai dengan isPublic = false (Draft).
 */
export function cloneCourse(courseId: string): CourseDto | null {
    const source = getCourseById(courseId)
    if (!source) return null
    const now = new Date().toISOString()
    const cloned: CourseDto = {
        ...source,
        id: generateId(),
        title: source.title + " (Salinan)",
        isPublic: false,
        isActive: true,
        students: 0,
        rating: 0,
        reviews: 0,
        createdAt: now,
        updatedAt: now,
    }
    const courses = readStorage()
    const srcIdx = courses.findIndex((c) => c.id === courseId)
    courses.splice(srcIdx + 1, 0, cloned)
    writeStorage(courses)
    return cloned
}

/**
 * DELETE /api/v1/Courses/{id}
 * Menghapus kursus secara permanen.
 * Mengembalikan true jika berhasil, false jika tidak ditemukan.
 */
export function deleteCourse(courseId: string): boolean {
    const courses = readStorage()
    const idx = courses.findIndex((c) => c.id === courseId)
    if (idx === -1) return false
    courses.splice(idx, 1)
    writeStorage(courses)
    return true
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Derive status badge from course flags
// ─────────────────────────────────────────────────────────────────────────────

export type CourseStatus = "draft" | "live" | "inactive"

/**
 * Mengembalikan status kursus berdasarkan flag isActive & isPublic.
 * - "draft"    → isPublic === false
 * - "live"     → isPublic === true && isActive === true
 * - "inactive" → isActive === false
 */
export function getCourseStatus(course: Pick<CourseDto, "isActive" | "isPublic">): CourseStatus {
    if (!course.isActive) return "inactive"
    if (!course.isPublic) return "draft"
    return "live"
}

export const COURSE_STATUS_CONFIG: Record<
    CourseStatus,
    { label: string; color: string; dotColor: string }
> = {
    draft: {
        label: "Draft",
        color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400",
        dotColor: "bg-amber-500",
    },
    live: {
        label: "Publik",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400",
        dotColor: "bg-emerald-500",
    },
    inactive: {
        label: "Nonaktif",
        color: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
        dotColor: "bg-slate-400",
    },
}


export const DUMMY_CATEGORIES = [
    { id: 1, name: 'Akademik' },
    { id: 2, name: 'Non-Akademik' },
    { id: 3, name: 'Tahsin' },
    { id: 4, name: 'Tahfidz' }
];

DUMMY_TRAINERS_BASE.forEach(trainer => {
    trainer.packages = generateStandardPackages(trainer.pricePerSession, trainer.id, trainer.specialization);
});

const REVIEW_COMMENTS = [
    "Sangat puas dengan cara mengajar beliau. Penjelasannya sangat detail terutama pada bagian makharijul huruf.",
    "Metode yang digunakan sangat efektif. Saya merasa ada kemajuan pesat dalam tajwid saya.",
    "Waktunya tepat dan sangat profesional. Sangat membantu saya dalam memperbaiki bacaan harian saya.",
    "Alhamdulillah, anak saya sangat senang mengaji dengan ustadz/ustadzah. Sabar dan telaten.",
    "Sangat direkomendasikan untuk pemula yang baru belajar membaca Al-Quran dari nol.",
    "Koreksi bacaannya sangat detail, jadi saya tahu di mana letak kesalahan panjang pendeknya.",
    "Pendekatannya sangat ramah dan membuat suasana belajar mengaji jadi tidak tegang.",
    "Sangat menguasai materi tajwid dan tahsin. Penjelasannya mudah dipahami.",
    "Terima kasih atas bimbingannya. Sekarang saya lebih percaya diri saat membaca Al-Quran.",
    "Jadwalnya fleksibel dan selalu tepat waktu. Sangat cocok untuk saya yang bekerja."
];

const REVIEW_TAGS = [
    ["Sangat Sabar", "Penjelasan Detail"],
    ["Metode Efektif", "Progress Cepat"],
    ["Profesional", "Tepat Waktu"],
    ["Ramah Anak", "Telaten"],
    ["Cocok Pemula", "Komunikatif"],
    ["Koreksi Detail", "Tajwid Bagus"],
    ["Suasana Nyaman", "Ramah"],
    ["Materi Dikuasai", "Mudah Dipahami"],
    ["Membangun Percaya Diri", "Motivatif"],
    ["Jadwal Fleksibel", "Disiplin"]
];

const USERS = [
    "Ahmad Bagir", "Siti Aisyah", "Fahri Hamzah", "Budi Santoso", "Andi Wijaya",
    "Rina Amelia", "Dian Fitri", "Eka Saputra", "Nurul Hidayah", "Rizki Maulana",
    "Hendra Pratama", "Maya Sari", "Agus Setiawan", "Indra Kusuma", "Dewi Lestari"
];

const RECOMMENDATION_TEXTS = [
    "Sangat merekomendasikan kelas ini karena gurunya sabar dan telaten.",
    "Metode pembelajarannya sangat mudah dipahami. Highly recommended!",
    "Bagi yang baru belajar dari nol, guru ini sangat tepat. Penjelasannya detail.",
    "Waktu belajar sangat fleksibel dan guru sangat komunikatif.",
    "Banyak kemajuan yang saya rasakan setelah mengikuti kelas ini."
];

const TEACHER_RESPONSES = [
    "Terima kasih atas ulasannya! Semoga ilmunya berkah dan bermanfaat.",
    "Alhamdulillah, senang bisa membantu. Tetap semangat belajarnya ya!",
    "Terima kasih, sampai jumpa di pertemuan berikutnya.",
    "Aamiin, terima kasih atas doanya. Terus tingkatkan hafalannya.",
    "Syukran atas feedback-nya, semoga istiqamah dalam belajar Al-Quran."
];

const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

export const getDummyReviewsForTrainer = (trainerId: string) => {
    const hash = hashString(trainerId);
    // Determine how many reviews this trainer gets (between 10 and 25)
    const numReviews = 10 + (hash % 16);

    const reviews = [];
    for (let i = 0; i < numReviews; i++) {
        const reviewHash = hashString(`${trainerId}-${i}`);

        // Randomize based on reviewHash
        const user = USERS[reviewHash % USERS.length];
        const commentIdx = reviewHash % REVIEW_COMMENTS.length;
        const comment = REVIEW_COMMENTS[commentIdx];
        const tags = REVIEW_TAGS[commentIdx];

        // Ratings weighted heavily towards 4 and 5
        const ratingRoll = reviewHash % 100;
        let rating = 5;
        if (ratingRoll < 5) rating = 1;
        else if (ratingRoll < 10) rating = 2;
        else if (ratingRoll < 20) rating = 3;
        else if (ratingRoll < 40) rating = 4;

        const dateObj = new Date(Date.now() - (reviewHash % 100) * 86400000 - (reviewHash % 24) * 3600000);
        
        const recommendationText = (rating >= 4 && (reviewHash % 5 !== 0)) 
            ? RECOMMENDATION_TEXTS[reviewHash % RECOMMENDATION_TEXTS.length] 
            : undefined;
            
        const responseText = (reviewHash % 3 === 0) 
            ? TEACHER_RESPONSES[reviewHash % TEACHER_RESPONSES.length] 
            : undefined;

        reviews.push({
            id: reviewHash,
            user,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.replace(/ /g, '')}`,
            rating,
            dateKey: "some_time_ago", // Simplification
            date: dateObj.toISOString(),
            comment,
            tags,
            isRecommended: rating >= 4 && (reviewHash % 5 !== 0),
            recommendationText,
            response: responseText,
            responseDate: responseText ? new Date(dateObj.getTime() + 86400000).toISOString() : undefined

        });
    }

    // Sort by rating descending just to have good ones on top usually
    return reviews.sort((a, b) => b.rating - a.rating);
};

export const CERT_IMAGES = [
    "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600",
];

export const RATING_DIST = [
    { stars: 5, percent: 78 },
    { stars: 4, percent: 15 },
    { stars: 3, percent: 5 },
    { stars: 2, percent: 1 },
    { stars: 1, percent: 1 },
];

export const METHOD_DESCRIPTIONS: Record<string, { summaryKey: string; defaultSummary: string; icon: string }> = {
    "Ummi": {
        summaryKey: "marketplace_detail.method_ummi_desc",
        defaultSummary: "Metode pembelajaran Al-Quran yang menekankan pada kelancaran membaca dengan pendekatan ibu (Ummi)...",
        icon: "📗"
    },
    "Qiroati": {
        summaryKey: "marketplace_detail.method_qiroati_desc",
        defaultSummary: "Metode klasik yang dikembangkan oleh KH. Dachlan Salim Zarkasyi...",
        icon: "📕"
    },
    "Tilawati": {
        summaryKey: "marketplace_detail.method_tilawati_desc",
        defaultSummary: "Metode yang menggabungkan pendekatan klasikal dan individual dengan irama rost...",
        icon: "🎵"
    },
    "Al-Baghdadi": {
        summaryKey: "marketplace_detail.method_al_baghdadi_desc",
        defaultSummary: "Metode tradisional tertua dalam pembelajaran Al-Quran...",
        icon: "📜"
    },
    "Tartil": {
        summaryKey: "marketplace_detail.method_tartil_desc",
        defaultSummary: "Fokus pada membaca Al-Quran dengan tempo pelan dan jelas...",
        icon: "🕌"
    },
    "Talaqqi": {
        summaryKey: "marketplace_detail.method_talaqqi_desc",
        defaultSummary: "Metode belajar langsung dari guru ke murid secara tatap muka (musyafahah)...",
        icon: "🤝"
    },
    "Tafsir": {
        summaryKey: "marketplace_detail.method_tafsir_desc",
        defaultSummary: "Mempelajari makna dan tafsir ayat-ayat Al-Quran untuk memahami konteks...",
        icon: "📖"
    },
};

DUMMY_TRAINERS_BASE.forEach((trainer, idx) => {
    trainer.reviews = getDummyReviewsForTrainer(trainer.id);
    if (trainer.certifications && trainer.certifications.length > 0) {
        trainer.certifications.forEach((cert, i) => {
            if (!cert.url) {
                cert.url = CERT_IMAGES[i % CERT_IMAGES.length];
            }
        });
    }
});

export const DUMMY_TRAINERS = DUMMY_TRAINERS_BASE;



