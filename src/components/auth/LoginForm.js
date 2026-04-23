"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Github, Mail } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-[32px] shadow-2xl shadow-primary-blue/10 border border-light-blue">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="bg-primary-blue p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-primary-blue">
            SKILLIO
          </span>
        </Link>
        <h1 className="text-2xl font-black text-dark-blue">Selamat Datang Kembali</h1>
        <p className="text-dark-blue/60 font-medium">Masuk untuk melanjutkan perjalananmu</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-dark-blue mb-2 ml-1">Email</label>
          <input
            {...register("email")}
            className={cn(
              "w-full px-5 py-4 rounded-2xl bg-light-blue/30 border-2 border-transparent focus:border-primary-blue focus:bg-white outline-none transition-all font-medium",
              errors.email && "border-red-500 bg-red-50"
            )}
            placeholder="nama@email.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2 ml-1">
            <label className="text-sm font-bold text-dark-blue">Password</label>
            <Link href="#" className="text-xs font-bold text-primary-blue hover:underline">Lupa Password?</Link>
          </div>
          <input
            {...register("password")}
            type="password"
            className={cn(
              "w-full px-5 py-4 rounded-2xl bg-light-blue/30 border-2 border-transparent focus:border-primary-blue focus:bg-white outline-none transition-all font-medium",
              errors.password && "border-red-500 bg-red-50"
            )}
            placeholder="••••••••"
          />
          {errors.password && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.password.message}</p>}
          <div className="text-right mt-2">
            <Link href="/auth/forgot-password" size="sm" className="text-xs font-bold text-primary-blue hover:underline">
              Lupa Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-blue text-white py-4 rounded-2xl font-black text-lg hover:bg-accent-blue transition-all shadow-xl shadow-primary-blue/20 active:scale-[0.98] disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Masuk Sekarang"}
        </button>
      </form>

      <div className="mt-8 relative text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-light-blue"></div>
        </div>
        <span className="relative px-4 bg-white text-xs font-bold text-dark-blue/40 uppercase tracking-widest">Atau masuk dengan</span>
      </div>

      <div className="mt-8">
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-light-blue font-bold text-dark-blue hover:bg-light-blue/20 transition-all active:scale-[0.98]"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          Lanjutkan dengan Google
        </button>
      </div>

      <p className="mt-8 text-center text-sm font-bold text-dark-blue/60">
        Belum punya akun?{" "}
        <Link href="/auth/register" className="text-primary-blue hover:underline">Daftar Gratis</Link>
      </p>
    </div>
  );
};

export default LoginForm;
