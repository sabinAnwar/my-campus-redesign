import { TrendingUp, GraduationCap } from "lucide-react";
import type { TranscriptStats as StatsType } from "~/types/transcript";

interface TranscriptStatsProps {
  t: any;
  stats: StatsType;
}

export function TranscriptStats({ t, stats }: TranscriptStatsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-8 sm:mb-12">
      <div className="bg-iu-blue rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <TrendingUp className="h-32 w-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">{t.gpa}</h3>
          </div>
          <p className="text-7xl font-black mb-4">{stats.gpa}</p>
          <p className="text-white/80 text-lg font-bold">
            {t.gradeScaleText}
          </p>
        </div>
      </div>

      <div className="bg-iu-purple rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <GraduationCap className="h-32 w-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">
              {t.totalCredits}
            </h3>
          </div>
          <p className="text-7xl font-black mb-4">{stats.totalCredits}</p>
          <p className="text-white/80 text-lg font-bold">
            {t.modulesPassed(stats.passedCount)}
          </p>
        </div>
      </div>
    </div>
  );
}
