import type { CourseRecord } from "./deadlines";

export interface ExamRecord {
  id: string;
  course_code: string;
  exam_date: string | null; // ISO date string "YYYY-MM-DD"
  is_tentative: boolean | null;
  courses?: CourseRecord | null;
}
