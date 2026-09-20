export type BatchMode = "regular" | "evening";
export type CourseMode = "non-bridge" | "bridge";

export interface TimetableEntry {
  time: string;
  subject_code: string | null;
}

export interface Timetable {
  [day: string]: TimetableEntry[];
}

export interface SubjectInfo {
  code: string;
  name: string;
  type?: string;
}

export interface ProfSubject {
  code: string;
  name: string;
  staff_incharge: string;
  type?: string;
}

export interface ProfData {
  subjects: ProfSubject[];
}

export interface SubjectData {
  subjects: SubjectInfo[];
}

export interface ParsedClass {
  subjectCode: string;
  subjectName: string;
  staffIncharge: string;
  timeDisplay: string;
  startMinutes: number;
  endMinutes: number;
  isLab: boolean;
  isBridge: boolean;
}
