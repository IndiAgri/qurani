"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  Mail,
  MapPin,
  Globe,
  Megaphone,
  Bell,
  X,
  Check,
  Search,
  Settings,
  Sun,
  Moon,
  Trash2,
  ChevronDown,
  Plus,
  Camera,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { IndonesiaFlag, UsaFlag } from "@/components/ui/flags";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/components/providers/auth-provider";

export interface UserProfileData {
  name: string;
  nickname?: string;
  username: string;
  email: string;
  phone?: string;
  job?: string;
  gender?: string;
  birthDate?: string;
  timezone?: string;
  country?: string;
  states?: string;
  city: string;
  aboutMe?: string;
  avatar?: string;
}

export interface NotificationContact {
  id: string;
  name: string;
  username: string;
  location: string;
  avatar: string;
}

const DEFAULT_PROFILE: UserProfileData = {
  name: "indi",
  nickname: "",
  username: "indiagri",
  email: "indi.pplg2@gmail.com",
  phone: "",
  job: "",
  gender: "",
  birthDate: "",
  timezone: "",
  country: "Indonesia",
  states: "Jawa Timur",
  city: "Malang",
  aboutMe: "",
  avatar: "",
};

const COUNTRIES_LIST = [
  "Afghanistan",
  "Aland Islands",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Chile",
  "China",
  "Colombia",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Estonia",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Greenland",
  "Grenada",
  "Guam",
  "Guatemala",
  "Guinea",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Mexico",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Nigeria",
  "North Korea",
  "Norway",
  "Oman",
  "Pakistan",
  "Palestine",
  "Panama",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Somalia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const STATES_LIST = [
  "Aceh",
  "Bali",
  "Banten",
  "Bengkulu",
  "DI Yogyakarta",
  "DKI Jakarta",
  "Gorontalo",
  "Jambi",
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Kalimantan Barat",
  "Kalimantan Selatan",
  "Kalimantan Tengah",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Kepulauan Bangka Belitung",
  "Kepulauan Riau",
  "Lampung",
  "Maluku",
  "Maluku Utara",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Papua",
  "Papua Barat",
  "Papua Barat Daya",
  "Papua Pegunungan",
  "Papua Selatan",
  "Papua Tengah",
  "Riau",
  "Sulawesi Barat",
  "Sulawesi Selatan",
  "Sulawesi Tengah",
  "Sulawesi Tenggara",
  "Sulawesi Utara",
  "Sumatera Barat",
  "Sumatera Selatan",
  "Sumatera Utara",
];

const CITIES_LIST = [
  "Babat",
  "Balung",
  "Bangil",
  "Bangkalan",
  "Banyuwangi",
  "Batu",
  "Besuki",
  "Blitar",
  "Bojonegoro",
  "Bondowoso",
  "Boyolangu",
  "Caruban",
  "Dampit",
  "Driyorejo",
  "Gambiran",
  "Genteng",
  "Gondanglegi",
  "Gresik",
  "Jember",
  "Jombang",
  "Kediri",
  "Kepanjen",
  "Kertosono",
  "Kraksaan",
  "Krian",
  "Lamongan",
  "Lawang",
  "Lumajang",
  "Madiun",
  "Magetan",
  "Malang",
  "Mojokerto",
  "Nganjuk",
  "Ngawi",
  "Pacitan",
  "Pamekasan",
  "Pandaan",
  "Pasuruan",
  "Ponorogo",
  "Probolinggo",
  "Sampang",
  "Sidoarjo",
  "Singosari",
  "Situbondo",
  "Sumenep",
  "Surabaya",
  "Trenggalek",
  "Tuban",
  "Tulungagung",
  "Bandung",
  "Bekasi",
  "Bogor",
  "Cimahi",
  "Cirebon",
  "Depok",
  "Jakarta Barat",
  "Jakarta Pusat",
  "Jakarta Selatan",
  "Jakarta Timur",
  "Jakarta Utara",
  "Medan",
  "Padang",
  "Palembang",
  "Pekanbaru",
  "Semarang",
  "Surakarta",
  "Tangerang",
  "Tangerang Selatan",
  "Tasikmalaya",
  "Yogyakarta",
  "Balikpapan",
  "Banjarmasin",
  "Pontianak",
  "Samarinda",
  "Denpasar",
  "Mataram",
  "Kupang",
  "Makassar",
  "Manado",
  "Palu",
  "Jayapura",
  "Ambon",
];

const DEFAULT_NOTIFICATION_RECIPIENTS: NotificationContact[] = [
  {
    id: "notif-rec-1",
    name: "02_Alvia Agustin",
    username: "@alvia",
    location: "Malang - Jawa Timur",
    avatar: "/img/avatar-alvia.jpg",
  },
];

const DEFAULT_NOTIFICATION_SENDERS: NotificationContact[] = [
  {
    id: "notif-send-1",
    name: "02_Alvia Agustin",
    username: "@alvia",
    location: "Malang - Jawa Timur",
    avatar: "/img/avatar-alvia.jpg",
  },
];

export function ProfileView() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.startsWith("/en") ? "en" : "id";
  const { user, updateUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfileData>(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfileData>(DEFAULT_PROFILE);

  // Country popover state
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  // States popover state
  const [isStatesOpen, setIsStatesOpen] = useState(false);
  const [statesSearch, setStatesSearch] = useState("");

  // City popover state
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  // Notifications lists
  const [sendRecipients, setSendRecipients] = useState<NotificationContact[]>(
    DEFAULT_NOTIFICATION_RECIPIENTS
  );
  const [receiveSenders, setReceiveSenders] = useState<NotificationContact[]>(
    DEFAULT_NOTIFICATION_SENDERS
  );

  const [isAddSendModalOpen, setIsAddSendModalOpen] = useState(false);
  const [isAddReceiveModalOpen, setIsAddReceiveModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // On mount: load client-side localStorage safely to prevent SSR hydration mismatch
  useEffect(() => {
    setMounted(true);

    try {
      const saved = localStorage.getItem("qurani_student_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile((prev) => ({ ...prev, ...parsed }));
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}

    try {
      const savedRec = localStorage.getItem("qurani_send_notifications");
      if (savedRec) setSendRecipients(JSON.parse(savedRec));
    } catch {}

    try {
      const savedSend = localStorage.getItem("qurani_receive_notifications");
      if (savedSend) setReceiveSenders(JSON.parse(savedSend));
    } catch {}

    const isDark =
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark";
    setIsDarkMode(isDark);
  }, []);

  // Sync profile when auth user is available or changed
  useEffect(() => {
    if (user) {
      setProfile((prev) => {
        const nextProfile: UserProfileData = {
          ...prev,
          name: user.name || prev.name,
          username: user.username
            ? user.username.startsWith("@")
              ? user.username
              : `@${user.username}`
            : prev.username,
          email: user.email || prev.email,
          avatar: user.avatar || prev.avatar,
          city: user.cityName || prev.city,
          states: user.stateName || prev.states,
          country: user.countryName || prev.country,
          phone: user.hp || prev.phone,
          timezone: user.timezone || prev.timezone,
        };
        return nextProfile;
      });
      setFormData((prev) => {
        const nextData: UserProfileData = {
          ...prev,
          name: user.name || prev.name,
          username: user.username
            ? user.username.startsWith("@")
              ? user.username
              : `@${user.username}`
            : prev.username,
          email: user.email || prev.email,
          avatar: user.avatar || prev.avatar,
          city: user.cityName || prev.city,
          states: user.stateName || prev.states,
          country: user.countryName || prev.country,
          phone: user.hp || prev.phone,
          timezone: user.timezone || prev.timezone,
        };
        return nextData;
      });
    }
  }, [user]);

  const toggleTheme = (nextDark: boolean) => {
    setIsDarkMode(nextDark);
    if (typeof window !== "undefined") {
      if (nextDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        toast.success(currentLocale === "id" ? "Mode Gelap aktif" : "Dark Mode enabled");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        toast.success(currentLocale === "id" ? "Mode Terang aktif" : "Light Mode enabled");
      }
    }
  };

  // Language state
  const languages = [
    { label: "Indonesia", code: "id" },
    { label: "English", code: "en" },
  ];
  const [selectedLang, setSelectedLang] = useState(
    currentLocale === "id" ? "Indonesia" : "English"
  );

  const handleLanguageChange = (lang: (typeof languages)[0]) => {
    setSelectedLang(lang.label);
    if (typeof window !== "undefined") {
      localStorage.setItem("user_locale", lang.code);
    }
    if (lang.code !== currentLocale) {
      const newPath = pathname.startsWith("/" + currentLocale)
        ? pathname.replace(new RegExp(`^/${currentLocale}`), `/${lang.code}`)
        : `/${lang.code}${pathname}`;
      router.push(newPath);
    }
  };

  // Photo upload handler
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 3MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setFormData((prev) => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Ensure username has proper format
    const cleanedUsername = formData.username
      ? formData.username.startsWith("@")
        ? formData.username
        : `@${formData.username}`
      : "@indiagri";

    const finalData: UserProfileData = {
      ...formData,
      username: cleanedUsername,
    };

    setProfile(finalData);

    try {
      localStorage.setItem("qurani_student_profile", JSON.stringify(finalData));
    } catch {}

    // Synchronize to global AuthProvider if available
    if (updateUser) {
      updateUser({
        name: finalData.name,
        username: finalData.username,
        email: finalData.email,
        avatar: finalData.avatar || "",
        cityName: finalData.city,
        stateName: finalData.states,
        countryName: finalData.country,
        hp: finalData.phone,
        timezone: finalData.timezone,
        bio: finalData.aboutMe,
      });
    }

    setIsEditing(false);
    toast.success(
      currentLocale === "id"
        ? "Profil berhasil diperbarui!"
        : "Profile updated successfully!"
    );
  };

  const handleDeleteRecipient = (id: string) => {
    const updated = sendRecipients.filter((r) => r.id !== id);
    setSendRecipients(updated);
    try {
      localStorage.setItem("qurani_send_notifications", JSON.stringify(updated));
      window.dispatchEvent(new Event("qurani_contacts_updated"));
    } catch {}
    toast.info("Penerima notifikasi dihapus");
  };

  const handleDeleteSender = (id: string) => {
    const updated = receiveSenders.filter((s) => s.id !== id);
    setReceiveSenders(updated);
    try {
      localStorage.setItem("qurani_receive_notifications", JSON.stringify(updated));
      window.dispatchEvent(new Event("qurani_contacts_updated"));
    } catch {}
    toast.info("Pengirim notifikasi dihapus");
  };

  const handleAddContact = (contact: NotificationContact, type: "send" | "receive") => {
    if (type === "send") {
      if (sendRecipients.some((r) => r.username === contact.username)) {
        toast.error("User ini sudah ada di daftar penerima");
        return;
      }
      const updated = [contact, ...sendRecipients];
      setSendRecipients(updated);
      try {
        localStorage.setItem("qurani_send_notifications", JSON.stringify(updated));
        window.dispatchEvent(new Event("qurani_contacts_updated"));
      } catch {}
      setIsAddSendModalOpen(false);
      toast.success(`${contact.name} berhasil ditambahkan!`);
    } else {
      if (receiveSenders.some((s) => s.username === contact.username)) {
        toast.error("User ini sudah ada di daftar pengirim");
        return;
      }
      const updated = [contact, ...receiveSenders];
      setReceiveSenders(updated);
      try {
        localStorage.setItem("qurani_receive_notifications", JSON.stringify(updated));
        window.dispatchEvent(new Event("qurani_contacts_updated"));
      } catch {}
      setIsAddReceiveModalOpen(false);
      toast.success(`${contact.name} berhasil ditambahkan!`);
    }
    setSearchQuery("");
  };

  const filteredCountries = COUNTRIES_LIST.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredStates = STATES_LIST.filter((s) =>
    s.toLowerCase().includes(statesSearch.toLowerCase())
  );

  const filteredCities = CITIES_LIST.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 font-sans" suppressHydrationWarning>
      {/* Main Single Card Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 sm:p-8 space-y-8">
        {/* ========================================================================= */}
        {/* EDIT PROFILE VIEW (Exact match to Screenshots 2, 3, 4, 5)                  */}
        {/* ========================================================================= */}
        {isEditing ? (
          <div className="space-y-6">
            {/* Header: Edit Profile */}
            <div className="flex items-center gap-2">
              <User className="size-5 text-gray-800 stroke-[2.2]" />
              <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                Edit Profile
              </h1>
            </div>

            {/* Centered Large Green Avatar with Hover Overlay & Floating Camera Button */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative size-32 sm:size-36 rounded-full bg-[#1b5e20] text-white flex items-center justify-center text-6xl sm:text-7xl font-bold uppercase select-none shrink-0 shadow-sm overflow-hidden cursor-pointer transition-all hover:ring-4 hover:ring-[#90caf9] focus:outline-none focus:ring-4 focus:ring-[#90caf9]"
                  title="Ganti Foto Profil"
                >
                  {/* Avatar Image or Initial */}
                  {formData.avatar ? (
                    <Image
                      src={formData.avatar}
                      alt={formData.name || "avatar"}
                      width={144}
                      height={144}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{formData.name?.charAt(0) || "i"}</span>
                  )}

                  {/* Dark Overlay with White Camera Icon on Hover */}
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera className="size-9 sm:size-10 text-white stroke-[1.8]" />
                  </div>
                </button>

                {/* Floating Bottom-Right Camera Badge */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 size-9 sm:size-10 rounded-full bg-white border-2 border-[#90caf9] flex items-center justify-center text-blue-500 hover:bg-blue-50 shadow-md transition cursor-pointer"
                  title="Upload Foto"
                >
                  <Camera className="size-4.5 stroke-[2.2]" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* 3-Column Grid Form */}
            <form
              onSubmit={(e) => e.preventDefault()}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
                  e.preventDefault();
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-4">
                {/* Row 1: Full Name, Nickname, Username */}
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-10 w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00875a] focus:border-[#00875a] transition"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 block">
                    Nickname
                  </label>
                  <input
                    type="text"
                    value={formData.nickname || ""}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="Enter your nickname..."
                    className="h-10 w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00875a] focus:border-[#00875a] transition"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 block">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="@indiagri"
                    className="h-10 w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00875a] focus:border-[#00875a] transition"
                    required
                  />
                </div>

                {/* Row 2: Email, Phone Number, Job */}
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="indi.pplg2@gmail.com"
                    className="h-10 w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00875a] focus:border-[#00875a] transition"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 block">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+12 345 6789 1234"
                    className="h-10 w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00875a] focus:border-[#00875a] transition"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 block">
                    Job
                  </label>
                  <input
                    type="text"
                    value={formData.job || ""}
                    onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                    placeholder="Enter your Job..."
                    className="h-10 w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00875a] focus:border-[#00875a] transition"
                  />
                </div>

                {/* Row 3: Gender, Date of Birth, Timezone */}
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 block">
                    Gender
                  </label>
                  <Select
                    value={formData.gender || ""}
                    onValueChange={(val) => setFormData({ ...formData, gender: val || "" })}
                  >
                    <SelectTrigger className="h-10 w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00875a] focus:border-[#00875a]">
                      <SelectValue placeholder="Select gender..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-gray-100 shadow-xl bg-white p-1">
                      <SelectItem value="Male" className="rounded-lg text-xs sm:text-sm py-2 px-3 cursor-pointer">
                        Male
                      </SelectItem>
                      <SelectItem value="Female" className="rounded-lg text-xs sm:text-sm py-2 px-3 cursor-pointer">
                        Female
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 block">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate || ""}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    placeholder="dd/mm/yyyy"
                    className="h-10 w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00875a] focus:border-[#00875a] transition"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 block">
                    Timezone
                  </label>
                  <input
                    type="text"
                    value={formData.timezone || ""}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    placeholder="Asia/Jakarta"
                    className="h-10 w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00875a] focus:border-[#00875a] transition"
                  />
                </div>

                {/* Row 4: Country, States, City */}
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 block">
                    Country
                  </label>
                  <Popover open={isCountryOpen} onOpenChange={setIsCountryOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="h-10 w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white text-gray-800 flex items-center justify-between text-left focus:outline-none focus:ring-1 focus:ring-[#00875a] focus:border-[#00875a] cursor-pointer"
                      >
                        <span className={formData.country ? "text-gray-800" : "text-gray-400"}>
                          {formData.country || "Indonesia"}
                        </span>
                        <ChevronDown className="size-4 text-gray-400 shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[280px] p-2 rounded-2xl border border-gray-100 shadow-xl bg-white"
                      align="start"
                    >
                      <div className="relative mb-2">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search"
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00875a]"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-56 overflow-y-auto space-y-0.5 pr-1">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, country: c }));
                                setIsCountryOpen(false);
                                setCountrySearch("");
                              }}
                              className={cn(
                                "w-full text-left px-3 py-1.5 text-xs sm:text-sm rounded-lg hover:bg-gray-100/80 transition cursor-pointer flex items-center justify-between",
                                formData.country === c
                                  ? "bg-gray-100 font-semibold text-gray-900"
                                  : "text-gray-700"
                              )}
                            >
                              <span>{c}</span>
                              {formData.country === c && (
                                <Check className="size-3.5 text-[#00875a]" />
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="text-center py-3 text-xs text-gray-400">
                            No country found
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 block">
                    States
                  </label>
                  <Popover open={isStatesOpen} onOpenChange={setIsStatesOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="h-10 w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white text-gray-800 flex items-center justify-between text-left focus:outline-none focus:ring-1 focus:ring-[#00875a] focus:border-[#00875a] cursor-pointer"
                      >
                        <span className={formData.states ? "text-gray-800" : "text-gray-400"}>
                          {formData.states || "Jawa Timur"}
                        </span>
                        <ChevronDown className="size-4 text-gray-400 shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[280px] p-2 rounded-2xl border border-gray-100 shadow-xl bg-white"
                      align="start"
                    >
                      <div className="relative mb-2">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search"
                          value={statesSearch}
                          onChange={(e) => setStatesSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00875a]"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-56 overflow-y-auto space-y-0.5 pr-1">
                        {filteredStates.length > 0 ? (
                          filteredStates.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, states: s }));
                                setIsStatesOpen(false);
                                setStatesSearch("");
                              }}
                              className={cn(
                                "w-full text-left px-3 py-1.5 text-xs sm:text-sm rounded-lg hover:bg-gray-100/80 transition cursor-pointer flex items-center justify-between",
                                formData.states === s
                                  ? "bg-gray-100 font-semibold text-gray-900"
                                  : "text-gray-700"
                              )}
                            >
                              <span>{s}</span>
                              {formData.states === s && (
                                <Check className="size-3.5 text-[#00875a]" />
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="text-center py-3 text-xs text-gray-400">
                            No states found
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 block">
                    City
                  </label>
                  <Popover open={isCityOpen} onOpenChange={setIsCityOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="h-10 w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white text-gray-800 flex items-center justify-between text-left focus:outline-none focus:ring-1 focus:ring-[#00875a] focus:border-[#00875a] cursor-pointer"
                      >
                        <span className={formData.city ? "text-gray-800" : "text-gray-400"}>
                          {formData.city || "Malang"}
                        </span>
                        <ChevronDown className="size-4 text-gray-400 shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[280px] p-2 rounded-2xl border border-gray-100 shadow-xl bg-white"
                      align="start"
                    >
                      <div className="relative mb-2">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search"
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00875a]"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-56 overflow-y-auto space-y-0.5 pr-1">
                        {filteredCities.length > 0 ? (
                          filteredCities.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, city: c }));
                                setIsCityOpen(false);
                                setCitySearch("");
                              }}
                              className={cn(
                                "w-full text-left px-3 py-1.5 text-xs sm:text-sm rounded-lg hover:bg-gray-100/80 transition cursor-pointer flex items-center justify-between",
                                formData.city === c
                                  ? "bg-gray-100 font-semibold text-gray-900"
                                  : "text-gray-700"
                              )}
                            >
                              <span>{c}</span>
                              {formData.city === c && (
                                <Check className="size-3.5 text-[#00875a]" />
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="text-center py-3 text-xs text-gray-400">
                            No city found
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Row 5: About Me (Full width across all 3 columns) */}
                <div className="md:col-span-3">
                  <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 block">
                    About Me
                  </label>
                  <textarea
                    rows={4}
                    maxLength={400}
                    value={formData.aboutMe || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, aboutMe: e.target.value.slice(0, 400) })
                    }
                    className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00875a] focus:border-[#00875a] transition resize-y"
                  />
                  <div className="text-xs text-gray-400 mt-1 select-none">
                    {(formData.aboutMe?.length || 0)}/400 characters
                  </div>
                </div>
              </div>

              {/* Bottom Right Actions (Cancel & Save Buttons) */}
              <div className="flex items-center justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(profile);
                    setIsEditing(false);
                  }}
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition cursor-pointer shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveProfile()}
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#00875a] hover:bg-[#00734c] rounded-xl transition cursor-pointer shadow-2xs flex items-center gap-2"
                >
                  <Save className="size-4 stroke-[2.2]" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ========================================================================= */
          /* DEFAULT PROFILE VIEW (Exact match to Screenshot 1)                        */
          /* ========================================================================= */
          <>
            {/* 1. Header Row (Profile title & Actions) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="size-5 text-gray-800 stroke-[2.2]" />
                <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                  Profile
                </h1>
              </div>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Link
                  href={`/${currentLocale}/profile/pengaturan-qurani`}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200/90 rounded-xl transition shadow-2xs"
                >
                  Qurani Settings
                </Link>
                <button
                  onClick={() => {
                    setFormData(profile);
                    setIsEditing(true);
                  }}
                  type="button"
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#00875a] hover:bg-[#00734c] rounded-xl transition shadow-2xs cursor-pointer"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* 2. Hero Profile Section (Avatar, Name, Username, Contacts) */}
            <div className="space-y-4">
              <div className="flex items-center gap-5">
                {/* Green Circle Avatar matching screenshot */}
                <div className="size-20 sm:size-24 rounded-full bg-[#1b5e20] text-white flex items-center justify-center text-4xl font-bold uppercase select-none shrink-0 shadow-xs overflow-hidden">
                  {profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{profile.name?.charAt(0) || "i"}</span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                    {profile.name}
                  </h2>
                  <span className="text-sm font-semibold text-[#0284c7] hover:underline mt-0.5 block">
                    {profile.username?.startsWith("@")
                      ? profile.username
                      : `@${profile.username || "indiagri"}`}
                  </span>
                </div>
              </div>

              {/* Email and Location (Clean 2 rows matching screenshot) */}
              <div className="space-y-2 pt-2 text-xs sm:text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-gray-600 shrink-0" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="size-4 text-gray-600 shrink-0" />
                  <span>
                    {profile.city && profile.states
                      ? `${profile.city}, ${profile.states}`
                      : profile.city || profile.states || "Malang, Jawa Timur"}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Settings Section Header */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="size-5 text-gray-800 stroke-[2.2]" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                  Settings
                </h2>
              </div>

              <div className="space-y-4">
                {/* Card 1: Theme Switcher */}
                <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-gray-100 bg-white shadow-2xs">
                  <div className="flex items-center gap-3">
                    <Sun className="size-5 text-gray-700 stroke-[2]" />
                    <span className="text-sm sm:text-base font-semibold text-gray-900">
                      Theme
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Sun className="size-4 text-gray-400" />
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={toggleTheme}
                    />
                    <Moon className="size-4 text-gray-400" />
                  </div>
                </div>

                {/* Card 2: Language Selector */}
                <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-blue-100/60 bg-[#f8faff] shadow-2xs">
                  <div className="flex items-center gap-3">
                    <Globe className="size-5 text-[#2563eb] stroke-[2]" />
                    <span className="text-sm sm:text-base font-semibold text-gray-900">
                      Language
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200/90 bg-white text-xs sm:text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 transition cursor-pointer focus:outline-none">
                      {selectedLang === "Indonesia" ? (
                        <IndonesiaFlag className="size-5" />
                      ) : (
                        <UsaFlag className="size-5" />
                      )}
                      <span>{selectedLang}</span>
                      <ChevronDown className="size-3.5 text-gray-400 shrink-0 ml-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-44 rounded-2xl border border-gray-100 shadow-xl p-1.5 bg-white"
                    >
                      {languages.map((lang) => {
                        const isSelected = selectedLang === lang.label;
                        return (
                          <DropdownMenuItem
                            key={lang.label}
                            onClick={() => handleLanguageChange(lang)}
                            className={cn(
                              "flex items-center gap-2.5 text-xs sm:text-sm px-2.5 py-2 cursor-pointer rounded-xl font-medium transition-colors",
                              isSelected
                                ? "bg-gray-100/90 text-gray-900 font-semibold"
                                : "text-gray-700 hover:bg-gray-50"
                            )}
                          >
                            <div className="flex items-center justify-center size-4 shrink-0">
                              {isSelected ? (
                                <Check className="size-3.5 text-gray-500 stroke-[2.5]" />
                              ) : (
                                <span className="size-3.5" />
                              )}
                            </div>
                            {lang.code === "id" ? (
                              <IndonesiaFlag className="size-5" />
                            ) : (
                              <UsaFlag className="size-5" />
                            )}
                            <span>{lang.label}</span>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Card 3: Send Notification to */}
                <div className="p-5 sm:p-6 rounded-2xl border border-gray-100 bg-white shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Megaphone className="size-5 text-[#00875a] stroke-[2]" />
                      <h3 className="text-sm sm:text-base font-bold text-gray-900">
                        Send Notification to
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddSendModalOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00875a] hover:bg-[#00734c] text-white text-xs sm:text-sm font-semibold shadow-2xs transition cursor-pointer"
                    >
                      <Plus className="size-3.5 stroke-[2.5]" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Items List */}
                  {sendRecipients.length > 0 ? (
                    <div className="space-y-2.5 pt-1">
                      {sendRecipients.map((rec) => (
                        <div
                          key={rec.id}
                          className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-emerald-100/70 bg-white shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative size-10 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                              <Image
                                src={rec.avatar || "/img/avatar-alvia.jpg"}
                                alt={rec.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                                {rec.name}
                              </h4>
                              <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                                {rec.username} · {rec.location}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteRecipient(rec.id)}
                            className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs sm:text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl">
                      Belum ada penerima notifikasi yang dipilih.
                    </div>
                  )}
                </div>

                {/* Card 4: Receive Notification from */}
                <div className="p-5 sm:p-6 rounded-2xl border border-gray-100 bg-white shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Bell className="size-5 text-[#00875a] stroke-[2]" />
                      <h3 className="text-sm sm:text-base font-bold text-gray-900">
                        Receive Notification from
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddReceiveModalOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00875a] hover:bg-[#00734c] text-white text-xs sm:text-sm font-semibold shadow-2xs transition cursor-pointer"
                    >
                      <Plus className="size-3.5 stroke-[2.5]" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Items List */}
                  {receiveSenders.length > 0 ? (
                    <div className="space-y-2.5 pt-1">
                      {receiveSenders.map((snd) => (
                        <div
                          key={snd.id}
                          className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-emerald-100/70 bg-white shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative size-10 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                              <Image
                                src={snd.avatar || "/img/avatar-alvia.jpg"}
                                alt={snd.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                                {snd.name}
                              </h4>
                              <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                                {snd.username} · {snd.location}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteSender(snd.id)}
                            className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs sm:text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl">
                      Belum ada pengirim notifikasi yang dipilih.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Recipient / Sender Modal Dialog */}
      {(isAddSendModalOpen || isAddReceiveModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                {isAddSendModalOpen
                  ? "Tambah Penerima Notifikasi"
                  : "Tambah Pengirim Notifikasi"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddSendModalOpen(false);
                  setIsAddReceiveModalOpen(false);
                  setSearchQuery("");
                }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari user berdasarkan nama atau @username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00875a]"
                  autoFocus
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {[
                  {
                    id: "usr-alvia",
                    name: "02_Alvia Agustin",
                    username: "@alvia",
                    location: "Malang - Jawa Timur",
                    avatar: "/img/avatar-alvia.jpg",
                  },
                  {
                    id: "usr-fatkul",
                    name: "fatkul",
                    username: "@fatkul",
                    location: "Malang - Jawa Timur",
                    avatar: "/img/fatkul.jpg",
                  },
                  {
                    id: "usr-nanas",
                    name: "nanas nanas",
                    username: "@nanas",
                    location: "Surabaya - Jawa Timur",
                    avatar: "/img/avatar-alvia.jpg",
                  },
                ]
                  .filter(
                    (u) =>
                      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      u.username.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative size-9 rounded-full overflow-hidden shrink-0 border border-gray-100">
                          <Image
                            src={item.avatar}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {item.username} · {item.location}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleAddContact(
                            item,
                            isAddSendModalOpen ? "send" : "receive"
                          )
                        }
                        className="px-3.5 py-1.5 bg-[#00875a] hover:bg-[#00734c] text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                      >
                        Pilih
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileView;
