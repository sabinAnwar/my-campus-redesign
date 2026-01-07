import type { CourseSubmission } from "./course";

export interface CourseResource {
  id: number | string;
  title: string;
  type: string;
  url: string;
  duration?: string;
  size?: string;
  date?: string;
  teacher?: boolean;
}

export interface Course {
  id: number;
  title: string;
  name?: string;
  instructor: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  credits: number;
  semester: number;
  color?: string;
  resources?: CourseResource[];
  code?: string;
}

export interface CourseDetailData {
  submissions: CourseSubmission[];
  course: Course;
  userId?: number;
  studiengangName?: string;
}

export interface ResourceSection {
  id: string;
  label: string;
  icon: any;
  color: "cyan" | "amber" | "purple" | "red" | "rose";
  defaultExpanded: boolean;
  items: CourseResource[];
}

export interface VideoResource extends CourseResource {
  type: "video";
}

export interface ForumPost {
  id: number;
  author: string;
  date: string;
  content: string;
  timestamp?: string;
}

export interface ForumTopic {
  id: number;
  title: string;
  author: string;
  lastPost: string;
  replies: number;
  views: number;
  status: "active" | "pinned" | "closed" | "normal";
  content: string;
  posts: ForumPost[];
}

export interface TranslationType {
  courses: string;
  myCourses: string;
  logout: string;
  modules: string;
  forum: string;
  turnitin: string;
  resources: string;
  videos: string;
  scripts: string;
  files: string;
  assignments: string;
  submissions: string;
  overview: string;
  courseDescription: string;
  instructor: string;
  credits: string;
  semester: string;
  startDate: string;
  endDate: string;
  module: string;
  topics: string;
  completed: string;
  inProgress: string;
  notStarted: string;
  downloadFile: string;
  uploadAssignment: string;
  searchForum: string;
  createTopic: string;
  newPost: string;
  replies: string;
  views: string;
  lastPost: string;
  yourSubmissions: string;
  grade: string;
  feedback: string;
  status: string;
  submitted: string;
  pending: string;
  graded: string;
  similarity: string;
  back: string;
  date: string;
  teacher: string;
  progress: string;
}
