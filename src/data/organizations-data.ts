// ============================================================
// MOCK ORGANIZATIONS — 4 tipe: Yayasan, Pesantren, Sekolah Quran, Komunitas
// Nama tanpa embel-embel daerah | Banner berbeda per organisasi
// ============================================================

// (no unused imports)

export const MOCK_ORGANIZATIONS = [
    {
        id: "ORG-001",
        name: "Yayasan Tahfidz Nusantara",
        description: "Yayasan terpadu pencetak generasi hafidz bersanad dengan lebih dari 50 pengajar bersertifikat internasional.",
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://i.pinimg.com/736x/00/94/8b/00948b77cb4aca92d918466eb22b6694.jpg",
        teachers: 12,
        isJoined: true,
        location: "Jakarta Selatan",
        type: "Yayasan"
    },
    {
        id: "ORG-002",
        name: "Rumah Qur'an Al-Fatih",
        description: "Berfokus pada pengajaran Tilawah dan Tajwid interaktif untuk anak-anak dan orang dewasa.",
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "http://www.multidesainarsitek.com/wp-content/uploads/2016/12/desain-arsitek-asrama-pondok-pesantren-walisongo-ngabar-2.jpg",
        teachers: 18,
        isJoined: false,
        location: "Bandung",
        type: "Sekolah Quran"
    },
    {
        id: "ORG-003",
        name: "Pesantren Darul Ulum",
        description: "Pesantren modern berbasis teknologi dengan kurikulum tahfidz, tahsin, dan kajian fiqh kontemporer.",
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://www.laduni.id/panel/themes/default/uploads/1Pesantren%20Salafiyah%20Safi%E2%80%99iyah%20Situbondo.jpg",
        teachers: 35,
        isJoined: false,
        location: "Yogyakarta",
        type: "Pesantren"
    },
    {
        id: "ORG-004",
        name: "Komunitas Hafidz Muda",
        description: "Gerakan anak muda muslim yang menjadikan hafalan Al-Qur'an sebagai gaya hidup positif generasi Z.",
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=900&auto=format&fit=crop",
        teachers: 12,
        isJoined: false,
        location: "Semarang",
        type: "Komunitas"
    },
    {
        id: "ORG-005",
        name: "Yayasan Ar-Rahman",
        description: "Yayasan sosial keagamaan fokus pendidikan Al-Qur'an inklusif untuk ibu-ibu, lansia, dan masyarakat dhuafa.",
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=900&auto=format&fit=crop",
        teachers: 22,
        isJoined: false,
        location: "Medan",
        type: "Yayasan"
    },
    {
        id: "ORG-006",
        name: "Ma'had Ulumul Qur'an",
        description: "Lembaga riset dan pendidikan Al-Qur'an akademis berstandar internasional dengan sanad bersambung ke Timur Tengah.",
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&auto=format&fit=crop",
        teachers: 28,
        isJoined: false,
        location: "Makassar",
        type: "Pesantren"
    },
    {
        id: "ORG-007",
        name: "Komunitas Kaligrafi Islami",
        description: "Komunitas seni Islam spesialis kaligrafi dan imla' Al-Qur'an dengan metode bersanad dari ulama Timur Tengah.",
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&auto=format&fit=crop",
        teachers: 15,
        isJoined: false,
        location: "Surabaya",
        type: "Komunitas"
    },
    {
        id: "ORG-008",
        name: "Sekolah Qur'an Al-Hikmah",
        description: "Sekolah Al-Qur'an unggulan dengan sistem boarding yang menggabungkan tahfidz intensif dan pendidikan formal.",
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1597534458220-9fb4969f2df5?w=900&auto=format&fit=crop",
        teachers: 41,
        isJoined: false,
        location: "Malang",
        type: "Sekolah Quran"
    },
    {
        id: "ORG-009",
        name: "Pesantren Darun Najah",
        description: "Pesantren salafiyah modern dengan tradisi keilmuan kuat, program qiroat sab'ah, dan sanad tinggi ke ulama Mekkah.",
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=900&auto=format&fit=crop",
        teachers: 30,
        isJoined: false,
        location: "Banda Aceh",
        type: "Pesantren"
    },
    {
        id: "ORG-010",
        name: "Komunitas Tilawah Bersama",
        description: "Komunitas pecinta tilawah Al-Qur'an yang aktif menyelenggarakan halaqah, lomba, dan kajian tafsir tematik.",
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=900&auto=format&fit=crop",
        teachers: 19,
        isJoined: false,
        location: "Banjarmasin",
        type: "Komunitas"
    }
]

export const MOCK_ORG_ACTIVITIES = [
    {
        id: 1,
        image: "https://www.smkn52jkt.sch.id/~img/img_20160904_wa0004-997b9-3044_265-twebp80.webp",
        description: "Pembekalan Rutin Guru",
        images: [
            "https://www.smkn52jkt.sch.id/~img/img_20160904_wa0004-997b9-3044_265-twebp80.webp",
            "https://cdn.antaranews.com/cache/1200x800/2022/04/22/IMG_20220422_181958.jpg",
            "https://smkn1warungasem.sch.id/wp-content/uploads/2022/03/rohis_result.webp",
            "https://i.pinimg.com/736x/00/94/8b/00948b77cb4aca92d918466eb22b6694.jpg"
        ]
    },
    {
        id: 2,
        image: "https://cdn.antaranews.com/cache/1200x800/2022/04/22/IMG_20220422_181958.jpg",
        description: "Santunan & Bakti Sosial",
        images: [
            "https://cdn.antaranews.com/cache/1200x800/2022/04/22/IMG_20220422_181958.jpg",
            "https://smkn1warungasem.sch.id/wp-content/uploads/2022/03/rohis_result.webp",
            "https://www.smkn52jkt.sch.id/~img/img_20160904_wa0004-997b9-3044_265-twebp80.webp"
        ]
    },
    {
        id: 3,
        image: "https://smkn1warungasem.sch.id/wp-content/uploads/2022/03/rohis_result.webp",
        description: "Pelatihan Standarisasi Guru",
        images: [
            "https://smkn1warungasem.sch.id/wp-content/uploads/2022/03/rohis_result.webp",
            "https://i.pinimg.com/736x/00/94/8b/00948b77cb4aca92d918466eb22b6694.jpg",
            "https://www.smkn52jkt.sch.id/~img/img_20160904_wa0004-997b9-3044_265-twebp80.webp",
            "https://cdn.antaranews.com/cache/1200x800/2022/04/22/IMG_20220422_181958.jpg"
        ]
    },
    {
        id: 4,
        image: "https://i.pinimg.com/736x/00/94/8b/00948b77cb4aca92d918466eb22b6694.jpg",
        description: "Wisuda Santri Angkatan XII",
        images: [
            "https://i.pinimg.com/736x/00/94/8b/00948b77cb4aca92d918466eb22b6694.jpg"
        ]
    }
]

export const MOCK_ORGANIZATIONS_DETAIL: Record<string, any> = {
    "ORG-001": {
        id: "ORG-001",
        name: "Yayasan Tahfidz Nusantara",
        category: "Yayasan",
        city: "Jakarta Selatan",
        memberCount: 12,
        rating: 4.8,
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=900&auto=format&fit=crop",
        description: "Yayasan Tahfidz Nusantara adalah organisasi pendidikan Islam terpadu yang berdedikasi dalam mencetak generasi Qur'ani berakhlak mulia dan berwawasan global. Berdiri sejak 2010, yayasan ini menaungi lebih dari 50 guru bersertifikat internasional dengan kurikulum tahfidz bersanad yang intensif. Setiap santri dibimbing untuk tidak sekadar hafal lafaz Al-Qur'an, tetapi juga memahami dan mengamalkan nilai-nilainya. Program unggulan kami mencakup jalur I'dad Muhaffidzhin yang mencetak kader pengajar tahfidz profesional siap terjun ke masyarakat.",
        vision: "Menjadi yayasan tahfidz terdepan yang mencetak generasi Qur'ani berakhlak mulia dan berwawasan global.",
        mission: [
            "Menyelenggarakan program tahfidz bersanad dengan metode mutakhir.",
            "Memberikan beasiswa penuh bagi santri berprestasi dari keluarga kurang mampu.",
            "Membangun lingkungan belajar islami, kondusif, dan berstandar internasional.",
            "Mencetak kader pengajar tahfidz yang terampil dan berdedikasi tinggi."
        ],
        programs: ["Tahfidz Anak & Balita", "Tahsin Dewasa", "I'dad Muhaffidzhin", "Kajian Tafsir Tematik"],
        facilities: ["Masjid Jami' Kapasitas 500 Jamaah", "Asrama Putra & Putri", "Perpustakaan Digital 5.000+ Judul", "Studio Rekaman Tilawah"],
        establishedYear: 2010,
        totalAlumni: 1250,
        address: "Jl. Tebet Barat No. 45, Tebet, Jakarta Selatan",
        contact: "+62 812-1111-2222",
        joinedDate: "12 Okt 2025",
        myStats: {
            studentsActive: 12,
            totalHours: 48,
            rating: 4.9
        },
        announcements: [
            { id: 1, title: "Jadwal Evaluasi Bulanan Guru", date: "Hari ini, 08:00", desc: "Diharapkan kehadiran seluruh asatidz untuk evaluasi KBM bulan ini via Zoom." },
            { id: 2, title: "Pendaftaran Sertifikasi Qiroati", date: "3 hari lalu", desc: "Pendaftaran sertifikasi lanjutan sudah dibuka dengan subsidi biaya dari internal yayasan." }
        ],
        colleagues: [
            { name: "Ust. Fulan", role: "Koordinator", avatar: "https://ui-avatars.com/api/?name=F&background=0284c7&color=fff" },
            { name: "Ustzh. Aisyah", role: "Pengajar Senior", avatar: "https://ui-avatars.com/api/?name=A&background=e11d48&color=fff" },
            { name: "Ust. Hasan", role: "Pengajar", avatar: "https://ui-avatars.com/api/?name=H&background=ca8a04&color=fff" }
        ],
        classes: [
            { id: "c1", name: "Tahfidz Anak - Kelas Abu Bakar", time: "Senin & Rabu, 16.00 WIB", students: 8, status: "Berjalan" },
            { id: "c2", name: "Tahsin Dewasa - Kelas Umar", time: "Sabtu, 08.00 WIB", students: 12, status: "Berjalan" }
        ],
        adminStats: {
            teachers: 12,
            activeStudents: 84,
            pendingRequests: 5,
            sessionsCompleted: 128
        },
        activities: MOCK_ORG_ACTIVITIES
    },

    "ORG-002": {
        id: "ORG-002",
        name: "Rumah Qur'an Al-Fatih",
        category: "Sekolah Quran",
        city: "Bandung",
        memberCount: 18,
        rating: 4.5,
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=900&auto=format&fit=crop",
        description: "Rumah Qur'an Al-Fatih adalah sekolah Al-Qur'an modern yang berfokus pada pengajaran Tilawah dan Tajwid interaktif untuk berbagai usia, dari balita hingga orang dewasa. Menggunakan metode pembelajaran yang menyenangkan dan jauh dari tekanan, kami memastikan setiap santri dapat menyerap ilmu dengan optimal. Suasana kelas dirancang hangat bak rumah sendiri, mendorong santri untuk aktif bertanya, berdiskusi, dan tumbuh bersama dalam naungan Al-Qur'an. Visi kami adalah menghadirkan satu penghafal dari setiap keluarga Muslim di Indonesia.",
        vision: "Menghadirkan pesona Al-Qur'an di setiap keluarga Muslim Indonesia.",
        mission: [
            "Mensosialisasikan pentingnya membaca Al-Qur'an dengan tartil sejak usia dini.",
            "Menyelenggarakan kelas tahsin dan tahfidz untuk semua jenjang usia.",
            "Membina komunitas pecinta Al-Qur'an yang aktif, solutif, dan saling mendukung.",
            "Mengembangkan metode pembelajaran yang inovatif dan menyenangkan."
        ],
        programs: ["Tahsin Pemula", "Tajwid Interaktif", "Tahfidz Akhir Pekan", "Dirosa (Program Dewasa)"],
        facilities: ["Ruang Kelas Ber-AC", "Area Bermain Edukatif Anak", "Kafetaria Halal", "Pojok Baca Islami"],
        establishedYear: 2018,
        totalAlumni: 840,
        address: "Jl. Dago No. 123, Coblong, Bandung",
        contact: "+62 812-3333-4444",
        joinedDate: "05 Jan 2026",
        myStats: {
            studentsActive: 5,
            totalHours: 15,
            rating: 4.7
        },
        announcements: [
            { id: 1, title: "Libur Awal Ramadhan", date: "Hari ini", desc: "KBM akan diliburkan pada 3 hari pertama Ramadhan. Jadwal akan dikirim via grup." },
            { id: 2, title: "Pendaftaran Kelas Baru Dibuka", date: "2 hari lalu", desc: "Kelas Tahsin Pemula batch baru dibuka dengan diskon 20% untuk pendaftar pertama." }
        ],
        colleagues: [
            { name: "Ust. Ziyad", role: "Pengajar Tilawah", avatar: "https://ui-avatars.com/api/?name=Z&background=059669&color=fff" },
            { name: "Ustzh. Salma", role: "Pengajar Anak", avatar: "https://ui-avatars.com/api/?name=S&background=d97706&color=fff" }
        ],
        classes: [
            { id: "c1", name: "Tahsin Pemula - Grup Melati", time: "Selasa & Kamis, 16.00 WIB", students: 10, status: "Berjalan" },
            { id: "c2", name: "Tahfidz Anak Akhir Pekan", time: "Sabtu & Ahad, 08.00 WIB", students: 12, status: "Berjalan" }
        ],
        adminStats: {
            teachers: 18,
            activeStudents: 62,
            pendingRequests: 2,
            sessionsCompleted: 85
        },
        activities: MOCK_ORG_ACTIVITIES
    },

    "ORG-003": {
        id: "ORG-003",
        name: "Pesantren Darul Ulum",
        category: "Pesantren",
        city: "Yogyakarta",
        memberCount: 35,
        rating: 4.7,
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=900&auto=format&fit=crop",
        description: "Pesantren Darul Ulum hadir sebagai pelopor inovasi pendidikan Al-Qur'an berbasis teknologi di Indonesia. Menggabungkan nilai-nilai pesantren tradisional dengan platform digital mutakhir, kami menawarkan pengalaman belajar yang fleksibel, efektif, dan tetap bersanad. Ribuan santri dari seluruh penjuru nusantara telah merasakan manfaat kurikulum modern yang mencakup tahfidz, tahsin, tafsir, hingga fiqh kontemporer. Tim pengajar terseleksi ketat bersama dukungan teknologi menjadikan Darul Ulum sebagai jembatan antara tradisi ulama dan kebutuhan generasi masa kini.",
        vision: "Menjadi pesantren terdepan yang memadukan tradisi keilmuan Islam klasik dengan inovasi teknologi.",
        mission: [
            "Mengembangkan platform e-learning Al-Qur'an yang inklusif dan terjangkau.",
            "Melatih pengajar dengan kompetensi digital dan keilmuan yang seimbang.",
            "Menyediakan konten Qur'ani berkualitas tinggi yang dapat diakses seluruh Indonesia.",
            "Membangun ekosistem belajar kolaboratif antara pesantren tradisional dan digital."
        ],
        programs: ["Tahfidz Online Intensif", "Tahsin Digital", "Kajian Tafsir Interaktif", "Fiqh Kontemporer"],
        facilities: ["Studio Rekaman HD", "Platform LMS Mandiri", "Perpustakaan Digital 10.000+ Buku", "Ruang Webinar 500 Kapasitas"],
        establishedYear: 2017,
        totalAlumni: 3200,
        address: "Jl. Kaliurang KM 8.5, Sleman, Yogyakarta",
        contact: "+62 812-5555-6666",
        joinedDate: null,
        myStats: null,
        announcements: [
            { id: 1, title: "Batch Baru Tahfidz Online Dibuka", date: "2 hari lalu", desc: "Pendaftaran batch ke-12 program Tahfidz Online Intensif resmi dibuka." },
            { id: 2, title: "Workshop Metode Pembelajaran Digital", date: "1 minggu lalu", desc: "Workshop gratis untuk calon pengajar yang ingin bergabung bersama Darul Ulum." }
        ],
        colleagues: [
            { name: "Ust. Ibrahim", role: "Direktur Program", avatar: "https://ui-avatars.com/api/?name=I&background=7c3aed&color=fff" },
            { name: "Ustzh. Khadijah", role: "Pengajar Senior", avatar: "https://ui-avatars.com/api/?name=K&background=db2777&color=fff" }
        ],
        classes: [
            { id: "c1", name: "Tahfidz Online - Kelas Ali", time: "Selasa & Kamis, 19.00 WIB", students: 20, status: "Berjalan" },
            { id: "c2", name: "Tahsin Digital - Kelas Utsman", time: "Sabtu & Ahad, 09.00 WIB", students: 15, status: "Berjalan" },
            { id: "c3", name: "Kajian Tafsir Al-Baqarah", time: "Jumat, 20.00 WIB", students: 45, status: "Berjalan" }
        ],
        adminStats: {
            teachers: 35,
            activeStudents: 280,
            pendingRequests: 12,
            sessionsCompleted: 410
        },
        activities: MOCK_ORG_ACTIVITIES
    },

    "ORG-004": {
        id: "ORG-004",
        name: "Komunitas Hafidz Muda",
        category: "Komunitas",
        city: "Semarang",
        memberCount: 15,
        rating: 4.5,
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=900&auto=format&fit=crop",
        description: "Komunitas Hafidz Muda adalah gerakan anak muda Muslim yang bersemangat menjadikan hafalan Al-Qur'an sebagai gaya hidup positif generasi milenial dan Gen-Z. Dengan pendekatan yang segar, modern, dan penuh energi, kami membuktikan bahwa menghafal Al-Qur'an justru membuat hidup lebih produktif dan bermakna. Program kami dirancang dengan sistem gamifikasi, mentoring sebaya, dan komunitas yang solid agar para hafidz muda tetap istiqomah dan semangat dalam perjalanan hafalannya.",
        vision: "Menjadikan generasi muda Indonesia bangga dan bersemangat menjadi hafidz Al-Qur'an.",
        mission: [
            "Menciptakan ekosistem komunitas hafidz yang supportif dan menyenangkan.",
            "Mengintegrasikan program tahfidz dengan kegiatan pengembangan diri dan karier.",
            "Menginspirasi lebih banyak anak muda untuk memulai perjalanan tahfidz.",
            "Mempersiapkan hafidz muda untuk berkontribusi nyata di masyarakat luas."
        ],
        programs: ["Tahfidz 1 Juz 30 Hari", "Muroja'ah Komunal", "Mentoring Hafidz Sebaya", "Seminar Produktivitas Hafidz"],
        facilities: ["Ruang Halaqah Modern", "Aplikasi Muroja'ah Mandiri", "Podcast Studio Qurani", "Rooftop Kajian Malam"],
        establishedYear: 2019,
        totalAlumni: 480,
        address: "Jl. Pemuda No. 150, Semarang Tengah",
        contact: "+62 813-2222-3333",
        joinedDate: null,
        myStats: null,
        announcements: [
            { id: 1, title: "Challenge Hafalan 30 Hari Dimulai", date: "Hari ini", desc: "Ikuti challenge hafalan 1 juz dalam 30 hari bersama 500+ peserta dari seluruh Indonesia!" },
            { id: 2, title: "Gathering Hafidz Muda Jawa Tengah", date: "4 hari lalu", desc: "Gathering akbar hafidz muda se-Jawa Tengah diadakan bulan depan di Semarang." }
        ],
        colleagues: [
            { name: "Ust. Riyadh", role: "Founder & Pembina", avatar: "https://ui-avatars.com/api/?name=R&background=0369a1&color=fff" },
            { name: "Ustzh. Nadia", role: "Koordinator Akhwat", avatar: "https://ui-avatars.com/api/?name=N&background=a21caf&color=fff" }
        ],
        classes: [
            { id: "c1", name: "Tahfidz 30 Hari - Batch 5", time: "Setiap Hari, 05.30 WIB (Online)", students: 50, status: "Berjalan" },
            { id: "c2", name: "Muroja'ah Komunal Mingguan", time: "Ahad, 07.00 WIB", students: 35, status: "Berjalan" }
        ],
        adminStats: {
            teachers: 15,
            activeStudents: 210,
            pendingRequests: 8,
            sessionsCompleted: 175
        },
        activities: MOCK_ORG_ACTIVITIES
    },

    "ORG-005": {
        id: "ORG-005",
        name: "Yayasan Ar-Rahman",
        category: "Yayasan",
        city: "Medan",
        memberCount: 22,
        rating: 4.6,
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=900&auto=format&fit=crop",
        description: "Yayasan Ar-Rahman berdiri dengan misi mulia mendekatkan seluruh lapisan masyarakat kepada Al-Qur'an, dengan perhatian khusus pada ibu-ibu rumah tangga dan kalangan lansia yang selama ini kurang mendapat akses pendidikan Al-Qur'an. Dengan pendekatan yang sabar, penuh kasih sayang, dan tidak menghakimi, para pengajar kami terlatih khusus menghadapi keunikan kelompok dewasa dan lanjut usia. Yayasan ini aktif menjalankan program mobile ke masjid dan mushola, mewujudkan pendidikan Al-Qur'an yang merata di seluruh wilayah.",
        vision: "Tidak ada satu pun Muslim yang buta huruf Al-Qur'an karena keterbatasan akses.",
        mission: [
            "Menyelenggarakan kelas tahsin inklusif untuk semua usia tanpa terkecuali.",
            "Mendatangkan pengajar langsung ke komunitas dan masjid yang membutuhkan.",
            "Menyediakan beasiswa tahsin bagi masyarakat dhuafa dan lanjut usia.",
            "Melatih kader pengajar tahsin yang sabar, terampil, dan penuh empati."
        ],
        programs: ["Tahsin Ibu-Ibu", "Tahsin Lansia", "Tahsin Mobile Masjid", "Kelas Makhraj Intensif"],
        facilities: ["5 Cabang Kelas Aktif", "Perpustakaan Al-Qur'an Braille", "Unit Kelas Keliling", "Ruang Konsultasi Tajwid"],
        establishedYear: 2013,
        totalAlumni: 1890,
        address: "Jl. Sisingamangaraja No. 200, Medan Selatan",
        contact: "+62 812-9999-0000",
        joinedDate: null,
        myStats: null,
        announcements: [
            { id: 1, title: "Pembukaan Cabang Ke-6", date: "Hari ini", desc: "Alhamdulillah, cabang baru resmi dibuka dan siap menerima pendaftaran santri." },
            { id: 2, title: "Rekrutmen Pengajar Mobile", date: "5 hari lalu", desc: "Dibutuhkan 5 pengajar mobile untuk program jemput bola ke masjid dan mushola." }
        ],
        colleagues: [
            { name: "Ustzh. Rohimah", role: "Koordinator Ibu-Ibu", avatar: "https://ui-avatars.com/api/?name=R&background=0891b2&color=fff" },
            { name: "Ust. Taufik", role: "Pengajar Senior", avatar: "https://ui-avatars.com/api/?name=T&background=15803d&color=fff" },
            { name: "Ustzh. Maryam", role: "Pengajar Lansia", avatar: "https://ui-avatars.com/api/?name=M&background=9333ea&color=fff" }
        ],
        classes: [
            { id: "c1", name: "Tahsin Ibu-Ibu - Grup Mawar", time: "Selasa & Kamis, 09.00 WIB", students: 18, status: "Berjalan" },
            { id: "c2", name: "Tahsin Lansia - Grup Anggrek", time: "Senin & Rabu, 10.00 WIB", students: 12, status: "Berjalan" },
            { id: "c3", name: "Kelas Mobile Masjid Al-Ikhlas", time: "Jumat, 13.00 WIB", students: 22, status: "Berjalan" }
        ],
        adminStats: {
            teachers: 22,
            activeStudents: 145,
            pendingRequests: 7,
            sessionsCompleted: 230
        },
        activities: MOCK_ORG_ACTIVITIES
    },

    "ORG-006": {
        id: "ORG-006",
        name: "Ma'had Ulumul Qur'an",
        category: "Pesantren",
        city: "Makassar",
        memberCount: 28,
        rating: 4.8,
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&auto=format&fit=crop",
        description: "Ma'had Ulumul Qur'an adalah lembaga riset dan pendidikan Al-Qur'an akademis yang berdiri di atas landasan keilmuan Islam yang kokoh. Didirikan oleh para akademisi dan ulama, ma'had ini memadukan pendekatan ilmiah dengan tradisi pesantren untuk menghasilkan lulusan yang tidak hanya hafal, tetapi juga memahami Al-Qur'an secara mendalam. Kami aktif menerbitkan jurnal ilmiah, menyelenggarakan seminar internasional, dan menjalin kemitraan dengan universitas Islam terkemuka di Timur Tengah.",
        vision: "Menjadi pusat studi Al-Qur'an berstandar internasional di kawasan Asia Pasifik.",
        mission: [
            "Menyelenggarakan program studi Al-Qur'an berjenjang dari dasar hingga lanjutan.",
            "Mempublikasikan hasil riset tentang ilmu Al-Qur'an secara berkala.",
            "Membangun kerja sama dengan lembaga Islam internasional terkemuka.",
            "Mencetak tenaga pengajar Al-Qur'an yang kompeten secara akademis dan ruhani."
        ],
        programs: ["Diploma Ulumul Qur'an", "Tahfidz Akademis", "Riset Tafsir Kontemporer", "Program Pertukaran Ulama"],
        facilities: ["Laboratorium Bahasa Arab", "Pusat Riset Qur'ani", "Masjid Kampus", "Asrama Mahasiswa"],
        establishedYear: 2011,
        totalAlumni: 740,
        address: "Jl. Sultan Alauddin No. 259, Makassar",
        contact: "+62 811-1234-5678",
        joinedDate: null,
        myStats: null,
        announcements: [
            { id: 1, title: "Seminar Internasional Ulumul Qur'an", date: "2 hari lalu", desc: "Seminar menghadirkan pembicara dari Al-Azhar dan Universitas Islam Madinah." },
            { id: 2, title: "Penerimaan Mahasiswa Baru Diploma", date: "1 minggu lalu", desc: "Program Diploma Ulumul Qur'an angkatan ke-8 resmi dibuka. Kuota terbatas." }
        ],
        colleagues: [
            { name: "Dr. Ust. Hamdan", role: "Direktur Ma'had", avatar: "https://ui-avatars.com/api/?name=H&background=1d4ed8&color=fff" },
            { name: "Ustzh. Sumayyah", role: "Dosen Tafsir", avatar: "https://ui-avatars.com/api/?name=S&background=be123c&color=fff" },
            { name: "Ust. Nawawi", role: "Dosen Tahfidz", avatar: "https://ui-avatars.com/api/?name=N&background=047857&color=fff" }
        ],
        classes: [
            { id: "c1", name: "Diploma Ulumul Qur'an Semester 1", time: "Senin-Jumat, 08.00 WIB", students: 30, status: "Berjalan" },
            { id: "c2", name: "Tahfidz Akademis - Kelas Intensif", time: "Senin-Sabtu, 05.00 & 18.00 WIB", students: 25, status: "Berjalan" }
        ],
        adminStats: {
            teachers: 28,
            activeStudents: 195,
            pendingRequests: 9,
            sessionsCompleted: 350
        },
        activities: MOCK_ORG_ACTIVITIES
    },

    "ORG-007": {
        id: "ORG-007",
        name: "Komunitas Kaligrafi Islami",
        category: "Komunitas",
        city: "Surabaya",
        memberCount: 12,
        rating: 4.6,
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&auto=format&fit=crop",
        description: "Komunitas Kaligrafi Islami adalah komunitas seni Islam yang mengkhususkan diri pada pengajaran kaligrafi Al-Qur'an dan imla' dengan metode tradisional yang diwariskan dari para ulama kaligrafi Timur Tengah. Kami percaya memperindah tulisan Al-Qur'an adalah bentuk penghormatan terhadap kalamullah. Komunitas ini aktif menyelenggarakan kursus kaligrafi, perlombaan imla' tingkat nasional, serta pameran seni kaligrafi Islam yang menginspirasi banyak kalangan dari berbagai penjuru Indonesia.",
        vision: "Melestarikan seni kaligrafi Islam dan menjadikannya bagian dari keseharian umat Muslim.",
        mission: [
            "Mengajarkan kaligrafi Al-Qur'an dengan metode bersanad dari ulama Timur Tengah.",
            "Menyelenggarakan kompetisi imla' dan kaligrafi tingkat nasional.",
            "Memproduksi karya kaligrafi sebagai media dakwah visual yang berpengaruh.",
            "Membangun jaringan kaligrafer Muslim Indonesia yang profesional dan solid."
        ],
        programs: ["Kaligrafi Naskhi Pemula", "Kaligrafi Tsuluts Mahir", "Imla' Al-Qur'an", "Workshop Dekorasi Kaligrafi"],
        facilities: ["Studio Kaligrafi Profesional", "Galeri Karya Santri", "Toko Alat Kaligrafi", "Ruang Pameran"],
        establishedYear: 2014,
        totalAlumni: 620,
        address: "Jl. Raya Darmo No. 78, Wonokromo, Surabaya",
        contact: "+62 812-7777-8888",
        joinedDate: null,
        myStats: null,
        announcements: [
            { id: 1, title: "Kompetisi Kaligrafi Nasional 2026", date: "3 hari lalu", desc: "Pendaftaran kompetisi kaligrafi nasional antar pelajar resmi dibuka." },
            { id: 2, title: "Pameran Kaligrafi Ramadhan", date: "1 minggu lalu", desc: "Pameran karya terbaik santri akan digelar di Balai Pemuda Surabaya." }
        ],
        colleagues: [
            { name: "Ust. Mahmud", role: "Pengajar Kaligrafi", avatar: "https://ui-avatars.com/api/?name=M&background=b45309&color=fff" },
            { name: "Ustzh. Fatimah", role: "Koordinator Imla'", avatar: "https://ui-avatars.com/api/?name=F&background=be185d&color=fff" }
        ],
        classes: [
            { id: "c1", name: "Kaligrafi Naskhi - Tingkat Dasar", time: "Senin & Rabu, 15.00 WIB", students: 10, status: "Berjalan" },
            { id: "c2", name: "Imla' Al-Qur'an Intensif", time: "Ahad, 08.00 WIB", students: 8, status: "Berjalan" }
        ],
        adminStats: {
            teachers: 12,
            activeStudents: 55,
            pendingRequests: 3,
            sessionsCompleted: 96
        },
        activities: MOCK_ORG_ACTIVITIES
    },

    "ORG-008": {
        id: "ORG-008",
        name: "Sekolah Qur'an Al-Hikmah",
        category: "Sekolah Quran",
        city: "Malang",
        memberCount: 41,
        rating: 4.9,
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1597534458220-9fb4969f2df5?w=900&auto=format&fit=crop",
        description: "Sekolah Qur'an Al-Hikmah adalah institusi pendidikan Islam unggulan yang menggabungkan sistem boarding modern dengan program tahfidz intensif bersanad. Berlokasi di kota pendidikan, sekolah ini menawarkan pendidikan holistik yang tidak hanya fokus pada hafalan, tetapi juga mempersiapkan santri untuk unggul secara akademis dan berkarakter mulia. Dengan lingkungan asrama terkontrol dan pengajar berdedikasi, Al-Hikmah konsisten menghasilkan lulusan hafidz yang juga berprestasi di berbagai bidang.",
        vision: "Mencetak hafidz Al-Qur'an yang unggul secara akademis, berkarakter mulia, dan berdaya saing global.",
        mission: [
            "Mengintegrasikan program tahfidz dengan kurikulum akademik nasional secara harmonis.",
            "Membangun karakter santri melalui pembinaan ruhani dan kepemimpinan yang intensif.",
            "Menyelenggarakan olimpiade dan kompetisi untuk mengasah potensi santri.",
            "Menjalin kemitraan dengan institusi pendidikan Islam internasional terkemuka."
        ],
        programs: ["Tahfidz Boarding Full Program", "Tahsin & Tafsir Bersanad", "Olimpiade Santri", "Program Akselerasi Hafalan"],
        facilities: ["Gedung Asrama 4 Lantai", "Lab Sains & Komputer", "Lapangan Olahraga Lengkap", "Masjid Kampus 1.000 Jamaah"],
        establishedYear: 2008,
        totalAlumni: 2100,
        address: "Jl. Ijen Boulevard No. 33, Klojen, Malang",
        contact: "+62 812-6666-7777",
        joinedDate: null,
        myStats: null,
        announcements: [
            { id: 1, title: "Penerimaan Santri Baru 2026/2027", date: "Hari ini", desc: "Pendaftaran santri baru tahun ajaran 2026/2027 resmi dibuka. Kuota sangat terbatas." },
            { id: 2, title: "Wisuda Akbar Angkatan ke-15", date: "5 hari lalu", desc: "120 hafidz dan hafidzah akan diwisuda dengan khidmat pada akhir bulan ini." },
            { id: 3, title: "Rekrutmen Asatidz Boarding", date: "1 minggu lalu", desc: "Dibutuhkan pengajar tahfidz dan mata pelajaran umum untuk asrama putra." }
        ],
        colleagues: [
            { name: "K.H. Musthafa", role: "Pengasuh Pesantren", avatar: "https://ui-avatars.com/api/?name=M&background=1e3a5f&color=fff" },
            { name: "Ust. Bilal", role: "Kepala Program Tahfidz", avatar: "https://ui-avatars.com/api/?name=B&background=065f46&color=fff" },
            { name: "Ustzh. Halimah", role: "Musyrifah Senior", avatar: "https://ui-avatars.com/api/?name=H&background=831843&color=fff" }
        ],
        classes: [
            { id: "c1", name: "Tahfidz Boarding - Kelas 7 Putra", time: "Setiap Hari, 04.30 & 16.00 WIB", students: 35, status: "Berjalan" },
            { id: "c2", name: "Tahfidz Boarding - Kelas 7 Putri", time: "Setiap Hari, 04.30 & 16.00 WIB", students: 32, status: "Berjalan" },
            { id: "c3", name: "Program Akselerasi Juz 30", time: "Senin-Jumat, 07.00 WIB", students: 28, status: "Berjalan" }
        ],
        adminStats: {
            teachers: 41,
            activeStudents: 380,
            pendingRequests: 15,
            sessionsCompleted: 620
        },
        activities: MOCK_ORG_ACTIVITIES
    },

    "ORG-009": {
        id: "ORG-009",
        name: "Pesantren Darun Najah",
        category: "Pesantren",
        city: "Banda Aceh",
        memberCount: 30,
        rating: 4.9,
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=900&auto=format&fit=crop",
        description: "Pesantren Darun Najah berdiri di atas warisan tradisi ilmu Al-Qur'an yang telah berabad-abad terjaga dengan sanad bersambung langsung kepada ulama-ulama besar Mekkah dan Madinah. Lembaga ini menawarkan pendidikan Al-Qur'an dengan standar tertinggi yang memperhatikan setiap detail tajwid, makhraj, dan sifat huruf. Sebagai penjaga tradisi sekaligus inovator pendidikan, Darun Najah mengintegrasikan metode ulama klasik dengan pendekatan pengajaran modern untuk generasi penerus bangsa.",
        vision: "Menjaga dan mewariskan tradisi ilmu Al-Qur'an bersanad kepada generasi penerus bangsa.",
        mission: [
            "Mempertahankan metode pengajaran Al-Qur'an bersanad yang shahih dan terpercaya.",
            "Mencetak hafidz yang fasih dengan pemahaman tajwid yang mendalam.",
            "Menjadi pusat rujukan ilmu Al-Qur'an di kawasan Barat Indonesia.",
            "Menyelenggarakan program studi Al-Qur'an lintas generasi dan latar belakang."
        ],
        programs: ["Tahfidz Bersanad Penuh", "Qiroat Sab'ah", "Ilmu Rasm Utsmani", "Program Syahadah Internasional"],
        facilities: ["Masjid Raya Pesantren", "Perpustakaan Manuskrip Islam", "Asrama 300 Santri", "Laboratorium Tajwid Digital"],
        establishedYear: 2005,
        totalAlumni: 1680,
        address: "Jl. T. Nyak Arief No. 441, Syiah Kuala, Banda Aceh",
        contact: "+62 811-6543-2100",
        joinedDate: null,
        myStats: null,
        announcements: [
            { id: 1, title: "Ujian Syahadah Internasional 2026", date: "2 hari lalu", desc: "Persiapan ujian syahadah bersama penguji dari Universitas Islam Madinah." },
            { id: 2, title: "Pembukaan Kelas Qiroat Sab'ah", date: "1 minggu lalu", desc: "Kelas Qiroat Sab'ah angkatan baru dibuka khusus pengajar berpengalaman." },
            { id: 3, title: "Musabaqah Hafidz Tingkat Provinsi", date: "2 minggu lalu", desc: "17 santri terpilih mewakili pesantren dalam musabaqah tingkat provinsi." }
        ],
        colleagues: [
            { name: "Tgk. Abdullah", role: "Mudir Pesantren", avatar: "https://ui-avatars.com/api/?name=A&background=134e4a&color=fff" },
            { name: "Tgk. Syafii", role: "Pengajar Qiroat", avatar: "https://ui-avatars.com/api/?name=S&background=1e3a8a&color=fff" },
            { name: "Ustzh. Aminah", role: "Musyrifah Akhwat", avatar: "https://ui-avatars.com/api/?name=Am&background=7c2d12&color=fff" }
        ],
        classes: [
            { id: "c1", name: "Tahfidz Bersanad - Halaqah Al-Fatihah", time: "Setiap Hari, 04.00 & 15.00 WIB", students: 20, status: "Berjalan" },
            { id: "c2", name: "Qiroat Sab'ah - Riwayat Hafs", time: "Selasa & Kamis, 20.00 WIB", students: 15, status: "Berjalan" },
            { id: "c3", name: "Ilmu Rasm Utsmani Lanjutan", time: "Sabtu, 09.00 WIB", students: 12, status: "Berjalan" }
        ],
        adminStats: {
            teachers: 30,
            activeStudents: 260,
            pendingRequests: 11,
            sessionsCompleted: 480
        },
        activities: MOCK_ORG_ACTIVITIES
    },

    "ORG-010": {
        id: "ORG-010",
        name: "Komunitas Tilawah Bersama",
        category: "Komunitas",
        city: "Banjarmasin",
        memberCount: 19,
        rating: 4.7,
        logo: "/icons/Qurani - Icon2 Green.png",
        banner: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=900&auto=format&fit=crop",
        description: "Komunitas Tilawah Bersama lahir dari kecintaan terhadap keindahan lantunan Al-Qur'an dan keinginan menyebarkannya ke seluruh lapisan masyarakat. Komunitas ini aktif menyelenggarakan halaqah tilawah mingguan, lomba MTQ tingkat lokal, dan kajian tafsir tematik yang terbuka untuk umum. Dengan semangat kebersamaan dan dakwah yang tulus, kami terus mendorong lebih banyak orang untuk mencintai Al-Qur'an melalui keindahan tilawah dan pemahaman maknanya.",
        vision: "Menjadikan tilawah Al-Qur'an sebagai bagian yang tak terpisahkan dari kehidupan Muslim sehari-hari.",
        mission: [
            "Menyelenggarakan halaqah dan lomba tilawah untuk meningkatkan kualitas bacaan.",
            "Mengadakan kajian tafsir tematik yang terbuka dan mudah dipahami semua kalangan.",
            "Membina generasi qari dan qariah yang berbakat dari berbagai usia.",
            "Membangun jaringan komunitas pecinta tilawah Al-Qur'an yang aktif dan menginspirasi."
        ],
        programs: ["Halaqah Tilawah Mingguan", "Persiapan MTQ", "Kajian Tafsir Tematik", "Kelas Lagu Maqamat"],
        facilities: ["Aula Tilawah Ber-AC", "Studio Rekaman Tilawah", "Perpustakaan Kaset & CD Tilawah", "Ruang Halaqah Kecil"],
        establishedYear: 2016,
        totalAlumni: 560,
        address: "Jl. Ahmad Yani KM 3, Banjarmasin Timur",
        contact: "+62 811-4444-5555",
        joinedDate: null,
        myStats: null,
        announcements: [
            { id: 1, title: "Seleksi Qari MTQ Kabupaten", date: "3 hari lalu", desc: "Seleksi internal calon peserta MTQ tingkat kabupaten akan dilaksanakan pekan depan." },
            { id: 2, title: "Kajian Tafsir Surat Al-Kahfi", date: "1 minggu lalu", desc: "Kajian tafsir tematik Surat Al-Kahfi dibuka untuk umum, gratis tanpa pendaftaran." }
        ],
        colleagues: [
            { name: "Ust. Amru", role: "Ketua Komunitas", avatar: "https://ui-avatars.com/api/?name=A&background=166534&color=fff" },
            { name: "Ustzh. Zahra", role: "Koordinator Akhwat", avatar: "https://ui-avatars.com/api/?name=Z&background=9a3412&color=fff" }
        ],
        classes: [
            { id: "c1", name: "Halaqah Tilawah - Grup Maqam Bayati", time: "Selasa & Kamis, 19.30 WIB", students: 15, status: "Berjalan" },
            { id: "c2", name: "Persiapan MTQ - Kategori Dewasa", time: "Sabtu, 09.00 WIB", students: 10, status: "Berjalan" }
        ],
        adminStats: {
            teachers: 19,
            activeStudents: 168,
            pendingRequests: 6,
            sessionsCompleted: 290
        },
        activities: MOCK_ORG_ACTIVITIES
    }
}

// ============================================================
// ORG_PROGRAMS — Program, jumlah sesi, dan harga per organisasi
// ============================================================
export const ORG_PROGRAMS: Record<string, { name: string; sessionCount: number; price: number }[]> = {
    "ORG-001": [
        { name: "Tahfidz Anak & Balita", sessionCount: 20, price: 1200000 },
        { name: "Tahsin Dewasa", sessionCount: 10, price: 700000 },
        { name: "I'dad Muhaffidzhin", sessionCount: 30, price: 2500000 },
        { name: "Kajian Tafsir Tematik", sessionCount: 8, price: 500000 },
    ],
    "ORG-002": [
        { name: "Tahsin Pemula", sessionCount: 8, price: 480000 },
        { name: "Tajwid Interaktif", sessionCount: 12, price: 720000 },
        { name: "Tahfidz Akhir Pekan", sessionCount: 16, price: 960000 },
        { name: "Dirosa (Dewasa)", sessionCount: 10, price: 600000 },
    ],
    "ORG-003": [
        { name: "Tahfidz Online Intensif", sessionCount: 24, price: 1440000 },
        { name: "Tahsin Digital", sessionCount: 12, price: 720000 },
        { name: "Kajian Tafsir Interaktif", sessionCount: 8, price: 480000 },
        { name: "Fiqh Kontemporer", sessionCount: 10, price: 600000 },
    ],
    "ORG-004": [
        { name: "Tahfidz 1 Juz 30 Hari", sessionCount: 30, price: 1800000 },
        { name: "Muroja'ah Komunal", sessionCount: 4, price: 200000 },
        { name: "Mentoring Hafidz Sebaya", sessionCount: 8, price: 400000 },
        { name: "Seminar Produktivitas", sessionCount: 2, price: 150000 },
    ],
    "ORG-005": [
        { name: "Tahsin Ibu-Ibu", sessionCount: 10, price: 500000 },
        { name: "Tahsin Lansia", sessionCount: 8, price: 400000 },
        { name: "Tahsin Mobile Masjid", sessionCount: 12, price: 600000 },
        { name: "Kelas Makhraj Intensif", sessionCount: 6, price: 350000 },
    ],
    "ORG-006": [
        { name: "Diploma Ulumul Qur'an", sessionCount: 40, price: 3500000 },
        { name: "Tahfidz Akademis", sessionCount: 30, price: 2500000 },
        { name: "Riset Tafsir", sessionCount: 16, price: 1200000 },
        { name: "Pertukaran Ulama", sessionCount: 20, price: 2000000 },
    ],
    "ORG-007": [
        { name: "Kaligrafi Naskhi", sessionCount: 12, price: 720000 },
        { name: "Kaligrafi Tsuluts", sessionCount: 16, price: 960000 },
        { name: "Imla' Al-Qur'an", sessionCount: 8, price: 480000 },
        { name: "Workshop Kaligrafi", sessionCount: 4, price: 350000 },
    ],
    "ORG-008": [
        { name: "Tahfidz Boarding Full", sessionCount: 60, price: 5000000 },
        { name: "Tahsin & Tafsir Bersanad", sessionCount: 20, price: 1500000 },
        { name: "Olimpiade Santri", sessionCount: 8, price: 600000 },
        { name: "Akselerasi Hafalan", sessionCount: 30, price: 2500000 },
    ],
    "ORG-009": [
        { name: "Tahfidz Bersanad Penuh", sessionCount: 50, price: 4500000 },
        { name: "Qiroat Sab'ah", sessionCount: 20, price: 2000000 },
        { name: "Ilmu Rasm Utsmani", sessionCount: 12, price: 1000000 },
        { name: "Syahadah Internasional", sessionCount: 30, price: 3000000 },
    ],
    "ORG-010": [
        { name: "Halaqah Tilawah", sessionCount: 8, price: 400000 },
        { name: "Persiapan MTQ", sessionCount: 12, price: 800000 },
        { name: "Kajian Tafsir Tematik", sessionCount: 6, price: 350000 },
        { name: "Kelas Lagu Maqamat", sessionCount: 10, price: 600000 },
    ],
}