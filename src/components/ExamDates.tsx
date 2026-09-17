import {
  CalendarCheck,
  Clock,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import examDatesData from "@/data/exam-dates.json";

// ─── Date helpers ───────────────────────────────────────────────────

/** Parse "02.09.2026" (DD.MM.YYYY) → Date */
function parseDateStr(dateStr: string): Date {
  const [day, month, year] = dateStr.split(".").map(Number);
  return new Date(year, month - 1, day);
}

/** Parse "02.09.2026 - 28.10.2026" → { start, end } */
function parsePeriod(period: string): { start: Date; end: Date } {
  const [startStr, endStr] = period.split(" - ");
  return { start: parseDateStr(startStr), end: parseDateStr(endStr) };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

type DateStatus = "past" | "active" | "upcoming";

function getStatus(start: Date, end: Date, now: Date): DateStatus {
  if (now > end) return "past";
  if (now >= start && now <= end) return "active";
  return "upcoming";
}

function getSingleDateStatus(date: Date, now: Date): DateStatus {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  if (target < today) return "past";
  if (target.getTime() === today.getTime()) return "active";
  return "upcoming";
}

function daysUntil(target: Date, now: Date): number {
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ─── Status badge ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: DateStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "active" &&
          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25",
        status === "upcoming" &&
          "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25",
        status === "past" &&
          "bg-muted text-muted-foreground border border-border/50"
      )}
    >
      {status === "active" && (
        <>
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
          Active
        </>
      )}
      {status === "upcoming" && (
        <>
          <Timer className="size-3" />
          Upcoming
        </>
      )}
      {status === "past" && (
        <>
          <CheckCircle2 className="size-3" />
          Completed
        </>
      )}
    </span>
  );
}

// ─── Component ──────────────────────────────────────────────────────

export function ExamDates() {
  const now = new Date();

  const ca1 = examDatesData.CA_1;
  const ca2 = examDatesData.CA_2;
  const endSem = examDatesData.end_semester;

  const ca1Period = parsePeriod(ca1.period);
  const ca1Test = parsePeriod(ca1.test_period);
  const ca1Sems = parseDateStr(ca1.last_date_for_mark_entry_in_SEMS);

  const ca2Period = parsePeriod(ca2.period);
  const ca2Test = parsePeriod(ca2.test_period);
  const ca2Sems = parseDateStr(ca2.last_date_for_mark_entry_in_SEMS);

  const endSemDate = parseDateStr(endSem.commencement_of_examinations);

  return (
    <div className="space-y-5">
      {/* CA 1 */}
      <ExamCard
        title="CA 1 — Continuous Assessment"
        accentColor="emerald"
        items={[
          {
            label: "Teaching Period",
            icon: <CalendarDays className="size-4" />,
            dateRange: `${formatDateShort(ca1Period.start)} – ${formatDateShort(ca1Period.end)}`,
            status: getStatus(ca1Period.start, ca1Period.end, now),
            countdown: getCountdownText(ca1Period.start, ca1Period.end, now),
            progress: getProgress(ca1Period.start, ca1Period.end, now),
          },
          {
            label: "Test Period",
            icon: <AlertTriangle className="size-4" />,
            dateRange: `${formatDateShort(ca1Test.start)} – ${formatDateShort(ca1Test.end)}`,
            status: getStatus(ca1Test.start, ca1Test.end, now),
            countdown: getCountdownText(ca1Test.start, ca1Test.end, now),
            progress: getProgress(ca1Test.start, ca1Test.end, now),
          },
          {
            label: "SEMS Mark Entry Deadline",
            icon: <Clock className="size-4" />,
            dateRange: formatDate(ca1Sems),
            status: getSingleDateStatus(ca1Sems, now),
            countdown: getSingleCountdownText(ca1Sems, now),
          },
        ]}
      />

      {/* CA 2 */}
      <ExamCard
        title="CA 2 — Continuous Assessment"
        accentColor="blue"
        items={[
          {
            label: "Teaching Period",
            icon: <CalendarDays className="size-4" />,
            dateRange: `${formatDateShort(ca2Period.start)} – ${formatDateShort(ca2Period.end)}`,
            status: getStatus(ca2Period.start, ca2Period.end, now),
            countdown: getCountdownText(ca2Period.start, ca2Period.end, now),
            progress: getProgress(ca2Period.start, ca2Period.end, now),
          },
          {
            label: "Test Period",
            icon: <AlertTriangle className="size-4" />,
            dateRange: `${formatDateShort(ca2Test.start)} – ${formatDateShort(ca2Test.end)}`,
            status: getStatus(ca2Test.start, ca2Test.end, now),
            countdown: getCountdownText(ca2Test.start, ca2Test.end, now),
            progress: getProgress(ca2Test.start, ca2Test.end, now),
          },
          {
            label: "SEMS Mark Entry Deadline",
            icon: <Clock className="size-4" />,
            dateRange: formatDate(ca2Sems),
            status: getSingleDateStatus(ca2Sems, now),
            countdown: getSingleCountdownText(ca2Sems, now),
          },
        ]}
      />

      {/* End Semester */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-xs">
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold tracking-tight">
              End Semester Examinations
            </h3>
            <div className="mt-1.5 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <CalendarCheck className="size-4 text-amber-500 dark:text-amber-400" />
              Commences: {formatDate(endSemDate)}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-3 pt-1 sm:pt-0 border-t border-border/40 sm:border-0">
            <StatusBadge status={getSingleDateStatus(endSemDate, now)} />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              {getSingleCountdownText(endSemDate, now)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ExamCard sub-component ─────────────────────────────────────────

interface ExamItem {
  label: string;
  icon: React.ReactNode;
  dateRange: string;
  status: DateStatus;
  countdown: string;
  progress?: number; // 0–100, only for ranges
}

function ExamCard({
  title,
  accentColor,
  items,
}: {
  title: string;
  accentColor: "emerald" | "blue";
  items: ExamItem[];
}) {
  const hasActive = items.some((i) => i.status === "active");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl sm:rounded-2xl border p-4 sm:p-6 bg-card shadow-xs",
        hasActive
          ? accentColor === "emerald"
            ? "border-emerald-500/30"
            : "border-primary/30"
          : "border-border/80"
      )}
    >
      <div className="relative">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight">{title}</h3>

        <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
          {items.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex flex-col gap-3 rounded-xl border p-3.5 sm:p-4 sm:flex-row sm:items-center sm:justify-between",
                item.status === "past"
                  ? "border-border/50 opacity-50"
                  : "border-border/80 bg-background/50"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "text-muted-foreground",
                    item.status === "active" &&
                      (accentColor === "emerald"
                        ? "text-emerald-500"
                        : "text-primary")
                  )}
                >
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-medium leading-snug">{item.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.dateRange}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-start sm:gap-1">
                <StatusBadge status={item.status} />
                <span className="text-xs text-muted-foreground">
                  {item.countdown}
                </span>
              </div>

              {/* Progress bar for active ranges */}
              {item.status === "active" &&
                item.progress !== undefined && (
                  <div className="mt-1 w-full sm:hidden">
                    <div className="h-1 overflow-hidden rounded-full bg-muted/60">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          accentColor === "emerald"
                            ? "bg-emerald-500"
                            : "bg-blue-500"
                        )}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────

function getCountdownText(start: Date, end: Date, now: Date): string {
  const status = getStatus(start, end, now);
  if (status === "past") return "Completed";
  if (status === "active") {
    const remaining = daysUntil(end, now);
    return `${remaining} day${remaining !== 1 ? "s" : ""} remaining`;
  }
  const until = daysUntil(start, now);
  return `Starts in ${until} day${until !== 1 ? "s" : ""}`;
}

function getSingleCountdownText(date: Date, now: Date): string {
  const status = getSingleDateStatus(date, now);
  if (status === "past") return "Passed";
  if (status === "active") return "Today";
  const until = daysUntil(date, now);
  return `${until} day${until !== 1 ? "s" : ""} away`;
}

function getProgress(start: Date, end: Date, now: Date): number {
  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  return Math.max(0, Math.min(100, (elapsed / total) * 100));
}
