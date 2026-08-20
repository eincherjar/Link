import { useState, useCallback, useContext, createContext, type ReactNode } from "react";
import { pl } from "./pl";
import { en } from "./en";

export type Language = "pl" | "en" | (string & {});

interface I18nContextValue {
  lang: Language;
  t: Record<string, string>;
  setLang: (lang: Language) => void;
  custom: Record<string, string>;
  setCustomTranslations: (custom: Record<string, string>) => void;
}

const I18nContext = createContext<I18nContextValue>(null!);

export function useTranslation() {
  return useContext(I18nContext);
}

const builtinTranslations: Record<string, Record<string, string>> = { pl, en };

function resolveTranslation(lang: Language, custom?: Record<string, string>): Record<string, string> {
  const base = builtinTranslations[lang] ?? pl;
  if (!custom || Object.keys(custom).length === 0) return base;
  return { ...base, ...custom };
}

interface I18nProviderProps {
  initialLang?: Language;
  initialCustom?: Record<string, string>;
  onLangChange?: (lang: Language) => void;
  onCustomChange?: (custom: Record<string, string>) => void;
  children: ReactNode;
}

export function I18nProvider({
  initialLang = "pl",
  initialCustom,
  onLangChange,
  onCustomChange,
  children,
}: I18nProviderProps) {
  const [lang, setLangState] = useState<Language>(initialLang);
  const [custom, setCustom] = useState<Record<string, string>>(initialCustom ?? {});

  const setLang = useCallback(
    (newLang: Language) => {
      setLangState(newLang);
      onLangChange?.(newLang);
    },
    [onLangChange],
  );

  const setCustomTranslations = useCallback(
    (c: Record<string, string>) => {
      setCustom(c);
      onCustomChange?.(c);
    },
    [onCustomChange],
  );

  const t = resolveTranslation(lang, custom);

  return (
    <I18nContext.Provider value={{ lang, t, setLang, custom, setCustomTranslations }}>
      {children}
    </I18nContext.Provider>
  );
}

export function getAllBuiltinKeys(): Array<{ key: string; pl: string; en: string }> {
  const keys = Object.keys(pl);
  return keys.map((k) => ({ key: k, pl: pl[k], en: en[k] ?? "" }));
}
