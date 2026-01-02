import { Link } from "react-router-dom";
import { HelpCircle, ChevronRight } from "lucide-react";

interface FAQLinkProps {
  t: any;
}

export function FAQLink({ t }: FAQLinkProps) {
  return (
    <div className="bg-iu-blue/5 border border-iu-blue/10 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group hover:bg-iu-blue/10 transition-all duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-black text-foreground tracking-tight">
          {t.faqTitle}
        </h3>
      </div>
      <p className="text-muted-foreground font-medium mb-8">
        {t.faqDesc}
      </p>
      <Link
        to="/faq"
        className="inline-flex justify-center items-center bg-iu-blue hover:bg-iu-blue/90 text-white font-bold py-5 px-8 rounded-2xl transition-all w-full shadow-xl hover:shadow-iu-blue/20 active:scale-95"
      >
        {t.toFaq} <ChevronRight className="ml-2 w-5 h-5" />
      </Link>
    </div>
  );
}
