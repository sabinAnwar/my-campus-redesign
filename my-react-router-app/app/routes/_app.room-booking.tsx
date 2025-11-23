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
  Check,
  ShieldCheck,
  Info,
} from "lucide-react";

import { prisma } from "../lib/prisma";
import {
  showToast,
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from "../lib/toast";

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
const LECTURES = [
  {
    id: 1,
    campus: "Hammerbrook",
    roomName: "Michel A",
    title: "Mathe – Analysis I",
    startTime: "08:00",
    endTime: "10:00",
    date: "2025-11-07",
  },
  {
    id: 2,
    campus: "Hammerbrook",
    roomName: "Michel B",
    title: "Data Analytics",
    startTime: "11:00",
    endTime: "13:00",
    date: "2025-11-07",
  },
  {
    id: 3,
    campus: "Waterloohain",
    roomName: "Jenischhaus",
    title: "Webentwicklung",
    startTime: "09:30",
    endTime: "11:30",
    date: "2025-11-07",
  },
  {
    id: 4,
    campus: "Waterloohain",
    roomName: "Christoph-Probst-Weg",
    title: "Datenbanken",
    startTime: "10:00",
    endTime: "12:00",
    date: "2025-11-07",
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
function getSessionToken(request: { headers: { get: (arg0: string) => any; }; }) {
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

    // Fetch bookings from database for this user
    const bookings = await prisma.roomBooking.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        date: "asc",
      },
    });

    console.log(
      "📚 Loading bookings from database for userId:",
      userId,
      "- Found:",
      bookings.length
    );

    // Convert date objects to ISO strings for JSON serialization
    const serializedBookings = bookings.map((booking: { date: { toISOString: () => string; }; createdAt: { toISOString: () => any; }; updatedAt: { toISOString: () => any; }; }) => ({
      ...booking,
      date: booking.date.toISOString().split("T")[0],
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));

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
  type CampusKey = keyof typeof CAMPUS_ROOMS;
  const [selectedLocation, setSelectedLocation] = useState<CampusKey>("Hammerbrook");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [isLoading, setIsLoading] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);

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
  const handleBookRoom = (room: { id: React.Key | null | undefined; name: string | number | React.ReactNode; }) => {
    if (!userId) {
      showErrorToast("Benutzer nicht angemeldet");
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
      `Raum ${String(room.name)} wird gebucht... Zeit: ${startTime} - ${endTime}`
    );
  };

  // Verfügbarkeit prüfen
  const handleCheckAvailability = () => {
    if (!startTime || !endTime) {
      showErrorToast("Bitte wählen Sie Start- und Endzeit");
      return;
    }

    if (startTime >= endTime) {
      showErrorToast("Startzeit muss vor der Endzeit liegen");
      return;
    }

    console.log("🔍 Checking availability:", {
      startTime,
      endTime,
      campus: selectedLocation,
    });
    setAvailabilityChecked(true);

    const availableRooms = rooms.filter((room: { name: any; }) => {
      const { status } = getRoomStatus(room.name);
      return status === "frei";
    });

    showSuccessToast(
      `${availableRooms.length} von ${rooms.length} Räumen verfügbar für ${startTime} - ${endTime}`
    );
  };

  // Stornierungsfunktion mit React Router action
  const handleCancelBooking = (roomName: any) => {
    const booking = bookings.find(
      (b: { roomName: any; campus: string; }) => b.roomName === roomName && b.campus === selectedLocation
    );

    if (!booking) {
      showErrorToast("Buchung nicht gefunden");
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

    showInfoToast(`Buchung für ${roomName} wird storniert...`);
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
        purpose: `Vorlesung: ${lec.title}`,
        person: "Dozent:in",
        until: lec.endTime,
        key: `lec-${lec.id}`,
      })
    );

    bookings
      .filter((b: any) => b.campus === selectedLocation)
      .forEach((b: any) =>
        rows.push({
          room: b.roomName,
          purpose: "Gebucht (du)",
          person: `User #${userId}`,
          until: `${b.startTime}–${b.endTime}`,
          key: `book-${b.id}`,
        })
      );

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

    // Check if room has lecture
    const lecture = todayLectures.find((l) => l.roomName === name);
    if (lecture) {
      return { status: "belegt", lecture, booking: null };
    }

    // Check if room is booked by user
    const booking = bookings.find(
      (b: any) => b.roomName === name && b.campus === selectedLocation
    );
    if (booking) {
      return { status: "gebucht", lecture: null, booking };
    }

    return { status: "frei", lecture: null, booking: null };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-semibold"
          >
            ← Zurück zum Dashboard
          </Link>
          <div className="rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-wrap items-start gap-4 justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-4 w-4" />
                Room Booking
              </div>
              <h1 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
                Raumbuchung – IU Hamburg Campus
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                {campusDetail.subtitle}. {campusDetail.note}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm shadow-inner">
              <Clock className="h-4 w-4 text-indigo-500" />
              <div>
                <div className="font-semibold">Heute</div>
                <div className="text-slate-600 dark:text-slate-300">
                  {new Date().toLocaleDateString("de-DE", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campus selector */}
        <div className="flex flex-wrap gap-3">
          {(Object.keys(CAMPUS_ROOMS) as (keyof typeof CAMPUS_ROOMS)[]).map(
            (campus) => (
              <button
                key={campus}
                onClick={() => setSelectedLocation(campus)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                  selectedLocation === campus
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-400"
                }`}
              >
                <MapPin className="h-4 w-4" />
                {campus}
              </button>
            )
          )}
        </div>

        {/* Time Filter + legend */}
        <div className="grid gap-4 lg:grid-cols-[1.4fr,0.6fr]">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Von
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Clock className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Bis
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Clock className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <button
                onClick={handleCheckAvailability}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-500/20"
              >
                <Check className="h-4 w-4" />
                Verfügbarkeit prüfen
              </button>
              {availabilityChecked ? (
                <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                  Slots geprüft
                </span>
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Wähle Zeitfenster aus und prüfe die freien Räume.
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <Info className="h-4 w-4" />
              Legende
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Frei", cls: "bg-emerald-500" },
                { label: "Belegt (Vorlesung)", cls: "bg-orange-500" },
                { label: "Gebucht von dir", cls: "bg-fuchsia-500" },
                { label: "Bald belegt", cls: "bg-yellow-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded ${item.cls}`} />
                  <span className="text-slate-600 dark:text-slate-300">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick occupancy snapshot */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400 font-semibold">
                Live Übersicht
              </p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Wer nutzt gerade welchen Raum?
              </h3>
            </div>
            <Users className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold">Raum</th>
                  <th className="text-left px-4 py-2 font-semibold">Wo?</th>
                  <th className="text-left px-4 py-2 font-semibold">Zweck</th>
                  <th className="text-left px-4 py-2 font-semibold">bis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {occupancyRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-3 text-slate-500 dark:text-slate-400"
                    >
                      Keine Belegungen für heute.
                    </td>
                  </tr>
                ) : (
                  occupancyRows.map((row) => (
                    <tr key={row.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {row.room}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {selectedLocation}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {row.purpose} — {row.person}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {row.until}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room: { name: any; id: React.Key | null | undefined; capacity: number; }) => {
            const { status, lecture, booking } = getRoomStatus(room.name);

            const stateStyles =
              status === "belegt"
                ? {
                    border: "border-orange-400",
                    text: "text-orange-600",
                    badge: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-200",
                  }
                : status === "gebucht"
                ? {
                    border: "border-fuchsia-400",
                    text: "text-fuchsia-600",
                    badge: "bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-200",
                  }
                : {
                    border: "border-emerald-400",
                    text: "text-emerald-600",
                    badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200",
                  };

            return (
              <div
                key={room.id}
                className={`rounded-2xl bg-white dark:bg-slate-900 border-2 ${stateStyles.border} shadow-sm hover:shadow-lg transition-all duration-200 p-5 flex flex-col gap-4`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-semibold">
                      {selectedLocation}
                    </p>
                    <h3 className={`text-xl font-bold ${stateStyles.text}`}>
                      {room.name}
                    </h3>
                    <div className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {room.capacity} Plätze
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stateStyles.badge}`}>
                    {status === "gebucht"
                      ? "Gebucht"
                      : status === "belegt"
                      ? "Belegt"
                      : "Frei"}
                  </span>
                </div>

                {lecture ? (
                  <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-xl p-3">
                    <p className="text-sm text-orange-800 dark:text-orange-200 font-semibold">
                      Vorlesung: {lecture.title}
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      {lecture.startTime} – {lecture.endTime}
                    </p>
                  </div>
                ) : status === "gebucht" && booking ? (
                  <div className="bg-fuchsia-50 dark:bg-fuchsia-950/30 border border-fuchsia-200 dark:border-fuchsia-800 rounded-xl p-3 space-y-1">
                    <p className="text-sm text-fuchsia-800 dark:text-fuchsia-100 font-semibold">
                      ✓ Gebucht von dir
                    </p>
                    <p className="text-xs text-fuchsia-700 dark:text-fuchsia-200">
                      {booking.startTime} – {booking.endTime}
                    </p>
                    <p className="text-xs text-fuchsia-700 dark:text-fuchsia-200">
                      {new Date(booking.date).toLocaleDateString("de-DE", {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </p>
                  </div>
                ) : (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3">
                    <p className="text-sm text-emerald-800 dark:text-emerald-100 font-semibold">
                      Frei – jetzt buchen
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-200">
                      Empfohlene Slots: {startTime} – {endTime}
                    </p>
                  </div>
                )}

                <div className="mt-auto flex gap-2">
                  {status === "gebucht" && booking ? (
                    <button
                      onClick={() => handleCancelBooking(room.name)}
                      disabled={isLoading}
                      className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Wird storniert..." : "Buchung stornieren"}
                    </button>
                  ) : status === "belegt" ? (
                    <button
                      disabled
                      className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold px-4 py-2 cursor-not-allowed"
                    >
                      Belegt durch Vorlesung
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBookRoom(room)}
                      disabled={isLoading}
                      className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Wird gebucht..." : "Buchen"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
