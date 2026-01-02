import { useState, useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { DoorOpen, Menu, X, Headphones } from "lucide-react";

import { useLanguage } from "~/contexts/LanguageContext";
import { ScreenReaderProvider } from "~/contexts/ScreenReaderContext";
import { BASE_NAV_ITEMS } from "~/constants/navigation";
import { SHELL_TRANSLATIONS } from "~/services/translations/navigation";
import LanguageToggle from "~/components/ui/LanguageToggle";
import ThemeToggle from "~/components/ui/ThemeToggle";
import { ScreenReaderToggle } from "~/components/ui/ScreenReaderToggle";
import { Sidebar, SearchBar, ProfileMenu } from "~/components/shell";
import { useUserData } from "~/hooks/useUserData";
import { useAppShellSearch } from "~/hooks/useAppShellSearch";

/** Breakpoint for responsive sidebar behavior (in pixels) */
const MOBILE_BREAKPOINT = 768;

export default function AppShell() {
  // ─── State Management ────────────────────────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= MOBILE_BREAKPOINT;
    }
    return true; // SSR fallback
  });
  const [searchQuery, setSearchQuery] = useState("");

  // ─── Hooks ───────────────────────────────────────────────────────────────────
  const location = useLocation();
  const { language } = useLanguage();
  const shellText = SHELL_TRANSLATIONS[language];

  // Custom hooks for data and search
  const { name: userName, campusArea, roomBookingEnabled } = useUserData();
  const { filteredResults } = useAppShellSearch(searchQuery);

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
    if (roomBookingEnabled) {
      const bookingTo = campusArea
        ? `/raumbuchung?campus=${encodeURIComponent(campusArea)}`
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
  }, [campusArea, language, roomBookingEnabled]);

  // ─── Event Handlers ──────────────────────────────────────────────────────────
  const handleSidebarClose = () => setSidebarOpen(false);
  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);
  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleMenuClose = () => setMenuOpen(false);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <ScreenReaderProvider>
      <div className="min-h-screen w-full flex relative bg-background text-foreground">
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
                  className="md:hidden p-2.5 rounded-none hover:bg-iu-blue/10 hover:text-iu-blue transition-colors"
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
                  <div className="text-xs font-black text-muted-foreground/60 flex items-center gap-1.5 leading-none uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-iu-blue shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
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
                  className="hidden sm:flex relative p-2.5 rounded-xl border border-border hover:bg-iu-blue/10 hover:text-iu-blue hover:border-iu-blue/30 transition-all font-bold"
                  aria-label="Contact support"
                >
                  <Headphones className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-3 w-3 bg-iu-red rounded-full border-2 border-background" />
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

            {/* Page Content - Outlet renders nested routes */}
            <div className="px-3 sm:px-4 md:px-6 lg:px-10 py-4 sm:py-6 md:py-8">
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </ScreenReaderProvider>
  );
}
