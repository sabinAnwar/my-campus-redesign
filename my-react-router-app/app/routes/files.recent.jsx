import React, { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import { Search, Clock, File as FileIcon, Trash2, ExternalLink, FolderOpen } from "lucide-react";
import { getRecentFiles, clearRecentFiles, saveRecentFile as saveRecentFileLib } from "../lib/recentFiles";

export const loader = async () => null;

// Sample data (aligned with files.jsx)
const MODULES = [
  {
    id: 1,
    name: "Webentwicklung",
    files: [
      { id: 1, name: "HTML_Basics.pdf", size: "2.5 MB", date: "2025-10-15" },
      { id: 2, name: "CSS_Advanced.pdf", size: "3.1 MB", date: "2025-10-18" },
      { id: 3, name: "JavaScript_Tutorial.zip", size: "15 MB", date: "2025-10-20" },
    ],
  },
  {
    id: 2,
    name: "Datenbankdesign",
    files: [
      { id: 4, name: "SQL_Queries.pdf", size: "1.8 MB", date: "2025-10-12" },
      { id: 5, name: "Normalisierung.docx", size: "0.9 MB", date: "2025-10-16" },
    ],
  },
  {
    id: 3,
    name: "Cloud Computing",
    files: [
      { id: 6, name: "AWS_Guide.pdf", size: "4.2 MB", date: "2025-10-14" },
      { id: 7, name: "Docker_Examples.tar.gz", size: "8.5 MB", date: "2025-10-19" },
    ],
  },
];

const FILES = MODULES.flatMap((m) => m.files.map((f) => ({ ...f, moduleId: m.id, moduleName: m.name })));

const LS_KEYS = {
  recentTerms: "recentFileSearchTerms",
  recentFiles: "recentFilesList",
};

export default function RecentFiles() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [recentTerms, setRecentTerms] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const t = JSON.parse(localStorage.getItem(LS_KEYS.recentTerms) || "[]");
        setRecentTerms(Array.isArray(t) ? t : []);
        // Use utility function to get recent files
        const files = getRecentFiles();
        setRecentFiles(files);
      } catch {
        // ignore
      }
    };
    
    loadData();
    
    // Refresh data when storage changes (e.g., from another tab)
    const handleStorageChange = (e) => {
      if (e.key === LS_KEYS.recentFiles || e.key === LS_KEYS.recentTerms) {
        loadData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveTerm = (term) => {
    if (!term) return;
    const next = [term, ...recentTerms.filter((t) => t !== term)].slice(0, 10);
    setRecentTerms(next);
    try { localStorage.setItem(LS_KEYS.recentTerms, JSON.stringify(next)); } catch {}
  };

  const saveRecentFile = (file) => {
    // Use the library function to save properly
    const saved = saveRecentFileLib(
      {
        id: file.id,
        name: file.name,
        type: file.fileType || file.type,
        url: file.url || null,
      },
      file.moduleName || file.moduleName,
      file.studiengang || null
    );
    // Update local state
    setRecentFiles(saved);
  };

  const onSearch = (term) => {
    const t = (term ?? q).trim();
    if (!t) { setResults([]); return; }
    const lower = t.toLowerCase();
    const filtered = FILES.filter((f) => f.name.toLowerCase().includes(lower));
    setResults(filtered);
    saveTerm(t);
  };

  const clearTerms = () => { setRecentTerms([]); try { localStorage.setItem(LS_KEYS.recentTerms, "[]"); } catch {} };
  const clearFiles = () => { 
    clearRecentFiles(); 
    setRecentFiles([]); 
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-[28px] font-semibold text-slate-900 mb-6">Zuletzt gesuchte Dateien</h1>

        {/* Search bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">
          <div className="flex gap-3 items-center">
            <Search className="h-5 w-5 text-slate-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              placeholder="Dateiname suchen…"
              className="flex-1 outline-none text-slate-900 placeholder-slate-500"
            />
            <button onClick={() => onSearch()} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold">Suchen</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent searches */}
          <section className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700">Letzte Suchbegriffe</h2>
              <button onClick={clearTerms} className="text-xs text-slate-500 hover:text-slate-700 inline-flex items-center gap-1"><Trash2 className="h-3.5 w-3.5"/>Leeren</button>
            </div>
            {recentTerms.length === 0 ? (
              <p className="text-sm text-slate-500">Keine Suchbegriffe gespeichert.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {recentTerms.map((t) => (
                  <button key={t} onClick={() => onSearch(t)} className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-sm font-semibold">
                    {t}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Recent files */}
          <section className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700">Zuletzt geöffnete Dateien</h2>
              <button onClick={clearFiles} className="text-xs text-slate-500 hover:text-slate-700 inline-flex items-center gap-1"><Trash2 className="h-3.5 w-3.5"/>Leeren</button>
            </div>
            {recentFiles.length === 0 ? (
              <p className="text-sm text-slate-500">Noch keine Dateien geöffnet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentFiles.map((f) => {
                  // Get file type icon/badge
                  const getFileTypeBadge = () => {
                    const fileType = f.fileType?.toLowerCase();
                    if (fileType === 'pdf') {
                      return <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-semibold">PDF</span>;
                    } else if (fileType === 'excel' || fileType === 'xlsx' || fileType === 'xls') {
                      return <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-semibold">Excel</span>;
                    } else if (fileType === 'podcast' || fileType === 'mp3' || fileType === 'mp4') {
                      return <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-semibold">Podcast</span>;
                    } else if (fileType === 'video') {
                      return <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">Video</span>;
                    }
                    return null;
                  };
                  
                  return (
                    <li key={f.id} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileIcon className="h-4 w-4 text-slate-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="text-sm font-semibold text-slate-900 truncate">{f.name}</div>
                            {getFileTypeBadge()}
                          </div>
                          <div className="text-xs text-slate-500">
                            {f.moduleName || 'Unbekannter Kurs'} • <Clock className="inline h-3.5 w-3.5 mr-1" /> {new Date(f.at).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (f.url) {
                            window.open(f.url, "_blank", "noopener,noreferrer");
                            // Update the file's timestamp when reopened
                            const updatedFiles = recentFiles.map(file =>
                              file.id === f.id ? { ...file, at: Date.now() } : file
                            );
                            setRecentFiles(updatedFiles);
                            try {
                              localStorage.setItem(LS_KEYS.recentFiles, JSON.stringify(updatedFiles));
                            } catch {}
                          } else {
                            // Navigate to courses page if no URL
                            window.location.href = "/courses";
                          }
                        }}
                        className="text-xs inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 ml-2 flex-shrink-0"
                      >
                        <ExternalLink className="h-3.5 w-3.5"/>Öffnen
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Search results */}
          <section className="bg-white border border-slate-200 rounded-2xl p-4 lg:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <FolderOpen className="h-4 w-4 text-slate-600" />
              <h2 className="text-sm font-semibold text-slate-700">Suchergebnisse</h2>
            </div>
            {results.length === 0 ? (
              <p className="text-sm text-slate-500">Keine Treffer.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {results.map((f) => (
                  <li key={f.id} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileIcon className="h-4 w-4 text-slate-600" />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{f.name}</div>
                        <div className="text-xs text-slate-500">{f.moduleName} • {f.size}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        saveRecentFile(f);
                      }} 
                      className="text-xs inline-flex items-center gap-1 text-slate-600 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
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
    </AppShell>
  );
}
