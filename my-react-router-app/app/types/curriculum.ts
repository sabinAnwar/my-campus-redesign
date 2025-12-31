export interface CurriculumMark {
  id: number;
  value: number;
  course: string;
  date: string;
  userId: number;
  teacherId: number;
  status?: string;
  courseId?: number;
  credits?: number;
}
