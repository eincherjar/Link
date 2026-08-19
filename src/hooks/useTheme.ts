import { useState, useEffect, useCallback } from "react";
import type { ThemeConfig } from "../types";
import { builtInThemes, getThemeById } from "../themes";

const STORAGE_KEY_THEME_ID = "link-theme-id";
const STORAGE_KEY_CUSTOM = "link-custom-themes";

function loadCustomThemes(): ThemeConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomThemes(themes: ThemeConfig[]) {
  localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(themes));
}

function applyTheme(config: ThemeConfig) {
  const el = document.documentElement;
  const c = config.colors;
  el.style.setProperty("--bg-primary", c.bgPrimary);
  el.style.setProperty("--bg-secondary", c.bgSecondary);
  el.style.setProperty("--bg-tertiary", c.bgTertiary);
  el.style.setProperty("--accent", c.accent);
  el.style.setProperty("--accent-blue", c.accentBlue);
  el.style.setProperty("--accent-purple", c.accentPurple);
  el.style.setProperty("--accent-red", c.accentRed);
  el.style.setProperty("--text-primary", c.textPrimary);
  el.style.setProperty("--text-secondary", c.textSecondary);
  el.style.setProperty("--border", c.border);
}

export function useTheme() {
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_THEME_ID) || "dark";
  });

  const [customThemes, setCustomThemes] = useState<ThemeConfig[]>(loadCustomThemes);

  const allThemes = [...builtInThemes, ...customThemes];

  const activeTheme = allThemes.find((t) => t.id === activeThemeId) ?? getThemeById("dark");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME_ID, activeThemeId);
    applyTheme(activeTheme);
    document.documentElement.setAttribute(
      "data-theme",
      isLightTheme(activeTheme) ? "light" : "dark",
    );
  }, [activeThemeId, activeTheme]);

  const setTheme = useCallback((id: string) => {
    setActiveThemeId(id);
  }, []);

  const saveCustomTheme = useCallback(
    (theme: ThemeConfig) => {
      const exists = customThemes.findIndex((t) => t.id === theme.id);
      let updated: ThemeConfig[];
      if (exists >= 0) {
        updated = [...customThemes];
        updated[exists] = theme;
      } else {
        updated = [...customThemes, theme];
      }
      setCustomThemes(updated);
      saveCustomThemes(updated);
    },
    [customThemes],
  );

  const deleteCustomTheme = useCallback(
    (id: string) => {
      const updated = customThemes.filter((t) => t.id !== id);
      setCustomThemes(updated);
      saveCustomThemes(updated);
      if (activeThemeId === id) {
        setActiveThemeId("dark");
      }
    },
    [customThemes, activeThemeId],
  );

  return {
    activeTheme,
    activeThemeId,
    allThemes,
    builtInThemes,
    customThemes,
    setTheme,
    saveCustomTheme,
    deleteCustomTheme,
  };
}

function isLightTheme(theme: ThemeConfig): boolean {
  const bg = parseInt(theme.colors.bgSecondary.replace("#", ""), 16);
  const r = (bg >> 16) & 0xff;
  const g = (bg >> 8) & 0xff;
  const b = bg & 0xff;
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}
