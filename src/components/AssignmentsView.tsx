import { useState, useMemo } from "react";
import {
  ClipboardList,
  Clock,
  FlaskConical,
  BookOpen,
  CheckCircle2,
  Calendar,
  Search,
  CircleCheck,
  Circle,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeadlines } from "@/hooks/useDeadlines";
import type { DeadlineRecord } from "@/types/deadlines";

function getDeadlineMeta(dateStr: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Support YYYY-MM-DD
    const [year, month, day] = dateStr.split("-").map(Number);
    const target = new Date(year, month - 1, day);
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
      return { label: "Due Today", badge: dateFormatted, urgent: true, diffDays };
    if (diffDays === 1)
      return { label: "Due Tomorrow", badge: dateFormatted, urgent: true, diffDays };
    if (diffDays > 1 && diffDays <= 3)
      return { label: `Due in ${diffDays} days`, badge: dateFormatted, urgent: true, diffDays };
    if (diffDays > 3)
      return { label: `Due in ${diffDays} days`, badge: dateFormatted, urgent: false, diffDays };
    if (diffDays < 0)
      return {
        label: diffDays === -1 ? "Due Yesterday" : `Past Due (${Math.abs(diffDays)}d ago)`,
        badge: dateFormatted,
        urgent: true,
        diffDays,
      };

    return { label: `Due ${dateFormatted}`, badge: dateFormatted, urgent: false, diffDays };
  } catch {
    return { label: dateStr, badge: dateStr, urgent: false, diffDays: 0 };
  }
}

const STORAGE_KEY = "ceg-completed-deadlines-v2";

export function AssignmentsView() {
  const { deadlines, loading, error, refresh } = useDeadlines();

  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "pending" | "completed" | "labs" | "theory">("all");
  const [batchFilter, setBatchFilter] = useState<"ALL" | "REGULAR" | "SS">("ALL");

  const toggleComplete = (id: string) => {
    setCompletedMap((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  };

  const processedItems = useMemo(() => {
    return deadlines.map((item: DeadlineRecord) => {
      const isCompleted = !!completedMap[item.id];
      const isLab =
        item.courses?.course_type?.toLowerCase() === "lab" ||
        item.courses?.course_code?.toLowerCase().includes("lab") ||
        item.courses?.course_name?.toLowerCase().includes("lab") ||
        item.title.toLowerCase().includes("lab");

      const isBridge =
        item.courses?.category?.toLowerCase().includes("bridge") ||
        item.courses?.course_code?.startsWith("BX");

      const meta = getDeadlineMeta(item.due_date);

      return {
        ...item,
        isCompleted,
        isLab,
        isBridge,
        meta,
      };
    });
  }, [deadlines, completedMap]);

  // Counts per batch for the switcher badges
  const batchCounts = useMemo(() => {
    const regular = processedItems.filter(
      (i) => i.batches?.batch?.toUpperCase() === "REGULAR"
    ).length;
    const ss = processedItems.filter(
      (i) => i.batches?.batch?.toUpperCase() === "SS"
    ).length;
    return {
      ALL: processedItems.length,
      REGULAR: regular,
      SS: ss,
    };
  }, [processedItems]);

  // Items matching current batch selection
  const batchItems = useMemo(() => {
    if (batchFilter === "ALL") return processedItems;
    return processedItems.filter(
      (item) => item.batches?.batch?.toUpperCase() === batchFilter
    );
  }, [processedItems, batchFilter]);

  const filteredItems = useMemo(() => {
    return batchItems.filter((item) => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.courses?.course_code && item.courses.course_code.toLowerCase().includes(q)) ||
        (item.courses?.course_name && item.courses.course_name.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Status / Category filter
      if (filterTab === "pending") return !item.isCompleted;
      if (filterTab === "completed") return item.isCompleted;
      if (filterTab === "labs") return item.isLab;
      if (filterTab === "theory") return !item.isLab;

      return true;
    });
  }, [batchItems, searchQuery, filterTab]);

  const totalCount = batchItems.length;
  const completedCount = batchItems.filter((i) => i.isCompleted).length;
  const pendingCount = totalCount - completedCount;
  const labCount = batchItems.filter((i) => i.isLab).length;

  return (
    <div className="space-y-8">
      {/* Batch Switcher & Refresh Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Batch Filter Switcher */}
        <div className="inline-flex rounded-xl bg-muted/60 p-1 border border-border/60 text-xs">
          {(
            [
              { id: "ALL", label: "All Batches", count: batchCounts.ALL },
              { id: "REGULAR", label: "Regular", count: batchCounts.REGULAR },
              { id: "SS", label: "SS (Evening)", count: batchCounts.SS },
            ] as const
          ).map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setBatchFilter(b.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all duration-150",
                batchFilter === b.id
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>{b.label}</span>
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[10px] font-mono leading-none",
                  batchFilter === b.id
                    ? "bg-primary/15 text-primary font-bold"
                    : "bg-muted-foreground/15 text-muted-foreground"
                )}
              >
                {b.count}
              </span>
            </button>
          ))}
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={() => refresh()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/70 bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 active:scale-95 transition-all disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin text-primary")} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Metrics Row (Dynamically calculated for selected batch) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total</span>
            <ClipboardList className="size-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {totalCount}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {batchFilter === "ALL"
              ? "All recorded tasks"
              : batchFilter === "REGULAR"
              ? "Regular batch tasks"
              : "SS evening tasks"}
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {pendingCount}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Awaiting submission</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {completedCount}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Marked as finished</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Labs</span>
            <FlaskConical className="size-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {labCount}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Practical lab work</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by topic, course, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/80 bg-card/60 pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60">
          {(
            [
              { id: "all", label: "All" },
              { id: "pending", label: "Pending" },
              { id: "completed", label: "Done" },
              { id: "labs", label: "Labs" },
              { id: "theory", label: "Theory" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterTab(tab.id)}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200",
                filterTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner if Supabase query failed */}
      {error && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 sm:p-5 flex items-start gap-3">
          <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <h4 className="font-semibold text-destructive">Failed to fetch deadlines from Supabase</h4>
            <p className="mt-1 text-xs text-muted-foreground">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => refresh()}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-56 rounded-2xl border border-border/60 bg-card/40 p-5 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-20 bg-muted rounded-md" />
                  <div className="h-5 w-24 bg-muted rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-muted rounded-md" />
                <div className="h-4 w-1/2 bg-muted rounded-md" />
              </div>
              <div className="pt-3 border-t border-border/40 flex justify-between items-center">
                <div className="h-4 w-24 bg-muted rounded-md" />
                <div className="h-8 w-24 bg-muted rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main List */}
      {!loading && !error && filteredItems.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center">
          <ClipboardList className="mx-auto size-10 text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-semibold text-foreground">No assignments match</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search criteria."
              : "No deadlines currently listed for this selection."}
          </p>
        </div>
      )}

      {!loading && !error && filteredItems.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const courseCode = item.courses?.course_code ?? "MCA Course";
            const courseName = item.courses?.course_name ?? "Anna University CEG";
            const batchName = item.batches?.batch ?? "MCA";

            return (
              <div
                key={item.id}
                className={cn(
                  "group relative flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-xs transition-all duration-300 hover:shadow-md",
                  item.isCompleted
                    ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10 opacity-80"
                    : "border-border/80 hover:border-primary/40"
                )}
              >
                <div>
                  {/* Top badges: Code, Type, Due status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 text-xs font-mono font-semibold text-foreground border border-border/60">
                        {courseCode}
                      </span>

                      {item.isLab ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-sky-500/15 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:text-sky-300 border border-sky-500/25">
                          <FlaskConical className="size-3" />
                          Lab
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300 border border-amber-500/25">
                          <BookOpen className="size-3" />
                          Theory
                        </span>
                      )}

                      {batchName && (
                        <span className="inline-flex items-center rounded-lg bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {batchName}
                        </span>
                      )}
                    </div>

                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border",
                        item.isCompleted
                          ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-700 dark:text-emerald-300"
                          : item.meta.urgent
                          ? "bg-amber-500/15 border-amber-500/25 text-amber-700 dark:text-amber-300"
                          : "bg-sky-500/15 border-sky-500/25 text-sky-700 dark:text-sky-300"
                      )}
                    >
                      {item.isCompleted ? (
                        <>
                          <CheckCircle2 className="size-3" />
                          Done
                        </>
                      ) : (
                        <>
                          {item.meta.urgent && (
                            <span className="size-1.5 animate-pulse rounded-full bg-amber-500 dark:bg-amber-400" />
                          )}
                          <Clock className="size-3" />
                          {item.meta.label}
                        </>
                      )}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={cn(
                      "text-base sm:text-lg font-bold tracking-tight text-foreground transition-all",
                      item.isCompleted && "line-through text-muted-foreground"
                    )}
                  >
                    {item.title}
                  </h3>

                  {/* Course Name */}
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-1">
                    {courseName}
                  </p>

                  {/* Optional Description */}
                  {item.description && (
                    <p className="mt-2.5 text-xs text-muted-foreground/90 bg-muted/40 p-2.5 rounded-xl border border-border/50">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Footer with due date & complete toggle button */}
                <div className="mt-5 pt-3.5 border-t border-border/50 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                    <Calendar className="size-3.5" />
                    <span>{item.meta.badge}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleComplete(item.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 touch-manipulation",
                      item.isCompleted
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30"
                        : "bg-muted hover:bg-primary hover:text-primary-foreground text-foreground border border-border/60"
                    )}
                  >
                    {item.isCompleted ? (
                      <>
                        <CircleCheck className="size-3.5" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Circle className="size-3.5 text-muted-foreground" />
                        Mark Done
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Helpful guidance alert */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex items-start gap-3">
        <Sparkles className="size-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-muted-foreground">
          <strong className="text-foreground font-semibold">Continuous Assessment Deadlines:</strong>{" "}
          Continuous assessment assignments and lab reports carry vital marks for internal evaluation.
          Mark your tasks done as you submit to track your academic semester progress.
        </div>
      </div>
    </div>
  );
}
