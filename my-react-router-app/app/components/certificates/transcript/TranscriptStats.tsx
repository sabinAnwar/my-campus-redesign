import { TrendingUp, GraduationCap } from "lucide-react";
import type { TranscriptStats as StatsType } from "~/types/transcript";

interface TranscriptStatsProps {
  t: any;
  stats: StatsType;
}

export function TranscriptStats({ t, stats }: TranscriptStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
      <div className="bg-iu-blue sm:rounded-[2.5rem] rounded-2xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
        <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <TrendingUp className="h-20 w-20 sm:h-32 sm:w-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl sm:rounded-2xl backdrop-blur-md">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">{t.gpa}</h3>
          </div>
          <p className="text-5xl sm:text-7xl font-black mb-2 sm:mb-4">{stats.gpa}</p>
          <p className="text-white text-base sm:text-lg font-bold">
            {t.gradeScaleText}
          </p>
        </div>
      </div>

      <div className="bg-iu-purple sm:rounded-[2.5rem] rounded-2xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
        <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <GraduationCap className="h-20 w-20 sm:h-32 sm:w-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl sm:rounded-2xl backdrop-blur-md">
              <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {t.totalCredits}
            </h3>
          </div>
          <p className="text-5xl sm:text-7xl font-black mb-2 sm:mb-4">{stats.totalCredits}</p>
          <p className="text-white text-base sm:text-lg font-bold">
            {t.modulesPassed(stats.passedCount)}
          </p>
        </div>
      </div>
    </div>
  );
}
