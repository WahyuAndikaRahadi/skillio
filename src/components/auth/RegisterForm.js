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
      <div className="w-full max-w-md p-8 bg-white rounded-[32px] shadow-2xl shadow-primary-blue/10 border border-light-blue">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-blue">
             <Mail size={32} />
          </div>
          <h1 className="text-2xl font-black text-dark-blue mb-2">Verifikasi Email</h1>
          <p className="text-dark-blue/60 font-medium">
            Kami telah mengirimkan kode 6 digit ke <br/>
            <span className="text-primary-blue font-bold">{registeredEmail}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={onVerifyOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-black text-dark-blue/40 uppercase tracking-widest mb-3 text-center">
              Masukkan Kode OTP
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full text-center text-4xl font-black tracking-[0.5em] py-5 rounded-2xl bg-light-blue/30 border-2 border-transparent focus:border-primary-blue focus:bg-white outline-none transition-all text-dark-blue"
              placeholder="000000"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-primary-blue text-white py-5 rounded-2xl font-black text-lg hover:bg-accent-blue transition-all shadow-xl shadow-primary-blue/20 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Verifikasi Sekarang
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-dark-blue/40">
          Tidak menerima kode? <button className="text-primary-blue hover:underline">Kirim Ulang</button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-[32px] shadow-2xl shadow-primary-blue/10 border border-light-blue">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="bg-primary-blue p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-primary-blue uppercase">
            SKILLIO
          </span>
        </Link>
        <h1 className="text-2xl font-black text-dark-blue">Daftar Akun Baru</h1>
        <p className="text-dark-blue/60 font-medium">Temukan potensimu sekarang</p>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-4 border-2 border-slate-100 rounded-2xl font-bold text-dark-blue hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98]"
      >
        <FcGoogle size={24} />
        Daftar dengan Google
      </button>

      <div className="my-8 flex items-center gap-4">
        <div className="h-[1px] flex-grow bg-slate-100"></div>
        <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Atau via Email</span>
        <div className="h-[1px] flex-grow bg-slate-100"></div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmitRegister)} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-dark-blue mb-1 ml-1">Nama Lengkap</label>
          <input
            {...register("name")}
            className={cn(
              "w-full px-5 py-3.5 rounded-2xl bg-light-blue/30 border-2 border-transparent focus:border-primary-blue focus:bg-white outline-none transition-all font-medium",
              errors.name && "border-red-500 bg-red-50"
            )}
            placeholder="John Doe"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-dark-blue mb-1 ml-1">Email</label>
          <input
            {...register("email")}
            className={cn(
              "w-full px-5 py-3.5 rounded-2xl bg-light-blue/30 border-2 border-transparent focus:border-primary-blue focus:bg-white outline-none transition-all font-medium",
              errors.email && "border-red-500 bg-red-50"
            )}
            placeholder="nama@email.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-dark-blue mb-1 ml-1">Password</label>
          <input
            {...register("password")}
            type="password"
            className={cn(
              "w-full px-5 py-3.5 rounded-2xl bg-light-blue/30 border-2 border-transparent focus:border-primary-blue focus:bg-white outline-none transition-all font-medium",
              errors.password && "border-red-500 bg-red-50"
            )}
            placeholder="••••••••"
          />
          {errors.password && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-dark-blue mb-1 ml-1">Konfirmasi Password</label>
          <input
            {...register("confirmPassword")}
            type="password"
            className={cn(
              "w-full px-5 py-3.5 rounded-2xl bg-light-blue/30 border-2 border-transparent focus:border-primary-blue focus:bg-white outline-none transition-all font-medium",
              errors.confirmPassword && "border-red-500 bg-red-50"
            )}
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-blue text-white py-4 mt-4 rounded-2xl font-black text-lg hover:bg-accent-blue transition-all shadow-xl shadow-primary-blue/20 active:scale-[0.98] disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Buat Akun Sekarang"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm font-bold text-dark-blue/60">
        Sudah punya akun?{" "}
        <Link href="/auth/login" className="text-primary-blue hover:underline">Masuk Di Sini</Link>
      </div>
    </div>
  );
};

export default RegisterForm;
