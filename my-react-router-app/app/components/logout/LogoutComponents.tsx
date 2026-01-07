import { LogOut, CheckCircle2, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

// ============================================================================
// CONSTANTS
// ============================================================================

const STYLES = {
  container: `flex items-center justify-center min-h-screen bg-gradient-to-br 
              from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 
              dark:via-slate-900 dark:to-slate-950 relative overflow-hidden`,
  card: `relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl 
         shadow-2xl dark:shadow-iu-blue/5 border border-white/20 
         dark:border-slate-700/50 p-12 overflow-hidden`,
  title: `bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 
          dark:from-white dark:via-iu-blue dark:to-white bg-clip-text text-transparent`,
} as const;

const TEXT = {
  title: "Signing Out",
  subtitle: "Your session is being safely closed",
  thanks: "Thank you for using our platform",
  clearing: "Clearing session data",
  redirecting: "Redirecting you to the login page...",
  goodbye: "We hope to see you again soon! ",
} as const;

// ============================================================================
// BACKGROUND COMPONENTS
// ============================================================================

export function LogoutBackground() {
  return (
    <>
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GradientOrb position="-top-40 -left-40" color="from-iu-blue to-blue-500" />
        <GradientOrb position="-top-40 -right-40" color="from-orange-400 to-pink-500" delay="2000" />
        <GradientOrb position="-bottom-40 left-1/2 -translate-x-1/2" color="from-purple-400 to-indigo-500" delay="4000" />
      </div>
    </>
  );
}

function GradientOrb({ position, color, delay }: { position: string; color: string; delay?: string }) {
  return (
    <div
      className={`absolute ${position} w-80 h-80 bg-gradient-to-br ${color} rounded-full 
                  mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 
                  dark:opacity-10 animate-blob ${delay ? `animation-delay-${delay}` : ""}`}
    />
  );
}

// ============================================================================
// ICON COMPONENTS
// ============================================================================

export function LogoutIcon() {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        {/* Outer Glow Ring */}
        <div className="absolute -inset-4 bg-gradient-to-r from-iu-blue via-purple-500 to-orange-500 rounded-full opacity-30 dark:opacity-20 blur-lg animate-pulse-slow" />

        {/* Rotating Ring */}
        <div className="absolute -inset-2 bg-gradient-to-r from-iu-blue via-purple-500 to-orange-500 rounded-full opacity-50 dark:opacity-30 animate-spin-slow" />

        {/* Main Icon Container */}
        <div className="relative bg-gradient-to-br from-iu-blue via-blue-600 to-purple-600 dark:from-iu-blue dark:via-blue-700 dark:to-purple-700 p-8 rounded-full shadow-xl">
          <LogOut className="w-12 h-12 text-white animate-pulse" />
        </div>

        {/* Success Badge */}
        <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-green-400 to-iu-blue dark:from-green-500 dark:to-iu-blue p-2.5 rounded-full shadow-lg border-4 border-white dark:border-slate-900 animate-bounceIn animation-delay-600">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CONTENT COMPONENTS
// ============================================================================

export function LogoutHeader() {
  return (
    <div className="text-center mb-8 space-y-3">
      <h1 className="text-4xl font-black tracking-tight">
        <span className={STYLES.title}>{TEXT.title}</span>
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
        {TEXT.subtitle}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-500">{TEXT.thanks}</p>
    </div>
  );
}

export function LogoutProgress() {
  return (
    <div className="space-y-6">
      {/* Animated Progress Bar */}
      <div className="relative">
        <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-iu-blue via-blue-500 to-purple-600 dark:from-iu-blue dark:via-blue-400 dark:to-purple-500 rounded-full animate-progressBar shadow-lg shadow-iu-blue/50 dark:shadow-iu-blue/30" />
        </div>
        {/* Glow Effect */}
        <div className="absolute inset-0 h-2.5 bg-gradient-to-r from-iu-blue via-blue-500 to-purple-600 dark:from-iu-blue dark:via-blue-400 dark:to-purple-500 rounded-full opacity-50 blur-sm animate-progressBar" />
      </div>

      {/* Status */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <BouncingDots />
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {TEXT.clearing}
          </p>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-500 font-mono">2s</span>
      </div>
    </div>
  );
}

function BouncingDots() {
  return (
    <div className="flex space-x-1.5">
      <span className="w-2 h-2 bg-iu-blue dark:bg-iu-blue rounded-full animate-bounce shadow-sm shadow-iu-blue/50" />
      <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce animation-delay-200 shadow-sm shadow-blue-500/50" />
      <span className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce animation-delay-400 shadow-sm shadow-purple-500/50" />
    </div>
  );
}

export function LogoutFooter() {
  return (
    <div className="mt-8 text-center space-y-2 animate-fadeIn animation-delay-800">
      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
        {TEXT.redirecting}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-500">{TEXT.goodbye}</p>
    </div>
  );
}

// ============================================================================
// FLOATING SPARKLES
// ============================================================================

export function FloatingSparkles() {
  return (
    <>
      <div className="absolute top-8 right-8 animate-float">
        <Sparkles className="w-5 h-5 text-iu-blue dark:text-white" />
      </div>
      <div className="absolute bottom-8 left-8 animate-float animation-delay-1000">
        <Sparkles className="w-4 h-4 text-orange-500 dark:text-orange-400" />
      </div>
    </>
  );
}

// ============================================================================
// CARD SHINE EFFECT
// ============================================================================

export function CardShine() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-iu-blue/5 dark:via-transparent dark:to-purple-500/5 opacity-50" />
  );
}
