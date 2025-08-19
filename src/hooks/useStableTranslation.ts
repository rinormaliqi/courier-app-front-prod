// hooks/useStableTranslation.ts
import { useCallback, useEffect, useRef } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

export function useStableTranslation() {
  const { t: originalT } = useLanguage();
  const tRef = useRef(originalT);

  useEffect(() => {
    tRef.current = originalT;
  }, [originalT]);

  const t = useCallback((key: string) => tRef.current(key), []);

  return { t };
}
