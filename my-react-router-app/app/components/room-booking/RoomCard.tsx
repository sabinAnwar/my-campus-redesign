import { MapPin, Users, Lock, CalendarCheck, Trash2 } from "lucide-react";

interface Lecture {
  title: string;
  startTime: string;
  endTime: string;
}

interface Booking {
  userId: number;
  user?: { name?: string };
  startTime: string;
  endTime: string;
}

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    capacity: number;
  };
  status: "frei" | "belegt" | "belegt-user" | "gebucht";
  lecture: Lecture | null;
  booking: Booking | null;
  currentUserId: number;
  selectedLocation: string;
  startTime: string;
  endTime: string;
  isLoading: boolean;
  onBookRoom: () => void;
  onCancelBooking: () => void;
  labels: {
    seats: string;
    occupied: string;
    available: string;
    lecture: string;
    bookedBy: string;
    booked: string;
    freeNow: string;
    cancelBooking: string;
    bookNow: string;
  };
}

export function RoomCard({
  room,
  status,
  lecture,
  booking,
  currentUserId,
  selectedLocation,
  startTime,
  endTime,
  isLoading,
  onBookRoom,
  onCancelBooking,
  labels,
}: RoomCardProps) {
  const occupied = status !== "frei";

  return (
    <div
      className={`group relative rounded-2xl sm:rounded-[2rem] bg-card/50 backdrop-blur-xl border border-border hover:border-iu-blue/30 hover:-translate-y-2 transition-all duration-500 p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-5 md:gap-6 overflow-hidden`}
    >
      <div className="relative z-10 flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-3 w-3 text-iu-blue" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">
              {selectedLocation}
            </p>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-foreground mb-2 sm:mb-3 md:mb-4 tracking-tight leading-none group-hover:text-iu-blue transition-colors">
            {room.name}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-muted/50 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-border">
              <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-iu-blue" />
              <span className="font-bold text-[9px] sm:text-[10px] text-foreground uppercase tracking-widest">
                {room.capacity} {labels.seats}
              </span>
            </div>
          </div>
        </div>
        <div
          className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] border flex items-center gap-1.5 sm:gap-2 ${
            occupied
              ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
              : "bg-iu-blue/10 text-iu-blue border-iu-blue/20"
          }`}
        >
          {occupied ? labels.occupied : labels.available}
        </div>
      </div>

      {/* Status Details */}
      <div className="relative z-10">
        {lecture ? (
          <div className="bg-muted/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-orange-500/10">
            <p className="text-[8px] sm:text-[9px] text-orange-500 font-bold uppercase tracking-widest mb-1">
              {labels.lecture}
            </p>
            <p className="text-xs sm:text-sm text-foreground font-bold truncate">
              {lecture.title}
            </p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">
              {lecture.startTime} – {lecture.endTime}
            </p>
          </div>
        ) : booking ? (
          <div className="bg-muted/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-iu-blue/10">
            <p className="text-[8px] sm:text-[9px] text-iu-blue font-bold uppercase tracking-widest mb-1">
              {booking.userId === currentUserId ? labels.bookedBy : labels.booked}
            </p>
            <p className="text-xs sm:text-sm text-foreground font-bold truncate">
              {booking.user?.name || "Student"}
            </p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">
              {booking.startTime} – {booking.endTime}
            </p>
          </div>
        ) : (
          <div className="bg-muted/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-iu-blue/10">
            <p className="text-[8px] sm:text-[9px] text-iu-blue font-bold uppercase tracking-widest mb-1">
              {labels.available}
            </p>
            <p className="text-xs sm:text-sm text-foreground font-bold">
              {labels.freeNow}
            </p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">
              {startTime} – {endTime}
            </p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="relative z-10 mt-auto">
        {status === "gebucht" && booking ? (
          <button
            onClick={onCancelBooking}
            disabled={isLoading}
            className="w-full inline-flex justify-center items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-white font-bold px-4 sm:px-6 py-3 sm:py-4 transition-all uppercase tracking-widest text-[9px] sm:text-[10px] border border-orange-500/20"
          >
            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            {labels.cancelBooking}
          </button>
        ) : (
          <button
            onClick={onBookRoom}
            disabled={isLoading || occupied}
            className={`w-full inline-flex justify-center items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl font-bold px-4 sm:px-6 py-3 sm:py-4 transition-all uppercase tracking-widest text-[9px] sm:text-[10px] ${
              occupied
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-iu-blue hover:bg-iu-blue text-white"
            }`}
          >
            {occupied ? (
              <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            ) : (
              <CalendarCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            )}
            {occupied ? labels.occupied : labels.bookNow}
          </button>
        )}
      </div>
    </div>
  );
}
