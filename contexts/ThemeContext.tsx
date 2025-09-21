"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MantineProvider, createTheme } from "@mantine/core";
import { themes } from "../styles/theme";

export type ThemeName = "warm" | "cosmic";
export type ColorScheme = "light" | "dark";

interface ThemeContextType {
    currentTheme: ThemeName;
    colorScheme: ColorScheme;
    setTheme: () => void;
    setColorScheme: () => void;
    toggleTheme: () => void;
    toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState<ThemeName>("warm");
    const [colorScheme, setColorScheme] = useState<ColorScheme>("light");

    // Load theme and color scheme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("portfolio-theme") as ThemeName;
        const savedColorScheme = localStorage.getItem("portfolio-color-scheme") as ColorScheme;
        
        if (savedTheme && (savedTheme === "warm" || savedTheme === "cosmic")) {
            setCurrentTheme(savedTheme);
        }
        
        if (savedColorScheme && (savedColorScheme === "light" || savedColorScheme === "dark")) {
            setColorScheme(savedColorScheme);
        } else {
            // Set initial color scheme attribute
            document.documentElement.setAttribute("data-mantine-color-scheme", "light");
        }
    }, []);

    // Save theme to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("portfolio-theme", currentTheme);
        // Apply theme to document for CSS variables
        document.documentElement.setAttribute("data-theme", currentTheme);
    }, [currentTheme]);

    // Save color scheme to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("portfolio-color-scheme", colorScheme);
        // Apply color scheme to document for Mantine
        document.documentElement.setAttribute("data-mantine-color-scheme", colorScheme);
    }, [colorScheme]);

    const setTheme = (theme: ThemeName) => {
        setCurrentTheme(theme);
    };

    const setColorSchemeHandler = (scheme: ColorScheme) => {
        setColorScheme(scheme);
    };

    const toggleTheme = () => {
        setCurrentTheme(prev => prev === "warm" ? "cosmic" : "warm");
    };

    const toggleColorScheme = () => {
        setColorScheme(prev => prev === "light" ? "dark" : "light");
    };

    const mantineTheme = createTheme(themes[currentTheme]);

    return (
        <ThemeContext.Provider value={{ 
            currentTheme, 
            colorScheme,
            setTheme, 
            setColorScheme: setColorSchemeHandler,
            toggleTheme, 
            toggleColorScheme, 
        }}>
            <MantineProvider theme={mantineTheme} defaultColorScheme={colorScheme}>
                {children}
            </MantineProvider>
        </ThemeContext.Provider>
    );
};
