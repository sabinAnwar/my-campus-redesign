import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  CalendarDays,
  BookOpen,
  Newspaper,
  GraduationCap,
  Info,
  HelpCircle,
  MessageSquare,
  Sun,
  Moon,
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
  Bell,
  CheckSquare,
  Users,
  Award,
  Clock,
  DoorOpen,
} from "lucide-react";

export default function AppShell({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");
  const [campusArea, setCampusArea] = useState("");
  const [roomBookingEnabled, setRoomBookingEnabled] = useState(true);
  const location = useLocation();
  const menuRef = useRef(null);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: Home, primary: true },
    { to: "/courses/schedule", label: "Course Schedule", icon: CalendarDays },
    { to: "/courses", label: "My Courses", icon: BookOpen },
    {
      to: "/files/recent",
      label: "Recent Files",
      icon: FileSearch,
    },
    { to: "/tasks", label: "Tasks & Assignments", icon: CheckSquare },
    { to: "/news", label: "News & Updates", icon: Newspaper },
    { to: "/praxisbericht", label: "Praxisbericht", icon: FolderOpen },
    {
      to: "/study-organization",
      label: "Study Organization",
      icon: GraduationCap,
    },

    { to: "/info-center", label: "Info Center", icon: Info },
    { to: "/faq", label: "Help & FAQ", icon: HelpCircle },
  ];

  // Close menu on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  // Fetch user for menu header
  useEffect(() => {
    (async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        const headers = {};
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
          if (typeof u?.roomBookingEnabled === "boolean")
            setRoomBookingEnabled(u.roomBookingEnabled);
        }
      } catch {}
    })();
  }, []);

  // Theme: initialize from localStorage (independent of system preference)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        // Default to light mode if no preference is stored
        setDarkMode(false);
        document.documentElement.classList.remove("dark");
        // Save default preference
        if (!stored) {
          localStorage.setItem("theme", "light");
        }
      }
    } catch (e) {
      // ignore on server or private mode
    }
  }, []);

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(to + "/");

  // Compute nav items with optional Raumbuchung, pointing to campus-aware URL
  const computedNavItems = React.useMemo(() => {
    const items = [...navItems];
    if (roomBookingEnabled) {
      const bookingTo = campusArea
        ? `/raumbuchung?campus=${encodeURIComponent(campusArea)}`
        : "/raumbuchung";
      // Insert after Praxisbericht for visibility
      const insertIndex = Math.max(
        0,
        items.findIndex((i) => i.to === "/praxisbericht") + 1
      );
      items.splice(insertIndex, 0, {
        to: bookingTo,
        label: "Raumbuchen",
        icon: DoorOpen,
      });
    }
    return items;
  }, [navItems, roomBookingEnabled, campusArea]);

  return (
    <div
      className={`min-h-screen ${darkMode ? "dark bg-slate-950" : "bg-gradient-to-br from-gray-50 via-white to-blue-50/30"} flex`}
    >
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          darkMode
            ? "bg-slate-900 text-slate-100 border-slate-800"
            : "bg-gradient-to-b from-white via-slate-50/50 to-white text-slate-800 border-slate-200 shadow-2xl"
        } ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } fixed md:static inset-y-0 left-0 w-72 z-50 flex flex-col border-r transition-transform duration-300 ease-in-out backdrop-blur-sm`}
      >
        {/* Logo Section */}
        <div className="h-24 flex items-center justify-between px-6 border-b-2 border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50/60 via-indigo-50/60 to-blue-50/60 dark:from-slate-800/50 dark:via-slate-800/50 dark:to-slate-800/50 backdrop-blur-sm">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 hover:opacity-90 transition-all duration-200 group"
          >
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-black-500 via-blue-600 to-indigo-600 border-2 border-black-300 dark:border-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                <span className="text-white font-white text-xl font-extrabold select-none">
                  IU
                </span>
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse shadow-sm"></div>
            </div>
            <div className="text-xs leading-tight">
              <div className="font-extrabold tracking-wide text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                INTERNATIONAL
              </div>
              <div className="-mt-1 font-extrabold tracking-wide text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-500 transition-colors">
                UNIVERSITY
              </div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hover:scale-110"
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
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                  active
                    ? darkMode
                      ? "bg-slate-800/70 border-l-4 border-blue-400 text-white shadow-sm"
                      : "bg-blue-50/80 border-l-4 border-blue-500 text-blue-700 shadow-sm"
                    : darkMode
                      ? "hover:bg-slate-800/40 text-slate-300 hover:text-white hover:translate-x-1 border-l-4 border-transparent"
                      : "hover:bg-slate-50 text-slate-700 hover:text-blue-700 hover:translate-x-1 border-l-4 border-transparent"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    active
                      ? darkMode
                        ? "bg-blue-500/20"
                        : "bg-blue-100"
                      : "bg-transparent group-hover:bg-slate-100 dark:group-hover:bg-slate-800/50"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
                      active
                        ? darkMode
                          ? "text-blue-400 scale-110"
                          : "text-blue-600 scale-110"
                        : "text-slate-500 group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400 group-hover:scale-110"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-semibold flex-1 ${
                    active ? (darkMode ? "text-white" : "text-blue-900") : ""
                  }`}
                >
                  {item.label}
                </span>
                {active && (
                  <div
                    className={`ml-auto h-2 w-2 rounded-full ${
                      darkMode ? "bg-blue-400" : "bg-blue-500"
                    } opacity-80 shadow-sm`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Quick Info */}
        <div
          className={`p-4 border-t-2 ${
            darkMode
              ? "border-slate-800 bg-slate-900/50"
              : "border-slate-200 bg-gradient-to-t from-blue-50/60 via-indigo-50/40 to-transparent"
          }`}
        >
          <div
            className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              darkMode
                ? "bg-slate-800/70 border-slate-700 hover:border-slate-600"
                : "bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border-blue-200 shadow-md hover:shadow-xl hover:border-blue-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 ${
                    darkMode
                      ? "bg-gradient-to-br from-slate-700 to-slate-800"
                      : "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600"
                  } text-white font-bold text-sm ring-2 ring-white/50 dark:ring-slate-600/50`}
                >
                  {userName
                    ? userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "ST"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-bold truncate mb-0.5 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {userName || "Student"}
                </div>
                <div
                  className={`text-xs truncate flex items-center gap-1 ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  <GraduationCap className="h-3 w-3" />
                  Student Portal
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <section className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className={`h-20 flex items-center justify-between px-4 md:px-6 border-b-2 ${
            darkMode
              ? "bg-slate-900/95 backdrop-blur-md border-slate-800 text-slate-100 shadow-lg shadow-slate-900/50"
              : "bg-white/95 backdrop-blur-md border-slate-200 shadow-lg shadow-slate-200/50"
          } sticky top-0 z-30`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`md:hidden p-2.5 rounded-xl transition-all ${
                darkMode
                  ? "hover:bg-slate-800 text-slate-200 hover:scale-110 hover:shadow-md"
                  : "hover:bg-blue-50 text-slate-700 hover:scale-110 hover:shadow-md border border-slate-200"
              }`}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:block">
              <div className="text-sm font-bold">
                <span className="hidden lg:inline bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  DS WINFO Business Informatics
                </span>
                <span className="lg:hidden bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  WINFO
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="hidden md:inline">Hamburg Campus</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const next = !darkMode;
                setDarkMode(next);
                try {
                  localStorage.setItem("theme", next ? "dark" : "light");
                  if (next) document.documentElement.classList.add("dark");
                  else document.documentElement.classList.remove("dark");
                } catch (_) {}
              }}
              className={`p-2.5 rounded-xl transition-all border ${
                darkMode
                  ? "bg-slate-800 text-amber-300 hover:bg-slate-700 hover:scale-110 hover:shadow-lg border-slate-700"
                  : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 hover:scale-110 shadow-sm border-slate-200"
              }`}
              title="Toggle theme"
            >
              {darkMode ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
            <Link
              to="/messages"
              title="Messages"
              className={`relative p-2.5 rounded-xl transition-all border ${
                darkMode
                  ? "hover:bg-slate-800 text-slate-200 hover:scale-110 hover:shadow-lg border-slate-700"
                  : "hover:bg-blue-50 text-slate-700 hover:scale-110 hover:shadow-md border-slate-200"
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse shadow-md" />
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              title="Profile Menu"
              aria-label="Profile Menu"
              className={`h-10 w-10 rounded-full transition-all border-2 ${
                darkMode
                  ? "bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-110 border-blue-500/50"
                  : "bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-110 border-blue-400/30"
              } flex items-center justify-center text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ring-offset-white`}
            >
              <UserIcon className="h-5 w-5" />
            </button>
            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute right-4 md:right-6 top-20 z-50 w-72 bg-white text-slate-900 border-2 border-slate-200 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="px-5 py-4 border-b-2 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/50 transition-transform duration-200 hover:scale-105 bg-gradient-to-br from-blue-500 to-indigo-600">
                        {userName
                          ? userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          : "ST"}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">
                        {userName || "Student"}
                      </div>
                      <div className="text-xs truncate text-slate-600">
                        Student ID
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`${darkMode ? "bg-slate-900" : "bg-white"} py-2`}
                  onClick={() => setMenuOpen(false)}
                >
                  <MenuItem
                    to="/settings"
                    icon={SettingsIcon}
                    label="Settings"
                    darkMode={darkMode}
                  />
                  <MenuItem
                    to="/curriculum"
                    icon={BookOpenCheck}
                    label="Studienplan"
                    darkMode={darkMode}
                  />
                  <MenuItem
                    to="/module-handbook"
                    icon={FileText}
                    label="Modulhandbuch"
                    darkMode={darkMode}
                  />
                  <MenuItem
                    to="/student-id"
                    icon={BadgeCheck}
                    label="Studentenausweis"
                    darkMode={darkMode}
                  />
                  <div
                    className={`px-5 py-2 text-xs font-semibold ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Bescheinigungen
                  </div>
                  <MenuItem
                    to="/certificates/transcript"
                    icon={FileText}
                    label="Transkript"
                    darkMode={darkMode}
                  />
                  <MenuItem
                    to="/certificates/immatriculation"
                    icon={FileText}
                    label="Immatrikulationsbescheinigung"
                    darkMode={darkMode}
                  />
                  <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
                  <MenuItem
                    to="/logout"
                    icon={LogOut}
                    label="Log out"
                    darkMode={darkMode}
                    danger
                  />
                </div>
              </div>
            )}
          </div>
        </header>
        {/* flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/80 via-white
        to-blue-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 */}
        {/* Content wrapper */}
        <div className="">
          <div className="px-4 md:px-6 lg:px-10 py-6 md:py-8">{children}</div>
        </div>
      </section>
    </div>
  );
}

function MenuItem({ to, icon: Icon, label, darkMode, danger }) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-3 px-5 py-3 text-sm transition-all duration-200 border-l-4 border-transparent ${
        danger
          ? darkMode
            ? "text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50"
            : "text-red-600 hover:bg-red-50 hover:text-red-700 hover:translate-x-1 hover:border-red-400"
          : darkMode
            ? "hover:bg-slate-800 text-slate-200 hover:text-white hover:border-blue-500/50"
            : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-slate-700 hover:text-blue-700 hover:translate-x-1 hover:border-blue-400"
      }`}
    >
      {Icon ? (
        <div className={`p-1 rounded-lg transition-all duration-200 ${
          danger
            ? "group-hover:bg-red-100/50 dark:group-hover:bg-red-500/10"
            : "group-hover:bg-blue-100/50 dark:group-hover:bg-white/10"
        }`}>
          <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
        </div>
      ) : null}
      <span className="font-semibold">{label}</span>
    </Link>
  );
}
