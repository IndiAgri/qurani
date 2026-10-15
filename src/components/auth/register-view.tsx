"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { INDONESIA_CITIES } from "@/data/cities-data";

const PROVINCES = [
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Jambi",
  "Sumatera Selatan",
  "Bengkulu",
  "Lampung",
  "Kepulauan Bangka Belitung",
  "Kepulauan Riau",
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Banten",
  "Bali",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Kalimantan Barat",
  "Kalimantan Tengah",
  "Kalimantan Selatan",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Sulawesi Utara",
  "Sulawesi Tengah",
  "Sulawesi Selatan",
  "Sulawesi Tenggara",
  "Gorontalo",
  "Sulawesi Barat",
  "Maluku",
  "Maluku Utara",
  "Papua",
  "Papua Barat",
];

const COUNTRIES = ["Indonesia", "Malaysia", "Saudi Arabia", "Turkey", "Singapore", "United States"];

export function RegisterView({ locale = "en" }: { locale?: string }) {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [country, setCountry] = React.useState("Indonesia");
  const [province, setProvince] = React.useState("");
  const [city, setCity] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const finalUser = {
        id: username || "user_" + Date.now(),
        name: fullName || "New User",
        username: username || "user",
        email: email || "user@example.com",
        role: "santri",
        avatar: "/img/fatkul.jpg",
      };

      login(finalUser);

      toast.success("Akun berhasil dibuat!", {
        description: `Selamat datang di Qurani, ${fullName || username}!`,
      });

      router.push(`/${locale}/dashboard`);
      setIsLoading(false);
    }, 600);
  };

  const handleGoogleRegister = () => {
    setIsLoading(true);
    setTimeout(() => {
      login({
        username: "google_user",
        name: "Google User",
        email: "user@gmail.com",
      });

      toast.success("Pendaftaran Google berhasil!", {
        description: "Selamat datang di Qurani!",
      });

      router.push(`/${locale}/dashboard`);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#e6f4f1] flex flex-col items-center justify-center p-4 sm:p-6 select-none py-10">
      {/* Brand Logo Header */}
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-[#00875a]">
          QURANI
        </h1>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[460px] bg-white rounded-3xl p-7 sm:p-9 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-6 tracking-tight">
          Create your account
        </h2>

        {/* Google Signup Button */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50/80 text-xs sm:text-sm font-medium text-gray-700 shadow-2xs transition cursor-pointer"
        >
          {/* Google G Logo SVG */}
          <svg className="size-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign up with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-gray-200/80" />
          <span className="absolute bg-white px-3 text-xs text-gray-400 font-normal">
            Or
          </span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-gray-800 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a] transition"
            />
          </div>

          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-semibold text-gray-800 mb-1"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a] transition"
            />
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="reg-username"
              className="block text-xs font-semibold text-gray-800 mb-1"
            >
              Username
            </label>
            <input
              id="reg-username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john_doe"
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a] transition"
            />
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-xs font-semibold text-gray-800 mb-1"
            >
              Country
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a] transition"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Province */}
          <div>
            <label
              htmlFor="province"
              className="block text-xs font-semibold text-gray-800 mb-1"
            >
              Province
            </label>
            <select
              id="province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a] transition"
            >
              <option value="">Select Province</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-xs font-semibold text-gray-800 mb-1"
            >
              City
            </label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a] transition"
            >
              <option value="">Select City</option>
              {INDONESIA_CITIES.slice(0, 80).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="reg-password"
              className="block text-xs font-semibold text-gray-800 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-10 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                title={showPassword ? "Sembunyikan password" : "Lihat password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 rounded-xl bg-[#00875a] hover:bg-[#00754e] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="size-4" />
                <span>Create account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer: Login link */}
        <div className="text-center text-xs text-gray-600 mt-6">
          <span>Already have an account? </span>
          <Link
            href={`/${locale}/login`}
            className="text-gray-900 font-semibold underline hover:text-[#00875a] transition cursor-pointer"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
