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
        extend: {
            borderRadius: {
                base: "5px",
            },
            borderWidth: {
                "3": "3px",
            },
            boxShadow: {
                shadow: "4px 4px 0px 0px #000000",
                "shadow-sm": "2px 2px 0px 0px #000000",
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
                sans: ["var(--font-sans)"],
                heading: ["var(--font-sans)"],
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

