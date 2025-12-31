import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLoaderData,
  useActionData,
  useRevalidator,
} from "react-router-dom";
import {
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Trash2,
  Lock,
  CalendarCheck,
} from "lucide-react";

import { prisma } from "../lib/prisma";
import {
  showToast,
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from "../lib/toast";
import { useLanguage } from "~/contexts/LanguageContext";

// ────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS
// ────────────────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  de: {
    backToDashboard: "← Zurück zum Dashboard",
    roomBooking: "Raumbuchung",
    title: "Raumbuchung – IU Hamburg Campus",
    today: "Heute",
    from: "Von",
    to: "Bis",
    checkAvailability: "Verfügbarkeit prüfen",
    slotsChecked: "Slots geprüft",
    selectTimeHint: "Wähle Zeitfenster aus und prüfe die freien Räume.",
    legend: "Legende",
    free: "Frei",
    occupiedLecture: "Belegt (Vorlesung)",
    bookedByYou: "Gebucht von dir",
    soonOccupied: "Bald belegt",
    liveOverview: "Live Übersicht",
    whoUsesRoom: "Wer nutzt gerade welchen Raum?",
    room: "Raum",
    where: "Wo?",
    purpose: "Zweck",
    until: "bis",
    noOccupancies: "Keine Belegungen für heute.",
    availableRooms: "Verfügbare Räume",
    capacity: "Kapazität",
    persons: "Personen",
    seats: "Plätze",
    freeNow: "Jetzt frei",
    occupied: "Belegt",
    yourBooking: "Deine Buchung",
    cancel: "Stornieren",
    cancelBooking: "Buchung stornieren",
    book: "Buchen",
    bookNow: "Jetzt buchen",
    lecture: "Vorlesung",
    userNotLoggedIn: "Benutzer nicht angemeldet",
    selectStartEndTime: "Bitte wählen Sie Start- und Endzeit",
    startBeforeEnd: "Startzeit muss vor der Endzeit liegen",
    roomsAvailable: (n: number, t: number) => `${n} von ${t} Räumen verfügbar`,
    bookingRoom: "wird gebucht...",
    isBeingBooked: "Wird gebucht...",
    time: "Zeit",
    cancellingBooking: "Wird storniert...",
    bookingNotFound: "Buchung nicht gefunden",
    available: "Verfügbar",
    occupiedByLecture: "Belegt durch Vorlesung",
    alreadyBooked: "Bereits gebucht",
    bookedBy: "Gebucht (du)",
    booked: "Gebucht",
    student: "Student",
    lecturer: "Dozent:in",
    liveStatus: "Live-Status",
    listView: "Listenansicht",
    weekView: "Wochenansicht",
    monthView: "Monatsansicht",
    rooms: "Räume",
    bookRoom: "Raum buchen",
    bookingTitle: "Titel der Buchung",
    confirmBooking: "Buchung bestätigen",
    selectRoomToSeeWeek: "Wähle einen Raum aus, um den Wochenplan zu sehen",
  },
  en: {
    backToDashboard: "← Back to Dashboard",
    roomBooking: "Room Booking",
    title: "Room Booking – IU Hamburg Campus",
    today: "Today",
    from: "From",
    to: "To",
    checkAvailability: "Check Availability",
    slotsChecked: "Slots checked",
    selectTimeHint: "Select time slots and check available rooms.",
    legend: "Legend",
    free: "Free",
    occupiedLecture: "Occupied (Lecture)",
    bookedByYou: "Booked by you",
    soonOccupied: "Soon occupied",
    liveOverview: "Live Overview",
    whoUsesRoom: "Who is currently using which room?",
    room: "Room",
    where: "Where?",
    purpose: "Purpose",
    until: "until",
    noOccupancies: "No occupancies for today.",
    availableRooms: "Available Rooms",
    capacity: "Capacity",
    persons: "Persons",
    seats: "Seats",
    freeNow: "Free now",
    occupied: "Occupied",
    yourBooking: "Your booking",
    cancel: "Cancel",
    cancelBooking: "Cancel Booking",
    book: "Book",
    bookNow: "Book Now",
    lecture: "Lecture",
    userNotLoggedIn: "User not logged in",
    selectStartEndTime: "Please select start and end time",
    startBeforeEnd: "Start time must be before end time",
    roomsAvailable: (n: number, t: number) => `${n} of ${t} rooms available`,
    bookingRoom: "is being booked...",
    isBeingBooked: "Booking...",
    time: "Time",
    cancellingBooking: "Cancelling...",
    bookingNotFound: "Booking not found",
    available: "Available",
    occupiedByLecture: "Occupied by Lecture",
    alreadyBooked: "Already Booked",
    bookedBy: "Booked (you)",
    booked: "Booked",
    student: "Student",
    lecturer: "Lecturer",
    liveStatus: "Live Status",
    listView: "List View",
    weekView: "Week View",
    monthView: "Month View",
    rooms: "Rooms",
    bookRoom: "Book Room",
    bookingTitle: "Booking Title",
    confirmBooking: "Confirm Booking",
    selectRoomToSeeWeek: "Select a room to see its weekly schedule",
  },
};

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

// Mock lectures dataset - Raum A1, A2, A3, etc.
// Mock lectures dataset - Raum A1, A2, A3, etc.
const TODAY_ISO = new Date().toISOString().split("T")[0];

const LECTURES = [
  {
    id: 1,
    campus: "Hammerbrook",
    roomName: "Michel A",
    title: "Mathe – Analysis I",
    startTime: "08:00",
    endTime: "10:00",
    date: TODAY_ISO,
  },
  {
    id: 2,
    campus: "Hammerbrook",
    roomName: "Michel B",
    title: "Data Analytics",
    startTime: "11:00",
    endTime: "13:00",
    date: TODAY_ISO,
  },
  {
    id: 3,
    campus: "Waterloohain",
    roomName: "Jenischhaus",
    title: "Webentwicklung",
    startTime: "09:30",
    endTime: "11:30",
    date: TODAY_ISO,
  },
  {
    id: 4,
    campus: "Waterloohain",
    roomName: "Christoph-Probst-Weg",
    title: "Datenbanken",
    startTime: "10:00",
    endTime: "12:00",
    date: TODAY_ISO,
  },
];

const CAMPUS_DETAILS: Record<string, { subtitle: string; note: string }> = {
  Hammerbrook: {
    subtitle: "Tech-Hub rund um den Michel",
    note: "Michel A/B/E + Christoph-Probst-Weg – moderne Lernräume mit Screens und Pods.",
  },
  Waterloohain: {
    subtitle: "Green Campus",
    note: "Jenischhaus & Christoph-Probst-Weg – ruhige Lernräume im Park.",
  },
};

// Demo occupancy table for a quick view (blended with live bookings)
const DEMO_OCCUPANCY = [
  {
    campus: "Hammerbrook",
    room: "Michel A",
    purpose: "Mathe-Tutorium",
    person: "Lea Schmidt",
    until: "10:00",
  },
  {
    campus: "Hammerbrook",
    room: "HH – Christoph-Probst-Weg",
    purpose: "Projekt Meeting",
    person: "Finn Reimer",
    until: "12:00",
  },
  {
    campus: "Waterloohain",
    room: "Jenischhaus",
    purpose: "Webentwicklung Study Group",
    person: "Mara Elmas",
    until: "11:30",
  },
];

// Helper function to get session token from request cookies
function getSessionToken(request: { headers: { get: (arg0: string) => any } }) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c: string) => c.trim());
  const sessionCookie = cookies.find((c: string) => c.startsWith("session="));

  if (!sessionCookie) return null;
  return sessionCookie.split("=")[1];
}

export async function loader({ request }: { request: Request }) {
  try {
    // Get session token from cookies
    const token = getSessionToken(request);
    console.log("🍪 Cookie header:", request.headers.get("Cookie"));
    console.log("� Session token:", token);

    let userId = 1; // Default fallback

    if (token) {
      // Look up session in database
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });

      if (session?.user) {
        userId = session.user.id;
        console.log("✅ Found user from session:", userId);
      }
    }

    // Fetch all bookings to show occupancy for everyone
    const bookings = await prisma.roomBooking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    console.log("📚 Loading all bookings - Found:", bookings.length);

    // Convert date objects to ISO strings for JSON serialization
    const serializedBookings = bookings.map(
      (booking: {
        date: { toISOString: () => string };
        createdAt: { toISOString: () => any };
        updatedAt: { toISOString: () => any };
      }) => ({
        ...booking,
        date: booking.date.toISOString().split("T")[0],
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
      })
    );

    return { bookings: serializedBookings, userId };
  } catch (error) {
    console.error("Error loading bookings:", error);
    return { bookings: [], userId: 1 };
  }
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  console.log("🎬 Action type:", actionType);

  try {
    // Get session token from cookies
    const token = getSessionToken(request);
    let userId = parseInt(String(formData.get("userId") ?? "1"), 10) || 1; // Fallback

    if (token) {
      // Look up session in database
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });

      if (session?.user) {
        userId = session.user.id;
        console.log("✅ Found user from session for action:", userId);
      }
    }

    if (actionType === "create") {
      const roomId = formData.get("roomId");
      const roomName = formData.get("roomName");
      const campus = formData.get("campus");
      const dateStr = formData.get("date");
      const startTime = formData.get("startTime");
      const endTime = formData.get("endTime");

      // Normalize date from FormData (FormData.get can return FormDataEntryValue | null)
      const bookingDate = dateStr ? new Date(String(dateStr)) : new Date();

      // Check if user already has a booking for this room and campus
      const existingBooking = await prisma.roomBooking.findFirst({
        where: {
          userId: userId,
          roomName: roomName,
          campus: campus,
          date: bookingDate,
        },
      });

      let booking;
      if (existingBooking) {
        // Update existing booking
        console.log("🔄 Updating existing booking for", roomName);
        booking = await prisma.roomBooking.update({
          where: { id: existingBooking.id },
          data: {
            startTime,
            endTime,
          },
        });
      } else {
        // Create new booking
        console.log("➕ Creating new booking for", roomName);
        booking = await prisma.roomBooking.create({
          data: {
            userId,
            roomId,
            roomName,
            campus,
            date: bookingDate,
            startTime,
            endTime,
          },
        });
      }

      console.log("✅ Booking created/updated:", booking);

      return {
        success: true,
        booking: {
          ...booking,
          date: booking.date.toISOString().split("T")[0],
          createdAt: booking.createdAt.toISOString(),
          updatedAt: booking.updatedAt.toISOString(),
        },
      };
    }

    if (actionType === "delete") {
      const bookingId = parseInt(String(formData.get("bookingId") ?? "0"), 10);

      console.log("🗑️ Deleting booking:", bookingId);

      await prisma.roomBooking.delete({
        where: { id: bookingId },
      });

      console.log("✅ Booking deleted successfully");

      return { success: true };
    }

    return { success: false, error: "Invalid action" };
  } catch (error) {
    console.error("❌ Action error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
}

// Helper to programmatically generate seat positions for a grid with numbering
function generateSeats(
  prefix: any,
  roomName: any,
  rows: number,
  cols: number,
  startX: number,
  startY: number,
  gapX: number,
  gapY: number
) {
  const seats = [];
  let seatNumber = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * gapX;
      const y = startY + r * gapY;
      const features = [];
      if ((r + c) % 2 === 0) features.push("Dual Monitor");
      if ((r + c) % 3 === 0) features.push("Adjustable Height");
      seats.push({
        id: `${prefix}_${seatNumber}`,
        number: seatNumber++,
        roomName,
        x,
        y,
        w: 50,
        h: 28,
        rot: c % 4 === 0 ? -3 : c % 4 === 1 ? 3 : 0,
        features,
      });
    }
  }
  return seats;
}

// Campus → Rooms (Raum A1, A2, A3, B1, B2, C1, C2, etc.)
const CAMPUS_ROOMS = {
  Hammerbrook: [
    { id: "HB-MA", name: "Michel A", capacity: 18 },
    { id: "HB-MB", name: "Michel B", capacity: 16 },
    { id: "HB-E", name: "Michel E", capacity: 12 },
    { id: "HB-HH", name: "HH – Christoph-Probst-Weg", capacity: 20 },
  ],
  Waterloohain: [
    { id: "WL-JH", name: "Jenischhaus", capacity: 18 },
    { id: "WL-CPW", name: "Christoph-Probst-Weg", capacity: 15 },
    { id: "WL-M2", name: "Michel B", capacity: 20 },
  ],
};

export default function RoomBooking() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const revalidator = useRevalidator();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  type CampusKey = keyof typeof CAMPUS_ROOMS;
  const [selectedLocation, setSelectedLocation] =
    useState<CampusKey>("Hammerbrook");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [isLoading, setIsLoading] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [now, setNow] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Get user ID and bookings from loader
  const userId = loaderData?.userId || 1;
  const bookings = loaderData?.bookings || [];

  // Handle action completion
  useEffect(() => {
    if (actionData?.success) {
      console.log("✅ Action completed successfully");
      setIsLoading(false);
      // Revalidate to get fresh data from database
      revalidator.revalidate();
    }
  }, [actionData, revalidator]);

  // Get rooms for selected campus
  const rooms = CAMPUS_ROOMS[selectedLocation] || [];

  // Buchungsfunktion - uses Form submission to server action
  const handleBookRoom = (room: {
    id: React.Key | null | undefined;
    name: string | number | React.ReactNode;
  }) => {
    if (!userId) {
      showErrorToast(t.userNotLoggedIn);
      return;
    }

    if (isLoading) {
      console.log("⏳ Already processing a request");
      return;
    }

    setIsLoading(true);
    const today = new Date().toISOString().split("T")[0];

    console.log("📤 Booking room:", {
      userId,
      roomId: String(room.id),
      roomName: String(room.name),
      campus: selectedLocation,
      date: today,
      startTime,
      endTime,
    });

    // Create form and submit to server action
    const form = document.createElement("form");
    form.method = "POST";
    form.style.display = "none";

    const formData = new FormData();
    formData.append("_action", "create");
    formData.append("userId", userId.toString());
    formData.append("roomId", String(room.id));
    formData.append("roomName", String(room.name));
    formData.append("campus", selectedLocation);
    formData.append("date", today);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);

    // Append form data to form
    for (const [key, value] of formData.entries()) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();

    showSuccessToast(
      `${t.room} ${String(room.name)} ${t.bookingRoom} ${t.time}: ${startTime} - ${endTime}`
    );
  };

  // Verfügbarkeit prüfen
  const handleCheckAvailability = () => {
    if (!startTime || !endTime) {
      showErrorToast(t.selectStartEndTime);
      return;
    }

    if (startTime >= endTime) {
      showErrorToast(t.startBeforeEnd);
      return;
    }

    console.log("🔍 Checking availability:", {
      startTime,
      endTime,
      campus: selectedLocation,
    });
    setAvailabilityChecked(true);

    const availableRooms = rooms.filter((room: { name: any }) => {
      const { status } = getRoomStatus(room.name);
      return status === "frei";
    });

    showSuccessToast(
      `${t.roomsAvailable(availableRooms.length, rooms.length)} (${startTime} - ${endTime})`
    );
  };

  // Stornierungsfunktion mit React Router action
  const handleCancelBooking = (roomName: any) => {
    const booking = bookings.find(
      (b: { roomName: any; campus: string }) =>
        b.roomName === roomName && b.campus === selectedLocation
    );

    if (!booking) {
      showErrorToast(t.bookingNotFound);
      return;
    }

    if (isLoading) {
      console.log("⏳ Already processing a request");
      return;
    }

    setIsLoading(true);
    console.log("🗑️ Cancelling booking:", booking);

    // Create form and submit to server action
    const form = document.createElement("form");
    form.method = "POST";
    form.style.display = "none";

    const formData = new FormData();
    formData.append("_action", "delete");
    formData.append("bookingId", booking.id.toString());

    // Append form data to form
    for (const [key, value] of formData.entries()) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();

    showInfoToast(`${t.room} ${roomName} - ${t.cancellingBooking}`);
  };

  // Get lectures for selected campus and today
  const todayLectures = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return LECTURES.filter(
      (l) => l.campus === selectedLocation && l.date === today
    );
  }, [selectedLocation]);

  const occupancyRows = useMemo(() => {
    const rows: {
      room: string;
      purpose: string;
      person: string;
      until: string;
      key: string;
    }[] = [];

    DEMO_OCCUPANCY.filter((o) => o.campus === selectedLocation).forEach((o) =>
      rows.push({
        room: o.room,
        purpose: o.purpose,
        person: o.person,
        until: o.until,
        key: `demo-${o.room}`,
      })
    );

    todayLectures.forEach((lec) =>
      rows.push({
        room: lec.roomName,
        purpose: `${t.lecture}: ${lec.title}`,
        person: t.lecturer,
        until: lec.endTime,
        key: `lec-${lec.id}`,
      })
    );

    bookings
      .filter((b: any) => b.campus === selectedLocation)
      .forEach((b: any) => {
        const isMyBooking = b.userId === userId;
        rows.push({
          room: b.roomName,
          purpose: isMyBooking ? t.bookedBy : t.booked,
          person: b.user
            ? b.user.name || b.user.username
            : `${t.student} #${b.userId}`,
          until: `${b.startTime}–${b.endTime}`,
          key: `book-${b.id}`,
        });
      });

    const seen = new Set();
    return rows.filter((r) => {
      if (seen.has(r.key)) return false;
      seen.add(r.key);
      return true;
    });
  }, [bookings, selectedLocation, todayLectures, userId]);

  const campusDetail = CAMPUS_DETAILS[selectedLocation] ?? {
    subtitle: "Campus",
    note: "Raumbuchung für deinen Standort.",
  };

  // Check if a room has a lecture or is booked
  const getRoomStatus = (roomName: unknown) => {
    // If roomName is null/undefined, return free by default
    if (roomName == null) {
      return { status: "frei", lecture: null, booking: null };
    }

    // Normalize to string for comparisons (covers numbers, elements, etc.)
    const name = String(roomName);

    // Helper function to check if two time ranges overlap
    const timesOverlap = (
      start1: string,
      end1: string,
      start2: string,
      end2: string
    ) => {
      return start1 < end2 && start2 < end1;
    };

    // Check if room has lecture that conflicts with selected time
    const lecture = todayLectures.find((l) => {
      if (l.roomName !== name) return false;
      // Only consider it occupied if the lecture time overlaps with selected time
      return timesOverlap(l.startTime, l.endTime, startTime, endTime);
    });
    if (lecture) {
      return { status: "belegt", lecture, booking: null };
    }

    // Check if room is booked by anyone during the selected time
    const booking = bookings.find((b: any) => {
      if (b.roomName !== name || b.campus !== selectedLocation) return false;
      // Only consider it occupied if the booking time overlaps with selected time
      return timesOverlap(b.startTime, b.endTime, startTime, endTime);
    });
    if (booking) {
      if (booking.userId === userId) {
        return { status: "gebucht", lecture: null, booking };
      } else {
        return { status: "belegt-user", lecture: null, booking };
      }
    }

    return { status: "frei", lecture: null, booking: null };
  };

  // Helper to check if a room is currently occupied
  const isRoomOccupied = (roomName: string) => {
    const { status } = getRoomStatus(roomName);
    return (
      status === "belegt" || status === "belegt-user" || status === "gebucht"
    );
  };

  return (
    <div className="max-w-7xl mx-auto relative z-10 space-y-6 sm:space-y-8 md:space-y-12 px-1 sm:px-0">
      {/* Header Section */}
      <header className="mb-6 sm:mb-8 md:mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 lg:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                <MapPin className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
                {t.roomBooking}
              </h1>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {language === "de"
                ? "Verwalte deine Raumbuchungen und finde freie Lernplätze auf dem Campus."
                : "Manage your room bookings and find available study spots on campus."}
            </p>

            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-border bg-card/50 text-xs sm:text-sm font-medium w-fit">
              <Clock size={16} className="text-iu-blue" />
              <span>
                {new Date().toLocaleDateString(
                  language === "de" ? "de-DE" : "en-US",
                  { weekday: "long", day: "2-digit", month: "2-digit" }
                )}
              </span>
            </div>
          </div>

          <div className="flex p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card/50 backdrop-blur-xl border border-border gap-3 sm:gap-4 items-center shadow-sm">
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-iu-blue/10 text-iu-blue">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                {t.liveStatus}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-foreground">
                  {occupancyRows.length}
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  {t.occupied}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Campus selector */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {(Object.keys(CAMPUS_ROOMS) as (keyof typeof CAMPUS_ROOMS)[]).map(
          (campus) => (
            <button
              key={campus}
              onClick={() => setSelectedLocation(campus)}
              className={`inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl border text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${
                selectedLocation === campus
                  ? "bg-iu-blue text-white border-iu-blue scale-105"
                  : "bg-card/50 border-border text-muted-foreground hover:border-iu-blue/50 hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <MapPin
                className={`h-3 w-3 ${selectedLocation === campus ? "text-white" : "text-iu-blue"}`}
              />
              {campus}
            </button>
          )
        )}
      </div>

      {/* Quick occupancy snapshot (Table) */}
      <div className="bg-card/50 backdrop-blur-2xl border border-border rounded-2xl sm:rounded-[2.5rem] overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-8 border-b border-border">
          <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground tracking-tight">
            {t.whoUsesRoom}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-3 sm:px-6 md:px-10 py-3 sm:py-4 font-bold text-[10px] sm:text-xs">
                  {t.room}
                </th>
                <th className="text-left px-3 sm:px-6 md:px-10 py-3 sm:py-4 font-bold text-[10px] sm:text-xs hidden sm:table-cell">
                  {t.where}
                </th>
                <th className="text-left px-3 sm:px-6 md:px-10 py-3 sm:py-4 font-bold text-[10px] sm:text-xs">
                  {t.purpose}
                </th>
                <th className="text-left px-3 sm:px-6 md:px-10 py-3 sm:py-4 font-bold text-[10px] sm:text-xs">
                  {t.until}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {occupancyRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 sm:px-10 py-6 sm:py-10 text-muted-foreground font-bold italic text-center text-sm sm:text-base"
                  >
                    {t.noOccupancies}
                  </td>
                </tr>
              ) : (
                occupancyRows.map((row) => (
                  <tr
                    key={row.key}
                    className="hover:bg-muted/30 transition-all duration-300 group"
                  >
                    <td className="px-3 sm:px-6 md:px-10 py-3 sm:py-4 md:py-6 font-bold text-foreground text-sm sm:text-base md:text-lg group-hover:text-iu-blue transition-colors">
                      {row.room}
                    </td>
                    <td className="px-3 sm:px-6 md:px-10 py-3 sm:py-4 md:py-6 hidden sm:table-cell">
                      <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-lg bg-muted/50 border border-border text-muted-foreground font-bold text-[10px] sm:text-xs">
                        <MapPin className="h-3 w-3 text-iu-blue" />
                        {selectedLocation}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 md:px-10 py-3 sm:py-4 md:py-6 text-muted-foreground font-medium">
                      <span className="text-foreground font-bold text-xs sm:text-sm">
                        {row.purpose}
                      </span>
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 font-bold">
                        {row.person}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 md:px-10 py-3 sm:py-4 md:py-6">
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 text-iu-blue font-bold text-sm sm:text-base">
                        <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {row.until}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {rooms.map(
          (room: {
            name: any;
            id: React.Key | null | undefined;
            capacity: number;
            type?: string;
          }) => {
            const { status, lecture, booking } = getRoomStatus(room.name);
            const occupied = status !== "frei";

            return (
              <div
                key={room.id}
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
                          {room.capacity} {t.seats}
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
                    {occupied ? t.occupied : t.available}
                  </div>
                </div>

                {/* Status Details */}
                <div className="relative z-10">
                  {lecture ? (
                    <div className="bg-muted/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-orange-500/10">
                      <p className="text-[8px] sm:text-[9px] text-orange-500 font-bold uppercase tracking-widest mb-1">
                        {t.lecture}
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
                        {booking.userId === userId ? t.bookedBy : t.booked}
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
                        {t.available}
                      </p>
                      <p className="text-xs sm:text-sm text-foreground font-bold">
                        {t.freeNow}
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
                      onClick={() => handleCancelBooking(room.name)}
                      disabled={isLoading}
                      className="w-full inline-flex justify-center items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-white font-bold px-4 sm:px-6 py-3 sm:py-4 transition-all uppercase tracking-widest text-[9px] sm:text-[10px] border border-orange-500/20"
                    >
                      <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {t.cancelBooking}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBookRoom(room)}
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
                      {occupied ? t.occupied : t.bookNow}
                    </button>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
