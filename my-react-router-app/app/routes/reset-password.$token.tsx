import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../lib/toast';

export const loader = async () => {
  return null;
};

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch('/api/verify-reset-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok || !data.valid) {
          setError('Invalid or expired reset token');
          setIsValidToken(false);
        } else {
          setIsValidToken(true);
        }
      } catch (err) {
        console.error('❌ Error validating token:', err);
        setError('An error occurred while validating the token');
        setIsValidToken(false);
      }
      setIsValidating(false);
    };
    validateToken();
  }, [token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!password || typeof password !== 'string') {
      setError('Please enter a new password');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errMsg = data.error || 'Failed to reset password';
        setError(errMsg);
        showErrorToast(errMsg);
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Password reset successfully');
      showSuccessToast('✅ Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      console.error('❌ Error resetting password:', err);
      const errMsg =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'An error occurred while resetting your password';
      setError(errMsg);
      showErrorToast(errMsg);
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-white px-8 py-10 shadow-md">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Invalid Token
              </h2>
              <p className="text-gray-600 mb-6">
                This password reset link is invalid or has expired.
              </p>
              <a
                href="/reset-password"
                className="text-blue-600 font-medium hover:text-blue-700"
              >
                Request a new password reset
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white px-8 py-10 shadow-md">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Set new password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your new password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
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
              disabled={isSubmitting}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
            >
              {isSubmitting ? 'Setting password...' : 'Set new password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}