import { Link } from "react-router-dom";

interface NewsPaginationProps {
  pages: number;
  currentPage: number;
  params: URLSearchParams;
}

export function NewsPagination({ pages, currentPage, params }: NewsPaginationProps) {
  if (pages <= 1) return null;

  return (
    <div className="mt-16 flex justify-center items-center gap-3">
      {Array.from({ length: pages }).map((_, i) => {
        const p = i + 1;
        const sp = new URLSearchParams(params);
        sp.set("page", String(p));
        return (
          <Link
            key={p}
            to={`?${sp.toString()}`}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl text-sm font-black transition-all duration-300 border ${
              p === currentPage
                ? "bg-iu-blue text-white border-iu-blue shadow-lg shadow-iu-blue/20 scale-110"
                : "bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-iu-blue/50"
            }`}
          >
            {p}
          </Link>
        );
      })}
    </div>
  );
}
