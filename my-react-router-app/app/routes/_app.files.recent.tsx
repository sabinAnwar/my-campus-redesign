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
    title: "Zuletzt gesuchte Dateien",
    subtitle: "Durchsuche deine Dateien und greife schnell auf kürzlich geöffnete Dokumente zu",
    noFilesFound: "Keine Dateien gefunden",
    noFilesDesc: "Es sind noch keine Dateien in der Datenbank. Dateien werden automatisch hinzugefügt, wenn du:",
    noFilesItem1: "Kurse besuchst und Materialien öffnest",
    noFilesItem2: "Dokumente im Dokumentencenter ansiehst",
    noFilesItem3: "Dateien hochlädst",
    searchPlaceholder: "Dateiname suchen…",
    search: "Suchen",
    recentSearchTerms: "Letzte Suchbegriffe",
    clear: "Leeren",
    noSearchTerms: "Keine Suchbegriffe gespeichert.",
    recentlyOpened: "Zuletzt geöffnete Dateien",
    noFilesOpened: "Noch keine Dateien geöffnet.",
    unknownCourse: "Unbekannter Kurs",
    open: "Öffnen",
    searchResults: "Suchergebnisse",
    noResults: "Keine Treffer gefunden.",
    enterSearchTerm: "Gib einen Suchbegriff ein.",
    remember: "Merken",
    unknown: "Unbekannt",
  },
  en: {
    title: "Recently Searched Files",
    subtitle: "Search your files and quickly access recently opened documents",
    noFilesFound: "No Files Found",
    noFilesDesc: "There are no files in the database yet. Files will be automatically added when you:",
    noFilesItem1: "Visit courses and open materials",
    noFilesItem2: "View documents in the document center",
    noFilesItem3: "Upload files",
    searchPlaceholder: "Search filename…",
    search: "Search",
    recentSearchTerms: "Recent Search Terms",
    clear: "Clear",
    noSearchTerms: "No search terms saved.",
    recentlyOpened: "Recently Opened Files",
    noFilesOpened: "No files opened yet.",
    unknownCourse: "Unknown Course",
    open: "Open",
    searchResults: "Search Results",
    noResults: "No results found.",
    enterSearchTerm: "Enter a search term.",
    remember: "Remember",
    unknown: "Unknown",
  },
};

/* -------------------------------------------- */
/* TYPES                                         */
/* -------------------------------------------- */

type ModuleFile = {
  id: number;
  name: string;
  size: string;
  date: string;
  moduleId?: number;
  moduleName?: string;
  fileType?: string;
  type?: string;
  url?: string | null;
  studiengang?: string | null;
};

type RecentFileEntry = {
  id: number;
  name: string;
  fileType: string | null;
  url: string | null;
  moduleName: string | null;
  studiengang: string | null;
  at: number;
};

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
        uploadedAt: 'desc',
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

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Zuletzt gesuchte Dateien
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Durchsuche deine Dateien und greife schnell auf kürzlich geöffnete Dokumente zu
          </p>
        </div>

        {/* No Files Warning */}
        {FILES.length === 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500 rounded-xl">
                <FileIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-2">
                  Keine Dateien gefunden
                </h3>
                <p className="text-amber-700 dark:text-amber-300 mb-3">
                  Es sind noch keine Dateien in der Datenbank. Dateien werden automatisch hinzugefügt, wenn du:
                </p>
                <ul className="list-disc list-inside text-amber-700 dark:text-amber-300 space-y-1">
                  <li>Kurse besuchst und Materialien öffnest</li>
                  <li>Dokumente im Dokumentencenter ansiehst</li>
                  <li>Dateien hochlädst</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH BAR */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex gap-3 items-center">
            <Search className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              placeholder="Dateiname suchen…"
              className="flex-1 outline-none bg-transparent text-neutral-900 dark:text-neutral-50 placeholder-neutral-500 dark:placeholder-neutral-600 text-lg"
              disabled={FILES.length === 0}
            />
            <button
              onClick={() => onSearch()}
              disabled={FILES.length === 0}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suchen
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RECENT SEARCH TERMS */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Letzte Suchbegriffe
              </h2>
              <button
                onClick={clearTerms}
                className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 inline-flex items-center gap-1 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Leeren
              </button>
            </div>

            {recentTerms.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Keine Suchbegriffe gespeichert.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {recentTerms.map((t) => (
                  <button
                    key={t}
                    onClick={() => onSearch(t)}
                    className="px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-sm font-semibold transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* RECENT FILES */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Zuletzt geöffnete Dateien
              </h2>
              <button
                onClick={clearFiles}
                className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 inline-flex items-center gap-1 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Leeren
              </button>
            </div>

            {recentFiles.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Noch keine Dateien geöffnet.
              </p>
            ) : (
              <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {recentFiles.map((f) => {
                  const fileType = f.fileType?.toLowerCase() ?? "";

                  const getFileTypeBadge = () => {
                    if (fileType === "pdf")
                      return (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200 font-semibold">
                          PDF
                        </span>
                      );
                    if (["excel", "xlsx", "xls"].includes(fileType))
                      return (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200 font-semibold">
                          Excel
                        </span>
                      );
                    if (["podcast", "mp3", "mp4"].includes(fileType))
                      return (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 font-semibold">
                          Podcast
                        </span>
                      );
                    if (fileType === "video")
                      return (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 font-semibold">
                          Video
                        </span>
                      );

                    return null;
                  };

                  return (
                    <li key={f.id} className="py-3 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-lg px-2 -mx-2 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                              {f.name}
                            </div>

                            {getFileTypeBadge()}
                          </div>

                          <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-1">
                            {f.moduleName ?? "Unbekannter Kurs"} •
                            <Clock className="inline h-3.5 w-3.5" />
                            {new Date(f.at).toLocaleString("de-DE", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (f.url) {
                            window.open(f.url, "_blank", "noopener,noreferrer");

                            const updatedFiles = recentFiles.map((file) =>
                              file.id === f.id ? { ...file, at: Date.now() } : file
                            );

                            setRecentFiles(updatedFiles);
                            localStorage.setItem(
                              LS_KEYS.recentFiles,
                              JSON.stringify(updatedFiles)
                            );
                          } else {
                            window.location.href = "/courses";
                          }
                        }}
                        className="text-xs inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 ml-2 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Öffnen
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* SEARCH RESULTS */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FolderOpen className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Suchergebnisse
              </h2>
            </div>

            {results.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {q ? "Keine Treffer gefunden." : "Gib einen Suchbegriff ein."}
              </p>
            ) : (
              <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {results.map((f) => (
                  <li key={f.id} className="py-3 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-lg px-2 -mx-2 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                          {f.name}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {f.moduleName} • {f.size}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => saveRecentFile(f)}
                      className="text-xs inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors font-semibold"
                    >
                      <Download className="h-3.5 w-3.5" /> Merken
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
