import { useEffect, useMemo, useState } from "react";

import { ClassModeToggle } from "@/components/ClassModeToggle";
import { CurrentClass } from "@/components/CurrentClass";
import { UpcomingClass } from "@/components/UpcomingClass";

import type { ClassMode, ClassPeriod } from "@/types/schedule";

interface ClassDashboardProps {
  regularClasses: ClassPeriod[];
  ssClasses: ClassPeriod[];
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getCurrentTimeInMinutes() {
  const now = new Date();

  return now.getHours() * 60 + now.getMinutes();
}

export function ClassDashboard({
  regularClasses,
  ssClasses,
}: ClassDashboardProps) {
  const [mode, setMode] = useState<ClassMode>("regular");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  const classes = mode === "regular" ? regularClasses : ssClasses;

  const currentTime = useMemo(() => {
    return now.getHours() * 60 + now.getMinutes();
  }, [now]);

  const currentClass = useMemo(() => {
    return (
      classes.find((classItem) => {
        const start = timeToMinutes(classItem.start);
        const end = timeToMinutes(classItem.end);

        return currentTime >= start && currentTime < end;
      }) ?? null
    );
  }, [classes, currentTime]);

  const upcomingClass = useMemo(() => {
    return (
      classes.find(
        (classItem) => timeToMinutes(classItem.start) > currentTime,
      ) ?? null
    );
  }, [classes, currentTime]);

  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-16 pt-28 md:px-8">
      {/* Mode */}
      <div className="mb-8 flex justify-end">
        <ClassModeToggle
          mode={mode}
          onModeChange={setMode}
        />
      </div>

      {/* Classes */}
      <div className="space-y-5">
        <CurrentClass classItem={currentClass} />

        <UpcomingClass classItem={upcomingClass} />
      </div>
    </main>
  );
}