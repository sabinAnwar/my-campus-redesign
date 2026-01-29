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
      color: "text-iu-blue",
      bgColor: "bg-iu-blue/10",
    },
    {
      label: t.newCount,
      value: stats.new,
      icon: Clock,
      color: "text-iu-teal",
      bgColor: "bg-iu-teal/10",
    },
    {
      label: t.pendingCount,
      value: stats.pending,
      icon: Clock,
      color: "text-iu-orange",
      bgColor: "bg-iu-orange/10",
    },
    {
      label: t.approvedCount,
      value: stats.approved,
      icon: CheckCircle,
      color: "text-iu-green",
      bgColor: "bg-iu-green/10",
    },
    {
      label: t.rejectedCount,
      value: stats.rejected,
      icon: XCircle,
      color: "text-iu-red",
      bgColor: "bg-iu-red/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 mb-8 sm:mb-12">
      {statConfig.map((stat, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all hover:border-slate-400 dark:hover:border-slate-500 shadow-sm duration-300"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className={`p-2 rounded-xl ${stat.bgColor} ${stat.color} dark:text-white`}>
              <stat.icon size={18} className="sm:size-5" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground">
              {stat.value}
            </span>
          </div>
          <div className="text-xs sm:text-sm font-black text-foreground">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
