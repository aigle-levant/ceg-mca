import { useState, useMemo } from "react";
import {
  UserRound,
  FlaskConical,
  BookOpen,
  Sun,
  Moon,
  Users,
  Search,
  RefreshCw,
  AlertCircle,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useStaff } from "@/hooks/useStaff";
import type { CourseWithStaff } from "@/types/staff";
import { cn } from "@/lib/utils";

type ViewMode = "faculty" | "regular" | "evening";

function getInitials(name: string): string {
  const clean = name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.)\s*/i, "").trim();
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function StaffDirectory() {
  const { staff, staffAssignments, loading, error, refresh } = useStaff();
  const [viewMode, setViewMode] = useState<ViewMode>("faculty");
  const [searchQuery, setSearchQuery] = useState("");

  // Helper to extract courses grouped with their assigned staff for a specific batch
  const getBatchCourses = useMemo(() => {
    return (batchName: "REGULAR" | "SS"): CourseWithStaff[] => {
      const courseMap = new Map<string, CourseWithStaff>();

      staffAssignments
        .filter((a) => a.batches?.batch?.toUpperCase() === batchName)
        .forEach((a) => {
          const course = a.courses;
          if (!course) return;

          const code = course.course_code.trim();
          const staffName = a.staff?.staff_name?.trim();

          if (!courseMap.has(code)) {
            const isLab =
              course.course_type?.toLowerCase() === "lab" ||
              code.toLowerCase().includes("lab") ||
              course.course_name.toLowerCase().includes("lab");

            const isBridge =
              course.category === "Bridge Course" || code.startsWith("BX");

            courseMap.set(code, {
              code,
              name: course.course_name,
              category: course.category,
              course_type: course.course_type,
              isLab,
              isBridge,
              staffNames: [],
            });
          }

          if (staffName && !courseMap.get(code)!.staffNames.includes(staffName)) {
            courseMap.get(code)!.staffNames.push(staffName);
          }
        });

      return Array.from(courseMap.values());
    };
  }, [staffAssignments]);

  const regularCourses = useMemo(() => getBatchCourses("REGULAR"), [getBatchCourses]);
  const eveningCourses = useMemo(() => getBatchCourses("SS"), [getBatchCourses]);

  // Map courses to each faculty member from Supabase staff and staff_assignments
  const facultyMembers = useMemo(() => {
    return staff.map((member) => {
      const assigned = staffAssignments.filter(
        (a) => a.staff_id === member.id || a.staff?.id === member.id
      );

      const courseMap = new Map<
        string,
        { code: string; name: string; batch: string; isLab: boolean; isBridge: boolean }
      >();

      assigned.forEach((a) => {
        if (!a.courses) return;
        const code = a.courses.course_code.trim();
        const batch = a.batches?.batch?.toUpperCase() ?? "REGULAR";

        if (courseMap.has(code)) {
          const existing = courseMap.get(code)!;
          if (existing.batch !== batch) {
            existing.batch = "Both";
          }
        } else {
          courseMap.set(code, {
            code,
            name: a.courses.course_name,
            batch: batch === "SS" ? "Evening" : "Regular",
            isLab:
              a.courses.course_type?.toLowerCase() === "lab" ||
              code.toLowerCase().includes("lab"),
            isBridge: a.courses.category === "Bridge Course" || code.startsWith("BX"),
          });
        }
      });

      return {
        ...member,
        initials: getInitials(member.staff_name),
        courses: Array.from(courseMap.values()),
      };
    });
  }, [staff, staffAssignments]);

  // Filtered faculty based on search query
  const filteredFaculty = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return facultyMembers;

    return facultyMembers.filter((m) => {
      const nameMatch = m.staff_name.toLowerCase().includes(q);
      const courseMatch = m.courses.some(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q)
      );
      return nameMatch || courseMatch;
    });
  }, [facultyMembers, searchQuery]);

  // Filtered batch courses based on active batch view and search query
  const activeBatchCourses = viewMode === "evening" ? eveningCourses : regularCourses;
  const filteredBatchCourses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return activeBatchCourses;

    return activeBatchCourses.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.staffNames.some((sn) => sn.toLowerCase().includes(q))
    );
  }, [activeBatchCourses, searchQuery]);

  const coreCourses = filteredBatchCourses.filter((c) => !c.isBridge);
  const bridgeCourses = filteredBatchCourses.filter((c) => c.isBridge);

  const totalFacultyCount = staff.length;
  const regularCount = regularCourses.length;
  const eveningCount = eveningCourses.length;

  return (
    <div className="space-y-8">
      {/* Top Overview & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* View Mode Switcher */}
        <div className="inline-flex rounded-xl bg-muted/60 p-1 border border-border/60 text-xs w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setViewMode("faculty")}
            className={cn(
              "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all duration-150",
              viewMode === "faculty"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Users className="size-3.5 text-primary" />
            <span>Faculty Members ({totalFacultyCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("regular")}
            className={cn(
              "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all duration-150",
              viewMode === "regular"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sun className="size-3.5 text-amber-500" />
            <span>Regular Batch ({regularCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("evening")}
            className={cn(
              "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all duration-150",
              viewMode === "evening"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Moon className="size-3.5 text-indigo-400" />
            <span>Evening Batch ({eveningCount})</span>
          </button>
        </div>

        {/* Refresh Action */}
        <button
          type="button"
          onClick={() => refresh()}
          disabled={loading}
          className="self-end sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/70 bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 active:scale-95 transition-all disabled:opacity-50"
          title="Refresh from Supabase"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin text-primary")} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Faculty</span>
            <Users className="size-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {totalFacultyCount}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Teaching staff members</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {viewMode === "evening" ? "Evening Courses" : viewMode === "regular" ? "Regular Courses" : "Total Mapped"}
            </span>
            <BookOpen className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {viewMode === "evening" ? eveningCount : viewMode === "regular" ? regularCount : regularCount + eveningCount}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {viewMode === "evening" ? "SS batch courses" : viewMode === "regular" ? "Regular batch courses" : "Across both batches"}
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Department</span>
            <GraduationCap className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-base sm:text-lg font-bold tracking-tight text-foreground line-clamp-1">
            Information Science & Tech
          </div>
          <p className="mt-1 text-xs text-muted-foreground">College of Engineering, Guindy</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by professor name, course, or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border/80 bg-card/60 pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        />
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 sm:p-5 flex items-start gap-3">
          <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <h4 className="font-semibold text-destructive">Failed to fetch staff data from Supabase</h4>
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
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="rounded-2xl border border-border/60 bg-card/40 p-5 animate-pulse flex flex-col justify-between h-44"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-muted" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-muted rounded-md" />
                  <div className="h-3 w-20 bg-muted rounded-md" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/40">
                <div className="h-3 w-40 bg-muted rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 1. FACULTY MEMBERS VIEW ── */}
      {!loading && viewMode === "faculty" && (
        <div className="space-y-6">
          {filteredFaculty.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center">
              <Users className="mx-auto size-10 text-muted-foreground/40 mb-3" />
              <h3 className="text-base font-semibold text-foreground">No faculty members found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try searching for a different professor or course.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFaculty.map((member) => (
                <div
                  key={member.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md"
                >
                  <div>
                    {/* Header: Avatar, Name & Department */}
                    <div className="flex items-start gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-sm border border-primary/20 transition-transform group-hover:scale-105">
                        {member.initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-base font-bold text-foreground tracking-tight leading-snug group-hover:text-primary transition-colors">
                          {member.staff_name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Department of IST • CEG
                        </p>
                      </div>
                    </div>

                    {/* Assigned Courses from Supabase staff_assignments */}
                    <div className="mt-4 space-y-1.5">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Assigned Courses
                      </div>
                      {member.courses.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {member.courses.map((c) => (
                            <span
                              key={c.code}
                              className={cn(
                                "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-mono font-medium border",
                                c.isLab
                                  ? "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20"
                                  : c.isBridge
                                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                                  : "bg-muted text-foreground border-border/60"
                              )}
                              title={`${c.name} (${c.batch})`}
                            >
                              {c.isLab && <FlaskConical className="size-2.5" />}
                              {c.isBridge && <BookOpen className="size-2.5" />}
                              {c.code}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          Faculty member • CEG Anna University
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer Badge */}
                  <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <GraduationCap className="size-3" />
                      MCA Faculty
                    </span>
                    <span className="font-medium text-primary">
                      {member.courses.length > 0
                        ? `${member.courses.length} ${member.courses.length === 1 ? "course" : "courses"}`
                        : "Faculty"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 2. BATCH & SUBJECTS VIEW (Derived from staff_assignments) ── */}
      {!loading && (viewMode === "regular" || viewMode === "evening") && (
        <div className="space-y-8">
          {/* Core courses */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Core Courses ({coreCourses.length})
              </h3>
              <span className="text-xs text-muted-foreground font-medium capitalize">
                {viewMode === "regular" ? "Regular Batch (REGULAR)" : "Evening Batch (SS)"}
              </span>
            </div>

            {coreCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No core courses match search.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {coreCourses.map((course) => (
                  <BatchCourseCard key={course.code} course={course} />
                ))}
              </div>
            )}
          </div>

          {/* Bridge courses */}
          {bridgeCourses.length > 0 && (
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Bridge Courses ({bridgeCourses.length})
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {bridgeCourses.map((course) => (
                  <BatchCourseCard key={course.code} course={course} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Guidance Note */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex items-start gap-3">
        <Sparkles className="size-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-muted-foreground">
          <strong className="text-foreground font-semibold">Live Database Integration:</strong>{" "}
          Staff allocations for both Regular and Evening batches are derived directly from the Supabase <code>staff_assignments</code> table.
        </div>
      </div>
    </div>
  );
}

function BatchCourseCard({ course }: { course: CourseWithStaff }) {
  return (
    <div className="group rounded-xl sm:rounded-2xl border border-border/80 bg-card p-4 sm:p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-xs flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {course.name}
        </h4>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-md bg-muted/80 px-2 py-0.5 text-[11px] sm:text-xs font-mono text-muted-foreground border border-border/50">
            {course.code}
          </span>
          {course.isLab && (
            <span className="inline-flex items-center gap-1 rounded-md bg-violet-500/15 border border-violet-500/20 px-1.5 py-0.5 text-[11px] font-medium text-violet-700 dark:text-violet-300">
              <FlaskConical className="size-2.5" />
              Lab
            </span>
          )}
          {course.isBridge && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/20 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
              <BookOpen className="size-2.5" />
              Bridge
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
        <UserRound className="mt-0.5 size-3.5 shrink-0 text-primary" />
        <span className="leading-relaxed font-medium text-foreground/90">
          {course.staffNames.length > 0
            ? course.staffNames.join(", ")
            : "Staff to be assigned"}
        </span>
      </div>
    </div>
  );
}
