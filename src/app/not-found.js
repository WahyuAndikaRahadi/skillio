import ErrorPage from "@/components/ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage 
      code="404"
      title="Halaman Tidak Ditemukan"
      message="Sepertinya langkahmu terhenti di sini. Halaman yang kamu cari tidak dapat kami temukan atau mungkin sudah pindah ke dimensi lain."
    />
  );
}
