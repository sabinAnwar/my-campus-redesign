import React from "react";
import {
  Clock,
  File as FileIcon,
  Video,
  Headphones,
  ClipboardCheck,
  FolderOpen,
  ExternalLink,
} from "lucide-react";
import { saveRecentFile as saveRecentFileLib } from "~/utils/recentFiles";
import type { RecentFileEntry } from "~/types/file";

interface RecentFilesListProps {
  t: any;
  language: string;
  filteredFiles: RecentFileEntry[];
}

export function RecentFilesList({
  t,
  language,
  filteredFiles,
}: RecentFilesListProps) {
  if (filteredFiles.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center">
        <div className="bg-neutral-100 dark:bg-neutral-800 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6">
          <FileIcon className="h-7 w-7 sm:h-8 sm:w-8 text-neutral-700" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
          {t.noFilesOpened}
        </h3>
        <p className="text-neutral-700 dark:text-neutral-200 text-sm max-w-sm mx-auto mb-6 sm:mb-8">
          {t.noFilesDesc}
        </p>
        <ul className="text-xs text-neutral-700 dark:text-neutral-200 space-y-2 inline-block text-left">
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
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {filteredFiles.map((f, idx) => {
        const type = f.fileType?.toLowerCase() || "";

        const isVideo = type === "video";
        const isPodcast = type === "podcast";
        const isTest = type === "test" || type === "evaluation";

        return (
          <div
            key={f.id + idx}
            className="group bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-5 sm:p-8 hover:border-iu-blue/30 hover:bg-card transition-all duration-500 shadow-xl relative overflow-hidden"
          >
            {/* Hover background effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-iu-blue/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity -mr-32 -mt-32"></div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 relative z-10">
              {/* Type Icon Container */}
              <div
                className={`p-3 sm:p-4 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-110 shadow-lg border ${
                  isVideo
                    ? "bg-iu-red/10 dark:bg-iu-red border-iu-red/20 dark:border-iu-red text-iu-red dark:text-white"
                    : isPodcast
                      ? "bg-iu-purple/10 dark:bg-iu-purple border-iu-purple/20 dark:border-iu-purple text-iu-purple dark:text-white"
                      : isTest
                        ? "bg-iu-orange/10 dark:bg-iu-orange border-iu-orange/20 dark:border-iu-orange text-iu-orange dark:text-white"
                        : "bg-iu-blue/10 dark:bg-iu-blue border-iu-blue/20 dark:border-iu-blue text-iu-blue dark:text-white"
                }`}
              >
                {isVideo ? (
                  <Video className="h-6 w-6 sm:h-7 sm:w-7" />
                ) : isPodcast ? (
                  <Headphones className="h-6 w-6 sm:h-7 sm:w-7" />
                ) : isTest ? (
                  <ClipboardCheck className="h-6 w-6 sm:h-7 sm:w-7" />
                ) : (
                  <FileIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                )}
              </div>

              {/* Info Container */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-foreground truncate group-hover:text-iu-blue transition-colors">
                    {f.name}
                  </h3>
                  {/* Mediatype Badge */}
                  <span
                    className={`text-[9px] sm:text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${
                      isVideo
                        ? "bg-iu-red/10 dark:bg-iu-red border-iu-red/20 dark:border-iu-red text-iu-red dark:text-white"
                        : isPodcast
                          ? "bg-iu-purple/10 dark:bg-iu-purple border-iu-purple/20 dark:border-iu-purple text-iu-purple dark:text-white"
                          : isTest
                            ? "bg-iu-orange/10 dark:bg-iu-orange border-iu-orange/20 dark:border-iu-orange text-iu-orange dark:text-white"
                            : "bg-iu-blue/10 dark:bg-iu-blue border-iu-blue/20 dark:border-iu-blue text-iu-blue dark:text-white"
                    }`}
                  >
                    {type || "Source"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    <span className="truncate">
                      {f.moduleName || t.unknownCourse}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {new Date(f.at).toLocaleDateString(
                      language === "de" ? "de-DE" : "en-US",
                      {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
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
                    f.studiengang,
                  );
                  if (f.url && f.url !== "#") {
                    window.open(f.url, "_blank", "noopener,noreferrer");
                  } else {
                    window.location.href = "/courses";
                  }
                }}
                className="static sm:absolute sm:right-8 sm:top-1/2 sm:-translate-y-1/2 mt-2 sm:mt-0 p-3 sm:p-4 rounded-2xl bg-muted/50 text-muted-foreground hover:bg-iu-blue hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-iu-blue dark:hover:text-white dark:hover:border-iu-blue transition-all shadow-sm border border-border hover:border-iu-blue opacity-100 sm:opacity-0 group-hover:opacity-100 group-hover:translate-x-0 sm:translate-x-4 duration-300"
              >
                <ExternalLink className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
