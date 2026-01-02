import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Navigation item structure for the sidebar.
 */
export interface NavItem {
  to: string;
  key: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  /** Whether the sidebar is open (mobile) */
  isOpen: boolean;
  /** Callback to close the sidebar */
  onClose: () => void;
  /** Navigation items to display */
  navItems: NavItem[];
  /** Function to check if a route is active */
  isActive: (to: string) => boolean;
}

/**
 * Sidebar navigation component with responsive behavior.
 * - On mobile: Slides in from left, overlays content
 * - On desktop: Always visible, static positioning
 *
 * @example
 * <Sidebar
 *   isOpen={sidebarOpen}
 *   onClose={() => setSidebarOpen(false)}
 *   navItems={computedNavItems}
 *   isActive={isActive}
 * />
 */
export function Sidebar({
  isOpen,
  onClose,
  navItems,
  isActive,
}: SidebarProps): ReactElement {
  const handleNavClick = () => {
    // Close sidebar on mobile when clicking a nav item
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <aside
      className={`
        bg-card text-card-foreground border-r border-border shadow-2xl md:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        fixed md:static inset-y-0 left-0 w-72 z-[50] md:z-auto flex flex-col transition-transform duration-300
        pt-20 md:pt-0
      `}
    >
      {/* Logo Section - hidden on mobile since header is visible */}
      <div className="hidden md:flex h-24 items-center justify-between px-6 border-b border-border">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 group"
          aria-label="IU International University Dashboard"
        >
          <div className="relative">
            <div className="h-14 w-14 rounded-2xl bg-iu-blue flex items-center justify-center text-white font-black text-2xl shadow-lg">
              IU
            </div>
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-iu-green rounded-full border-[3px] border-card" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-black tracking-wide text-foreground uppercase leading-none">
              International
            </span>
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase leading-none">
              University
            </span>
          </div>
        </Link>

        {/* Close button - mobile only */}
        <button
          onClick={onClose}
          className="md:hidden p-2 rounded-lg hover:bg-iu-blue/10 hover:text-iu-blue transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
        {navItems.map((item) => {
          const active = isActive(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={`group relative flex items-center gap-3 px-5 py-4 text-sm font-bold transition-all duration-200 rounded-r-3xl mr-2 ${
                active
                  ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {/* Active Indicator Bar */}
              {active && (
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-neutral-900 dark:bg-white rounded-r-xl sm:rounded-r-2xl" />
              )}

              {/* Hover Hint */}
              {!active && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-neutral-300 dark:bg-neutral-700 rounded-r-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              )}

              <item.icon
                strokeWidth={active ? 2.5 : 2}
                className={`h-5 w-5 transition-colors ${
                  active
                    ? "text-neutral-900 dark:text-white"
                    : "group-hover:text-neutral-900 dark:group-hover:text-white"
                }`}
              />
              <span className="tracking-tight flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
