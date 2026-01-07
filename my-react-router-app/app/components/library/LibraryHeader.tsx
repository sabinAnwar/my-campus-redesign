import React from "react";
import { Library } from "lucide-react";

interface LibraryHeaderProps {
  title: string;
  subtitle: string;
}

export function LibraryHeader({ title, subtitle }: LibraryHeaderProps) {
  return (
    <header className="mb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white shadow-sm">
              <Library size={28} />
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">
              {title}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  );
}
