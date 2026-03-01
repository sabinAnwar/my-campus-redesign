import React from "react";
import { useLanguage } from "~/store/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative inline-flex items-center rounded-full border border-neutral-200/60 dark:border-white/5 bg-neutral-50/50 dark:bg-card/40 p-1 shadow-sm backdrop-blur-sm">
      {/* Sliding background with high-fidelity gradient */}
      <div
        className={`absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-iu-blue to-iu-purple shadow-lg shadow-iu-blue/20 transition-all duration-500 ease-in-out ${
          language === "en" ? "translate-x-[calc(100%)]" : "translate-x-0"
        }`}
      />
      
      {/* DE Button */}
      <button
        type="button"
        onClick={() => setLanguage("de")}
        className={`relative z-10 w-8 sm:w-11 py-1 sm:py-1.5 text-[9px] sm:text-xs font-black transition-colors duration-300 tracking-wider ${
          language === "de"
            ? "text-white"
            : "text-slate-900 dark:text-white hover:text-iu-blue dark:hover:text-white"
        }`}
      >
        DE
      </button>
      
      {/* EN Button */}
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`relative z-10 w-8 sm:w-11 py-1 sm:py-1.5 text-[9px] sm:text-xs font-black transition-colors duration-300 tracking-wider ${
          language === "en"
            ? "text-white"
            : "text-slate-900 dark:text-white hover:text-iu-blue dark:hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
