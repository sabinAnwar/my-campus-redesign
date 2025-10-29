import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EVENTS = [
  {
    id: 1,
    title: 'Webentwicklung - Vorlesung',
    type: 'Lecture',
    date: '2025-10-27',
    time: '10:00',
    duration: '90 minutes',
    location: 'Hörsaal A1, Hammerbrook',
    professor: 'Prof. Dr. Schmidt',
    zoom: 'https://zoom.us/j/1234567890',
    description: 'Moderne Web-Technologien und Best Practices'
  },
  {
    id: 2,
    title: 'Datenbankdesign - Seminar',
    type: 'Seminar',
    date: '2025-10-27',
    time: '13:00',
    duration: '60 minutes',
    location: 'Seminarraum B2, Hammerbrook',
    professor: 'Prof. Dr. Mueller',
    zoom: 'https://zoom.us/j/0987654321',
    description: 'Übungen zu Datenbank-Normalisierung'
  },
  {
    id: 3,
    title: 'Cloud Computing - Praktikum',
    type: 'Lab',
    date: '2025-10-28',
    time: '14:00',
    duration: '120 minutes',
    location: 'Computerlab C3, Hammerbrook',
    professor: 'Prof. Dr. Weber',
    zoom: null,
    description: 'Hands-on mit AWS und Docker'
  },
  {
    id: 4,
    title: 'Sprechstunde Betreuer',
    type: 'Office Hours',
    date: '2025-10-29',
    time: '15:00',
    duration: '30 minutes',
    location: 'Virtual',
    professor: 'Prof. Dr. Bauer',
    zoom: 'https://zoom.us/j/1111111111',
    description: 'Individuelle Beratung für Abschlussarbeiten'
  }
];

export const loader = async () => {
  return null;
};

export default function Events() {
  const [selectedType, setSelectedType] = useState('All');
  const types = ['All', 'Lecture', 'Seminar', 'Lab', 'Office Hours'];

  const filteredEvents = selectedType === 'All' 
    ? EVENTS 
    : EVENTS.filter(e => e.type === selectedType);

  const getTypeColor = (type) => {
    const colors = {
      'Lecture': 'from-blue-600 to-cyan-600',
      'Seminar': 'from-purple-600 to-pink-600',
      'Lab': 'from-green-600 to-emerald-600',
      'Office Hours': 'from-orange-600 to-red-600'
    };
    return colors[type] || 'from-slate-600 to-slate-700';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Lecture': '📚',
      'Seminar': '👥',
      'Lab': '💻',
      'Office Hours': '👨‍🏫'
    };
    return icons[type] || '📅';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white px-8 py-8 shadow-xl">
        <div className="container mx-auto">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-4 font-semibold">
            ← Zurück zum Dashboard
          </Link>
          <h1 className="text-4xl font-black mb-2">📅 Meine Termine</h1>
          <p className="text-slate-200 text-lg">Alle deine Vorlesungen, Seminare und Sprechstunden</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filter */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Filtern nach Typ:</h2>
          <div className="flex flex-wrap gap-3">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2 rounded-full font-bold transition ${
                  selectedType === type
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-white text-slate-900 border-2 border-slate-200 hover:border-slate-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline View */}
        <div className="max-w-4xl">
          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-slate-200">
              <p className="text-slate-600 text-lg font-semibold">Keine Termine gefunden</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEvents.map((event, index) => {
                const eventDate = new Date(event.date);
                const today = new Date();
                const isToday = eventDate.toDateString() === today.toDateString();
                const isFuture = eventDate > today;

                return (
                  <div
                    key={event.id}
                    className={`relative transform transition hover:scale-105 ${!isFuture ? 'opacity-75' : ''}`}
                  >
                    {/* Timeline connector */}
                    {index < filteredEvents.length - 1 && (
                      <div className="absolute left-8 top-24 bottom-0 w-1 bg-gradient-to-b from-slate-400 to-transparent"></div>
                    )}

                    {/* Event Card */}
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-6 lg:p-8">
                      <div className="flex gap-6">
                        {/* Timeline Dot */}
                        <div className="flex flex-col items-center">
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getTypeColor(event.type)} flex items-center justify-center text-2xl font-black text-white shadow-lg`}>
                            {getTypeIcon(event.type)}
                          </div>
                          {isToday && (
                            <div className="mt-3 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full animate-pulse">
                              Heute
                            </div>
                          )}
                        </div>

                        {/* Event Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-2xl font-black text-slate-900">{event.title}</h3>
                              <p className="text-slate-600 font-semibold mt-1">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getTypeColor(event.type)}`}>
                                  {event.type}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Event Info Grid */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div>
                              <p className="text-slate-600 text-sm font-semibold">📅 Datum</p>
                              <p className="text-slate-900 font-bold">{new Date(event.date).toLocaleDateString('de-DE', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 text-sm font-semibold">⏰ Uhrzeit</p>
                              <p className="text-slate-900 font-bold">{event.time}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 text-sm font-semibold">⏱️ Dauer</p>
                              <p className="text-slate-900 font-bold">{event.duration}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 text-sm font-semibold">👨‍🏫 Dozent</p>
                              <p className="text-slate-900 font-bold">{event.professor}</p>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="mb-4">
                            <p className="text-slate-600 text-sm font-semibold">📍 Ort</p>
                            <p className="text-slate-900 font-bold">{event.location}</p>
                          </div>

                          {/* Description */}
                          <div className="mb-6 p-4 bg-slate-50 rounded-lg border-l-4 border-slate-400">
                            <p className="text-slate-700 font-semibold">{event.description}</p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3">
                            {event.zoom && (
                              <a
                                href={event.zoom}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg"
                              >
                                🎥 Zoom Link öffnen
                              </a>
                            )}
                            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg">
                              📌 Zu Kalender hinzufügen
                            </button>
                            <button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg">
                              🔔 Erinnerung setzen
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Calendar Preview */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-6">📆 Kalenderübersicht</h2>
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
              <div key={day} className="font-bold text-slate-900 py-2">{day}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const date = new Date(2025, 9, 1 + i - 0); // October 2025
              const isToday = date.toDateString() === new Date().toDateString();
              const hasEvent = EVENTS.some(e => e.date === date.toISOString().split('T')[0]);
              
              return (
                <div
                  key={i}
                  className={`p-3 rounded-lg font-semibold ${
                    isToday
                      ? 'bg-red-600 text-white'
                      : hasEvent
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-50 text-slate-900 border-2 border-slate-200'
                  }`}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
