import React from "react";

interface FirstSemesterOnboardingProps {
  isFirstSemester: boolean;
  onComplete?: () => void;
}

export default function FirstSemesterOnboarding({
  isFirstSemester,
  onComplete,
}: FirstSemesterOnboardingProps) {
  if (!isFirstSemester) return null;

  return (
    <section className="mt-8 rounded-2xl border border-iu-blue/20 bg-iu-blue/5 p-6">
      <h2 className="text-lg font-black text-foreground">
        Welcome to your first semester
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Start with the dashboard highlights, check your course plan, and explore
        the study resources.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center justify-center rounded-full bg-iu-blue px-4 py-2 text-sm font-bold text-white hover:bg-iu-blue/90 transition-colors"
        >
          Got it
        </button>
      </div>
    </section>
  );
}
