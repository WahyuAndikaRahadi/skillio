import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import Image from "next/image";


export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r border-slate-100">
        <div className="absolute inset-0 bg-white -z-20" />
        <div className="absolute top-[-10%] right-[-10%] h-[700px] w-[700px] rounded-full bg-skillio-100/60 blur-[120px] -z-10" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-teal-100/60 blur-[120px] -z-10" />
        <div className="absolute top-[40%] left-[20%] h-[500px] w-[500px] rounded-full bg-sky-100/50 blur-[100px] -z-10" />

        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
        </div>

        <div className="max-w-md ">
          <Link href="/" className="flex items-center gap-3 mb-8 w-fit">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg shadow-skillio-500/20">
              <Image
                src="/images/skillio-logo.png"
                alt="Skillio Logo"
                width={40}
                height={40}
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-slate-900">
              Skillio
            </span>
          </Link>

          <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 mb-6">
            Langkah pertamamu menuju <span className="text-skillio-600">karir digital.</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Masuk dan lanjutkan roadmap 30 harimu. Ribuan anak muda Indonesia telah membuktikan potensinya bersama Skillio.
          </p>
        </div>

        <div className="text-sm font-medium text-slate-400">
          © {new Date().getFullYear()} Skillio Indonesia.
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 xl:px-32 relative bg-white">
        <div className="w-full max-w-sm mx-auto">
          <Suspense fallback={<div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-skillio-200 border-t-skillio-600 rounded-full animate-spin"></div></div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
