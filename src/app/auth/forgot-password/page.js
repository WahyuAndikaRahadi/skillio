"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Loader2,
  Mail,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  React.useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep("reset");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || resendCount >= 3) return;

    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setOtp("");
      setResendCountdown(60);
      setResendCount((prev) => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      router.push("/auth/login?reset=success");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-slate-50 border-r border-slate-100">
        <div className="absolute top-[-10%] right-[-10%] h-[700px] w-[700px] rounded-full bg-skillio-100/60 blur-[120px] -z-10" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-teal-50/60 blur-[120px] -z-10" />
        <div className="absolute top-[40%] left-[20%] h-[500px] w-[500px] rounded-full bg-sky-50/50 blur-[100px] -z-10" />

        <div>
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Login
          </Link>
        </div>

        <div className="max-w-md relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-10 w-fit group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl shadow-skillio-500/10 transition-all group-hover:scale-110">
              <Image
                src="/images/skillio-logo.png"
                alt="Skillio Logo"
                width={48}
                height={48}
                className="h-7 w-7 object-contain"
              />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-slate-900">
              Skillio
            </span>
          </Link>

          <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 mb-6 tracking-tight">
            Amankan kembali <span className="text-skillio-600">akunmu.</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            Jangan khawatir, kami akan membantu memulihkan aksesmu agar kamu bisa melanjutkan proses belajar.
          </p>
        </div>

        <div className="text-sm font-medium text-slate-400">
          © {new Date().getFullYear()} Skillio Indonesia.
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 xl:px-32 relative bg-white">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-10 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-3 group mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg shadow-skillio-500/20 group-hover:scale-110 transition-transform">
                <Image
                  src="/images/skillio-logo.png"
                  alt="Skillio Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-slate-900">
                Skillio
              </span>
            </Link>
            <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Login
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-slate-900">Lupa Password?</h1>
            <p className="text-slate-500 mt-2 font-medium">Ikuti langkah mudah di bawah ini.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRequestOtp}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Terdaftar</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-skillio-500 focus:ring-4 focus:ring-skillio-500/10 focus:bg-white outline-none transition-all font-medium text-slate-900"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-skillio-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-skillio-700 transition-all shadow-lg shadow-skillio-500/20 active:scale-[0.98] disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>Minta Kode OTP <ArrowRight size={20} /></>
                  )}
                </button>
              </motion.form>
            )}

            {step === "otp" && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOtp}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">
                    Masukkan Kode OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center text-2xl font-extrabold tracking-[0.5em] py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-skillio-500 focus:ring-4 focus:ring-skillio-500/10 focus:bg-white outline-none transition-all text-slate-900 shadow-sm"
                    placeholder="000000"
                    required
                  />
                  <p className="mt-4 text-center text-sm font-medium text-slate-500">
                    Dikirim ke <span className="text-skillio-600 font-bold">{email}</span>
                  </p>
                  <p className="mt-4 text-center text-sm font-bold text-slate-500">
                    Tidak menerima kode?{" "}
                    {resendCount >= 3 ? (
                      <span className="text-red-500 font-bold italic underline">Batas kirim ulang tercapai</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendCountdown > 0 || isLoading}
                        className={cn(
                          "text-skillio-600 hover:underline disabled:text-slate-400 disabled:no-underline font-bold transition-all",
                          resendCountdown > 0 && "cursor-not-allowed"
                        )}
                      >
                        {resendCountdown > 0 ? `Kirim Ulang (${resendCountdown}s)` : "Kirim Ulang"}
                      </button>
                    )}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={otp.length !== 6}
                  className="w-full bg-skillio-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-skillio-700 transition-all shadow-lg shadow-skillio-500/20 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center"
                >
                  Verifikasi Kode
                </button>
              </motion.form>
            )}

            {step === "reset" && (
              <motion.form
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password Baru</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-skillio-500 focus:ring-4 focus:ring-skillio-500/10 focus:bg-white outline-none transition-all font-medium text-slate-900"
                      placeholder="Minimal 6 karakter"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Konfirmasi Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-skillio-500 focus:ring-4 focus:ring-skillio-500/10 focus:bg-white outline-none transition-all font-medium text-slate-900"
                      placeholder="Ulangi password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-base hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 active:scale-[0.98] disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>Simpan Password Baru <CheckCircle2 size={20} /></>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
