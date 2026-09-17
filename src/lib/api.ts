import type { BatchMode, Timetable } from "@/types/schedule";

export async function saveTimetable(
  mode: BatchMode,
  data: Timetable
): Promise<void> {
  const res = await fetch("/api/save-timetable", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, data }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to save timetable");
  }
}
