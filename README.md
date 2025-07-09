# eslint-plugin-preact-signal-patterns

ESLint rules for Preact Signals architectural patterns, promoting reactive component patterns and proper signal-passing conventions.

## 🎯 Philosophy

This plugin promotes a **signal-passing architectural pattern** where:

- **Signals are passed directly to component props**: `<Typography text={mySignal} />`
- **Components handle signal reactivity automatically**
- **`.value` usage is minimized and only used when necessary**
- **`.peek()` is used for non-reactive reads in callbacks**


**Rule Comparison:**
- **`no-signal-value-outside-hooks`** - ✅ **Unique to this plugin** - Enforces `.peek()` usage in callbacks
- **`no-signal-value-in-jsx`** - ✅ **Unique to this plugin** - Promotes signal-passing patterns  
- **`no-implicit-boolean-signal`** - ✅ **Both plugins** - This one uses enhanced heuristics, theirs uses TypeScript types

**When to Use Which:**
- **Use this plugin** for architectural guidance, pattern enforcement, and auto-fixing
- **Use bensaufley's plugin** for strict TypeScript-based type safety
- **Use both together** for comprehensive signal usage validation

### **Enhanced `no-implicit-boolean-signal` Rule**

Our implementation includes improvements inspired by bensaufley's plugin:

- **Enhanced detection patterns**: More signal naming conventions
- **Import-based detection**: Checks for `@preact/signals*` imports
- **Flexible nullish coalescing**: Options like `'always'`, `'nullish'`, `false`
- **Better error messages**: Clear guidance on fixing issues

## 📦 Installation

```bash
npm install --save-dev eslint-plugin-preact-signal-patterns
# or
yarn add -D eslint-plugin-preact-signal-patterns
```

## 🚀 Usage

### Recommended Configuration

Add to your `.eslintrc.js`:

```javascript
module.exports = {
  plugins: ["preact-signal-patterns"],
  extends: ["plugin:preact-signal-patterns/recommended"],
};
```

### Manual Configuration

```javascript
module.exports = {
  plugins: ["preact-signal-patterns"],
  rules: {
    "preact-signal-patterns/no-signal-value-outside-hooks": "error", // Error + auto-fix
    "preact-signal-patterns/no-signal-value-in-jsx": "warn", // Warning only
    "preact-signal-patterns/no-implicit-boolean-signal": "error", // Prevent bugs
  },
};
```

## 📋 Available Configurations

- **`recommended`**: All rules enabled (error for patterns, warn for JSX)
- **`strict`**: All rules as errors  
- **`jsx-warnings-only`**: Only warn about JSX usage
- **`type-safety`**: Only the boolean coercion rule (focuses on bug prevention)

```javascript
// Different config options
extends: ['plugin:preact-signal-patterns/recommended']  // Default: all rules
extends: ['plugin:preact-signal-patterns/strict']       // Strict mode: all errors
extends: ['plugin:preact-signal-patterns/jsx-warnings-only']  // JSX warnings only
extends: ['plugin:preact-signal-patterns/type-safety']  // Bug prevention only
```

## 📏 Rules

### `preact-signal-patterns/no-signal-value-outside-hooks` (🔧 Fixable)

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

### `preact-signal-patterns/no-signal-value-in-jsx`

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

---

### `preact-signal-patterns/no-implicit-boolean-signal`

**Purpose**: Prevents bugs from implicit boolean coercion of signal objects.

**Severity**: Error  
**Auto-fix**: No

#### What it does:

- Detects when signal variables are used in boolean contexts without `.value` or `.peek()`
- Prevents common bugs where signal object truthiness is checked instead of signal value
- **Enhanced detection**: Uses both naming heuristics AND import analysis
- **Flexible options**: Configure nullish coalescing behavior

#### Configuration Options:

```javascript
{
  "preact-signal-patterns/no-implicit-boolean-signal": ["error", {
    "allowNullishCoalesce": "nullish" // 'always' | 'nullish' | false
  }]
}
```

- **`'always'`**: Allow all nullish coalescing (`signal ?? default`)
- **`'nullish'`** (default): Allow nullish coalescing for potentially null signals  
- **`false`**: Disallow all nullish coalescing

#### Detection Methods:

1. **Naming Patterns**: `mySignal`, `count$`, `userStore`, `appState`, `dataSource`
2. **Import Analysis**: Variables from `@preact/signals*` packages
3. **Assignment Analysis**: Variables assigned from `signal()` calls

#### Examples:

❌ **Bug-prone (will error):**

```tsx
import { signal } from '@preact/signals';

const mySignal = signal("hello");
const userStore = signal(null);
const count$ = signal(0);

// Bug: Always true (checking signal object existence)
if (mySignal) {
  console.log("Signal exists"); // This always runs!
}

// Bug: Always true  
const isActive = !!userStore && someCondition;

// Bug: Always truthy
while (count$) { // Infinite loop!
  break;
}

// Nullish coalescing (configurable)
const value = mySignal ?? "default"; // Error if allowNullishCoalesce: false
```

✅ **Correct:**

```tsx
import { signal } from '@preact/signals';

const mySignal = signal("hello");
const userStore = signal(null);
const count$ = signal(0);

// Correct: Check signal value
if (mySignal.value) {
  console.log("Signal has truthy value");
}

// Correct: Use .peek() for non-reactive reads
const isActive = !!userStore.peek() && someCondition;

// Correct: Check value in loop
while (count$.value > 0) {
  count$.value--;
}

// Correct: Explicit null check
if (userStore.value === null) {
  console.log("User not set");
}

// Correct: Proper nullish coalescing  
const value = mySignal.value ?? "default";
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
