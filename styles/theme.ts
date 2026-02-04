import { createTheme, MantineColorsTuple } from "@mantine/core";
import { themeValues } from "./theme-values";

const colors = themeValues.colors as unknown as Record<string, MantineColorsTuple>;

export const theme = createTheme({
    colors,
    primaryColor: themeValues.primaryColor,
    white: themeValues.white,
    black: themeValues.black,
    headings: themeValues.headings,
    fontFamily: themeValues.fontFamily,
    other: themeValues.other,
}); 