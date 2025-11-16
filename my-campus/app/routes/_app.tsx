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
  MessageSquare,
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

  // THEME FROM CONTEXT (WORKS NOW)
  const { isDark, tokens } = useTheme();

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
  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(to + "/");

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
    <div
      className="min-h-screen flex relative"
      style={{
        backgroundImage: tokens.background.shellGradient,
        backgroundColor: tokens.background.page,
      }}
    >
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
          className={`${
            isDark
              ? "bg-slate-900 text-slate-100 border-slate-800"
              : "bg-gradient-to-b from-white via-slate-50/50 to-white text-slate-800 border-slate-200 shadow-2xl"
          } ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          fixed md:static inset-y-0 left-0 w-72 z-50 flex flex-col border-r transition-transform duration-300`}
        >
          {/* Logo */}
          <div className="h-24 flex items-center justify-between px-6 border-b dark:border-slate-800 border-slate-200">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 flex items-center justify-center text-white font-extrabold">
                  IU
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="text-xs font-bold leading-tight">
                <div className="dark:text-white text-slate-900">
                  INTERNATIONAL
                </div>
                <div className="dark:text-slate-300 text-slate-700">
                  UNIVERSITY
                </div>
              </div>
            </Link>

            {/* close btn mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
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
                      ? isDark
                        ? "bg-slate-700 border-l-4 border-cyan-400 text-white"
                        : "bg-cyan-50 border-l-4 border-cyan-500 text-slate-900"
                      : isDark
                        ? "hover:bg-slate-800 text-slate-300"
                        : "hover:bg-slate-50 text-slate-700"
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
            className={`h-20 flex items-center justify-between px-4 md:px-6 border-b sticky top-0 z-30 ${
              isDark
                ? "bg-slate-900/95 border-slate-800 text-slate-100"
                : "bg-white/95 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden sm:block">
                <div className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  DS WINFO Business Informatics
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Hamburg Campus
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              <Link
                to="/messages"
                className="relative p-2.5 rounded-xl border hover:bg-blue-50 dark:hover:bg-slate-800"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
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
                  className="absolute right-4 md:right-6 top-20 z-50 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl"
                >
                  <div className="px-5 py-4 border-b dark:border-slate-700">
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
                      isDark={isDark}
                    />
                    <MenuItem
                      to="/curriculum"
                      icon={BookOpenCheck}
                      label="Studienplan"
                      isDark={isDark}
                    />
                    <MenuItem
                      to="/module-handbook"
                      icon={FileText}
                      label="Modulhandbuch"
                      isDark={isDark} danger={undefined}                    />
                    <MenuItem
                      to="/student-id"
                      icon={BadgeCheck}
                      label="Studentenausweis"
                      isDark={isDark} danger={undefined}                    />

                    <div
                      className={`px-5 py-2 text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Bescheinigungen
                    </div>

                    <MenuItem
                      to="/certificates/transcript"
                      icon={FileText}
                      label="Transkript"
                      isDark={isDark} danger={undefined}                    />
                    <MenuItem
                      to="/certificates/immatriculation"
                      icon={FileText}
                      label="Immatrikulationsbescheinigung"
                      isDark={isDark} danger={undefined}                    />

                    <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                    <MenuItem
                      to="/logout"
                      icon={LogOut}
                      label="Log out"
                      isDark={isDark}
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
  isDark: boolean;
  danger?: boolean;
};

function MenuItem({ to, icon: Icon, label, isDark, danger }: MenuItemProps) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-3 px-5 py-3 text-sm transition-all border-l-4 border-transparent ${
        danger
          ? isDark
            ? "text-red-400 hover:bg-red-500/10 hover:border-red-500"
            : "text-red-600 hover:bg-red-50 hover:border-red-400"
          : isDark
            ? "hover:bg-slate-800 text-slate-200"
            : "hover:bg-blue-50 text-slate-700"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="font-semibold">{label}</span>
    </Link>
  );
}
