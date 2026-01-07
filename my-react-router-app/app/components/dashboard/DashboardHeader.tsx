import React from "react";
import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  t: any;
  getGreeting: () => string;
}

export function DashboardHeader({ userName, t, getGreeting }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 md:gap-8 pb-4 sm:pb-6 border-b border-border/10 mb-6 sm:mb-8">
      <div className="flex-1 space-y-3 sm:space-y-4">
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight mb-1 sm:mb-2">
            {getGreeting()},{" "}
            <span className="text-iu-blue dark:text-white">{userName.split(" ")[0]}</span>{" "}
            <span className="inline-block animate-wave origin-[70%_70%]">
              
            </span>
          </h1>
          <p className="text-muted-foreground text-[10px] sm:text-xs lg:text-sm font-medium max-w-2xl leading-relaxed">
            {t.overview}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <Link
            to="/benefits"
            className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-iu-blue text-white font-bold text-sm sm:text-base hover:opacity-90 transition-all shadow-xl shadow-iu-blue/20 active:scale-95 group cursor-pointer"
          >
            {t.studentBenefits}
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="hidden md:flex justify-center md:justify-end w-full md:w-auto shrink-0">
        <div className="relative w-[80px] h-[80px] lg:w-[160px] lg:h-[160px] flex items-center justify-center">
          {/* Animated gradient ring */}
          <div className="absolute inset-0 bg-gradient-to-br from-iu-blue/30 via-iu-purple/30 to-iu-pink/30 rounded-[1.2rem] lg:rounded-[2.5rem] animate-pulse blur-xl lg:blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-iu-blue/20 via-iu-purple/20 to-iu-pink/20 rounded-[1.2rem] lg:rounded-[2.5rem] animate-spin-slow animate-duration-15s" />
            <div className="absolute inset-2 bg-card rounded-[1rem] lg:rounded-[2rem] shadow-2xl border border-border flex items-center justify-center backdrop-blur-3xl dark:border-slate-700">
              {/* Sparkles Icon with glow effect */}
              <div className="relative">
                <div className="absolute inset-0 blur-xl opacity-40 bg-iu-blue rounded-full"></div>
                <Sparkles className="relative w-6 h-6 lg:w-16 lg:h-16 text-iu-blue dark:text-white drop-shadow-[0_0_20px_rgba(36,94,235,0.5)] animate-bounce-slow" />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
