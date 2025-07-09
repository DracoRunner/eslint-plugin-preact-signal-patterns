module.exports = {
  rules: {
    "no-signal-value-outside-hooks": require("./rules/no-signal-value-outside-hooks"),
    "no-signal-value-in-jsx": require("./rules/no-signal-value-in-jsx"),
    "no-implicit-boolean-signal": require("./rules/no-implicit-boolean-signal"),
  },
  configs: {
    recommended: {
      plugins: ["preact-signal-patterns"],
      rules: {
        "preact-signal-patterns/no-signal-value-outside-hooks": "error",
        "preact-signal-patterns/no-signal-value-in-jsx": "warn",
        "preact-signal-patterns/no-implicit-boolean-signal": "error",
      },
    },
    strict: {
      plugins: ["preact-signal-patterns"],
      rules: {
        "preact-signal-patterns/no-signal-value-outside-hooks": "error",
        "preact-signal-patterns/no-signal-value-in-jsx": "error",
        "preact-signal-patterns/no-implicit-boolean-signal": "error",
      },
    },
    "jsx-warnings-only": {
      plugins: ["preact-signal-patterns"],
      rules: {
        "preact-signal-patterns/no-signal-value-outside-hooks": "off",
        "preact-signal-patterns/no-signal-value-in-jsx": "warn",
        "preact-signal-patterns/no-implicit-boolean-signal": "off",
      },
    },
    "type-safety": {
      plugins: ["preact-signal-patterns"],
      rules: {
        "preact-signal-patterns/no-signal-value-outside-hooks": "off",
        "preact-signal-patterns/no-signal-value-in-jsx": "off", 
        "preact-signal-patterns/no-implicit-boolean-signal": "error",
      },
    },
  },
};
