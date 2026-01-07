import React from "react";
import { Clock, MapPin, User, Video, X } from "lucide-react";
import { EVENT_COLORS } from "~/constants/schedule";
import { EventIcon } from "~/components/schedule/EventIcon";
import type { ScheduleEvent } from "~/types/schedule";

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
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-card/95 backdrop-blur-2xl rounded-[3rem] p-10 max-w-xl w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-6">
            <div
              className={`p-5 rounded-[2rem] ${EVENT_COLORS[selectedEvent.type]?.bg} ${EVENT_COLORS[selectedEvent.type]?.text} shadow-xl`}
            >
              <EventIcon type={selectedEvent.type} className="h-10 w-10" />
            </div>
            <div>
              <div
                className={`text-xs font-bold uppercase tracking-[0.3em] mb-2 ${EVENT_COLORS[selectedEvent.type]?.text}`}
              >
                {selectedEvent.type.toUpperCase()}
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-foreground">
                {selectedEvent.title}
              </h3>
              <p className="text-lg text-muted-foreground font-medium mt-1">
                {selectedEvent.courseCode}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-muted rounded-2xl transition-all"
          >
            <X size={32} className="text-muted-foreground dark:text-white/80" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-muted/30 rounded-[2rem] border border-border/50">
            <div className="flex items-center gap-3 mb-4 text-iu-blue dark:text-white">
              <Clock size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Zeit & Datum
              </span>
            </div>
            <div className="font-bold text-xl text-foreground mb-1">
              {selectedEvent.startTime} - {selectedEvent.endTime}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {new Date(selectedEvent.date).toLocaleDateString(locale, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </div>
          </div>

          <div className="p-6 bg-muted/30 rounded-[2rem] border border-border/50">
            <div className="flex items-center gap-3 mb-4 text-iu-blue dark:text-white">
              <MapPin size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Ort
              </span>
            </div>
            <div className="font-bold text-xl text-foreground mb-1">
              {selectedEvent.location}
            </div>
            {selectedEvent.room && (
              <div className="text-sm text-muted-foreground font-medium">
                Raum: {selectedEvent.room}
              </div>
            )}
          </div>

          <div className="p-6 bg-muted/30 rounded-[2rem] border border-border/50 md:col-span-2">
            <div className="flex items-center gap-3 mb-4 text-iu-blue dark:text-white">
              <User size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Dozent
              </span>
            </div>
            <div className="font-bold text-xl text-foreground">
              {selectedEvent.professor}
            </div>
          </div>
        </div>

        {selectedEvent.isOnline && selectedEvent.zoomLink && (
          <a
            href={selectedEvent.zoomLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-4 w-full p-6 bg-iu-blue text-white rounded-[2rem] font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-iu-blue/20"
          >
            <Video size={24} />
            Zoom-Meeting beitreten
          </a>
        )}
      </div>
    </div>
  );
}
