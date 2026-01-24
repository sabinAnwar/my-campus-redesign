import { AlertCircle, CalendarDays, ClipboardCheck, MapPin, BookOpen, Calendar, CalendarCheck, GraduationCap, BarChart3, Clock, CheckCircle, Mail, MessageSquare, FileText, Book, Plus, ClipboardList } from "lucide-react";
import { getTranslatedDescription } from "~/data/coursesConfig";
import type { Course, TranslationType } from "~/types/courseDetail";
import type { CourseSubmission } from "~/types/course";

interface CourseOverviewTabProps {
  course: Course;
  language: string;
  t: TranslationType;
  submissions: CourseSubmission[];
  translate: (val: string) => string;
  onTabChange: (tabId: string) => void;
}

export function CourseOverviewTab({ course, language, t, submissions, translate, onTabChange }: CourseOverviewTabProps) {
  const examTask = submissions.find(
    (s) => s.type === "Online-Klausur" || s.type === "Klausur"
  ) || submissions[0];

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-500">
      {/* ... rest of the component content is identical ... */}
      {/* I will use the exact same logic but typed */}
      {/* Exam Information Banner */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-iu-blue/20 bg-gradient-to-br from-iu-blue/10 via-background to-background p-4 sm:p-5 lg:p-6 shadow-2xl shadow-iu-blue/5">
        <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-iu-blue/10 rounded-full blur-[80px] -mr-24 sm:-mr-48 -mt-24 sm:-mt-48 animate-pulse" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 lg:gap-10">
          <div className="flex items-start gap-3 sm:gap-6">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-iu-blue text-white shadow-xl shadow-iu-blue/20 rotate-[-4deg]">
              <AlertCircle className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-foreground mb-1 sm:mb-2 flex items-center gap-2">
                {language === "de" ? "Wichtige Prüfungsinformation" : "Important Exam Information"}
                <span className="flex h-2 w-2 rounded-full bg-iu-blue animate-ping" />
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-lg font-medium leading-relaxed">
                {language === "de"
                  ? "Verpasse keine Termine! Hier findest du alle relevanten Details für deine bevorstehende Modulprüfung."
                  : "Don't miss any deadlines! Here you'll find all relevant details for your upcoming module exam."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full lg:w-auto">
            <StatItem icon={CalendarDays} label="Datum" value={examTask?.due_date || "—"} />
            <StatItem icon={ClipboardCheck} label="Form" value={examTask ? translate(examTask.type) : "—"} />
            <StatItem icon={MapPin} label="Ort" value={examTask?.type === "Online-Klausur" ? "Online" : "Hörsaal H1"} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8 lg:items-start">
        {/* Left Column (Description & Stats) */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Course Description Card */}
          <div className="group relative rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-4 sm:p-6 md:p-10 lg:p-12 shadow-sm transition-all hover:shadow-2xl hover:shadow-iu-blue/5 hover:border-iu-blue/20 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-iu-blue/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-foreground mb-3 sm:mb-6 md:mb-8 flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 md:p-3.5 rounded-xl sm:rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white border border-iu-blue/20 dark:border-iu-blue group-hover:rotate-3 transition-transform">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              {t.courseDescription}
            </h3>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed font-medium mb-5 sm:mb-8 md:mb-10">
                {getTranslatedDescription(course.description || "", language as "de" | "en")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <DateCard icon={Calendar} label={t.startDate} value={course.startDate} />
              <DateCard icon={CalendarCheck} label={t.endDate} value={course.endDate} />
            </div>
          </div>

          {/* Advanced Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            <AdvancedStatCard icon={GraduationCap} label="ECTS" value={`${course.credits} CP`} subLabel="Studienaufwand" />
            <ProgressStatCard icon={BarChart3} label="Stats" value={`${course.progress}%`} progress={course.progress} subLabel="Fortschritt" />
            <AdvancedStatCard icon={Clock} label="Time" value="Winter 24" subLabel="Aktuelles Semester" />
          </div>
        </div>

        {/* Right Column (Instructor & Tools) */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6 md:space-y-8">
          <ForumCard language={language} onGoToForum={() => onTabChange("forum")} />
          <QuickLinksCard language={language} />
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-card border border-border/50 shadow-sm hover:border-iu-blue/30 transition-all group/stat">
      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 text-iu-blue dark:text-white">
        <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover/stat:scale-110 transition-transform" />
        <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-wider sm:tracking-widest">
          {label}
        </span>
      </div>
      <p className="text-[10px] sm:text-xs md:text-base font-black text-foreground truncate">
        {value}
      </p>
    </div>
  );
}

function DateCard({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="relative p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl md:rounded-3xl bg-muted/20 border border-border/30 group/item transition-all hover:bg-iu-blue/5 hover:border-iu-blue/20">
      <div className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-iu-blue dark:text-white uppercase tracking-wider sm:tracking-[0.2em] mb-1 sm:mb-2 md:mb-3">
        {label}
      </div>
      <div className="text-sm sm:text-lg md:text-2xl font-black text-foreground flex items-center gap-2 sm:gap-3">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-iu-blue/40 dark:text-white" />
        {value}
      </div>
    </div>
  );
}

function AdvancedStatCard({ icon: Icon, label, value, subLabel }: { icon: any, label: string, value: string, subLabel: string }) {
  return (
    <div className="group p-3 sm:p-5 md:p-8 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl hover:border-iu-blue/30 transition-all shadow-sm">
      <div className="flex items-center justify-between mb-3 sm:mb-5 md:mb-8">
        <div className="p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </div>
        <div className="text-[7px] sm:text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-wider sm:tracking-widest">
          {label}
        </div>
      </div>
      <div className="text-lg sm:text-xl md:text-2xl font-black text-foreground tracking-tighter truncate">
        {value}
      </div>
      <p className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground mt-1 sm:mt-2 md:mt-3 font-bold uppercase tracking-wide sm:tracking-wider opacity-60 hidden sm:block">
        {subLabel}
      </p>
    </div>
  );
}

function ProgressStatCard({ icon: Icon, label, value, progress, subLabel }: { icon: any, label: string, value: string, progress: number, subLabel: string }) {
  return (
    <div className="group p-3 sm:p-5 md:p-8 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl hover:border-iu-blue/30 transition-all shadow-sm">
      <div className="flex items-center justify-between mb-3 sm:mb-5 md:mb-8">
        <div className="p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </div>
        <div className="text-[7px] sm:text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-wider sm:tracking-widest">
          {label}
        </div>
      </div>
      <div className="text-lg sm:text-xl md:text-2xl font-black text-foreground tracking-tighter">
        {value}
      </div>
      <div className="mt-2 sm:mt-3 md:mt-5 space-y-1 sm:space-y-2">
        <div className="w-full bg-muted/30 rounded-full h-1 sm:h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-iu-blue to-iu-blue h-full rounded-full progress-bar shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[7px] sm:text-[9px] md:text-[10px] text-muted-foreground font-black uppercase tracking-wider sm:tracking-widest opacity-60 hidden sm:block">
          {subLabel}
        </p>
      </div>
    </div>
  );
}

function ForumCard({ language, onGoToForum }: { language: string; onGoToForum: () => void }) {
  return (
    <div className="rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-iu-blue/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center gap-4 mb-4 sm:mb-6">
        <div className="p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white group-hover:rotate-6 transition-transform shadow-sm">
          <MessageSquare size={24} />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-black text-foreground">
            {language === "de" ? "Modulforum" : "Module Forum"}
          </h3>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
            {language === "de" ? "Aktuelle Diskussionen" : "Live Discussions"}
          </p>
        </div>
      </div>

      <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-6 leading-relaxed">
        {language === "de"
          ? "Tausche dich mit Kommilitonen über Kursinhalte aus, stelle Fragen und teile dein Wissen."
          : "Exchange ideas with fellow students about course content, ask questions and share your knowledge."}
      </p>

      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40 mb-6">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold">
              {String.fromCharCode(64 + i)}
            </div>
          ))}
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          +12 {language === "de" ? "aktiv" : "active"}
        </span>
      </div>

      <button 
        onClick={onGoToForum}
        className="w-full py-3 rounded-xl bg-iu-blue text-white font-bold text-xs uppercase tracking-widest hover:bg-iu-blue transition-all shadow-lg shadow-iu-blue/15 active:scale-95"
      >
        {language === "de" ? "Zum Forum" : "Go to Forum"}
      </button>
    </div>
  );
}

function InstructorCard({ course, language }: { course: Course, language: string }) {
  return (
    <div className="rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-4 sm:p-6 md:p-10 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-iu-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4 sm:mb-6 md:mb-8">
          <div className="absolute inset-0 bg-iu-blue/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-iu-blue to-iu-blue flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-black shadow-2xl relative z-10 border-2 sm:border-4 border-card group-hover:scale-105 group-hover:rotate-2 transition-all duration-500">
            {course.instructor?.charAt(0) || "?"}
          </div>
          <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-lg sm:rounded-xl bg-iu-blue border-2 sm:border-4 border-card flex items-center justify-center text-white shadow-lg z-20">
            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 fill-current" />
          </div>
        </div>

        <h4 className="text-lg sm:text-xl md:text-2xl font-black text-foreground tracking-tight mb-0.5 sm:mb-1">
          {course.instructor}
        </h4>
        <p className="text-[8px] sm:text-[9px] md:text-[10px] text-iu-blue dark:text-white font-black uppercase tracking-widest sm:tracking-[0.2em] mb-4 sm:mb-6 md:mb-10">
          {language === "de" ? "Modulverantwortlicher" : "Module Coordinator"}
        </p>

        <div className="w-full space-y-2 sm:space-y-3">
          <a
            href={`mailto:${course.instructor?.toLowerCase().replace(" ", ".")}@iu-fernstudium.de`}
            className="w-full p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl bg-muted/20 border border-border/30 flex items-center justify-center gap-2 sm:gap-3 hover:bg-iu-blue/10 dark:hover:bg-iu-blue hover:text-iu-blue dark:hover:text-foreground dark:text-white hover:border-iu-blue/20 dark:hover:border-iu-blue transition-all group/mail"
          >
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-iu-blue dark:text-white group-hover/mail:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-black text-foreground">
              Email
            </span>
          </a>

          <button className="w-full py-3 sm:py-4 rounded-lg sm:rounded-xl md:rounded-2xl bg-iu-blue text-white font-bold sm:font-black text-xs sm:text-sm hover:bg-iu-blue transition-all shadow-xl shadow-iu-blue/25 active:scale-95 flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            {language === "de" ? "Nachricht" : "Message"}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickLinksCard({ language }: { language: string }) {
  return (
    <div className="rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-sm">
      <h3 className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest sm:tracking-[0.2em] mb-4 sm:mb-6 md:mb-8 px-1 sm:px-2">
        {language === "de" ? "Wichtige Dokumente" : "Critical Documents"}
      </h3>
      <div className="space-y-1 sm:space-y-2">
        <LinkItem 
          label="Modulhandbuch" 
          icon={FileText} 
          color="text-iu-blue" 
          href="/uploads/modulhandbuch-winfo.pdf"
          download="Modulhandbuch_Wirtschaftsinformatik.pdf"
        />
        <LinkItem 
          label="Prüfungsordnung" 
          icon={ClipboardList} 
          color="text-iu-purple" 
          href="/uploads/pruefungsordnung.pdf"
          download="Prüfungsordnung.pdf"
        />
        <LinkItem 
          label="Literaturliste" 
          icon={Book} 
          color="text-iu-orange" 
          href="/uploads/literaturliste.pdf"
          download="Literaturliste.pdf"
        />
      </div>
    </div>
  );
}

function LinkItem({ label, icon: Icon, color, href, download }: { label: string, icon: any, color: string, href?: string, download?: string }) {
  const content = (
    <div className="w-full flex items-center justify-between p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl hover:bg-muted/40 transition-all group">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <div className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-card border border-border group-hover:scale-110 transition-transform ${color}`}>
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
        </div>
        <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
          {label}
        </span>
      </div>
      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-iu-blue dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
    </div>
  );

  if (href) {
    return (
      <a href={href} download={download} className="block w-full">
        {content}
      </a>
    );
  }

  return (
    <button className="w-full text-left">
      {content}
    </button>
  );
}
