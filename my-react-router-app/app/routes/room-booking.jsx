import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const HAMBURG_LOCATIONS = {
  Hammerbrook: {
    rooms: [
      { id: 1, name: "Altona", capacity: 150, type: "Lecture Hall" },
      { id: 2, name: "Eimsbüttel", capacity: 40, type: "Seminar" },
      { id: 3, name: "Wandsbek", capacity: 30, type: "Lab" },
      { id: 4, name: "Hamburg-Mitte", capacity: 12, type: "Meeting" },
    ],
  },
  Waterloohain: {
    rooms: [
      { id: 5, name: "Harburg", capacity: 200, type: "Lecture Hall" },
      { id: 6, name: "Bergedorf", capacity: 50, type: "Seminar" },
      { id: 7, name: "Ottensen", capacity: 20, type: "Group" },
      { id: 8, name: "St. Pauli", capacity: 25, type: "Exam" },
    ],
  },
};

const TIME_SLOTS = [
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

export const loader = async () => {
  return null;
};

export default function RoomBooking() {
  const [searchParams] = useSearchParams();
  const [selectedLocation, setSelectedLocation] = useState("Hammerbrook");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const campus = searchParams.get("campus");
    if (campus && HAMBURG_LOCATIONS[campus]) {
      setSelectedLocation(campus);
    }
  }, [searchParams]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (selectedRoom && selectedDate && selectedTime) {
      const newBooking = {
        id: Date.now(),
        room: selectedRoom.name,
        location: selectedLocation,
        date: selectedDate,
        time: selectedTime,
        duration: "1 hour",
      };
      setBookings([...bookings, newBooking]);
      setSelectedRoom(null);
      setSelectedDate("");
      setSelectedTime("");
      setShowForm(false);
    }
  };

  const cancelBooking = (id) => {
    setBookings(bookings.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white px-8 py-8 shadow-xl">
        <div className="container mx-auto">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-4 font-semibold"
          >
            ← Zurück zum Dashboard
          </Link>
          <h1 className="text-4xl font-black mb-2">🏛️ Raumbuchung</h1>
          <p className="text-slate-200 text-lg">
            Buche Räume an den IU Campus-Standorten in Hamburg
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg text-lg mb-8"
              >
                ➕ Neue Raumbuchung
              </button>
            ) : null}

            {showForm && (
              <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-slate-200 mb-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Raum buchen
                </h2>

                <form onSubmit={handleBooking} className="space-y-6">
                  {/* Campus Selection */}
                  <div>
                    <label className="block text-base font-bold text-slate-900 mb-3">
                      📍 Campus
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.keys(HAMBURG_LOCATIONS).map((location) => (
                        <button
                          key={location}
                          type="button"
                          onClick={() => {
                            setSelectedLocation(location);
                            setSelectedRoom(null);
                          }}
                          className={`p-4 rounded-lg font-bold transition ${
                            selectedLocation === location
                              ? "bg-cyan-600 text-white border-2 border-cyan-700"
                              : "bg-slate-100 text-slate-900 border-2 border-slate-200 hover:border-cyan-400"
                          }`}
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Room Selection */}
                  <div>
                    <label className="block text-base font-bold text-slate-900 mb-3">
                      🚪 Raum
                    </label>
                    <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                      {HAMBURG_LOCATIONS[selectedLocation].rooms.map((room) => (
                        <button
                          key={room.id}
                          type="button"
                          onClick={() => setSelectedRoom(room)}
                          className={`p-4 rounded-lg text-left font-semibold transition ${
                            selectedRoom?.id === room.id
                              ? "bg-blue-600 text-white border-2 border-blue-700"
                              : "bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-blue-400"
                          }`}
                        >
                          <div className="font-bold">{room.name}</div>
                          <div className="text-sm opacity-75">
                            👥 {room.capacity} Plätze • {room.type}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-base font-bold text-slate-900 mb-3">
                      📅 Datum
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-cyan-600 focus:outline-none font-semibold"
                      required
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-base font-bold text-slate-900 mb-3">
                      ⏰ Uhrzeit
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-cyan-600 focus:outline-none font-semibold"
                      required
                    >
                      <option value="">-- Wähle eine Uhrzeit --</option>
                      {TIME_SLOTS.map((time) => (
                        <option key={time} value={time}>
                          {time} - {String(parseInt(time) + 1).padStart(2, "0")}
                          :00
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg"
                    >
                      ✅ Buchen
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg"
                    >
                      ❌ Abbrechen
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* My Bookings */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-slate-200">
              <h2 className="text-2xl font-black text-slate-900 mb-6">
                Meine Buchungen ({bookings.length})
              </h2>

              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-600 text-lg font-semibold">
                    Keine Buchungen vorhanden
                  </p>
                  <p className="text-slate-500">Buche deinen ersten Raum! 👆</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-6 border-2 border-slate-200 hover:border-blue-400 transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-black text-slate-900">
                            {booking.room}
                          </h3>
                          <p className="text-sm text-slate-600 font-semibold">
                            📍 {booking.location}
                          </p>
                        </div>
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 font-bold px-4 py-2 rounded-lg transition"
                        >
                          ❌ Stornieren
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600 font-semibold">Datum</p>
                          <p className="text-slate-900 font-bold">
                            {new Date(booking.date).toLocaleDateString("de-DE")}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600 font-semibold">
                            Uhrzeit
                          </p>
                          <p className="text-slate-900 font-bold">
                            {booking.time} -{" "}
                            {String(parseInt(booking.time) + 1).padStart(
                              2,
                              "0"
                            )}
                            :00
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Campus Info Sidebar */}
          <div className="space-y-6">
            {/* Hammerbrook Info */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-300">
              <h3 className="text-xl font-black text-slate-900 mb-3">
                📍 Hammerbrook
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-slate-700">
                  <strong>Adresse:</strong>
                  <br />
                  Hammerbrook 1<br />
                  20537 Hamburg
                </p>
                <p className="text-slate-700">
                  <strong>☎️ Telefon:</strong>
                  <br />
                  +49 40 1234 5678
                </p>
                <p className="text-slate-700">
                  <strong>🚗 Parken:</strong>
                  <br />
                  Tiefgarage vorhanden
                </p>
                <p className="text-slate-700">
                  <strong>🚌 ÖPNV:</strong>
                  <br />
                  U-Bahn: Hammerbrook
                </p>
              </div>
            </div>

            {/* Waterloohain Info */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300">
              <h3 className="text-xl font-black text-slate-900 mb-3">
                📍 Waterloohain
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-slate-700">
                  <strong>Adresse:</strong>
                  <br />
                  Waterloohain 45
                  <br />
                  20099 Hamburg
                </p>
                <p className="text-slate-700">
                  <strong>☎️ Telefon:</strong>
                  <br />
                  +49 40 9876 5432
                </p>
                <p className="text-slate-700">
                  <strong>🚗 Parken:</strong>
                  <br />
                  Parkhaus in der Nähe
                </p>
                <p className="text-slate-700">
                  <strong>🚌 ÖPNV:</strong>
                  <br />
                  U-Bahn: Waterloohain
                </p>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-cyan-300">
              <h3 className="text-lg font-black text-slate-900 mb-4">
                ℹ️ Infos
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-lg">✅</span>
                  <span className="text-slate-700">
                    <strong>Kostenlos:</strong> Alle Räume sind für Studierende
                    kostenlos
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">⏱️</span>
                  <span className="text-slate-700">
                    <strong>Max. 4 Stunden:</strong> Pro Buchung maximal 4
                    Stunden
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">📅</span>
                  <span className="text-slate-700">
                    <strong>2 Wochen voraus:</strong> Bis zu 2 Wochen im Voraus
                    buchen
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
