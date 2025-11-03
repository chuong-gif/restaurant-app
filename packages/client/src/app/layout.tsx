import type { Metadata } from "next";
import { Nunito, Pacifico } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GlobalSpinner from "@/components/common/GlobalSpinner";
import BackToTop from "@/components/common/BackToTop";
import ChatPopupPlaceholder from "@/components/common/ChatPopup.placeholder";
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

// Định nghĩa fonts (lấy từ /public/fonts nếu cần)
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ['400', '500', '600', '700'],
});

const pacifico = Pacifico({
  subsets: ["latin"],
  variable: "--font-pacifico",
  weight: "400",
});

export const metadata: Metadata = {
  title: "EnViSi Restaurant",
  description: "Nhà hàng ẩm thực EnViSi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        {/* ĐÃ XÓA BOOTSTRAP CSS */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${nunito.variable} ${pacifico.variable} min-h-screen bg-background font-sans antialiased`}>
        <Providers>
          <GlobalSpinner />
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <ChatPopupPlaceholder />
          <BackToTop />
          <Footer />
          <Toaster /> {/* THÊM TOASTER VÀO ĐÂY */}
        </Providers>
        {/* ĐÃ XÓA BOOTSTRAP SCRIPT */}
      </body>
    </html>
  );
}