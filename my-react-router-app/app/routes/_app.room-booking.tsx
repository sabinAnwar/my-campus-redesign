import { useEffect, useMemo, useState } from "react";
import { useLoaderData, useActionData, useRevalidator } from "react-router-dom";

import { prisma } from "../lib/prisma";
import { showSuccessToast, showErrorToast, showInfoToast } from "../lib/toast";
import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/room-booking";
import {
  RoomBookingHeader,
  CampusSelector,
  OccupancyTable,
  RoomCard,
} from "~/components/room-booking";

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

  const dateLabel = new Date().toLocaleDateString(
    language === "de" ? "de-DE" : "en-US",
    { weekday: "long", day: "2-digit", month: "2-digit" }
  );

  const subtitle =
    language === "de"
      ? "Verwalte deine Raumbuchungen und finde freie Lernplätze auf dem Campus."
      : "Manage your room bookings and find available study spots on campus.";

  return (
    <div className="max-w-7xl mx-auto relative z-10 space-y-6 sm:space-y-8 md:space-y-12 px-1 sm:px-0">
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
              onCancelBooking={() => handleCancelBooking(room.name)}
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
