import { FileText } from "lucide-react";

interface ImmatriculationValidityInfoProps {
  t: any;
}

export function ImmatriculationValidityInfo({ t }: ImmatriculationValidityInfoProps) {
  return (
    <div className="bg-iu-blue/5 border border-iu-blue/20 rounded-[2rem] p-8 shadow-xl backdrop-blur-md group hover:bg-iu-blue/10 transition-all duration-500 mb-8 sm:mb-12">
      <div className="flex items-start gap-6">
        <div className="p-4 bg-iu-blue rounded-2xl shadow-xl shadow-iu-blue/20 group-hover:scale-110 transition-transform">
          <FileText className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">
            {t.validity}
          </h3>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">
            {t.validityText}
          </p>
        </div>
      </div>
    </div>
  );
}
