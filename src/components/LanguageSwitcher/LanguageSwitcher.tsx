"use client";

import { Button, XStack } from "tamagui";
import { useLanguage } from "@/src/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <XStack space="$4" ai="center">
      <Button
        disabled={language === "en"}
        onPress={() => setLanguage("en")}
        size="$4"
        theme={language === "en" ? "active" : "alt2"}
        // Optional: make disabled button visually distinct
        disabledStyle={{ opacity: 0.5, cursor: "default" }}
      >
        English
      </Button>
      <Button
        disabled={language === "sq"}
        onPress={() => setLanguage("sq")}
        size="$4"
        theme={language === "sq" ? "active" : "alt2"}
        disabledStyle={{ opacity: 0.5, cursor: "default" }}
      >
        Shqip
      </Button>
    </XStack>
  );
}
