import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useFetcher } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../lib/toast';

export default function Login() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [error, setError] = useState(null);
  const lastResponseRef = useRef(null);

  // Monitor fetcher for any response
  useEffect(() => {
    if (fetcher.data) {
      const hasProcessed = lastResponseRef.current?.id === fetcher.data?.id;
      
      if (!hasProcessed) {
        lastResponseRef.current = fetcher.data;
        
        console.log('📨 Fetcher data received:', fetcher.data);
        console.log('📨 Fetcher state:', fetcher.state);
        
        if (fetcher.data.success) {
          console.log('✅ SUCCESS DETECTED! Showing toast now...');
          showSuccessToast('✅ Login successful! Redirecting...');
          // Use a longer timeout to ensure toast is visible
          setTimeout(() => {
            console.log('🔄 Navigating to home page...');
            navigate('/');
          }, 2000);
        } else if (fetcher.data.error) {
          console.log('❌ ERROR DETECTED:', fetcher.data.error);
          setError(fetcher.data.error);
          showErrorToast(fetcher.data.error);
        }
      }
    }
  }, [fetcher.data, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white px-8 py-10 shadow-md">
          <div className="mb-8 text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">IU</span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your IU student account
            </p>
          </div>

          <fetcher.Form method="post" action="/api/login" className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/reset-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={fetcher.state !== 'idle'}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
            >
              {fetcher.state !== 'idle' ? 'Signing in...' : 'Sign in'}
            </button>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}