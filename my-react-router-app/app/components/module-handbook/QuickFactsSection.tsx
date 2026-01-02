import React from "react";

interface QuickFactsSectionProps {
  t: any;
  studiengangName: string | null;
  userProfile: {
    program: string;
    focus: string;
    campus: string;
    advisor: string;
    currentSemester: number;
  };
}

export function QuickFactsSection({
  t,
  studiengangName,
  userProfile,
}: QuickFactsSectionProps) {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
        <p className="text-[10px] font-black text-iu-blue uppercase tracking-widest mb-2">
          {t.programLabel}
        </p>
        <p className="text-xl font-black text-foreground">
          {studiengangName || t.businessInformatics}
        </p>
        <p className="mt-2 text-sm text-muted-foreground font-bold leading-relaxed">
          {t.programDesc}
        </p>
      </div>
      <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
        <p className="text-[10px] font-black text-iu-pink uppercase tracking-widest mb-2">
          {t.profileLabel}
        </p>
        <p className="text-xl font-black text-foreground">
          {t.curatedFor("Sabin")} - {userProfile.campus}
        </p>
        <p className="mt-2 text-sm text-muted-foreground font-bold leading-relaxed">
          {t.focusAdvisor(userProfile.focus, userProfile.advisor, userProfile.currentSemester)}
        </p>
      </div>
      <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
        <p className="text-[10px] font-black text-iu-orange uppercase tracking-widest mb-2">
          {t.trackLabel}
        </p>
        <p className="text-xl font-black text-foreground">Data & Analytics</p>
        <p className="mt-2 text-sm text-muted-foreground font-bold leading-relaxed">
          {t.trackDesc}
        </p>
      </div>
    </section>
  );
}
