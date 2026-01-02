import type { Mark, Teacher } from "@prisma/client";

export interface TranscriptStudentData {
  name: string;
  studentId: string;
  program: string;
  semester: string;
  enrollmentDate: string;
}

export interface MarkWithTeacher extends Mark {
  teacher: Teacher | null;
}

export interface TranscriptStats {
  totalCredits: number;
  gpa: string;
  passedCount: number;
}
