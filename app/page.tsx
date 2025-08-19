"use client";
import { LoginForm } from "@/src/components/auth/Login";
import { useLanguage } from "@/src/contexts/LanguageContext";
import LanguageSwitcher from "@/src/components/LanguageSwitcher/LanguageSwitcher"; // import it

export default function Home() {
  const { t } = useLanguage();
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      {/* relative container for positioning */}
      <div className="relative w-full max-w-5xl h-[90vh] flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Language Switcher fixed top-right inside this container */}
        <div className="absolute top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>

        {/* Left Panel */}
        <div className="w-full sm:w-1/2 sm:bg-[#00b294] bg-white text-white flex items-center justify-center p-8">
          <div className="max-w-md hidden sm:block">
            <h1 className="text-3xl font-bold mb-4">{t("welcome_title")}</h1>
            <p className="mb-6">{t("welcome_description")}</p>
            <button className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-[#00b294] transition">
              {t("read_more")}
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full sm:w-1/2 bg-white flex p-4 sm:p-8">
          <div className="w-full flex justify-center sm:items-center sm:justify-center mt-[-200px] sm:mt-0">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
