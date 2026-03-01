import { Link, useLoaderData, redirect } from "react-router";
import { getUserFromRequest } from "~/services/auth.server";
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
} from "~/features/login";

import { useLogin, useQuoteRotation } from "~/hooks/useAuth";
import type { LoginLoaderData as LoaderData } from "~/types/login";
import type { Route } from "./+types/login";

export const links: Route.LinksFunction = () => [
  {
    rel: "preload",
    as: "image",
    href: "/iu-students-football.webp",
    imageSrcSet: "/iu-students-football-mobile.webp 640w, /iu-students-football.webp 1280w",
    imageSizes: "(max-width: 1024px) 100vw, 50vw",
  },
];

// LOADER

export const loader = async ({ request }: { request: Request }) => {
  // Quick cookie check - skip DB if no session cookie exists
  const cookieHeader = request.headers.get("Cookie");
  const hasSession = cookieHeader?.includes("session=");

  if (hasSession) {
    const user = await getUserFromRequest(request);
    if (user) {
      throw redirect("/dashboard");
    }
  }

  return { totalUsers: 500, onlineUsers: 42 };
};

// SUB-COMPONENTS

function LoginErrorAlert({ error }: { error: string }) {
  return (
    <div className="rounded-lg bg-iu-red border-2 border-iu-red p-3 sm:p-4 backdrop-blur-sm">
      <div className="flex gap-4">
        <AlertCircle className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
        <p className="text-base font-semibold text-white">
          {error}
        </p>
      </div>
    </div>
  );
}

function LoginSubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full mt-3 px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-slate-900 dark:from-iu-blue via-slate-800 dark:via-iu-blue to-slate-900 dark:to-iu-blue hover:from-slate-800 dark:hover:from-iu-blue hover:via-slate-700 dark:hover:via-iu-blue hover:to-slate-800 dark:hover:to-iu-blue text-white font-bold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-2xl dark:shadow-iu-blue/20 dark:hover:shadow-iu-blue/40 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 sm:gap-3 border border-slate-700 dark:border-iu-blue/30"
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
  );
}

function RememberMeSection() {
  return (
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center gap-2">
        <input
          id="remember"
          name="remember"
          type="checkbox"
          className="w-5 h-5 rounded bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-iu-blue dark:text-iu-blue focus:ring-2 focus:ring-iu-blue cursor-pointer transition-all"
        />
        <label
          htmlFor="remember"
          className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
        >
          Keep me signed in
        </label>
      </div>
      <Link
        to="/reset-password"
        title="Forgot password link"
        className="text-sm sm:text-base font-bold text-iu-blue dark:text-white hover:text-iu-blue/80 dark:hover:text-white transition duration-200 underline-offset-4 hover:underline"
      >
        Forgot password?
      </Link>
    </div>
  );
}

function SupportSection() {
  return (
    <>
      <div className="relative mt-3 sm:mt-4 lg:mt-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300 dark:border-slate-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-base">
            Need Help?
          </span>
        </div>
      </div>

      <div className="login-support-grid mt-2 sm:mt-3 lg:mt-4">
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
    </>
  );
}

function LoginFooter() {
  return (
    <div className="mt-6">
      <div className="border-t border-slate-200 dark:border-slate-700/60 pt-5 pb-3 flex flex-col items-center justify-center gap-1.5 transition-all">
        <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
          Bachelor Thesis Project
        </p>
        <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">
          Designed & Engineered by <span className="font-bold text-iu-blue dark:text-blue-400 underline decoration-iu-blue/30 underline-offset-4 hover:decoration-iu-blue transition-all cursor-default">Sabin El Anwar</span>
        </p>
      </div>

      <p className="mt-2 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 text-center flex items-center justify-center gap-1.5 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 opacity-70" />
        Secured encrypted connection
      </p>
    </div>
  );
}

// MAIN COMPONENT

/**
 * Login page with branded design
 * Features quote rotation, user stats, and support links
 */
export default function Login() {
  const { totalUsers, onlineUsers } = useLoaderData() as LoaderData;
  const { error, isSubmitting, handleSubmit } = useLogin();
  const { currentQuote, currentIndex, isFading, handleDotClick } =
    useQuoteRotation();

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
            currentQuote={currentQuote}
            isFading={isFading}
            onDotClick={handleDotClick}
            activeIndex={currentIndex}
          />
          <LoginCampusLocations />
          <LoginUserStats total={totalUsers} online={onlineUsers} />
        </div>
      </div>

      {/* Right side - Login Form Section */}
      <div className="iu-login-form-content bg-white dark:bg-slate-800">
        <div className="w-full max-w-2xl px-2 sm:px-0">
          <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:px-8 lg:py-4 shadow-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-xl bg-white/95 dark:bg-slate-800/95">
            <LoginHeader />

            <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4 pt-0">
              <LoginFormInput
                id="email"
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="your.email@iu-study.org"
                autoComplete="email"
              />

              <LoginFormInput
                id="password"
                label="Password"
                icon={Lock}
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
              />

              <RememberMeSection />

              {error && <LoginErrorAlert error={error} />}

              <LoginSubmitButton isSubmitting={isSubmitting} />

              <SupportSection />
            </form>
          </div>

          <LoginFooter />
        </div>
      </div>
    </div>
  );
}
