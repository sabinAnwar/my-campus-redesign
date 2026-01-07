import React from "react";
import { X, Download, FileText } from "lucide-react";
import { handleDownload } from "~/lib/download";

interface DocumentPreviewModalProps {
  t: any;
  selectedDocument: any;
  onClose: () => void;
}

export function DocumentPreviewModal({
  t,
  selectedDocument,
  onClose,
}: DocumentPreviewModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-5xl h-[90vh] rounded-[2rem] sm:rounded-[2.5rem] border border-border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8 border-b border-border bg-background/40">
          <div className="flex items-center gap-4 sm:gap-6">
            <div
              className={`p-3 sm:p-4 rounded-2xl ${selectedDocument.bgColor || "bg-muted"} ${selectedDocument.color || "text-foreground"} shadow-xl transition-transform hover:scale-110`}
            >
              {selectedDocument.icon ? (
                <selectedDocument.icon className="w-6 h-6 sm:w-8 sm:h-8" />
              ) : (
                <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
              )}
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-foreground line-clamp-1 tracking-tight">
                {selectedDocument.title}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] font-black text-foreground uppercase tracking-widest bg-muted/50 px-3 py-1 rounded-lg border border-border">
                  {selectedDocument.type}
                </span>
                <span className="text-xs text-foreground/80 dark:text-white/80 font-bold uppercase tracking-widest">
                  {t.preview}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                handleDownload(
                  selectedDocument.title,
                  selectedDocument.type,
                  selectedDocument
                )
              }
              className="hidden md:flex items-center gap-3 px-6 lg:px-8 py-3.5 lg:py-4 text-sm font-bold bg-foreground text-background rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-xl"
            >
              <Download className="w-5 h-5" />
              {t.download}
            </button>
          <button
            onClick={onClose}
            className="p-3 sm:p-4 hover:bg-muted rounded-2xl transition-all text-foreground/80 dark:text-white/80 hover:text-iu-red shadow-lg border border-border"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 bg-background/20 scrollbar-thin scrollbar-thumb-border">
          <div className="max-w-3xl mx-auto bg-card/60 backdrop-blur-xl border border-border rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 lg:p-12 shadow-2xl text-foreground leading-relaxed whitespace-pre-wrap text-sm sm:text-base lg:text-lg font-medium">
            {selectedDocument.content}
          </div>
        </div>
      </div>
    </div>
  );
}
