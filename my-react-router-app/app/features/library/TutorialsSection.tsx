import React from "react";
import { Lightbulb, Play, FileQuestion, ChevronRight } from "lucide-react";

interface TutorialItem {
  id: string;
  titleDe: string;
  titleEn: string;
  type: "video" | "guide";
  duration: string;
}

interface TutorialsSectionProps {
  tutorials: readonly TutorialItem[];
  language: "de" | "en";
  title: string;
  subtitle: string;
}

export function TutorialsSection({
  tutorials,
  language,
  title,
  subtitle,
}: TutorialsSectionProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-iu-orange/10 rounded-2xl">
            <Lightbulb className="h-8 w-8 text-iu-orange" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mt-1">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tutorials.map((tutorial) => (
          <div
            key={tutorial.id}
            className="group flex items-center gap-6 p-6 rounded-3xl border border-border/50 hover:border-iu-blue/50 hover:bg-iu-blue/5 transition-all duration-300 cursor-pointer"
          >
            <div
              className={`p-4 rounded-2xl ${tutorial.type === "video" ? "bg-iu-red/10" : "bg-iu-blue/10"} group-hover:scale-110 transition-transform duration-500`}
            >
              {tutorial.type === "video" ? (
                <Play className="h-6 w-6 text-iu-red" />
              ) : (
                <FileQuestion className="h-6 w-6 text-iu-blue" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-foreground group-hover:translate-x-1 transition-transform">
                {language === "de" ? tutorial.titleDe : tutorial.titleEn}
              </h3>
              <p className="text-sm text-foreground font-black uppercase tracking-widest mt-1">
                {tutorial.type === "video" ? "Video" : "Guide"} · {tutorial.duration}
              </p>
            </div>
            <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-iu-blue group-hover:translate-x-2 transition-all duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
