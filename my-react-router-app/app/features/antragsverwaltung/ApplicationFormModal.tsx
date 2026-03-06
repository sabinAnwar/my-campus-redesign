import { useEffect } from "react";
import { X, FileText, ExternalLink } from "lucide-react";
import type { FormDefinition } from "~/types/antragsverwaltung";
import { useFocusTrap } from "~/hooks/useFocusTrap";

interface ApplicationFormModalProps {
  t: any;
  formDef: FormDefinition;
  onClose: () => void;
  onStarted: () => void;
  language: string;
}

export function ApplicationFormModal({
  t,
  formDef,
  onClose,
  onStarted,
  language,
}: ApplicationFormModalProps) {
  const trapRef = useFocusTrap(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleOpenMicrosoftForm = (formUrl: string) => {
    onStarted();
    // Remove embed=true for direct navigation
    const directUrl = formUrl.replace("embed=true", "").replace(/[&?]$/, "");
    window.open(directUrl, "_blank", "noopener,noreferrer");
  };

  // Check if URL has embed=true parameter (embedded iframe form)
  const isEmbeddedForm = formDef.microsoftFormUrl?.includes("embed=true");

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[100] flex items-center justify-center sm:p-4 p-0 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`bg-card border border-border w-full sm:shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col sm:max-h-[90vh] max-h-screen h-full sm:h-auto overflow-hidden sm:rounded-[2rem] rounded-none ${isEmbeddedForm ? "sm:max-w-4xl" : "sm:max-w-xl"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sm:p-8 p-6 border-b border-border flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-foreground font-black text-xs uppercase tracking-wider">
              <FileText size={14} className="text-iu-blue" />
              {t.task}
            </div>
            <h3
              id="modal-title"
              className="text-xl sm:text-2xl font-black text-foreground tracking-tight"
            >
              {formDef.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 hover:bg-muted rounded-full transition-colors shrink-0 text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div
          className={`flex-1 sm:p-8 p-4 custom-scrollbar flex flex-col min-h-0 ${isEmbeddedForm ? "overflow-hidden" : "overflow-y-auto"}`}
        >
          {formDef.microsoftFormUrl ? (
            isEmbeddedForm ? (
              // Always show button to open form directly (iframe login doesn't work reliably)
              <div className="space-y-6">
                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border border-border rounded-3xl flex flex-col items-center text-center gap-6">
                  <div className="w-16 h-16 bg-iu-blue/10 rounded-2xl flex items-center justify-center text-iu-blue">
                    <ExternalLink size={32} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-black text-foreground">
                      Microsoft Forms
                    </p>
                    <p className="text-sm text-foreground font-bold max-w-[300px] mx-auto">
                      {language === "de"
                        ? "Das Formular wird in einem neuen Tab geöffnet, damit Sie sich mit Ihrem Microsoft-Konto anmelden können."
                        : "The form will open in a new tab so you can sign in with your Microsoft account."}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleOpenMicrosoftForm(formDef.microsoftFormUrl!)
                    }
                    className="w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    <ExternalLink size={20} />
                    {language === "de" ? "Formular öffnen" : "Open Form"}
                  </button>
                </div>

                <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-800 dark:text-amber-200 font-bold leading-relaxed text-center">
                    {language === "de"
                      ? "Tipp: Nach dem Öffnen melden Sie sich mit Ihrem Microsoft-Konto an und füllen das Formular aus. Ihr Antragsstatus wird automatisch aktualisiert."
                      : "Tip: After opening, sign in with your Microsoft account and complete the form. Your application status will be updated automatically."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border border-border rounded-3xl flex flex-col items-center text-center gap-6">
                  <div className="w-16 h-16 bg-iu-blue/10 rounded-2xl flex items-center justify-center text-iu-blue">
                    <ExternalLink size={32} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-black text-foreground">
                      Microsoft Forms
                    </p>
                    <p className="text-sm text-foreground font-bold max-w-[300px] mx-auto">
                      {t.msFormsAvailable}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleOpenMicrosoftForm(formDef.microsoftFormUrl!)
                    }
                    className="w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    <ExternalLink size={20} />
                    {t.open}
                  </button>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-border">
                  <p className="text-xs text-foreground font-bold leading-relaxed text-center">
                    {language === "de"
                      ? "Hinweis: Sie werden zu Microsoft Forms weitergeleitet, um Ihren Antrag sicher abzuschließen. Nach der Übermittlung wird Ihr Status automatisch in unserem System aktualisiert."
                      : "Note: You will be redirected to Microsoft Forms to securely complete your application. After submission, your status will be automatically updated in our system."}
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mx-auto">
                <X size={24} />
              </div>
              <p className="text-foreground font-black">
                Für diesen Antrag ist aktuell keine Online-Einreichung
                verfügbar.
              </p>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={onClose}
              className="w-full py-4 text-sm font-black text-foreground hover:bg-muted rounded-2xl transition-all border border-transparent hover:border-border"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
