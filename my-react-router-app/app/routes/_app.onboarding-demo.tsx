import { useEffect } from "react";
import FirstSemesterOnboarding from "~/components/FirstSemesterOnboarding";

export default function OnboardingDemo() {
  // Clear localStorage on mount to always show onboarding
  useEffect(() => {
    localStorage.removeItem("iu_onboarding_completed");
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Onboarding Demo
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Dies ist eine Demo-Seite für das Ersti-Onboarding.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Das Onboarding-Popup erscheint automatisch nach 1 Sekunde.
        </p>
      </div>

      {/* Onboarding Komponente */}
      <FirstSemesterOnboarding 
        isFirstSemester={true}
        onComplete={() => {
          console.log("Onboarding abgeschlossen!");
          alert("Onboarding abgeschlossen! 🎉");
        }}
      />
    </div>
  );
}
