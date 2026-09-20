import {
  Clock,
  UserRound,
  Zap,
  ArrowRight,
  FlaskConical,
  BookOpen,
} from "lucide-react";
import type { ParsedClass } from "@/types/schedule";
import { cn } from "@/lib/utils";

interface CurrentClassCardProps {
  currentClass: ParsedClass | null;
  upcomingClass: ParsedClass | null;
  currentMinutes: number;
}

export function CurrentClassCard({
  currentClass,
  upcomingClass,
  currentMinutes,
}: CurrentClassCardProps) {
  return (
    <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
      {/* ── Current class ── */}
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl sm:rounded-3xl border p-4 sm:p-7 md:p-9 shadow-xs transition-all duration-500 bg-card",
          currentClass
            ? "border-emerald-500/30"
            : "border-border/80"
        )}
      >
        <div className="relative">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
            <Zap className="size-4 text-emerald-600 dark:text-emerald-400" />
            Current Class
          </div>

          {currentClass ? (
            <div className="mt-3.5 sm:mt-6">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground line-clamp-2">
                      {currentClass.subjectName}
                    </h2>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 text-xs font-mono font-medium text-muted-foreground border border-border/50">
                      {currentClass.subjectCode}
                    </span>
                    {currentClass.isLab && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-violet-500/15 border border-violet-500/20 px-2.5 py-1 text-xs font-medium text-violet-600 dark:text-violet-300">
                        <FlaskConical className="size-3" />
                        Lab
                      </span>
                    )}
                    {currentClass.isBridge && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 border border-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                        <BookOpen className="size-3" />
                        Bridge
                      </span>
                    )}
                  </div>
                </div>

                <span className="flex shrink-0 items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/25 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
                  Live
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-2.5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Clock className="size-4 text-emerald-600/80 dark:text-emerald-400/70" />
                  {currentClass.timeDisplay}
                </span>
                <span className="inline-flex items-center gap-2">
                  <UserRound className="size-4 text-emerald-600/80 dark:text-emerald-400/70" />
                  {currentClass.staffIncharge}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-1000 ease-linear"
                    style={{
                      width: `${Math.min(100, ((currentMinutes - currentClass.startMinutes) / (currentClass.endMinutes - currentClass.startMinutes)) * 100)}%`,
                    }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
                  <span>
                    {currentClass.endMinutes - currentMinutes} min remaining
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                No class right now
              </h2>
              <p className="mt-2 text-muted-foreground">
                Enjoy the break ☕
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Upcoming class ── */}
      <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-7 md:p-9 shadow-xs transition-all duration-500">
        <div className="relative">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
            <ArrowRight className="size-4 text-amber-600 dark:text-amber-400" />
            Up Next
          </div>

          {upcomingClass ? (
            <div className="mt-3.5 sm:mt-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground line-clamp-2">
                  {upcomingClass.subjectName}
                </h2>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 text-xs font-mono font-medium text-muted-foreground border border-border/50">
                  {upcomingClass.subjectCode}
                </span>
                {upcomingClass.isLab && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-violet-500/15 border border-violet-500/20 px-2.5 py-1 text-xs font-medium text-violet-600 dark:text-violet-300">
                    <FlaskConical className="size-3" />
                    Lab
                  </span>
                )}
                {upcomingClass.isBridge && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 border border-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                    <BookOpen className="size-3" />
                    Bridge
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-2.5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Clock className="size-4 text-amber-600/80 dark:text-amber-400/70" />
                  {upcomingClass.timeDisplay}
                </span>
                <span className="inline-flex items-center gap-2">
                  <UserRound className="size-4 text-amber-600/80 dark:text-amber-400/70" />
                  {upcomingClass.staffIncharge}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                No more classes
              </h2>
              <p className="mt-2 text-muted-foreground">
                That's it for today 🎉
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
