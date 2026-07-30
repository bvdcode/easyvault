import { Theme } from "@mui/material/styles";
import { darkTheme } from "../themes/darkTheme";
import { ToastContainer } from "react-toastify";
import { lightTheme } from "../themes/lightTheme";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { createContext, useContext, ReactNode } from "react";
import { useThemeStore } from "../stores/themeStore";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      <ToastContainer theme={isDarkMode ? "dark" : "light"} />
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }
  return context;
};
