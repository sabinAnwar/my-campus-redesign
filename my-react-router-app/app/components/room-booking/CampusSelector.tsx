import { MapPin } from "lucide-react";

interface CampusSelectorProps {
  campuses: string[];
  selectedCampus: string;
  onSelectCampus: (campus: string) => void;
}

export function CampusSelector({
  campuses,
  selectedCampus,
  onSelectCampus,
}: CampusSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {campuses.map((campus) => (
        <button
          key={campus}
          onClick={() => onSelectCampus(campus)}
          className={`inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl border text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${
            selectedCampus === campus
              ? "bg-iu-blue text-white border-iu-blue scale-105"
              : "bg-card/50 border-border text-muted-foreground hover:border-iu-blue/50 hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <MapPin
            className={`h-3 w-3 ${selectedCampus === campus ? "text-white" : "text-iu-blue"}`}
          />
          {campus}
        </button>
      ))}
    </div>
  );
}
