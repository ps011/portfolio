const prasheelUi = require("@prasheel/ui/tailwind");

/** @type {import("tailwindcss").Config} */
module.exports = {
    presets: [prasheelUi],
    content: [
        "./components/**/*.*",
        "./sections/**/*.*",
        "./pages/**/*.*",
        "./lib/**/*.*",
        "./styles/**/*.scss",
        "./node_modules/@prasheel/ui/dist/**/*.{js,mjs}",
    ],
};
