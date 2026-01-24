import { MapPin } from "lucide-react";

interface CampusLocationsProps {
  t: any;
}

export function CampusLocations({ t }: CampusLocationsProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border sm:rounded-[2.5rem] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-border/50">
        <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white shadow-sm border border-iu-blue/10 shrink-0">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
          {t.campusLocations}
        </h3>
      </div>
      <div className="space-y-4 sm:space-y-6">
        <LocationItem
          name="Christoph-Probst-Weg"
          address={
            <>
              Christoph-Probst-Weg 1<br />
              20246 Hamburg
            </>
          }
        />
      </div>
    </div>
  );
}

function LocationItem({ name, address }: { name: string; address: React.ReactNode }) {
  return (
    <div className="group p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-background/50 border border-border hover:border-iu-blue/30 hover:bg-card hover:shadow-2xl transition-all duration-500">
      <p className="font-bold text-sm sm:text-base text-foreground mb-1.5 sm:mb-2 flex items-center gap-2 sm:gap-3">
        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-iu-blue shadow-lg shadow-iu-blue/50"></span>
        {name}
      </p>
      <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
        {address}
      </div>
    </div>
  );
}
