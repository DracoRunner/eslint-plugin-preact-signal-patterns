module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["preact-signal-patterns", "@typescript-eslint"],
  extends: ["plugin:preact-signal-patterns/recommended"],
  rules: {
    "preact-signal-patterns/no-signal-value-outside-hooks": "error",
    "preact-signal-patterns/no-signal-value-in-jsx": "warn",
    "preact-signal-patterns/no-implicit-boolean-signal": "error",
  },
};
