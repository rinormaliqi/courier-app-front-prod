"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { TamaguiProvider } from "@tamagui/core";
import tamaguiConfig from "../tamagui.config";
import { LanguageProvider, useLanguage } from "@/src/contexts/LanguageContext";
import Loading from "@/src/components/loading/loading";
import { SidebarProvider } from "@/src/contexts/SidebarContext";
import { AuthProvider } from "@/src/contexts/authContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  // Now useLanguage() is inside LanguageProvider, no error
  const { loading } = useLanguage();

  if (loading) return <Loading />;

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <LanguageProvider>
        <AuthProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <SidebarProvider>
              <TamaguiProvider config={tamaguiConfig}>
                <LayoutContent>{children}</LayoutContent>
              </TamaguiProvider>
            </SidebarProvider>
          </body>
        </AuthProvider>
      </LanguageProvider>
    </html>
  );
}
