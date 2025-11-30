import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-0.5 shadow-inner">
      {/* Sliding background with glow */}
      <div
        className={`absolute top-0.5 h-[calc(100%-4px)] w-[calc(50%-2px)] rounded-full bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/50 dark:shadow-blue-500/30 transition-transform duration-200 ease-out ${
          language === "en" ? "translate-x-[calc(100%+2px)]" : "translate-x-0"
        }`}
      />
      
      {/* DE Button */}
      <button
        type="button"
        onClick={() => setLanguage("de")}
        className={`relative z-10 rounded-full px-3 py-1 text-xs font-bold transition-colors duration-200 ${
          language === "de"
            ? "text-white"
            : "text-neutral-500 dark:text-neutral-400"
        }`}
      >
        DE
      </button>
      
      {/* EN Button */}
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`relative z-10 rounded-full px-3 py-1 text-xs font-bold transition-colors duration-200 ${
          language === "en"
            ? "text-white"
            : "text-neutral-500 dark:text-neutral-400"
        }`}
      >
        EN
      </button>
    </div>
  );
}
