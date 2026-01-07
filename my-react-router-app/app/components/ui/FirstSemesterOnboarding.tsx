import React, { useState, useEffect } from "react";
import { X, Play, BookOpen, Calendar, FileText, Users, MessageSquare, CheckCircle, ArrowRight, type LucideIcon } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  videoUrl?: string;
  features: string[];
}

const ONBOARDING_DATA = {
  de: {
    back: "Zurück",
    next: "Weiter",
    finish: "Fertig",
    skip: "Überspringen",
    step: "Schritt",
    of: "von",
    whatYouFind: "Was du hier findest:",
    floatingTitle: "Onboarding erneut starten",
    steps: [
      {
        id: "welcome",
        title: "Willkommen an der IU! ",
        description: "Herzlich willkommen im IU Student Portal. Wir zeigen dir, wie du dich hier zurechtfindest.",
        icon: BookOpen,
        features: [
          "Dashboard mit allen wichtigen Infos",
          "Kurse und Lernmaterialien",
          "Prüfungstermine und Abgaben",
          "Kontakt zu Kommilitonen und Dozenten",
        ],
      },
      {
        id: "dashboard",
        title: "Dein Dashboard",
        description: "Hier findest du alle wichtigen Informationen auf einen Blick.",
        icon: Calendar,
        videoUrl: "https://www.youtube.com/embed/om0i4CKwPcM",
        features: [
          "Aktuelle Aufgaben und Deadlines",
          "Neuigkeiten und Ankündigungen",
          "Schnellzugriff auf Kurse",
          "Stundenplan und Termine",
        ],
      },
      {
        id: "courses",
        title: "Kurse & Materialien",
        description: "Greife auf alle Kursmaterialien, Videos und Skripte zu.",
        icon: FileText,
        features: [
          "Skripte und Foliensätze herunterladen",
          "Vorlesungsvideos ansehen",
          "Übungsaufgaben bearbeiten",
          "Forum für Fragen nutzen",
        ],
      },
    ] as OnboardingStep[]
  },
  en: {
    back: "Back",
    next: "Next",
    finish: "Finish",
    skip: "Skip and view later",
    step: "Step",
    of: "of",
    whatYouFind: "In this section:",
    floatingTitle: "Restart Onboarding",
    steps: [
      {
        id: "welcome",
        title: "Welcome to IU! ",
        description: "Welcome to the IU Student Portal. We'll show you how to navigate your studies.",
        icon: BookOpen,
        features: [
          "Dashboard with all key info",
          "Courses and study materials",
          "Exam dates and submissions",
          "Connect with peers and tutors",
        ],
      },
      {
        id: "dashboard",
        title: "Your Dashboard",
        description: "Find all essential information at a single glance.",
        icon: Calendar,
        videoUrl: "https://www.youtube.com/embed/om0i4CKwPcM",
        features: [
          "Current tasks and deadlines",
          "News and announcements",
          "Quick access to courses",
          "Schedule and appointments",
        ],
      },
      {
        id: "courses",
        title: "Courses & Materials",
        description: "Access all your course content, videos, and scripts.",
        icon: FileText,
        features: [
          "Download scripts and slides",
          "Watch lecture videos",
          "Complete practice tasks",
          "Use the forum for questions",
        ],
      },
    ] as OnboardingStep[]
  }
};

interface FirstSemesterOnboardingProps {
  isFirstSemester: boolean;
  onComplete: () => void;
}

export default function FirstSemesterOnboarding({ isFirstSemester, onComplete }: FirstSemesterOnboardingProps) {
  const { language } = useLanguage();
  const t = ONBOARDING_DATA[language === "de" ? "de" : "en"];
  const steps = t.steps;
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has already seen onboarding
    const seen = localStorage.getItem("iu_onboarding_completed");
    if (seen) {
      setHasSeenOnboarding(true);
    } else if (isFirstSemester) {
      // Show onboarding automatically for first-semester students
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, [isFirstSemester]);

  const handleComplete = () => {
    localStorage.setItem("iu_onboarding_completed", "true");
    setHasSeenOnboarding(true);
    setIsOpen(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsOpen(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isFirstSemester) {
    return null;
  }

  if (!isOpen) {
    // Floating button to reopen onboarding
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-iu-blue to-iu-purple text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group focus:outline-none focus:ring-4 focus:ring-iu-blue/20"
        title={t.floatingTitle}
        aria-label={t.floatingTitle}
      >
        <Play className="h-6 w-6 group-hover:animate-pulse" aria-hidden="true" />
      </button>
    );
  }

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="onboarding-title" 
        className="relative w-full max-w-3xl bg-card text-card-foreground rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-border"
      >
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted hover:bg-muted-foreground/10 transition-colors focus:outline-none focus:ring-2 focus:ring-iu-blue"
          aria-label={language === "de" ? "Schließen" : "Close"}
        >
          <X className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </button>

        {/* Progress Bar */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 bg-muted"
          role="progressbar"
          aria-valuenow={((currentStep + 1) / steps.length) * 100}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t.step}
        >
          <div
            className="h-full bg-iu-blue transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 pt-10 sm:pt-12">
          {/* Icon & Title */}
          <div className="flex items-center gap-4 mb-5 sm:mb-6">
            <div className="p-3 sm:p-4 bg-iu-blue/10 dark:bg-iu-blue/20 rounded-2xl">
              <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-iu-blue" aria-hidden="true" />
            </div>
            <div>
              <h2 id="onboarding-title" className="text-2xl sm:text-3xl font-black text-foreground">
                {step.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.step} {currentStep + 1} {t.of} {steps.length}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-lg text-slate-700 dark:text-slate-300 mb-6">
            {step.description}
          </p>

          {/* Video (if available) */}
          {step.videoUrl && (
            <div className="mb-6 rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
              <iframe
                width="100%"
                height="315"
                src={step.videoUrl}
                title={step.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full"
              ></iframe>
            </div>
          )}

          {/* Features List */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">
              {t.whatYouFind}
            </h3>
            <ul className="space-y-2">
              {step.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-iu-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-muted-foreground hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-iu-blue"
            >
              {t.back}
            </button>

            <div className="flex gap-2 justify-center" aria-hidden="true">
              {steps.map((_: OnboardingStep, index: number) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentStep
                      ? "bg-iu-blue w-8"
                      : index < currentStep
                      ? "bg-iu-blue/60"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold bg-iu-blue text-white hover:bg-iu-blue/90 transition-all shadow-lg active:scale-95 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-iu-blue/20"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  {t.finish}
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </>
              ) : (
                <>
                  {t.next}
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>

          {/* Skip Button */}
          <div className="mt-4 text-center">
            <button
              onClick={handleSkip}
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              {t.skip}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
