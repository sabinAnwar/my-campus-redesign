import { useState } from "react";
import { Link } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../lib/toast";

export const loader = async () => {
  return null;
};

export default function RequestReset() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");

    try {
      const response = await fetch("/api/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: typeof email === "string" ? email : "",
        }),
      });

      const contentType = response.headers.get("content-type");
      console.log("📝 Response content-type:", contentType);

      // Check if response is JSON
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("❌ Received non-JSON response:", text.substring(0, 200));
        throw new Error(
          `Server returned ${response.status}: ${text.substring(0, 100)}`
        );
      }

      const data = await response.json();

      console.log("📨 Password Reset Response:", data);

      if (data.success) {
        console.log("✅ PASSWORD RESET SUCCESS!");
        setSuccess(true);
        if (data.resetLink) {
          setResetLink(data.resetLink);
        }
        showSuccessToast("✅ Password reset email sent! Check your inbox.");
      } else if (data.error) {
        console.log("❌ PASSWORD RESET ERROR:", data.error);
        setError(data.error);
        showErrorToast(data.error);
      }
    } catch (err) {
      console.error("❌ Error requesting password reset:", err);
      const errMsg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "An error occurred while requesting password reset";
      setError(errMsg);
      showErrorToast(errMsg);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white px-8 py-10 shadow-md">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Reset your password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your
              password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      If an account exists with this email, you will receive a
                      password reset link shortly.
                    </h3>
                    {/* Development only - remove in production */}
                    {resetLink && (
                      <div className="mt-2">
                        <p className="text-sm text-green-700 mb-2">
                          Development link:
                        </p>
                        <Link
                          to={resetLink}
                          className="inline-block text-sm font-medium text-green-700 bg-green-100 px-3 py-2 rounded hover:bg-green-200 transition-colors"
                        >
                          Click here to reset password
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
