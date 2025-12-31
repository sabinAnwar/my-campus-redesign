import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  Search,
  Clock,
  File as FileIcon,
  Trash2,
  ExternalLink,
  FolderOpen,
  Download,
  Video,
  X,
  ClipboardCheck,
  Headphones,
} from "lucide-react";
import {
  getRecentFiles,
  clearRecentFiles,
  saveRecentFile as saveRecentFileLib,
} from "../lib/recentFiles";
import { prisma } from "~/lib/prisma";
import { useLanguage } from "~/contexts/LanguageContext";

// ────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS
// ────────────────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  de: {
    title: "Zuletzt besucht",
    subtitle:
      "Greife schnell auf deine kürzlich angesehenen Vorlesungsmaterialien, Videos und Ressourcen zu",
    noFilesFound: "Keine Inhalte gefunden",
    noFilesDesc:
      "Es sind noch keine Inhalte in deiner Historie. Inhalte werden automatisch hinzugefügt, wenn du:",
    noFilesItem1: "Skripte oder PDFs in Kursen öffnest",
    noFilesItem2: "Vorlesungsvideos oder Podcasts ansiehst",
    noFilesItem3: "Online-Tests oder Evaluationen startest",
    searchPlaceholder: "Nach Inhalten suchen…",
    search: "Suchen",
    recentSearchTerms: "Letzte Suchen",
    clear: "Verlauf leeren",
    noSearchTerms: "Keine Suchbegriffe.",
    recentlyOpened: "Deine Timeline",
    noFilesOpened: "Du hast noch keine Inhalte besucht.",
    unknownCourse: "Allgemein",
    open: "Öffnen",
    searchResults: "Suchergebnisse",
    noResults: "Keine Treffer.",
    enterSearchTerm: "Suchbegriff eingeben.",
    remember: "Merken",
    unknown: "Unbekannt",
    filterAll: "Alle",
    filterVideos: "Videos",
    filterDocs: "Dokumente",
    filterTests: "Tests/Evaluationen",
  },
  en: {
    title: "Recently Visited",
    subtitle:
      "Quickly access your recently viewed lecture materials, videos and resources",
    noFilesFound: "No content found",
    noFilesDesc:
      "There's no content in your history yet. Content is automatically added when you:",
    noFilesItem1: "Open scripts or PDFs in courses",
    noFilesItem2: "Watch lecture videos or podcasts",
    noFilesItem3: "Start online tests or evaluations",
    searchPlaceholder: "Search content…",
    search: "Search",
    recentSearchTerms: "Recent Searches",
    clear: "Clear History",
    noSearchTerms: "No search terms.",
    recentlyOpened: "Your Timeline",
    noFilesOpened: "No content visited yet.",
    unknownCourse: "General",
    open: "Open",
    searchResults: "Search Results",
    noResults: "No results.",
    enterSearchTerm: "Enter search term.",
    remember: "Remember",
    unknown: "Unknown",
    filterAll: "All",
    filterVideos: "Videos",
    filterDocs: "Documents",
    filterTests: "Tests/Evaluations",
  },
};

/* -------------------------------------------- */
/* TYPES                                         */
/* -------------------------------------------- */

import type { ModuleFile, RecentFileEntry } from "~/types/file";

/* -------------------------------------------- */
/* LOADER                                        */
/* -------------------------------------------- */

export const loader = async () => {
  try {
    const files = await prisma.file.findMany({
      include: {
        course: true,
        studiengang: true,
      },
      orderBy: {
        uploadedAt: "desc",
      },
      take: 100, // Limit to recent 100 files
    });

    return { files };
  } catch (error) {
    console.error("Error loading files:", error);
    return { files: [] };
  }
};

const LS_KEYS = {
  recentTerms: "recentFileSearchTerms",
  recentFiles: "recentFilesList",
};

/* -------------------------------------------- */
/* COMPONENT                                     */
/* -------------------------------------------- */

export default function RecentFiles() {
  const { files: dbFiles } = useLoaderData<typeof loader>();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const [q, setQ] = useState("");
  const [results, setResults] = useState<ModuleFile[]>([]);
  const [recentTerms, setRecentTerms] = useState<string[]>([]);
  const [recentFiles, setRecentFiles] = useState<RecentFileEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  // Convert database files to ModuleFile format
  const FILES: ModuleFile[] = dbFiles.map((f: any) => ({
    id: f.id,
    name: f.name,
    size: f.size || "Unknown",
    date: f.uploadedAt.toString(),
    moduleName: f.course?.name || f.studiengang?.name || "Unbekannt",
    fileType: f.fileType || undefined,
    url: f.url,
    studiengang: f.studiengang?.name || null,
  }));

  /* LOAD LOCALSTORAGE */
  useEffect(() => {
    const loadData = () => {
      try {
        const t = JSON.parse(localStorage.getItem(LS_KEYS.recentTerms) || "[]");
        setRecentTerms(Array.isArray(t) ? t : []);

        const files = getRecentFiles() as RecentFileEntry[];
        setRecentFiles(files);
      } catch {}
    };

    loadData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LS_KEYS.recentFiles || e.key === LS_KEYS.recentTerms) {
        loadData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /* SAVE SEARCH TERM */
  const saveTerm = (term: string) => {
    if (!term) return;
    const next = [term, ...recentTerms.filter((t) => t !== term)].slice(0, 10);
    setRecentTerms(next);
    try {
      localStorage.setItem(LS_KEYS.recentTerms, JSON.stringify(next));
    } catch {}
  };

  /* SAVE FILE */
  const saveRecentFile = (file: ModuleFile) => {
    const saved = saveRecentFileLib(
      {
        id: String(file.id),
        name: file.name,
        type: file.fileType || file.type || "unknown",
        url: file.url || null,
      },
      file.moduleName ?? "Unbekannt",
      file.studiengang ?? null
    );

    setRecentFiles(saved as RecentFileEntry[]);
  };

  /* SEARCH FUNCTION */
  const onSearch = (term?: string) => {
    const t = (term ?? q).trim();
    if (!t) {
      setResults([]);
      return;
    }

    const lower = t.toLowerCase();
    const filtered = FILES.filter((f) => f.name.toLowerCase().includes(lower));
    setResults(filtered);
    saveTerm(t);
  };

  const clearTerms = () => {
    setRecentTerms([]);
    try {
      localStorage.setItem(LS_KEYS.recentTerms, "[]");
    } catch {}
  };

  const clearFiles = () => {
    clearRecentFiles();
    setRecentFiles([]);
  };

  /* -------------------------------------------- */
  /* RENDER                                        */
  /* -------------------------------------------- */

  /* FILTER LOGIC */
  const filteredFiles = recentFiles.filter((f) => {
    if (activeFilter === "all") return true;
    const type = f.fileType?.toLowerCase() || "";
    if (activeFilter === "videos")
      return type === "video" || type === "podcast";
    if (activeFilter === "docs")
      return ["pdf", "excel", "xlsx", "xls", "script"].includes(type);
    if (activeFilter === "tests")
      return type === "test" || type === "evaluation";
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <header className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                <Clock size={28} />
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight">
                {t.title}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={clearFiles}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-red-50 dark:bg-neutral-800 dark:hover:bg-red-950/30 text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 rounded-xl transition-all duration-300 text-sm font-bold border border-neutral-200 dark:border-neutral-700 hover:border-red-200 dark:hover:border-red-900/50 shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
            {t.clear}
          </button>
        </div>

        {/* Activity Filter */}
        <div className="flex flex-wrap items-center gap-2 mt-8">
          {[
            { id: "all", label: t.filterAll, icon: Clock },
            { id: "videos", label: t.filterVideos, icon: Video },
            { id: "docs", label: t.filterDocs, icon: FileIcon },
            { id: "tests", label: t.filterTests, icon: ClipboardCheck },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeFilter === filter.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 translate-y-[-2px]"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800"
              }`}
            >
              <filter.icon className="h-4 w-4" />
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      {/* Search Bar - Slim Version */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 mb-10 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
        <div className="flex gap-4 items-center">
          <Search className="h-5 w-5 text-neutral-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder={t.searchPlaceholder}
            className="flex-1 outline-none bg-transparent text-neutral-900 dark:text-white placeholder-neutral-500 text-base"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
            >
              <X className="h-4 w-4 text-neutral-400" />
            </button>
          )}
        </div>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Timeline Column */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            {t.recentlyOpened}
          </h2>

          {filteredFiles.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl p-12 text-center">
              <div className="bg-neutral-100 dark:bg-neutral-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileIcon className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                {t.noFilesOpened}
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-sm mx-auto mb-8">
                {t.noFilesDesc}
              </p>
              <ul className="text-xs text-neutral-400 dark:text-neutral-500 space-y-2 inline-block text-left">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                  {t.noFilesItem1}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                  {t.noFilesItem2}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                  {t.noFilesItem3}
                </li>
              </ul>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredFiles.map((f, idx) => {
                const type = f.fileType?.toLowerCase() || "";

                const isVideo = type === "video";
                const isPodcast = type === "podcast";
                const isTest = type === "test" || type === "evaluation";
                const isDoc = [
                  "pdf",
                  "excel",
                  "xlsx",
                  "xls",
                  "script",
                ].includes(type);

                return (
                  <div
                    key={f.id + idx}
                    className="group bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 hover:border-iu-blue/30 hover:bg-card transition-all duration-500 shadow-xl relative overflow-hidden"
                  >
                    {/* Hover background effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-iu-blue/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity -mr-32 -mt-32"></div>

                    <div className="flex items-start gap-6 relative z-10">
                      {/* Type Icon Container */}
                      <div
                        className={`p-4 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-110 shadow-lg border ${
                          isVideo
                            ? "bg-iu-red/10 border-iu-red/20 text-iu-red"
                            : isPodcast
                              ? "bg-iu-purple/10 border-iu-purple/20 text-iu-purple"
                              : isTest
                                ? "bg-iu-orange/10 border-iu-orange/20 text-iu-orange"
                                : "bg-iu-blue/10 border-iu-blue/20 text-iu-blue"
                        }`}
                      >
                        {isVideo ? (
                          <Video className="h-7 w-7" />
                        ) : isPodcast ? (
                          <Headphones className="h-7 w-7" />
                        ) : isTest ? (
                          <ClipboardCheck className="h-7 w-7" />
                        ) : (
                          <FileIcon className="h-7 w-7" />
                        )}
                      </div>

                      {/* Info Container */}
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <h3 className="text-lg font-bold text-foreground truncate group-hover:text-iu-blue transition-colors">
                            {f.name}
                          </h3>
                          {/* Mediatype Badge */}
                          <span
                            className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${
                              isVideo
                                ? "bg-iu-red/10 border-iu-red/20 text-iu-red"
                                : isPodcast
                                  ? "bg-iu-purple/10 border-iu-purple/20 text-iu-purple"
                                  : isTest
                                    ? "bg-iu-orange/10 border-iu-orange/20 text-iu-orange"
                                    : "bg-iu-blue/10 border-iu-blue/20 text-iu-blue"
                            }`}
                          >
                            {type || "Source"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                          <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-muted-foreground/30" />
                            <span className="truncate">
                              {f.moduleName || t.unknownCourse}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground/30" />
                            {new Date(f.at).toLocaleDateString(
                              language === "de" ? "de-DE" : "en-US",
                              {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          saveRecentFileLib(
                            {
                              id: f.id,
                              name: f.name,
                              type: f.fileType,
                              url: f.url,
                            },
                            f.moduleName,
                            f.studiengang
                          );
                          if (f.url && f.url !== "#") {
                            window.open(f.url, "_blank", "noopener,noreferrer");
                          } else {
                            window.location.href = "/courses";
                          }
                        }}
                        className="absolute right-8 top-1/2 -translate-y-1/2 p-4 rounded-2xl bg-muted/50 text-muted-foreground hover:bg-iu-blue hover:text-white transition-all shadow-sm border border-border opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 duration-300"
                      >
                        <ExternalLink className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          {/* Search Results / Tags */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Search className="h-4 w-4 text-neutral-400" />
              {t.recentSearchTerms}
            </h3>

            {recentTerms.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">
                {t.noSearchTerms}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {recentTerms.map((term) => (
                  <button
                    key={term}
                    onClick={() => onSearch(term)}
                    className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs font-bold rounded-lg transition-colors"
                  >
                    {term}
                  </button>
                ))}
                <button
                  onClick={clearTerms}
                  className="text-[10px] text-neutral-400 hover:text-red-500 font-bold uppercase mt-2 w-full text-left ml-1"
                >
                  {t.clear}
                </button>
              </div>
            )}
          </section>

          {/* Quick Link Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20">
            <h3 className="font-black text-lg mb-2">Hilfe nötig?</h3>
            <p className="text-blue-100 text-xs leading-relaxed mb-4">
              Du findest deine Dokumente nicht? Probier es direkt im Dokumenten
              Center.
            </p>
            <button
              onClick={() => (window.location.href = "/info-center")}
              className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black transition-colors backdrop-blur-sm"
            >
              Info Center öffnen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
