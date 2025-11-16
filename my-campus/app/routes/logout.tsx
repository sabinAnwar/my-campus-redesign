import { useEffect } from "react";
// No DOM hooks/components from react-router used here, so no change needed for react-router import.
import { LogOut, CheckCircle2, Sparkles } from "lucide-react";

export const loader = async () => {
  return null;
};

export default function Logout() {
  useEffect(() => {
    console.log("🔓 Logout: Immediate redirect to login");

    // Clear cookies immediately
    document.cookie =
      "session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    // Call logout API in background (don't wait)
    fetch("/api/logout.data", {
      method: "POST",
      credentials: "include",
    }).catch(() => {
      // Ignore errors
    });

    // Immediate redirect
    setTimeout(() => {
      window.location.replace("/login");
    }, 2000); // Show animation for 2 seconds
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Floating Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg mx-4 animate-fadeInScale">
        {/* Glass Card */}
        <div className="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-2xl dark:shadow-cyan-500/5 border border-white/20 dark:border-slate-700/50 p-12 overflow-hidden">
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 opacity-50"></div>

          {/* Floating Sparkles */}
          <div className="absolute top-8 right-8 animate-float">
            <Sparkles className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
          </div>
          <div className="absolute bottom-8 left-8 animate-float animation-delay-1000">
            <Sparkles className="w-4 h-4 text-orange-500 dark:text-orange-400" />
          </div>

          <div className="relative">
            {/* Icon Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Outer Glow Ring */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 rounded-full opacity-30 dark:opacity-20 blur-lg animate-pulse-slow"></div>

                {/* Rotating Ring */}
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 rounded-full opacity-50 dark:opacity-30 animate-spin-slow"></div>

                {/* Main Icon Container */}
                <div className="relative bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-600 dark:via-blue-700 dark:to-purple-700 p-8 rounded-full shadow-xl">
                  <LogOut className="w-12 h-12 text-white animate-pulse" />
                </div>

                {/* Success Badge */}
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 p-2.5 rounded-full shadow-lg border-4 border-white dark:border-slate-900 animate-bounceIn animation-delay-600">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="text-center mb-8 space-y-3">
              <h1 className="text-4xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-cyan-100 dark:to-white bg-clip-text text-transparent">
                  Signing Out
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                Your session is being safely closed
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Thank you for using our platform
              </p>
            </div>

            {/* Progress Section */}
            <div className="space-y-6">
              {/* Animated Progress Bar */}
              <div className="relative">
                <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-500 rounded-full animate-progressBar shadow-lg shadow-cyan-500/50 dark:shadow-cyan-400/30"></div>
                </div>
                {/* Glow Effect on Bar */}
                <div className="absolute inset-0 h-2.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-500 rounded-full opacity-50 blur-sm animate-progressBar"></div>
              </div>

              {/* Status Messages */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <span className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-bounce shadow-sm shadow-cyan-500/50"></span>
                    <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce animation-delay-200 shadow-sm shadow-blue-500/50"></span>
                    <span className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce animation-delay-400 shadow-sm shadow-purple-500/50"></span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Clearing session data
                  </p>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-500 font-mono">
                  2s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-8 text-center space-y-2 animate-fadeIn animation-delay-800">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Redirecting you to the login page...
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            We hope to see you again soon! 👋
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
          }
          50% {
            transform: scale(1.1) rotate(0deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes progressBar {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }

        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-bounceIn {
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-progressBar {
          animation: progressBar 2s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-800 {
          animation-delay: 800ms;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}