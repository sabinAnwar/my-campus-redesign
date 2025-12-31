export type ExamCourseItem = {
  id: string;
  name: string;
  credits: number;
  type: string;
  status?: "passed" | "enrolled";
  grade?: string;
};

export type ExamCategoryCourse = {
  id: string;
  name: string;
  credits: number;
  type: string;
  status?: string;
  grade?: string;
};
