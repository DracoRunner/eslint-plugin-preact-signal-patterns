# ESLint 8 Demo

This example demonstrates `eslint-plugin-preact-signal-patterns` **v1.1.0** with **ESLint 8** (legacy config).

## Setup

```bash
yarn install
```

## Usage

### Run the app
```bash
yarn dev
```

### Check for linting issues
```bash
yarn lint
```

### Auto-fix issues
```bash
yarn lint:fix
```

## Configuration

This demo uses `.eslintrc.cjs` with the legacy ESLint 8 configuration format:

```javascript
module.exports = {
  plugins: ["preact-signal-patterns"],
  extends: ["plugin:preact-signal-patterns/recommended"],
  rules: {
    "preact-signal-patterns/no-signal-value-outside-hooks": "error",
    "preact-signal-patterns/no-signal-value-in-jsx": "warn",
    "preact-signal-patterns/no-implicit-boolean-signal": "error",
  },
};
```

## Expected Errors

When you run `yarn lint`, you should see:

1. **Errors** for reading `.value` outside hooks (in `BadCounter`)
2. **Errors** for implicit boolean coercion of signals
3. **Warnings** for reading `.value` in JSX

Run `yarn lint:fix` to auto-fix the `.value` → `.peek()` issues.
