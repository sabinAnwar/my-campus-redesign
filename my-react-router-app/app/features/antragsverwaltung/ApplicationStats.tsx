import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

interface ApplicationStatsProps {
  t: any;
  stats: {
    total: number;
    new: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export function ApplicationStats({ t, stats }: ApplicationStatsProps) {
  const statConfig = [
    {
      label: t.totalApplications,
      value: stats.total,
      icon: FileText,
      color: "text-blue-500 dark:text-white",
      bgColor: "bg-blue-500/10 dark:bg-iu-blue",
    },
    {
      label: t.newCount,
      value: stats.new,
      icon: Clock,
      color: "text-blue-500 dark:text-white",
      bgColor: "bg-blue-500/10 dark:bg-blue-500",
    },
    {
      label: t.pendingCount,
      value: stats.pending,
      icon: Clock,
      color: "text-amber-500 dark:text-white",
      bgColor: "bg-amber-500/10 dark:bg-amber-500",
    },
    {
      label: t.approvedCount,
      value: stats.approved,
      icon: CheckCircle,
      color: "text-iu-blue dark:text-white",
      bgColor: "bg-iu-blue/10 dark:bg-iu-blue",
    },
    {
      label: t.rejectedCount,
      value: stats.rejected,
      icon: XCircle,
      color: "text-rose-500 dark:text-white",
      bgColor: "bg-rose-500/10 dark:bg-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 mb-8 sm:mb-12">
      {statConfig.map((stat, i) => (
        <div
          key={i}
          className="bg-card/50 backdrop-blur-xl border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all hover:scale-[1.02] shadow-sm hover:shadow-md duration-300"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className={`p-2 rounded-xl ${stat.bgColor} ${stat.color}`}>
              <stat.icon size={18} className="sm:size-5" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground">
              {stat.value}
            </span>
          </div>
          <div className="text-xs sm:text-sm font-medium text-muted-foreground">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
