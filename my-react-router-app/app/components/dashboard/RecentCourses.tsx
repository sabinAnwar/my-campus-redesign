import React from "react";
import { Link } from "react-router";
import { History, BookOpen, Clock, ArrowRight } from "lucide-react";
import {
  RECENT_COURSE_COLORS,
  RECENT_COURSE_ICON_COLORS,
} from "~/constants/dashboard";
import type { RecentCourse } from "~/types/dashboard";

interface RecentCoursesProps {
  recentCourses: RecentCourse[];
  language: string;
  t: any;
}

export function RecentCourses({ recentCourses, language, t }: RecentCoursesProps) {
  const getTimeText = (visited_at: number) => {
    const timeSince = Date.now() - visited_at;
    const hoursAgo = Math.floor(timeSince / (1000 * 60 * 60));
    const daysAgo = Math.floor(timeSince / (1000 * 60 * 60 * 24));

    if (hoursAgo < 1) {
      const minutesAgo = Math.floor(timeSince / (1000 * 60));
      return minutesAgo < 1
        ? t.justNow
        : t.minutesAgo.replace("[MINS]", minutesAgo.toString());
    } else if (hoursAgo < 24) {
      return t.hoursAgo.replace("[HOURS]", hoursAgo.toString());
    } else if (daysAgo === 1) {
      return t.yesterday;
    } else if (daysAgo < 30) {
      return t.daysAgo.replace("[DAYS]", daysAgo.toString());
    } else {
      return new Date(visited_at).toLocaleDateString(
        language === "de" ? "de-DE" : "en-US"
      );
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
        <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10 dark:bg-iu-blue dark:text-white dark:border-iu-blue/40">
          <History className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground flex items-center gap-2 sm:gap-3">
          {t.recentlyVisited}
        </h3>
      </div>
      <div className="bg-card/60 backdrop-blur-xl border border-border rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-iu-blue/5 blur-[100px] rounded-full -mr-48 -mt-48 transition-transform group-hover:scale-125 duration-1000" />
        <div className="relative z-10 flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue border border-iu-blue/20 shadow-inner dark:bg-iu-blue dark:text-white dark:border-iu-blue/40">
              <History className="h-6 w-6" />
            </div>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-iu-blue/10 text-iu-blue hover:bg-iu-blue hover:text-white font-bold text-sm transition-all group/btn dark:bg-iu-blue dark:text-white cursor-pointer"
          >
            {t.viewAllCourses}
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative z-10 flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 sm:gap-6 sm:pb-0 scrollbar-hide">
          {recentCourses.length === 0 ? (
            <div className="col-span-full w-full text-center py-20 bg-muted/20 rounded-[2rem] border border-dashed border-border px-8">
              <BookOpen className="h-16 w-16 text-muted-foreground dark:text-slate-200 mx-auto mb-6" />
              <p className="text-lg text-muted-foreground dark:text-slate-200 font-bold mb-8 leading-relaxed">
                {language === "de"
                  ? "Noch keine Kurse besucht"
                  : "No courses visited yet"}
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-4 w-full md:w-auto px-10 py-4 bg-iu-blue text-white rounded-2xl text-base font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-iu-blue/20 active:scale-95 cursor-pointer"
              >
                {t.explore}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            recentCourses.slice(0, 6).map((course) => {
              const timeText = getTimeText(course.visited_at);

              return (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className={`block min-w-[280px] sm:min-w-0 shrink-0 border rounded-[2rem] p-6 transition-all duration-300 bg-card/40 hover:bg-card hover:shadow-xl hover:-translate-y-1 group/card cursor-pointer ${
                    RECENT_COURSE_COLORS[
                      course.color as keyof typeof RECENT_COURSE_COLORS
                    ] || RECENT_COURSE_COLORS.blue
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`p-4 rounded-xl shadow-inner group-hover/card:scale-110 transition-transform ${
                        RECENT_COURSE_ICON_COLORS[
                          course.color as keyof typeof RECENT_COURSE_ICON_COLORS
                        ] || RECENT_COURSE_ICON_COLORS.blue
                      }`}
                    >
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-sm font-bold text-foreground truncate group-hover/card:text-amber-500 dark:group-hover/card:text-white transition-colors">
                        {course.name}
                      </h3>
                      <div className="text-[10px] font-black text-muted-foreground dark:text-slate-200 uppercase tracking-widest mt-0.5 flex items-center gap-3 leading-none">
                        <Clock className="h-3 w-3" />
                        <span>{timeText}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover/card:text-iu-blue group-hover/card:translate-x-1 transition-all dark:text-white dark:group-hover/card:text-white" />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
