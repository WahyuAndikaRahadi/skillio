"use client";

import ProfileClient from "@/components/profile/ProfileClient";
import { useParams } from "next/navigation";

export default function PublicProfilePage() {
  const params = useParams();
  return <ProfileClient profileId={params.id} />;
}
