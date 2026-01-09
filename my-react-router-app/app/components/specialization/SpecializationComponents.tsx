import React from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  ChevronLeft,
  GraduationCap,
  Info,
  Sparkles,
  BookOpen,
  Award,
  Check,
  Target,
  TrendingUp,
  Calendar,
  AlertCircle,
} from "lucide-react";

import { VERTIEFUNGEN } from "~/constants/specialization";
import { getTranslatedDescription } from "~/data/coursesConfig";
import type { VertiefungId } from "~/types/specialization";

//// TYPES
//
interface VertiefungCourse {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  description?: string;
  topics: string[];
}

interface Vertiefung {
  id: string;
  name: string;
  nameEn: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  darkGradient: string;
  description: string;
  highlights: string[];
  courses: VertiefungCourse[];
  careerPaths: string[];
}

interface ColorClasses {
  bg: string;
  text: string;
  border: string;
  ring: string;
}

interface SuccessToastProps {
  message: string;
}

interface PageHeaderProps {
  title: string;
  subtitle: React.ReactNode;
  savedChoice: VertiefungId | null;
  currentChoiceLabel: string;
}

interface InfoBannerProps {
  title: string;
  text: string;
}

interface SpecializationCardProps {
  vertiefung: Vertiefung;
  isSelected: boolean;
  isSaved: boolean;
  colorClasses: ColorClasses;
  onSelect: () => void;
  labels: {
    chosen: string;
    courses: string;
  };
}

interface SpecializationDetailsProps {
  vertiefung: Vertiefung;
  isSaved: boolean;
  language: "de" | "en";
  onConfirm: () => void;
  labels: {
    alreadyChosen: string;
    chooseSpecialization: string;
    coursesInSpec: string;
    semester: string;
    careerPaths: string;
  };
}

interface ConfirmationModalProps {
  vertiefung: Vertiefung;
  onConfirm: () => void;
  onCancel: () => void;
  labels: {
    confirmTitle: string;
    confirmText: string;
    confirmText2: string;
    cancel: string;
    confirm: string;
  };
}

//// HELPER FUNCTIONS
//
export function getColorClasses(color: string): ColorClasses {
  const colors: Record<string, ColorClasses> = {
    emerald: {
      bg: "bg-iu-blue/10 dark:bg-iu-blue",
      text: "text-iu-blue dark:text-white",
      border: "border-iu-blue/30 dark:border-iu-blue",
      ring: "ring-iu-blue/30 dark:ring-iu-blue",
    },
    "iu-blue": {
      bg: "bg-iu-blue/10 dark:bg-iu-blue",
      text: "text-iu-blue dark:text-white",
      border: "border-iu-blue/30 dark:border-iu-blue",
      ring: "ring-iu-blue/30 dark:ring-iu-blue",
    },
    "iu-orange": {
      bg: "bg-iu-orange/10 dark:bg-iu-orange",
      text: "text-iu-orange dark:text-white",
      border: "border-iu-orange/30 dark:border-iu-orange",
      ring: "ring-iu-orange/30 dark:ring-iu-orange",
    },
  };
  return colors[color] || colors["iu-blue"];
}

//// COMPONENTS
//
export function SuccessToast({ message }: SuccessToastProps) {
  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2">
      <div className="flex items-center gap-3 px-5 py-4 rounded-none bg-iu-blue text-white shadow-xl shadow-iu-blue/20">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-black">{message}</span>
      </div>
    </div>
  );
}

import { PageHeader as GlobalPageHeader } from "~/components/shared/PageHeader";

export function PageHeader({
  title,
  subtitle,
  savedChoice,
  currentChoiceLabel,
}: PageHeaderProps) {
  return (
    <GlobalPageHeader
      icon={GraduationCap}
      title={title}
      subtitle={
        <>
          {subtitle}{" "}
          <span className="font-black text-iu-blue dark:text-white">Wirtschaftsinformatik (B.Sc.)</span>
        </>
      }
    >
      {savedChoice && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-iu-blue/10 dark:bg-iu-blue border border-iu-blue/30 dark:border-iu-blue shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-iu-blue dark:text-white" />
          <div>
            <p className="text-[10px] text-iu-blue dark:text-white font-bold uppercase tracking-wider">
              {currentChoiceLabel}
            </p>
            <p className="text-sm font-black text-foreground">
              {VERTIEFUNGEN[savedChoice].name}
            </p>
          </div>
        </div>
      )}
    </GlobalPageHeader>
  );
}


export function InfoBanner({ title, text }: InfoBannerProps) {
  return (
    <div className="mb-10 p-5 rounded-none bg-iu-blue/5 dark:bg-iu-blue/10 border border-iu-blue/20 dark:border-iu-blue/30 flex items-start gap-4">
      <div className="p-2 rounded-none bg-iu-blue/10 dark:bg-iu-blue">
        <Info className="w-5 h-5 text-iu-blue dark:text-white" />
      </div>
      <div>
        <h3 className="font-black text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground font-medium">{text}</p>
      </div>
    </div>
  );
}

export function SpecializationCard({
  vertiefung,
  isSelected,
  isSaved,
  colorClasses,
  onSelect,
  labels,
}: SpecializationCardProps) {
  const Icon = vertiefung.icon;
  const totalCredits = vertiefung.courses.reduce((a: number, c: VertiefungCourse) => a + c.credits, 0);

  return (
    <div
      onClick={onSelect}
      className={`relative group cursor-pointer overflow-hidden rounded-none border-2 transition-all duration-300 ${
        isSelected
          ? "border-iu-blue shadow-xl shadow-iu-blue/20"
          : "border-border hover:border-iu-blue/30"
      } bg-card`}
    >
      {/* Header Gradient */}
      <div className={`h-32 bg-gradient-to-br ${vertiefung.gradient} relative`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="p-2.5 rounded-none bg-white/20 backdrop-blur-sm">
            <Icon className="w-6 h-6 text-white" />
          </div>
          {isSaved && (
            <span className="px-2 py-1 rounded-none bg-white/30 text-foreground dark:text-white text-xs font-black backdrop-blur-sm">
              {labels.chosen}
            </span>
          )}
        </div>
        {isSelected && (
          <div className="absolute top-4 right-4 p-2 rounded-none bg-white shadow-lg">
            <Check className="w-5 h-5 text-iu-green" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-black text-foreground mb-2">{vertiefung.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 font-medium">
          {vertiefung.description}
        </p>

        {/* Highlights */}
        <div className="space-y-2 mb-6">
          {vertiefung.highlights.map((highlight: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
              <Sparkles className={`w-4 h-4 ${colorClasses.text}`} />
              {highlight}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-bold">
            <BookOpen className="w-4 h-4" />
            <span>{vertiefung.courses.length} {labels.courses}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-bold">
            <Award className="w-4 h-4" />
            <span>{totalCredits} CP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SpecializationDetails({
  vertiefung,
  isSaved,
  language,
  onConfirm,
  labels,
}: SpecializationDetailsProps) {
  const Icon = vertiefung.icon;
  const totalCredits = vertiefung.courses.reduce((a: number, c: VertiefungCourse) => a + c.credits, 0);

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-none border border-border bg-card overflow-hidden shadow-lg">
        {/* Header */}
        <div className={`p-8 bg-gradient-to-br ${vertiefung.gradient}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-none bg-white/20 backdrop-blur-sm">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{vertiefung.name}</h2>
                <p className="text-white text-sm font-bold">
                  {vertiefung.courses.length} Kurse • {totalCredits} Credit Points
                </p>
              </div>
            </div>

            <button
              onClick={onConfirm}
              disabled={isSaved}
              className={`px-6 py-3 rounded-none font-black transition-all flex items-center gap-2 ${
                isSaved
                  ? "bg-white/30 text-white cursor-not-allowed"
                  : "bg-white text-slate-900 hover:bg-white/90 shadow-lg hover:shadow-xl active:scale-95"
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  {labels.alreadyChosen}
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  {labels.chooseSpecialization}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="p-8">
          <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-iu-blue dark:text-white" />
            {labels.coursesInSpec}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {vertiefung.courses.map((course: VertiefungCourse) => (
              <div
                key={course.id}
                className="group p-5 rounded-none border border-border hover:border-iu-blue/30 bg-muted/50 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground mb-1 font-bold">
                      {course.code}
                    </p>
                    <h4 className="font-black text-foreground group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
                      {course.name}
                    </h4>
                  </div>
                  <span className="px-2 py-1 rounded-none bg-muted text-xs font-black text-muted-foreground">
                    {course.credits} CP
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4 font-medium">
                  {getTranslatedDescription(course.description || "", language)}
                </p>

                <div className="flex flex-wrap gap-2">
                  {course.topics.map((topic: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-none bg-muted text-xs text-muted-foreground font-bold"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground font-bold">
                    <Calendar className="w-4 h-4" />
                    {course.semester}. {labels.semester}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Career Paths */}
          <div className="mt-8 p-6 rounded-none bg-muted/50 border border-border">
            <h4 className="font-black text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-iu-blue dark:text-white" />
              {labels.careerPaths}
            </h4>
            <div className="flex flex-wrap gap-3">
              {vertiefung.careerPaths.map((path: string, idx: number) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-none bg-card border border-border text-sm font-black text-foreground shadow-sm"
                >
                  {path}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConfirmationModal({
  vertiefung,
  onConfirm,
  onCancel,
  labels,
}: ConfirmationModalProps) {
  const Icon = vertiefung.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="max-w-md w-full mx-4 p-6 rounded-none bg-card shadow-2xl border border-border animate-in zoom-in-95">
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 rounded-none bg-gradient-to-br ${vertiefung.gradient}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground">{labels.confirmTitle}</h3>
            <p className="text-sm text-muted-foreground font-bold">{vertiefung.name}</p>
          </div>
        </div>

        <div className="mb-6 p-4 rounded-none bg-iu-orange/10 dark:bg-iu-orange border border-iu-orange/30 dark:border-iu-orange text-iu-orange dark:text-white text-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-iu-orange dark:text-white" />
            <p className="font-medium">
              {labels.confirmText} <strong className="font-black">{vertiefung.name}</strong>{" "}
              {labels.confirmText2}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-none border border-border text-foreground font-black hover:bg-muted transition-colors"
          >
            {labels.cancel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 rounded-none bg-gradient-to-r ${vertiefung.gradient} text-white font-black hover:opacity-90 transition-opacity shadow-lg active:scale-95`}
          >
            {labels.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
