import React from "react";
import { Link } from "react-router";
import { CheckSquare, ArrowRight, CheckCircle2, Circle } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  course: string;
  workType: string;
  kind: string;
  dueDate: string;
  daysLeft: number;
  color: string;
  completed: boolean;
}

interface UpcomingTasksProps {
  upcomingAssignments: Assignment[];
  language: string;
  t: any;
}

export function UpcomingTasks({ upcomingAssignments, language, t }: UpcomingTasksProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
        <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-orange/10 text-iu-orange shadow-sm border border-iu-orange/10 dark:bg-iu-orange dark:text-white dark:border-iu-orange/40">
          <CheckSquare className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground flex items-center gap-2 sm:gap-3">
          {t.yourTasks}
        </h3>
      </div>
      <div className="relative group overflow-hidden bg-card/40 backdrop-blur-xl border border-border rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-xl transition-all duration-500 hover:shadow-iu-orange/10 h-full">
        <div className="absolute top-0 right-0 w-64 h-64 bg-iu-orange/10 blur-[100px] rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-125 duration-1000" />
        <div className="relative z-10 flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-iu-orange text-white shadow-[0_0_20px_rgba(242,148,0,0.3)] border border-iu-orange/50">
              <CheckSquare className="h-6 w-6" />
            </div>
          </div>
          <Link
            to="/tasks"
            className="p-2.5 rounded-full bg-muted/50 text-iu-orange hover:bg-iu-orange hover:text-white transition-all shadow-sm border border-border dark:bg-iu-orange dark:text-white dark:border-iu-orange/40 cursor-pointer"
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="relative z-10 space-y-3 sm:space-y-4">
          {upcomingAssignments.length > 0 ? (
            upcomingAssignments.slice(0, 3).map((assignment) => (
              <div
                key={assignment.id}
                className={`flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border transition-all duration-500 group/item ${
                  assignment.color === "blue"
                    ? "bg-iu-blue/5 border-iu-blue/20 hover:border-iu-blue/40 shadow-md dark:bg-iu-blue/20"
                    : "bg-iu-orange/5 border-iu-orange/20 hover:border-iu-orange/40 shadow-md dark:bg-iu-orange/20"
                }`}
              >
                <button className="mt-1 flex-shrink-0 group-hover/item:scale-110 transition-transform">
                  {assignment.completed ? (
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-iu-green dark:text-white" />
                  ) : (
                    <Circle
                      className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${
                        assignment.color === "blue"
                          ? "text-iu-blue/30 hover:text-iu-blue dark:text-white"
                          : "text-iu-orange/30 hover:text-iu-orange dark:text-white"
                      }`}
                    />
                  )}
                </button>
                <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                    <h3 className={`text-xs sm:text-sm font-bold transition-colors leading-tight break-words [hyphens:auto] ${
                      assignment.color === "blue"
                        ? "text-foreground group-hover/item:text-iu-blue"
                        : "text-foreground group-hover/item:text-iu-orange"
                    }`}>
                      {assignment.title}
                    </h3>
                    <span
                      className={`w-fit px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-widest border leading-none ${
                        assignment.color === "blue"
                          ? "bg-iu-blue/10 text-iu-blue border-iu-blue/20 dark:bg-iu-blue dark:text-white"
                          : "bg-iu-orange/10 text-iu-orange border-iu-orange/20 dark:bg-iu-orange dark:text-white"
                      }`}
                    >
                      {assignment.kind}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1.5 truncate">
                      {assignment.course}
                    </p>
                    <span
                      className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-0.5 shrink-0 ${
                        assignment.daysLeft <= 3
                          ? "text-iu-red"
                          : "text-muted-foreground"
                      }`}
                    >
                      {assignment.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground font-medium italic">
                {language === "de"
                  ? "Keine anstehenden Aufgaben"
                  : "No upcoming tasks"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
