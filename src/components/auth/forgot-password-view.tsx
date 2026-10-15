"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function ForgotPasswordView({ locale = "en" }: { locale?: string }) {
  const [emailOrUsername, setEmailOrUsername] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim()) {
      toast.error("Please enter your email or username");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success("Instructions sent!", {
        description: "Password reset link has been dispatched to your email.",
      });
    }, 800);
  };

  const loginHref = locale ? `/${locale}/login` : "/login";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col justify-center items-center p-6 md:p-10 font-sans">
      <div className="w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icons/Qurani - Logo Green.png"
              alt="Qurani"
              width={130}
              height={40}
              className="object-contain dark:hidden"
              priority
            />
            <Image
              src="/icons/Qurani - Logo White.png"
              alt="Qurani"
              width={130}
              height={40}
              className="object-contain hidden dark:block"
              priority
            />
          </Link>
        </div>

        {/* Card */}
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-6 sm:p-8">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="size-14 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="size-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Check your email
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                We sent password recovery instructions for{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {emailOrUsername}
                </span>
                . Please check your inbox or spam folder.
              </p>

              <div className="pt-4">
                <Link
                  href={loginHref}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold shadow-md transition"
                >
                  <ArrowLeft className="size-4" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center space-y-1.5">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Reset Password
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enter your email or username and we will send you a reset link.
                </p>
              </div>

              <div>
                <label
                  htmlFor="identifier"
                  className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5"
                >
                  Email or Username
                </label>
                <div className="relative">
                  <input
                    id="identifier"
                    type="text"
                    required
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder="name@example.com or username"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 pl-9 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition font-medium"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Sending Instructions...</span>
                  </>
                ) : (
                  <span>Send Reset Instructions</span>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href={loginHref}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition font-medium"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Return to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordView;
