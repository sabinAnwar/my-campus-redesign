import { useState } from "react";

export const loader = async () => {
  return null;
};

export default function ConsoleDiagnostic() {
  const [logs, setLogs] = useState<string[]>([]);

  const handleClick = () => {
    const message = "✅ Button clicked at " + new Date().toLocaleTimeString();
    console.log(message);
    setLogs((prev) => [...prev, message]);
    alert(message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          React Interactivity Test
        </h1>

        <div className="space-y-4 mb-8">
          <button
            onClick={handleClick}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
          >
            🔴 Click Me to Test React
          </button>

          <div className="p-4 bg-gray-100 rounded-lg border-l-4 border-blue-600">
            <h2 className="font-bold mb-2">Console Logs:</h2>
            {logs.length === 0 ? (
              <p className="text-gray-600">No logs yet. Click the button above!</p>
            ) : (
              <ul className="space-y-1">
                {logs.map((log, i) => (
                  <li key={i} className="text-green-600 font-mono text-sm">
                    {log}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-bold text-blue-900 mb-2">Status:</h3>
            <p className="text-blue-800">
              {logs.length > 0
                ? "✅ React is working! Events are firing!"
                : "⏳ Waiting for button click..."}
            </p>
          </div>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('✅ entry.client.jsx loaded successfully!');
              console.log('📱 This page loaded at:', new Date().toLocaleString());
            `,
          }}
        />
      </div>
    </div>
  );
}
