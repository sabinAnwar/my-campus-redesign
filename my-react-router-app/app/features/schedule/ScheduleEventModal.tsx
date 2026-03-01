import React, { useEffect } from "react";
import { Clock, MapPin, User, Video, X } from "lucide-react";
import { EVENT_COLORS } from "~/config/schedule";
import { EventIcon } from "~/features/schedule/EventIcon";
import type { ScheduleEvent } from "~/types/schedule";
import { useFocusTrap } from "~/hooks/useFocusTrap";

interface ScheduleEventModalProps {
  selectedEvent: ScheduleEvent;
  locale: string;
  onClose: () => void;
}

export function ScheduleEventModal({
  selectedEvent,
  locale,
  onClose,
}: ScheduleEventModalProps) {
  const trapRef = useFocusTrap(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={selectedEvent.title}
        className="bg-card/95 backdrop-blur-2xl rounded-[3rem] p-6 sm:p-10 max-w-xl w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6 sm:mb-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div
              className={`p-3 sm:p-5 rounded-[2rem] shadow-xl ${EVENT_COLORS[selectedEvent.type]?.bg}/15 dark:bg-white/5 text-slate-900 dark:text-white ring-1 ring-border/50`}
            >
              <EventIcon type={selectedEvent.type} className="h-7 w-7 sm:h-10 sm:w-10" />
            </div>
            <div>
              <div
                className={`text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] mb-2 ${EVENT_COLORS[selectedEvent.type]?.text || "text-foreground"}`}
              >
                {selectedEvent.type.toUpperCase()}
              </div>
              <h3 className="text-xl sm:text-3xl font-bold tracking-tight text-foreground">
                {selectedEvent.title}
              </h3>
              <p className="text-sm sm:text-lg text-muted-foreground font-medium mt-1">
                {selectedEvent.courseCode}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2.5 sm:p-3 hover:bg-muted rounded-2xl transition-all"
          >
            <X size={24} className="text-muted-foreground dark:text-white" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div className="p-4 sm:p-6 bg-muted/30 rounded-[2rem] border border-border/50">
            <div className="flex items-center gap-3 mb-3 sm:mb-4 text-iu-blue dark:text-white">
              <Clock size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Zeit & Datum
              </span>
            </div>
            <div className="font-bold text-base sm:text-xl text-foreground mb-1">
              {selectedEvent.startTime} - {selectedEvent.endTime}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">
              {new Date(selectedEvent.date).toLocaleDateString(locale, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-muted/30 rounded-[2rem] border border-border/50">
            <div className="flex items-center gap-3 mb-3 sm:mb-4 text-iu-blue dark:text-white">
              <MapPin size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Ort
              </span>
            </div>
            <div className="font-bold text-base sm:text-xl text-foreground mb-1">
              {selectedEvent.location}
            </div>
            {selectedEvent.room && (
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                Raum: {selectedEvent.room}
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 bg-muted/30 rounded-[2rem] border border-border/50 md:col-span-2">
            <div className="flex items-center gap-3 mb-3 sm:mb-4 text-iu-blue dark:text-white">
              <User size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Dozent
              </span>
            </div>
            <div className="font-bold text-base sm:text-xl text-foreground">
              {selectedEvent.professor}
            </div>
          </div>
        </div>

        {selectedEvent.isOnline && selectedEvent.zoomLink && (
          <div className="mt-8">
              <a
              href={selectedEvent.zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-4 w-full p-6 sm:p-7 bg-gradient-to-r from-blue-800 to-indigo-900 text-white rounded-3xl hover:-translate-y-1 active:scale-[0.98] transition-all shadow-xl shadow-blue-900/30 hover:shadow-2xl hover:shadow-blue-900/40 overflow-hidden ring-1 ring-white/10"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-blue-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex h-3 w-3 sm:h-4 sm:w-4 mb-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 sm:h-4 sm:w-4 bg-white"></span>
              </span>
              <Video size={36} className="relative z-10 shrink-0" />
              <span className="relative z-10 font-black text-2xl sm:text-3xl tracking-tight">ZOOM BEITRETEN</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
