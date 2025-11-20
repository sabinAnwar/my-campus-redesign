import React, { useEffect, useState } from "react";

import {
  Search,
  Clock,
  File as FileIcon,
  Trash2,
  ExternalLink,
  FolderOpen,
} from "lucide-react";
import {
  getRecentFiles,
  clearRecentFiles,
  saveRecentFile as saveRecentFileLib,
} from "../lib/recentFiles";

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
/* DATA                                          */
/* -------------------------------------------- */

export const loader = async () => null;

const MODULES = [
  {
    id: 1,
    name: "Webentwicklung",
    files: [
      { id: 1, name: "HTML_Basics.pdf", size: "2.5 MB", date: "2025-10-15" },
      { id: 2, name: "CSS_Advanced.pdf", size: "3.1 MB", date: "2025-10-18" },
      {
        id: 3,
        name: "JavaScript_Tutorial.zip",
        size: "15 MB",
        date: "2025-10-20",
      },
    ],
  },
  {
    id: 2,
    name: "Datenbankdesign",
    files: [
      { id: 4, name: "SQL_Queries.pdf", size: "1.8 MB", date: "2025-10-12" },
      {
        id: 5,
        name: "Normalisierung.docx",
        size: "0.9 MB",
        date: "2025-10-16",
      },
    ],
  },
  {
    id: 3,
    name: "Cloud Computing",
    files: [
      { id: 6, name: "AWS_Guide.pdf", size: "4.2 MB", date: "2025-10-14" },
      {
        id: 7,
        name: "Docker_Examples.tar.gz",
        size: "8.5 MB",
        date: "2025-10-19",
      },
    ],
  },
];

const FILES: ModuleFile[] = MODULES.flatMap((m) =>
  m.files.map((f) => ({
    ...f,
    moduleId: m.id,
    moduleName: m.name,
  }))
);

const LS_KEYS = {
  recentTerms: "recentFileSearchTerms",
  recentFiles: "recentFilesList",
};

/* -------------------------------------------- */
/* COMPONENT                                     */
/* -------------------------------------------- */

export default function RecentFiles() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<ModuleFile[]>([]);
  const [recentTerms, setRecentTerms] = useState<string[]>([]);
  const [recentFiles, setRecentFiles] = useState<RecentFileEntry[]>([]);

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
    <div className="max-w-7xl mx-auto text-slate-900 dark:text-slate-100">
      <h1 className="text-[28px] font-semibold text-slate-900 dark:text-white mb-6">
        Zuletzt gesuchte Dateien
      </h1>

      {/* SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 transition-colors">
        <div className="flex gap-3 items-center">
          <Search className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Dateiname suchen…"
            className="flex-1 outline-none bg-transparent text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-600"
          />
          <button
            onClick={() => onSearch()}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-sm font-semibold transition-colors"
          >
            Suchen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT SEARCH TERMS */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Letzte Suchbegriffe
            </h2>
            <button
              onClick={clearTerms}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 inline-flex items-center gap-1 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Leeren
            </button>
          </div>

          {recentTerms.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Keine Suchbegriffe gespeichert.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {recentTerms.map((t) => (
                <button
                  key={t}
                  onClick={() => onSearch(t)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* RECENT FILES */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Zuletzt geöffnete Dateien
            </h2>
            <button
              onClick={clearFiles}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 inline-flex items-center gap-1 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Leeren
            </button>
          </div>

          {recentFiles.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Noch keine Dateien geöffnet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentFiles.map((f) => {
                const fileType = f.fileType?.toLowerCase() ?? "";

                const getFileTypeBadge = () => {
                  if (fileType === "pdf")
                    return (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200 font-semibold">
                        PDF
                      </span>
                    );
                  if (["excel", "xlsx", "xls"].includes(fileType))
                    return (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200 font-semibold">
                        Excel
                      </span>
                    );
                  if (["podcast", "mp3", "mp4"].includes(fileType))
                    return (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 font-semibold">
                        Podcast
                      </span>
                    );
                  if (fileType === "video")
                    return (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 font-semibold">
                        Video
                      </span>
                    );

                  return null;
                };

                return (
                  <li key={f.id} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {f.name}
                          </div>

                          {getFileTypeBadge()}
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {f.moduleName ?? "Unbekannter Kurs"} •{" "}
                          <Clock className="inline h-3.5 w-3.5 mr-1" />
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
                      className="text-xs inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 ml-2 transition-colors"
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
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Suchergebnisse
            </h2>
          </div>

          {results.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Keine Treffer.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {results.map((f) => (
                <li key={f.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {f.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {f.moduleName} • {f.size}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => saveRecentFile(f)}
                    className="text-xs inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Merken
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
