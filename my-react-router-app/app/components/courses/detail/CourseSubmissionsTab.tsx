import { Calendar, CheckCircle, ClipboardList, Clock, FileText, GraduationCap, Plus } from "lucide-react";
import type { CourseSubmission } from "~/types/course";
import type { TranslationType } from "~/types/courseDetail";

interface CourseSubmissionsTabProps {
  language: string;
  t: TranslationType;
  submissions: CourseSubmission[];
  translate: (val: string) => string;
  openModal: (submission: CourseSubmission) => void;
}

export function CourseSubmissionsTab({ language, t, submissions, translate, openModal }: CourseSubmissionsTabProps) {
  // ... existing code ...
  return (
    <div className="space-y-4 sm:space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 md:gap-8 mb-2 sm:mb-4">
        <div className="max-w-xl">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tighter mb-1 sm:mb-2 md:mb-3">
            {t.submissions}
          </h3>
  {/* The rest is identical to previous version, just ensuring 't' is typed */}
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-medium">
            {language === "de"
              ? "Behalte deine Deadlines im Auge und verwalte deine schriftlichen Ausarbeitungen an einem zentralen Ort."
              : "Keep track of your deadlines and manage your written assignments in one central place."}
          </p>
        </div>
        <button className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl md:rounded-2xl bg-iu-blue text-white font-bold sm:font-black text-xs sm:text-sm hover:bg-iu-blue transition-all shadow-xl shadow-iu-blue/25 flex items-center gap-2 sm:gap-3 active:scale-95 group">
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden sm:inline">
            {language === "de" ? "Hausarbeit abgeben" : "Submit Assignment"}
          </span>
          <span className="sm:hidden">
            {language === "de" ? "Abgeben" : "Submit"}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-5">
        {submissions.length === 0 ? (
          <div className="rounded-xl sm:rounded-2xl md:rounded-[3rem] border-2 border-dashed border-border/40 p-8 sm:p-12 md:p-20 text-center bg-muted/5">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl md:rounded-3xl bg-muted/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-muted-foreground opacity-30" />
            </div>
            <h4 className="text-base sm:text-lg md:text-xl font-black text-foreground mb-1 sm:mb-2">
              Keine Abgaben gefunden
            </h4>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">
              {language === "de"
                ? "Für dieses Modul sind aktuell keine Abgaben hinterlegt."
                : "No submissions are currently registered for this module."}
            </p>
          </div>
        ) : (
          submissions.map((assignment: CourseSubmission) => {
            const isExam =
              assignment.type === "Klausur" ||
              assignment.type === "Online-Klausur";
            const isSubmitted = assignment.status === "submitted";

            return (
              <div
                key={assignment.id}
                className={`group relative rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-4 sm:p-6 md:p-10 hover:border-iu-blue/30 transition-all shadow-sm hover:shadow-2xl hover:shadow-iu-blue/5 ${isSubmitted ? "opacity-90" : ""}`}
              >
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6 md:gap-10">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-5 md:gap-8 flex-1">
                    <div
                      className={`p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl md:rounded-[2rem] shadow-inner transition-transform duration-500 group-hover:scale-110 flex-shrink-0 ${isExam ? "bg-iu-red/10 text-iu-red" : "bg-iu-blue/10 text-iu-blue"}`}
                    >
                      {isExam ? (
                        <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10" />
                      ) : (
                        <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10" />
                      )}
                    </div>

                    <div className="space-y-1 sm:space-y-2 md:space-y-3 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h4 className="text-base sm:text-lg md:text-2xl font-black text-foreground group-hover:text-iu-blue transition-colors tracking-tight truncate max-w-[200px] sm:max-w-sm">
                          {assignment.title}
                        </h4>
                        {isSubmitted && (
                          <div className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-iu-blue/10 text-iu-blue text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest border border-iu-blue/20 flex items-center gap-1">
                            <CheckCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                            ERFOLGREICH
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6">
                        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 text-xs sm:text-sm">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-iu-blue/60" />
                          <span className="text-muted-foreground font-medium lowercase hidden sm:inline">
                            Deadline:
                          </span>
                          <span
                            className={`font-bold sm:font-black tracking-tight ${assignment.daysUntilDue < 7 ? "text-iu-red" : "text-foreground"}`}
                          >
                            {assignment.dueDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 text-xs sm:text-sm">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-iu-blue/60" />
                          <span className="text-muted-foreground font-medium lowercase hidden sm:inline">
                            Typ:
                          </span>
                          <span className="font-bold sm:font-black text-foreground uppercase text-[10px] sm:text-[11px] tracking-wider">
                            {translate(assignment.type)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
                    {isSubmitted &&
                      assignment.similarity !== undefined && (
                        <div className="flex flex-col items-end px-3 sm:px-4 md:px-6 border-r border-border/30">
                          <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-wider sm:tracking-widest mb-0.5 sm:mb-1">
                            KI
                          </span>
                          <span className="text-base sm:text-lg md:text-xl font-black text-iu-blue">
                            {assignment.similarity}%
                          </span>
                        </div>
                      )}

                    {!assignment.title
                      .toLowerCase()
                      .includes("klausur") && (
                      <button
                        onClick={() => openModal(assignment)}
                        className={`px-4 sm:px-6 md:px-10 py-2.5 sm:py-3 md:py-5 rounded-lg sm:rounded-xl md:rounded-2xl font-bold sm:font-black transition-all active:scale-95 text-xs sm:text-sm min-w-[100px] sm:min-w-[140px] md:min-w-[180px] ${
                          isSubmitted
                            ? "bg-muted/50 text-foreground hover:bg-muted border border-border/50"
                            : "bg-iu-blue text-white hover:bg-iu-blue shadow-xl shadow-iu-blue/30"
                        }`}
                      >
                        {isSubmitted
                          ? language === "de"
                            ? "Abgabe ansehen"
                            : "View Submission"
                          : language === "de"
                            ? "Jetzt abgeben"
                            : "Submit Now"}
                      </button>
                    )}

                    {isExam && (
                      <div className="px-8 py-4 rounded-2xl bg-iu-red/5 border border-iu-red/10 text-iu-red font-black text-sm uppercase tracking-widest">
                        Externes Portal
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
