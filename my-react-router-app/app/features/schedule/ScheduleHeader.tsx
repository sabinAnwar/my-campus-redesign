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
        iconBg="bg-iu-blue/10 dark:bg-iu-blue"
        iconColor="text-iu-blue dark:text-white"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 lg:flex-row w-full">
            {/* View Toggle */}
            <div className="flex w-full sm:w-auto p-1.5 rounded-2xl bg-card/50 backdrop-blur-xl border border-border shadow-sm overflow-x-auto">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
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
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
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
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
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
              className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-2xl bg-card/50 backdrop-blur-xl border border-border text-foreground font-bold text-xs sm:text-sm hover:border-iu-blue/50 transition-all shadow-sm w-full sm:w-auto"
            >
              <Download size={18} className="text-iu-blue" />
              {t.downloadCalendar}
            </button>
          </div>
        </div>
      </PageHeader>

      {/* Controls & Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 p-4 sm:p-6 rounded-[2rem] bg-card/30 backdrop-blur-xl border border-border">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full">
          <div className="flex items-center gap-2 bg-background/50 rounded-xl p-1 border border-border">
            <button
              onClick={viewMode === "month" ? goToPrevMonth : goToPrevWeek}
              className="p-2.5 rounded-lg hover:bg-iu-blue/10 text-muted-foreground hover:text-iu-blue transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToToday}
              className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold text-foreground hover:text-iu-blue transition-colors"
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

          <h2 className="text-lg sm:text-xl font-black text-foreground ml-0 sm:ml-2">
            {currentDate.toLocaleDateString(locale, {
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>

        <button
          onClick={() => setShowOptional(!showOptional)}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all w-full sm:w-auto justify-center ${
            showOptional
              ? "bg-iu-blue/10 border-iu-blue/30 text-iu-blue dark:bg-iu-blue dark:text-white dark:border-iu-blue/40"
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
