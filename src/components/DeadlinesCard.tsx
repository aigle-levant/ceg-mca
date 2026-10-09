import { useState, useMemo } from "react";
import {
  CalendarClock,
  Clock,
  FlaskConical,
  BookOpen,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeadlines } from "@/hooks/useDeadlines";
import type { DeadlineRecord } from "@/types/deadlines";
import type { DeadlinesData } from "@/types/schedule";
import { AssignmentModal } from "@/components/AssignmentModal";
import deadlinesDataRaw from "@/data/urgent.json";

const deadlinesData = deadlinesDataRaw as DeadlinesData;

function getDeadlineMeta(dateStr: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = dateStr.split("-").map(Number);
    const target =
      parts.length === 3
        ? new Date(parts[0], parts[1] - 1, parts[2])
        : new Date(dateStr);
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
      return { label: "Due Today", badge: dateFormatted, urgent: true, diffDays, isPastDue: false };
    if (diffDays === 1)
      return { label: "Due Tomorrow", badge: dateFormatted, urgent: true, diffDays, isPastDue: false };
    if (diffDays > 1 && diffDays <= 3)
      return { label: `Due in ${diffDays} days`, badge: dateFormatted, urgent: true, diffDays, isPastDue: false };
    if (diffDays > 3)
      return { label: `Due in ${diffDays} days`, badge: dateFormatted, urgent: false, diffDays, isPastDue: false };
    if (diffDays < 0)
      return { label: "Past Due", badge: dateFormatted, urgent: true, diffDays, isPastDue: true };

    return { label: `Due ${dateFormatted}`, badge: dateFormatted, urgent: false, diffDays, isPastDue: false };
  } catch {
    return { label: dateStr, badge: dateStr, urgent: false, diffDays: 0, isPastDue: false };
  }
}

interface DeadlineCardItemProps {
  item: DeadlineRecord;
  onClick: () => void;
}

function DeadlineCardItem({ item, onClick }: DeadlineCardItemProps) {
  const meta = getDeadlineMeta(item.due_date);
  const subjectCode = item.courses?.course_code ?? "MCA";
  const subjectName = item.courses?.course_name ?? "Anna University CEG";

  const isLab =
    item.courses?.course_type?.toLowerCase() === "lab" ||
    subjectCode.toLowerCase().includes("lab") ||
    subjectName.toLowerCase().includes("lab") ||
    item.title.toLowerCase().includes("lab");

  const isBridge =
    item.courses?.category?.toLowerCase().includes("bridge") ||
    subjectCode.startsWith("BX");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group/item relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs transition-all duration-300 hover:border-primary/50 hover:bg-card/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-left select-none"
    >
      <div>
        {/* Header Tags & Due Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 text-xs font-mono font-medium text-muted-foreground border border-border/50">
              {subjectCode}
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

            {item.batches?.batch && (
              <span className="inline-flex items-center rounded-lg bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {item.batches.batch}
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
        <h3 className="mt-3 text-base sm:text-lg font-bold tracking-tight text-foreground line-clamp-2 group-hover/item:text-primary transition-colors">
          {item.title}
        </h3>

        {/* Subject Name */}
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-1">
          {subjectName}
        </p>

        {/* Description snippet if exists */}
        {item.description && (
          <p className="mt-2 text-xs text-muted-foreground/80 line-clamp-2 bg-muted/30 px-2.5 py-1.5 rounded-lg border border-border/40">
            {item.description}
          </p>
        )}
      </div>

      {/* Footer with date & quick tap action hint */}
      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-mono">
          <Calendar className="size-3.5 text-muted-foreground/80" />
          {meta.badge}
        </span>

        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary/80 group-hover/item:text-primary transition-colors">
          <Edit3 className="size-3" />
          <span>Details & Edit</span>
        </span>
      </div>
    </div>
  );
}

export function DeadlinesCard() {
  const { deadlines: liveDeadlines, updateDeadline } = useDeadlines();
  const [selectedDeadline, setSelectedDeadline] = useState<DeadlineRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fallback data when Supabase has not yet loaded or is empty
  const fallbackDeadlines: DeadlineRecord[] = useMemo(() => {
    return (deadlinesData.upcoming || deadlinesData.urgent || []).map(
      (item, idx) => ({
        id: `fallback-${idx}`,
        batch_id: "",
        course_id: "",
        title: item.title,
        description: null,
        due_date: item.deadline,
        created_at: new Date().toISOString(),
        courses: {
          id: `course-${idx}`,
          course_code: item.subjectCode,
          course_name: item.subjectName,
        },
      })
    );
  }, []);

  // Filter out past due ones — only show upcoming deadlines and those due today
  const deadlines: DeadlineRecord[] = useMemo(() => {
    const raw =
      liveDeadlines && liveDeadlines.length > 0 ? liveDeadlines : fallbackDeadlines;
    return raw.filter((item) => {
      const meta = getDeadlineMeta(item.due_date);
      return !meta.isPastDue;
    });
  }, [liveDeadlines, fallbackDeadlines]);

  const handleCardClick = (item: DeadlineRecord) => {
    setSelectedDeadline(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDeadline(null);
  };

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

          <div className="flex items-center gap-2.5">
            {deadlines.length > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/25 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                <span className="size-1.5 animate-pulse rounded-full bg-amber-500 dark:bg-amber-400" />
                {deadlines.length} Upcoming
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="size-3.5" />
                All Clear
              </span>
            )}

            <a
              href="#/assignments"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline group/link px-2 py-1"
            >
              <span>View All</span>
              <ArrowRight className="size-3 transition-transform group-hover/link:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Content */}
        {deadlines.length > 0 ? (
          <div className="mt-5 sm:mt-7 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deadlines.map((item, idx) => (
              <DeadlineCardItem
                key={item.id || `${item.courses?.course_code}-${item.title}-${idx}`}
                item={item}
                onClick={() => handleCardClick(item)}
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

      {/* Detail & Edit Modal */}
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        assignment={selectedDeadline}
        onSave={updateDeadline}
      />
    </div>
  );
}
