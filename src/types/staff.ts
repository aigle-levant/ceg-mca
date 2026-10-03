export interface StaffRecord {
  id: string;
  staff_name: string;
}

export interface StaffAssignmentRecord {
  id: string;
  batch_id: string;
  course_id: string | null;
  staff_id: string | null;
  batches?: {
    id?: string;
    batch: string;
  } | null;
  courses?: {
    id?: string;
    course_code: string;
    course_name: string;
    category?: string;
    course_type?: string;
  } | null;
  staff?: {
    id?: string;
    staff_name: string;
  } | null;
}

export interface CourseWithStaff {
  code: string;
  name: string;
  category?: string;
  course_type?: string;
  isLab: boolean;
  isBridge: boolean;
  staffNames: string[];
}
