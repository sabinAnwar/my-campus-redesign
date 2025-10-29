import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { showSuccessToast, showErrorToast } from "../lib/toast";

export const loader = async () => {
  return null;
};

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    console.log("🔵 handleSubmit called");
    e.preventDefault();
    e.stopPropagation();

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    console.log("📝 Submitting login form:", {
      email,
      passwordLength: password?.length,
    });

    try {
      // Send as form-encoded data
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email, password }),
        credentials: "include", // Include cookies in request
      });

      console.log("📨 API response status:", response.status);

      const data = await response.json();
      console.log("📨 API response data:", data);

      if (data.success) {
        console.log("✅ Login successful!");
        showSuccessToast("✅ Login successful! Redirecting...");

        // Store session token in localStorage as backup
        if (data.sessionToken) {
          localStorage.setItem("sessionToken", data.sessionToken);
          console.log("💾 Stored session token in localStorage");
        }

        // Redirect using client-side navigation only
        setTimeout(() => {
          console.log("🔄 Redirecting to dashboard...");
          // Use absolute path with leading slash
          navigate("/dashboard");
        }, 1000);
      } else if (data.error) {
        console.log("❌ Login failed:", data.error);
        setError(data.error);
        showErrorToast(data.error);
        setIsSubmitting(false);
      } else {
        console.log("❌ Unexpected response format:", data);
        setError("An unexpected error occurred");
        showErrorToast("An unexpected error occurred");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      const errorMsg = err.message || "An error occurred during login";
      setError(errorMsg);
      showErrorToast(errorMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-stretch">
      {/* Left side - Premium professional section with IU students background */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-8"
        style={{
          backgroundImage: "url(/iu-students-football.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Dark overlay for strong readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/85 to-slate-950/90"></div>

        {/* Accent overlay with IU colors */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 via-transparent to-orange-600/5"></div>

        {/* Professional Content */}
        <div className="relative z-10 text-center text-white max-w-md">
          {/* Premium Badge - Student Portal */}
          <div className="mb-8 inline-flex animate-fade-in">
            <div className="px-5 py-3 rounded-full bg-gradient-to-r from-cyan-500/30 to-orange-500/30 border-2 border-cyan-400/60 backdrop-blur-lg hover:from-cyan-500/40 hover:to-orange-500/40 hover:border-cyan-300 transition-all shadow-lg">
              <span className="text-xs font-extrabold text-cyan-100 tracking-wider uppercase">
                ⭐ IU Excellence
              </span>
            </div>
          </div>

          {/* Main heading - More impressive */}
          <h2 className="text-5xl font-black mb-2 leading-tight text-white drop-shadow-lg">
            Achieve Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-200 to-orange-300 animate-pulse">
              Goals
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-lg text-cyan-100 font-semibold mb-10 drop-shadow-md">
            Join 500+ IU Dual Degree Students
          </p>

          {/* Motivational Quotes - Enhanced */}
          <div className="space-y-4 mb-12">
            {/* Quote 1: Nelson Mandela (IU Cyan) */}
            <div className="group cursor-pointer transform hover:-translate-y-1 transition-transform">
              <div className="flex flex-col p-5 rounded-2xl bg-gradient-to-br from-cyan-500/40 to-cyan-600/30 border-2 border-cyan-400/80 hover:border-cyan-300 transition-all duration-300 hover:bg-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/50 backdrop-blur-md">
                <div className="text-5xl text-cyan-200 mb-2 leading-none drop-shadow-2xl">
                  "
                </div>
                <p className="text-base font-bold text-white mb-2 leading-snug drop-shadow-lg">
                  Education is the most powerful weapon which you can use to
                  change the world.
                </p>
                <p className="text-xs text-cyan-100 font-semibold drop-shadow-md">
                  — Nelson Mandela
                </p>
              </div>
            </div>

            {/* Quote 2: Winston Churchill (IU Orange) */}
            <div className="group cursor-pointer transform hover:-translate-y-1 transition-transform">
              <div className="flex flex-col p-5 rounded-2xl bg-gradient-to-br from-orange-500/40 to-orange-600/30 border-2 border-orange-400/80 hover:border-orange-300 transition-all duration-300 hover:bg-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/50 backdrop-blur-md">
                <div className="text-5xl text-orange-200 mb-2 leading-none drop-shadow-2xl">
                  "
                </div>
                <p className="text-base font-bold text-white mb-2 leading-snug drop-shadow-lg">
                  Success is not final, failure is not fatal. It is the courage
                  to continue that counts.
                </p>
                <p className="text-xs text-orange-100 font-semibold drop-shadow-md">
                  — Winston Churchill
                </p>
              </div>
            </div>

            {/* Quote 3: Eleanor Roosevelt (Cyan + Orange blend) */}
            <div className="group cursor-pointer transform hover:-translate-y-1 transition-transform">
              <div className="flex flex-col p-5 rounded-2xl bg-gradient-to-r from-cyan-500/35 via-purple-500/15 to-orange-500/35 border-2 border-cyan-400/70 hover:border-cyan-300 transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/45 hover:via-purple-500/20 hover:to-orange-500/45 hover:shadow-2xl hover:shadow-cyan-500/40 backdrop-blur-md">
                <div className="text-5xl text-cyan-200 mb-2 leading-none drop-shadow-2xl">
                  "
                </div>
                <p className="text-base font-bold text-white mb-2 leading-snug drop-shadow-lg">
                  The future belongs to those who believe in the beauty of their
                  dreams.
                </p>
                <p className="text-xs text-cyan-100 font-semibold drop-shadow-md">
                  — Eleanor Roosevelt
                </p>
              </div>
            </div>
          </div>

          {/* Hamburg Locations - Enhanced */}
          <div className="grid grid-cols-2 gap-3 pt-8 border-t border-cyan-400/30">
            <div className="group cursor-pointer transform hover:scale-110 transition-transform">
              <div className="p-3 rounded-lg bg-cyan-500/35 border-2 border-cyan-400/70 hover:bg-cyan-500/45 hover:border-cyan-300 transition-all backdrop-blur-md">
                <p className="text-2xl mb-1 drop-shadow-lg">📍</p>
                <p className="text-xs font-bold text-white drop-shadow-lg">
                  Hammerbrook
                </p>
                <p className="text-xs text-cyan-100 drop-shadow-md">Hamburg</p>
              </div>
            </div>
            <div className="group cursor-pointer transform hover:scale-110 transition-transform">
              <div className="p-3 rounded-lg bg-orange-500/35 border-2 border-orange-400/70 hover:bg-orange-500/45 hover:border-orange-300 transition-all backdrop-blur-md">
                <p className="text-2xl mb-1 drop-shadow-lg">📍</p>
                <p className="text-xs font-bold text-white drop-shadow-lg">
                  Waterloohain
                </p>
                <p className="text-xs text-orange-100 drop-shadow-md">
                  Hamburg
                </p>
              </div>
            </div>
          </div>

          {/* Active Students Count - Enhanced */}
          <div className="mt-8 text-center">
            <div className="inline-block">
              <p className="text-5xl font-black text-cyan-300 drop-shadow-lg">
                500+
              </p>
              <p className="text-xs text-cyan-100 font-semibold mt-2 uppercase tracking-wider">
                Active Dual Degree Students
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-green-500/30 px-4 py-2 rounded-full border border-green-400/60 backdrop-blur-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-green-300 block animate-pulse" />
                <span className="text-xs text-green-100 font-bold">
                  Currently online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Premium Professional Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 bg-white min-h-screen">
        <div className="w-full max-w-2xl">
          {/* Premium Card - Much Bigger */}
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-slate-200 backdrop-blur-xl bg-white/95">
            {/* Header - Professional */}
            <div className="mb-12 text-center">
              {/* IU Logo - visible on mobile */}
              <div className="mb-8 flex justify-center lg:hidden">
                <div className="relative h-24 w-24">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl blur opacity-20"></div>
                  <div className="relative h-24 w-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                    <span className="text-white font-black text-3xl">IU</span>
                  </div>
                </div>
              </div>

              {/* Title - Professional */}
              <div className="inline-block mb-4">
                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 text-xs font-bold border border-slate-300">
                  STUDENT PORTAL
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">
                Welcome
              </h1>
              <p className="text-slate-600 text-base font-semibold mb-2">
                IU Dual Degree Platform
              </p>
              <p className="text-slate-500 text-sm font-medium">
                Manage marks, applications & modules in one place
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              method="post"
              action="javascript:void(0)"
              className="space-y-7"
            >
              {/* Email Input - Professional with icon box */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-base font-bold text-slate-900 mb-3"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 h-full w-14 bg-gradient-to-r from-slate-100 to-slate-50 rounded-l-lg flex items-center justify-center border-r border-slate-300 group-focus-within:border-slate-900 transition-colors">
                    <svg
                      className="w-6 h-6 text-slate-600 group-focus-within:text-slate-900 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="your.email@iu-study.org"
                    className="w-full px-5 py-4 pl-16 rounded-lg bg-slate-50 border-2 border-slate-300 text-slate-900 text-base placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition duration-300"
                  />
                </div>
              </div>

              {/* Password Input - Professional with icon box */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-base font-bold text-slate-900 mb-3"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 h-full w-14 bg-gradient-to-r from-slate-100 to-slate-50 rounded-l-lg flex items-center justify-center border-r border-slate-300 group-focus-within:border-slate-900 transition-colors">
                    <svg
                      className="w-6 h-6 text-slate-600 group-focus-within:text-slate-900 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className="w-full px-5 py-4 pl-16 rounded-lg bg-slate-50 border-2 border-slate-300 text-slate-900 text-base placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition duration-300"
                  />
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="w-5 h-5 rounded bg-white border-2 border-slate-300 text-slate-900 accent-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="text-base text-slate-700 font-semibold cursor-pointer"
                  >
                    Keep me signed in
                  </label>
                </div>
                <Link
                  to="/reset-password"
                  className="text-base font-bold text-slate-900 hover:text-slate-700 transition duration-200 underline-offset-2 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Alert - Professional */}
              {error && (
                <div className="rounded-lg bg-red-50 border-2 border-red-200 p-5 backdrop-blur-sm">
                  <div className="flex gap-4">
                    <svg
                      className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-base font-semibold text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Sign in Button - Bigger */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-10 px-8 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 border border-slate-700"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative mt-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-slate-600 font-medium text-base">
                    Need Help?
                  </span>
                </div>
              </div>

              {/* Support Links */}
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://iu.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-br from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 text-slate-900 font-semibold rounded-lg transition duration-200 text-base border border-slate-200 hover:border-slate-400 hover:shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span>IU Website</span>
                </a>
                <a
                  href="mailto:support@iu-study.org"
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-br from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 text-slate-900 font-semibold rounded-lg transition duration-200 text-base border border-slate-200 hover:border-slate-400 hover:shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Support</span>
                </a>
              </div>
            </form>
          </div>

          {/* Footer - Professional */}
          <div className="mt-10 text-center space-y-3">
            <p className="text-base text-slate-700 font-semibold">
              🛡️ Built by IU Students • Professional Development
            </p>
            <p className="text-sm text-slate-500">
              Enterprise-grade security • Encrypted connections • Data protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
