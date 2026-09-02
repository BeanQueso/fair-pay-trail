export const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "fr", label: "French", native: "Français" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "zh", label: "Chinese (Simplified)", native: "简体中文" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export type Dict = Record<string, string>;

/** A bundle of translations for one area of the app, keyed by language. */
export type Bundle = Record<LanguageCode, Dict>;
