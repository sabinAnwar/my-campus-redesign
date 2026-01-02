import { X, FileText, ExternalLink, Upload, Send } from "lucide-react";
import type { FormDefinition } from "~/types/antragsverwaltung";

interface ApplicationFormModalProps {
  t: any;
  formDef: FormDefinition;
  formData: Record<string, any>;
  onClose: () => void;
  onInputChange: (name: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  language: string;
}

export function ApplicationFormModal({
  t,
  formDef,
  formData,
  onClose,
  onInputChange,
  onSubmit,
  isSubmitting,
  language,
}: ApplicationFormModalProps) {
  const handleOpenMicrosoftForm = (formUrl: string) => {
    window.open(formUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-card border border-border max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] overflow-hidden rounded-[2rem]">
        {/* Modal Header */}
        <div className="p-8 border-b border-border flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-iu-blue font-bold text-xs uppercase tracking-wider">
              <FileText size={14} />
              {t.task}
            </div>
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              {formDef.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {formDef.microsoftFormUrl && (
            <div className="mb-10 p-6 bg-iu-blue/5 border border-iu-blue/10 rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">
                  Microsoft Forms
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.msFormsAvailable}
                </p>
              </div>
              <button
                onClick={() => handleOpenMicrosoftForm(formDef.microsoftFormUrl!)}
                className="px-4 py-2 bg-iu-blue text-white text-xs font-bold rounded-xl hover:bg-iu-blue transition-colors flex items-center gap-2 shrink-0"
              >
                <ExternalLink size={14} />
                {t.open}
              </button>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {formDef.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-semibold text-foreground ml-1">
                  {field.label}{" "}
                  {field.required && <span className="text-rose-500">*</span>}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    required={field.required}
                    value={formData[field.name] || ""}
                    onChange={(e) => onInputChange(field.name, e.target.value)}
                    rows={4}
                    className="w-full bg-muted/30 border border-border rounded-2xl p-4 text-sm focus:outline-none focus:border-iu-blue/50 focus:ring-4 focus:ring-iu-blue/10 transition-all resize-none shadow-inner"
                  />
                ) : field.type === "file" ? (
                  <div className="relative">
                    <input
                      type="file"
                      required={field.required}
                      onChange={(e) =>
                        onInputChange(field.name, e.target.files?.[0])
                      }
                      className="w-full opacity-0 absolute inset-0 cursor-pointer z-10"
                    />
                    <div className="w-full bg-muted/30 border border-border border-dashed rounded-2xl p-8 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {t.uploadFile}
                      </span>
                    </div>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    required={field.required}
                    value={formData[field.name] || ""}
                    onChange={(e) => onInputChange(field.name, e.target.value)}
                    className="w-full bg-muted/30 border border-border rounded-2xl p-4 text-sm focus:outline-none focus:border-iu-blue/50 focus:ring-4 focus:ring-iu-blue/10 transition-all shadow-inner"
                  />
                )}
              </div>
            ))}

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 text-sm font-bold hover:bg-muted rounded-2xl transition-all"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-4 bg-iu-blue text-white text-sm font-bold rounded-2xl hover:bg-iu-blue transition-all flex items-center justify-center gap-2 shadow-lg shadow-iu-blue/20"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    {t.submitApplication}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
