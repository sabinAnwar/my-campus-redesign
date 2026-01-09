export type CourseSubmission = {
  id: number;
  title: string;
  course: string;
  type: string;
  courseCode?: string;
  professor?: string;
  due_date_iso: string;
  due_date: string;
  correction_date: string;
  status: "pending" | "submitted";
  similarity?: number;
  submitted_file_name?: string;
  submitted_file_size?: number;
  days_until_due: number;
  submissions: any[];
};

export interface CoursesLoaderData {
  userStudiengang: string | null;
  marks: any[];
  currentSemester: number;
  user_id?: number;
  dbCourses: any[];
}
