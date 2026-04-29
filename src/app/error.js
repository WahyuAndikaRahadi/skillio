"use client";

import { useEffect } from "react";
import ErrorPage from "@/components/ErrorPage";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPage 
      code="500"
      title="Terjadi Kesalahan"
      message="Maaf, terjadi kesalahan sistem yang tidak terduga. Tim teknis kami telah diberitahu mengenai masalah ini."
    />
  );
}
