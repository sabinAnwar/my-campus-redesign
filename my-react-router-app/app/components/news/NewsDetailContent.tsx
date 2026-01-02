import { Link } from "react-router-dom";

interface NewsDetailContentProps {
  content: string;
  excerpt?: string | null;
  tags: string[];
  backSearch: string;
  copied: boolean;
  onCopyLink: () => void;
  labels: {
    back: string;
    copy: string;
    copied: string;
  };
}

function BackIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="0" ry="0" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function NewsDetailContent({
  content,
  excerpt,
  tags,
  backSearch,
  copied,
  onCopyLink,
  labels,
}: NewsDetailContentProps) {
  return (
    <article className="max-w-3xl mx-auto px-4">
      <div className="flex items-center justify-between mt-8 pb-8 border-b border-slate-800">
        <Link
          to={`/news${backSearch}`}
          className="inline-flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest px-4 py-2 rounded-none bg-slate-900 hover:bg-iu-blue transition-colors border border-slate-800"
        >
          <BackIcon />
          {labels.back}
        </Link>
        <button
          onClick={onCopyLink}
          className="inline-flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest px-4 py-2 rounded-none bg-slate-900 hover:bg-iu-pink transition-colors border border-slate-800"
        >
          {copied ? (
            <>
              {labels.copied}
              <CheckIcon />
            </>
          ) : (
            <>
              {labels.copy}
              <CopyIcon />
            </>
          )}
        </button>
      </div>

      {excerpt && (
        <p className="mt-10 text-xl text-slate-200 font-bold leading-relaxed italic border-l-4 border-iu-blue pl-6">
          {excerpt}
        </p>
      )}

      <div className="prose prose-invert prose-slate max-w-none mt-10 whitespace-pre-wrap text-slate-300 font-medium leading-loose">
        {content}
      </div>

      {tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-3 py-1 rounded-none bg-slate-900 border border-slate-800 font-black text-slate-400 uppercase tracking-widest hover:text-iu-blue hover:border-iu-blue transition-colors cursor-default"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
