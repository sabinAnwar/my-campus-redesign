export type CourseSubmission = {
  id: number;
  title: string;
  course: string;
  type: string;
  courseCode?: string;
  professor?: string;
  dueDateIso: string;
  dueDate: string;
  correctionDate: string;
  status: "pending" | "submitted";
  similarity?: number;
  daysUntilDue: number;
  submissions: any[];
};

export interface CoursesLoaderData {
  userStudiengang: string | null;
  marks: any[];
  currentSemester: number;
  userId?: number;
  dbCourses: any[];
}
