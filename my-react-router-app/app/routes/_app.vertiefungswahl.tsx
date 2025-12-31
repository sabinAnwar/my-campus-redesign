import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "~/contexts/LanguageContext";
import {
  BarChart3,
  Code2,
  FolderKanban,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Info,
  Sparkles,
  Target,
  TrendingUp,
  Database,
  Brain,
  GitBranch,
  Settings2,
  Users,
  Calendar,
  Award,
  AlertCircle,
  Check,
} from "lucide-react";

import { TRANSLATIONS, VERTIEFUNGEN } from "~/constants/specialization";

export const loader = async () => null;

import type { VertiefungId } from "~/types/specialization";

export default function Vertiefungswahl() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const [selectedVertiefung, setSelectedVertiefung] =
    useState<VertiefungId | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [savedChoice, setSavedChoice] = useState<VertiefungId | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load saved choice from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("vertiefungswahl");
    if (saved && saved in VERTIEFUNGEN) {
      setSavedChoice(saved as VertiefungId);
    }
  }, []);

  const handleConfirm = () => {
    if (selectedVertiefung) {
      localStorage.setItem("vertiefungswahl", selectedVertiefung);
      setSavedChoice(selectedVertiefung);
      setConfirmModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<
      string,
      { bg: string; text: string; border: string; ring: string }
    > = {
      emerald: {
        bg: "bg-iu-blue/10",
        text: "text-iu-blue dark:text-iu-blue",
        border: "border-iu-blue/30",
        ring: "ring-iu-blue/30",
      },
      "iu-blue": {
        bg: "bg-iu-blue/10",
        text: "text-iu-blue",
        border: "border-iu-blue/30",
        ring: "ring-iu-blue/30",
      },
      "iu-orange": {
        bg: "bg-iu-orange/10",
        text: "text-iu-orange",
        border: "border-iu-orange/30",
        ring: "ring-iu-orange/30",
      },
    };
    return colors[color] || colors["iu-blue"];
  };

  return (
    <main className="max-w-7xl mx-auto">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3 px-5 py-4 rounded-none bg-iu-blue text-white shadow-xl shadow-iu-blue/20">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-black">{t.successMsg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-12">
        <Link
          to="/study-organization"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-iu-blue transition-colors mb-4 font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.back}
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight flex items-center gap-3">
              <GraduationCap className="w-10 h-10 text-iu-blue" />
              {t.title}
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl font-medium">
              {t.subtitle}{" "}
              <span className="font-black text-iu-blue">
                Wirtschaftsinformatik (B.Sc.)
              </span>
            </p>
          </div>

          {savedChoice && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-none bg-iu-blue/10 border border-iu-blue/30">
              <CheckCircle2 className="w-5 h-5 text-iu-blue dark:text-iu-blue" />
              <div>
                <p className="text-sm text-iu-blue dark:text-iu-blue font-bold">
                  {t.currentChoice}
                </p>
                <p className="text-foreground font-black">
                  {VERTIEFUNGEN[savedChoice].name}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-10 p-5 rounded-none bg-iu-blue/5 border border-iu-blue/20 flex items-start gap-4">
        <div className="p-2 rounded-none bg-iu-blue/10">
          <Info className="w-5 h-5 text-iu-blue" />
        </div>
        <div>
          <h3 className="font-black text-foreground mb-1">{t.infoTitle}</h3>
          <p className="text-sm text-muted-foreground font-medium">
            {t.infoText}
          </p>
        </div>
      </div>

      {/* Vertiefungen Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {Object.values(VERTIEFUNGEN).map((vertiefung) => {
          const Icon = vertiefung.icon;
          const colorClasses = getColorClasses(vertiefung.color);
          const isSelected = selectedVertiefung === vertiefung.id;
          const isSaved = savedChoice === vertiefung.id;

          return (
            <div
              key={vertiefung.id}
              onClick={() =>
                setSelectedVertiefung(vertiefung.id as VertiefungId)
              }
              className={`relative group cursor-pointer overflow-hidden rounded-none border-2 transition-all duration-300 ${
                isSelected
                  ? `border-iu-blue shadow-xl shadow-iu-blue/20`
                  : "border-border hover:border-iu-blue/30"
              } bg-card`}
            >
              {/* Header Gradient */}
              <div
                className={`h-32 bg-gradient-to-br ${vertiefung.gradient} relative`}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="p-2.5 rounded-none bg-white/20 backdrop-blur-sm">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {isSaved && (
                    <span className="px-2 py-1 rounded-none bg-white/30 text-white text-xs font-black backdrop-blur-sm">
                      {t.chosen}
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
                <h3 className="text-xl font-black text-foreground mb-2">
                  {vertiefung.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 font-medium">
                  {vertiefung.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2 mb-6">
                  {vertiefung.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-muted-foreground font-bold"
                    >
                      <Sparkles className={`w-4 h-4 ${colorClasses.text}`} />
                      {highlight}
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-bold">
                    <BookOpen className="w-4 h-4" />
                    <span>
                      {vertiefung.courses.length} {t.courses}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-bold">
                    <Award className="w-4 h-4" />
                    <span>
                      {vertiefung.courses.reduce((a, c) => a + c.credits, 0)} CP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Vertiefung Details */}
      {selectedVertiefung && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="rounded-none border border-border bg-card overflow-hidden shadow-lg">
            {/* Header */}
            <div
              className={`p-8 bg-gradient-to-br ${VERTIEFUNGEN[selectedVertiefung].gradient}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-none bg-white/20 backdrop-blur-sm">
                    {React.createElement(
                      VERTIEFUNGEN[selectedVertiefung].icon,
                      { className: "w-8 h-8 text-white" }
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">
                      {VERTIEFUNGEN[selectedVertiefung].name}
                    </h2>
                    <p className="text-white/80 text-sm font-bold">
                      {VERTIEFUNGEN[selectedVertiefung].courses.length} Kurse{" "}
                      {VERTIEFUNGEN[selectedVertiefung].courses.reduce(
                        (a, c) => a + c.credits,
                        0
                      )}{" "}
                      Credit Points
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setConfirmModal(true)}
                  disabled={savedChoice === selectedVertiefung}
                  className={`px-6 py-3 rounded-none font-black transition-all flex items-center gap-2 ${
                    savedChoice === selectedVertiefung
                      ? "bg-white/30 text-white/70 cursor-not-allowed"
                      : "bg-white text-slate-900 hover:bg-white/90 shadow-lg hover:shadow-xl active:scale-95"
                  }`}
                >
                  {savedChoice === selectedVertiefung ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      {t.alreadyChosen}
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5" />
                      {t.chooseSpecialization}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="p-8">
              <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-iu-blue" />
                {t.coursesInSpec}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {VERTIEFUNGEN[selectedVertiefung].courses.map((course) => (
                  <div
                    key={course.id}
                    className="group p-5 rounded-none border border-border hover:border-iu-blue/30 bg-muted/50 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-mono text-muted-foreground mb-1 font-bold">
                          {course.code}
                        </p>
                        <h4 className="font-black text-foreground group-hover:text-iu-blue transition-colors">
                          {course.name}
                        </h4>
                      </div>
                      <span className="px-2 py-1 rounded-none bg-muted text-xs font-black text-muted-foreground">
                        {course.credits} CP
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 font-medium">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {course.topics.map((topic, idx) => (
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
                        {course.semester}. {t.semester}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Career Paths */}
              <div className="mt-8 p-6 rounded-none bg-muted/50 border border-border">
                <h4 className="font-black text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-iu-blue" />
                  {t.careerPaths}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {VERTIEFUNGEN[selectedVertiefung].careerPaths.map(
                    (path, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-none bg-card border border-border text-sm font-black text-foreground/80 shadow-sm"
                      >
                        {path}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && selectedVertiefung && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="max-w-md w-full mx-4 p-6 rounded-none bg-card shadow-2xl border border-border animate-in zoom-in-95">
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`p-3 rounded-none bg-gradient-to-br ${VERTIEFUNGEN[selectedVertiefung].gradient}`}
              >
                {React.createElement(VERTIEFUNGEN[selectedVertiefung].icon, {
                  className: "w-6 h-6 text-white",
                })}
              </div>
              <div>
                <h3 className="text-xl font-black text-foreground">
                  {t.confirmTitle}
                </h3>
                <p className="text-sm text-muted-foreground font-bold">
                  {VERTIEFUNGEN[selectedVertiefung].name}
                </p>
              </div>
            </div>

            <div className="mb-6 p-4 rounded-none bg-iu-orange/10 border border-iu-orange/30 text-iu-orange text-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="font-medium">
                  {t.confirmText}{" "}
                  <strong className="font-black">
                    {VERTIEFUNGEN[selectedVertiefung].name}
                  </strong>{" "}
                  {t.confirmText2}
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={() => setConfirmModal(false)}
                className="flex-1 px-4 py-3 rounded-none border border-border text-foreground/80 font-black hover:bg-muted transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-3 rounded-none bg-gradient-to-r ${VERTIEFUNGEN[selectedVertiefung].gradient} text-white font-black hover:opacity-90 transition-opacity shadow-lg active:scale-95`}
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
