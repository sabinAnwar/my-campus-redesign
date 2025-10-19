export default function BasicTest() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white px-8 py-10 shadow-md">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">✅ Page Loaded Successfully!</h1>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              If you can see this message, the server is rendering pages correctly.
            </p>
            
            <button
              onClick={() => {
                console.log('🔴 BUTTON CLICKED!');
                alert('✅ Button click detected!');
              }}
              className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 font-bold text-lg transition-all"
            >
              CLICK ME (JavaScript Test)
            </button>

            <div className="mt-6 text-sm text-gray-600 space-y-2">
              <p><strong>Test Results:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>✅ Server rendering: WORKING (you see this page)</li>
                <li>⏳ Client JavaScript: TEST BY CLICKING BUTTON ABOVE</li>
                <li>⏳ Toast notifications: WILL TEST NEXT</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
