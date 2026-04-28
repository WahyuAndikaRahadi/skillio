"use client";

import React, { Suspense } from "react";
import ProfileClient from "@/components/profile/ProfileClient";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function ProfileContent() {
  const params = useParams();
  return <ProfileClient profileId={params.id} isPublicView={true} />;
}

export default function PublicProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary-blue animate-spin" />
          <p className="font-black text-slate-400 text-xs uppercase tracking-widest">Mempersiapkan Profil...</p>
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
