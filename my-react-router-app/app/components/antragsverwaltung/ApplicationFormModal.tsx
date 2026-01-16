import { X, FileText, ExternalLink } from "lucide-react";
import type { FormDefinition } from "~/types/antragsverwaltung";

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
  const handleOpenMicrosoftForm = (formUrl: string) => {
    onStarted();
    window.open(formUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[100] flex items-center justify-center sm:p-4 p-0 animate-in fade-in duration-300">
      <div className="bg-card border border-border sm:max-w-xl w-full sm:shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col sm:max-h-[80vh] max-h-screen h-full sm:h-auto overflow-hidden sm:rounded-[2rem] rounded-none">
        {/* Modal Header */}
        <div className="sm:p-8 p-6 border-b border-border flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-iu-blue font-bold text-xs uppercase tracking-wider">
              <FileText size={14} />
              {t.task}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {formDef.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto sm:p-8 p-6 custom-scrollbar">
          {formDef.microsoftFormUrl ? (
            <div className="space-y-6">
              <div className="p-8 bg-iu-blue/5 border border-iu-blue/10 rounded-3xl flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 bg-iu-blue/10 rounded-2xl flex items-center justify-center text-iu-blue">
                  <ExternalLink size={32} />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-foreground">
                    Microsoft Forms
                  </p>
                  <p className="text-sm text-muted-foreground max-w-[300px] mx-auto">
                    {t.msFormsAvailable}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenMicrosoftForm(formDef.microsoftFormUrl!)}
                  className="w-full py-4 bg-iu-blue text-white font-bold rounded-2xl hover:bg-iu-blue transition-all flex items-center justify-center gap-3 shadow-lg shadow-iu-blue/20"
                >
                  <ExternalLink size={20} />
                  {t.open}
                </button>
              </div>
              
              <div className="p-6 bg-muted/30 rounded-2xl border border-border">
                <p className="text-xs text-muted-foreground leading-relaxed text-center">
                  Hinweis: Sie werden zu Microsoft Forms weitergeleitet, um Ihren Antrag sicher abzuschließen. Nach der Übermittlung wird Ihr Status automatisch in unserem System aktualisiert.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mx-auto">
                <X size={24} />
              </div>
              <p className="text-muted-foreground font-medium">
                Für diesen Antrag ist aktuell keine Online-Einreichung verfügbar.
              </p>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={onClose}
              className="w-full py-4 text-sm font-bold hover:bg-muted rounded-2xl transition-all border border-transparent hover:border-border"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
