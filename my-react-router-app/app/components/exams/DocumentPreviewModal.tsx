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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-5xl h-[90vh] rounded-[2.5rem] border border-border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-8 border-b border-border bg-background/40">
          <div className="flex items-center gap-6">
            <div
              className={`p-4 rounded-2xl ${selectedDocument.bgColor || "bg-muted"} ${selectedDocument.color || "text-foreground"} shadow-xl transition-transform hover:scale-110`}
            >
              {selectedDocument.icon ? (
                <selectedDocument.icon className="w-8 h-8" />
              ) : (
                <FileText className="w-8 h-8" />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground line-clamp-1 tracking-tight">
                {selectedDocument.title}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1 rounded-lg border border-border">
                  {selectedDocument.type}
                </span>
                <span className="text-xs text-muted-foreground font-bold opacity-60 uppercase tracking-widest">
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
              className="hidden md:flex items-center gap-3 px-8 py-4 text-sm font-bold bg-foreground text-background rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-xl"
            >
              <Download className="w-5 h-5" />
              {t.download}
            </button>
            <button
              onClick={onClose}
              className="p-4 hover:bg-muted rounded-2xl transition-all text-muted-foreground hover:text-iu-red shadow-lg border border-border"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-12 bg-background/20 scrollbar-thin scrollbar-thumb-border">
          <div className="max-w-3xl mx-auto bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-12 md:p-20 shadow-2xl text-foreground leading-relaxed whitespace-pre-wrap text-lg font-medium">
            {selectedDocument.content}
          </div>
        </div>
      </div>
    </div>
  );
}
