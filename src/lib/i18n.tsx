import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { core } from "./locales/core";
import { pagesA } from "./locales/pagesA";
import { pagesB } from "./locales/pagesB";
import { pagesC } from "./locales/pagesC";
import { impact } from "./locales/impact";
import { LANGUAGES, type Bundle, type Dict, type LanguageCode } from "./locales/types";

export { LANGUAGES };
export type { LanguageCode };

const BUNDLES: Bundle[] = [core, pagesA, pagesB, pagesC, impact];

const DICTS = LANGUAGES.reduce(
  (acc, { code }) => {
    acc[code] = Object.assign({}, ...BUNDLES.map((b) => b[code])) as Dict;
    return acc;
  },
  {} as Record<LanguageCode, Dict>,
);

const STORAGE_KEY = "fpt.language";

interface I18nValue {
  language: LanguageCode;
  /** Translate a key. `fallback` (the English source text) is used when no translation exists. */
  t: (key: string, fallback?: string) => string;
  setLanguage: (code: LanguageCode) => void;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    return stored && stored in DICTS ? stored : "en";
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* storage unavailable — the choice still applies this session */
    }
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) => DICTS[language][key] ?? fallback ?? DICTS.en[key] ?? key,
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
