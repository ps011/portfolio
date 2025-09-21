import { createTheme } from "@mantine/core";

// Theme definitions
export const themes = {
    warm: {
        colors: {
            primary: [
                "#FEF6E8", "#FCEFDB", "#F9E7CE", "#F5DEC0", "#F1D6B1",
                "#DAB88B", "#C3A07A", "#AC8A69", "#957558", "#7E6147",
            ] as const,
            secondary: [
                "#EAF0F7", "#DDE4EE", "#CED8E5", "#BAC6DC", "#A6B4D3",
                "#8F9FC9", "#778DA9", "#657A94", "#54677F", "#43546A",
            ] as const,
            tertiary: [
                "#FFFFFF", "#F8F9FA", "#F1F3F5", "#E9ECEF", "#DEE2E6",
                "#CED4DA", "#ADB5BD", "#868E96", "#495057", "#343A40",
            ] as const,
            dark: [
                "#FFFFFF", "#F8F9FA", "#F1F3F5", "#E9ECEF", "#DEE2E6",
                "#CED4DA", "#ADB5BD", "#868E96", "#495057", "#343A40",
            ] as const,
        },
        primaryColor: "primary",
        white: "#FFFFFF",
        black: "#343A40", 
        headings: {
            fontFamily: "Inter, sans-serif",
            fontWeight: "700",
            sizes: {
                h1: { fontSize: "2.5rem", lineHeight: "1.3" },
                h2: { fontSize: "2rem", lineHeight: "1.35" },
                h3: { fontSize: "1.75rem", lineHeight: "1.4" },
                h4: { fontSize: "1.5rem", lineHeight: "1.45" },
            },
        },
        fontFamily: "Inter, sans-serif",
        other: {
            primaryPageBackground: "#F8F9FA",
            cardBackground: "#FFFFFF",
            primaryText: "#343A40",
            secondaryText: "#868E96",
            accentPrimary: "#DAB88B",
        },
    },
    cosmic: {
        colors: {
            primary: [
                "#fff5f8", "#ffebf2", "#ffe0eb", "#ffd6e4", "#ffcbdd",
                "#ff70a2", "#ff1467", "#b80040", "#5c0020", "#000000",
            ] as const,
            secondary: [
                "#fedbdc", "#feb7b8", "#fd9395", "#fc6f71", "#fb4b4e",
                "#fa0b0f", "#c00407", "#800305", "#400102", "#000000",
            ] as const,
            tertiary: [
                "#fff5f8", "#ffebf2", "#ffe0eb", "#ffd6e4", "#ffcbdd",
                "#ff70a2", "#ff1467", "#b80040", "#5c0020", "#000000",
            ] as const,
            dark: [
                "#FFFFFF", "#F8F9FA", "#F1F3F5", "#E9ECEF", "#DEE2E6",
                "#CED4DA", "#ADB5BD", "#868E96", "#495057", "#343A40",
            ] as const,
        },
        primaryColor: "primary",
        white: "#FFFFFF",
        black: "#343A40", 
        headings: {
            fontFamily: "Inter, sans-serif",
            fontWeight: "700",
            sizes: {
                h1: { fontSize: "2.5rem", lineHeight: "1.3" },
                h2: { fontSize: "2rem", lineHeight: "1.35" },
                h3: { fontSize: "1.75rem", lineHeight: "1.4" },
                h4: { fontSize: "1.5rem", lineHeight: "1.45" },
            },
        },
        fontFamily: "Inter, sans-serif",
        other: {
            primaryPageBackground: "#fff5f8",
            cardBackground: "#FFFFFF",
            primaryText: "#000000",
            secondaryText: "#5c0020",
            accentPrimary: "#ff70a2",
        },
    },
};

// Default theme (warm)
export const theme = createTheme(themes.warm); 