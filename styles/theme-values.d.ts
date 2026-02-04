export interface ThemeValues {
  colors: {
    brandMutedYellow: string[];
    accentSlateBlue: string[];
    neutralGray: string[];
    dark: string[];
  };
  primaryColor: string;
  white: string;
  black: string;
  fontFamily: string;
  headings: {
    fontFamily: string;
    fontWeight: string;
    sizes: {
      h1: { fontSize: string; lineHeight: string };
      h2: { fontSize: string; lineHeight: string };
      h3: { fontSize: string; lineHeight: string };
      h4: { fontSize: string; lineHeight: string };
    };
  };
  other: {
    primaryPageBackground: string;
    cardBackground: string;
    primaryText: string;
    secondaryText: string;
    accentYellow: string;
  };
}

export const themeValues: ThemeValues;
