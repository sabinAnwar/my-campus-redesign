import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useSearchParams,
  useFetcher,
  useLoaderData,
  useActionData,
  useRevalidator,
} from "react-router-dom";
import AppShell from "../components/AppShell";
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

// In-memory storage for bookings (for development)
// In production, this would be in a database
let inMemoryBookings = [];

export async function loader({ request }) {
  try {
    // For development, we'll use userId 1
    // In production, you'd get this from session
    const userId = 1;

    // Filter bookings for this user
    const userBookings = inMemoryBookings.filter((b) => b.userId === userId);
    console.log(
      "📚 Loading bookings for userId:",
      userId,
      "- Found:",
      userBookings.length
    );

    return { bookings: userBookings, userId };
  } catch (error) {
    console.error("Error loading bookings:", error);
    return { bookings: [], userId: 1 };
  }
}

// Handle form submissions for booking and canceling
export async function action({ request }) {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  console.log("🎬 Action type:", actionType);

  if (actionType === "create") {
    const userId = parseInt(formData.get("userId"));
    const roomId = formData.get("roomId");
    const roomName = formData.get("roomName");
    const campus = formData.get("campus");

    // Check if user already has a booking for this room and campus
    const existingBookingIndex = inMemoryBookings.findIndex(
      (b) =>
        b.userId === userId && b.roomName === roomName && b.campus === campus
    );

    // Create new booking
    const booking = {
      id: Date.now(),
      userId,
      roomId,
      roomName,
      campus,
      date: formData.get("date"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
    };

    if (existingBookingIndex !== -1) {
      // Replace existing booking
      console.log("🔄 Replacing existing booking for", roomName);
      inMemoryBookings[existingBookingIndex] = booking;
    } else {
      // Add new booking
      inMemoryBookings.push(booking);
    }

    console.log("✅ Booking created/updated:", booking);
    console.log("📦 Total bookings in memory:", inMemoryBookings.length);

    return { success: true, booking, bookings: inMemoryBookings };
  }

  if (actionType === "delete") {
    const bookingId = parseInt(formData.get("bookingId"));

    // Remove from in-memory storage
    const beforeLength = inMemoryBookings.length;
    inMemoryBookings = inMemoryBookings.filter((b) => b.id !== bookingId);
    const afterLength = inMemoryBookings.length;

    console.log(
      "🗑️ Booking deleted. Before:",
      beforeLength,
      "After:",
      afterLength
    );
    return { success: true, bookings: inMemoryBookings };
  }

  return { success: false, error: "Invalid action" };
} // Helper to programmatically generate seat positions for a grid with numbering
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
  const fetcher = useFetcher();
  const [selectedLocation, setSelectedLocation] = useState("Hammerbrook");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);

  // Use loader data for initial bookings, or fallback to empty array
  const [bookings, setBookings] = useState(loaderData?.bookings || []);

  // Get userId from loader data or use fallback
  useEffect(() => {
    if (loaderData?.userId) {
      console.log("👤 User ID from loader:", loaderData.userId);
      setUserId(loaderData.userId);
    } else {
      // Fallback for development/testing
      console.log("⚠️ Using fallback userId: 1");
      setUserId(1);
    }
  }, [loaderData]);

  // Update bookings when loader data changes
  useEffect(() => {
    if (loaderData?.bookings) {
      console.log("📚 Loaded bookings:", loaderData.bookings);
      setBookings(loaderData.bookings);
    }
  }, [loaderData]);

  // Update bookings when action completes
  useEffect(() => {
    if (actionData?.success && actionData?.bookings) {
      console.log(
        "✅ Action completed, updating bookings:",
        actionData.bookings
      );
      setBookings(actionData.bookings);
      setIsLoading(false);
    }
  }, [actionData]);

  // Get rooms for selected campus
  const rooms = CAMPUS_ROOMS[selectedLocation] || [];

  // Buchungsfunktion mit React Router action
  const handleBookRoom = async (room) => {
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

    const formData = new FormData();
    formData.append("_action", "create");
    formData.append("userId", userId.toString());
    formData.append("roomId", room.id);
    formData.append("roomName", room.name);
    formData.append("campus", selectedLocation);
    formData.append("date", today);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);

    console.log("📤 Booking room:", {
      userId,
      roomId: room.id,
      roomName: room.name,
      campus: selectedLocation,
      date: today,
      startTime,
      endTime,
    });

    try {
      // Use React Router fetcher to submit the form
      fetcher.submit(formData, { method: "POST" });

      // Add booking to local state immediately for better UX
      const newBooking = {
        id: Date.now(),
        userId,
        roomId: room.id,
        roomName: room.name,
        campus: selectedLocation,
        date: today,
        startTime,
        endTime,
      };

      setBookings([...bookings, newBooking]);
      showSuccessToast(
        `Raum ${room.name} erfolgreich gebucht! Zeit: ${startTime} - ${endTime}`
      );

      // Revalidate to get fresh data from server
      setTimeout(() => {
        revalidator.revalidate();
      }, 100);
    } catch (error) {
      console.error("❌ Booking error:", error);
      showErrorToast("Fehler beim Buchen des Raums");
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
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
  const handleCancelBooking = async (roomName) => {
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

    const formData = new FormData();
    formData.append("_action", "delete");
    formData.append("bookingId", booking.id.toString());

    try {
      // Use React Router fetcher to submit the form
      fetcher.submit(formData, { method: "POST" });

      // Remove booking from local state immediately for better UX
      setBookings(bookings.filter((b) => b.id !== booking.id));
      showInfoToast(`Buchung für ${roomName} storniert`);

      // Revalidate to get fresh data from server
      setTimeout(() => {
        revalidator.revalidate();
      }, 100);
    } catch (error) {
      console.error("❌ Cancel error:", error);
      showErrorToast("Fehler beim Stornieren");
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
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
    <AppShell>
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
    </AppShell>
  );
}
