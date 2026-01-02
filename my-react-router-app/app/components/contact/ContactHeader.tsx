import { MessageSquare } from "lucide-react";

interface ContactHeaderProps {
  t: any;
}

export function ContactHeader({ t }: ContactHeaderProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
          <MessageSquare size={28} />
        </div>
        <h1 className="text-4xl font-black text-foreground tracking-tight">
          {t.title}
        </h1>
      </div>
      <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
        {t.subtitle}
      </p>
    </div>
  );
}
