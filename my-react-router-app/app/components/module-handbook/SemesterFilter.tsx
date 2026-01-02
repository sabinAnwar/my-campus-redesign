import React from "react";

interface SemesterFilterProps {
  t: any;
  semesterFilter: number | "all";
  setSemesterFilter: (val: number | "all") => void;
  semesterOptions: number[];
}

export function SemesterFilter({
  t,
  semesterFilter,
  setSemesterFilter,
  semesterOptions,
}: SemesterFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 mb-8">
      <h2 className="text-2xl font-black text-foreground uppercase tracking-widest">
        {t.modulesPerSemester}
      </h2>
      <div className="flex flex-wrap gap-2">
        {["all", ...semesterOptions].map((sem) => (
          <button
            key={sem}
            onClick={() => setSemesterFilter(sem as number | "all")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
              semesterFilter === sem
                ? "bg-iu-blue text-white border-iu-blue shadow-md"
                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {sem === "all" ? t.all : `${t.semester} ${sem}`}
          </button>
        ))}
      </div>
    </div>
  );
}
