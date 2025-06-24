import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

const STORAGE_KEY = "CLIPVAULT_THEME";

const ThemeContext = createContext({
  isDark: false,
  theme: MD3LightTheme,
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === "dark") setIsDark(true);
    })();
  }, []);

  const toggleTheme = async () => {
    const newValue = !isDark;
    setIsDark(newValue);
    await AsyncStorage.setItem(STORAGE_KEY, newValue ? "dark" : "light");
  };

  const theme = isDark ? MD3DarkTheme : MD3LightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
