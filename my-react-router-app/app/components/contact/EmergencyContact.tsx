import { AlertCircle, Phone } from "lucide-react";

interface EmergencyContactProps {
  t: any;
}

export function EmergencyContact({ t }: EmergencyContactProps) {
  return (
    <div className="bg-iu-red/5 dark:bg-iu-red/10 border border-iu-red/30 dark:border-iu-red/50 sm:rounded-[2.5rem] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden group hover:bg-iu-red/10 transition-all duration-500">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-red/10 dark:bg-iu-red text-iu-red dark:text-white shadow-sm border border-iu-red/20 shrink-0">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight truncate">
            {t.emergency}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium line-clamp-1">
            {t.emergencyDesc}
          </p>
        </div>
      </div>
      <div className="bg-card/80 dark:bg-card/60 backdrop-blur-md border border-iu-red/30 dark:border-iu-red/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl">
        <p className="text-[9px] sm:text-[10px] font-black text-iu-red dark:text-white mb-2 sm:mb-3 uppercase tracking-[0.2em]">
          {t.emergency}
        </p>
        <a
          href="tel:+4940999999999"
          className="text-lg sm:text-2xl font-bold text-iu-red dark:text-white hover:text-iu-red/80 dark:hover:text-white transition-all flex items-center gap-2 sm:gap-3 break-all"
        >
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          +49 40 999 999 999
        </a>
      </div>
    </div>
  );
}
