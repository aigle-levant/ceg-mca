import { useState } from "react";
import { ChevronDown, BookOpen, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import subjectsData from "@/data/subjects.json";
import semesterData from "@/data/semester-one.json";

// ─── Types ──────────────────────────────────────────────────────────

interface SemesterCourse {
  code: string;
  title: string;
  category: string;
  units: Record<string, string>;
}

// ─── Category labels ────────────────────────────────────────────────

const categoryLabels: Record<string, string> = {
  FC: "Foundation Course",
  PCC: "Professional Core Course",
};

const categoryColors: Record<string, string> = {
  FC: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/25",
  PCC: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25",
};

const unitLabels = ["I", "II", "III", "IV", "V"];

// ─── Component ──────────────────────────────────────────────────────

export function SubjectsView() {
  const courses = semesterData.courses as SemesterCourse[];

  const bridgeSubjects = subjectsData.subjects.filter(
    (s) => s.type === "Bridge Course"
  );

  return (
    <div className="space-y-10">
      {/* Core + Foundation Courses (with syllabus) */}
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Semester I — Core Courses
        </h3>
        <div className="space-y-3">
          {courses.map((course) => (
            <SubjectCard key={course.code} course={course} />
          ))}
        </div>
      </div>

      {/* Bridge Courses */}
      {bridgeSubjects.length > 0 && (
        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Bridge Courses
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bridgeSubjects.map((subject) => (
              <div
                key={subject.code}
                className="rounded-xl sm:rounded-2xl border border-border/80 bg-card p-3.5 sm:p-5 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <BookOpen className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold leading-snug text-foreground">
                      {subject.name}
                    </h4>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center rounded-md bg-muted/80 px-2 py-0.5 text-[11px] sm:text-xs font-mono text-muted-foreground border border-border/50">
                        {subject.code}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                        Bridge
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SubjectCard with expandable syllabus ───────────────────────────

function SubjectCard({ course }: { course: SemesterCourse }) {
  const [expanded, setExpanded] = useState(false);

  const catLabel = categoryLabels[course.category] ?? course.category;
  const catColor =
    categoryColors[course.category] ?? "bg-muted text-muted-foreground";

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-xl sm:rounded-2xl border transition-all duration-300",
        expanded
          ? "border-border/90 bg-card shadow-xs"
          : "border-border/80 bg-card hover:border-border"
      )}
    >
      {/* Header (clickable) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 sm:gap-4 p-3.5 sm:p-5 text-left transition-colors active:bg-muted/40 touch-manipulation"
      >
        <div
          className={cn(
            "flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl",
            course.category === "FC"
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
          )}
        >
          <Layers className="size-4 sm:size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm sm:text-base font-semibold leading-snug text-foreground">
            {course.title}
          </h4>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center rounded-md bg-muted/80 px-2 py-0.5 text-[11px] sm:text-xs font-mono text-muted-foreground border border-border/50">
              {course.code}
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
                catColor
              )}
            >
              {catLabel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground">
              <BookOpen className="size-3" />
              {Object.keys(course.units).length} Units
            </span>
          </div>
        </div>

        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-muted-foreground transition-transform duration-300",
            expanded && "rotate-180"
          )}
        />
      </button>

      {/* Expandable syllabus */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          expanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-3.5 sm:px-5 pb-4 sm:pb-5 pt-3 sm:pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Syllabus
            </p>
            <div className="space-y-3">
              {unitLabels.map(
                (unit) =>
                  course.units[unit] && (
                    <div key={unit} className="flex gap-3">
                      <span
                        className={cn(
                          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                          course.category === "FC"
                            ? "bg-violet-500/10 text-violet-400"
                            : "bg-sky-500/10 text-sky-400"
                        )}
                      >
                        {unit}
                      </span>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {course.units[unit]}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
