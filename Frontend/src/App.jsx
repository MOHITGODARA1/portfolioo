import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-8">

      {/* Logos */}
      <div className="flex gap-10">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img
            src={viteLogo}
            alt="Vite logo"
            className="h-24 hover:scale-110 transition-transform"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img
            src={reactLogo}
            alt="React logo"
            className="h-24 hover:scale-110 transition-transform"
          />
        </a>
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-bold">Vite + React</h1>

      {/* Card */}
      <div className="bg-slate-800 rounded-xl p-6 text-center shadow-lg">
        <button
          onClick={() => setCount(count + 1)}
          className="px-6 py-2 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-500 transition"
        >
          count is {count}
        </button>

        <p className="mt-4 text-slate-300">
          Edit <code className="bg-slate-700 px-2 py-1 rounded">src/App.jsx</code>{" "}
          and save to test HMR
        </p>
      </div>

      {/* Footer text */}
      <p className="text-slate-400 text-sm">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;