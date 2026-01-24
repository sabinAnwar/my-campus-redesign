import React from "react";
import { Info } from "lucide-react";

interface InfoCenterFooterProps {
  language: string;
}

export function InfoCenterFooter({ language }: InfoCenterFooterProps) {
  return (
    <div className="mt-12 p-6 rounded-[2rem] bg-iu-blue/5 dark:bg-iu-blue/20 border border-iu-blue/10 dark:border-iu-blue/30 flex items-start gap-4">
      <div className="p-2 rounded-xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white shrink-0">
        <Info size={20} />
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {language === "de"
          ? "Das Info Center wird regelmäßig mit neuen Dokumenten und Richtlinien aktualisiert. Bitte schaue regelmäßig vorbei, um auf dem neuesten Stand zu bleiben."
          : "The Info Center is regularly updated with new documents and guidelines. Please check back often to stay up to date."}
      </p>
    </div>
  );
}
