import type {
  Timetable,
  ProfData,
  SubjectData,
  ParsedClass,
} from "@/types/schedule";

/**
 * Parse "9:25 AM" or "12:15 PM" into total minutes since midnight.
 */
export function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Format minutes since midnight to "h:mm A" display string.
 */
export function formatMinutesToTime(totalMinutes: number): string {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;
  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getDayName(date: Date = new Date()): string {
  return DAYS[date.getDay()];
}

export function getCurrentMinutes(date: Date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * Build a parsed class list for a given day, enriched with subject + prof data.
 */
export function buildDaySchedule(
  timetable: Timetable,
  profs: ProfData,
  subjects: SubjectData,
  day: string
): ParsedClass[] {
  const entries = timetable[day];
  if (!entries) return [];

  return entries
    .filter((e) => e.subject_code !== null)
    .map((entry) => {
      const code = entry.subject_code!;
      const [startStr, endStr] = entry.time.split(" - ");

      const subjectInfo = subjects.subjects.find((s) => s.code === code);
      const profInfo = profs.subjects.find((s) => s.code === code);

      return {
        subjectCode: code,
        subjectName: subjectInfo?.name ?? profInfo?.name ?? code,
        staffIncharge: profInfo?.staff_incharge ?? "TBA",
        timeDisplay: entry.time,
        startMinutes: parseTimeToMinutes(startStr),
        endMinutes: parseTimeToMinutes(endStr),
        isLab: code.includes("Lab"),
        isBridge: code.startsWith("BX"),
      };
    });
}

/**
 * Find the class happening right now.
 */
export function findCurrentClass(
  schedule: ParsedClass[],
  nowMinutes: number
): ParsedClass | null {
  return (
    schedule.find(
      (c) => nowMinutes >= c.startMinutes && nowMinutes < c.endMinutes
    ) ?? null
  );
}

/**
 * Find the next upcoming class.
 */
export function findUpcomingClass(
  schedule: ParsedClass[],
  nowMinutes: number
): ParsedClass | null {
  return schedule.find((c) => c.startMinutes > nowMinutes) ?? null;
}

export { DAYS };
