import type { ScheduleEvent } from "~/types/schedule";
import { DEFAULT_PALETTE, toISODate } from "~/lib/studyPlans";

/**
 * Get an array of weekday dates (Mon-Fri) for a given date's week.
 */
export function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  const monday = new Date(date);
  monday.setDate(diff);

  const week: Date[] = [];
  for (let i = 0; i < 5; i++) {
    // Only weekdays
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
}

/**
 * Calculate event position and height for the week view grid.
 */
export function getEventStyle(event: ScheduleEvent) {
  const startHour = parseInt(event.startTime.split(":")[0]);
  const startMinute = parseInt(event.startTime.split(":")[1]);
  const endHour = parseInt(event.endTime.split(":")[0]);
  const endMinute = parseInt(event.endTime.split(":")[1]);

  const top = (startHour - 8) * 60 + startMinute; // 8:00 is the start
  const height = (endHour - startHour) * 60 + (endMinute - startMinute);

  return {
    top: `${top}px`,
    height: `${Math.max(height, 30)}px`,
  };
}

/**
 * Check if an event is currently happening.
 */
export function isEventLive(event: ScheduleEvent, now: Date): boolean {
  const todayStr = toISODate(now);
  if (event.date !== todayStr) return false;

  const [startH, startM] = event.startTime.split(":").map(Number);
  const [endH, endM] = event.endTime.split(":").map(Number);

  const startTime = new Date(now);
  startTime.setHours(startH, startM, 0);

  const endTime = new Date(now);
  endTime.setHours(endH, endM, 0);

  return now >= startTime && now <= endTime;
}

/**
 * Generate ICS file content for calendar export.
 */
export function generateICSContent(
  events: ScheduleEvent[],
  studyBlocks: { start: string; end: string; status: string }[]
): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MyCampus//Schedule//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  // Add schedule events
  events.forEach((event) => {
    const startDate = event.date.replace(/-/g, "");
    const startTime = event.startTime.replace(":", "") + "00";
    const endTime = event.endTime.replace(":", "") + "00";

    lines.push(
      "BEGIN:VEVENT",
      `DTSTART:${startDate}T${startTime}`,
      `DTEND:${startDate}T${endTime}`,
      `SUMMARY:${event.title}`,
      `LOCATION:${event.location || ""}`,
      `DESCRIPTION:${event.courseCode}${event.professor ? " - " + event.professor : ""}${event.isOptional ? " (Optional)" : ""}`,
      `UID:${event.id}-${startDate}@mycampus`,
      "END:VEVENT"
    );
  });

  // Add study phase blocks
  studyBlocks.forEach((block, idx) => {
    const startDate = block.start.replace(/-/g, "");
    const endDate = block.end.replace(/-/g, "");
    const config = DEFAULT_PALETTE[block.status];

    lines.push(
      "BEGIN:VEVENT",
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${endDate}`,
      `SUMMARY:${config.label}`,
      `DESCRIPTION:Semesterphase: ${config.label}`,
      `UID:phase-${idx}-${startDate}@mycampus`,
      "END:VEVENT"
    );
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
