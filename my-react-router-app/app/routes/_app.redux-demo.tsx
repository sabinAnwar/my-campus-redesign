import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  increment,
  decrement,
  incrementByAmount,
  reset,
} from "../store/slices/counterSlice";

/**
 * Redux Toolkit Demo Page
 *
 * This page demonstrates ACTUAL Redux Toolkit usage:
 * - Real Redux store with configureStore
 * - Real slice with createSlice
 * - Real hooks: useAppSelector and useAppDispatch
 */

// ============================================
// CODE EXAMPLES (for display)
// ============================================
const counterSliceExample = `// app/store/slices/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
  history: number[];
}

const initialState: CounterState = {
  value: 0,
  history: [0],
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
      state.history.push(state.value);
    },
    decrement: (state) => {
      state.value -= 1;
      state.history.push(state.value);
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
      state.history.push(state.value);
    },
    reset: (state) => {
      state.value = 0;
      state.history = [0];
    },
  },
});

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;
export default counterSlice.reducer;`;

const storeConfigExample = `// app/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`;

const hooksExample = `// app/store/hooks.ts
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();`;

const componentExample = `// This very page uses Redux!
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { increment, decrement, incrementByAmount, reset } from "../store/slices/counterSlice";

function ReduxDemo() {
  // Read state from Redux store
  const count = useAppSelector((state) => state.counter.value);
  const history = useAppSelector((state) => state.counter.history);
  
  // Get dispatch function
  const dispatch = useAppDispatch();

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  );
}`;

const providerExample = `// app/store/StoreProvider.tsx
"use client";
import { Provider } from "react-redux";
import { store } from "./store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

// Then wrap your app in root.tsx:
// <StoreProvider>
//   <App />
// </StoreProvider>`;

export default function ReduxDemo() {
  const [activeTab, setActiveTab] = useState<
    "slice" | "store" | "hooks" | "component" | "provider"
  >("slice");
  const [customAmount, setCustomAmount] = useState(5);

  // ✅ REAL Redux Toolkit hooks!
  const count = useAppSelector((state) => state.counter.value);
  const history = useAppSelector((state) => state.counter.history);
  const dispatch = useAppDispatch();

  const tabs = [
    { id: "slice", label: "1. Create Slice" },
    { id: "store", label: "2. Configure Store" },
    { id: "hooks", label: "3. Typed Hooks" },
    { id: "component", label: "4. Use in Component" },
    { id: "provider", label: "5. Provider Setup" },
  ] as const;

  const codeExamples: Record<typeof activeTab, string> = {
    slice: counterSliceExample,
    store: storeConfigExample,
    hooks: hooksExample,
    component: componentExample,
    provider: providerExample,
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Redux Toolkit Demo</h1>
      <p className="text-muted-foreground mb-6">
        This page uses <strong>REAL Redux Toolkit</strong> - the counter below
        is connected to a global Redux store!
      </p>

      {/* Live Redux Counter */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            ✅ LIVE Redux State
          </span>
        </div>
        <h2 className="text-xl font-semibold mb-4">
          Interactive Counter (Real Redux Store)
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          This counter uses <code className="bg-muted px-1 rounded">useAppSelector</code> and{" "}
          <code className="bg-muted px-1 rounded">useAppDispatch</code> from Redux Toolkit.
          The state persists across navigation!
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <button
            onClick={() => dispatch(decrement())}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
          >
            - Decrement
          </button>
          <span className="text-4xl font-mono font-bold min-w-[100px] text-center bg-card px-4 py-2 rounded border">
            {count}
          </span>
          <button
            onClick={() => dispatch(increment())}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium"
          >
            + Increment
          </button>
          <button
            onClick={() => dispatch(incrementByAmount(customAmount))}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
          >
            +{customAmount}
          </button>
          <button
            onClick={() => dispatch(reset())}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors font-medium"
          >
            Reset
          </button>
        </div>

        {/* Custom amount input */}
        <div className="flex items-center gap-2 mb-4">
          <label className="text-sm">Custom amount:</label>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(Number(e.target.value))}
            className="w-20 px-2 py-1 border rounded bg-background"
          />
        </div>

        {/* State history */}
        <div className="mt-4 p-3 bg-muted/50 rounded">
          <p className="text-sm font-medium mb-2">
            📊 State History (stored in Redux):
          </p>
          <div className="flex flex-wrap gap-2">
            {history.map((val, idx) => (
              <span
                key={idx}
                className={`px-2 py-1 text-xs rounded ${
                  idx === history.length - 1
                    ? "bg-primary text-primary-foreground font-bold"
                    : "bg-muted"
                }`}
              >
                {val}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">
          📝 How This Works - Redux Toolkit Code
        </h2>

        {/* Tabs */}
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code Display */}
        <pre className="p-4 overflow-x-auto bg-zinc-900 text-zinc-100 text-sm max-h-[400px]">
          <code>{codeExamples[activeTab]}</code>
        </pre>
      </div>

      {/* Key Concepts */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-2">🏪 configureStore</h3>
          <p className="text-sm text-muted-foreground">
            Creates a Redux store with good defaults: Redux DevTools, thunk
            middleware, and development checks.
          </p>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-2">🍕 createSlice</h3>
          <p className="text-sm text-muted-foreground">
            Generates action creators and reducers automatically. Uses Immer so
            you can "mutate" state directly.
          </p>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-2">📤 useAppDispatch</h3>
          <p className="text-sm text-muted-foreground">
            Typed hook to dispatch actions to the store. Call{" "}
            <code className="bg-muted px-1 rounded">dispatch(increment())</code>{" "}
            to update state.
          </p>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-2">🎣 useAppSelector</h3>
          <p className="text-sm text-muted-foreground">
            Typed hook to read state from the store. Component re-renders when
            selected state changes.
          </p>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-2">🔄 Immer Integration</h3>
          <p className="text-sm text-muted-foreground">
            Write "mutating" logic like{" "}
            <code className="bg-muted px-1 rounded">state.value += 1</code> -
            RTK handles immutability.
          </p>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-2">🛠️ Redux DevTools</h3>
          <p className="text-sm text-muted-foreground">
            Open browser DevTools → Redux tab to see actions and state changes
            in real-time!
          </p>
        </div>
      </div>

      {/* Try it prompt */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-2">🧪 Try It!</h3>
        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
          <li>Click the buttons above to dispatch Redux actions</li>
          <li>Watch the state history update in real-time</li>
          <li>
            Navigate to another page and come back - the count persists!
          </li>
          <li>
            Open Redux DevTools (browser extension) to see action history
          </li>
        </ol>
      </div>

      {/* Links */}
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Learn more at{" "}
          <a
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            redux-toolkit.js.org
          </a>
        </p>
      </div>
    </div>
  );
}
