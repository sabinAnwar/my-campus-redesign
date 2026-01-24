import React from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  Upload,
  ChevronRight,
  Info,
  X,
  MapPin,
  FileCheck,
} from "lucide-react";

import { formatDate, translateValue } from "~/hooks/useTasks";
import type { TaskUISubmission, TaskLoaderSubmission } from "~/types/tasks";

//// TYPES
//
interface TasksHeaderProps {
  title: string;
  subtitle: string;
  language: "de" | "en";
}

interface SubmissionCardProps {
  submission: TaskUISubmission;
  language: "de" | "en";
  translations: any;
  onManage: () => void;
}

interface ExamCardProps {
  exam: {
    id: number;
    title: string;
    course: string;
    type: string;
    date: string;
    duration: string;
    location: string;
    daysUntilExam: number;
  };
  translations: any;
}

interface UploadModalProps {
  isOpen: boolean;
  accepted: { honor: boolean; privacy: boolean };
  uploadedFile: File | null;
  translations: any;
  onClose: () => void;
  onAcceptChange: (field: "honor" | "privacy", value: boolean) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

//// COMPONENTS
//
export function TasksHeader({
  title,
  subtitle,
  language,
}: TasksHeaderProps) {
  return (
    <header className="mb-8 sm:mb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white shadow-sm shrink-0">
              <Upload size={language === "de" ? 24 : 28} className="sm:size-[28px]" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight break-words [hyphens:auto]">
              {title}
            </h1>
          </div>
          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border px-5 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 shadow-xl w-fit">
          <div className="p-1.5 sm:p-2 bg-iu-blue/20 dark:bg-iu-blue rounded-lg sm:rounded-xl shrink-0">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-iu-blue dark:text-white" />
          </div>
          <span className="text-[10px] sm:text-sm font-bold text-foreground uppercase tracking-widest leading-none">
            {new Date().toLocaleDateString(
              language === "de" ? "de-DE" : "en-US",
              { day: "2-digit", month: "long", year: "numeric" }
            )}
          </span>
        </div>
      </div>
    </header>
  );
}

export function SubmissionCard({
  submission,
  language,
  translations: t,
  onManage,
}: SubmissionCardProps) {
  return (
    <div className="group bg-card/60 border border-border sm:rounded-[2.5rem] rounded-2xl p-5 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 hover:border-iu-orange/30 hover:bg-card transition-all shadow-xl">
      <div className="flex items-start gap-4 sm:gap-6 min-w-0">
        <div className="mt-1 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-iu-orange/10 dark:bg-iu-orange border border-iu-orange/20 dark:border-iu-orange text-iu-orange dark:text-white shadow-lg shrink-0">
          <Clock className="h-5 w-5 sm:h-7 sm:w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap sm:flex-nowrap">
            <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-iu-orange dark:group-hover:text-white transition-colors break-words [hyphens:auto] min-w-0">
              {translateValue(submission.title, "titles", t)}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="sm:hidden px-3 py-1 rounded-full bg-iu-orange/10 border border-iu-orange/20 text-iu-orange text-[9px] font-bold uppercase tracking-widest">
                {submission.status === "pending" ? t.pending : t.submitted}
              </span>
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-iu-orange/40 dark:text-white cursor-pointer hover:text-iu-orange dark:hover:text-white transition-colors" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-6">
            <span className="hidden sm:inline-block px-5 py-2 rounded-full bg-iu-orange/10 dark:bg-iu-orange border border-iu-orange/20 dark:border-iu-orange text-iu-orange dark:text-white text-xs font-bold uppercase tracking-widest">
              {submission.status === "pending" ? t.pending : t.submitted}
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground text-xs sm:text-sm font-semibold shrink-0">
              <Calendar className="h-4 sm:h-4.5 w-4 sm:w-4.5 text-iu-orange/60 dark:text-white" />
              <span>{formatDate(submission.dueDateIso, language)}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground text-xs sm:text-sm font-semibold min-w-0">
              <BookOpen className="h-4 sm:h-4.5 w-4 sm:w-4.5 text-iu-orange/60 dark:text-white shrink-0" />
              <span className="truncate">{submission.professor || "Prüfungsamt"}</span>
            </div>
          </div>
          {submission.status === "submitted" && submission.submittedFileName && (
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-muted/40 border border-border/50 px-3 py-2 w-fit">
              <div className="p-2 rounded-lg bg-iu-blue text-white">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-foreground">
                <div className="truncate max-w-[220px]">
                  {submission.submittedFileName}
                </div>
                {typeof submission.submittedFileSize === "number" && (
                  <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                    {(submission.submittedFileSize / 1024 / 1024).toFixed(2)} MB
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={submission.status === "submitted" ? undefined : onManage}
        disabled={submission.status === "submitted"}
        className={`px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 sm:gap-3 group/btn shadow-xl active:scale-95 w-full lg:w-auto ${
          submission.status === "submitted"
            ? "bg-muted/50 text-muted-foreground border border-border/50 cursor-not-allowed"
            : "bg-foreground text-background hover:opacity-90"
        }`}
      >
        {submission.status === "submitted" ? t.submitted : t.manageSubmission}
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

export function ExamCard({ exam, translations: t }: ExamCardProps) {
  return (
    <div className="group bg-card/60 border border-border sm:rounded-[2.5rem] rounded-2xl p-6 sm:p-8 hover:border-iu-blue/30 hover:bg-card transition-all shadow-xl flex flex-col justify-between gap-6">
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white border border-iu-blue/20 dark:border-iu-blue shadow-lg shrink-0">
            <BookOpen className="h-5 w-5 sm:h-7 sm:w-7" />
          </div>
          <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-iu-blue/10 dark:bg-iu-blue border border-iu-blue/20 dark:border-iu-blue text-iu-blue dark:text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
            {exam.type}
          </span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 sm:mb-6 group-hover:text-iu-blue dark:group-hover:text-white transition-colors break-words [hyphens:auto]">
          {exam.title}
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2.5 sm:gap-3 text-muted-foreground text-xs sm:text-sm font-semibold">
            <Calendar className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-iu-blue/60 dark:text-white shrink-0" />
            <span>{exam.date}</span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 text-muted-foreground text-xs sm:text-sm font-semibold">
            <Clock className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-iu-blue/60 dark:text-white shrink-0" />
            <span>{exam.duration}</span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 text-muted-foreground text-xs sm:text-sm font-semibold min-w-0">
            <MapPin className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-iu-blue/60 dark:text-white shrink-0" />
            <span className="truncate">{exam.location}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-border/50 gap-4">
        <span
          className={`text-[10px] sm:text-sm font-black uppercase tracking-widest leading-tight ${
            exam.daysUntilExam <= 3 ? "text-iu-red" : "text-muted-foreground"
          }`}
        >
          {t.daysUntilExam(exam.daysUntilExam)}
        </span>
        <button className="bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs hover:bg-iu-blue hover:text-white transition-all flex items-center gap-1.5 sm:gap-2 uppercase tracking-widest shrink-0">
          Details <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
}

export function UploadModal({
  isOpen,
  accepted,
  uploadedFile,
  translations: t,
  onClose,
  onAcceptChange,
  onFileChange,
  onSubmit,
}: UploadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 sm:p-6">
      <div className="bg-card sm:rounded-[2.5rem] rounded-2xl shadow-3xl p-6 sm:p-10 w-full max-w-xl relative animate-in fade-in zoom-in-95 duration-300 border border-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-iu-blue flex items-center justify-center text-white font-bold text-lg sm:text-2xl shadow-lg shadow-iu-blue/20 shrink-0">
              IU
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {t.modalTitle}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                {t.modalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 sm:p-3 rounded-xl hover:bg-muted text-muted-foreground transition-colors hover:text-foreground shrink-0"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Checkboxes */}
        <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
          <CheckboxField
            checked={accepted.honor}
            onChange={(checked) => onAcceptChange("honor", checked)}
            label={t.honor}
          />
          <CheckboxField
            checked={accepted.privacy}
            onChange={(checked) => onAcceptChange("privacy", checked)}
            label={t.privacy}
          />
        </div>

        {/* Upload Area */}
        <UploadArea
          uploadedFile={uploadedFile}
          onFileChange={onFileChange}
          translations={t}
        />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10">
          <button
            onClick={onClose}
            className="order-2 sm:order-1 px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold bg-muted text-foreground border border-border hover:bg-muted/80 transition-all text-sm sm:text-base"
          >
            {t.cancel}
          </button>
          <button
            onClick={onSubmit}
            disabled={!accepted.honor || !accepted.privacy || !uploadedFile}
            className="order-1 sm:order-2 flex-[2] px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold bg-foreground text-background hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl text-sm sm:text-base"
          >
            {t.upload}
          </button>
        </div>
      </div>
    </div>
  );
}

//// HELPER COMPONENTS
//
function CheckboxField({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-start gap-4 cursor-pointer group">
      <div className="relative flex items-center mt-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 rounded-lg border-border bg-muted text-iu-blue focus:ring-iu-blue transition-all"
        />
      </div>
      <span className="text-sm text-muted-foreground font-medium leading-relaxed group-hover:text-foreground transition-colors">
        {label}
      </span>
    </label>
  );
}

function UploadArea({
  uploadedFile,
  onFileChange,
  translations: t,
}: {
  uploadedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  translations: any;
}) {
  return (
    <div
      className={`border-2 border-dashed sm:rounded-[2rem] rounded-xl p-6 sm:p-10 text-center transition-all duration-300 ${
        uploadedFile
          ? "border-iu-blue bg-iu-blue/5 shadow-inner"
          : "border-border hover:border-iu-blue/30 hover:bg-muted/50"
      }`}
    >
      {!uploadedFile ? (
        <div className="flex flex-col items-center">
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white mb-3 sm:mb-4">
            <Upload className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <p className="text-base sm:text-lg font-bold text-foreground mb-1.5 sm:mb-2">
            {t.dropHere}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 font-medium">
            {t.orDrag}
          </p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={onFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-iu-blue text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold shadow-xl shadow-iu-blue/20 hover:opacity-90 transition-all active:scale-95 text-sm sm:text-base"
          >
            {t.chooseFile}
          </label>
        </div>
      ) : (
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white mb-3 sm:mb-4 shadow-lg">
            <FileCheck className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <p className="text-base sm:text-lg font-bold text-foreground mb-1 break-all">
            {uploadedFile.name}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-4 sm:mb-6">
            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <div className="w-full bg-black/10 dark:bg-black rounded-full h-1 sm:h-1.5 overflow-hidden">
            <div className="h-full bg-iu-blue w-full animate-progress" />
          </div>
        </div>
      )}
    </div>
  );
}

//// SECTION COMPONENTS
//
export function SectionHeader({
  title,
  color,
}: {
  title: string;
  color: "orange" | "blue";
}) {
  const colorClass = color === "orange" ? "bg-iu-orange" : "bg-iu-blue";
  
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className={`h-8 w-1 ${colorClass} rounded-full`} />
      <h2 className="text-xl font-black text-foreground">{title}</h2>
    </div>
  );
}
