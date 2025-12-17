# Examples

This directory contains demo projects showing how to use `eslint-plugin-preact-signal-patterns` with different ESLint versions.

## Projects

| Directory | ESLint Version | Plugin Version | Config Format |
|-----------|---------------|----------------|---------------|
| `eslint-8-demo` | ESLint 8 | v1.1.0 | Legacy (`.eslintrc.cjs`) |
| `eslint-9-demo` | ESLint 9 | v2.0.0 | Flat (`eslint.config.js`) |

## Quick Start

### ESLint 8 Demo
```bash
cd eslint-8-demo
yarn install
yarn lint    # See errors
yarn lint:fix # Auto-fix
yarn dev     # Run app
```

### ESLint 9 Demo
```bash
cd eslint-9-demo
yarn install
yarn lint    # See errors
yarn lint:fix # Auto-fix
yarn dev     # Run app
```

## What the Demos Show

Both demos include a counter app with:

1. **Bad patterns** (will trigger ESLint errors):
   - Reading `.value` outside hooks
   - Implicit boolean coercion of signals
   - Reading `.value` in JSX (warning)

2. **Good patterns** (correct usage):
   - Using `.peek()` in callbacks
   - Using `useComputed` for derived values
   - Passing signals directly to JSX
