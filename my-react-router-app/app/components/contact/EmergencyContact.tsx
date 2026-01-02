import { AlertCircle, Phone } from "lucide-react";

interface EmergencyContactProps {
  t: any;
}

export function EmergencyContact({ t }: EmergencyContactProps) {
  return (
    <div className="bg-iu-red/5 border border-iu-red/20 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group hover:bg-iu-red/10 transition-all duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-iu-red/10 text-iu-red shadow-sm border border-iu-red/20">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-foreground tracking-tight">
            {t.emergency}
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            {t.emergencyDesc}
          </p>
        </div>
      </div>
      <div className="bg-card/80 backdrop-blur-md border border-iu-red/20 rounded-3xl p-6 shadow-2xl">
        <p className="text-[10px] font-black text-iu-red mb-3 uppercase tracking-[0.2em]">
          {t.emergency}
        </p>
        <a
          href="tel:+4940999999999"
          className="text-2xl font-bold text-iu-red hover:text-iu-red/80 transition-all flex items-center gap-3"
        >
          <Phone className="w-6 h-6" />
          +49 40 999 999 999
        </a>
      </div>
    </div>
  );
}
