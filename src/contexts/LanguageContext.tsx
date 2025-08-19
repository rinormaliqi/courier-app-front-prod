"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Language = "en" | "sq";
type TranslationStrings = Record<string, string>;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("sq");
  const [tStrings, setTStrings] = useState<TranslationStrings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function loadTranslations() {
      try {
        const response = await fetch(`/locales/${language}.json`);
        if (!response.ok) throw new Error("Failed to load translations");
        const json: TranslationStrings = await response.json();
        setTStrings(json);
      } catch (error) {
        console.error(error);
        setTStrings({});
      } finally {
        setLoading(false);
      }
    }
    loadTranslations();
  }, [language]);

  function t(key: string) {
    return tStrings[key] || key;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, loading }}>
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
