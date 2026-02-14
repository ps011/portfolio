const { themeValues: mantineColorsTheme } = require("./styles/theme-values");

// Helper function to convert Mantine color array to Tailwind format
function mantineToTailwindColors(mantineColorArray, defaultShadeIndex = 5) {
  const colors = {};
  if (mantineColorArray && mantineColorArray.length > 0) {
    colors["DEFAULT"] = mantineColorArray[defaultShadeIndex];
    mantineColorArray.forEach((color, index) => {
      colors[index === 0 ? "50" : index * 100] = color;
    });
  }
  return colors;
}

/** @type {import("tailwindcss").Config} */
module.exports = {
    content: [
        "./components/**/*.*",
        "./sections/**/*.*",
        "./pages/**/*.*",
        "./lib/**/*.*",
        "./styles/**/*.scss",
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: "1rem",
                sm: "2rem",
                lg: "4rem",
                xl: "5rem",
                "2xl": "6rem",
            },
        },
        extend: { // It's often better to extend the default Tailwind theme
            colors: {
                brandMutedYellow: mantineToTailwindColors(mantineColorsTheme.colors.brandMutedYellow, 5),
                accentSlateBlue: mantineToTailwindColors(mantineColorsTheme.colors.accentSlateBlue, 6), // Assuming shade 6 is the DEFAULT for this one
                neutralGray: mantineToTailwindColors(mantineColorsTheme.colors.neutralGray, 7), // Assuming shade 7 (mid-gray) is DEFAULT
                // You can add white and black if needed, or they might come from Tailwind's defaults
                // white: mantineColorsTheme.white,
                // black: mantineColorsTheme.black,
            },
            fontFamily: {
                // Your Mantine theme uses "Inter, sans-serif"
                // Tailwind's default sans-serif stack is usually pretty good and includes Inter if available
                // If you want to strictly use what's in Mantine:
                sans: mantineColorsTheme.fontFamily.split(",").map(f => f.trim()),
                // Add other font families if defined in your Mantine theme
                // headings: mantineColorsTheme.headings.fontFamily.split(',').map(f => f.trim()),
            },
            // You can also map other theme values like fontSize, spacing, borderRadius
            // For example, for heading font sizes (this is a simplified example):
            borderRadius: {
                base: "5px",
            },
            borderWidth: {
                "3": "3px",
            },
            boxShadow: {
                shadow: "4px 4px 0px 0px #000",
                "shadow-sm": "2px 2px 0px 0px #000",
            },
            translate: {
                boxShadowX: "4px",
                boxShadowY: "4px",
                reverseBoxShadowX: "-4px",
                reverseBoxShadowY: "-4px",
            },
            colors: {
                main: "var(--main)",
                "main-foreground": "var(--main-foreground)",
                border: "var(--border)",
                foreground: "var(--foreground)",
                background: "var(--background)",
                "secondary-background": "var(--secondary-background)",
                ring: "var(--ring)",
                "muted-foreground": "var(--muted-foreground)",
            },
            fontWeight: {
                base: "500",
                heading: "700",
            },
            fontFamily: {
                heading: ["var(--font-space-grotesk)", "var(--font-sans)", "sans-serif"],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [],
};

