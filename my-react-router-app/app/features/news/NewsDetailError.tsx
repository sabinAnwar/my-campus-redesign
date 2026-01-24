import { Link } from "react-router-dom";

interface NewsDetailErrorProps {
  message: string;
  backLabel: string;
  backSearch: string;
}

export function NewsDetailError({
  message,
  backLabel,
  backSearch,
}: NewsDetailErrorProps) {
  return (
    <div className="min-h-screen bg-slate-950 pt-20 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-slate-700 font-bold">{message}</p>
        <Link
          to={`/news${backSearch}`}
          className="inline-block mt-4 text-sm font-black text-iu-blue uppercase tracking-wider hover:underline"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
