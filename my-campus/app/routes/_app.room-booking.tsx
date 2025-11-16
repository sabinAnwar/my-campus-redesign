import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLoaderData,
  useActionData,
  useRevalidator,
} from "react-router-dom";

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
    roomName: "Raum A1",
    title: "Data Analytics",
    startTime: "08:00",
    endTime: "10:00",
    date: "2025-11-07",
  },
  {
    id: 2,
    campus: "Hammerbrook",
    roomName: "Raum B1",
    title: "Business Informatik",
    startTime: "11:00",
    endTime: "13:00",
    date: "2025-11-07",
  },
  {
    id: 3,
    campus: "Waterloohain",
    roomName: "Raum C1",
    title: "Webentwicklung",
    startTime: "09:30",
    endTime: "11:30",
    date: "2025-11-07",
  },
  {
    id: 4,
    campus: "Waterloohain",
    roomName: "Raum C2",
    title: "Datenbanken",
    startTime: "10:00",
    endTime: "12:00",
    date: "2025-11-07",
  },
];

// Helper function to get session token from request cookies
function getSessionToken(request) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const sessionCookie = cookies.find((c) => c.startsWith("session="));

  if (!sessionCookie) return null;
  return sessionCookie.split("=")[1];
}

export async function loader({ request }) {
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

export async function action({ request }) {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  console.log("🎬 Action type:", actionType);

  try {
    // Get session token from cookies
    const token = getSessionToken(request);
    let userId = parseInt(formData.get("userId")) || 1; // Fallback

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

      // Check if user already has a booking for this room and campus
      const existingBooking = await prisma.roomBooking.findFirst({
        where: {
          userId: userId,
          roomName: roomName,
          campus: campus,
          date: new Date(dateStr),
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
            date: new Date(dateStr),
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
      const bookingId = parseInt(formData.get("bookingId"));

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
    return { success: false, error: error.message };
  }
}

// Helper to programmatically generate seat positions for a grid with numbering
function generateSeats(
  prefix,
  roomName,
  rows,
  cols,
  startX,
  startY,
  gapX,
  gapY
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
    { id: "HB-A1", name: "Raum A1", capacity: 18 },
    { id: "HB-A2", name: "Raum A2", capacity: 15 },
    { id: "HB-A3", name: "Raum A3", capacity: 15 },
    { id: "HB-B1", name: "Raum B1", capacity: 20 },
    { id: "HB-B2", name: "Raum B2", capacity: 10 },
  ],
  Waterloohain: [
    { id: "WL-C1", name: "Raum C1", capacity: 18 },
    { id: "WL-C2", name: "Raum C2", capacity: 15 },
    { id: "WL-C3", name: "Raum C3", capacity: 12 },
    { id: "WL-D1", name: "Raum D1", capacity: 20 },
  ],
};

export default function RoomBooking() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const revalidator = useRevalidator();
  const [selectedLocation, setSelectedLocation] = useState("Hammerbrook");
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
  const handleBookRoom = (room) => {
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
      roomId: room.id,
      roomName: room.name,
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
    formData.append("roomId", room.id);
    formData.append("roomName", room.name);
    formData.append("campus", selectedLocation);
    formData.append("date", today);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);

    // Append form data to form
    for (const [key, value] of formData.entries()) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();

    showSuccessToast(
      `Raum ${room.name} wird gebucht... Zeit: ${startTime} - ${endTime}`
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

    const availableRooms = rooms.filter((room) => {
      const { status } = getRoomStatus(room.name);
      return status === "frei";
    });

    showSuccessToast(
      `${availableRooms.length} von ${rooms.length} Räumen verfügbar für ${startTime} - ${endTime}`
    );
  };

  // Stornierungsfunktion mit React Router action
  const handleCancelBooking = (roomName) => {
    const booking = bookings.find(
      (b) => b.roomName === roomName && b.campus === selectedLocation
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
      input.value = value;
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

  // Check if a room has a lecture or is booked
  const getRoomStatus = (roomName) => {
    // Check if room has lecture
    const lecture = todayLectures.find((l) => l.roomName === roomName);
    if (lecture) {
      return { status: "belegt", lecture, booking: null };
    }

    // Check if room is booked by user
    const booking = bookings.find(
      (b) => b.roomName === roomName && b.campus === selectedLocation
    );
    if (booking) {
      return { status: "gebucht", lecture: null, booking };
    }

    return { status: "frei", lecture: null, booking: null };
  };

  return (

      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="container mx-auto max-w-6xl">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 font-medium text-sm"
            >
              ← Zurück zum Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Raumbuchung – IU Hamburg Campus
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-8 py-8 max-w-6xl">
          {/* Campus Selection Tabs */}
          <div className="flex justify-center gap-0 mb-8">
            {Object.keys(CAMPUS_ROOMS).map((campus) => (
              <button
                key={campus}
                onClick={() => setSelectedLocation(campus)}
                className={`px-12 py-4 text-lg font-bold transition-all ${
                  selectedLocation === campus
                    ? "bg-orange-500 text-white rounded-t-xl"
                    : "bg-white text-gray-800 border-2 border-gray-300 rounded-t-xl hover:bg-gray-50"
                }`}
              >
                {campus}
              </button>
            ))}
          </div>

          {/* Time Filter Section */}
          <div className="bg-white rounded-xl border-2 border-gray-300 p-6 mb-8">
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                <label className="text-gray-900 font-bold text-lg">Von:</label>
                <div className="relative">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:border-orange-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🕐
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-gray-900 font-bold text-lg">Bis:</label>
                <div className="relative">
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:border-orange-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🕐
                  </span>
                </div>
              </div>
              <button
                onClick={handleCheckAvailability}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition"
              >
                Verfügbarkeit prüfen
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-700 font-medium">Frei</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-gray-700 font-medium">Belegt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-fuchsia-500 rounded"></div>
              <span className="text-gray-700 font-medium">
                Gebucht (von Ihnen)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-gray-700 font-medium">Bald belegt</span>
            </div>
          </div>

          {/* Location Label */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Standort: {selectedLocation}
          </h2>

          {/* Room Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const { status, lecture, booking } = getRoomStatus(room.name);

              // Border und Text-Farben basierend auf Status
              const borderColor =
                status === "belegt"
                  ? "border-orange-500"
                  : status === "gebucht"
                    ? "border-fuchsia-500"
                    : "border-green-500";

              const textColor =
                status === "belegt"
                  ? "text-orange-600"
                  : status === "gebucht"
                    ? "text-fuchsia-600"
                    : "text-green-600";

              return (
                <div
                  key={room.id}
                  className={`bg-white rounded-xl p-6 border-3 transition-all hover:shadow-lg ${borderColor}`}
                >
                  <h3 className={`text-xl font-bold mb-3 ${textColor}`}>
                    {room.name}
                  </h3>

                  {lecture ? (
                    // Raum mit Vorlesung
                    <>
                      <p className="text-gray-700 font-medium mb-3">
                        Vorlesung: {lecture.title}
                      </p>
                      <div className="bg-gray-100 rounded-lg px-4 py-3 text-center">
                        <span className="text-gray-900 font-bold text-lg">
                          {lecture.startTime} – {lecture.endTime}
                        </span>
                      </div>
                    </>
                  ) : status === "gebucht" && booking ? (
                    // Von Ihnen gebucht
                    <>
                      <p className="text-fuchsia-600 font-bold mb-3 text-lg">
                        ✓ Gebucht (von Ihnen)
                      </p>
                      <div className="bg-fuchsia-100 rounded-lg px-4 py-4 text-center mb-4 border-2 border-fuchsia-300">
                        <p className="text-fuchsia-900 font-bold text-xl">
                          {booking.startTime} – {booking.endTime}
                        </p>
                        <p className="text-fuchsia-700 text-sm mt-1">
                          {new Date(booking.date).toLocaleDateString("de-DE", {
                            weekday: "short",
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCancelBooking(room.name)}
                        disabled={isLoading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      >
                        {isLoading ? "Wird storniert..." : "Buchung stornieren"}
                      </button>
                    </>
                  ) : (
                    // Frei - kann gebucht werden
                    <>
                      <p className="text-gray-600 font-medium mb-4">
                        Keine Belegung
                      </p>
                      <button
                        onClick={() => handleBookRoom(room)}
                        disabled={isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Wird gebucht..." : "Buchen"}
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
 
  );
}
