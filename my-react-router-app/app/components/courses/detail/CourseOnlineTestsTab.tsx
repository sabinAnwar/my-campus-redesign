import { Calendar, CheckCircle, ClipboardList, Clock, FileSearch, Play, Star } from "lucide-react";
import type { Course } from "~/types/courseDetail";

interface CourseOnlineTestsTabProps {
  course: Course;
  language: string;
}

export function CourseOnlineTestsTab({ course, language }: CourseOnlineTestsTabProps) {
  // We can assume resources are typed now, but let's be safe with filtering
  const onlineTests = course.resources?.filter((r) => r.type === "onlineTest" || r.type === "test") || [];
  const evaluations = course.resources?.filter((r) => r.type === "evaluation") || [];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-600">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h3 className="text-3xl lg:text-4xl font-black text-foreground tracking-tighter mb-2">
            {language === "de" ? "Wissen überprüfen" : "Knowledge Check"}
          </h3>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl">
            {language === "de"
              ? "Bereite dich optimal auf deine Prüfung vor mit unseren interaktiven Online-Tests und gebe wertvolles Feedback."
              : "Prepare optimally for your exam with our interactive online tests and provide valuable feedback."}
          </p>
        </div>
      </div>

      {/* Exam Date Information Card - Redesigned */}
      <div className="relative overflow-hidden rounded-[3rem] border border-iu-red/10 bg-gradient-to-br from-iu-red/5 to-transparent p-10 group shadow-2xl shadow-iu-red/5">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-iu-red/10 rounded-full blur-3xl pointer-events-none group-hover:bg-iu-red/20 transition-colors duration-700" />

        <div className="flex flex-col lg:flex-row lg:items-center gap-10 relative">
          <div className="p-6 rounded-3xl bg-iu-red text-white shadow-xl rotate-[-2deg]">
            <Calendar size={32} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h4 className="text-2xl font-black text-iu-red dark:text-white">
                {language === "de" ? "Nächste Prüfung" : "Upcoming Exam"}
              </h4>
              <span className="px-3 py-1 rounded-full bg-iu-red/10 dark:bg-iu-red text-iu-red dark:text-white text-[10px] font-black uppercase tracking-widest border border-iu-red/20 dark:border-iu-red animate-pulse">
                Live Status
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-iu-red/60 dark:text-white/60 uppercase tracking-widest">
                  {language === "de" ? "Datum & Zeit" : "Date & Time"}
                </p>
                <p className="text-2xl font-black text-foreground">
                  15. Feb 2025, 09:00
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-iu-red/60 dark:text-white/60 uppercase tracking-widest">
                  {language === "de" ? "Modus / Ort" : "Mode / Location"}
                </p>
                <p className="text-2xl font-black text-foreground">
                  Hörsaal H1 (Campus)
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-iu-red/60 dark:text-white/60 uppercase tracking-widest">
                  Anmeldung
                </p>
                <p className="text-2xl font-black text-iu-blue dark:text-white flex items-center gap-2">
                  <CheckCircle size={24} /> Bestätigt
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Online Tests Section */}
        {onlineTests.map((test) => (
          <div
            key={test.id}
            className="group relative rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-10 hover:border-iu-blue/30 transition-all shadow-sm hover:shadow-2xl"
          >
            <div className="flex items-start justify-between mb-10">
              <div className="p-5 rounded-3xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <CheckCircle size={32} />
              </div>
              <div className="px-4 py-1.5 rounded-xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white text-[9px] font-black uppercase tracking-[0.2em] border border-iu-blue/20 dark:border-iu-blue">
                Module Test
              </div>
            </div>
            <h4 className="text-2xl font-black text-foreground mb-4 group-hover:text-iu-blue dark:group-hover:text-white transition-colors tracking-tight">
              {test.title}
            </h4>
            <div className="flex items-center gap-6 mb-10 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Clock size={12} className="text-iu-blue dark:text-white" /> 45 Min
              </span>
              <span className="flex items-center gap-1.5">
                <ClipboardList size={12} className="text-iu-blue dark:text-white" /> 15 Fragen
              </span>
            </div>
            <a
              href={test.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-iu-blue text-white font-black rounded-2xl hover:bg-iu-blue transition-all shadow-xl shadow-iu-blue/25 active:scale-95 group/btn"
            >
              <Play
                size={20}
                className="fill-current group-hover:translate-x-1 transition-transform"
              />
              {language === "de" ? "Test starten" : "Start Test"}
            </a>
          </div>
        ))}

        {/* Evaluations Section */}
        {evaluations.map((evaluation) => (
          <div
            key={evaluation.id}
            className="group relative rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-10 hover:border-iu-purple/30 transition-all shadow-sm hover:shadow-2xl"
          >
            <div className="flex items-start justify-between mb-10">
              <div className="p-5 rounded-3xl bg-iu-purple/10 dark:bg-iu-purple text-iu-purple dark:text-white shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <Star size={32} />
              </div>
              <div className="px-4 py-1.5 rounded-xl bg-iu-purple/10 dark:bg-iu-purple text-iu-purple dark:text-white text-[9px] font-black uppercase tracking-[0.2em] border border-iu-purple/20 dark:border-iu-purple">
                Feedback
              </div>
            </div>
            <h4 className="text-2xl font-black text-foreground mb-4 group-hover:text-iu-purple dark:group-hover:text-white transition-colors tracking-tight">
              {evaluation.title}
            </h4>
            <p className="text-muted-foreground text-sm font-medium mb-10 leading-relaxed">
              {language === "de"
                ? "Deine Meinung zählt! Hilf uns das Modul zu verbessern."
                : "Your opinion matters! Help us improve the module content."}
            </p>
            <a
              href={evaluation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-iu-purple text-white font-black rounded-2xl hover:bg-iu-purple transition-all shadow-xl shadow-iu-purple/25 active:scale-95 group/btn"
            >
              <FileSearch
                size={20}
                className="group-hover:translate-y-[-2px] transition-transform"
              />
              {language === "de" ? "Feedback geben" : "Give Feedback"}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
