import { Download } from "lucide-react";

interface DownloadButtonProps {
  onClick: () => void;
  label: string;
}

export function DownloadButton({ onClick, label }: DownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-4 bg-foreground text-background font-bold py-6 px-10 rounded-[2rem] transition-all shadow-2xl hover:opacity-90 active:scale-95 text-lg group"
    >
      <Download className="h-7 w-7 group-hover:translate-y-1 transition-transform" />
      {label}
    </button>
  );
}
