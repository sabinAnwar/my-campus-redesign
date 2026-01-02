import { Download } from "lucide-react";

interface DownloadButtonProps {
  onClick: () => void;
  label: string;
}

export function DownloadButton({ onClick, label }: DownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 sm:gap-4 bg-foreground text-background font-bold py-4 sm:py-6 px-6 sm:px-10 rounded-2xl sm:rounded-[2rem] transition-all shadow-2xl hover:opacity-90 active:scale-95 text-base sm:text-lg group mb-8 sm:mb-0"
    >
      <Download className="h-5 w-5 sm:h-7 sm:w-7 group-hover:translate-y-1 transition-transform shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}
