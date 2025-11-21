import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Home,
  CalendarDays,
  BookOpen,
  Newspaper,
  GraduationCap,
  Info,
  HelpCircle,
  Headphones,
  User as UserIcon,
  FolderOpen,
  FileSearch,
  Settings as SettingsIcon,
  BookOpenCheck,
  FileText,
  BadgeCheck,
  LogOut,
  Menu,
  X,
  CheckSquare,
  DoorOpen,
} from "lucide-react";
import { useTheme } from "~/contexts/ThemeContext";
import ThemeToggle from "~/components/ThemeToggle";

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");
  const [campusArea, setCampusArea] = useState("");
  const [roomBookingEnabled, setRoomBookingEnabled] = useState(true);

  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const { isDark } = useTheme();

  // -----------------------------
  // NAVIGATION ITEMS
  // -----------------------------
  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/courses/schedule", label: "Course Schedule", icon: CalendarDays },
    { to: "/courses", label: "My Courses", icon: BookOpen },
    { to: "/files/recent", label: "Recent Files", icon: FileSearch },
    { to: "/tasks", label: "Tasks & Assignments", icon: CheckSquare },
    { to: "/news", label: "News & Updates", icon: Newspaper },
    { to: "/praxisbericht2", label: "Praxisbericht", icon: FolderOpen },
    {
      to: "/study-organization",
      label: "Study Organization",
      icon: GraduationCap,
    },
    { to: "/info-center", label: "Info Center", icon: Info },
    { to: "/faq", label: "Help & FAQ", icon: HelpCircle },
    { to: "/messages", label: "Kontakt IU", icon: Headphones },
  ];

  // -----------------------------
  // CLOSE PROFILE MENU ON OUTSIDE CLICK
  // -----------------------------
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        menuRef.current &&
        e.target instanceof Node &&
        !menuRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  // -----------------------------
  // FETCH USER INFORMATION
  // -----------------------------
  useEffect(() => {
    (async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        const headers: any = {};
        if (sessionToken) headers["X-Session-Token"] = sessionToken;

        const res = await fetch("/api/user", {
          credentials: "include",
          headers,
        });

        if (res.ok) {
          const data = await res.json();
          const u = data?.user;

          if (u?.name) setUserName(u.name);
          if (u?.campusArea) setCampusArea(u.campusArea);
          if (typeof u?.roomBookingEnabled === "boolean") {
            setRoomBookingEnabled(u.roomBookingEnabled);
          }
        }
      } catch {}
    })();
  }, []);

  // -----------------------------
  // ACTIVE LINK CHECKER
  // -----------------------------
  const isActive = (to: string) => {
    // Prevent "My Courses" from being active when on "Course Schedule"
    if (to === "/courses" && location.pathname.startsWith("/courses/schedule")) {
      return false;
    }
    return location.pathname === to || location.pathname.startsWith(to + "/");
  };

  // -----------------------------
  // DYNAMIC ROOM BOOKING LINK
  // -----------------------------
  const computedNavItems = useMemo(() => {
    const items = [...navItems];

    if (roomBookingEnabled) {
      const bookingTo = campusArea
        ? `/raumbuchung?campus=${encodeURIComponent(campusArea)}`
        : "/raumbuchung";

      const insertIndex = items.findIndex((i) => i.to === "/praxisbericht2") + 1;
      items.splice(insertIndex, 0, {
        to: bookingTo,
        label: "Raumbuchen",
        icon: DoorOpen,
      });
    }

    return items;
  }, [navItems, roomBookingEnabled, campusArea]);

  // -----------------------------
  // RENDER UI
  // -----------------------------
  return (
    <div className="min-h-screen flex relative bg-background text-foreground bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-background to-background dark:from-blue-900/20 dark:via-background dark:to-background">
      <div className="relative z-10 flex flex-1">
        {/* Overlay - mobile only */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            bg-card text-card-foreground border-r border-border
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            fixed md:static inset-y-0 left-0 w-72 z-50 flex flex-col transition-transform duration-300
          `}
        >
          {/* Logo */}
          <div className="h-24 flex items-center justify-between px-6 border-b border-border">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-extrabold">
                  IU
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
              </div>
              <div className="text-xs font-bold leading-tight">
                <div className="text-foreground">
                  INTERNATIONAL
                </div>
                <div className="text-muted-foreground">
                  UNIVERSITY
                </div>
              </div>
            </Link>

            {/* close btn mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-accent hover:text-accent-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
            {computedNavItems.map((item) => {
              const active = isActive(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? "bg-primary/10 text-primary border-l-4 border-primary"
                      : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-semibold flex-1">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header
            className="h-20 flex items-center justify-between px-4 md:px-6 border-b border-border sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2.5 rounded-xl hover:bg-accent hover:text-accent-foreground"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden sm:block">
                <div className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  DS WINFO Business Informatics
                </div>
                <div className="text-xs text-muted-foreground">
                  Hamburg Campus
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              <Link
                to="/contact"
                className="relative p-2.5 rounded-xl border border-border hover:bg-accent hover:text-accent-foreground"
              >
                <Headphones className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-3 w-3 bg-destructive rounded-full border-2 border-background"></span>
              </Link>

              {/* Profile button */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
              >
                <UserIcon className="h-5 w-5 mx-auto" />
              </button>

              {menuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-4 md:right-6 top-20 z-50 w-72 bg-popover text-popover-foreground border border-border rounded-2xl shadow-xl"
                >
                  <div className="px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {userName
                          ? userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "ST"}
                      </div>
                      <div className="font-bold">{userName || "Student"}</div>
                    </div>
                  </div>

                  {/* menu links */}
                  <div onClick={() => setMenuOpen(false)}>
                    <MenuItem
                      to="/settings"
                      icon={SettingsIcon}
                      label="Settings"
                    />
                    <MenuItem
                      to="/curriculum"
                      icon={BookOpenCheck}
                      label="Studienplan"
                    />
                    <MenuItem
                      to="/module-handbook"
                      icon={FileText}
                      label="Modulhandbuch"
                    />
                    <MenuItem
                      to="/student-id"
                      icon={BadgeCheck}
                      label="Studentenausweis"
                    />

                    <div
                      className="px-5 py-2 text-xs font-semibold text-muted-foreground"
                    >
                      Bescheinigungen
                    </div>

                    <MenuItem
                      to="/certificates/transcript"
                      icon={FileText}
                      label="Transkript"
                    />
                    <MenuItem
                      to="/certificates/immatriculation"
                      icon={FileText}
                      label="Immatrikulationsbescheinigung"
                    />

                    <div className="border-t border-border my-1" />

                    <MenuItem
                      to="/logout"
                      icon={LogOut}
                      label="Log out"
                      danger
                    />
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Page content */}
          <div className="px-4 md:px-6 lg:px-10 py-6 md:py-8">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// MENU ITEM COMPONENT
// ------------------------------------------------------------
type MenuItemProps = {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  danger?: boolean;
};

function MenuItem({ to, icon: Icon, label, danger }: MenuItemProps) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-3 px-5 py-3 text-sm transition-all border-l-4 border-transparent ${
        danger
          ? "text-destructive hover:bg-destructive/10 hover:border-destructive"
          : "hover:bg-accent hover:text-accent-foreground text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="font-semibold">{label}</span>
    </Link>
  );
}
