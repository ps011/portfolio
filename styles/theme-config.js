const B = "#000000";
const W = "#FFFFFF";
const MUTED_LIGHT = "#333333";
const MUTED_DARK = "#B8B8B8";

function palette(name, mainLight, mainDark, bgLight, bgDark, secondaryDark) {
  return {
    name,
    light: {
      "--background": bgLight,
      "--foreground": B,
      "--main": mainLight,
      "--main-foreground": W,
      "--border": B,
      "--secondary-background": W,
      "--ring": B,
      "--muted-foreground": MUTED_LIGHT,
      "--banner-bg": bgLight,
      "--banner-grid": "rgba(0,0,0,0.06)",
    },
    dark: {
      "--background": bgDark,
      "--foreground": W,
      "--main": mainDark,
      "--main-foreground": B,
      "--border": B,
      "--secondary-background": secondaryDark,
      "--ring": W,
      "--muted-foreground": MUTED_DARK,
      "--banner-bg": bgDark,
      "--banner-grid": "rgba(255,255,255,0.08)",
    },
  };
}

const themePresets = {
  red: palette("Red", "#ef4444", "#f87171", "#fef2f2", "#7f1d1d", "#991b1b"),
  orange: palette("Orange", "#f97316", "#fb923c", "#fff7ed", "#431407", "#7c2d12"),
  amber: palette("Amber", "#f59e0b", "#fbbf24", "#fffbeb", "#451a03", "#78350f"),
  yellow: palette("Yellow", "#eab308", "#facc15", "#fefce8", "#422006", "#713f12"),
  lime: palette("Lime", "#84cc16", "#a3e635", "#f7fee7", "#1a2e05", "#365314"),
  green: palette("Green", "#22c55e", "#4ade80", "#f0fdf4", "#14532d", "#166534"),
  emerald: palette("Emerald", "#10b981", "#34d399", "#ecfdf5", "#022c22", "#064e3b"),
  teal: palette("Teal", "#14b8a6", "#2dd4bf", "#f0fdfa", "#042f2e", "#134e4a"),
  cyan: palette("Cyan", "#06b6d4", "#22d3ee", "#ecfeff", "#083344", "#155e75"),
  sky: palette("Sky", "#0ea5e9", "#38bdf8", "#f0f9ff", "#0c4a6e", "#075985"),
  blue: palette("Blue", "#3b82f6", "#60a5fa", "#eff6ff", "#1e3a8a", "#1e40af"),
  indigo: palette("Indigo", "#6366f1", "#818cf8", "#eef2ff", "#312e81", "#3730a3"),
  violet: palette("Violet", "#8b5cf6", "#a78bfa", "#f5f3ff", "#2e1065", "#4c1d95"),
  purple: palette("Purple", "#a855f7", "#c084fc", "#faf5ff", "#3b0764", "#581c87"),
  fuchsia: palette("Fuchsia", "#d946ef", "#e879f9", "#fdf4ff", "#4a044e", "#701a75"),
  pink: palette("Pink", "#ec4899", "#f472b6", "#fdf2f8", "#500724", "#831843"),
  rose: palette("Rose", "#f43f5e", "#fb7185", "#fff1f2", "#4c0519", "#9f1239"),
};

const STORAGE_KEYS = {
  themeId: "portfolio-theme",
  darkMode: "portfolio-dark-mode",
};

function getStoredThemeId() {
  if (typeof window === "undefined") return "blue";
  const stored = window.localStorage.getItem(STORAGE_KEYS.themeId);
  return themePresets[stored] ? stored : "blue";
}

function getStoredDarkMode() {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(STORAGE_KEYS.darkMode);
  return stored === "true";
}

function applyTheme(themeId, darkMode) {
  const theme = themePresets[themeId] || themePresets.blue;
  const vars = darkMode ? theme.dark : theme.light;
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  root.classList.toggle("dark", darkMode);
}

function persistTheme(themeId) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEYS.themeId, themeId);
  }
}

function persistDarkMode(darkMode) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEYS.darkMode, String(darkMode));
  }
}

module.exports = {
  themePresets,
  themeIds: Object.keys(themePresets),
  getStoredThemeId,
  getStoredDarkMode,
  applyTheme,
  persistTheme,
  persistDarkMode,
  STORAGE_KEYS,
};
