import { Newspaper } from "lucide-react";

interface NewsEmptyStateProps {
  message: string;
}

export function NewsEmptyState({ message }: NewsEmptyStateProps) {
  return (
    <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 sm:p-14 lg:p-20 text-center shadow-2xl">
      <div className="inline-flex p-4 sm:p-6 bg-slate-100 dark:bg-white/5 rounded-2xl sm:rounded-3xl mb-5 sm:mb-6">
        <Newspaper className="h-9 w-9 sm:h-12 sm:w-12 text-slate-400" />
      </div>
      <p className="text-base sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
        {message}
      </p>
    </div>
  );
}
