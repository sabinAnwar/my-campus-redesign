import React from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  /** Lucide icon component to display */
  icon: LucideIcon;
  /** Main page title */
  title: React.ReactNode;
  /** Optional subtitle/description */
  subtitle?: React.ReactNode;

  /** Optional back navigation URL */
  backTo?: string;
  /** Optional back navigation callback */
  onBack?: () => void;
  /** Optional back label text (default: "Back") */
  backLabel?: string;
  /** Optional icon background color class (default: bg-iu-blue/10) */
  iconBg?: string;
  /** Optional icon text color class (default: text-iu-blue) */
  iconColor?: string;
  /** Optional children for additional content (e.g., action buttons, badges) */
  children?: React.ReactNode;
  /** Optional className for the header container */
  className?: string;
}


/**
 * Unified page header component for consistent styling across all routes.
 */
export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  backTo,
  onBack,
  backLabel = "Back",
  iconBg = "bg-iu-blue/10 dark:bg-iu-blue",
  iconColor = "text-iu-blue dark:text-white",
  children,
  className = "",
}: PageHeaderProps) {
  const renderBack = () => {
    if (backTo) {
      return (
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-iu-blue dark:hover:text-white transition-colors mb-4 group font-bold"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {backLabel}
        </Link>
      );
    }
    if (onBack) {
      return (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-iu-blue dark:hover:text-white transition-colors mb-4 group font-bold"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {backLabel}
        </button>
      );
    }
    return null;
  };

  return (
    <header className={`mb-8 sm:mb-12 ${className}`}>
      {renderBack()}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 sm:p-3 rounded-2xl ${iconBg} ${iconColor} shadow-sm`}>
              <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight break-words leading-tight min-w-0 [hyphens:auto]">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        
        {children && (
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {children}
          </div>
        )}
      </div>
    </header>
  );
}

/**
 * Compact section header for use within pages.
 */
interface SectionHeaderProps {
  icon: LucideIcon;
  title: React.ReactNode;
  subtitle?: React.ReactNode;

  iconBg?: string;
  iconColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  iconBg = "bg-iu-blue/10 dark:bg-iu-blue",
  iconColor = "text-iu-blue dark:text-white",
  children,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-4 mb-8 sm:mb-10 ${className}`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`p-2.5 sm:p-3 rounded-2xl ${iconBg} ${iconColor}`}>
          <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-foreground tracking-tight break-words leading-tight min-w-0 [hyphens:auto]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground font-bold uppercase tracking-widest mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

