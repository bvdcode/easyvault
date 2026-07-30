import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const prefersDarkMode = window.matchMedia(
  "(prefers-color-scheme: dark)",
).matches;

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: prefersDarkMode,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: "theme",
    },
  ),
);
