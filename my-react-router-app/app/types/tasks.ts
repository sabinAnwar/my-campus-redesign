export type TaskLoaderSubmission = {
  id: number;
  title: string;
  course: string;
  courseCode?: string;
  professor?: string;
  type: string;
  dueDateIso: string;
  dueDate: string;
  correctionDate: string;
  correctionDateIso: string;
};

export type TaskLoaderData = {
  submissions: TaskLoaderSubmission[];
};

export type TaskUISubmission = TaskLoaderSubmission & {
  status: "pending" | "submitted";
  daysUntilDue: number;
  similarity?: number;
};
