export type DashboardTask = {
  id: number;
  title: string;
  course: string;
  kind: "ABGABE" | "KLAUSUR";
  type: string;
  due_date: string;
};

export type PraxisPartnerData = {
  company_name: string;
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
  target_per_week: number;
};

export type ScheduleEventData = {
  id: number;
  title: string;
  course_code: string | null;
  date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  event_type: string;
  professor: string | null;
};

export type RecentCourse = {
  id: string | number;
  name: string;
  studiengang?: string;
  semester?: string;
  visited_at: number;
  color?: string;
};

export type DashboardDeferredData = {
  tasks: DashboardTask[];
  tasksTotal: number;
  praxisPartner: PraxisPartnerData | null;
  praxisHours: PraxisHoursData;
  scheduleEvents: ScheduleEventData[];
  averageGrade: number | null;
  newsItems: Array<{
    slug: string;
    title: string;
    excerpt: string | null;
    content: string | null;
    category: string | null;
    published_at: string;
    featured: boolean;
  }>;
};

export type DashboardLoaderData = {
  isFirstSemester: boolean;
  userName: string;
  userCampusArea: string | null;
  studiengangName: string | null;
  userId?: number;
  deferred: Promise<DashboardDeferredData>;
};
