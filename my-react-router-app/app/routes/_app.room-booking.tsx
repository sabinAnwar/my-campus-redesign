import { useEffect, useMemo, useState } from "react";
import { useLoaderData, useActionData, useRevalidator, useSubmit } from "react-router-dom";

import { prisma } from "~/services/prisma";
import { getUserFromRequest } from "~/services/auth.server";
import { showSuccessToast, showErrorToast, showInfoToast } from "~/utils/toast";
import { useLanguage } from "~/store/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/room-booking";
import {
  RoomBookingHeader,
  CampusSelector,
  OccupancyTable,
  RoomCard,
} from "~/features/room-booking";

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
    campus: "Christoph-Probst-Weg",
    roomName: "Raum 1.01",
    title: "Mathe – Analysis I",
    startTime: "08:00",
    endTime: "10:00",
    date: TODAY_ISO,
  },
  {
    id: 2,
    campus: "Christoph-Probst-Weg",
    roomName: "Raum 1.02",
    title: "Data Analytics",
    startTime: "11:00",
    endTime: "13:00",
    date: TODAY_ISO,
  },
];

const CAMPUS_DETAILS: Record<string, { subtitle: string; note: string }> = {
  "Christoph-Probst-Weg": {
    subtitle: "Zentraler Campus",
    note: "Alle Standorte wurden am Christoph-Probst-Weg gebündelt.",
  },
};

// Demo occupancy table for a quick view (blended with live bookings)
const DEMO_OCCUPANCY = [
  {
    campus: "Christoph-Probst-Weg",
    room: "Raum 1.01",
    purpose: "Mathe-Tutorium",
    person: "Lea Schmidt",
    until: "10:00",
  },
  {
    campus: "Christoph-Probst-Weg",
    room: "Raum 2.01",
    purpose: "Projekt Meeting",
    person: "Finn Reimer",
    until: "12:00",
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

// Disable caching for this route to ensure real-time availability
export function headers({
  actionHeaders,
  loaderHeaders,
  parentHeaders,
}: {
  actionHeaders: Headers;
  loaderHeaders: Headers;
  parentHeaders: Headers;
}) {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate",
  };
}

export async function loader({ request }: { request: Request }) {
  try {
    const sessionUser = await getUserFromRequest(request);
    let userId = sessionUser?.id ?? null;
    if (!userId) {
      const demo = await prisma.user.findUnique({
        where: { email: "student.demo@iu-study.org" },
        select: { id: true },
      });
      userId = demo?.id ?? null;
    }
    if (!userId) {
      const fallback = await prisma.user.findFirst({
        where: { role: "STUDENT" },
        select: { id: true },
      });
      userId = fallback?.id ?? null;
    }

    // Fetch all bookings to show occupancy for everyone
    // Only fetch bookings for TODAY to avoid loading future bookings as conflicts
    const todayStr = new Date().toISOString().split("T")[0];
    const startOfDay = new Date(todayStr); // 00:00:00 UTC
    const endOfDay = new Date(todayStr);
    endOfDay.setDate(endOfDay.getDate() + 1); // Next day 00:00:00 UTC

    const bookings = await prisma.roomBooking.findMany({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
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

    console.log(" Loading all bookings - Found:", bookings.length);

    // Convert date objects to ISO strings for JSON serialization
    const serializedBookings = bookings.map(
      (booking: any) => ({
        ...booking,
        userId: booking.user_id,
        startTime: booking.start_time,
        endTime: booking.end_time,
        roomName: booking.room_name,
        date: booking.date.toISOString().split("T")[0],
        created_at: booking.created_at.toISOString(),
        updated_at: booking.updated_at.toISOString(),
      })
    );

    return { bookings: serializedBookings, userId };
  } catch (error) {
    console.error("Error loading bookings:", error);
    return { bookings: [], userId: null };
  }
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  console.log(" Action type:", actionType);

  try {
    const sessionUser = await getUserFromRequest(request);
    let userId = sessionUser?.id ?? null;
    if (!userId) {
      const demo = await prisma.user.findUnique({
        where: { email: "student.demo@iu-study.org" },
        select: { id: true },
      });
      userId = demo?.id ?? null;
    }
    if (!userId) {
      const fallback = await prisma.user.findFirst({
        where: { role: "STUDENT" },
        select: { id: true },
      });
      userId = fallback?.id ?? null;
    }
    if (!userId) {
      return {
        success: false,
        error: "Keine gültige Benutzer-Session gefunden.",
      };
    }

    if (actionType === "create") {
      const roomId = formData.get("roomId") || formData.get("room_id");
      const roomName = formData.get("roomName") || formData.get("room_name");
      const campus = formData.get("campus");
      const dateStr = formData.get("date");
      const startTime = formData.get("startTime") || formData.get("start_time");
      const endTime = formData.get("endTime") || formData.get("end_time");

      // Normalize date from FormData (FormData.get can return FormDataEntryValue | null)
      // Ensure we always work with "YYYY-MM-DD" at midnight to avoid time mismatches
      const dateStringRaw = dateStr ? String(dateStr) : new Date().toISOString().split("T")[0];
      const bookingDate = new Date(dateStringRaw);

      // Check if user already has a booking for this room and campus
      const existingBooking = await prisma.roomBooking.findFirst({
        where: {
          user_id: userId,
          room_name: String(roomName),
          campus: String(campus),
          date: bookingDate,
        },
      });

      // 1. Check if USER has any overlapping booking in ANY room (Double booking constraint)
      const userTimeConflict = await prisma.roomBooking.findFirst({
        where: {
          user_id: userId,
          date: bookingDate,
          start_time: { lt: String(endTime) },
          end_time: { gt: String(startTime) },
          // If updating my own booking for Room A, exclude Room A from the check
          // If existingBooking is found (same room), we exclude it
          id: existingBooking ? { not: existingBooking.id } : undefined,
        },
      });

      if (userTimeConflict) {
        console.log(
          ` Auto-cancelling conflicting booking ${userTimeConflict.id} (${userTimeConflict.room_name}) to allow new booking.`
        );
        await prisma.roomBooking.delete({
          where: { id: userTimeConflict.id },
        });
      }

      // 2. Check for conflicting bookings from ANY user for THIS room
      const conflictingBooking = await prisma.roomBooking.findFirst({
        where: {
          room_name: String(roomName),
          campus: String(campus),
          date: bookingDate,
          start_time: { lt: String(endTime) },
          end_time: { gt: String(startTime) },
          // If updating my own booking, exclude it from conflict check
          id: existingBooking ? { not: existingBooking.id } : undefined,
        },
      });

      if (conflictingBooking) {
        return {
          success: false,
          error: "Dieser Raum ist zu der gewählten Zeit bereits belegt.",
        };
      }

      let booking;
      if (existingBooking) {
        // Update existing booking
        console.log(" Updating existing booking for", roomName);
        booking = await prisma.roomBooking.update({
          where: { id: existingBooking.id },
          data: {
            start_time: String(startTime),
            end_time: String(endTime),
          },
        });
      } else {
        // Create new booking
        console.log(" Creating new booking for", roomName);
        booking = await prisma.roomBooking.create({
          data: {
            user_id: userId,
            room_id: String(roomId),
            room_name: String(roomName),
            campus: String(campus),
            date: bookingDate,
            start_time: String(startTime),
            end_time: String(endTime),
          },
        });
      }

      console.log(" Booking created/updated:", { id: booking.id, date: booking.date, room: booking.room_name });

      return {
        success: true,
        booking: {
          ...booking,
          date: booking.date.toISOString().split("T")[0],
          created_at: booking.created_at.toISOString(),
          updated_at: booking.updated_at.toISOString(),
        },
      };
    }

    if (actionType === "delete") {
      const bookingId = parseInt(String(formData.get("bookingId") ?? "0"), 10);

      console.log(" Deleting booking:", bookingId);

      await prisma.roomBooking.delete({
        where: { id: bookingId },
      });

      console.log(" Booking deleted successfully");
      return { success: true, type: "delete" };
    }

    return { success: false, error: "Invalid action" };
  } catch (error) {
    console.error(" Action error:", error);
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
  "Christoph-Probst-Weg": [
    { id: "CPW-01", name: "Raum 1.01", capacity: 20 },
    { id: "CPW-02", name: "Raum 1.02", capacity: 15 },
    { id: "CPW-03", name: "Raum 2.01", capacity: 25 },
    { id: "CPW-04", name: "Raum 2.02", capacity: 12 },
  ],
};

export default function RoomBooking() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const revalidator = useRevalidator();
  const submit = useSubmit();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  type CampusKey = keyof typeof CAMPUS_ROOMS;
  const [selectedLocation, setSelectedLocation] =
    useState<CampusKey>("Christoph-Probst-Weg");
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
      console.log(" Action completed successfully. Reloading...");
      setIsLoading(false);
      // Force reload to ensure clean state and fresh data
      window.location.reload();
    } else if (actionData?.error) {
      setIsLoading(false);
      showErrorToast(actionData.error);
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
      console.log(" Already processing a request");
      return;
    }

    setIsLoading(true);
    const today = new Date().toISOString().split("T")[0];

    console.log(" Booking room:", {
      userId,
      roomId: String(room.id),
      roomName: String(room.name),
      campus: selectedLocation,
      date: today,
      startTime,
      endTime,
    });

    // Create form and submit to server action
    const formData = new FormData();
    formData.append("_action", "create");
    formData.append("userId", userId.toString());
    formData.append("roomId", String(room.id));
    formData.append("roomName", String(room.name));
    formData.append("campus", selectedLocation);
    formData.append("date", today);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);

    submit(formData, { method: "post" });

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

    console.log(" Checking availability:", {
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
  const handleCancelBooking = (bookingId: number, roomName: string) => {
    console.log(" handleCancelBooking triggered for ID:", bookingId);
    if (isLoading) {
      console.log(" Already processing a request");
      return;
    }

    setIsLoading(true);
    console.log(" Cancelling booking:", bookingId);

    const formData = new FormData();
    formData.append("_action", "delete");
    formData.append("bookingId", bookingId.toString());

    submit(formData, { method: "post", encType: "multipart/form-data" });

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
          until: `${b.startTime || b.start_time}–${b.endTime || b.end_time}`,
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

  const dateLabel = new Date().toLocaleDateString(
    language === "de" ? "de-DE" : "en-US",
    { weekday: "long", day: "2-digit", month: "2-digit" }
  );

  const subtitle =
    language === "de"
      ? "Verwalte deine Raumbuchungen und finde freie Lernplätze auf dem Campus."
      : "Manage your room bookings and find available study spots on campus.";

  return (
    <div className="max-w-7xl mx-auto relative z-10 space-y-6 sm:space-y-8 md:space-y-10">
      <RoomBookingHeader
        title={t.roomBooking}
        subtitle={subtitle}
        dateLabel={dateLabel}
        liveStatus={t.liveStatus}
        occupiedLabel={t.occupied}
        occupiedCount={occupancyRows.length}
      />

      <CampusSelector
        campuses={Object.keys(CAMPUS_ROOMS)}
        selectedCampus={selectedLocation}
        onSelectCampus={(campus) => setSelectedLocation(campus as CampusKey)}
      />

      <OccupancyTable
        rows={occupancyRows}
        selectedLocation={selectedLocation}
        labels={{
          whoUsesRoom: t.whoUsesRoom,
          room: t.room,
          where: t.where,
          purpose: t.purpose,
          until: t.until,
          noOccupancies: t.noOccupancies,
        }}
      />

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {rooms.map((room: { name: string; id: string; capacity: number }) => {
          const { status, lecture, booking } = getRoomStatus(room.name);

          return (
            <RoomCard
              key={room.id}
              room={room}
              status={status as "frei" | "belegt" | "belegt-user" | "gebucht"}
              lecture={lecture}
              booking={booking}
              currentUserId={userId}
              selectedLocation={selectedLocation}
              startTime={startTime}
              endTime={endTime}
              isLoading={isLoading}
              onBookRoom={() => handleBookRoom(room)}
              onCancelBooking={() =>
                booking && handleCancelBooking(booking.id, String(room.name))
              }
              labels={{
                seats: t.seats,
                occupied: t.occupied,
                available: t.available,
                lecture: t.lecture,
                bookedBy: t.bookedBy,
                booked: t.booked,
                freeNow: t.freeNow,
                cancelBooking: t.cancelBooking,
                bookNow: t.bookNow,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
