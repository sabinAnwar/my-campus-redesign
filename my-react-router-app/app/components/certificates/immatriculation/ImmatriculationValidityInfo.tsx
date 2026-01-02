import { FileText } from "lucide-react";

interface ImmatriculationValidityInfoProps {
  t: any;
}

export function ImmatriculationValidityInfo({ t }: ImmatriculationValidityInfoProps) {
  return (
    <div className="bg-iu-blue/5 border border-iu-blue/20 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-xl backdrop-blur-md group hover:bg-iu-blue/10 transition-all duration-500 mb-6 sm:mb-8 md:mb-12">
      <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
        <div className="p-3 sm:p-4 bg-iu-blue rounded-xl sm:rounded-2xl shadow-xl shadow-iu-blue/20 group-hover:scale-110 transition-transform flex-shrink-0">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1 sm:mb-2 tracking-tight">
            {t.validity}
          </h3>
          <p className="text-muted-foreground font-medium text-sm sm:text-base md:text-lg leading-relaxed">
            {t.validityText}
          </p>
        </div>
      </div>
    </div>
  );
}
