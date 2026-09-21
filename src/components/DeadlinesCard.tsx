import {
  CalendarClock,
  Clock,
  FlaskConical,
  BookOpen,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeadlineItem, DeadlinesData } from "@/types/schedule";
import deadlinesDataRaw from "@/data/urgent.json";

const deadlinesData = deadlinesDataRaw as DeadlinesData;

function getDeadlineMeta(dateStr: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const dateFormatted = target.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (diffDays === 0)
      return { label: "Due Today", badge: dateFormatted, urgent: true };
    if (diffDays === 1)
      return { label: "Due Tomorrow", badge: dateFormatted, urgent: true };
    if (diffDays > 1 && diffDays <= 3)
      return { label: `Due in ${diffDays} days`, badge: dateFormatted, urgent: true };
    if (diffDays > 3)
      return { label: `Due in ${diffDays} days`, badge: dateFormatted, urgent: false };
    if (diffDays < 0)
      return { label: "Past Due", badge: dateFormatted, urgent: true };

    return { label: `Due ${dateFormatted}`, badge: dateFormatted, urgent: false };
  } catch {
    return { label: dateStr, badge: dateStr, urgent: false };
  }
}

interface DeadlineCardItemProps {
  item: DeadlineItem;
}

function DeadlineCardItem({ item }: DeadlineCardItemProps) {
  const meta = getDeadlineMeta(item.deadline);
  const isLab =
    item.subjectCode.toLowerCase().includes("lab") ||
    item.subjectName.toLowerCase().includes("lab");
  const isBridge = item.subjectCode.startsWith("BX");

  return (
    <div className="group/item relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs transition-all duration-300 hover:border-amber-500/40 hover:bg-card/90">
      <div>
        {/* Header Tags & Due Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 text-xs font-mono font-medium text-muted-foreground border border-border/50">
              {item.subjectCode}
            </span>

            {isLab && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-violet-500/15 border border-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-600 dark:text-violet-300">
                <FlaskConical className="size-3" />
                Lab
              </span>
            )}

            {isBridge && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 border border-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                <BookOpen className="size-3" />
                Bridge
              </span>
            )}
          </div>

          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border",
              meta.urgent
                ? "bg-amber-500/15 border-amber-500/25 text-amber-700 dark:text-amber-300"
                : "bg-sky-500/15 border-sky-500/25 text-sky-700 dark:text-sky-300"
            )}
          >
            {meta.urgent && (
              <span className="size-1.5 animate-pulse rounded-full bg-amber-500 dark:bg-amber-400" />
            )}
            <Clock className="size-3" />
            {meta.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-base sm:text-lg font-bold tracking-tight text-foreground line-clamp-2">
          {item.title}
        </h3>

        {/* Subject Name */}
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-1">
          {item.subjectName}
        </p>
      </div>

      {/* Footer with date */}
      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-mono">
          <Calendar className="size-3.5 text-muted-foreground/80" />
          {meta.badge}
        </span>
        <span className="font-medium text-amber-600 dark:text-amber-400">
          {meta.label}
        </span>
      </div>
    </div>
  );
}

export function DeadlinesCard() {
  const deadlines: DeadlineItem[] =
    deadlinesData.upcoming || deadlinesData.urgent || [];

  return (
    <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-7 md:p-9 shadow-xs transition-all duration-500">
      <div className="relative">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
              <CalendarClock className="size-4 text-amber-600 dark:text-amber-400" />
              Upcoming Deadlines
            </div>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Pending Submissions
            </h2>
          </div>

          {deadlines.length > 0 ? (
            <span className="inline-flex self-start sm:self-center items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/25 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
              <span className="size-1.5 animate-pulse rounded-full bg-amber-500 dark:bg-amber-400" />
              {deadlines.length} Upcoming
            </span>
          ) : (
            <span className="inline-flex self-start sm:self-center items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="size-3.5" />
              All Clear
            </span>
          )}
        </div>

        {/* Content */}
        {deadlines.length > 0 ? (
          <div className="mt-5 sm:mt-7 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deadlines.map((item, idx) => (
              <DeadlineCardItem
                key={`${item.subjectCode}-${item.title}-${idx}`}
                item={item}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center justify-center text-center py-8">
            <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3">
              <CheckCircle2 className="size-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No upcoming deadlines
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Enjoy the break ☕ All assignments are completed!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
