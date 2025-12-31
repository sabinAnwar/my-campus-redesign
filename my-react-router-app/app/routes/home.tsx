import { useEffect, useState } from "react";
import { Link, useNavigate, useLoaderData, useFetcher, redirect } from "react-router";
import { showErrorToast, showSuccessToast } from "~/lib/toast";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";
import { MOTIVATIONAL_QUOTES } from "~/data/quotes";
import {
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  ArrowRight,
  Globe,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import {
  LoginLogo,
  LoginQuoteSection,
  LoginCampusLocations,
  LoginUserStats,
  LoginHeader,
  LoginFormInput,
  LoginSupportLink,
} from "~/components/login";

// TYPES
import type { LoginLoaderData as LoaderData } from "~/types/login";

// CONSTANTS
const QUOTE_ROTATION_INTERVAL = 8000;
const QUOTE_FADE_DURATION = 500;

// ACTIONS & LOADERS
export const loader = async ({ request }: { request: Request }) => {
  // 1. Check if user is already logged in
  const user = await getUserFromRequest(request);
  if (user) {
    throw redirect("/dashboard");
  }

  // 2. Fetch stats for login page
  try {
    const totalUsers = await prisma.user.count();
    const activeSessions = await prisma.session.findMany({
      where: { expiresAt: { gt: new Date() } },
      select: { userId: true },
      distinct: ["userId"],
    });
    return { totalUsers, onlineUsers: activeSessions.length };
  } catch (error) {
    console.error("Failed to fetch login stats:", error);
    return { totalUsers: 500, onlineUsers: 42 };
  }
};

// MAIN COMPONENT
export default function Home() {
  const { totalUsers, onlineUsers } = useLoaderData() as LoaderData;
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(() =>
    Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  );
  const [isQuoteFading, setIsQuoteFading] = useState(false);

  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const data = fetcher.data as any;
      if (data.success) {
        showSuccessToast("Login successful! Redirecting...");
        navigate("/dashboard", { replace: true });
      } else if (data.error) {
        setError(data.error);
        showErrorToast(data.error);
      }
    }
  }, [fetcher.state, fetcher.data, navigate]);

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

  const handleDotClick = (idx: number) => {
    setIsQuoteFading(true);
    setTimeout(() => {
      setCurrentQuoteIndex(idx);
      setIsQuoteFading(false);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    fetcher.submit(new FormData(e.currentTarget), {
      method: "POST",
      action: "/api/login",
    });
  };

  return (
    <div className="iu-premium-login-grid bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Left side - Branded Section */}
      <div
        className="iu-login-hero-section"
        style={{ backgroundImage: "url(/iu-students-football.webp)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/85 to-slate-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-iu-blue/5 via-transparent to-orange-600/5" />

        <div className="relative z-10 text-center text-white max-w-md">
          <LoginLogo />
          <LoginQuoteSection
            currentQuote={MOTIVATIONAL_QUOTES[currentQuoteIndex]}
            isFading={isQuoteFading}
            onDotClick={handleDotClick}
            activeIndex={currentQuoteIndex}
          />
          <LoginCampusLocations />
          <LoginUserStats total={totalUsers} online={onlineUsers} />
        </div>
      </div>

      {/* Right side - Login Form Section */}
      <div className="iu-login-form-content bg-white dark:bg-slate-800">
        <div className="w-full max-w-2xl">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-xl bg-white/95 dark:bg-slate-800/95">
            <LoginHeader />

            <form onSubmit={handleSubmit} className="space-y-7">
              <LoginFormInput
                id="email"
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="your.email@iu-study.org"
              />

              <LoginFormInput
                id="password"
                label="Password"
                icon={Lock}
                type="password"
                placeholder="Enter your password"
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="w-5 h-5 rounded bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-iu-blue focus:ring-2 focus:ring-slate-900 dark:focus:ring-iu-blue cursor-pointer transition-all"
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
                  title="Forgot password link"
                  className="text-base font-bold text-slate-900 dark:text-iu-blue hover:text-slate-700 dark:hover:text-iu-blue transition duration-200 underline-offset-2 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-900/50 p-5 backdrop-blur-sm">
                  <div className="flex gap-4">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-base font-semibold text-red-700 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-10 px-8 py-4 bg-gradient-to-r from-slate-900 dark:from-iu-blue via-slate-800 dark:via-iu-blue to-slate-900 dark:to-iu-blue hover:from-slate-800 dark:hover:from-iu-blue hover:via-slate-700 dark:hover:via-iu-blue hover:to-slate-800 dark:hover:to-iu-blue text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl dark:shadow-iu-blue/20 dark:hover:shadow-iu-blue/40 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 border border-slate-700 dark:border-iu-blue/30"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-6 w-6" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span id="login-button-text">Sign In</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>

              <div className="relative mt-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium text-base">
                    Need Help?
                  </span>
                </div>
              </div>

              <div className="login-support-grid mt-10">
                <LoginSupportLink
                  href="https://iu.de"
                  icon={Globe}
                  label="IU Website"
                  isExternal
                />
                <LoginSupportLink
                  href="mailto:support@iu-study.org"
                  icon={Mail}
                  label="Support"
                  isExternal
                />
              </div>
            </form>
          </div>

          <div className="mt-10 text-center space-y-3">
            <p className="text-base text-slate-700 dark:text-slate-400 font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-iu-blue" />
              Built by IU Students • Professional Development
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Enterprise-grade security • Encrypted connections • Data protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
