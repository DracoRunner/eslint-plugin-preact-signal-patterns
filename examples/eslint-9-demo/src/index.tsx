/**
 * ESLint 9 Demo - Counter App with Preact Signals
 * Using eslint-plugin-preact-signal-patterns v2.0.0 with Flat Config
 * 
 * Run `yarn lint` to see the ESLint warnings and errors.
 * Run `yarn lint:fix` to auto-fix issues.
 */
import { render } from "preact";
import { signal, useComputed, useSignalEffect } from "@preact/signals";
import "./style.css";

// Global signal
const countSignal = signal(0);

// ============================================
// ❌ BAD EXAMPLES - These will trigger ESLint errors
// ============================================

function BadCounter() {
  const handleIncrement = () => {
    // ❌ ERROR: Reading .value outside hooks - will be auto-fixed to .peek()
    if (countSignal.value >= 10) {
      console.log("Max reached!");
      return;
    }
    countSignal.value++;
  };

  const handleDecrement = () => {
    // ❌ ERROR: Reading .value outside hooks
    const currentValue = countSignal.value;
    if (currentValue > 0) {
      countSignal.value = currentValue - 1;
    }
  };

  // ❌ ERROR: Implicit boolean coercion - signal is always truthy!
  if (countSignal) {
    console.log("This always runs - BUG!");
  }

  return (
    <div class="counter bad">
      <h2>❌ Bad Counter (has ESLint errors)</h2>
      {/* ⚠️ WARNING: Reading .value in JSX */}
      <p>Count: {countSignal.value}</p>
      <button type="button" onClick={handleDecrement}>-</button>
      <button type="button" onClick={handleIncrement}>+</button>
    </div>
  );
}

// ============================================
// ✅ GOOD EXAMPLES - Correct signal patterns
// ============================================

function GoodCounter() {
  // ✅ useComputed for derived values
  const doubleCount = useComputed(() => countSignal.value * 2);
  const isEven = useComputed(() => countSignal.value % 2 === 0);

  // ✅ useSignalEffect for side effects
  useSignalEffect(() => {
    console.log("Count changed to:", countSignal.value);
  });

  const handleIncrement = () => {
    // ✅ CORRECT: Use .peek() for non-reactive reads in callbacks
    if (countSignal.peek() >= 10) {
      console.log("Max reached!");
      return;
    }
    countSignal.value++;
  };

  const handleDecrement = () => {
    // ✅ CORRECT: Use .peek() in callbacks
    if (countSignal.peek() > 0) {
      countSignal.value--;
    }
  };

  const handleReset = () => {
    // ✅ CORRECT: Assignments are always allowed
    countSignal.value = 0;
  };

  return (
    <div class="counter good">
      <h2>✅ Good Counter (correct patterns)</h2>
      {/* ✅ BEST: Pass signal directly to JSX */}
      <p>Count: {countSignal}</p>
      <p>Double: {doubleCount}</p>
      <p>Is Even: {isEven.value ? "Yes" : "No"}</p>
      <button type="button" onClick={handleDecrement}>-</button>
      <button type="button" onClick={handleIncrement}>+</button>
      <button type="button" onClick={handleReset}>Reset</button>
    </div>
  );
}

// Main App
export function App() {
  return (
    <div class="app">
      <h1>ESLint 9 Demo (Flat Config)</h1>
      <p>Using <code>eslint-plugin-preact-signal-patterns@2.0.0</code></p>
      <p>Run <code>yarn lint</code> to see errors!</p>
      <hr />
      <BadCounter />
      <hr />
      <GoodCounter />
    </div>
  );
}

const appElement = document.getElementById("app");
if (appElement) {
  render(<App />, appElement);
}
