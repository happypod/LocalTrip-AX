import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});


export const metadata: Metadata = {
  title: "LocalTrip AX / 소원로컬트립 MVP",
  description: "문의·연결 중심의 로컬 여행 플랫폼 MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className={`${inter.variable} font-sans min-h-full flex flex-col antialiased`}>

        {children}
      </body>
    </html>
  );
}
