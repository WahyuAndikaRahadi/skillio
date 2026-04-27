"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Github, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams?.get("error");

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle NextAuth URL errors
  React.useEffect(() => {
    if (urlError === "OAuthAccountNotLinked") {
      setError("Email ini sudah terdaftar. Silakan masuk menggunakan Email dan Password Anda.");
    } else if (urlError) {
      setError("Terjadi kesalahan saat otentikasi. Silakan coba lagi.");
    }
  }, [urlError]);

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
        const Swal = (await import("sweetalert2")).default;
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Selamat datang kembali!",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="w-full">
      {/* Full Screen Loading Overlay */}
      {isGoogleLoading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl">
           <div className="flex flex-col items-center gap-6">
              <div className="relative">
                 <div className="absolute inset-0 bg-skillio-500/20 blur-2xl rounded-full" />
                 <Loader2 className="w-12 h-12 text-skillio-600 animate-spin relative" />
              </div>
              <div className="text-center space-y-2">
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Menghubungkan ke Google...</h3>
                 <p className="text-sm font-bold text-slate-500 italic">"Satu langkah lagi menuju masa depanmu."</p>
              </div>
           </div>
        </div>
      )}

      {/* Mobile Logo */}
      <div className="mb-10 lg:hidden">
        <Link href="/" className="inline-flex items-center gap-3 group">
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
      </div>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">Selamat Datang</h1>
        <p className="text-slate-500 mt-2 font-medium">Masuk untuk melanjutkan progres belajarmu.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email</label>
          <input
            {...register("email")}
            className={cn(
              "w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-skillio-500 focus:ring-4 focus:ring-skillio-500/10 focus:bg-white outline-none transition-all font-medium text-slate-900",
              errors.email && "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10"
            )}
            placeholder="nama@email.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
          <input
            {...register("password")}
            type="password"
            className={cn(
              "w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-skillio-500 focus:ring-4 focus:ring-skillio-500/10 focus:bg-white outline-none transition-all font-medium text-slate-900",
              errors.password && "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10"
            )}
            placeholder="••••••••"
          />
          <div className="mt-2 flex items-center justify-between px-1">
            <div className="flex-1">
              {errors.password && <p className="text-xs text-red-500 font-bold">{errors.password.message}</p>}
            </div>
            <Link href="/auth/forgot-password" className="text-sm font-bold text-skillio-600 hover:text-skillio-700 hover:underline transition-colors">Lupa Password?</Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-skillio-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-skillio-700 transition-all shadow-lg shadow-skillio-500/20 active:scale-[0.98] disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Masuk Sekarang"}
        </button>
      </form>

      <div className="mt-8 relative text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <span className="relative px-4 bg-white text-xs font-bold text-slate-400 uppercase tracking-widest">Atau masuk dengan</span>
      </div>

      <div className="mt-8">
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          Lanjutkan dengan Google
        </button>
      </div>

      <p className="mt-8 text-center text-sm font-bold text-slate-500">
        Belum punya akun?{" "}
        <Link href="/auth/register" className="text-skillio-600 hover:underline">Daftar Gratis</Link>
      </p>
    </div>
  );
};

export default LoginForm;
