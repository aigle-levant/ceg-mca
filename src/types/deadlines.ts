export interface CourseRecord {
  id: string;
  course_code: string;
  course_name: string;
  category?: string;
  course_type?: string;
}

export interface BatchRecord {
  id: string;
  batch: string;
}

export interface DeadlineRecord {
  id: string;
  batch_id: string;
  course_id: string;
  title: string;
  description: string | null;
  due_date: string;
  created_at: string;
  courses?: CourseRecord | null;
  batches?: BatchRecord | null;
}
