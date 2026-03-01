import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { HelpCircle, X } from "lucide-react";
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
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <aside
      className={`
        bg-card text-card-foreground border-r border-border shadow-2xl lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        fixed inset-y-0 left-0 w-72 z-[50] flex flex-col transition-transform duration-300
        pt-16 sm:pt-20 lg:pt-0
      `}
    >
      {/* Logo Section - hidden on mobile since header is visible */}
      <div className="hidden lg:flex h-16 sm:h-20 items-center justify-between px-6 border-b border-border flex-shrink-0">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 group cursor-pointer"
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
          className="lg:hidden p-2 rounded-lg hover:bg-iu-blue/10 dark:hover:bg-iu-blue hover:text-iu-blue dark:hover:text-foreground dark:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-1.5" role="list">
          {navItems.map((item) => {
            const active = isActive(item.to);
            const ItemIcon = item.icon ?? HelpCircle;

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={handleNavClick}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex items-center gap-3 px-5 py-4 text-sm font-bold transition-all duration-200 rounded-r-3xl mr-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-iu-blue/50 focus:z-10 ${
                    active
                      ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                      : "text-slate-700 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white"
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

                  <ItemIcon
                    strokeWidth={active ? 2.5 : 2}
                    className={`h-5 w-5 transition-colors ${
                      active
                        ? "text-neutral-900 dark:text-white"
                        : "group-hover:text-neutral-900 dark:group-hover:text-white"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="tracking-tight flex-1">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
