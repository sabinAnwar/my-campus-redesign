import { useEffect, useState } from "react";
import { Link, useNavigate, useLoaderData, useFetcher } from "react-router";
import { showErrorToast, showSuccessToast } from "~/lib/toast";
import { prisma } from "~/lib/prisma";
import { MOTIVATIONAL_QUOTES, type Quote } from "~/data/quotes";

// =============================================================================
// TYPES
// =============================================================================

interface LoaderData {
  totalUsers: number;
  onlineUsers: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const QUOTE_ROTATION_INTERVAL = 8000; // 8 seconds
const QUOTE_FADE_DURATION = 500; // 0.5 seconds
const VISIBLE_QUOTE_DOTS = 10;



export const loader = async () => {
  try {
    // Count total users
    const totalUsers = await prisma.user.count();
    
    // Count unique users with active (non-expired) sessions
    const activeSessions = await prisma.session.findMany({
      where: {
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        userId: true,
      },
      distinct: ['userId'],
    });
    
    const onlineUsers = activeSessions.length;
    
    return { totalUsers, onlineUsers };
  } catch (error) {
    console.error("Failed to fetch login stats:", error);
    return { totalUsers: 500, onlineUsers: 42 }; // Fallback
  }
};

export default function Login() {
  const { totalUsers, onlineUsers } = useLoaderData() as LoaderData;
  const navigate = useNavigate();
  const fetcher = useFetcher();
  
  // Form state
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Derived state
  const isSubmitting = fetcher.state === "submitting";
  
  // Quote rotation state
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(() => 
    Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  );
  const [isQuoteFading, setIsQuoteFading] = useState(false);
  
  // Handle fetcher response
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const data = fetcher.data as any;
      console.log("� Login: Fetcher data received:", data);
      
      if (data.success) {
        console.log("✅ Login: Success!");
        console.log("🍪 Login: Cookies:", document.cookie);
        showSuccessToast("Login successful! Redirecting...");
        navigate("/dashboard", { replace: true });
      } else if (data.error) {
        console.error("❌ Login: Error:", data.error);
        setError(data.error);
        showErrorToast(data.error);
      }
    }
  }, [fetcher.state, fetcher.data, navigate]);
  
  // Auto-rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsQuoteFading(true);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
        setIsQuoteFading(false);
      }, QUOTE_FADE_DURATION);
    }, QUOTE_ROTATION_INTERVAL);
    
    return () => clearInterval(interval);
  }, []);
  
  const currentQuote = MOTIVATIONAL_QUOTES[currentQuoteIndex];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    
    console.log("🔐 Login: Submitting credentials for:", email);
    
    // Use fetcher to submit to the login action
    fetcher.submit(formData, {
      method: "POST",
      action: "/api/login",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-stretch">
      {/* Left side - Premium professional section with IU students background */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-8 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/iu-students-football.webp)",
        }}
      >
        {/* Dark overlay for strong readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/85 to-slate-950/90"></div>

        {/* Accent overlay with IU colors */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 via-transparent to-orange-600/5"></div>

        {/* Professional Content */}
        <div className="relative z-10 text-center text-white max-w-md">
          {/* Glowing IU Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              {/* Glow effect layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 animate-pulse transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-cyan-400/40 rounded-2xl blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              
              {/* Logo container */}
              <div className="relative h-24 w-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 group-hover:shadow-cyan-500/50">
                <span className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-white to-orange-400 bg-clip-text text-transparent drop-shadow-lg">IU</span>
              </div>
            </div>
          </div>

          {/* Motivational Quote - Dynamic with fade animation */}
          <div className="mb-12">
            <div 
              className={`group cursor-pointer transform hover:-translate-y-1 transition-all duration-500 ${
                isQuoteFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              <div className="flex flex-col p-6 rounded-2xl bg-gradient-to-br from-cyan-500/40 via-purple-500/20 to-orange-500/40 border-2 border-cyan-400/80 hover:border-cyan-300 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/50 backdrop-blur-md">
                <div className="text-5xl text-cyan-200 mb-3 leading-none drop-shadow-2xl">
                  "
                </div>
                {/* German Quote */}
                <p className="text-lg font-bold text-white mb-3 leading-relaxed drop-shadow-lg">
                  {currentQuote.quote_de}
                </p>
                {/* Divider */}
                <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-orange-400 mx-auto mb-3 rounded-full"></div>
                {/* English Quote */}
                <p className="text-sm text-cyan-100/80 italic mb-4 leading-relaxed drop-shadow-md">
                  "{currentQuote.quote_en}"
                </p>
                <p className="text-xs text-cyan-100 font-semibold drop-shadow-md">
                  — {currentQuote.author}
                </p>
              </div>
            </div>
            {/* Quote navigation dots */}
            <div className="flex justify-center gap-1.5 mt-4">
              {MOTIVATIONAL_QUOTES.slice(0, VISIBLE_QUOTE_DOTS).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsQuoteFading(true);
                    setTimeout(() => {
                      setCurrentQuoteIndex(idx);
                      setIsQuoteFading(false);
                    }, 300);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentQuoteIndex % VISIBLE_QUOTE_DOTS
                      ? 'bg-cyan-400 scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Zitat ${idx + 1}`}
                />
              ))}
              <span className="text-white/40 text-xs ml-2">+{MOTIVATIONAL_QUOTES.length - VISIBLE_QUOTE_DOTS}</span>
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
                {totalUsers}+
              </p>
              <p className="text-xs text-cyan-100 font-semibold mt-2 uppercase tracking-wider">
                Active Dual Degree Students
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-green-500/30 px-4 py-2 rounded-full border border-green-400/60 backdrop-blur-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-green-300 block animate-pulse" />
                <span className="text-xs text-green-100 font-bold">
                  {onlineUsers} Currently online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Premium Professional Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 bg-white dark:bg-slate-800 min-h-screen dark:text-white transition-colors duration-300">
        <div className="w-full max-w-2xl">
          {/* Premium Card - Much Bigger */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-xl bg-white/95 dark:bg-slate-800/95 dark:shadow-2xl">
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
                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-300 dark:border-slate-600">
                  STUDENT PORTAL
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                Welcome
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base font-semibold mb-2">
                IU Dual Degree Platform
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-sm font-medium">
                Manage marks, applications & modules in one place
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Email Input - Professional with icon box */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-base font-bold text-slate-900 dark:text-white mb-3"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 h-full w-14 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 rounded-l-lg flex items-center justify-center border-r border-slate-300 dark:border-slate-600 group-focus-within:border-slate-900 dark:group-focus-within:border-cyan-500 transition-colors">
                    <svg
                      className="w-6 h-6 text-slate-600 dark:text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-cyan-500 transition-colors"
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
                    className="w-full px-5 py-4 pl-16 rounded-lg bg-slate-50 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-base placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-700 focus:border-slate-900 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-cyan-500/20 transition duration-300"
                  />
                </div>
              </div>

              {/* Password Input - Professional with icon box */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-base font-bold text-slate-900 dark:text-white mb-3"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 h-full w-14 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 rounded-l-lg flex items-center justify-center border-r border-slate-300 dark:border-slate-600 group-focus-within:border-slate-900 dark:group-focus-within:border-cyan-500 transition-colors">
                    <svg
                      className="w-6 h-6 text-slate-600 dark:text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-cyan-500 transition-colors"
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
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className="w-full px-5 py-4 pl-16 pr-14 rounded-lg bg-slate-50 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-base placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-700 focus:border-slate-900 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-cyan-500/20 transition duration-300"
                  />
                  {/* Eye Icon Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      /* Eye Icon - password is visible (open eye = can see) */
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      /* Eye-Off Icon - password is hidden (crossed eye = can't see) */
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="w-5 h-5 rounded bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-cyan-500 accent-slate-900 dark:accent-cyan-500 focus:ring-2 focus:ring-slate-900 dark:focus:ring-cyan-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800 cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="text-base text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                  >
                    Keep me signed in
                  </label>
                </div>
                <Link
                  to="/reset-password"
                  className="text-base font-bold text-slate-900 dark:text-cyan-500 hover:text-slate-700 dark:hover:text-cyan-400 transition duration-200 underline-offset-2 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Alert - Professional */}
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-900/50 p-5 backdrop-blur-sm">
                  <div className="flex gap-4">
                    <svg
                      className="w-6 h-6 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-base font-semibold text-red-700 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Sign in Button - Bigger */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-10 px-8 py-4 bg-gradient-to-r from-slate-900 dark:from-cyan-600 via-slate-800 dark:via-cyan-500 to-slate-900 dark:to-cyan-600 hover:from-slate-800 dark:hover:from-cyan-700 hover:via-slate-700 dark:hover:via-cyan-600 hover:to-slate-800 dark:hover:to-cyan-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl dark:shadow-cyan-500/20 dark:hover:shadow-cyan-500/40 transition duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 border border-slate-700 dark:border-cyan-400/30"
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
                  <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium text-base">
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
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-br from-slate-100 dark:from-slate-700 to-slate-50 dark:to-slate-600 hover:from-slate-200 dark:hover:from-slate-600 hover:to-slate-100 dark:hover:to-slate-500 text-slate-900 dark:text-white font-semibold rounded-lg transition duration-200 text-base border border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-cyan-500 hover:shadow-lg dark:hover:shadow-cyan-500/20"
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
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-br from-slate-100 dark:from-slate-700 to-slate-50 dark:to-slate-600 hover:from-slate-200 dark:hover:from-slate-600 hover:to-slate-100 dark:hover:to-slate-500 text-slate-900 dark:text-white font-semibold rounded-lg transition duration-200 text-base border border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-cyan-500 hover:shadow-lg dark:hover:shadow-cyan-500/20"
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
            <p className="text-base text-slate-700 dark:text-slate-400 font-semibold">
              🛡️ Built by IU Students • Professional Development
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Enterprise-grade security • Encrypted connections • Data protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
