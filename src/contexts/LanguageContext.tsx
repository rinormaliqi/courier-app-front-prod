"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "sq";
type TranslationStrings = Record<string, string>;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Import translations directly
import enTranslations from "@/public/locales/en.json";
import sqTranslations from "@/public/locales/sq.json";

const translations: Record<Language, TranslationStrings> = {
  en: enTranslations,
  sq: sqTranslations,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("sq");
  const [tStrings, setTStrings] = useState<TranslationStrings>({});
  const [loading, setLoading] = useState(true);

  // Simulate loading phase (useful if later you fetch from API)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setTStrings(translations[language]);
      setLoading(false);
    }, 300); // small delay for UX
    return () => clearTimeout(timer);
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  function t(key: string) {
    return tStrings[key] || key;
  }

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t, loading }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
