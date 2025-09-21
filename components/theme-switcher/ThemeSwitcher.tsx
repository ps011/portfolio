import React from "react";
import { ActionIcon, Tooltip, Group, Text } from "@mantine/core";
import { IconSun, IconMoon, IconPalette } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";

interface ThemeSwitcherProps {
    variant?: "icon" | "button" | "full" | "both";
    size?: "sm" | "md" | "lg";
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
    variant = "icon", 
    size = "md", 
}) => {
    const { currentTheme, colorScheme, toggleTheme, toggleColorScheme } = useTheme();

    const getIconSize = () => {
        switch (size) {
            case "sm": return 16;
            case "lg": return 24;
            default: return 20;
        }
    };

    const getButtonSize = () => {
        switch (size) {
            case "sm": return "xs";
            case "lg": return "lg";
            default: return "sm";
        }
    };

    const getThemeIcon = () => {
        switch (currentTheme) {
            case "warm":
                return <IconSun size={getIconSize()} />;
            case "cosmic":
                return <IconMoon size={getIconSize()} />;
            default:
                return <IconPalette size={getIconSize()} />;
        }
    };

    const getThemeLabel = () => {
        switch (currentTheme) {
            case "warm":
                return "Warm Theme";
            case "cosmic":
                return "Cosmic Theme";
            default:
                return "Theme";
        }
    };

    if (variant === "both") {
        return (
            <Group gap="xs">
                <Tooltip label={`Switch to ${currentTheme === "warm" ? "Cosmic" : "Warm"} Theme`}>
                    <ActionIcon 
                        variant="subtle" 
                        size={getButtonSize()}
                        onClick={toggleTheme}
                        className="hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
                    >
                        {getThemeIcon()}
                    </ActionIcon>
                </Tooltip>
                <Tooltip label={`Switch to ${colorScheme === "light" ? "Dark" : "Light"} Mode`}>
                    <ActionIcon 
                        variant="subtle" 
                        size={getButtonSize()}
                        onClick={toggleColorScheme}
                        className="hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
                    >
                        {colorScheme === "light" ? <IconMoon size={getIconSize()} /> : <IconSun size={getIconSize()} />}
                    </ActionIcon>
                </Tooltip>
            </Group>
        );
    }

    if (variant === "full") {
        return (
            <Group gap="xs" className="cursor-pointer" onClick={toggleTheme}>
                <ActionIcon 
                    variant="subtle" 
                    size={getButtonSize()}
                    className="hover:bg-primary-100 dark:hover:bg-primary-800"
                >
                    {getThemeIcon()}
                </ActionIcon>
                <Text size="sm" className="text-tertiary-700 dark:text-tertiary-300">
                    {getThemeLabel()}
                </Text>
            </Group>
        );
    }

    if (variant === "button") {
        return (
            <ActionIcon 
                variant="filled" 
                size={getButtonSize()}
                onClick={toggleTheme}
                className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-700 dark:hover:bg-primary-800"
            >
                {getThemeIcon()}
            </ActionIcon>
        );
    }

    // Default icon variant
    return (
        <Tooltip label={`Switch to ${currentTheme === "warm" ? "Cosmic" : "Warm"} Theme`}>
            <ActionIcon 
                variant="subtle" 
                size={getButtonSize()}
                onClick={toggleTheme}
                className="hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
            >
                {getThemeIcon()}
            </ActionIcon>
        </Tooltip>
    );
};

export default ThemeSwitcher;
