import { Users, MapPin, Clock } from "lucide-react";

interface OccupancyRow {
  room: string;
  purpose: string;
  person: string;
  until: string;
  key: string;
}

interface OccupancyTableProps {
  rows: OccupancyRow[];
  selectedLocation: string;
  labels: {
    whoUsesRoom: string;
    room: string;
    where: string;
    purpose: string;
    until: string;
    noOccupancies: string;
  };
}

export function OccupancyTable({
  rows,
  selectedLocation,
  labels,
}: OccupancyTableProps) {
  return (
    <div className="bg-card/50 backdrop-blur-2xl border border-border rounded-2xl sm:rounded-[2.5rem] overflow-hidden">
      <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-8 border-b border-border">
        <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10 dark:bg-iu-blue dark:text-white dark:border-iu-blue/40">
          <Users className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground tracking-tight">
          {labels.whoUsesRoom}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-3 sm:px-6 md:px-10 py-3 sm:py-4 font-bold text-[10px] sm:text-xs">
                {labels.room}
              </th>
              <th className="text-left px-3 sm:px-6 md:px-10 py-3 sm:py-4 font-bold text-[10px] sm:text-xs hidden sm:table-cell">
                {labels.where}
              </th>
              <th className="text-left px-3 sm:px-6 md:px-10 py-3 sm:py-4 font-bold text-[10px] sm:text-xs">
                {labels.purpose}
              </th>
              <th className="text-left px-3 sm:px-6 md:px-10 py-3 sm:py-4 font-bold text-[10px] sm:text-xs">
                {labels.until}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 sm:px-10 py-6 sm:py-10 text-muted-foreground font-bold italic text-center text-sm sm:text-base"
                >
                  {labels.noOccupancies}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.key}
                  className="hover:bg-muted/30 transition-all duration-300 group"
                >
                  <td className="px-3 sm:px-6 md:px-10 py-3 sm:py-4 md:py-6 font-bold text-foreground text-sm sm:text-base md:text-lg group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
                    {row.room}
                  </td>
                  <td className="px-3 sm:px-6 md:px-10 py-3 sm:py-4 md:py-6 hidden sm:table-cell">
                    <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-lg bg-muted/50 border border-border text-muted-foreground font-bold text-[10px] sm:text-xs">
                      <MapPin className="h-3 w-3 text-iu-blue dark:text-white" />
                      {selectedLocation}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 md:px-10 py-3 sm:py-4 md:py-6 text-muted-foreground font-medium">
                    <span className="text-foreground font-bold text-xs sm:text-sm">
                      {row.purpose}
                    </span>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 font-bold">
                      {row.person}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 md:px-10 py-3 sm:py-4 md:py-6">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 text-iu-blue dark:text-white font-bold text-sm sm:text-base">
                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {row.until}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
