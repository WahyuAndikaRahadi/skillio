"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
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

      // Auto login after register
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      setError(err.message || "Terjadi kesalahan, silakan coba lagi");
    } finally {
      setIsLoading(false);
    }
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
        <h1 className="text-2xl font-black text-dark-blue">Daftar Akun Baru</h1>
        <p className="text-dark-blue/60 font-medium">Temukan potensimu sekarang</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
