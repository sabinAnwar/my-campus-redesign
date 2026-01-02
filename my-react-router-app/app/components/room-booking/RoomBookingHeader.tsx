import { MapPin, Clock, Users } from "lucide-react";

interface RoomBookingHeaderProps {
  title: string;
  subtitle: string;
  dateLabel: string;
  liveStatus: string;
  occupiedLabel: string;
  occupiedCount: number;
}

export function RoomBookingHeader({
  title,
  subtitle,
  dateLabel,
  liveStatus,
  occupiedLabel,
  occupiedCount,
}: RoomBookingHeaderProps) {
  return (
    <header className="mb-6 sm:mb-8 md:mb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 lg:gap-8">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
              <MapPin className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              {title}
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {subtitle}
          </p>

          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-border bg-card/50 text-xs sm:text-sm font-medium w-fit">
            <Clock size={16} className="text-iu-blue" />
            <span>{dateLabel}</span>
          </div>
        </div>

        <div className="flex p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card/50 backdrop-blur-xl border border-border gap-3 sm:gap-4 items-center shadow-sm">
          <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-iu-blue/10 text-iu-blue">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              {liveStatus}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-foreground">
                {occupiedCount}
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                {occupiedLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
