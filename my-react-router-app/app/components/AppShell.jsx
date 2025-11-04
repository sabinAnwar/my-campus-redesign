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
} from "lucide-react";

export default function AppShell({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");
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
    { to: "/messages", label: "Messages", icon: MessageSquare },
    { to: "/events", label: "Events", icon: CalendarDays },
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
        }
      } catch {}
    })();
  }, []);

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <div
      className={`min-h-screen ${darkMode ? "dark bg-slate-950" : "bg-gradient-to-br from-slate-50 via-white to-blue-50/30"} flex`}
    >
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          darkMode
            ? "bg-slate-900 text-slate-100 border-slate-800"
            : "bg-white text-slate-800 border-slate-200 shadow-xl"
        } ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } fixed md:static inset-y-0 left-0 w-72 z-50 flex flex-col border-r transition-transform duration-300 ease-in-out`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-lg bg-white border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center shadow-sm">
              <span className="text-black dark:text-white font-black text-lg font-extrabold select-none">IU</span>
            </div>
            <div className="text-xs leading-tight">
              <div className="font-extrabold tracking-wide text-slate-900 dark:text-white">
                INTERNATIONAL
              </div>
              <div className="-mt-1 font-extrabold tracking-wide text-slate-700 dark:text-slate-300">
                UNIVERSITY
              </div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? darkMode
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm"
                    : darkMode
                      ? "hover:bg-slate-800/50 text-slate-200 hover:text-white"
                      : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    active
                      ? darkMode
                        ? "text-white"
                        : "text-blue-600"
                      : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-white"
                  }`}
                />
                <span className="text-sm font-semibold">{item.label}</span>
                {active && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-current opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Quick Info */}
        <div
          className={`p-4 border-t ${
            darkMode ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <div
            className={`p-3 rounded-xl ${
              darkMode
                ? "bg-slate-800/50"
                : "bg-gradient-to-br from-blue-50 to-indigo-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  darkMode
                    ? "bg-slate-700"
                    : "bg-gradient-to-br from-blue-500 to-indigo-500"
                } text-white font-semibold`}
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
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-semibold truncate ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {userName || "Student"}
                </div>
                <div
                  className={`text-xs truncate ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
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
          className={`h-16 flex items-center justify-between px-4 md:px-6 border-b ${
            darkMode
              ? "bg-slate-900/95 backdrop-blur-sm border-slate-800 text-slate-100"
              : "bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm"
          } sticky top-0 z-30`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                darkMode
                  ? "hover:bg-slate-800 text-slate-200"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:block text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="hidden lg:inline">DS WINFO Business Informatics</span>
              <span className="lg:hidden">WINFO</span>
              <span className="hidden md:inline ml-2 opacity-60">(Hamburg)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? "bg-slate-800 text-amber-300 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              title="Toggle theme"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <Link
              to="/messages"
              title="Messages"
              className={`relative p-2 rounded-lg transition-colors ${
                darkMode
                  ? "hover:bg-slate-800 text-slate-200"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              title="Profile Menu"
              aria-label="Profile Menu"
              className={`h-9 w-9 rounded-full transition-all ${
                darkMode
                  ? "bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                  : "bg-gradient-to-br from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              } flex items-center justify-center text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <UserIcon className="h-5 w-5" />
            </button>
            {menuOpen && (
              <div
                ref={menuRef}
                className={`absolute right-4 md:right-6 top-16 z-50 w-72 ${
                  darkMode
                    ? "bg-slate-900 text-slate-100 border-slate-800"
                    : "bg-white text-slate-900 border-slate-200 shadow-2xl"
                } border rounded-2xl overflow-hidden backdrop-blur-xl`}
              >
                <div
                  className={`px-5 py-4 ${
                    darkMode
                      ? "bg-gradient-to-r from-slate-800 to-slate-900"
                      : "bg-gradient-to-r from-blue-50 to-indigo-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        darkMode
                          ? "bg-gradient-to-br from-blue-600 to-indigo-600"
                          : "bg-gradient-to-br from-blue-500 to-indigo-500"
                      }`}
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
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {userName || "Student"}
                      </div>
                      <div
                        className={`text-xs truncate ${
                          darkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
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

        {/* Content wrapper */}
        <div className="flex-1 overflow-y-auto">
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
      className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
        danger
          ? darkMode
            ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
            : "text-red-600 hover:bg-red-50 hover:text-red-700"
          : darkMode
            ? "hover:bg-slate-800 text-slate-200 hover:text-white"
            : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
      }`}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      <span>{label}</span>
    </Link>
  );
}
