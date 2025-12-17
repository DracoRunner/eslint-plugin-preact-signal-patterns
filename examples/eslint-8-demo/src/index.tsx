import { render } from "preact";
import { signal, useComputed, useSignalEffect } from "@preact/signals";
import "./style.css";

const countSignal = signal(0);

function BadCounter() {
  const handleIncrement = () => {
    if (countSignal.value >= 10) {
      console.log("Max reached!");
      return;
    }
    countSignal.value++;
  };

  const handleDecrement = () => {
    const currentValue = countSignal.value;
    if (currentValue > 0) {
      countSignal.value = currentValue - 1;
    }
  };

  if (countSignal) {
    console.log("This always runs - BUG!");
  }

  return (
    <div class="counter bad">
      <p>Count: {countSignal.value}</p>
      <button type="button" onClick={handleDecrement}>-</button>
      <button type="button" onClick={handleIncrement}>+</button>
    </div>
  );
}


function GoodCounter() {
  const doubleCount = useComputed(() => countSignal.value * 2);
  const isEven = useComputed(() => countSignal.value % 2 === 0);

  useSignalEffect(() => {
    console.log("Count changed to:", countSignal.value);
  });

  const handleIncrement = () => {
    if (countSignal.peek() >= 10) {
      console.log("Max reached!");
      return;
    }
    countSignal.value++;
  };

  const handleDecrement = () => {
    if (countSignal.peek() > 0) {
      countSignal.value--;
    }
  };

  const handleReset = () => {
    countSignal.value = 0;
  };

  return (
    <div class="counter good">
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
      <h1>ESLint 8 Demo</h1>
      <p>Using <code>eslint-plugin-preact-signal-patterns@1.2.0</code></p>
      <p>Run <code>yarn lint</code> to see errors!</p>
      <hr />
      <BadCounter />
      <hr />
      <GoodCounter />
    </div>
  );
}

render(<App />, document.getElementById("app"));
