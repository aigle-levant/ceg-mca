import { useState } from "react";
import {
  CalendarDays,
  Users,
  Pencil,
  CalendarCheck,
  BookOpen,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import type { BatchMode, Timetable } from "@/types/schedule";
import { useSchedule } from "@/hooks/useSchedule";
import { useNavigation } from "@/hooks/useNavigation";
import { saveTimetable } from "@/lib/api";
import { CurrentClassCard } from "@/components/CurrentClassCard";
import { TimetableView } from "@/components/TimetableView";
import { TimetableEditor } from "@/components/TimetableEditor";
import { StaffDirectory } from "@/components/StaffDirectory";
import { ExamDates } from "@/components/ExamDates";
import { SubjectsView } from "@/components/SubjectsView";
import { BatchToggle } from "@/components/BatchToggle";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import profsRegular from "@/data/profs-regular.json";
import profsEvening from "@/data/profs-evening.json";

function App() {
  const [mode, setMode] = useState<BatchMode>("regular");
  const [isEditing, setIsEditing] = useState(false);
  const schedule = useSchedule(mode);
  const { currentPage, navigate } = useNavigation();

  async function handleSaveTimetable(data: Timetable) {
    await saveTimetable(mode, data);
    schedule.updateTimetableData(data);
    setIsEditing(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <div>
        <Navbar currentPage={currentPage} onNavigate={navigate} />

        <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 pb-28 md:pb-20 pt-20 sm:pt-24 md:pt-28">
          {/* ========================================================= */}
          {/* 1. DASHBOARD PAGE                                         */}
          {/* ========================================================= */}
          {currentPage === "dashboard" && (
            <div>
              {/* Batch Toggle & Dashboard Header */}
              <div className="mb-6 sm:mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-1.5 sm:mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold text-primary">
                    <span className="size-1.5 rounded-full bg-primary" />
                    College of Engineering, Guindy • MCA
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                    Dashboard
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    {schedule.day} •{" "}
                    {schedule.now.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>

                <div className="self-start sm:self-auto">
                  <BatchToggle mode={mode} onModeChange={setMode} />
                </div>
              </div>

              {/* Current & Upcoming Class */}
              <section className="mb-8 sm:mb-12">
                <CurrentClassCard
                  currentClass={schedule.currentClass}
                  upcomingClass={schedule.upcomingClass}
                  currentMinutes={schedule.currentMinutes}
                />
              </section>

              {/* Quick Navigation Cards */}
              <section className="mb-10 sm:mb-14">
                <h2 className="mb-3.5 sm:mb-5 text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Quick Access
                </h2>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                  {/* Timetable Card */}
                  <button
                    type="button"
                    onClick={() => navigate("timetable")}
                    className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border/80 bg-card p-3.5 sm:p-5 text-left shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
                  >
                    <div>
                      <div className="mb-3 sm:mb-4 flex size-9 sm:size-10 items-center justify-center rounded-lg sm:rounded-xl bg-primary/10 text-primary border border-primary/20 transition-transform group-hover:scale-105">
                        <CalendarDays className="size-4 sm:size-5" />
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        Timetable
                      </h3>
                      <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-muted-foreground line-clamp-2">
                        Weekly schedule & custom periods
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-6 flex items-center gap-1 text-[11px] sm:text-xs font-medium text-primary">
                      <span>View</span>
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>

                  {/* Exams Card */}
                  <button
                    type="button"
                    onClick={() => navigate("exams")}
                    className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border/80 bg-card p-3.5 sm:p-5 text-left shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
                  >
                    <div>
                      <div className="mb-3 sm:mb-4 flex size-9 sm:size-10 items-center justify-center rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 transition-transform group-hover:scale-105">
                        <CalendarCheck className="size-4 sm:size-5" />
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        Exams
                      </h3>
                      <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-muted-foreground line-clamp-2">
                        CA 1, CA 2 & End Sem dates
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-6 flex items-center gap-1 text-[11px] sm:text-xs font-medium text-primary">
                      <span>View</span>
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>

                  {/* Subjects Card */}
                  <button
                    type="button"
                    onClick={() => navigate("subjects")}
                    className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border/80 bg-card p-3.5 sm:p-5 text-left shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
                  >
                    <div>
                      <div className="mb-3 sm:mb-4 flex size-9 sm:size-10 items-center justify-center rounded-lg sm:rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-transform group-hover:scale-105">
                        <BookOpen className="size-4 sm:size-5" />
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        Subjects
                      </h3>
                      <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-muted-foreground line-clamp-2">
                        Syllabus, units & credits
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-6 flex items-center gap-1 text-[11px] sm:text-xs font-medium text-primary">
                      <span>View</span>
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>

                  {/* Staff Directory Card */}
                  <button
                    type="button"
                    onClick={() => navigate("staff")}
                    className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border/80 bg-card p-3.5 sm:p-5 text-left shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
                  >
                    <div>
                      <div className="mb-3 sm:mb-4 flex size-9 sm:size-10 items-center justify-center rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-transform group-hover:scale-105">
                        <Users className="size-4 sm:size-5" />
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        Staff
                      </h3>
                      <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-muted-foreground line-clamp-2">
                        Regular & Evening faculty
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-6 flex items-center gap-1 text-[11px] sm:text-xs font-medium text-primary">
                      <span>View</span>
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                </div>
              </section>

              {/* Today's Schedule Overview */}
              <section>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                      Today's Schedule ({schedule.day})
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {mode === "regular" ? "Regular" : "Evening"} batch timetable for today
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("timetable")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Full timetable
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>

                <TimetableView
                  getScheduleForDay={schedule.getScheduleForDay}
                  currentDay={schedule.day}
                  currentMinutes={schedule.currentMinutes}
                />
              </section>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. TIMETABLE PAGE                                         */}
          {/* ========================================================= */}
          {currentPage === "timetable" && (
            <div>
              <PageBreadcrumb onBack={() => navigate("dashboard")} current="Timetable" />

              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Timetable
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {mode === "regular" ? "Regular" : "Evening"} batch weekly schedule
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <BatchToggle mode={mode} onModeChange={setMode} />

                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-border hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <TimetableEditor
                  mode={mode}
                  initialData={schedule.timetableData}
                  currentDay={schedule.day}
                  onSave={handleSaveTimetable}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <TimetableView
                  getScheduleForDay={schedule.getScheduleForDay}
                  currentDay={schedule.day}
                  currentMinutes={schedule.currentMinutes}
                />
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. EXAMS PAGE                                             */}
          {/* ========================================================= */}
          {currentPage === "exams" && (
            <div>
              <PageBreadcrumb onBack={() => navigate("dashboard")} current="Exams" />

              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  Exam Schedule
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Continuous Assessment (CA 1, CA 2) periods, SEMS deadlines, and End Semester dates
                </p>
              </div>

              <ExamDates />
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. SUBJECTS PAGE                                          */}
          {/* ========================================================= */}
          {currentPage === "subjects" && (
            <div>
              <PageBreadcrumb onBack={() => navigate("dashboard")} current="Subjects" />

              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  Subjects & Syllabus
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Semester I core curriculum, units breakdown, and bridge courses
                </p>
              </div>

              <SubjectsView />
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. STAFF DIRECTORY PAGE                                   */}
          {/* ========================================================= */}
          {currentPage === "staff" && (
            <div>
              <PageBreadcrumb onBack={() => navigate("dashboard")} current="Staff Directory" />

              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Faculty Directory
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Professors and instructors handling MCA courses
                  </p>
                </div>
              </div>

              <StaffDirectory
                regularProfs={profsRegular}
                eveningProfs={profsEvening}
              />
            </div>
          )}
        </main>
      </div>

      <Footer onNavigate={navigate} />
    </div>
  );
}

function PageBreadcrumb({
  onBack,
  current,
}: {
  onBack: () => void;
  current: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-3.5" />
        Dashboard
      </button>
      <span>/</span>
      <span className="font-semibold text-foreground">{current}</span>
    </div>
  );
}

export default App;
