export type Language = "de" | "en";

export interface HomeTranslation {
  welcomeBack: string;
  dashboard: string;
  logout: string;
  login: string;
  courses: string;
  courseOverview: string;
  courseOverviewDesc: string;
  submissions: string;
  submissionsDesc: string;
  viewAll: string;
  noCoursesYet: string;
  turnitin: string;
  similarityScore: string;
  status: string;
  dueDate: string;
  submitted: string;
  pending: string;
  language: string;
}

export type HomeUser = {
  name?: string;
  username?: string;
  // add other properties if needed
};
