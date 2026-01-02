import React from "react";
import {
  CalendarDays,
  List,
  Grid3X3,
  Calendar as CalendarIcon,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface ScheduleHeaderProps {
  language: string;
  locale: string;
  currentDate: Date;
  viewMode: "week" | "month" | "list";
  showOptional: boolean;
  statusConfig: { bg: string; text: string; label: string };
  currentStatus: string;
  t: any;
  setViewMode: (mode: "week" | "month" | "list") => void;
  setShowOptional: (show: boolean) => void;
  goToPrevWeek: () => void;
  goToNextWeek: () => void;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
  handleDownloadICS: () => void;
}

export function ScheduleHeader({
  language,
  locale,
  currentDate,
  viewMode,
  showOptional,
  statusConfig,
  currentStatus,
  t,
  setViewMode,
  setShowOptional,
  goToPrevWeek,
  goToNextWeek,
  goToPrevMonth,
  goToNextMonth,
  goToToday,
  handleDownloadICS,
}: ScheduleHeaderProps) {
  const subtitle = language === "de"
    ? "Theoriewoche – Dein persönlicher Stundenplan und akademischer Kalender."
    : "Theory Week – Your personal schedule and academic calendar.";

  return (
    <>
      <PageHeader
        icon={CalendarDays}
        title={t.title}
        subtitle={subtitle}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          {/* Current Phase Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.bg} ${statusConfig.text} border-current/10 text-sm font-bold w-fit`}
          >
            {currentStatus === "praxis" ? (
              <Briefcase size={16} />
            ) : (
              <GraduationCap size={16} />
            )}
            <span>{statusConfig.label}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 lg:flex-row">
            {/* View Toggle */}
            <div className="flex p-1.5 rounded-2xl bg-card/50 backdrop-blur-xl border border-border shadow-sm">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  viewMode === "list"
                    ? "bg-iu-blue text-white shadow-lg shadow-iu-blue/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List size={16} />
                {t.list}
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  viewMode === "week"
                    ? "bg-iu-blue text-white shadow-lg shadow-iu-blue/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid3X3 size={16} />
                {t.week}
              </button>
              <button
                onClick={() => setViewMode("month")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  viewMode === "month"
                    ? "bg-iu-blue text-white shadow-lg shadow-iu-blue/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CalendarIcon size={16} />
                {t.month}
              </button>
            </div>

            <button
              onClick={handleDownloadICS}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-card/50 backdrop-blur-xl border border-border text-foreground font-bold text-sm hover:border-iu-blue/50 transition-all shadow-sm"
            >
              <Download size={18} className="text-iu-blue" />
              {t.downloadCalendar}
            </button>
          </div>
        </div>
      </PageHeader>

      {/* Controls & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-6 mb-8 p-6 rounded-[2rem] bg-card/30 backdrop-blur-xl border border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-background/50 rounded-xl p-1 border border-border">
            <button
              onClick={viewMode === "month" ? goToPrevMonth : goToPrevWeek}
              className="p-2.5 rounded-lg hover:bg-iu-blue/10 text-muted-foreground hover:text-iu-blue transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-1.5 text-sm font-bold text-foreground hover:text-iu-blue transition-colors"
            >
              {t.today}
            </button>
            <button
              onClick={viewMode === "month" ? goToNextMonth : goToNextWeek}
              className="p-2.5 rounded-lg hover:bg-iu-blue/10 text-muted-foreground hover:text-iu-blue transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <h2 className="text-xl font-black text-foreground ml-2">
            {currentDate.toLocaleDateString(locale, {
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>

        <button
          onClick={() => setShowOptional(!showOptional)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border transition-all ${
            showOptional
              ? "bg-iu-blue/10 border-iu-blue/30 text-iu-blue"
              : "bg-background/50 border-border text-muted-foreground hover:border-iu-blue/30"
          }`}
        >
          {showOptional ? <Eye size={16} /> : <EyeOff size={16} />}
          {t.showOptional}
        </button>
      </div>
    </>
  );
}

