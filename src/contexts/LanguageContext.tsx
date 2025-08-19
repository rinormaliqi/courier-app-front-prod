"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "sq";
type TranslationStrings = Record<string, string>;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Import translations directly instead of fetching them
import enTranslations from '@/public/locales/en.json';
import sqTranslations from '@/public/locales/sq.json';

const translations: Record<Language, TranslationStrings> = {
  en: enTranslations,
  sq: sqTranslations
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("sq");
  const [tStrings, setTStrings] = useState<TranslationStrings>(translations[language]);

  // Update translations when language changes
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    setTStrings(translations[lang]);
  };

  function t(key: string) {
    return tStrings[key] || key;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
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