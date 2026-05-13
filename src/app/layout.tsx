import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@/lib/fontawesome";
import { PublicNavigationShell } from "@/components/layout/public-navigation-shell";
import { WishlistProvider } from "@/context/wishlist-context";
import { PersonaThemeProvider } from "@/components/theme/persona-theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LocalTrip AX / 소원로컬트립",
  description: "문의·연결 중심의 로컬 여행 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className={`${inter.variable} font-sans min-h-full flex flex-col antialiased theme-masil`}>
        <PersonaThemeProvider>
          <WishlistProvider>
            <PublicNavigationShell>{children}</PublicNavigationShell>
          </WishlistProvider>
        </PersonaThemeProvider>
      </body>
    </html>
  );
}
