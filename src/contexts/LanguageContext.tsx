"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "sq";
type TranslationStrings = Record<string, string>;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Default translations as fallback
const defaultTranslations: Record<Language, TranslationStrings> = {
  en: {
    "welcome_title": "Welcome to Dental Center",
    "welcome_description": "Welcome to our platform for live tracking of orders and day to day things.",
  },
  sq: {
    "welcome_title": "Mirë se vini në Qendrën Dentare",
    "welcome_description": "Mirë se vini në platformën tonë për gjurmimin e porosive dhe gjërave të përditshme.",
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("sq");
  const [tStrings, setTStrings] = useState<TranslationStrings>({});
  const [loading, setLoading] = useState(true);

  // Simulate loading with a timeout to demonstrate the loading state
  React.useEffect(() => {
    setLoading(true);
    
    const timer = setTimeout(() => {
      setTStrings(defaultTranslations[language]);
      setLoading(false);
    }, 800); // Simulate 800ms loading time
    
    return () => clearTimeout(timer);
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  function t(key: string) {
    return tStrings[key] || key;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, loading }}>
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

// Loading component
export function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p>Loading translations...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
