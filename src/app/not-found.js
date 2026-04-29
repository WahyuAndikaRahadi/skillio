import ErrorPage from "@/components/ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage 
      code="404"
      title="Halaman Tidak Ditemukan"
      message="Oops! Sepertinya Anda tersesat. Halaman yang Anda tuju tidak dapat kami temukan."
    />
  );
}
