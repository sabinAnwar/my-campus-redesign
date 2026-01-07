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
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group"
        title={t.floatingTitle}
      >
        <Play className="h-6 w-6 group-hover:animate-pulse" />
      </button>
    );
  }

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 pt-12">
          {/* Icon & Title */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 rounded-2xl">
              <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                {step.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.step} {currentStep + 1} {t.of} {steps.length}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
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
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">
              {t.whatYouFind}
            </h3>
            <ul className="space-y-2">
              {step.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-iu-blue dark:text-iu-blue flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.back}
            </button>

            <div className="flex gap-2">
              {steps.map((_: OnboardingStep, index: number) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentStep
                      ? "bg-indigo-600 dark:bg-indigo-400 w-8"
                      : index < currentStep
                      ? "bg-indigo-400 dark:bg-indigo-600"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  {t.finish}
                  <CheckCircle className="h-5 w-5" />
                </>
              ) : (
                <>
                  {t.next}
                  <ArrowRight className="h-5 w-5" />
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
