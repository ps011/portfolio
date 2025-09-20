import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals", "prettier"),
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
    },
  },
];
