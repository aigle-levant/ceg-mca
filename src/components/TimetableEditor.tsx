import { useState, useMemo } from "react";
import { Plus, Trash2, Save, X, Clock, AlertCircle } from "lucide-react";
import type { BatchMode, Timetable, TimetableEntry } from "@/types/schedule";
import { cn } from "@/lib/utils";

import profsRegular from "@/data/profs-regular.json";
import profsEvening from "@/data/profs-evening.json";

// ─── Time conversion helpers ────────────────────────────────────────

/** "9:25 AM" → "09:25" (24h for HTML time input) */
function to24Hour(time12: string): string {
  const match = time12.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "09:00";
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

/** "09:25" → "9:25 AM" (12h for JSON storage) */
function to12Hour(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

/** Parse "9:25 AM - 10:15 AM" → { start: "09:25", end: "10:15" } */
function parseTimeRange(time: string): { start: string; end: string } {
  const parts = time.split(" - ");
  return {
    start: parts[0] ? to24Hour(parts[0]) : "09:00",
    end: parts[1] ? to24Hour(parts[1]) : "10:00",
  };
}

/** "09:25", "10:15" → "9:25 AM - 10:15 AM" */
function formatTimeRange(start: string, end: string): string {
  return `${to12Hour(start)} - ${to12Hour(end)}`;
}

// ─── Subject options ────────────────────────────────────────────────

interface SubjectOption {
  code: string;
  name: string;
}

function getSubjectOptions(timetable: Timetable): SubjectOption[] {
  const map = new Map<string, string>();

  // From profs (both batches — most complete source, includes labs)
  for (const s of [...profsRegular.subjects, ...profsEvening.subjects]) {
    map.set(s.code, s.name);
  }

  // From existing timetable data (catches codes not in profs, e.g. bridge labs)
  for (const entries of Object.values(timetable)) {
    for (const entry of entries as TimetableEntry[]) {
      if (entry.subject_code && !map.has(entry.subject_code)) {
        map.set(entry.subject_code, entry.subject_code);
      }
    }
  }

  return Array.from(map.entries())
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

// ─── Constants ──────────────────────────────────────────────────────

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ─── Editor component ──────────────────────────────────────────────

interface EditableEntry {
  id: string;
  startTime: string; // 24h: "09:25"
  endTime: string; // 24h: "10:15"
  subjectCode: string | null;
}

interface TimetableEditorProps {
  mode: BatchMode;
  initialData: Timetable;
  currentDay: string;
  onSave: (data: Timetable) => Promise<void>;
  onCancel: () => void;
}

let entryIdCounter = 0;
function nextId(): string {
  return `entry-${++entryIdCounter}`;
}

function toEditEntries(raw: TimetableEntry[]): EditableEntry[] {
  return raw.map((e) => {
    const { start, end } = parseTimeRange(e.time);
    return {
      id: nextId(),
      startTime: start,
      endTime: end,
      subjectCode: e.subject_code,
    };
  });
}

function toRawEntries(edit: EditableEntry[]): TimetableEntry[] {
  return edit.map((e) => ({
    time: formatTimeRange(e.startTime, e.endTime),
    subject_code: e.subjectCode,
  }));
}

export function TimetableEditor({
  mode,
  initialData,
  currentDay,
  onSave,
  onCancel,
}: TimetableEditorProps) {
  // Deep-clone per day into editable format
  const [editData, setEditData] = useState<Record<string, EditableEntry[]>>(
    () => {
      const result: Record<string, EditableEntry[]> = {};
      for (const day of WEEKDAYS) {
        result[day] = toEditEntries(
          (initialData[day] as TimetableEntry[]) ?? []
        );
      }
      return result;
    }
  );

  const [selectedDay, setSelectedDay] = useState(
    WEEKDAYS.includes(currentDay) ? currentDay : "Monday"
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subjectOptions = useMemo(
    () => getSubjectOptions(initialData),
    [initialData]
  );

  const entries = editData[selectedDay] ?? [];

  // ── Entry operations ──

  function updateEntry(
    entryId: string,
    field: keyof EditableEntry,
    value: string | null
  ) {
    setEditData((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((e) =>
        e.id === entryId ? { ...e, [field]: value } : e
      ),
    }));
  }

  function deleteEntry(entryId: string) {
    setEditData((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((e) => e.id !== entryId),
    }));
  }

  function addEntry() {
    const lastEntry = entries[entries.length - 1];
    const newStart = lastEntry?.endTime ?? "09:00";
    // Default: 50-minute class
    const startMins =
      parseInt(newStart.split(":")[0]) * 60 +
      parseInt(newStart.split(":")[1]);
    const endMins = startMins + 50;
    const newEnd = `${Math.floor(endMins / 60)
      .toString()
      .padStart(2, "0")}:${(endMins % 60).toString().padStart(2, "0")}`;

    setEditData((prev) => ({
      ...prev,
      [selectedDay]: [
        ...prev[selectedDay],
        {
          id: nextId(),
          startTime: newStart,
          endTime: newEnd,
          subjectCode: subjectOptions[0]?.code ?? null,
        },
      ],
    }));
  }

  // ── Save handler ──

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      // Reconstruct the full timetable object
      const newData: Timetable = {};
      for (const day of WEEKDAYS) {
        newData[day] = toRawEntries(editData[day] ?? []);
      }

      await onSave(newData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  // ── Render ──

  return (
    <div className="relative">
      {/* Header bar */}
      <div className="mb-5 sm:mb-6 flex flex-wrap items-center justify-between gap-2.5 rounded-xl sm:rounded-2xl border border-amber-500/20 bg-amber-500/5 px-3.5 sm:px-5 py-2.5 sm:py-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-amber-500 dark:text-amber-400">
          <AlertCircle className="size-4 shrink-0" />
          <span>Editing {mode === "regular" ? "Regular" : "Evening"} timetable</span>
        </div>
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95 touch-manipulation"
          >
            <X className="size-3.5" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-50 active:scale-95 touch-manipulation"
          >
            <Save className="size-3.5" />
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs sm:text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Day tabs */}
      <div className="mb-5 sm:mb-6 -mx-3 px-3 sm:mx-0 sm:px-0 flex gap-1.5 overflow-x-auto scrollbar-none touch-pan-x">
        <div className="flex w-full min-w-max sm:w-auto gap-1 sm:gap-1.5 rounded-2xl border border-border bg-card p-1 sm:p-1.5">
          {WEEKDAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "flex-1 sm:flex-initial rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 min-h-[40px] sm:min-h-[44px] flex items-center justify-center active:scale-95 touch-manipulation",
                day === selectedDay
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden font-semibold">{day.slice(0, 3)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Entry list */}
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="group flex flex-col gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-border/80 bg-card p-3 sm:p-4 shadow-xs transition-all sm:flex-row sm:items-center sm:gap-4"
          >
            {/* Index */}
            <span className="hidden w-6 shrink-0 text-center text-xs font-medium text-muted-foreground sm:block">
              {index + 1}
            </span>

            {/* Time inputs */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Clock className="size-4 shrink-0 text-muted-foreground" />
              <input
                type="time"
                value={entry.startTime}
                onChange={(e) =>
                  updateEntry(entry.id, "startTime", e.target.value)
                }
                className="w-full sm:w-auto rounded-lg border border-border/80 bg-background px-2.5 py-1.5 text-xs sm:text-sm tabular-nums focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <input
                type="time"
                value={entry.endTime}
                onChange={(e) =>
                  updateEntry(entry.id, "endTime", e.target.value)
                }
                className="w-full sm:w-auto rounded-lg border border-border/80 bg-background px-2.5 py-1.5 text-xs sm:text-sm tabular-nums focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>

            {/* Subject dropdown */}
            <div className="flex-1">
              <select
                value={entry.subjectCode ?? "__free__"}
                onChange={(e) =>
                  updateEntry(
                    entry.id,
                    "subjectCode",
                    e.target.value === "__free__" ? null : e.target.value
                  )
                }
                className="w-full rounded-lg border border-border/80 bg-background px-2.5 sm:px-3 py-2 text-xs sm:text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
              >
                <option value="__free__">— Free Period —</option>
                {subjectOptions.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.code} — {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Delete */}
            <button
              onClick={() => deleteEntry(entry.id)}
              className="flex size-9 shrink-0 items-center justify-center self-end rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400 sm:self-auto"
              title="Remove entry"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}

        {/* Add entry button */}
        <button
          onClick={addEntry}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/50 py-4 text-sm font-medium text-muted-foreground transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-400"
        >
          <Plus className="size-4" />
          Add class entry
        </button>
      </div>
    </div>
  );
}
