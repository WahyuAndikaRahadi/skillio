import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "Skillio | Temukan Karier Impianmu dalam 30 Hari",
  description: "Skillio adalah platform belajar berbasis AI yang membantu anak muda Indonesia menemukan bidang yang paling sesuai dan menguasainya dalam 30 hari.",
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Skillio",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#2b6ea6",
  width: "device-width",
  initialScale: 1,
};

import Preloader from "@/components/layout/Preloader";
import PWAInstall from "@/components/layout/PWAInstall";

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://www.transparenttextures.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <Preloader />
        <AuthProvider>
          {children}
          <PWAInstall />
        </AuthProvider>
      </body>
    </html>
  );
}
