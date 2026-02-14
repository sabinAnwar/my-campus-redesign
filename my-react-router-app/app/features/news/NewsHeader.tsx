import { Link } from "react-router-dom";
import { Search, RotateCcw, Newspaper } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface NewsHeaderProps {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchButtonLabel: string;
  resetTitle: string;
  lang: string;
  searchValue: string;
  onSearchClear: (form: HTMLFormElement) => void;
}

export function NewsHeader({
  title,
  subtitle,
  searchPlaceholder,
  searchButtonLabel,
  resetTitle,
  lang,
  searchValue,
  onSearchClear,
}: NewsHeaderProps) {
  return (
    <PageHeader
      icon={Newspaper}
      title={title}
      subtitle={subtitle}
    >
      <form
        method="get"
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto bg-card p-2 rounded-[2rem] border border-slate-300 dark:border-slate-700 shadow-xl"
      >
        <input type="hidden" name="lang" value={lang} />
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            name="search"
            defaultValue={searchValue}
            placeholder={searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm font-bold"
            onChange={(e) => {
              if (e.target.value === "") {
                onSearchClear(e.currentTarget.form!);
              }
            }}
          />
        </div>

        <button className="px-5 sm:px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-xs sm:text-sm font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg uppercase tracking-widest w-full sm:w-auto">
          {searchButtonLabel}
        </button>

        <Link
          to={`/news?lang=${encodeURIComponent(lang)}`}
          className="p-3 bg-muted text-muted-foreground rounded-2xl hover:bg-muted-foreground/10 transition-all w-full sm:w-auto flex items-center justify-center"
          title={resetTitle}
        >
          <RotateCcw className="h-5 w-5" />
        </Link>
      </form>
    </PageHeader>
  );
}
