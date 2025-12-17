# ESLint 9 Demo

This example demonstrates `eslint-plugin-preact-signal-patterns` **v2.0.0** with **ESLint 9** (flat config).

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

This demo uses `eslint.config.js` with the new ESLint 9 flat configuration format:

```javascript
import preactSignalPatterns from "eslint-plugin-preact-signal-patterns";

export default [
  preactSignalPatterns.configs.recommended,
];
```

## Expected Errors

When you run `yarn lint`, you should see:

1. **Errors** for reading `.value` outside hooks (in `BadCounter`)
2. **Errors** for implicit boolean coercion of signals
3. **Warnings** for reading `.value` in JSX

Run `yarn lint:fix` to auto-fix the `.value` → `.peek()` issues.
