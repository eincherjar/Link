import type { ThemeConfig } from "./types";

export const builtInThemes: ThemeConfig[] = [
  {
    id: "dark",
    name: "Ciemny",
    builtIn: true,
    colors: {
      bgPrimary: "#1B2C32",
      bgSecondary: "#142226",
      bgTertiary: "#24393F",
      accent: "#9DD99A",
      accentBlue: "#5DA6EA",
      accentPurple: "#B9A0F8",
      accentRed: "#F37C7C",
      textPrimary: "#D4DCD8",
      textSecondary: "#6B8D85",
      border: "#2D4A52",
    },
  },
  {
    id: "light",
    name: "Jasny",
    builtIn: true,
    colors: {
      bgPrimary: "#F0F4F3",
      bgSecondary: "#FFFFFF",
      bgTertiary: "#E5EDEA",
      accent: "#3D9E38",
      accentBlue: "#2E7DC1",
      accentPurple: "#7C5CBF",
      accentRed: "#D94F4F",
      textPrimary: "#1B2C32",
      textSecondary: "#6B8D85",
      border: "#C5D4D0",
    },
  },
  {
    id: "purple",
    name: "Fioletowy",
    builtIn: true,
    colors: {
      bgPrimary: "#1B1523",
      bgSecondary: "#17131B",
      bgTertiary: "#28202D",
      accent: "#A9C4B3",
      accentBlue: "#5DA6EA",
      accentPurple: "#C77BE3",
      accentRed: "#E39BB3",
      textPrimary: "#F5EEF7",
      textSecondary: "#9C909F",
      border: "#49364F",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    builtIn: true,
    colors: {
      bgPrimary: "#0D1B2A",
      bgSecondary: "#1B2838",
      bgTertiary: "#243447",
      accent: "#7EC8E3",
      accentBlue: "#0096C7",
      accentPurple: "#9B72CF",
      accentRed: "#FF6B6B",
      textPrimary: "#E0E1DD",
      textSecondary: "#778DA9",
      border: "#415A77",
    },
  },
  {
    id: "sunset",
    name: "Zachód słońca",
    builtIn: true,
    colors: {
      bgPrimary: "#1A1216",
      bgSecondary: "#140E11",
      bgTertiary: "#2A1F24",
      accent: "#F4A261",
      accentBlue: "#457B9D",
      accentPurple: "#E76F8B",
      accentRed: "#E63946",
      textPrimary: "#F1E4E8",
      textSecondary: "#8D7480",
      border: "#4A3540",
    },
  },
];

export function getThemeById(id: string): ThemeConfig {
  return (
    builtInThemes.find((t) => t.id === id) ??
    builtInThemes[0]
  );
}
