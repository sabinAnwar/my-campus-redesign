import { useFetcher } from 'react-router-dom';
import { useState } from 'react';

export default function FormTest() {
  const fetcher = useFetcher();
  const [result, setResult] = useState(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white px-8 py-10 shadow-md">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Form Test (No JavaScript)</h1>
          
          <form method="POST" action="/api/health" className="space-y-4">
            <p className="text-sm text-gray-600">
              This form will POST to /api/health without any JavaScript.
              If the form submits and you see a response, then server communication works.
            </p>
            
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-bold"
            >
              SUBMIT FORM (No JavaScript)
            </button>
          </form>

          {result && (
            <div className="mt-4 rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">
                {JSON.stringify(result, null, 2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
