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
  Gift,
  BookOpenCheck,
  FileText,
  BadgeCheck,
  LogOut,
  Menu,
  X,
  CheckSquare,
  DoorOpen,
  Instagram,
  ArrowRight,
  Search,
  Bookmark,
  Award,
  Brain,
  Library,
  Clock,
} from "lucide-react";
import ThemeToggle from "~/components/ThemeToggle";
import LanguageToggle from "~/components/LanguageToggle";
import { useLanguage } from "~/contexts/LanguageContext";
import { ScreenReaderProvider } from "~/contexts/ScreenReaderContext";
import { ScreenReaderToggle } from "~/components/ScreenReaderToggle";
import { getCourseConfig } from "../data/coursesConfig";
import { BASE_NAV_ITEMS, SHELL_TRANSLATIONS } from "~/constants/navigation";

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Start closed on mobile (< 768px), open on desktop
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return true; // SSR fallback
  });
  const [userName, setUserName] = useState("");
  const [userStudyProgram, setUserStudyProgram] = useState("");
  const [campusArea, setCampusArea] = useState("");
  const [roomBookingEnabled, setRoomBookingEnabled] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const { language } = useLanguage();
  const shellText = SHELL_TRANSLATIONS[language];

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

          if (u?.name && u.name !== "Student") {
            setUserName(u.name);
          } else {
            // Fallback for development to ensure we see Sabin
            setUserName("Sabin Elanwar");
          }
          if (u?.studyProgram) setUserStudyProgram(u.studyProgram);
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
    if (
      to === "/courses" &&
      location.pathname.startsWith("/courses/schedule")
    ) {
      return false;
    }
    return location.pathname === to || location.pathname.startsWith(to + "/");
  };

  // -----------------------------
  // DYNAMIC ROOM BOOKING LINK
  // -----------------------------
  const computedNavItems = useMemo(() => {
    const labels = SHELL_TRANSLATIONS[language].nav;
    const items = BASE_NAV_ITEMS.map((item) => ({
      ...item,
      label: labels[item.key],
    }));

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

  // -----------------------------
  // SEARCH DATA & LOGIC
  // -----------------------------
  const searchableData = useMemo(() => {
    const s = shellText.search.categories;
    const allCourses = getCourseConfig(language);

    // Map real courses to searchable items
    const courseItems = allCourses.map((c) => ({
      id: `course-${c.id}`,
      title: c.title,
      category: s.courses,
      icon: BookOpen,
      link: `/courses/${c.id}`,
    }));

    // Static pages and utilities
    const staticItems = [
      {
        id: "d1",
        title: "Prüfungsordnung",
        category: s.documents,
        icon: FileText,
        link: "/module-handbook",
      },
      {
        id: "d2",
        title: "Modulhandbuch",
        category: s.documents,
        icon: FileText,
        link: "/module-handbook",
      },
      {
        id: "f1",
        title: "Häufig gestellte Fragen (FAQ)",
        category: s.faq,
        icon: HelpCircle,
        link: "/faq",
      },
      {
        id: "l1",
        title: "Bibliothek / Library",
        category: s.library,
        icon: Library,
        link: "/library",
      },
      {
        id: "g1",
        title: "Notenübersicht (Transcript)",
        category: s.grades,
        icon: Award,
        link: "/certificates/transcript",
      },
      {
        id: "g2",
        title: "Notenverwaltung / Leistungsübersicht",
        category: s.grades,
        icon: Award,
        link: "/notenverwaltung",
      },
      {
        id: "st1",
        title: "Studentenausweis",
        category: "Account",
        icon: BadgeCheck,
        link: "/student-id",
      },
    ];

    return [...courseItems, ...staticItems];
  }, [shellText, language]);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchableData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, searchableData]);

  // -----------------------------
  // RENDER UI
  // -----------------------------
  return (
    <ScreenReaderProvider>
      <div className="min-h-screen flex relative bg-background text-foreground">
        <div className="relative z-10 flex flex-1">
          {/* Overlay - mobile only */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 top-20 bg-black/60 z-[45] md:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* SIDEBAR */}
          <aside
            className={`
            bg-card text-card-foreground border-r border-border shadow-2xl md:shadow-none
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            fixed md:static inset-y-0 left-0 w-72 z-[50] md:z-auto flex flex-col transition-transform duration-300
            pt-20 md:pt-0
          `}
          >
            {/* Logo - hidden on mobile since header is visible */}
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
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-iu-green rounded-full border-[3px] border-card"></div>
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

              {/* close btn mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-2 rounded-lg hover:bg-iu-blue/10 hover:text-iu-blue transition-colors"
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

          {/* MAIN CONTENT */}
          <section className="flex-1 flex flex-col min-w-0">
            {/* Top bar */}
            <header className="h-20 flex items-center justify-between px-4 md:px-6 border-b border-border sticky top-0 z-[100] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-2.5 rounded-none hover:bg-iu-blue/10 hover:text-iu-blue transition-colors"
                >
                  {sidebarOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>

                <div className="hidden sm:flex flex-col justify-center h-full">
                  <div className="text-xs font-black text-muted-foreground/60 flex items-center gap-1.5 leading-none uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-iu-blue shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    {shellText.campus}
                  </div>
                </div>
              </div>

              {/* GLOBAL SEARCH */}
              <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-2 sm:mx-4 md:mx-8 relative">
                <div className="relative group">
                  <input
                    type="text"
                    className="block w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-muted/50 border border-border/50 rounded-xl sm:rounded-2xl text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:ring-2 focus:ring-iu-blue/50 focus:border-iu-blue transition-all shadow-sm"
                    placeholder={shellText.search.placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchActive(true)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-focus-within:text-iu-blue transition-colors" />
                  </div>

                  {/* Results dropdown */}
                  {searchQuery.trim() && (
                    <div className="fixed sm:absolute left-2 right-2 sm:left-0 sm:right-0 top-[4.5rem] sm:top-full mt-0 sm:mt-2 bg-card text-card-foreground border border-border rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden z-[200] animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-2 sm:p-3 border-b border-border bg-muted/30 flex justify-between items-center text-[10px] sm:text-xs font-bold text-iu-blue">
                        <span>
                          {filteredResults.length} {shellText.search.results}
                        </span>
                      </div>
                      <div className="max-h-[250px] sm:max-h-[300px] overflow-y-auto p-1.5 sm:p-2 space-y-0.5 sm:space-y-1">
                        {filteredResults.length > 0 ? (
                          filteredResults.map((result) => (
                            <Link
                              key={result.id}
                              to={result.link}
                              onClick={() => setSearchQuery("")}
                              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-iu-blue/10 group/item transition-all border border-transparent hover:border-iu-blue/20"
                            >
                              <div className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg bg-background border border-border text-muted-foreground group-hover/item:text-iu-blue group-hover/item:border-iu-blue/30 transition-colors">
                                <result.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs sm:text-sm font-bold sm:font-black uppercase tracking-tight truncate">
                                  {result.title}
                                </div>
                                <div className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider sm:tracking-widest">
                                  {result.category}
                                </div>
                              </div>
                              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all text-iu-blue hidden sm:block" />
                            </Link>
                          ))
                        ) : (
                          <div className="p-4 sm:p-8 text-center">
                            <FileSearch className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-[10px] sm:text-xs text-muted-foreground font-bold sm:font-black uppercase tracking-wider sm:tracking-widest">
                              {shellText.search.noResults} "{searchQuery}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                <div>
                  <ScreenReaderToggle variant="compact" />
                </div>
                <LanguageToggle />
                <ThemeToggle />

                <Link
                  to="/contact"
                  className="hidden sm:flex relative p-2.5 rounded-xl border border-border hover:bg-iu-blue/10 hover:text-iu-blue hover:border-iu-blue/30 transition-all font-bold"
                >
                  <Headphones className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-3 w-3 bg-iu-red rounded-full border-2 border-background"></span>
                </Link>

                {/* Profile button */}
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-iu-blue text-white shadow-xl shadow-iu-blue/30 hover:shadow-iu-blue/50 transition-all active:scale-95 flex items-center justify-center font-bold"
                >
                  <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                {menuOpen && (
                  <div
                    ref={menuRef}
                    className="absolute right-4 md:right-6 top-20 z-50 w-72 bg-card text-card-foreground border border-border rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <div className="px-5 py-5 border-b border-border bg-iu-blue/5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-iu-blue flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {userName
                            ? userName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "ST"}
                        </div>
                        <div>
                          <div className="font-black text-foreground uppercase tracking-tight">
                            {userName && userName !== "Student"
                              ? userName
                              : "Sabin Elanwar"}
                          </div>
                          <div className="text-[10px] font-black text-iu-blue dark:text-iu-blue uppercase tracking-[0.2em]">
                            Online
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* menu links */}
                    <div onClick={() => setMenuOpen(false)} className="py-1">
                      <MenuItem
                        to="/settings"
                        icon={SettingsIcon}
                        label={shellText.menu.settings}
                      />
                      <MenuItem
                        to="/curriculum"
                        icon={BookOpenCheck}
                        label={shellText.menu.curriculum}
                      />
                      <MenuItem
                        to="/module-handbook"
                        icon={FileText}
                        label={shellText.menu.moduleHandbook}
                      />
                      <MenuItem
                        to="/student-id"
                        icon={BadgeCheck}
                        label={shellText.menu.studentId}
                      />

                      <div className="px-5 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/30">
                        {shellText.menu.certificates}
                      </div>

                      <MenuItem
                        to="/certificates/transcript"
                        icon={FileText}
                        label={shellText.menu.transcript}
                      />
                      <MenuItem
                        to="/certificates/immatriculation"
                        icon={FileText}
                        label={shellText.menu.immatriculation}
                      />

                      <div className="border-t border-border my-1" />

                      <MenuItem
                        to="/logout"
                        icon={LogOut}
                        label={shellText.menu.logout}
                        danger
                      />
                    </div>
                  </div>
                )}
              </div>
            </header>

            {/* Page content */}
            <div className="px-3 sm:px-4 md:px-6 lg:px-10 py-4 sm:py-6 md:py-8">
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </ScreenReaderProvider>
  );
}

// ------------------------------------------------------------
// MENU ITEM COMPONENT
// ------------------------------------------------------------
import type { MenuItemProps } from "~/types/navigation";

function MenuItem({ to, icon: Icon, label, danger }: MenuItemProps) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-3 px-5 py-3 text-sm transition-all border-l-4 border-transparent ${
        danger
          ? "text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-500 font-bold"
          : "hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 text-muted-foreground font-medium"
      }`}
    >
      <Icon
        className={`h-4 w-4 transition-colors ${danger ? "text-rose-500 group-hover:text-rose-600" : "text-muted-foreground group-hover:text-neutral-900"}`}
      />
      <span className="font-bold">{label}</span>
    </Link>
  );
}
