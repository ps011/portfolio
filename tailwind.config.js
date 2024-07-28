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
                primary: "#5e72e4",
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

