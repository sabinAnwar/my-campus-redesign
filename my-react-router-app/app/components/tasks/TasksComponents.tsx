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

// ============================================================================
// TYPES
// ============================================================================

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

// ============================================================================
// COMPONENTS
// ============================================================================

export function TasksHeader({
  title,
  subtitle,
  language,
}: TasksHeaderProps) {
  return (
    <header className="mb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
              <Upload size={28} />
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">
              {title}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border px-6 py-4 rounded-3xl flex items-center gap-4 shadow-xl">
          <div className="p-2 bg-iu-blue/20 rounded-xl">
            <Calendar className="h-6 w-6 text-iu-blue" />
          </div>
          <span className="text-sm font-bold text-foreground uppercase tracking-widest">
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
    <div className="group bg-card/60 border border-border rounded-[2.5rem] p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-iu-orange/30 hover:bg-card transition-all shadow-xl">
      <div className="flex items-start gap-6">
        <div className="mt-1 p-3.5 rounded-2xl bg-iu-orange/10 border border-iu-orange/20 text-iu-orange shadow-lg">
          <Clock className="h-7 w-7" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-bold text-foreground truncate group-hover:text-iu-orange transition-colors">
              {translateValue(submission.title, "titles", t)}
            </h3>
            <Info className="h-5 w-5 text-iu-orange/40 cursor-pointer hover:text-iu-orange transition-colors" />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="px-5 py-2 rounded-full bg-iu-orange/10 border border-iu-orange/20 text-iu-orange text-xs font-bold uppercase tracking-widest">
              {submission.status === "pending" ? t.pending : t.submitted}
            </span>
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold">
              <Calendar className="h-4.5 w-4.5 text-iu-orange/60" />
              <span>{formatDate(submission.dueDateIso, language)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold">
              <BookOpen className="h-4.5 w-4.5 text-iu-orange/60" />
              <span>{submission.professor || "Prüfungsamt"}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onManage}
        className="bg-foreground text-background px-10 py-4 rounded-2xl font-bold text-base hover:opacity-90 transition-all flex items-center justify-center gap-3 group/btn shadow-xl active:scale-95 whitespace-nowrap"
      >
        {t.manageSubmission}
        <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

export function ExamCard({ exam, translations: t }: ExamCardProps) {
  return (
    <div className="group bg-card/60 border border-border rounded-[2.5rem] p-8 hover:border-iu-blue/30 hover:bg-card transition-all shadow-xl flex flex-col justify-between gap-6">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="p-3.5 rounded-2xl bg-iu-blue/10 text-iu-blue border border-iu-blue/20 shadow-lg">
            <BookOpen className="h-7 w-7" />
          </div>
          <span className="px-4 py-1.5 rounded-full bg-iu-blue/10 border border-iu-blue/20 text-iu-blue text-[10px] font-black uppercase tracking-widest">
            {exam.type}
          </span>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-6 group-hover:text-iu-blue transition-colors truncate">
          {exam.title}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-muted-foreground text-sm font-semibold">
            <Calendar className="h-5 w-5 text-iu-blue/60" />
            <span>{exam.date}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground text-sm font-semibold">
            <Clock className="h-5 w-5 text-iu-blue/60" />
            <span>{exam.duration}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground text-sm font-semibold">
            <MapPin className="h-5 w-5 text-iu-blue/60" />
            <span>{exam.location}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-6 border-t border-border/50">
        <span
          className={`text-sm font-black uppercase tracking-widest ${
            exam.daysUntilExam <= 3 ? "text-iu-red" : "text-muted-foreground"
          }`}
        >
          {t.daysUntilExam(exam.daysUntilExam)}
        </span>
        <button className="bg-iu-blue/10 text-iu-blue px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-iu-blue hover:text-white transition-all flex items-center gap-2 uppercase tracking-widest">
          Details <ChevronRight className="h-4 w-4" />
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <div className="bg-card rounded-[2.5rem] shadow-3xl p-10 w-full max-w-xl relative animate-in fade-in zoom-in-95 duration-300 border border-border">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-iu-blue flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-iu-blue/20">
              IU
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                {t.modalTitle}
              </h2>
              <p className="text-muted-foreground font-medium">
                {t.modalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-xl hover:bg-muted text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Checkboxes */}
        <div className="space-y-5 mb-8">
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
        <div className="flex gap-4 mt-10">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl font-bold bg-muted text-foreground border border-border hover:bg-muted/80 transition-all"
          >
            {t.cancel}
          </button>
          <button
            onClick={onSubmit}
            disabled={!accepted.honor || !accepted.privacy || !uploadedFile}
            className="flex-[2] px-6 py-4 rounded-2xl font-bold bg-foreground text-background hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          >
            {t.upload}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

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
      className={`border-2 border-dashed rounded-[2rem] p-10 text-center transition-all duration-300 ${
        uploadedFile
          ? "border-iu-blue bg-iu-blue/5 shadow-inner"
          : "border-border hover:border-iu-blue/30 hover:bg-muted/50"
      }`}
    >
      {!uploadedFile ? (
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-2xl bg-iu-blue/10 text-iu-blue mb-4">
            <Upload className="h-8 w-8" />
          </div>
          <p className="text-lg font-bold text-foreground mb-2">
            {t.dropHere}
          </p>
          <p className="text-sm text-muted-foreground mb-6 font-medium">
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
            className="cursor-pointer bg-iu-blue text-white px-8 py-3 rounded-xl font-bold shadow-xl shadow-iu-blue/20 hover:opacity-90 transition-all active:scale-95"
          >
            {t.chooseFile}
          </label>
        </div>
      ) : (
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
          <div className="p-4 rounded-2xl bg-iu-blue/10 text-iu-blue dark:text-iu-blue mb-4 shadow-lg">
            <FileCheck className="h-8 w-8" />
          </div>
          <p className="text-lg font-bold text-foreground mb-1">
            {uploadedFile.name}
          </p>
          <p className="text-sm text-muted-foreground font-medium mb-6">
            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <div className="w-full bg-black rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-iu-blue w-full animate-progress" />
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

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
