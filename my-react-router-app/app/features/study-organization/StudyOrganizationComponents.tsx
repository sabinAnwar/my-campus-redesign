import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Wrench } from "lucide-react";

import type { NavigationCard, QuickLink } from "~/config/study-organization";

//// TYPES
//
interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge: string;
}

interface NavigationCardProps {
  card: NavigationCard;
  title: string;
  description: string;
  index: number;
}

interface QuickLinksProps {
  links: QuickLink[];
  translations: Record<string, string>;
}


export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <header className="mb-8 sm:mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-iu-blue/20 dark:bg-iu-blue text-iu-blue dark:text-white shadow-md">
              <Wrench size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {title}
            </h1>
          </div>
          <p className="text-base sm:text-lg text-foreground dark:text-foreground max-w-2xl leading-relaxed">
            {subtitle}
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-iu-blue/40 dark:border-iu-blue bg-iu-blue/15 dark:bg-iu-blue text-iu-blue dark:text-white text-xs sm:text-sm font-bold w-fit shadow-sm">
            <Wrench size={16} strokeWidth={2.5} />
            <span>{badge}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export function NavigationCardComponent({
  card,
  title,
  description,
  index,
}: NavigationCardProps) {
  const Icon = card.icon;

  return (
    <Link
      to={card.to}
      state={{ from: "/study-organization" }}
      className={`group relative overflow-hidden rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl p-6 sm:p-10 transition-all duration-500 hover:-translate-y-2 ${card.hoverBorder} animate-in fade-in slide-in-from-bottom-8 duration-700`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Card Gradient Glow */}
      <div
        className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-all duration-500 ${card.glow}`}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Icon and Arrow */}
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <div
            className={`p-3 sm:p-5 ${card.iconBg} rounded-3xl transition-all duration-500 group-hover:scale-110 shadow-md`}
          >
            <Icon className={`w-7 h-7 sm:w-10 sm:h-10 ${card.iconColor}`} strokeWidth={2} />
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-border/80 flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-500">
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-foreground dark:text-foreground group-hover:text-background transition-colors" strokeWidth={2.5} />
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-lg sm:text-xl font-black text-foreground mb-3 sm:mb-4 tracking-tight">
            {title}
          </h3>
          <p className="text-sm sm:text-lg text-foreground dark:text-foreground font-medium leading-relaxed group-hover:text-foreground transition-colors">
            {description}
          </p>
        </div>

        {/* Bottom Decorative Bar */}
        <div
          className={`mt-6 sm:mt-10 h-1.5 w-20 rounded-full bg-gradient-to-r ${card.gradient} opacity-70 group-hover:w-full group-hover:opacity-100 transition-all duration-700`}
        />
      </div>
    </Link>
  );
}

export function QuickLinksSection({ links, translations }: QuickLinksProps) {
  return (
    <div className="mt-12 sm:mt-20 p-6 sm:p-10 rounded-[3rem] bg-iu-blue/10 dark:bg-iu-blue/15 border border-iu-blue/20 dark:border-iu-blue/30 animate-in fade-in duration-1000">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-12">
        {links.map((link) => (
          <QuickLinkItem
            key={link.to}
            title={translations[link.titleKey]}
            description={translations[link.descKey]}
            linkText={translations[link.linkKey]}
            to={link.to}
            color={link.color}
          />
        ))}
      </div>
    </div>
  );
}

function QuickLinkItem({
  title,
  description,
  linkText,
  to,
  color,
}: {
  title: string;
  description: string;
  linkText: string;
  to: string;
  color: string;
}) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-foreground">{title}</h4>
      <p className="text-foreground dark:text-foreground text-sm leading-relaxed">
        {description}
      </p>
      <Link
        to={to}
        className={`inline-flex items-center gap-2 ${color} font-bold text-sm hover:underline underline-offset-2`}
      >
        {linkText}
        <ChevronRight size={14} strokeWidth={2.5} />
      </Link>
    </div>
  );
}
