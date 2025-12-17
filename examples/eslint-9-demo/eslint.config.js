import preactSignalPatterns from "eslint-plugin-preact-signal-patterns";
import tsParser from "@typescript-eslint/parser";

export default [
  // Use the recommended preset
  preactSignalPatterns.configs.recommended,

  // Additional configuration for TypeScript
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
];
