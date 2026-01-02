import { Link } from "react-router-dom";
import { Search, RotateCcw, Newspaper } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface NewsHeaderProps {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchButtonLabel: string;
  resetTitle: string;
  searchValue: string;
  onSearchClear: (form: HTMLFormElement) => void;
}

export function NewsHeader({
  title,
  subtitle,
  searchPlaceholder,
  searchButtonLabel,
  resetTitle,
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
        className="flex items-center gap-3 w-full lg:w-auto bg-card backdrop-blur-xl p-2 rounded-[2rem] border border-border shadow-xl"
      >
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

        <button className="hidden md:block px-6 py-3 bg-iu-blue text-white rounded-2xl text-sm font-black hover:bg-iu-blue/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-iu-blue/20 uppercase tracking-widest">
          {searchButtonLabel}
        </button>

        <Link
          to="/news"
          className="p-3 bg-muted text-muted-foreground rounded-2xl hover:bg-muted-foreground/10 transition-all"
          title={resetTitle}
        >
          <RotateCcw className="h-5 w-5" />
        </Link>
      </form>
    </PageHeader>
  );
}

