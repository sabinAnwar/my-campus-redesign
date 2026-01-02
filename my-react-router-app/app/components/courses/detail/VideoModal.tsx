import { Video, X } from "lucide-react";
import type { VideoResource } from "~/types/courseDetail";
import { getVideoEmbedUrl } from "~/lib/videoUtils";

interface VideoModalProps {
  language: string;
  courseTitle: string;
  playingVideo: VideoResource;
  onClose: () => void;
}

export function VideoModal({ language, courseTitle, playingVideo, onClose }: VideoModalProps) {
  if (!playingVideo) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl bg-card rounded-[2rem] overflow-hidden shadow-2xl border border-border animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50 bg-card/80">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-iu-blue flex items-center justify-center text-white shadow-lg">
              <Video size={20} />
            </div>
            <div>
              <h3 className="font-black text-foreground text-xl tracking-tight">
                {playingVideo.title}
              </h3>
              <p className="text-[9px] text-iu-blue font-black uppercase tracking-[0.15em] mt-0.5">
                {courseTitle} <span className="mx-2 text-iu-blue/30">|</span>{" "}
                {playingVideo.duration}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 rounded-2xl bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-95 group"
          >
            <X
              size={28}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </button>
        </div>

        {/* Video Container */}
        <div className="aspect-video bg-black">
          <iframe
            width="100%"
            height="100%"
            src={`${getVideoEmbedUrl(playingVideo.url)}?autoplay=1`}
            title={playingVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-card/80 border-t border-border/50 flex justify-between items-center px-6">
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-50">
            IU Module Player
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-iu-blue text-white font-bold text-sm rounded-xl hover:bg-iu-blue/90 transition-all active:scale-95"
          >
            {language === "de" ? "Schließen" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
