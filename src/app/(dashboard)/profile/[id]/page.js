"use client";

import React, { Suspense } from "react";
import ProfileClient from "@/components/profile/ProfileClient";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function ProfileContent() {
  const params = useParams();
  return <ProfileClient profileId={params.id} />;
}

export default function PublicProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-blue animate-spin" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
