import { useState, useMemo, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigation, useRevalidator } from "react-router-dom";
import { DoorOpen, Menu, X, Headphones } from "lucide-react";
import { isRouteErrorResponse } from "react-router";

import { useLanguage } from "~/store/LanguageContext";
import { ScreenReaderProvider } from "~/store/ScreenReaderContext";
import { BASE_NAV_ITEMS } from "~/config/navigation";
import { SHELL_TRANSLATIONS } from "~/services/translations/navigation";
import LanguageToggle from "~/components/ui/LanguageToggle";
import ThemeToggle from "~/components/ui/ThemeToggle";
import { ScreenReaderToggle } from "~/components/ui/ScreenReaderToggle";
import { Sidebar, SearchBar, ProfileMenu } from "~/layouts/shell";
import { useUserData } from "~/hooks/useUserData";
import { useAppShellSearch } from "~/hooks/useAppShellSearch";

/** Breakpoint for responsive sidebar behavior (in pixels) */
const MOBILE_BREAKPOINT = 768;

export default function AppShell() {
  // ─── State Management ────────────────────────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined" && window.innerWidth >= MOBILE_BREAKPOINT) {
      setSidebarOpen(true);
    }
  }, []);
  const [searchQuery, setSearchQuery] = useState("");

  // ─── Hooks ───────────────────────────────────────────────────────────────────
  const location = useLocation();
  const navigation = useNavigation();
  const { language } = useLanguage();
  const shellText = SHELL_TRANSLATIONS[language];
  const isNavigating = navigation.state !== "idle";

  // Custom hooks for data and search
  const { name: userName, campus_area, room_booking_enabled } = useUserData();
  const { filteredResults } = useAppShellSearch(searchQuery);

  // Keep a simple visit-based learning streak in localStorage.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().split("T")[0];

    const lastVisit = localStorage.getItem("mycampus:lastVisit");
    const storedStreak = parseInt(localStorage.getItem("mycampus:streak") || "0", 10);

    if (lastVisit !== todayISO) {
      const nextStreak = lastVisit === yesterdayISO ? Math.max(storedStreak, 1) + 1 : 1;
      localStorage.setItem("mycampus:streak", String(nextStreak));
      localStorage.setItem("mycampus:lastVisit", todayISO);
      localStorage.setItem("mycampus:todayMinutes", "0");
    }
  }, [location.pathname]);

  // Keep Pomodoro running across routes when not on the assistant page.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (location.pathname.startsWith("/lernassistent")) return;

    const interval = setInterval(() => {
      const running = localStorage.getItem("pomodoro:running") === "true";
      if (!running) return;

      const storedTime = parseInt(localStorage.getItem("pomodoro:time") || "", 10);
      const storedBreak = localStorage.getItem("pomodoro:break") === "true";
      const storedCompleted = parseInt(localStorage.getItem("pomodoro:completed") || "0", 10);
      const storedLastTick = parseInt(localStorage.getItem("pomodoro:lastTick") || "", 10);
      const focusDuration = parseInt(localStorage.getItem("pomodoro:focusDuration") || "10", 10);
      const breakDuration = parseInt(localStorage.getItem("pomodoro:breakDuration") || "10", 10);

      if (Number.isNaN(storedTime) || Number.isNaN(storedLastTick)) return;

      const now = Date.now();
      const elapsed = Math.max(1, Math.floor((now - storedLastTick) / 1000));
      let remaining = storedTime - elapsed;
      let breakMode = storedBreak;
      let completed = Number.isNaN(storedCompleted) ? 0 : storedCompleted;

      while (remaining <= 0) {
        if (!breakMode) {
          completed += 1;
        }
        breakMode = !breakMode;
        remaining += breakMode ? breakDuration : focusDuration;
      }

      localStorage.setItem("pomodoro:time", String(remaining));
      localStorage.setItem("pomodoro:break", String(breakMode));
      localStorage.setItem("pomodoro:completed", String(completed));
      localStorage.setItem("pomodoro:lastTick", String(now));
    }, 1000);

    return () => clearInterval(interval);
  }, [location.pathname]);

  // ─── Navigation Helpers ──────────────────────────────────────────────────────

  /**
   * Determines if a navigation item is currently active.
   * Special handling for nested routes to prevent parent highlighting.
   */
  const isActive = (to: string): boolean => {
    // Prevent "My Courses" from being active when on "Course Schedule"
    if (to === "/courses" && location.pathname.startsWith("/courses/schedule")) {
      return false;
    }
    return location.pathname === to || location.pathname.startsWith(to + "/");
  };

  /**
   * Builds navigation items with dynamic room booking link based on user settings.
   */
  const computedNavItems = useMemo(() => {
    const labels = SHELL_TRANSLATIONS[language].nav;
    const items = BASE_NAV_ITEMS.map((item) => ({
      ...item,
      label: labels[item.key as keyof typeof labels] as string,
    }));

    // Conditionally add room booking link
    if (room_booking_enabled) {
      const bookingTo = campus_area
        ? `/raumbuchung?campus=${encodeURIComponent(campus_area)}`
        : "/raumbuchung";

      const insertIndex = items.findIndex((i) => i.key === "praxisReport") + 1;
      items.splice(insertIndex, 0, {
        to: bookingTo,
        key: "roomBooking",
        label: labels.roomBooking,
        icon: DoorOpen,
      });
    }

    return items;
  }, [campus_area, language, room_booking_enabled]);

  // ─── Event Handlers ──────────────────────────────────────────────────────────
  const handleSidebarClose = () => setSidebarOpen(false);
  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);
  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleMenuClose = () => setMenuOpen(false);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <ScreenReaderProvider>
      <div className="min-h-screen w-full flex flex-col relative bg-background text-foreground transition-colors duration-300">
        {isNavigating && (
          <div className="fixed top-0 left-0 right-0 z-[200]">
            <div className="h-1 w-full overflow-hidden bg-iu-blue/20">
              <div className="route-loading-bar h-full w-1/3 bg-iu-blue" />
            </div>
            <div className="sr-only" role="status" aria-live="polite">
              {language === "de" ? "Seite wird geladen" : "Loading page"}
            </div>
          </div>
        )}
        {/* Accessibility Skip Link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-iu-blue focus:text-white focus:rounded-xl focus:font-bold focus:shadow-2xl transition-all"
        >
          {language === "de" ? "Zum Inhalt springen" : "Skip to content"}
        </a>

        <div className="relative z-10 flex flex-1 w-full">
          {/* Mobile Overlay - darkens background when sidebar is open */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 top-20 bg-black/60 z-[45] md:hidden backdrop-blur-sm"
              onClick={handleSidebarClose}
            />
          )}

          {/* Sidebar Navigation */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
            navItems={computedNavItems}
            isActive={isActive}
          />

          {/* Main Content Area */}
          <section className="flex-1 flex flex-col min-w-0">
            {/* Top Header Bar */}
            <header className="h-20 flex items-center justify-between px-4 md:px-6 border-b border-border sticky top-0 z-[100] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              {/* Left: Mobile Menu Toggle & Campus Indicator */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSidebarToggle}
                  className="md:hidden p-2.5 rounded-none hover:bg-iu-blue/10 dark:hover:bg-iu-blue hover:text-iu-blue dark:hover:text-foreground dark:text-white transition-colors"
                  aria-label={sidebarOpen ? "Close menu" : "Open menu"}
                >
                  {sidebarOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>

                {/* Campus Indicator */}
                <div className="hidden sm:flex flex-col justify-center h-full">
                  <div className="text-xs font-black text-foreground dark:text-white flex items-center gap-1.5 leading-none uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-iu-blue dark:bg-iu-blue shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    {shellText.campus}
                  </div>
                </div>
              </div>

              {/* Center: Global Search */}
              <SearchBar
                query={searchQuery}
                onQueryChange={setSearchQuery}
                results={filteredResults}
                translations={shellText.search}
              />

              {/* Right: Toggles & Profile */}
              <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
                <ScreenReaderToggle variant="compact" />
                <LanguageToggle />
                <ThemeToggle />

                {/* Support Link */}
                <Link
                  to="/contact"
                  className="hidden sm:flex relative p-2.5 rounded-xl border border-border hover:bg-iu-blue/10 dark:hover:bg-iu-blue hover:text-iu-blue dark:hover:text-foreground dark:text-white hover:border-iu-blue/30 dark:hover:border-iu-blue transition-all font-bold cursor-pointer"
                  aria-label="Contact support"
                >
                  <Headphones className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-3 w-3 bg-destructive rounded-full border-2 border-background" />
                </Link>

                {/* Profile Menu */}
                <ProfileMenu
                  isOpen={menuOpen}
                  onToggle={handleMenuToggle}
                  onClose={handleMenuClose}
                  userName={userName}
                  translations={shellText.menu}
                />
              </div>
            </header>

            <main id="main-content" className="flex-1 overflow-y-auto" tabIndex={-1}>
              <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <Outlet />
              </div>
            </main>
          </section>
        </div>      
      
      </div>
    </ScreenReaderProvider>
  );
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const revalidator = useRevalidator();
  let message = "Something went wrong.";
  let details = "Please try again in a moment.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Page not found." : "Request failed.";
    details = error.statusText || details;
  } else if (error instanceof Error) {
    details = error.message;
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="rounded-2xl border border-iu-red/30 bg-iu-red/5 p-6 text-sm text-foreground space-y-2">
        <p className="text-lg font-bold">{message}</p>
        <p className="text-muted-foreground">{details}</p>
        <button
          type="button"
          onClick={() => revalidator.revalidate()}
          className="inline-flex items-center justify-center rounded-full border border-iu-red/30 px-4 py-2 font-semibold text-iu-red hover:bg-iu-red/10 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
