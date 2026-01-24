import { Search, Sparkles } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface KlausuranmeldungHeaderProps {
  t: any;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function KlausuranmeldungHeader({
  t,
  searchQuery,
  setSearchQuery,
}: KlausuranmeldungHeaderProps) {
  return (
    <PageHeader
      icon={Sparkles}
      title={t.title}
      subtitle={t.subtitle}
    >
      <div className="relative w-full md:w-96">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-4 rounded-[2rem] bg-card/50 backdrop-blur-xl border border-border focus:border-iu-blue/50 focus:ring-4 focus:ring-iu-blue/10 transition-all outline-none font-medium"
        />
      </div>
    </PageHeader>
  );
}

