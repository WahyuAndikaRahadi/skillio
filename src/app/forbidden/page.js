import ErrorPage from "@/components/ErrorPage";

export default function Forbidden() {
  return (
    <ErrorPage 
      code="403"
      title="Akses Ditolak"
      message="Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi admin jika Anda merasa ini adalah kesalahan."
    />
  );
}
