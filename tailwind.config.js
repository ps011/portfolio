const { theme: mantineColorsTheme } = require("./styles/theme"); // Import your Mantine theme

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
            // fontSize: {
            //   'h1-mantine': mantineColorsTheme.headings.sizes.h1.fontSize,
            //   'h2-mantine': mantineColorsTheme.headings.sizes.h2.fontSize,
            //   // ... and so on
            // },
        },
    },
    plugins: [],
};

