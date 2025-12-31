export type EventType = "Lecture" | "Seminar" | "Lab" | "Office Hours";

export interface CalendarEvent {
  id: number;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: string;
  location: string;
  professor?: string;
  zoom: string | null;
  description?: string;
}
