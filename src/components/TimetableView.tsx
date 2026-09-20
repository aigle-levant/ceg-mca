import { useState } from "react";
import { FlaskConical, BookOpen, Clock, UserRound } from "lucide-react";
import type { ParsedClass } from "@/types/schedule";
import { cn } from "@/lib/utils";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface TimetableViewProps {
  getScheduleForDay: (day: string) => ParsedClass[];
  currentDay: string;
  currentMinutes: number;
}

export function TimetableView({
  getScheduleForDay,
  currentDay,
  currentMinutes,
}: TimetableViewProps) {
  const [selectedDay, setSelectedDay] = useState(
    WEEKDAYS.includes(currentDay) ? currentDay : "Monday"
  );

  const schedule = getScheduleForDay(selectedDay);
  const isToday = selectedDay === currentDay;

  return (
    <div>
      {/* Day tabs */}
      <div className="mb-5 sm:mb-6 -mx-3 px-3 sm:mx-0 sm:px-0 flex gap-1.5 overflow-x-auto scrollbar-none touch-pan-x">
        <div className="flex w-full min-w-max sm:w-auto gap-1 sm:gap-1.5 rounded-2xl border border-border bg-card p-1 sm:p-1.5">
          {WEEKDAYS.map((day) => {
            const isActive = day === selectedDay;
            const isCurrent = day === currentDay;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "relative flex-1 sm:flex-initial rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 min-h-[40px] sm:min-h-[44px] flex items-center justify-center active:scale-95 touch-manipulation",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden font-semibold">{day.slice(0, 3)}</span>
                {isCurrent && !isActive && (
                  <span className="absolute top-1.5 right-1.5 size-1.5 sm:size-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule list */}
      {schedule.length > 0 ? (
        <div className="space-y-2">
          {schedule.map((cls, i) => {
            const isCurrent =
              isToday &&
              currentMinutes >= cls.startMinutes &&
              currentMinutes < cls.endMinutes;
            const isPast = isToday && currentMinutes >= cls.endMinutes;

            return (
              <div
                key={`${cls.subjectCode}-${i}`}
                className={cn(
                  "group relative flex items-center gap-3 sm:gap-5 rounded-xl sm:rounded-2xl border p-3.5 sm:p-5 transition-all duration-300",
                  isCurrent
                    ? "border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-950/30"
                    : isPast
                      ? "border-border/50 bg-card/50 opacity-50"
                      : "border-border/80 bg-card hover:border-border hover:bg-card/80"
                )}
              >
                {/* Time column */}
                <div className="hidden w-32 shrink-0 flex-col items-center gap-0.5 sm:flex">
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      isCurrent ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                    )}
                  >
                    {cls.timeDisplay.split(" - ")[0]}
                  </span>
                  <div
                    className={cn(
                      "h-4 w-px",
                      isCurrent ? "bg-emerald-500/40" : "bg-border"
                    )}
                  />
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {cls.timeDisplay.split(" - ")[1]}
                  </span>
                </div>

                {/* Divider */}
                <div
                  className={cn(
                    "hidden h-12 w-px sm:block",
                    isCurrent ? "bg-emerald-500/30" : "bg-border"
                  )}
                />

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={cn(
                        "text-sm sm:text-base font-semibold leading-snug",
                        isPast && "line-through decoration-muted-foreground/30"
                      )}
                    >
                      {cls.subjectName}
                    </h3>
                    {isCurrent && (
                      <span className="shrink-0 flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
                        Now
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="inline-flex items-center rounded-md bg-muted/70 px-2 py-0.5 text-[11px] sm:text-xs font-mono text-muted-foreground">
                      {cls.subjectCode}
                    </span>
                    {cls.isLab && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[11px] sm:text-xs text-violet-600 dark:text-violet-400">
                        <FlaskConical className="size-3" />
                        Lab
                      </span>
                    )}
                    {cls.isBridge && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[11px] sm:text-xs text-amber-600 dark:text-amber-400">
                        <BookOpen className="size-3" />
                        Bridge
                      </span>
                    )}
                  </div>

                  {/* Mobile time and staff info */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:hidden">
                    <span className="inline-flex items-center gap-1 font-medium text-foreground/85">
                      <Clock className="size-3 text-primary" />
                      {cls.timeDisplay}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <UserRound className="size-3" />
                      {cls.staffIncharge}
                    </span>
                  </div>
                </div>

                {/* Staff on large screen */}
                <div className="hidden shrink-0 items-center gap-2 text-sm text-muted-foreground sm:flex">
                  <UserRound className="size-3.5" />
                  <span className="max-w-[160px] md:max-w-[200px] truncate">
                    {cls.staffIncharge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
          <p className="text-lg font-medium">No classes</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedDay === "Sunday"
              ? "It's a holiday!"
              : "Nothing scheduled for this day."}
          </p>
        </div>
      )}
    </div>
  );
}
