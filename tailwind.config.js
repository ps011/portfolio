/** @type {import("tailwindcss").Config} */
module.exports = {
    prefix: "tw-",
    content: [
        "./components/**/*.*",
        "./sections/**/*.*",
        "./pages/**/*.*",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    100: "#5E72E4E7",
                    200: "#5E72E4FF",
                },
                secondary: {
                    100: "#f4f5f7",
                    200: "#F4F5F7E2",
                },
                "dark-primary": {
                    100: "#1A202C",
                    200: "#1A202CFF",
                    300: "#AFBBFF",
                },
            },
        },
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
    },
    plugins: [],
};

