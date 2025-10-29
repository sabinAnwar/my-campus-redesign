import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const loader = async () => {
  return null;
};

export default function ToastDirect() {
  const [mounted, setMounted] = useState(false);
  const [toastContainer, setToastContainer] = useState(null);

  useEffect(() => {
    console.log('🟢 ToastDirect component mounted');
    setMounted(true);

    // Check if ToastContainer exists
    const container = document.querySelector('.Toastify');
    console.log('🟢 Toastify container found:', !!container);
    setToastContainer(container);

    // Check if CSS is loaded
    const styles = window.getComputedStyle(document.body);
    console.log('🟢 Body styles loaded:', styles.fontFamily);

    return () => {
      console.log('🟢 ToastDirect component unmounted');
    };
  }, []);

  const handleShowToast = () => {
    console.log('🟢 Button clicked!');
    
    if (!toastContainer) {
      console.error('❌ ToastContainer not found in DOM!');
      alert('ERROR: ToastContainer not found! Check console.');
      return;
    }

    console.log('🟢 Calling toast.success()...');
    try {
      const toastId = toast.success('🎉 DIRECT TOAST TEST!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log('🟢 Toast returned ID:', toastId);
      
      // Check if toast was added to container
      setTimeout(() => {
        const toastElements = document.querySelectorAll('.Toastify__toast');
        console.log('🟢 Toast elements in DOM:', toastElements.length);
        toastElements.forEach((el, i) => {
          console.log(`   Toast ${i}:`, el.textContent.slice(0, 50));
        });
      }, 100);
    } catch (error) {
      console.error('❌ Error calling toast:', error);
      alert(`ERROR: ${error.message}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white px-8 py-10 shadow-md">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Toast Direct Test</h1>
          
          <div className="space-y-4">
            <div className="rounded-md bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Status:</strong> {mounted ? '✅ Mounted' : '⏳ Mounting'}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Container:</strong> {toastContainer ? '✅ Found' : '❌ Not Found'}
              </p>
            </div>

            <button
              onClick={handleShowToast}
              className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 font-medium text-lg"
            >
              🎯 CLICK ME TO TEST TOAST
            </button>

            <div className="mt-8 rounded-md bg-gray-100 p-4 space-y-2">
              <h2 className="font-bold text-red-600">⚠️ IMPORTANT:</h2>
              <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                <li>Open DevTools (F12) <strong>FIRST</strong></li>
                <li>Then click the button above</li>
                <li>Watch the Console for messages</li>
                <li>Look at top-right for toast</li>
                <li>Report what you see in console</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
