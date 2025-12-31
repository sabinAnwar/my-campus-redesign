import type { EventType, CalendarEvent } from "~/types/events";

export const TRANSLATIONS = {
  de: {
    courses: "Courses",
    eventsCalendar: "Events & Kalender",
    subtitle: "Alle Termine auf einen Blick, inkl. Kalender-Export",
    all: "Alle",
    lecture: "Vorlesung",
    seminar: "Seminar",
    lab: "Praktikum",
    officeHours: "Sprechstunde",
    previousMonth: "Vorheriger Monat",
    today: "Heute",
    nextMonth: "Nächster Monat",
    calendarView: "Kalenderansicht",
    weekdays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    more: "mehr",
    selectedDay: "Ausgewählter Tag",
    noEvents: "Keine Termine für diesen Tag.",
    details: "Details",
    openZoom: "Zoom öffnen",
    saveIcs: ".ics speichern",
    googleCalendar: "Google Kalender",
    close: "Schließen",
    eventTitles: {
      "1": "Webentwicklung - Vorlesung",
      "2": "Datenbankdesign - Seminar",
      "3": "Cloud Computing - Praktikum",
      "4": "Sprechstunde Betreuer",
    },
    eventLocations: {
      "1": "Hörsaal A1, Hammerbrook",
      "2": "Seminarraum B2, Hammerbrook",
      "3": "Computerlab C3, Hammerbrook",
      "4": "Virtuell",
    },
    eventDescriptions: {
      "1": "Moderne Web-Technologien und Best Practices",
      "2": "Übungen zu Datenbank-Normalisierung",
      "3": "Hands-on mit AWS und Docker",
      "4": "Individuelle Beratung für Abschlussarbeiten",
    },
  },
  en: {
    courses: "Courses",
    eventsCalendar: "Events & Calendar",
    subtitle: "All appointments at a glance, including calendar export",
    all: "All",
    lecture: "Lecture",
    seminar: "Seminar",
    lab: "Lab",
    officeHours: "Office Hours",
    previousMonth: "Previous Month",
    today: "Today",
    nextMonth: "Next Month",
    calendarView: "Calendar View",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    more: "more",
    selectedDay: "Selected Day",
    noEvents: "No events for this day.",
    details: "Details",
    openZoom: "Open Zoom",
    saveIcs: "Save .ics",
    googleCalendar: "Google Calendar",
    close: "Close",
    eventTitles: {
      "1": "Web Development - Lecture",
      "2": "Database Design - Seminar",
      "3": "Cloud Computing - Lab",
      "4": "Office Hours Supervisor",
    },
    eventLocations: {
      "1": "Lecture Hall A1, Hammerbrook",
      "2": "Seminar Room B2, Hammerbrook",
      "3": "Computer Lab C3, Hammerbrook",
      "4": "Virtual",
    },
    eventDescriptions: {
      "1": "Modern web technologies and best practices",
      "2": "Exercises on database normalization",
      "3": "Hands-on with AWS and Docker",
      "4": "Individual consultation for theses",
    },
  },
};

// Demo events (can be replaced with API data later)
export const EVENTS: CalendarEvent[] = [
  {
    id: 1,
    title: "Webentwicklung - Vorlesung",
    type: "Lecture",
    date: "2025-10-27",
    time: "10:00",
    duration: "90 minutes",
    location: "Hörsaal A1, Hammerbrook",
    professor: "Prof. Dr. Schmidt",
    zoom: "https://zoom.us/j/1234567890",
    description: "Moderne Web-Technologien und Best Practices",
  },
  {
    id: 2,
    title: "Datenbankdesign - Seminar",
    type: "Seminar",
    date: "2025-10-27",
    time: "13:00",
    duration: "60 minutes",
    location: "Seminarraum B2, Hammerbrook",
    professor: "Prof. Dr. Mueller",
    zoom: "https://zoom.us/j/0987654321",
    description: "Übungen zu Datenbank-Normalisierung",
  },
  {
    id: 3,
    title: "Cloud Computing - Praktikum",
    type: "Lab",
    date: "2025-10-28",
    time: "14:00",
    duration: "120 minutes",
    location: "Computerlab C3, Hammerbrook",
    professor: "Prof. Dr. Weber",
    zoom: null,
    description: "Hands-on mit AWS und Docker",
  },
  {
    id: 4,
    title: "Sprechstunde Betreuer",
    type: "Office Hours",
    date: "2025-10-29",
    time: "15:00",
    duration: "30 minutes",
    location: "Virtual",
    professor: "Prof. Dr. Bauer",
    zoom: "https://zoom.us/j/1111111111",
    description: "Individuelle Beratung für Abschlussarbeiten",
  },
];

export const typeStyles: Record<
  EventType,
  {
    badge: string;
    dot: string;
  }
> = {
  Lecture: {
    badge: "from-blue-600 to-cyan-600",
    dot: "bg-blue-600",
  },
  Seminar: {
    badge: "from-purple-600 to-pink-600",
    dot: "bg-purple-600",
  },
  Lab: {
    badge: "from-green-600 to-emerald-600",
    dot: "bg-emerald-600",
  },
  "Office Hours": {
    badge: "from-orange-600 to-red-600",
    dot: "bg-orange-600",
  },
};
