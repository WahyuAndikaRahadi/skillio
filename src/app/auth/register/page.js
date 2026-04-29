import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-white flex-row-reverse">
      {}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-slate-50 border-l border-slate-100">
        <div className="absolute top-[-10%] left-[-10%] h-[700px] w-[700px] rounded-full bg-skillio-100/60 blur-[120px] -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-teal-50/60 blur-[120px] -z-10" />
        <div className="absolute top-[40%] right-[20%] h-[500px] w-[500px] rounded-full bg-sky-50/50 blur-[100px] -z-10" />

        <div className="flex justify-end">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
             Kembali ke Beranda <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>

        <div className="max-w-md ml-auto text-right relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-10 w-fit ml-auto group">
            <span className="font-display text-2xl font-bold tracking-tight text-slate-900">
              Skillio
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl shadow-skillio-500/10 transition-all group-hover:scale-110">
              <Image
                src="/images/skillio-logo.png"
                alt="Skillio Logo"
                width={48}
                height={48}
                className="h-7 w-7 object-contain"
              />
            </div>
          </Link>

          <h1 className="font-display text-5xl font-bold leading-tight text-slate-950 mb-6 tracking-tight">
            Mulai bangun <span className="text-skillio-500">portofolio nyatamu.</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            Daftar sekarang dan temukan bidang digital yang paling cocok denganmu, lalu selesaikan roadmap 30 harinya.
          </p>
        </div>

        <div className="text-sm font-medium text-slate-400 text-right">
          © {new Date().getFullYear()} Skillio Indonesia.
        </div>
      </div>

      {}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 xl:px-32 relative bg-white">
        <div className="w-full max-w-sm mx-auto">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
