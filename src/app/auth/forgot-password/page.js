"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Loader2, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Lock,
  CheckCircle2,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState("email"); // 'email', 'otp', 'reset'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
    setStep("reset");
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md p-8 bg-white rounded-[40px] shadow-2xl shadow-primary-blue/5 border border-light-blue">
        <div className="text-center mb-8">
          <Link href="/auth/login" className="inline-flex items-center gap-1 text-primary-blue text-sm font-bold mb-6 hover:-translate-x-1 transition-transform">
             <ChevronLeft size={16} /> Kembali ke Login
          </Link>
          <h1 className="text-3xl font-black text-dark-blue mb-2">Reset Password</h1>
          <p className="text-dark-blue/60 font-medium italic">Amankan kembali akun Skillio Anda</p>
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
                <label className="block text-sm font-bold text-dark-blue mb-2 ml-1">Email Terdaftar</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-blue/30" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-light-blue/30 border-2 border-transparent focus:border-primary-blue focus:bg-white outline-none transition-all font-medium"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-blue text-white py-4 rounded-2xl font-black text-lg hover:bg-accent-blue transition-all shadow-xl shadow-primary-blue/20 flex items-center justify-center gap-2"
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
              <div className="text-center">
                <p className="text-sm font-medium text-dark-blue/60 mb-6">
                  Kode 6 digit telah dikirim ke <br/> <span className="text-primary-blue font-bold">{email}</span>
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center text-4xl font-black tracking-[0.5em] py-5 rounded-2xl bg-light-blue/30 border-2 border-transparent focus:border-primary-blue focus:bg-white outline-none transition-all"
                  placeholder="000000"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={otp.length !== 6}
                className="w-full bg-primary-blue text-white py-4 rounded-2xl font-black text-lg hover:bg-accent-blue transition-all shadow-xl shadow-primary-blue/20"
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
                <label className="block text-sm font-bold text-dark-blue mb-2 ml-1">Password Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-light-blue/30 border-2 border-transparent focus:border-primary-blue focus:bg-white outline-none transition-all font-medium"
                  placeholder="Minimal 6 karakter"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-dark-blue mb-2 ml-1">Konfirmasi Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-light-blue/30 border-2 border-transparent focus:border-primary-blue focus:bg-white outline-none transition-all font-medium"
                  placeholder="Ulangi password baru"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-2"
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
  );
}
