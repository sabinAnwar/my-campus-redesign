import { useLogout } from "../hooks/useAuth";
import {
  LogoutBackground,
  LogoutIcon,
  LogoutHeader,
  LogoutProgress,
  LogoutFooter,
  FloatingSparkles,
  CardShine,
  LOGOUT_ANIMATION_STYLES,
} from "../components/logout";

// ============================================================================
// CONSTANTS
// ============================================================================

const STYLES = {
  container: `flex items-center justify-center min-h-screen bg-gradient-to-br 
              from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 
              dark:via-slate-900 dark:to-slate-950 relative overflow-hidden`,
  wrapper: "relative z-10 w-full max-w-lg mx-4 animate-fadeInScale",
  card: `relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl sm:rounded-3xl 
         shadow-2xl dark:shadow-iu-blue/5 border border-white/20 
         dark:border-slate-700/50 p-6 sm:p-10 lg:p-12 overflow-hidden`,
} as const;

// ============================================================================
// LOADER
// ============================================================================

export const loader = async () => null;

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Logout page with animated transition
 * Clears session and redirects to home after 2 seconds
 */
export default function Logout() {
  useLogout();

  return (
    <div className={STYLES.container}>
      <LogoutBackground />

      <div className={STYLES.wrapper}>
        <div className={STYLES.card}>
          <CardShine />
          <FloatingSparkles />

          <div className="relative">
            <LogoutIcon />
            <LogoutHeader />
            <LogoutProgress />
          </div>
        </div>

        <LogoutFooter />
      </div>

      <style>{LOGOUT_ANIMATION_STYLES}</style>
    </div>
  );
}
