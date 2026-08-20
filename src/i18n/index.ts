export type TranslationKeys = Record<string, string>;
export type Language = "pl" | "en" | (string & {});

export interface I18nContextValue {
  lang: Language;
  t: Record<string, string>;
  setLang: (lang: Language) => void;
  custom: Record<string, string>;
  setCustomTranslations: (custom: Record<string, string>) => void;
}
