const nextVitals = require("eslint-config-next/core-web-vitals");
const prettier = require("eslint-config-prettier");

module.exports = [
  ...nextVitals,
  prettier,
  {
    ignores: [
      "public/**/*",
      "node_modules/**/*",
      ".next/**/*",
      "out/**/*",
      "build/**/*",
      "dist/**/*",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "comma-dangle": ["error", "always-multiline"],
      // TODO: Fix these patterns and re-enable (React 19 stricter rules)
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
    },
  },
];