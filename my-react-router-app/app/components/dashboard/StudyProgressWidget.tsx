import React from "react";
import { Link } from "react-router";
import {
  Activity,
  Briefcase,
  ClipboardCheck,
  BookMarked,
  CalendarDays,
  CalendarCheck,
  FileText,
  Building2,
  Users,
  Mail,
  Phone,
  Timer,
} from "lucide-react";
import { STUDY_PLANS, DEFAULT_PALETTE } from "~/lib/studyPlans";
import type { PraxisPartnerData, PraxisHoursData } from "~/types/dashboard";

interface StudyProgressWidgetProps {
  currentStatus: string;
  statusConfig: { bg: string; text: string; label: string; ring: string };
  currentBlock: { start: string; end: string; status: string } | undefined;
  nextBlock: { start: string; end: string; status: string } | undefined;
  phaseProgress: number;
  phaseDaysLeft: number;
  phaseTotalDays: number;
  companyInfo: {
    name: string;
    department: string;
    supervisor: string;
    email: string;
    phone: string;
    address: string;
  } | null;
  praxisHours: PraxisHoursData;
  praxisProgress: number;
  language: string;
  t: any;
}

export function StudyProgressWidget({
  currentStatus,
  statusConfig,
  currentBlock,
  nextBlock,
  phaseProgress,
  phaseDaysLeft,
  phaseTotalDays,
  companyInfo,
  praxisHours,
  praxisProgress,
  language,
  t,
}: StudyProgressWidgetProps) {
  return (
    <div data-onboard="dashboard-progress" className="mb-6 sm:mb-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-iu-pink/10 text-iu-pink shadow-sm border border-iu-pink/10 dark:bg-iu-pink dark:text-white dark:border-iu-pink/40">
          <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground flex items-center gap-2 sm:gap-3">
          {t.studyProgress}
        </h3>
      </div>
      <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-border bg-card/40 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-iu-blue/10 to-transparent rounded-full -mr-24 -mt-24 transition-transform group-hover:scale-110 duration-1000 blur-3xl" />

        <div className="relative z-10">
          {/* Top Section: Current Phase + Progress */}
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 items-start lg:items-center mb-6 sm:mb-8 md:mb-10">
            {/* Left: Status & Progress */}
            <div className="flex-1 w-full space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-5">
                <div
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${statusConfig.bg} ${statusConfig.text} shadow-lg ring-1 ${statusConfig.ring}`}
                >
                  {currentStatus === "praxis" ? (
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : currentStatus === "klausurphase" ? (
                    <ClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <BookMarked className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <h2 className="text-sm sm:text-base md:text-lg font-bold text-foreground tracking-tight italic">
                      {statusConfig.label}
                    </h2>
                    <span
                      className={`w-fit px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-widest border border-current/30 leading-none ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      {t.current}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground dark:text-slate-200">
                    {new Date(currentBlock?.start || "").toLocaleDateString(
                      "de-DE",
                      { day: "2-digit", month: "short" }
                    )}
                    {" – "}
                    {new Date(currentBlock?.end || "").toLocaleDateString(
                      "de-DE",
                      { day: "2-digit", month: "short", year: "numeric" }
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col xs:flex-row xs:justify-between xs:items-end gap-2">
                  <div className="space-y-0.5 sm:space-y-1 min-w-0">
                    <span className="text-[10px] sm:text-xs font-bold text-muted-foreground dark:text-slate-200 uppercase tracking-wider sm:tracking-widest leading-none block">
                      {t.phaseProgress}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-foreground tabular-nums">
                      {Math.round(phaseProgress)}%
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-iu-blue dark:text-white uppercase tracking-wider sm:tracking-widest self-start xs:self-auto">
                    {t.daysLeft} {phaseDaysLeft} {t.days}
                  </span>
                </div>
                <div className="h-2.5 sm:h-4 w-full bg-muted border border-border/50 rounded-full overflow-hidden p-0.5 sm:p-1">
                  <div
                    className="h-full bg-iu-blue rounded-full progress-bar shadow-[0_0_15px_rgba(36,94,235,0.4)]"
                    style={{ width: `${phaseProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] sm:text-xs font-bold text-muted-foreground dark:text-slate-200 uppercase tracking-widest">
                  <span>
                    {t.day} {Math.ceil(phaseTotalDays - phaseDaysLeft)} {t.of}{" "}
                    {phaseTotalDays}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Next Phase & Quick Action */}
            <div className="w-full lg:w-[320px] xl:w-[350px] flex flex-col gap-4 sm:gap-5 border-t lg:border-t-0 lg:border-l border-border pt-6 sm:pt-8 lg:pt-0 lg:pl-8 xl:pl-10 shrink-0">
              <div className="space-y-3 sm:space-y-4">
                <p className="text-[10px] sm:text-xs font-bold text-muted-foreground dark:text-slate-200 uppercase tracking-widest">
                  {t.nextPhase}
                </p>
                <div className="flex items-center gap-3 sm:gap-4 bg-muted/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border">
                  <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-card border border-border text-iu-blue shadow-sm dark:bg-iu-blue dark:text-white dark:border-iu-blue/40">
                    <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-xs sm:text-sm uppercase tracking-tight">
                      {nextBlock
                        ? (STUDY_PLANS[0].paletteOverrides as any)?.[nextBlock.status]
                            ?.label || (DEFAULT_PALETTE as any)[nextBlock.status].label
                        : t.semesterEnd}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground dark:text-slate-200 font-semibold">
                      {t.from}{" "}
                      {nextBlock
                        ? new Date(nextBlock.start).toLocaleDateString(
                            language === "de" ? "de-DE" : "en-US",
                            { day: "2-digit", month: "long" }
                          )
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {currentStatus === "praxis" ? (
                <Link
                  to="/praxisbericht2"
                  className="flex items-center justify-center gap-2 sm:gap-3 w-full py-3 sm:py-4 md:py-5 px-4 sm:px-6 bg-foreground text-background rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:opacity-90 transition-all shadow-xl active:scale-95 cursor-pointer"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t.writePraxisReport}
                </Link>
              ) : (
                <Link
                  to="/courses/schedule"
                  className="flex items-center justify-center gap-2 sm:gap-3 w-full py-3 sm:py-4 md:py-5 px-4 sm:px-6 bg-foreground text-background rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:opacity-90 transition-all shadow-xl active:scale-95 cursor-pointer"
                >
                  <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t.viewSchedule}
                </Link>
              )}
            </div>
          </div>

          {/* Bottom Section: Company Info + Praxis Hours (only in praxis phase) */}
          {currentStatus === "praxis" && (
            <div className="grid md:grid-cols-2 gap-8 pt-10 border-t border-border/50">
              {/* Company Info Card */}
              {companyInfo ? (
                <div className="p-6 rounded-[2rem] bg-card/60 border border-border shadow-inner">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-iu-blue/10 text-iu-blue dark:bg-iu-blue dark:text-white">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-black text-foreground tracking-tight">
                        {t.praxisPartner}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <p className="text-xl font-bold text-foreground leading-tight">
                        {companyInfo.name}
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-slate-200 font-medium mt-1">
                        {companyInfo.department}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-foreground font-bold bg-muted/50 p-3 rounded-xl border border-border/50 w-fit">
                      <Users className="w-4 h-4 text-iu-blue dark:text-white" />
                      <span>
                        {t.supervisor}: {companyInfo.supervisor}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {companyInfo.email && (
                        <a
                          href={`mailto:${companyInfo.email}`}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-iu-blue text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-iu-blue/10"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          {language === "de"
                            ? "E-Mail schreiben"
                            : "Send E-Mail"}
                        </a>
                      )}
                      {companyInfo.phone && (
                        <a
                          href={`tel:${companyInfo.phone}`}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-xs font-bold uppercase tracking-widest text-foreground hover:bg-muted transition-all"
                        >
                          <Phone className="w-3.5 h-3.5 text-muted-foreground dark:text-white" />
                          {t.callNow}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-[2rem] bg-card/60 border border-border text-center flex flex-col items-center justify-center py-10">
                  <Building2 className="w-12 h-12 text-muted-foreground dark:text-slate-200 mb-4" />
                  <p className="text-base text-muted-foreground dark:text-slate-200 font-bold max-w-xs">
                    {language === "de"
                      ? "Kein Praxispartner hinterlegt"
                      : "No practice partner set"}
                  </p>
                </div>
              )}

              {/* Praxis Hours Tracker */}
              <div className="p-6 rounded-[2rem] bg-iu-blue/5 border border-iu-blue/20 shadow-inner dark:bg-iu-blue/20">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-iu-blue/10 text-iu-blue dark:bg-iu-blue dark:text-white">
                      <Timer className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-foreground tracking-tight">
                      {t.praxisHours}
                    </h3>
                  </div>
                  <div className="px-5 py-2 rounded-full bg-iu-blue text-white text-base font-black shadow-lg shadow-iu-blue/20">
                    {praxisProgress}%
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-muted-foreground dark:text-slate-200 uppercase tracking-widest">
                        {t.hoursLogged}
                      </span>
                      <div className="text-2xl font-black text-foreground tabular-nums">
                        {praxisHours.logged}{" "}
                        <span className="text-muted-foreground dark:text-slate-200 font-bold text-sm">
                          / {praxisHours.required}h
                        </span>
                      </div>
                    </div>
                    <div className="h-4 bg-card border border-border/50 rounded-full overflow-hidden p-1">
                      <div
                        className="h-full bg-iu-blue rounded-full progress-bar shadow-[0_0_10px_rgba(36,94,235,0.3)]"
                        style={{ width: `${praxisProgress}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-card border border-border/50">
                      <p className="text-[10px] font-bold text-muted-foreground dark:text-slate-200 uppercase tracking-widest mb-1">
                        {t.thisWeek}
                      </p>
                      <p className="text-2xl font-black text-iu-blue dark:text-white">
                        {praxisHours.thisWeek}h
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-card border border-border/50">
                      <p className="text-[10px] font-bold text-muted-foreground dark:text-slate-200 uppercase tracking-widest mb-1">
                        {t.targetPerWeek}
                      </p>
                      <p className="text-2xl font-black text-foreground">
                        {praxisHours.target_per_week}h
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
