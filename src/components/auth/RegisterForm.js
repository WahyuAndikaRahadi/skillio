"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

const RegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("register"); // 'register' or 'verify'
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otp, setOtp] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmitRegister = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mendaftar");
      }

      setRegisteredEmail(data.email);
      setStep("verify");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan, silakan coba lagi");
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail, otp }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Kode OTP salah");
      }

      // Success - Redirect to login
      router.push("/auth/login?verified=true");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  if (step === "verify") {
    return (
      <div className="w-full">
        <div className="mb-10 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-skillio-600 text-white shadow-lg shadow-skillio-500/20 group-hover:rotate-12 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900">
              Skillio
            </span>
          </Link>
        </div>

        <div className="mb-8">
          <div className="w-16 h-16 bg-skillio-50 text-skillio-600 rounded-2xl flex items-center justify-center mb-6">
             <Mail size={32} />
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Verifikasi Email</h1>
          <p className="text-slate-500 font-medium">
            Kami telah mengirimkan kode 6 digit ke <br/>
            <span className="text-skillio-600 font-bold">{registeredEmail}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={onVerifyOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
              Masukkan Kode OTP
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full text-center text-4xl font-black tracking-[0.5em] py-5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-skillio-500 focus:ring-4 focus:ring-skillio-500/10 focus:bg-white outline-none transition-all text-slate-900"
              placeholder="000000"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-skillio-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-skillio-700 transition-all shadow-lg shadow-skillio-500/20 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Verifikasi Sekarang
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-slate-500">
          Tidak menerima kode? <button className="text-skillio-600 hover:underline">Kirim Ulang</button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-10 lg:hidden">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-skillio-600 text-white shadow-lg shadow-skillio-500/20 group-hover:rotate-12 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">
            Skillio
          </span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">Daftar Akun Baru</h1>
        <p className="text-slate-500 mt-2 font-medium">Temukan potensimu sekarang</p>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
      >
        <FcGoogle size={24} />
        Daftar dengan Google
      </button>

      <div className="my-8 flex items-center gap-4">
        <div className="h-[1px] flex-grow bg-slate-200"></div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Atau via Email</span>
        <div className="h-[1px] flex-grow bg-slate-200"></div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmitRegister)} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Nama Lengkap</label>
          <input
            {...register("name")}
            className={cn(
              "w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-skillio-500 focus:ring-4 focus:ring-skillio-500/10 focus:bg-white outline-none transition-all font-medium text-slate-900",
              errors.name && "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10"
            )}
            placeholder="John Doe"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Email</label>
          <input
            {...register("email")}
            className={cn(
              "w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-skillio-500 focus:ring-4 focus:ring-skillio-500/10 focus:bg-white outline-none transition-all font-medium text-slate-900",
              errors.email && "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10"
            )}
            placeholder="nama@email.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Password</label>
          <input
            {...register("password")}
            type="password"
            className={cn(
              "w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-skillio-500 focus:ring-4 focus:ring-skillio-500/10 focus:bg-white outline-none transition-all font-medium text-slate-900",
              errors.password && "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10"
            )}
            placeholder="••••••••"
          />
          {errors.password && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Konfirmasi Password</label>
          <input
            {...register("confirmPassword")}
            type="password"
            className={cn(
              "w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-skillio-500 focus:ring-4 focus:ring-skillio-500/10 focus:bg-white outline-none transition-all font-medium text-slate-900",
              errors.confirmPassword && "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10"
            )}
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-skillio-600 text-white py-4 mt-4 rounded-2xl font-bold text-base hover:bg-skillio-700 transition-all shadow-lg shadow-skillio-500/20 active:scale-[0.98] disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Buat Akun Sekarang"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm font-bold text-slate-500">
        Sudah punya akun?{" "}
        <Link href="/auth/login" className="text-skillio-600 hover:underline">Masuk Di Sini</Link>
      </div>
    </div>
  );
};

export default RegisterForm;
