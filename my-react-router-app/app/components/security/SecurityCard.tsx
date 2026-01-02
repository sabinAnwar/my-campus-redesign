import type { LucideIcon } from "lucide-react";

interface SecurityCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  ruleLabel: string;
}

export function SecurityCard({
  id,
  title,
  description,
  icon: Icon,
  ruleLabel,
}: SecurityCardProps) {
  return (
    <div className="group relative bg-card/60 backdrop-blur-xl border border-border rounded-[2rem] p-6 hover:border-iu-blue/30 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Background Number */}
      <div className="absolute -right-4 -bottom-8 text-9xl font-black text-foreground/5 select-none transition-colors group-hover:text-iu-blue/5">
        {id}
      </div>

      <div className="relative z-10">
        {/* Icon & Badge */}
        <div className="flex justify-between items-start mb-6">
          <div
            className={`p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm group-hover:scale-110 transition-transform duration-500`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <span className="font-black text-iu-blue text-[10px] bg-iu-blue/10 border border-iu-blue/20 px-2 py-1 rounded-lg uppercase tracking-widest">
            {ruleLabel} {id}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-lg font-black text-foreground mb-3 tracking-tight group-hover:text-iu-blue transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground font-medium text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
