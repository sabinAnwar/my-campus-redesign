interface NewsDetailHeroProps {
  title: string;
  category: string;
  featured: boolean;
  publishedAt: string;
  author?: string | null;
  coverImageUrl?: string | null;
  locale: string;
  labels: {
    categoryFallback: string;
    featured: string;
  };
}

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="0"></rect>
      <path d="M16 2v4"></path>
      <path d="M8 2v4"></path>
      <path d="M3 10h18"></path>
    </svg>
  );
}

function MetaInfo({
  publishedAt,
  author,
  locale,
}: {
  publishedAt: string;
  author?: string | null;
  locale: string;
}) {
  return (
    <div className="mt-4 text-sm text-slate-400 font-bold flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <CalendarIcon />
        <span>{new Date(publishedAt).toLocaleDateString(locale)}</span>
      </div>
      {author && (
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 bg-slate-600 rounded-full" />
          <span>{author}</span>
        </div>
      )}
    </div>
  );
}

function CategoryBadges({
  category,
  featured,
  labels,
}: {
  category: string;
  featured: boolean;
  labels: { categoryFallback: string; featured: string };
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[11px] px-3 py-1 rounded-none bg-iu-blue text-white font-black uppercase tracking-widest">
        {category || labels.categoryFallback}
      </span>
      {featured && (
        <span className="text-[10px] px-3 py-1 rounded-none bg-iu-orange text-slate-950 font-black uppercase tracking-widest">
          {labels.featured}
        </span>
      )}
    </div>
  );
}

export function NewsDetailHero({
  title,
  category,
  featured,
  publishedAt,
  author,
  coverImageUrl,
  locale,
  labels,
}: NewsDetailHeroProps) {
  if (coverImageUrl) {
    return (
      <header className="relative w-full">
        <div
          className="h-60 md:h-96 w-full bg-slate-900"
          style={{
            backgroundImage: `url(${coverImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-3xl mx-auto w-full px-4 pb-8">
            <CategoryBadges
              category={category}
              featured={featured}
              labels={labels}
            />
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white leading-tight">
              {title}
            </h1>
            <MetaInfo publishedAt={publishedAt} author={author} locale={locale} />
          </div>
        </div>
      </header>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-16 sm:pt-24">
      <CategoryBadges category={category} featured={featured} labels={labels} />
      <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white leading-tight">
        {title}
      </h1>
      <MetaInfo publishedAt={publishedAt} author={author} locale={locale} />
    </div>
  );
}
