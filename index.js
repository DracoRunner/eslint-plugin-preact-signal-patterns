module.exports = {
  rules: {
    "no-signal-value-outside-hooks": require("./rules/no-signal-value-outside-hooks"),
    "no-signal-value-in-jsx": require("./rules/no-signal-value-in-jsx"),
  },
  configs: {
    recommended: {
      plugins: ["preact-signals"],
      rules: {
        "preact-signals/no-signal-value-outside-hooks": "error",
        "preact-signals/no-signal-value-in-jsx": "warn",
      },
    },
    strict: {
      plugins: ["preact-signals"],
      rules: {
        "preact-signals/no-signal-value-outside-hooks": "error",
        "preact-signals/no-signal-value-in-jsx": "error",
      },
    },
    "jsx-warnings-only": {
      plugins: ["preact-signals"],
      rules: {
        "preact-signals/no-signal-value-outside-hooks": "off",
        "preact-signals/no-signal-value-in-jsx": "warn",
      },
    },
  },
};
