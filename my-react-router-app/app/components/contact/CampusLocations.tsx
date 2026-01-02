import { MapPin } from "lucide-react";

interface CampusLocationsProps {
  t: any;
}

export function CampusLocations({ t }: CampusLocationsProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
        <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
          <MapPin className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-black text-foreground tracking-tight">
          {t.campusLocations}
        </h3>
      </div>
      <div className="space-y-6">
        <LocationItem
          name="Hammerbrook"
          address={
            <>
              Hammerbrook 1<br />
              20537 Hamburg
            </>
          }
        />
        <LocationItem
          name="Waterloohain"
          address={
            <>
              Waterloohain 45<br />
              20099 Hamburg
            </>
          }
        />
      </div>
    </div>
  );
}

function LocationItem({ name, address }: { name: string; address: React.ReactNode }) {
  return (
    <div className="group p-6 rounded-3xl bg-background/50 border border-border hover:border-iu-blue/30 hover:bg-card hover:shadow-2xl transition-all duration-500">
      <p className="font-bold text-foreground mb-2 flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-iu-blue shadow-lg shadow-iu-blue/50"></span>
        {name}
      </p>
      <div className="text-muted-foreground font-medium leading-relaxed">
        {address}
      </div>
    </div>
  );
}
