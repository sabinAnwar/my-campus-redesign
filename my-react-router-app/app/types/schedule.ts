export interface ScheduleEvent {
  id: number;
  title: string;
  courseCode: string;
  type: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
  professor: string;
  room?: string | null;
  isOnline?: boolean;
  zoomLink?: string;
  isOptional?: boolean;
}
