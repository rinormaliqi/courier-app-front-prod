"use client";

import { TamaguiProvider } from "@tamagui/core";
import tamaguiConfig from "../tamagui.config";
import { LanguageProvider } from "@/src/contexts/LanguageContext";
import { SidebarProvider } from "@/src/contexts/SidebarContext";
import { AuthProvider } from "@/src/contexts/authContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SidebarProvider>
          <TamaguiProvider config={tamaguiConfig}>
            {children}
          </TamaguiProvider>
        </SidebarProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}