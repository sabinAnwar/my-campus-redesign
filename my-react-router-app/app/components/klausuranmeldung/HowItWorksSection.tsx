import React from "react";
import { Info, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

interface HowItWorksSectionProps {
  t: any;
}

export function HowItWorksSection({ t }: HowItWorksSectionProps) {
  const steps = [
    {
      step: "01",
      text: t.step1,
      icon: BookOpen,
      color: "emerald",
    },
    {
      step: "02",
      text: t.step2,
      icon: ArrowRight,
      color: "blue",
    },
    {
      step: "03",
      text: t.step3,
      icon: CheckCircle2,
      color: "violet",
    },
  ];

  return (
    <div className="rounded-[2.5rem] border border-border bg-card/30 backdrop-blur-xl p-8">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Info size={20} className="text-iu-blue" />
        {t.howItWorks}
      </h3>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="relative p-6 rounded-3xl bg-background/50 border border-border/50"
          >
            <div className="text-4xl font-black text-foreground absolute top-4 right-4">
              {item.step}
            </div>
            <item.icon
              size={24}
              className={`text-${item.color}-500 mb-4`}
            />
            <p className="text-sm font-bold text-foreground leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
