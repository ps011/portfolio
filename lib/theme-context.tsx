"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const themeConfig = require("../styles/theme-config.js");

type ThemeContextValue = {
  themeId: string;
  setThemeId: (id: string) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  themeOptions: { id: string; name: string }[];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState("default");
  const [darkMode, setDarkModeState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeIdState(themeConfig.getStoredThemeId());
    setDarkModeState(themeConfig.getStoredDarkMode());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    themeConfig.applyTheme(themeId, darkMode);
  }, [mounted, themeId, darkMode]);

  const setThemeId = useCallback((id: string) => {
    if (!themeConfig.themePresets[id]) return;
    setThemeIdState(id);
    themeConfig.persistTheme(id);
  }, []);

  const setDarkMode = useCallback((value: boolean) => {
    setDarkModeState(value);
    themeConfig.persistDarkMode(value);
  }, []);

  const themeOptions = themeConfig.themeIds.map((id: string) => ({
    id,
    name: themeConfig.themePresets[id].name,
  }));

  const value: ThemeContextValue = {
    themeId,
    setThemeId,
    darkMode,
    setDarkMode,
    themeOptions,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
