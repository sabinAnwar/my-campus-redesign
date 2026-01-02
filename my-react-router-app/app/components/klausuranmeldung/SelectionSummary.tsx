import React from "react";
import { Award, Clock, GraduationCap, PlusCircle, ExternalLink } from "lucide-react";
import { STUDENT_DATA } from "~/constants/exam-registration";

interface SelectedCourse {
  id: string;
  name: string;
  credits: number;
  type: string;
}

interface SelectionSummaryProps {
  t: any;
  selectedCourseDetails: SelectedCourse[];
  onGoToApplication: () => void;
}

export function SelectionSummary({
  t,
  selectedCourseDetails,
  onGoToApplication,
}: SelectionSummaryProps) {
  return (
    <div className="rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl p-8 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-iu-blue/10 blur-[50px] rounded-full -translate-y-16 translate-x-16" />

      <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2 relative z-10">
        <Award size={20} className="text-iu-blue" />
        {t.summary}
      </h3>

      {selectedCourseDetails.length > 0 ? (
        <div className="space-y-8 relative z-10">
          {selectedCourseDetails.map((course) => (
            <div
              key={course.id}
              className="p-6 rounded-3xl bg-iu-blue/5 border border-iu-blue/10"
            >
              <p className="text-[10px] font-black text-iu-blue uppercase tracking-widest mb-2">
                {t.selectedCourse}
              </p>
              <h4 className="text-lg font-bold text-foreground mb-4">
                {course.name}
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
                  <Clock size={14} />
                  <span>{course.credits} ECTS</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
                  <GraduationCap size={14} />
                  <span>{course.type}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-muted-foreground">
                {t.firstName}
              </span>
              <span className="text-foreground">
                {STUDENT_DATA.vorname}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-muted-foreground">
                {t.lastName}
              </span>
              <span className="text-foreground">
                {STUDENT_DATA.nachname}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-muted-foreground">
                {t.matriculation}
              </span>
              <span className="text-foreground">
                {STUDENT_DATA.matrikelnummer}
              </span>
            </div>
          </div>

          <button
            onClick={onGoToApplication}
            className="w-full py-4 rounded-2xl bg-iu-blue text-white font-bold hover:bg-iu-blue transition-all shadow-lg shadow-iu-blue/20 flex items-center justify-center gap-2 group"
          >
            <span>{t.goToApplication}</span>
            <ExternalLink
              size={18}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </div>
      ) : (
        <div className="text-center py-12 space-y-4 relative z-10">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <PlusCircle
              size={32}
              className="text-muted-foreground/30"
            />
          </div>
          <p className="text-muted-foreground font-medium">
            {t.selectCourseHint}
          </p>
        </div>
      )}
    </div>
  );
}
