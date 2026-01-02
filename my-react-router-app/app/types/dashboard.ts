export type DashboardTask = {
  id: number;
  title: string;
  course: string;
  kind: "ABGABE" | "KLAUSUR";
  type: string;
  dueDate: string;
};

export type PraxisPartnerData = {
  companyName: string;
  department: string | null;
  supervisor: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
};

export type PraxisHoursData = {
  required: number;
  logged: number;
  thisWeek: number;
  targetPerWeek: number;
};

export type ScheduleEventData = {
  id: number;
  title: string;
  courseCode: string | null;
  date: string;
  startTime: string;
  endTime: string;
  location: string | null;
  eventType: string;
  professor: string | null;
};

export type RecentCourse = {
  id: string | number;
  name: string;
  studiengang?: string;
  semester?: string;
  visitedAt: number;
  color?: string;
};

export type DashboardLoaderData = {
  tasks: DashboardTask[];
  tasksTotal: number;
  praxisPartner: PraxisPartnerData | null;
  praxisHours: PraxisHoursData;
  scheduleEvents: ScheduleEventData[];
  averageGrade: number | null;
  isFirstSemester: boolean;
  userName: string;
  userCampusArea: string | null;
  studiengangName: string | null;
  newsItems: Array<{
    slug: string;
    title: string;
    excerpt: string | null;
    content: string | null;
    category: string | null;
    publishedAt: string;
    featured: boolean;
  }>;
  userId: number;
};
