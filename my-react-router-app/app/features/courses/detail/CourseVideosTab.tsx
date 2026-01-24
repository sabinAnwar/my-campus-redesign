import { Play, Users, Video } from "lucide-react";
import type { Course, VideoResource, TranslationType } from "~/types/courseDetail";

interface CourseVideosTabProps {
  course: Course;
  language: string;
  t: TranslationType;
  getThumbnailUrl: (url: string) => string;
  onVideoClick: (video: VideoResource) => void;
}

export function CourseVideosTab({ course, language, t, getThumbnailUrl, onVideoClick }: CourseVideosTabProps) {
  const videos = (course.resources?.filter((r) => r.type === "video") || []) as VideoResource[];

  return (
    <div className="space-y-4 sm:space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-600">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-8 md:mb-12">
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tighter mb-1 sm:mb-2">
            {t.videos}
          </h3>
          <p className="text-xs sm:text-base md:text-lg text-muted-foreground font-medium max-w-2xl">
            {language === "de"
              ? "Studiere in deinem eigenen Tempo mit unseren Video-Vorlesungen und interaktiven Inhalten."
              : "Study at your own pace with our video lectures and interactive content."}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-iu-blue dark:text-white uppercase tracking-wider sm:tracking-widest bg-iu-blue/5 dark:bg-iu-blue px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-iu-blue/10 dark:border-iu-blue">
          <Video className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          {videos.length} {language === "de" ? "Vorlesungen" : "Lectures"}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => onVideoClick(video)}
            className="group relative rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden hover:border-iu-blue/40 hover:shadow-2xl hover:shadow-iu-blue/10 transition-all duration-500 cursor-pointer"
          >
            <div className="aspect-video relative overflow-hidden bg-muted">
              {getThumbnailUrl(video.url) ? (
                <img
                  src={getThumbnailUrl(video.url)}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-iu-blue/5 dark:bg-iu-blue/20">
                  <Video size={48} className="text-iu-blue/30 dark:text-white" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-iu-blue text-white flex items-center justify-center shadow-2xl scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
                  <Play size={28} className="fill-current ml-1" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                  {video.duration || "12:45"}
                </span>
              </div>
            </div>
            <div className="p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h4 className="text-lg sm:text-xl font-black text-foreground leading-tight line-clamp-2 group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
                  {video.title}
                </h4>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border/10">
                <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <Users size={12} className="text-iu-blue/50 dark:text-white" />
                  <span>IU Study Content</span>
                </div>
                <button className="text-[9px] sm:text-[10px] font-black text-iu-blue dark:text-white uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                  {language === "de" ? "Abspielen" : "Play"} &rarr;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
