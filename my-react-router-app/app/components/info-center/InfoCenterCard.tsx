import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface InfoCenterCardProps {
  to: string;
  icon: LucideIcon;
  backgroundIcon: LucideIcon;
  title: string;
  description: string;
  badge: {
    text: string;
    icon?: LucideIcon;
    variant: "blue" | "amber";
  };
  t: any;
}

export function InfoCenterCard({
  to,
  icon: Icon,
  backgroundIcon: BackgroundIcon,
  title,
  description,
  badge,
  t,
}: InfoCenterCardProps) {
  const badgeClasses =
    badge.variant === "amber"
      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
      : "bg-iu-blue/10 text-iu-blue border-iu-blue/20";

  return (
    <Link
      to={to}
      state={{ from: "/info-center" }}
      className="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl p-8 transition-all duration-500 hover:border-iu-blue/50 hover:shadow-2xl hover:shadow-iu-blue/10 no-underline"
    >
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <BackgroundIcon size={120} className="text-iu-blue" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue group-hover:scale-110 transition-transform duration-500">
            <Icon size={28} />
          </div>
          <span
            className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1 ${badgeClasses}`}
          >
            {badge.icon && <badge.icon size={12} />}
            {badge.text}
          </span>
        </div>

        <h2 className="text-xl font-black text-foreground mb-3 group-hover:text-iu-blue transition-colors">
          {title}
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          {description}
        </p>

        <div className="flex items-center gap-2 text-iu-blue font-bold text-sm uppercase tracking-widest">
          {t.viewMore}
          <ArrowRight
            size={16}
            className="group-hover:translate-x-2 transition-transform"
          />
        </div>
      </div>
    </Link>
  );
}
