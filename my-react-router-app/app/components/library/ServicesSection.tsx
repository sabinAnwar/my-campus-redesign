import React from "react";
import { Users } from "lucide-react";
import { DynamicIcon } from "../ui/DynamicIcon";

interface ServiceItem {
  id: string;
  titleDe: string;
  titleEn: string;
  descDe: string;
  descEn: string;
  icon: any;
  color: string;
}

interface ServicesSectionProps {
  services: ServiceItem[];
  language: "de" | "en";
  title: string;
}

export function ServicesSection({ services, language, title }: ServicesSectionProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-iu-purple/10 rounded-2xl">
          <Users className="h-8 w-8 text-iu-purple" />
        </div>
        <h2 className="text-3xl font-black text-foreground tracking-tight">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="group p-6 rounded-3xl border border-border/50 hover:border-iu-blue/50 hover:bg-iu-blue/5 transition-all duration-300 cursor-pointer"
          >
            <div
              className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 bg-${service.color}/10 group-hover:scale-110 transition-transform duration-500`}
            >
              <DynamicIcon name={service.icon} className={`h-7 w-7 text-${service.color}`} />
            </div>
            <h3 className="font-black text-foreground text-base mb-2 group-hover:text-iu-blue transition-colors">
              {language === "de" ? service.titleDe : service.titleEn}
            </h3>
            <p className="text-xs text-muted-foreground font-bold leading-relaxed">
              {language === "de" ? service.descDe : service.descEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
