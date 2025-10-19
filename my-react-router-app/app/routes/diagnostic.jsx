import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function DiagnosticPage() {
  const [diagnostics, setDiagnostics] = useState({
    toastifyLoaded: false,
    toastContainerFound: false,
    toastFunctionWorks: false,
    cssLoaded: false,
  });

  useEffect(() => {
    // Check if react-toastify is loaded
    const isToastifyLoaded = !!toast && typeof toast.success === 'function';
    
    // Check if ToastContainer is in DOM
    const containerFound = !!document.querySelector('.Toastify');
    
    // Check if CSS is loaded
    const cssLoaded = !!document.querySelector('link[href*="react-toastify"]') || 
                      document.body.innerHTML.includes('Toastify');
    
    setDiagnostics({
      toastifyLoaded: isToastifyLoaded,
      toastContainerFound: containerFound,
      toastFunctionWorks: isToastifyLoaded,
      cssLoaded: cssLoaded,
    });

    console.log('🔍 DIAGNOSTIC RESULTS:', {
      toastifyLoaded: isToastifyLoaded,
      containerFound: containerFound,
      cssLoaded: cssLoaded,
      toastObject: typeof toast,
      toastSuccess: typeof toast?.success,
    });
  }, []);

  const handleTestToast = () => {
    console.log('🧪 Testing toast...');
    console.log('Toast object:', toast);
    
    if (!toast) {
      console.error('❌ Toast is undefined!');
      return;
    }
    
    if (typeof toast.success !== 'function') {
      console.error('❌ toast.success is not a function!');
      console.log('Toast methods:', Object.keys(toast));
      return;
    }

    try {
      console.log('✅ Calling toast.success()...');
      const toastId = toast.success('🎉 TEST TOAST!', {
        position: 'top-right',
        autoClose: 5000,
      });
      console.log('✅ Toast returned ID:', toastId);
    } catch (error) {
      console.error('❌ Error calling toast.success():', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl">
        <div className="rounded-lg bg-white px-8 py-10 shadow-md">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">🔍 Toast Diagnostics</h1>
          
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-semibold text-gray-800">System Status:</h2>
            
            <div className={`p-4 rounded-md ${diagnostics.toastifyLoaded ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`text-sm font-medium ${diagnostics.toastifyLoaded ? 'text-green-800' : 'text-red-800'}`}>
                {diagnostics.toastifyLoaded ? '✅' : '❌'} react-toastify Library: {diagnostics.toastifyLoaded ? 'LOADED' : 'NOT LOADED'}
              </p>
            </div>

            <div className={`p-4 rounded-md ${diagnostics.toastContainerFound ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`text-sm font-medium ${diagnostics.toastContainerFound ? 'text-green-800' : 'text-red-800'}`}>
                {diagnostics.toastContainerFound ? '✅' : '❌'} ToastContainer: {diagnostics.toastContainerFound ? 'FOUND IN DOM' : 'NOT FOUND'}
              </p>
            </div>

            <div className={`p-4 rounded-md ${diagnostics.cssLoaded ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`text-sm font-medium ${diagnostics.cssLoaded ? 'text-green-800' : 'text-red-800'}`}>
                {diagnostics.cssLoaded ? '✅' : '❌'} CSS: {diagnostics.cssLoaded ? 'LOADED' : 'NOT LOADED'}
              </p>
            </div>
          </div>

          <div className="mb-8 p-4 rounded-md bg-blue-50">
            <h3 className="font-semibold text-blue-900 mb-2">What To Do:</h3>
            <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
              <li>Open DevTools (F12) → Console tab</li>
              <li>Click button below</li>
              <li>Check console for diagnostic messages</li>
              <li>Look for toasts in top-right</li>
              <li>Report what you see</li>
            </ol>
          </div>

          <button
            onClick={handleTestToast}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 font-bold text-lg transition-all"
          >
            🧪 TEST TOAST (Check Console!)
          </button>
        </div>
      </div>
    </div>
  );
}
