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
} from "lucide-react";

export default function AppShell({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const menuRef = useRef(null);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/courses/schedule", label: "Course schedule", icon: CalendarDays },
    { to: "/courses", label: "Courses", icon: BookOpen },
    {
      to: "/files/recent",
      label: "Zuletzt geöffnete Dateien",
      icon: FileSearch,
    },
    { to: "/news", label: "News", icon: Newspaper },
    { to: "/praxisbericht", label: "Praxisbericht", icon: FolderOpen },
    {
      to: "/study-organization",
      label: "Study organization",
      icon: GraduationCap,
    },
    { to: "/info-center", label: "Info center", icon: Info },
    { to: "/faq", label: "FAQ", icon: HelpCircle },
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
      className={`min-h-screen ${darkMode ? "bg-slate-950" : "bg-white"} flex`}
    >
      {/* Sidebar */}
      <aside
        className={`${darkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"} w-64 hidden md:flex flex-col border-r ${darkMode ? "border-slate-800" : "border-slate-200"}`}
      >
        <div className="h-20 flex items-center px-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-slate-900 text-white flex items-center justify-center font-black">
              iu
            </div>
            <div className="text-xs leading-tight">
              <div className="font-extrabold tracking-wide">INTERNATIONAL</div>
              <div className="-mt-1 font-extrabold tracking-wide">
                UNIVERSITY
              </div>
            </div>
          </div>
        </div>
        <nav className="mt-6 space-y-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive(item.to)
                  ? darkMode
                    ? "bg-slate-800 text-white"
                    : "bg-white text-slate-900 shadow-sm"
                  : darkMode
                    ? "hover:bg-slate-800 text-slate-200"
                    : "hover:bg-white text-slate-700"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <section className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className={`h-16 flex items-center justify-between px-6 border-b ${darkMode ? "bg-slate-900/60 border-slate-800 text-slate-100" : "bg-white/70 backdrop-blur border-slate-200"}`}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-2.5 py-1.5 rounded-lg text-sm ${darkMode ? "bg-slate-800 text-amber-300" : "bg-slate-100 text-slate-700"}`}
              title="Toggle theme"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-xs font-semibold opacity-80">
              DS WINFO Business Informatics (Hamburg)
            </div>
            <Link
              to="/messages"
              title="Messages"
              className={`relative px-3 py-1.5 rounded-lg ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
            >
              <MessageSquare className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              title="Profilmenü"
              aria-label="Profilmenü"
              className={`h-8 w-8 rounded-full ${darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-200 hover:bg-slate-300"} flex items-center justify-center ring-0 focus:outline-none focus:ring-2 focus:ring-slate-500`}
            >
              <UserIcon className="h-5 w-5" />
            </button>
            {menuOpen && (
              <div
                ref={menuRef}
                className={`absolute right-6 top-14 z-50 w-64 ${darkMode ? "bg-slate-900 text-slate-100 border-slate-800" : "bg-white text-slate-900 border-slate-200"} border rounded-xl shadow-xl overflow-hidden`}
                onClick={() => setMenuOpen(false)}
              >
                <div
                  className={`px-4 py-4 ${darkMode ? "bg-slate-900" : "bg-white"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`${darkMode ? "bg-slate-800" : "bg-slate-200"} h-9 w-9 rounded-full flex items-center justify-center`}
                    >
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div className="text-sm leading-tight">
                      <div className="font-semibold">
                        {userName || "Student"}
                      </div>
                      <div className="text-xs text-slate-500">Student ID</div>
                    </div>
                  </div>
                </div>
                <div
                  className={`${darkMode ? "bg-slate-900" : "bg-white"} py-2`}
                >
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
                    className={`px-4 py-2 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
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
                  <MenuItem to="/logout" icon={LogOut} label="Log out" />
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content wrapper */}
        <div className="px-6 lg:px-10 py-8">{children}</div>
      </section>
    </div>
  );
}

function MenuItem({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 hover:text-slate-900"
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      <span>{label}</span>
    </Link>
  );
}
