import { CheckCircle, FileText, Upload } from "lucide-react";

interface UploadModalProps {
  language: string;
  showModal: boolean;
  selectedSubmission: any;
  accepted: { honor: boolean; privacy: boolean };
  uploadedFile: File | null;
  onClose: () => void;
  onAcceptChange: (field: "honor" | "privacy", checked: boolean) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export function UploadModal({
  language,
  showModal,
  selectedSubmission,
  accepted,
  uploadedFile,
  onClose,
  onAcceptChange,
  onFileChange,
  onSubmit,
}: UploadModalProps) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-background/60 dark:bg-black/60 backdrop-blur-xl flex items-center justify-center z-[100] animate-in fade-in duration-300 p-2 sm:p-4">
      <div className="bg-card/90 backdrop-blur-2xl rounded-xl sm:rounded-2xl md:rounded-[3rem] shadow-2xl p-4 sm:p-6 md:p-10 w-full max-w-2xl relative animate-in zoom-in-95 duration-300 border border-border/50 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-iu-blue/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32" />
        <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-iu-purple/10 rounded-full blur-3xl -ml-12 sm:-ml-24 -mb-12 sm:-mb-24" />

        <div className="relative flex items-center gap-6 mb-10">
          <div className="h-20 w-20 rounded-[2rem] bg-iu-blue text-white flex items-center justify-center text-3xl font-black shadow-2xl shadow-iu-blue/30">
            <Upload size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              {language === "de" ? "Abgabe verwalten" : "Manage submission"}
            </h2>
            <p className="text-lg text-muted-foreground font-medium mt-1">
              {selectedSubmission?.title}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-10 relative">
          <label className="flex items-start gap-4 p-5 rounded-2xl bg-muted/40 border border-border/50 cursor-pointer hover:bg-iu-blue/5 hover:border-iu-blue/20 transition-all group">
            <input
              type="checkbox"
              checked={accepted.honor}
              onChange={(e) => onAcceptChange("honor", e.target.checked)}
              className="mt-1 w-5 h-5 accent-iu-blue"
            />
            <span className="text-[15px] font-black text-muted-foreground group-hover:text-foreground transition-colors">
              {language === "de"
                ? "Ich bestätige die Eidesstattliche Erklärung."
                : "I confirm the honor statement."}
            </span>
          </label>

          <label className="flex items-start gap-4 p-5 rounded-2xl bg-muted/40 border border-border/50 cursor-pointer hover:bg-iu-blue/5 hover:border-iu-blue/20 transition-all group">
            <input
              type="checkbox"
              checked={accepted.privacy}
              onChange={(e) => onAcceptChange("privacy", e.target.checked)}
              className="mt-1 w-5 h-5 accent-iu-blue"
            />
            <span className="text-[15px] font-black text-muted-foreground group-hover:text-foreground transition-colors">
              {language === "de"
                ? "Ich akzeptiere den Datenschutz für den Upload."
                : "I accept the privacy terms for upload."}
            </span>
          </label>
        </div>

        <div
          className={`border-4 border-dashed rounded-[2rem] p-12 text-center transition-all relative group/drop ${
            uploadedFile
              ? "border-iu-blue/50 bg-iu-blue/5 shadow-inner"
              : "border-border hover:border-iu-blue/50 hover:bg-iu-blue/5"
          }`}
        >
          {!uploadedFile && (
            <>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-5 rounded-[1.5rem] bg-muted group-hover/drop:bg-iu-blue/10 transition-colors">
                  <Upload className="h-10 w-10 text-muted-foreground group-hover/drop:text-iu-blue transition-colors" />
                </div>
                <p className="text-lg font-black text-muted-foreground group-hover/drop:text-foreground transition-all">
                  {language === "de"
                    ? "Datei hier ablegen oder klicken"
                    : "Drop file here or click"}
                </p>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={onFileChange}
                className="hidden"
                id="course-file-upload"
              />
              <label
                htmlFor="course-file-upload"
                className="cursor-pointer inline-block mt-8 bg-iu-blue text-white text-sm px-10 py-4 rounded-2xl font-black shadow-xl shadow-iu-blue/25 hover:bg-iu-blue transition-all active:scale-95"
              >
                {language === "de" ? "Datei auswählen" : "Choose file"}
              </label>
            </>
          )}

          {uploadedFile && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-5 bg-card border border-iu-blue/30 p-5 rounded-[2rem] shadow-2xl">
                  <div className="p-3 bg-iu-blue/10 text-iu-blue rounded-xl">
                    <FileText size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-foreground">
                      {uploadedFile.name}
                    </p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full bg-muted rounded-full h-2.5 max-w-sm mx-auto overflow-hidden border border-border/30">
                <div className="h-full bg-iu-blue shadow-[0_0_15px_rgba(36,94,235,0.5)] progress-bar w-full"></div>
              </div>
              <p className="text-xs font-black text-iu-blue uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <CheckCircle size={14} />
                {language === "de"
                  ? "Scannt auf Plagiate..."
                  : "Scanning for plagiarism..."}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mt-8 pt-8 border-t border-border/40">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-xl font-bold text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            {language === "de" ? "Abbrechen" : "Cancel"}
          </button>
          <button
            onClick={onSubmit}
            disabled={!accepted.honor || !accepted.privacy || !uploadedFile}
            className="flex-1 py-4 bg-iu-blue text-white rounded-xl font-black shadow-xl shadow-iu-blue/25 hover:bg-iu-blue hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {language === "de" ? "Einreichen" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
