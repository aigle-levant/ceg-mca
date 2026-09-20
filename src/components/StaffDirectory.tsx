import { useState } from "react";
import { UserRound, FlaskConical, BookOpen, Sun, Moon } from "lucide-react";
import type { ProfData } from "@/types/schedule";
import { cn } from "@/lib/utils";

interface StaffDirectoryProps {
  regularProfs: ProfData;
  eveningProfs: ProfData;
}

type StaffTab = "regular" | "evening";

export function StaffDirectory({
  regularProfs,
  eveningProfs,
}: StaffDirectoryProps) {
  const [tab, setTab] = useState<StaffTab>("regular");
  const profs = tab === "regular" ? regularProfs : eveningProfs;

  // Separate regular subjects from bridge courses
  const regularSubjects = profs.subjects.filter((s) => !s.type);
  const bridgeSubjects = profs.subjects.filter(
    (s) => s.type === "Bridge Course"
  );

  return (
    <div>
      {/* Tab switcher */}
      <div className="mb-6 grid grid-cols-2 sm:flex gap-2">
        <button
          onClick={() => setTab("regular")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95 touch-manipulation min-h-[42px]",
            tab === "regular"
              ? "bg-primary text-primary-foreground shadow-xs font-semibold"
              : "bg-card text-muted-foreground border border-border/80 hover:bg-muted hover:text-foreground"
          )}
        >
          <Sun className={cn("size-3.5 sm:size-4", tab === "regular" ? "text-primary-foreground" : "text-amber-500")} />
          <span>Regular Batch</span>
        </button>
        <button
          onClick={() => setTab("evening")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95 touch-manipulation min-h-[42px]",
            tab === "evening"
              ? "bg-primary text-primary-foreground shadow-xs font-semibold"
              : "bg-card text-muted-foreground border border-border/80 hover:bg-muted hover:text-foreground"
          )}
        >
          <Moon className={cn("size-3.5 sm:size-4", tab === "evening" ? "text-primary-foreground" : "text-amber-400")} />
          <span>Evening Batch</span>
        </button>
      </div>

      {/* Staff grid */}
      <div className="space-y-8">
        {/* Core courses */}
        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Core Courses
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {regularSubjects.map((subject) => (
              <StaffCard key={subject.code} subject={subject} />
            ))}
          </div>
        </div>

        {/* Bridge courses */}
        {bridgeSubjects.length > 0 && (
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Bridge Courses
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {bridgeSubjects.map((subject) => (
                <StaffCard key={subject.code} subject={subject} isBridge />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StaffCard({
  subject,
  isBridge = false,
}: {
  subject: { code: string; name: string; staff_incharge: string };
  isBridge?: boolean;
}) {
  const isLab = subject.code.includes("Lab");

  return (
    <div className="group rounded-xl sm:rounded-2xl border border-border/80 bg-card p-4 sm:p-5 transition-all duration-200 hover:border-border hover:shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground">{subject.name}</h4>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-md bg-muted/80 px-2 py-0.5 text-[11px] sm:text-xs font-mono text-muted-foreground border border-border/50">
              {subject.code}
            </span>
            {isLab && (
              <span className="inline-flex items-center gap-1 rounded-md bg-violet-500/10 px-1.5 py-0.5 text-[11px] text-violet-400">
                <FlaskConical className="size-2.5" />
                Lab
              </span>
            )}
            {isBridge && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[11px] text-amber-400">
                <BookOpen className="size-2.5" />
                Bridge
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
        <UserRound className="mt-0.5 size-3.5 shrink-0" />
        <span className="leading-relaxed">{subject.staff_incharge}</span>
      </div>
    </div>
  );
}
