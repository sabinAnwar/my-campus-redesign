import React from "react";
import { useLanguage } from "~/contexts/LanguageContext";
import {
  FileText,
  ShieldCheck,
  ArrowRight,
  Info,
  BookOpen,
  Lock,
  AlertCircle,
} from "lucide-react";

export default function InfoCenterPage() {
  const { language } = useLanguage();
  const t = {
    de: {
      title: "Info Center",
      subtitle: "Wichtige Ressourcen & Dokumente für dein Studium",
      examGuide: "Prüfungsguide & Dokumente",
      new: "Neu",
      examDesc:
        "Krankmeldungen, wissenschaftliches Arbeiten und Vorlagen für deine Prüfungen.",
      security: "IT-Sicherheit & Datenschutz",
      important: "Wichtig",
      securityDesc:
        "Die 8 goldenen Regeln für den sicheren Umgang mit Daten und Privatsphäre.",
      viewMore: "Mehr erfahren",
    },
    en: {
      title: "Info Center",
      subtitle: "Important resources & documents for your studies",
      examGuide: "Exam guide & documents",
      new: "New",
      examDesc: "Sick notes, academic writing, and templates for your exams.",
      security: "IT Security & Data Protection",
      important: "Important",
      securityDesc:
        "The 8 golden rules for handling data and privacy securely.",
      viewMore: "Learn more",
    },
  }[language];

  return (
    <div className="max-w-7xl mx-auto">
        {/* Header Section */}
      <header className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                <Info size={28} />
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight">
                {t.title}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>
      </header>

        {/* Grid Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Exam Guide Card */}
          <a
            href="/exams"
            className="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl p-8 transition-all duration-500 hover:border-iu-blue/50 hover:shadow-2xl hover:shadow-iu-blue/10 no-underline"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <BookOpen size={120} className="text-iu-blue" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue group-hover:scale-110 transition-transform duration-500">
                  <FileText size={28} />
                </div>
                <span className="px-4 py-1 rounded-full bg-iu-blue/10 text-iu-blue text-xs font-bold uppercase tracking-wider border border-iu-blue/20">
                  {t.new}
                </span>
              </div>

              <h2 className="text-xl font-black text-foreground mb-3 group-hover:text-iu-blue transition-colors">
                {t.examGuide}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {t.examDesc}
              </p>

              <div className="flex items-center gap-2 text-iu-blue font-bold text-sm uppercase tracking-widest">
                {t.viewMore}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </div>
            </div>
          </a>

          {/* Security Card */}
          <a
            href="/security"
            className="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl p-8 transition-all duration-500 hover:border-iu-blue/50 hover:shadow-2xl hover:shadow-iu-blue/10 no-underline"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Lock size={120} className="text-iu-blue" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck size={28} />
                </div>
                <span className="px-4 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider border border-amber-500/20 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {t.important}
                </span>
              </div>

              <h2 className="text-xl font-black text-foreground mb-3 group-hover:text-iu-blue transition-colors">
                {t.security}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {t.securityDesc}
              </p>

              <div className="flex items-center gap-2 text-iu-blue font-bold text-sm uppercase tracking-widest">
                {t.viewMore}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </div>
            </div>
          </a>
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 rounded-[2rem] bg-iu-blue/5 border border-iu-blue/10 flex items-start gap-4">
          <div className="p-2 rounded-xl bg-iu-blue/10 text-iu-blue shrink-0">
            <Info size={20} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {language === "de"
              ? "Das Info Center wird regelmäßig mit neuen Dokumenten und Richtlinien aktualisiert. Bitte schaue regelmäßig vorbei, um auf dem neuesten Stand zu bleiben."
              : "The Info Center is regularly updated with new documents and guidelines. Please check back often to stay up to date."}
          </p>
        </div>
      </div>
  );
}
