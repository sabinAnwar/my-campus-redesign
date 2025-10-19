import { useState } from 'react';
import { toast } from 'react-toastify';
import { showSuccessToast, showErrorToast, showInfoToast, showWarningToast } from '../lib/toast';

export default function ToastTest() {
  const [lastLog, setLastLog] = useState('');

  const testDirectToast = () => {
    console.log('🔵 Testing DIRECT toast.success() call...');
    setLastLog('Testing direct toast.success()...');
    const id = toast.success('✅ Direct toast test!', {
      position: 'top-right',
      autoClose: 5000,
    });
    console.log('🔵 Direct toast ID:', id);
    setLastLog(`Direct toast ID: ${id}`);
  };

  const testHelperToast = () => {
    console.log('🔵 Testing HELPER showSuccessToast() call...');
    setLastLog('Testing helper showSuccessToast()...');
    showSuccessToast('✅ Helper toast test!');
    setLastLog('Helper toast called');
  };

  const testErrorToast = () => {
    console.log('🔵 Testing HELPER showErrorToast() call...');
    setLastLog('Testing helper showErrorToast()...');
    showErrorToast('❌ Error toast test!');
    setLastLog('Error toast called');
  };

  const testInfoToast = () => {
    console.log('🔵 Testing HELPER showInfoToast() call...');
    setLastLog('Testing helper showInfoToast()...');
    showInfoToast('ℹ️ Info toast test!');
    setLastLog('Info toast called');
  };

  const testWarningToast = () => {
    console.log('🔵 Testing HELPER showWarningToast() call...');
    setLastLog('Testing helper showWarningToast()...');
    showWarningToast('⚠️ Warning toast test!');
    setLastLog('Warning toast called');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white px-8 py-10 shadow-md">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Toast Debug Test</h1>
          
          <div className="space-y-4">
            <div className="rounded-md bg-blue-50 p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Last Action:</strong> {lastLog || 'None yet'}
              </p>
            </div>

            <button
              onClick={testDirectToast}
              className="w-full rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 font-medium"
            >
              🔵 Test Direct toast.success()
            </button>
            
            <button
              onClick={testHelperToast}
              className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 font-medium"
            >
              ✅ Test Helper showSuccessToast()
            </button>
            
            <button
              onClick={testErrorToast}
              className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 font-medium"
            >
              ❌ Test Helper showErrorToast()
            </button>
            
            <button
              onClick={testInfoToast}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium"
            >
              ℹ️ Test Helper showInfoToast()
            </button>
            
            <button
              onClick={testWarningToast}
              className="w-full rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700 font-medium"
            >
              ⚠️ Test Helper showWarningToast()
            </button>

            <div className="mt-8 rounded-md bg-gray-100 p-4 space-y-2">
              <h2 className="font-bold">Debug Instructions:</h2>
              <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                <li>Open DevTools Console (F12)</li>
                <li>Click any button above</li>
                <li>Check Console for log messages</li>
                <li>Look top-right for toast notification</li>
                <li>Check the "Last Action" text above</li>
                <li>If no console logs appear, there's an import issue</li>
                <li>If console logs appear but no toast, react-toastify isn't working</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
