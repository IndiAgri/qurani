"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Eye, EyeOff, Loader2, Check } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

export function LoginView({ locale = "en" }: { locale?: string }) {
  const router = useRouter();
  const { login } = useAuth();

  // Preset to user's desired credentials: username: fatkul, pw: Bismillah123
  const [username, setUsername] = React.useState("fatkul");
  const [password, setPassword] = React.useState("Bismillah123");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isCaptchaChecked, setIsCaptchaChecked] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCaptchaChecked) {
      toast.error("Mohon centang verifikasi 'I'm not a robot'");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const finalUsername = username.trim() || "fatkul";
      login({
        id: "fatkul",
        username: finalUsername,
        name: finalUsername.toLowerCase() === "fatkul" ? "Fatkul" : finalUsername,
        email: `${finalUsername}@example.com`,
        avatar: "/img/fatkul.jpg",
        role: "santri",
      });

      toast.success("Login berhasil!", {
        description: `Selamat datang kembali, ${finalUsername}!`,
      });

      router.push(`/${locale}/dashboard`);
      setIsLoading(false);
    }, 500);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      login({
        id: "fatkul",
        username: "fatkul",
        name: "Fatkul",
        email: `fatkul@${provider.toLowerCase()}.com`,
        avatar: "/img/fatkul.jpg",
        role: "santri",
      });

      toast.success(`Login dengan ${provider} berhasil!`, {
        description: "Selamat datang di Qurani!",
      });

      router.push(`/${locale}/dashboard`);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-[#e6f4f1] flex flex-col items-center justify-center p-4 sm:p-6 select-none font-sans">
      {/* Brand Logo Header */}
      <div className="mb-6 sm:mb-8 text-center">
        <Link href="/" className="inline-block hover:opacity-90 transition">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-[#00875a]">
            QURANI
          </h1>
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[440px] bg-white rounded-3xl p-7 sm:p-9 shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-6 tracking-tight">
          Login to your account
        </h2>

        {/* 3 Social Login Buttons in a Row (Google, GitHub, Apple) */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocialLogin("Google")}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-2xs transition cursor-pointer disabled:opacity-50"
          >
            <svg className="size-3.5 shrink-0" viewBox="0 0 24 24">
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
            <span>Google</span>
          </button>

          {/* GitHub */}
          <button
            type="button"
            onClick={() => handleSocialLogin("GitHub")}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-2xs transition cursor-pointer disabled:opacity-50"
          >
            <svg className="size-3.5 shrink-0 fill-gray-900" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </button>

          {/* Apple */}
          <button
            type="button"
            onClick={() => handleSocialLogin("Apple")}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-2xs transition cursor-pointer disabled:opacity-50"
          >
            <svg className="size-3.5 shrink-0 fill-gray-900" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.03-7.69-7.8-12-14.31-6.19-9.35-11.05-20.08-14.59-32.18-3.54-12.1-5.31-23.77-5.31-35.01 0-14.15 3.65-26.06 10.96-35.73 7.31-9.67 16.59-14.63 27.84-14.88 5.48 0 11.11 1.41 16.89 4.23 5.78 2.82 9.77 4.29 11.96 4.41 1.74-.24 5.92-1.74 12.54-4.52 6.62-2.77 12.38-4 17.29-3.69 13.06.76 23.36 5.66 30.9 14.7-11.42 6.96-17 16.53-16.74 28.71.22 9.58 3.86 17.63 10.93 24.15 7.07 6.53 15.54 10.12 25.42 10.78-2.28 6.96-5.06 13.88-8.34 20.76zM119.22 33.15c0-7.39 2.66-14.46 7.99-21.21 5.33-6.75 11.96-11.09 19.89-13.02.76 4.24.49 8.65-.82 13.23-1.31 4.58-3.75 8.94-7.33 13.08-4.46 5.11-9.3 8.76-14.53 10.95-2.28.98-4.02 1.48-5.2 1.48v-4.51z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="w-full border-t border-gray-200/80" />
          <span className="absolute bg-white px-3 text-xs text-gray-400 font-normal">
            Or
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold text-gray-800 mb-1.5"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="fatkul"
              className="w-full rounded-xl border border-gray-200 bg-[#edf3f9]/70 focus:bg-white px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a] transition font-medium"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-gray-800"
              >
                Password
              </label>
              <Link
                href={`/${locale}/forgot-password`}
                className="text-[11px] text-gray-500 hover:text-[#00875a] hover:underline transition cursor-pointer"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Bismillah123"
                className="w-full rounded-xl border border-gray-200 bg-[#edf3f9]/70 focus:bg-white px-3.5 py-2.5 pr-10 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a] transition font-medium tracking-wide"
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

          {/* reCAPTCHA Box (Matches Screenshot) */}
          <div className="rounded-lg border border-gray-200 bg-[#f9fafb] p-3 flex items-center justify-between select-none shadow-2xs">
            <label
              htmlFor="captcha-check"
              className="flex items-center gap-3 cursor-pointer"
            >
              <div
                onClick={() => setIsCaptchaChecked((prev) => !prev)}
                className={`size-6 rounded border flex items-center justify-center transition cursor-pointer ${
                  isCaptchaChecked
                    ? "bg-[#00875a] border-[#00875a] text-white"
                    : "bg-white border-gray-300 hover:border-gray-400"
                }`}
              >
                {isCaptchaChecked && <Check className="size-4 stroke-[3]" />}
              </div>
              <span className="text-xs font-medium text-gray-700">
                I&apos;m not a robot
              </span>
            </label>

            {/* reCAPTCHA Brand Icon & Text */}
            <div className="flex flex-col items-center justify-center text-center pl-2">
              <svg className="size-6 text-[#1a73e8]" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-[9px] text-gray-400 font-semibold tracking-tighter uppercase mt-0.5">
                reCAPTCHA
              </span>
            </div>
          </div>

          {/* Submit Button (-> Login) */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-[#00875a] hover:bg-[#00754e] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer disabled:opacity-70 active:scale-[0.99]"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <LogIn className="size-4" />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        {/* Footer: Sign up link */}
        <div className="text-center text-xs text-gray-600 mt-6">
          <span>Don&apos;t have an account? </span>
          <Link
            href={`/${locale}/register`}
            className="text-gray-900 font-semibold underline hover:text-[#00875a] transition cursor-pointer"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
