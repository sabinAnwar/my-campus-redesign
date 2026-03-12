import { ClipboardList } from "lucide-react";

interface PraxisberichtHeaderProps {
  title: string;
  subtitle: string;
}

export function PraxisberichtHeader({
  title,
  subtitle,
}: PraxisberichtHeaderProps) {
  return (
    <header className="mb-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-iu-blue/10 dark:bg-iu-blue/20 text-iu-blue">
              <ClipboardList size={24} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {title}
            </h1>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  );
}
