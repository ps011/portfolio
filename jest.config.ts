import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/.worktrees/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^next-intl$": "<rootDir>/__mocks__/next-intl.tsx",
  },
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "sections/**/*.{ts,tsx}",
    "pages/**/*.{ts,tsx}",
    "!**/*.d.ts",
  ],
};

export default createJestConfig(config);
