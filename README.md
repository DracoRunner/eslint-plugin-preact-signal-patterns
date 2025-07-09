# eslint-plugin-preact-signals

ESLint rules for Preact Signals best practices, promoting reactive component patterns and proper signal usage.

## 🎯 Philosophy

This plugin promotes a signal-passing convention where:

- **Signals are passed directly to component props**: `<Typography text={mySignal} />`
- **Components handle signal reactivity automatically**
- **`.value` usage is minimized and only used when necessary**
- **`.peek()` is used for non-reactive reads in callbacks**

## 📦 Installation

```bash
npm install --save-dev eslint-plugin-preact-signals
# or
yarn add -D eslint-plugin-preact-signals
```

## 🚀 Usage

### Recommended Configuration

Add to your `.eslintrc.js`:

```javascript
module.exports = {
  plugins: ["preact-signals"],
  extends: ["plugin:preact-signals/recommended"],
};
```

### Manual Configuration

```javascript
module.exports = {
  plugins: ["preact-signals"],
  rules: {
    "preact-signals/no-signal-value-outside-hooks": "error", // Error + auto-fix
    "preact-signals/no-signal-value-in-jsx": "warn", // Warning only
  },
};
```

## 📋 Available Configurations

- **`recommended`**: Error for non-JSX, warn for JSX
- **`strict`**: Error for both non-JSX and JSX usage
- **`jsx-warnings-only`**: Only warn about JSX usage

```javascript
// Different config options
extends: ['plugin:preact-signals/recommended']  // Default
extends: ['plugin:preact-signals/strict']       // Strict mode
extends: ['plugin:preact-signals/jsx-warnings-only']  // JSX warnings only
```

## 📏 Rules

### `preact-signals/no-signal-value-outside-hooks` (🔧 Fixable)

**Purpose**: Prevents reading `signal.value` outside of `useComputed`, `useSignalEffect`, or JSX contexts.

**Severity**: Error  
**Auto-fix**: Yes (converts `.value` to `.peek()`)

#### What it does:

- Detects when `signal.value` is read in regular JavaScript code (outside JSX)
- Automatically fixes violations by replacing `.value` with `.peek()`
- Allows `signal.value` in JSX contexts and inside `useComputed`/`useSignalEffect`
- Always allows assignments to `signal.value`

#### Examples:

❌ **Bad (will error and auto-fix):**

```tsx
const onSelect = (): void => {
  if (mySignal.value) {
    // Error: auto-fixed to mySignal.peek()
    doSomething(mySignal.value); // Error: auto-fixed to mySignal.peek()
  }
};
```

✅ **Good:**

```tsx
const onSelect = (): void => {
  if (mySignal.peek()) {
    // ✓ Correct usage (auto-fixed)
    doSomething(mySignal.peek()); // ✓ Correct usage (auto-fixed)
  }
};
```

```tsx
const onSelect = (): void => {
  const newValue = mySignal.peek(); // ✓ Correct usage
  if (newValue) {
    // ✓ Correct usage
    doSomething(newValue); // ✓ Correct usage
  }
};
```

```tsx
// Assignments are always allowed
mySignal.value = newValue; // ✓ Always allowed

// Inside useComputed is allowed
const computed = useComputed(() => mySignal.value); // ✓ Allowed in hooks

// JSX usage is allowed (but will trigger warning from other rule)
<div className={mySignal.value ? "active" : ""} />; // ✓ Allowed in JSX
```

---

### `preact-signals/no-signal-value-in-jsx`

**Purpose**: Warns when `signal.value` is used in JSX contexts, encouraging passing signals directly to components.

**Severity**: Warning  
**Auto-fix**: No (intentionally)

#### What it does:

- Detects when `signal.value` is read inside JSX expressions
- Shows warning messages but doesn't auto-fix
- Encourages passing signals directly to component props

#### Examples:

⚠️ **Discouraged (will warn):**

```tsx
<AppButton
  className={clsx(
    styles.button,
    mySignal.value && styles.active, // Warning: consider passing signal directly
    otherSignal.value && styles.disabled // Warning: consider passing signal directly
  )}
/>
```

✅ **Preferred:**

```tsx
const signalClass = useComputed(() => {
  const mySignalValue = mySignal.value;
  const otherSignalValue = otherSignal.value;
  return clsx({
    [styles.button]: true,
    [styles.active]: mySignalValue,
    [styles.disabled]: otherSignalValue,
  });
});
<AppButton className={signalClass} />;
```

## 🛠️ Usage

### Running ESLint

```bash
# Check for violations
npx eslint src/

# Auto-fix non-JSX violations
npx eslint --fix src/
```

### Expected Behavior

- **Non-JSX reads**: Flagged as errors and auto-fixed to `.peek()`
- **JSX reads**: Flagged as warnings (no auto-fix)
- **Assignments**: Always allowed
- **Hook contexts**: Always allowed

## 🏗️ Real-world Example

```tsx
import { useComputed, useSignal } from "@preact/signals";

const MyComponent = () => {
  const countSignal = useSignal(0);
  const doubledSignal = useComputed(() => countSignal.value); // ✓ Allowed in useComputed

  const handleClick = () => {
    // Before: countSignal.value > 5  ❌ Error (auto-fixed)
    // After:  countSignal.peek() > 5  ✓ Correct
    if (countSignal.peek() > 5) {
      console.log("Count is high");
    }
    countSignal.value = 0; // ✓ Assignments always allowed
  };

  return (
    <div>
      {/* Preferred: Pass signal directly */}
      <span>{countSignal}</span> {/* ✓ Best practice */}
      {/* Discouraged: Reading .value in JSX */}
      <span>{countSignal.value}</span> {/* ⚠️ Warning */}
      <button onClick={handleClick}>Reset</button>
    </div>
  );
};
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## 📄 License

MIT © [Mahendra Baghel](https://github.com/mahendrabaghel)

## 🔗 Related

- [Preact Signals Documentation](https://preactjs.com/guide/v10/signals/)
- [ESLint Plugin Development Guide](https://eslint.org/docs/latest/extend/plugins)

---

**Made with ❤️ for the Preact community**
