import { useState, useEffect, useMemo } from "react";
import {
  getRecentFiles,
  clearRecentFiles,
  saveRecentFile as saveRecentFileLib,
} from "~/lib/recentFiles";
import type { ModuleFile, RecentFileEntry } from "~/types/file";

const LS_KEYS = {
  recentTerms: "recentFileSearchTerms",
  recentFiles: "recentFilesList",
};

interface UseRecentFilesParams {
  dbFiles: any[];
}

export function useRecentFiles({ dbFiles }: UseRecentFilesParams) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<ModuleFile[]>([]);
  const [recentTerms, setRecentTerms] = useState<string[]>([]);
  const [recentFiles, setRecentFiles] = useState<RecentFileEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  // Convert database files to ModuleFile format
  const FILES: ModuleFile[] = useMemo(
    () =>
      dbFiles.map((f: any) => ({
        id: f.id,
        name: f.name,
        size: f.size || "Unknown",
        date: f.uploadedAt.toString(),
        moduleName: f.course?.name || f.studiengang?.name || "Unbekannt",
        fileType: f.fileType || undefined,
        url: f.url,
        studiengang: f.studiengang?.name || null,
      })),
    [dbFiles]
  );

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

  const clearAllFiles = () => {
    clearRecentFiles();
    setRecentFiles([]);
  };

  /* FILTER LOGIC */
  const filteredFiles = useMemo(() => {
    return recentFiles.filter((f) => {
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
  }, [recentFiles, activeFilter]);

  return {
    q,
    setQ,
    results,
    recentTerms,
    recentFiles,
    filteredFiles,
    activeFilter,
    setActiveFilter,
    onSearch,
    clearTerms,
    clearAllFiles,
    saveRecentFile,
  };
}
