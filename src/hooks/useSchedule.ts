import { useState, useEffect, useMemo, useCallback } from "react";
import type { BatchMode, ParsedClass, Timetable } from "@/types/schedule";
import {
  getDayName,
  getCurrentMinutes,
  buildDaySchedule,
  findCurrentClass,
  findUpcomingClass,
} from "@/lib/schedule";

import timetableRegular from "@/data/timetable-regular.json";
import timetableEvening from "@/data/timetable-evening.json";
import profsRegular from "@/data/profs-regular.json";
import profsEvening from "@/data/profs-evening.json";
import subjectsData from "@/data/subjects.json";

export function useSchedule(mode: BatchMode) {
  const [now, setNow] = useState(new Date());
  const [regularData, setRegularData] = useState<Timetable>(
    timetableRegular as unknown as Timetable
  );
  const [eveningData, setEveningData] = useState<Timetable>(
    timetableEvening as unknown as Timetable
  );

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const day = getDayName(now);
  const currentMinutes = getCurrentMinutes(now);

  const timetable = mode === "regular" ? regularData : eveningData;
  const profs = mode === "regular" ? profsRegular : profsEvening;

  const updateTimetableData = useCallback(
    (data: Timetable) => {
      if (mode === "regular") setRegularData(data);
      else setEveningData(data);
    },
    [mode]
  );

  const todaySchedule = useMemo(
    () => buildDaySchedule(timetable, profs, subjectsData, day),
    [timetable, profs, day]
  );

  const currentClass = useMemo(
    () => findCurrentClass(todaySchedule, currentMinutes),
    [todaySchedule, currentMinutes]
  );

  const upcomingClass = useMemo(
    () => findUpcomingClass(todaySchedule, currentMinutes),
    [todaySchedule, currentMinutes]
  );

  const getScheduleForDay = useCallback(
    (dayName: string): ParsedClass[] => {
      return buildDaySchedule(timetable, profs, subjectsData, dayName);
    },
    [timetable, profs]
  );

  return {
    now,
    day,
    currentMinutes,
    todaySchedule,
    currentClass,
    upcomingClass,
    getScheduleForDay,
    profs,
    timetableData: timetable,
    updateTimetableData,
  };
}
