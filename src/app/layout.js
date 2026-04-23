import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/SessionProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata = {
  title: "Skillio | Temukan Karier Impianmu dalam 30 Hari",
  description: "Skillio adalah platform belajar berbasis AI yang membantu anak muda Indonesia menemukan bidang yang paling sesuai dan menguasainya dalam 30 hari.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
