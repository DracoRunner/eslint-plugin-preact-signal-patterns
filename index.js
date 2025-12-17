const noSignalValueOutsideHooks = require("./rules/no-signal-value-outside-hooks");
const noSignalValueInJsx = require("./rules/no-signal-value-in-jsx");
const noImplicitBooleanSignal = require("./rules/no-implicit-boolean-signal");

// Plugin definition
const plugin = {
  meta: {
    name: "eslint-plugin-preact-signal-patterns",
    version: "2.0.0",
  },
  rules: {
    "no-signal-value-outside-hooks": noSignalValueOutsideHooks,
    "no-signal-value-in-jsx": noSignalValueInJsx,
    "no-implicit-boolean-signal": noImplicitBooleanSignal,
  },
  configs: {},
};

// Flat configs for ESLint 9+ (use plugin object reference)
const configs = {
  recommended: {
    plugins: {
      "preact-signal-patterns": plugin,
    },
    rules: {
      "preact-signal-patterns/no-signal-value-outside-hooks": "error",
      "preact-signal-patterns/no-signal-value-in-jsx": "warn",
      "preact-signal-patterns/no-implicit-boolean-signal": "error",
    },
  },
  strict: {
    plugins: {
      "preact-signal-patterns": plugin,
    },
    rules: {
      "preact-signal-patterns/no-signal-value-outside-hooks": "error",
      "preact-signal-patterns/no-signal-value-in-jsx": "error",
      "preact-signal-patterns/no-implicit-boolean-signal": "error",
    },
  },
  "jsx-warnings-only": {
    plugins: {
      "preact-signal-patterns": plugin,
    },
    rules: {
      "preact-signal-patterns/no-signal-value-outside-hooks": "off",
      "preact-signal-patterns/no-signal-value-in-jsx": "warn",
      "preact-signal-patterns/no-implicit-boolean-signal": "off",
    },
  },
  "type-safety": {
    plugins: {
      "preact-signal-patterns": plugin,
    },
    rules: {
      "preact-signal-patterns/no-signal-value-outside-hooks": "off",
      "preact-signal-patterns/no-signal-value-in-jsx": "off",
      "preact-signal-patterns/no-implicit-boolean-signal": "error",
    },
  },
  warnings: {
    plugins: {
      "preact-signal-patterns": plugin,
    },
    rules: {
      "preact-signal-patterns/no-signal-value-outside-hooks": ["warn", { autoFix: false }],
      "preact-signal-patterns/no-signal-value-in-jsx": "warn",
      "preact-signal-patterns/no-implicit-boolean-signal": "warn",
    },
  },
};

// Assign configs to the plugin
Object.assign(plugin.configs, configs);

module.exports = plugin;
