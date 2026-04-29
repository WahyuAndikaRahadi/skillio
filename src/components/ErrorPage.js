"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowLeft, Home, LayoutDashboard } from "lucide-react";

export default function ErrorPage({ code = "404", title = "Halaman Tidak Ditemukan", message = "Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan." }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/skillio-logo.png"
            alt="Skillio Logo"
            width={120}
            height={40}
            priority
            className="h-auto w-auto"
          />
        </div>

        <div className="relative mb-8">
          <h1 className="text-9xl font-bold text-blue-600/10 select-none">
            {code}
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
        </div>

        <p className="text-gray-600 mb-10">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={session ? "/dashboard" : "/"}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            {session ? (
              <>
                <LayoutDashboard size={20} />
                Ke Dashboard
              </>
            ) : (
              <>
                <Home size={20} />
                Ke Beranda
              </>
            )}
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
        </div>
      </motion.div>
    </div>
  );
}
