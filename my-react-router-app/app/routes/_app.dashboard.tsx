import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import FirstSemesterOnboarding from "~/components/FirstSemesterOnboarding";
import { useLanguage } from "~/contexts/LanguageContext";

import {
  Calendar,
  BookOpen,
  CheckSquare,
  Clock,
  FileText,
  Bell,
  ArrowRight,
  Play,
  TrendingUp,
  AlertCircle,
  CalendarDays,
  GraduationCap,
  MessageSquare,
  FileSearch,
  BarChart3,
  Award,
  Zap,
  Target,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  MapPin,
  Users,
  DoorOpen,
  History,
  Library,
  Briefcase,
  Building2,
  CalendarCheck,
  Timer,
  Coffee,
  BookMarked,
  ClipboardCheck,
  Phone,
  Mail,
  ExternalLink,
  Laptop,
  Building,
  Newspaper,
  Sparkles,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { STUDY_PLANS, DEFAULT_PALETTE, toISODate } from "~/lib/studyPlans";
import { calculateDaysLeft } from "~/lib/tasksSample";
import { prisma } from "~/lib/prisma";
import { useLoaderData } from "react-router-dom";
import { ACTIVE_COURSES_COUNT } from "~/lib/coursesMeta";

// Dashboard Translations
const TRANSLATIONS = {
  de: {
    goodMorning: "Guten Morgen",
    goodAfternoon: "Guten Tag",
    goodEvening: "Guten Abend",
    overview: "Hier ist eine Übersicht über deinen Studienalltag.",
    studentBenefits: "Student Benefits anzeigen",
    activeCourses: "Aktive Kurse",
    tasks: "Aufgaben",
    todayAppointments: "Heute",
    appointments: "Termine",
    avgGrade: "Ø Note",
    average: "Durchschnitt",
    campus: "Campus",
    rooms: "Räume",
    loading: "Loading...",
    currentNews: "Aktuelle News",
    allNews: "Alle",
    read: "Lesen",
    phaseProgress: "Phasen-Fortschritt",
    day: "Tag",
    of: "von",
    daysLeft: "Noch",
    days: "Tage",
    current: "Aktuell",
    nextPhase: "Nächste Phase",
    praxisPartner: "Praxispartner",
    supervisor: "Ansprechpartner",
    praxisHours: "Praxis-Stunden",
    hoursLogged: "Stunden erfasst",
    thisWeek: "Diese Woche",
    targetPerWeek: "Ziel/Woche",
    todayClasses: "Heutiger Stundenplan",
    noClassesToday: "Heute keine Veranstaltungen",
    showFullSchedule: "Vollständigen Stundenplan anzeigen",
    upcomingTasks: "Anstehende Aufgaben",
    due: "fällig",
    daysShort: "Tage",
    showAllTasks: "Alle Aufgaben anzeigen",
    quickActions: "Quick Actions",
    courses: "Kurse",
    schedule: "Stundenplan",
    library: "Online Bibliothek",
    roomBooking: "Raumbuchung",
    studentId: "Studentenausweis",
    recentlyVisited: "Kürzlich besucht",
    noRecentCourses: "Noch keine Kurse besucht",
    viewAllCourses: "Alle Kurse anzeigen",
    weekOverview: "Wochenübersicht",
    campusInfo: "Campus Informationen",
    noCampusSelected: "Kein Campus ausgewählt",
    selectCampus: "Campus auswählen",
    writePraxisReport: "Praxisbericht schreiben",
    viewSchedule: "Stundenplan ansehen",
    semesterEnd: "Semesterende",
    from: "Ab",
  },
  en: {
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    overview: "Here's an overview of your study routine.",
    studentBenefits: "View Student Benefits",
    activeCourses: "Active Courses",
    tasks: "Tasks",
    todayAppointments: "Today",
    appointments: "Appointments",
    avgGrade: "Avg Grade",
    average: "Average",
    campus: "Campus",
    rooms: "Rooms",
    loading: "Loading...",
    currentNews: "Current News",
    allNews: "All",
    read: "Read",
    phaseProgress: "Phase Progress",
    day: "Day",
    of: "of",
    daysLeft: "Left",
    days: "days",
    current: "Current",
    nextPhase: "Next Phase",
    praxisPartner: "Practice Partner",
    supervisor: "Contact Person",
    praxisHours: "Practice Hours",
    hoursLogged: "hours logged",
    thisWeek: "This Week",
    targetPerWeek: "Target/Week",
    todayClasses: "Today's Schedule",
    noClassesToday: "No classes today",
    showFullSchedule: "View Full Schedule",
    upcomingTasks: "Upcoming Tasks",
    due: "due",
    daysShort: "days",
    showAllTasks: "View All Tasks",
    quickActions: "Quick Actions",
    courses: "Courses",
    schedule: "Schedule",
    library: "Online Library",
    roomBooking: "Room Booking",
    studentId: "Student ID",
    recentlyVisited: "Recently Visited",
    noRecentCourses: "No courses visited yet",
    viewAllCourses: "View All Courses",
    weekOverview: "Week Overview",
    campusInfo: "Campus Information",
    noCampusSelected: "No campus selected",
    selectCampus: "Select Campus",
    writePraxisReport: "Write Practice Report",
    viewSchedule: "View Schedule",
    semesterEnd: "Semester End",
    from: "From",
  },
};

type DashboardTask = {
  id: number;
  title: string;
  course: string;
  kind: "ABGABE" | "KLAUSUR";
  type: string;
  dueDate: string;
};

type PraxisPartnerData = {
  companyName: string;
  department: string | null;
  supervisor: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
};

type PraxisHoursData = {
  required: number;
  logged: number;
  thisWeek: number;
  targetPerWeek: number;
};

type ScheduleEventData = {
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

type DashboardLoaderData = {
  tasks: DashboardTask[];
  tasksTotal: number;
  praxisPartner: PraxisPartnerData | null;
  praxisHours: PraxisHoursData;
  scheduleEvents: ScheduleEventData[];
  averageGrade: number | null;
  isFirstSemester: boolean;
  userName: string;
  userCampusArea: string | null;
  newsItems: Array<{
    slug: string;
    title: string;
    excerpt: string | null;
    category: string | null;
    publishedAt: string;
    featured: boolean;
  }>;
};

export const loader = async ({ request }: { request: Request }) => {
  // Initialize default values
  let tasks: DashboardTask[] = [];
  let tasksTotal = 0;
  let praxisPartner: PraxisPartnerData | null = null;
  let praxisHours: PraxisHoursData = {
    required: 900,
    logged: 0,
    thisWeek: 0,
    targetPerWeek: 40,
  };
  let scheduleEvents: ScheduleEventData[] = [];
  let averageGrade: number | null = 1.58;
  let isFirstSemester = false;
  let userName = "Student";
  let userCampusArea: string | null = null;
  let newsItems: DashboardLoaderData["newsItems"] = [];

  try {
    // Get logged-in user from session
    const cookieHeader = request.headers.get("Cookie") || "";
    const sessionToken = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("session="))
      ?.split("=")[1];
    
    let userId: number | undefined;
    let loggedInUser: { id: number; semester: number; totalSemesters: number; name: string | null } | null = null;
    
    if (sessionToken) {
      const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { 
          user: { 
            select: { id: true, semester: true, totalSemesters: true, name: true }
          } 
        },
      });
      if (session?.user) {
        loggedInUser = session.user;
        userId = session.user.id;
      }
    }
    
    // Fallback to first user if no session (shouldn't happen in production)
    if (!loggedInUser) {
      loggedInUser = await prisma.user.findFirst({ 
        select: { id: true, semester: true, totalSemesters: true, name: true } 
      });
      userId = loggedInUser?.id;
    }
    
    // Check if user is first semester (semester === 1)
    // Middle semesters: 1 < semester < totalSemesters
    // Last semester: semester === totalSemesters
    const userSemester = loggedInUser?.semester ?? 1;
    isFirstSemester = userSemester === 1;
    userName = loggedInUser?.name || "Student";

    // Date calculations for schedule query
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 5);
    
    // Week calculation for hours
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    // Execute ALL database queries in PARALLEL for faster loading
    const [
      tasksResult,
      totalCount,
      partner,
      target,
      totalHoursResult,
      weekHoursResult,
      eventsResult,
      marksResult,
    ] = await Promise.all([
      // Tasks
      prisma.studentTask.findMany({
        orderBy: { dueDate: "asc" },
        take: 6,
      }),
      prisma.studentTask.count(),
      // Praxis Partner
      userId ? prisma.praxisPartner.findUnique({ where: { userId } }) : null,
      // Hours Target
      userId ? prisma.praxisHoursTarget.findUnique({ where: { userId } }) : null,
      // Total Hours
      userId ? prisma.praxisHoursLog.aggregate({
        where: { userId },
        _sum: { hours: true },
      }) : { _sum: { hours: 0 } },
      // Week Hours
      userId ? prisma.praxisHoursLog.aggregate({
        where: { userId, date: { gte: startOfWeek } },
        _sum: { hours: true },
      }) : { _sum: { hours: 0 } },
      // Schedule Events
      userId ? prisma.scheduleEvent.findMany({
        where: { userId, date: { gte: today, lt: endDate } },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
      }) : [],
      // Marks for average grade
      prisma.mark.findMany({ select: { value: true } }),
    ]);

    // Process tasks
    tasks = tasksResult.map((t: any) => ({
      id: t.id,
      title: t.title,
      course: t.course,
      kind: t.kind,
      type: t.type,
      dueDate: t.dueDate.toISOString(),
    }));
    tasksTotal = totalCount;

    // Process praxis partner
    if (partner) {
      praxisPartner = {
        companyName: partner.companyName,
        department: partner.department,
        supervisor: partner.supervisor,
        email: partner.email,
        phone: partner.phone,
        address: partner.address,
      };
    }

    // Process praxis hours
    praxisHours = {
      required: target?.requiredHours ?? 900,
      logged: Math.round(totalHoursResult._sum.hours ?? 0),
      thisWeek: Math.round(weekHoursResult._sum.hours ?? 0),
      targetPerWeek: target?.targetPerWeek ?? 40,
    };

    // Process schedule events
    scheduleEvents = (eventsResult as any[]).map((e: any) => ({
      id: e.id,
      title: e.title,
      courseCode: e.courseCode,
      date: e.date.toISOString(),
      startTime: e.startTime,
      endTime: e.endTime,
      location: e.location,
      eventType: e.eventType,
      professor: e.professor,
    }));

    // Calculate average grade
    if (marksResult.length > 0) {
      const sum = marksResult.reduce((acc: number, m: any) => acc + m.value, 0);
      averageGrade = sum / marksResult.length;
    }
    
    // Fetch news items server-side for faster LCP
    try {
      const newsResult = await prisma.news.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 5,
        select: {
          slug: true,
          title: true,
          excerpt: true,
          category: true,
          publishedAt: true,
          featured: true,
        },
      });
      newsItems = newsResult.map((n: any) => ({
        ...n,
        publishedAt: n.publishedAt.toISOString(),
      }));
    } catch {
      // News table might not exist, keep empty array
    }
  } catch (error) {
    console.error("Dashboard loader error:", error);
    // Keep default values on error
  }

  return {
    tasks,
    tasksTotal,
    praxisPartner,
    praxisHours,
    scheduleEvents,
    averageGrade,
    isFirstSemester,
    userName,
    userCampusArea,
    newsItems,
  };
};
import { getRecentCourses } from "~/lib/recentCourses";

export default function Dashboard() {
  const {
    tasks,
    tasksTotal,
    praxisPartner,
    praxisHours,
    scheduleEvents,
    averageGrade,
    isFirstSemester,
    userName,
    userCampusArea,
    newsItems,
  } = useLoaderData() as DashboardLoaderData;

  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  // Use server-loaded user data directly - no client fetch needed!
  const user = { name: userName, campusArea: userCampusArea };
  
  type RecentCourse = {
    id: string | number;
    name: string;
    studiengang?: string;
    semester?: string;
    visitedAt: number;
    color?: string;
  };
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const navigate = useNavigate();
  
  // Only load recent courses on client (localStorage access)
  useEffect(() => {
    setRecentCourses(getRecentCourses(6));
  }, []);

  // Auto-slide news every 5 seconds
  useEffect(() => {
    if (newsItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [newsItems.length]);

  const nextNews = () => {
    setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
  };

  const prevNews = () => {
    setCurrentNewsIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  const getCategoryColor = (category?: string | null) => {
    const key = (category || "").toLowerCase();
    if (key.includes("exam")) return "from-amber-500 to-orange-500";
    if (key.includes("it") || key.includes("tech")) return "from-indigo-500 to-purple-500";
    if (key.includes("scholar")) return "from-emerald-500 to-green-500";
    if (key.includes("library")) return "from-violet-500 to-purple-500";
    if (key.includes("career")) return "from-cyan-500 to-blue-500";
    if (key.includes("academic") || key.includes("module")) return "from-blue-500 to-indigo-500";
    return "from-primary to-purple-600";
  };

  // NO LOADING STATE - Data comes from server!

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.goodMorning;
    if (hour < 18) return t.goodAfternoon;
    return t.goodEvening;
  };

  // Active course count (shared with courses page meta)
  const activeCourses = ACTIVE_COURSES_COUNT;

  // Stats
  const statsBase = [
    {
      label: t.activeCourses,
      value: String(activeCourses ?? 0),
      change: "+2",
      icon: BookOpen,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600",
      link: "/courses",
    },
    {
      label: t.tasks,
      value: String(tasksTotal ?? 0),
      change: `5 ${t.due}`,
      icon: CheckSquare,
      color: "orange",
      bgGradient: "from-orange-500 to-orange-600",
      link: "/tasks",
    },
    {
      label: t.todayAppointments,
      value: "3",
      change: t.appointments,
      icon: CalendarDays,
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600",
      link: "/courses/schedule",
    },
    {
      label: t.avgGrade,
      value: averageGrade ? averageGrade.toFixed(1) : "-",
      change: t.average,
      icon: Award,
      color: "green",
      bgGradient: "from-green-500 to-emerald-600",
      link: "/notenverwaltung",
    },
  ];

  const bookingLink = user?.campusArea
    ? `/raumbuchung?campus=${encodeURIComponent(user.campusArea)}`
    : "/raumbuchung";

  // Dual Student Logic
  const currentPlan = STUDY_PLANS[0]; // Default to first plan
  const today = new Date();
  const todayIso = toISODate(today);

  // Find current block
  const currentBlock = currentPlan.blocks.find((b) => {
    return todayIso >= b.start && todayIso <= b.end;
  });

  const currentStatus = currentBlock?.status || "vorlesung"; // Default
  const statusConfig =
    currentPlan.paletteOverrides?.[currentStatus] ||
    DEFAULT_PALETTE[currentStatus];

  // Find next phase
  const nextBlock = currentPlan.blocks.find(
    (b) => b.start > todayIso && b.status !== currentStatus
  );

  // Calculate progress
  let phaseProgress = 0;
  let phaseDaysLeft = 0;
  let phaseTotalDays = 0;

  if (currentBlock) {
    const start = new Date(currentBlock.start).getTime();
    const end = new Date(currentBlock.end).getTime();
    const now = today.getTime();
    phaseTotalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
    phaseDaysLeft = Math.max(0, phaseTotalDays - daysPassed);
    phaseProgress = Math.min(
      100,
      Math.max(0, (daysPassed / phaseTotalDays) * 100)
    );
  }

  // Dual Student Company Info (from database)
  const companyInfo = praxisPartner
    ? {
        name: praxisPartner.companyName,
        department: praxisPartner.department || "Abteilung nicht angegeben",
        supervisor: praxisPartner.supervisor || "Nicht angegeben",
        email: praxisPartner.email || "",
        phone: praxisPartner.phone || "",
        address: praxisPartner.address || "",
      }
    : null;

  // Praxis Hours Progress (from database)
  const praxisProgress =
    praxisHours.required > 0
      ? Math.round((praxisHours.logged / praxisHours.required) * 100)
      : 0;

  const stats = [...statsBase];

  const campusStat = {
    label: "Campus",
    value: user?.campusArea || "Raumbuchung",
    change: "Räume",
    icon: DoorOpen,
    color: "blue",
    bgGradient: "from-cyan-500 to-blue-600",
    link: bookingLink,
  };

  // Today's classes from database schedule events
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayClasses = scheduleEvents
    .filter((e) => {
      const eventDate = new Date(e.date);
      return eventDate >= todayStart && eventDate <= todayEnd;
    })
    .map((e, idx) => ({
      id: e.id,
      title: `${e.title}${e.courseCode ? ` - ${e.courseCode}` : ""}`,
      time: `${e.startTime} - ${e.endTime}`,
      location: e.location || "Nicht angegeben",
      type: e.eventType.charAt(0) + e.eventType.slice(1).toLowerCase(),
      professor: e.professor || "",
      color: idx % 3 === 0 ? "blue" : idx % 3 === 1 ? "purple" : "green",
    }));

  // Weekly Schedule Mini-View (from database)
  const getWeekDays = () => {
    const days = [];
    const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayEvents = scheduleEvents
        .filter((e) => {
          const eventDate = new Date(e.date);
          return eventDate >= dayStart && eventDate <= dayEnd;
        })
        .map((e) => ({
          title: e.title,
          time: e.startTime,
          type: e.eventType.charAt(0) + e.eventType.slice(1).toLowerCase(),
        }));

      days.push({
        date: date,
        dayName: dayNames[date.getDay()],
        dayNum: date.getDate(),
        isToday: i === 0,
        events: dayEvents,
      });
    }
    return days;
  };
  const weekDays = getWeekDays();

  // Upcoming assignments + exams overview (from DB tasks)
  const upcomingAssignments = [
    ...tasks.map((task) => {
      const daysLeft = calculateDaysLeft(task.dueDate);
      return {
        id: `task-${task.id}`,
        title: task.title,
        course: task.course,
        workType: task.type,
        kind:
          task.kind === "KLAUSUR"
            ? ("Klausurtermin" as const)
            : ("Abgabe" as const),
        dueDate: new Date(task.dueDate).toLocaleDateString("de-DE"),
        daysLeft,
        priority:
          task.kind === "KLAUSUR" ? ("high" as const) : ("medium" as const),
        completed: false,
      };
    }),
  ].sort((a, b) => a.daysLeft - b.daysLeft);

  // Quick actions
  const quickActions = [
    { label: t.courses, icon: BookOpen, link: "/courses", color: "blue" },
    {
      label: t.schedule,
      icon: CalendarDays,
      link: "/courses/schedule",
      color: "purple",
    },
    {
      label: t.tasks,
      icon: CheckSquare,
      link: "/tasks",
      color: "orange",
    },
    {
      label: t.library,
      icon: Library,
      link: "/library",
      color: "green",
    },
    {
      label: t.roomBooking,
      icon: DoorOpen,
      link: "/raumbuchung",
      color: "indigo",
    },
    {
      label: t.studentId,
      icon: GraduationCap,
      link: "/student-id",
      color: "pink",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 mt-4">
        <div className="flex-1">
          <h1 className="text-[36px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 leading-tight mb-2">
            {getGreeting()}, {user?.name ? user.name.split(" ")[0] : "Student"}{" "}
            👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {t.overview}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/benefits"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/40 bg-primary/10 text-primary font-semibold hover:bg-primary/15 transition-colors"
            >
              Student Benefits anzeigen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Greeting Animation - Stylish Icon for better LCP */}
        <div className="flex justify-center md:justify-end w-full md:w-auto">
          <div className="relative w-[120px] h-[120px] md:w-[140px] md:h-[140px] flex items-center justify-center">
            {/* Animated gradient ring */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-purple-500/30 to-cyan-500/30 rounded-full animate-pulse" />
            <div className="absolute inset-1 bg-gradient-to-br from-primary/20 via-purple-500/20 to-cyan-500/20 rounded-full animate-spin" style={{animationDuration: '8s'}} />
            <div className="absolute inset-3 bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 rounded-full shadow-xl border border-slate-200 dark:border-slate-700" />
            {/* Sparkles Icon with glow effect */}
            <div className="relative">
              <div className="absolute inset-0 blur-md">
                <Sparkles className="w-12 h-12 md:w-14 md:h-14 text-primary" />
              </div>
              <Sparkles className="relative w-12 h-12 md:w-14 md:h-14 text-primary drop-shadow-lg animate-pulse" style={{animationDuration: '2s'}} />
            </div>
          </div>
        </div>
      </div>

      {/* News Slider Section - Single Card Fade */}
      {newsItems.length > 0 && (
        <div className="mb-6">
          {/* Compact News Banner */}
          <Link
            to={`/news/${newsItems[currentNewsIndex]?.slug}`}
            className="group block relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
          >
            {/* Gradient Top Line */}
            <div className={`h-1 w-full bg-gradient-to-r ${getCategoryColor(newsItems[currentNewsIndex]?.category)}`} />
            
            <div className="p-4 flex items-center gap-4">
              {/* News Icon */}
              <div className={`flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br ${getCategoryColor(newsItems[currentNewsIndex]?.category)} shadow-lg`}>
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${getCategoryColor(newsItems[currentNewsIndex]?.category)} text-white`}>
                    {newsItems[currentNewsIndex]?.category || "News"}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {new Date(newsItems[currentNewsIndex]?.publishedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })}
                  </span>
                  {newsItems[currentNewsIndex]?.featured && (
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                  {newsItems[currentNewsIndex]?.title}
                </h3>
              </div>
              
              {/* Navigation & Link */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Dots */}
                <div className="hidden sm:flex items-center gap-1">
                  {newsItems.slice(0, 5).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentNewsIndex(idx);
                      }}
                      className={`rounded-full transition-all ${
                        idx === currentNewsIndex 
                          ? "w-4 h-1.5 bg-primary" 
                          : "w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>
                
                {/* Arrows */}
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      prevNews();
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      nextNews();
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
                
                {/* All News Link */}
                <span className="hidden sm:flex items-center gap-1 text-xs text-primary font-semibold group-hover:underline">
                  Lesen <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Dual Student Status Widget - Enhanced */}
      <div className="mb-8 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />

        <div className="relative z-10">
          {/* Top Section: Current Phase + Progress */}
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center mb-6">
            {/* Left: Status & Progress */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2.5 rounded-xl ${statusConfig.bg} ${statusConfig.text} ring-1 ${statusConfig.ring}`}
                >
                  {currentStatus === "praxis" ? (
                    <Briefcase className="w-5 h-5" />
                  ) : currentStatus === "klausurphase" ? (
                    <ClipboardCheck className="w-5 h-5" />
                  ) : (
                    <BookMarked className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {statusConfig.label}
                    </h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      Aktuell
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(currentBlock?.start || "").toLocaleDateString(
                      "de-DE",
                      { day: "2-digit", month: "short" }
                    )}
                    {" – "}
                    {new Date(currentBlock?.end || "").toLocaleDateString(
                      "de-DE",
                      { day: "2-digit", month: "short", year: "numeric" }
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-700 dark:text-slate-300">
                    Phasen-Fortschritt
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {Math.round(phaseProgress)}%
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-500 dark:to-blue-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${phaseProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>
                    Tag {Math.ceil(phaseTotalDays - phaseDaysLeft)} von{" "}
                    {phaseTotalDays}
                  </span>
                  <span className="font-medium">Noch {phaseDaysLeft} Tage</span>
                </div>
              </div>
            </div>

            {/* Right: Next Phase & Quick Action */}
            <div className="w-full lg:w-auto lg:min-w-[280px] flex flex-col gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Nächste Phase
                </p>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">
                      {nextBlock
                        ? STUDY_PLANS[0].paletteOverrides?.[nextBlock.status]
                            ?.label || DEFAULT_PALETTE[nextBlock.status].label
                        : t.semesterEnd}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.from}{" "}
                      {nextBlock
                        ? new Date(nextBlock.start).toLocaleDateString(language === "de" ? "de-DE" : "en-US")
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {currentStatus === "praxis" && (
                <Link
                  to="/praxisbericht2"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-700 dark:hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-95"
                >
                  <FileText className="w-4 h-4" />
                  {t.writePraxisReport}
                </Link>
              )}
              {(currentStatus === "theoriephase" ||
                currentStatus === "vorlesung") && (
                <Link
                  to="/courses/schedule"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-750 transition-all active:scale-95"
                >
                  <CalendarDays className="w-4 h-4" />
                  {t.viewSchedule}
                </Link>
              )}
            </div>
          </div>

          {/* Bottom Section: Company Info + Praxis Hours (only in praxis phase) */}
          {currentStatus === "praxis" && (
            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              {/* Company Info Card */}
              {companyInfo ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Praxispartner
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {companyInfo.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {companyInfo.department}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <Users className="w-3.5 h-3.5" />
                      <span>Betreuer: {companyInfo.supervisor}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {companyInfo.email && (
                        <a
                          href={`mailto:${companyInfo.email}`}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                        >
                          <Mail className="w-3 h-3" />
                          E-Mail
                        </a>
                      )}
                      {companyInfo.phone && (
                        <a
                          href={`tel:${companyInfo.phone}`}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          Anrufen
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="w-4 h-4 text-slate-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Praxispartner
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Kein Praxispartner hinterlegt. Bitte ergänze deine Daten in
                    den Einstellungen.
                  </p>
                </div>
              )}

              {/* Praxis Hours Tracker */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Praxisstunden
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {praxisProgress}%
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400">
                        Erfasst
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {praxisHours.logged} / {praxisHours.required} Std.
                      </span>
                    </div>
                    <div className="h-2 bg-emerald-100 dark:bg-emerald-800/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                        style={{ width: `${praxisProgress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">
                        Diese Woche:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {praxisHours.thisWeek}h
                      </span>
                    </div>
                    <span
                      className={`font-medium ${praxisHours.thisWeek >= praxisHours.targetPerWeek ? "text-emerald-600" : "text-orange-500"}`}
                    >
                      Ziel: {praxisHours.targetPerWeek}h
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Schedule Overview - New Section */}
      <div className="mb-8 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
              <CalendarDays className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Wochenübersicht
            </h2>
          </div>
          <Link
            to="/courses/schedule"
            className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 inline-flex items-center gap-1"
          >
            Vollständiger Plan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {weekDays.map((day, idx) => (
            <div
              key={idx}
              className={`relative p-3 rounded-xl border transition-all ${
                day.isToday
                  ? "bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700 ring-2 ring-purple-200 dark:ring-purple-800"
                  : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <div className="text-center mb-2">
                <p
                  className={`text-xs font-medium ${day.isToday ? "text-purple-600 dark:text-purple-400" : "text-slate-500 dark:text-slate-400"}`}
                >
                  {day.dayName}
                </p>
                <p
                  className={`text-lg font-bold ${day.isToday ? "text-purple-700 dark:text-purple-300" : "text-slate-900 dark:text-white"}`}
                >
                  {day.dayNum}
                </p>
                {day.isToday && (
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-600 text-white mt-1">
                    HEUTE
                  </span>
                )}
              </div>
              <div className="space-y-1.5 min-h-[60px]">
                {day.events.length === 0 ? (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center italic">
                    Keine Termine
                  </p>
                ) : (
                  day.events.slice(0, 2).map((event, eIdx) => (
                    <div
                      key={eIdx}
                      className={`p-1.5 rounded text-[10px] ${
                        event.type === "Vorlesung"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : event.type === "Workshop"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                      }`}
                    >
                      <p className="font-medium truncate">{event.time}</p>
                      <p className="truncate opacity-80">
                        {event.title.split(" - ")[0]}
                      </p>
                    </div>
                  ))
                )}
                {day.events.length > 2 && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
                    +{day.events.length - 2} mehr
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => {
          const gradientClasses = {
            blue: "from-blue-500 to-indigo-600",
            orange: "from-orange-500 to-amber-600",
            purple: "from-purple-500 to-pink-600",
            green: "from-emerald-500 to-teal-600",
          };

          const bgClasses = {
            blue: "bg-blue-50/50 dark:bg-transparent border-blue-200 dark:border-blue-800",
            orange:
              "bg-orange-50/50 dark:bg-transparent border-orange-200 dark:border-orange-800",
            purple:
              "bg-purple-50/50 dark:bg-transparent border-purple-200 dark:border-purple-800",
            green:
              "bg-emerald-50/50 dark:bg-transparent border-emerald-200 dark:border-emerald-800",
          };

          const textClasses = {
            blue: "text-blue-700 dark:text-blue-300",
            orange: "text-orange-700 dark:text-orange-300",
            purple: "text-purple-700 dark:text-purple-300",
            green: "text-emerald-700 dark:text-emerald-300",
          };

          return (
            <Link
              key={idx}
              to={stat.link}
              className={`group relative overflow-hidden rounded-2xl border p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ${bgClasses[stat.color as keyof typeof bgClasses]}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${gradientClasses[stat.color as keyof typeof gradientClasses]} text-white shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full bg-white/80 dark:bg-black/20 border border-white/50 dark:border-white/10 backdrop-blur-sm ${textClasses[stat.color as keyof typeof textClasses]}`}
                >
                  {stat.change}
                </span>
              </div>
              <div
                className={`text-3xl font-black ${textClasses[stat.color as keyof typeof textClasses]} mb-1`}
              >
                {stat.value}
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {stat.label}
              </div>

              {/* Bottom Edge Glow Effect - Matches user image */}
              <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/50" />
              <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[2px] dark:via-white/80" />

              {/* Subtle background gradient blob */}
              <div
                className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br ${gradientClasses[stat.color as keyof typeof gradientClasses]} opacity-5 blur-2xl rounded-full group-hover:opacity-10 transition-opacity`}
              />
            </Link>
          );
        })}
      </div>

      {/* Campus + News row under stats (4 equal cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Campus card */}
        <Link
          to={campusStat.link}
          className="group relative overflow-hidden rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-transparent p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${campusStat.bgGradient} text-white shadow-lg group-hover:shadow-xl transition-shadow`}
            >
              <campusStat.icon className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/80 dark:bg-black/20 border border-white/50 dark:border-white/10 backdrop-blur-sm text-blue-700 dark:text-blue-300">
              Räume
            </span>
          </div>
          <div className="text-2xl font-black text-blue-700 dark:text-blue-300 mb-1">
            Campus
          </div>
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {user?.campusArea || "Raumbuchung am Campus"}
          </div>

          {/* Bottom Edge Glow Effect */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/50" />
          <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[2px] dark:via-white/80" />

          {/* Decorative gradient blob */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-opacity" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white/60 backdrop-blur-md dark:bg-slate-950/60 border border-white/50 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Heute
                </h2>
              </div>
              <Link
                to="/courses/schedule"
                className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1"
              >
                Alle anzeigen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {todayClasses.length > 0 ? (
              <div className="space-y-3">
                {todayClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border-l-4 ${
                      cls.color === "blue"
                        ? "bg-blue-50/50 dark:bg-blue-950/30 border-blue-500"
                        : cls.color === "purple"
                          ? "bg-purple-50/50 dark:bg-purple-950/30 border-purple-500"
                          : "bg-green-50/50 dark:bg-green-950/30 border-green-500"
                    } hover:shadow-md transition-shadow`}
                  >
                    <div
                      className={`p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm ${
                        cls.color === "blue"
                          ? "text-blue-600"
                          : cls.color === "purple"
                            ? "text-purple-600"
                            : "text-green-600"
                      }`}
                    >
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                          {cls.title}
                        </h3>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            cls.color === "blue"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                              : cls.color === "purple"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                                : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                          }`}
                        >
                          {cls.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {cls.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {cls.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {cls.professor}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <CalendarDays className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">Keine Termine für heute</p>
              </div>
            )}
          </div>

          {/* Upcoming Assignments */}
          <div className="bg-white/60 backdrop-blur-md dark:bg-slate-950/60 border border-white/50 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Bevorstehende Aufgaben
                </h2>
              </div>
              <Link
                to="/tasks"
                className="text-sm font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 inline-flex items-center gap-1"
              >
                Alle anzeigen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border ${
                    assignment.priority === "high"
                      ? "bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50"
                      : "bg-slate-50/50 border-slate-200 dark:bg-slate-900/30 dark:border-slate-800"
                  } hover:shadow-md transition-shadow`}
                >
                  <button
                    onClick={() => {
                      // Toggle completion
                    }}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {assignment.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
                    {/* Left column: task info */}
                    <div>
                      <div className="flex items-start gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                          {assignment.title}
                        </h3>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                        <span>{assignment.course}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700">
                          {assignment.workType}
                        </span>
                      </div>
                    </div>

                    {/* Right column: due / exam date */}
                    <div className="text-right text-xs min-w-[120px]">
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mb-1 ${
                          assignment.kind === "Klausurtermin"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        <Calendar className="h-3 w-3" />
                        <span>
                          {assignment.kind === "Klausurtermin"
                            ? "Klausurtermin"
                            : "Abgabe"}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {assignment.dueDate}
                      </div>
                      <div
                        className={`mt-1 font-bold ${
                          assignment.daysLeft === 0
                            ? "text-red-600 dark:text-red-400"
                            : assignment.daysLeft <= 3
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {assignment.daysLeft === 0
                          ? "Heute!"
                          : assignment.daysLeft < 0
                            ? "Überfällig"
                            : `In ${assignment.daysLeft} Tagen`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zuletzt besuchte Kurse Section */}
          <div className="bg-white/60 backdrop-blur-md dark:bg-slate-950/60 border border-white/50 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 border border-blue-200 dark:bg-blue-900/50 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                  <History className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Zuletzt besuchte Kurse
                </h2>
              </div>
              <Link
                to="/courses"
                className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1"
              >
                Alle Kurse
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentCourses.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium">
                    Noch keine Kurse besucht
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    Öffne einen Kurs, um ihn hier zu sehen
                  </p>
                  <Link
                    to="/courses"
                    className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                  >
                    Kurse entdecken
                  </Link>
                </div>
              ) : (
                recentCourses.map((course) => {
                  const timeSince = Date.now() - course.visitedAt;
                  const hoursAgo = Math.floor(timeSince / (1000 * 60 * 60));
                  const daysAgo = Math.floor(timeSince / (1000 * 60 * 60 * 24));

                  let timeText = "Gerade eben";
                  if (hoursAgo < 1) {
                    const minutesAgo = Math.floor(timeSince / (1000 * 60));
                    timeText =
                      minutesAgo < 1 ? "Gerade eben" : `Vor ${minutesAgo} Min.`;
                  } else if (hoursAgo < 24) {
                    timeText = `Vor ${hoursAgo} Std.`;
                  } else if (daysAgo === 1) {
                    timeText = "Gestern";
                  } else if (daysAgo < 7) {
                    timeText = `Vor ${daysAgo} Tagen`;
                  } else {
                    timeText = new Date(course.visitedAt).toLocaleDateString(
                      "de-DE"
                    );
                  }

                  const colorClasses = {
                    blue: "bg-blue-50/50 border-blue-200 hover:border-blue-300 dark:bg-blue-950/30 dark:border-blue-800 dark:hover:border-blue-700",
                    purple:
                      "bg-purple-50/50 border-purple-200 hover:border-purple-300 dark:bg-purple-950/30 dark:border-purple-800 dark:hover:border-purple-700",
                    green:
                      "bg-green-50/50 border-green-200 hover:border-green-300 dark:bg-green-950/30 dark:border-green-800 dark:hover:border-green-700",
                    orange:
                      "bg-orange-50/50 border-orange-200 hover:border-orange-300 dark:bg-orange-950/30 dark:border-orange-800 dark:hover:border-orange-700",
                    pink: "bg-pink-50/50 border-pink-200 hover:border-pink-300 dark:bg-pink-950/30 dark:border-pink-800 dark:hover:border-pink-700",
                    indigo:
                      "bg-indigo-50/50 border-indigo-200 hover:border-indigo-300 dark:bg-indigo-950/30 dark:border-indigo-800 dark:hover:border-indigo-700",
                  };

                  const iconColorClasses = {
                    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
                    purple:
                      "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
                    green:
                      "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
                    orange:
                      "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
                    pink: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
                    indigo:
                      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
                  };

                  const courseQuery = new URLSearchParams({
                    selectedCourseId: String(course.id),
                  }).toString();

                  return (
                    <Link
                      key={course.id}
                      to={`/courses?${courseQuery}`}
                      className={`block border rounded-xl p-4 transition-all hover:shadow-md ${
                        colorClasses[
                          course.color as keyof typeof colorClasses
                        ] || colorClasses.blue
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            iconColorClasses[
                              course.color as keyof typeof iconColorClasses
                            ] || iconColorClasses.blue
                          }`}
                        >
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 truncate">
                            {course.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            {course.studiengang && (
                              <>
                                <span className="truncate">
                                  {course.studiengang}
                                </span>
                                {course.semester && <span>•</span>}
                              </>
                            )}
                            {course.semester && <span>{course.semester}</span>}
                          </div>
                          <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="h-3 w-3" />
                            <span>{timeText}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0 mt-1" />
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-950/80 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Schnellzugriff
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, idx) => {
                const colorClasses = {
                  blue: {
                    border: "hover:border-blue-500 dark:hover:border-blue-400",
                    bg: "bg-blue-100 dark:bg-blue-900/30",
                    text: "text-blue-600 dark:text-blue-400",
                  },
                  purple: {
                    border:
                      "hover:border-purple-500 dark:hover:border-purple-400",
                    bg: "bg-purple-100 dark:bg-purple-900/30",
                    text: "text-purple-600 dark:text-purple-400",
                  },
                  orange: {
                    border:
                      "hover:border-orange-500 dark:hover:border-orange-400",
                    bg: "bg-orange-100 dark:bg-orange-900/30",
                    text: "text-orange-600 dark:text-orange-400",
                  },
                  green: {
                    border:
                      "hover:border-green-500 dark:hover:border-green-400",
                    bg: "bg-green-100 dark:bg-green-900/30",
                    text: "text-green-600 dark:text-green-400",
                  },
                  indigo: {
                    border:
                      "hover:border-indigo-500 dark:hover:border-indigo-400",
                    bg: "bg-indigo-100 dark:bg-indigo-900/30",
                    text: "text-indigo-600 dark:text-indigo-400",
                  },
                  pink: {
                    border: "hover:border-pink-500 dark:hover:border-pink-400",
                    bg: "bg-pink-100 dark:bg-pink-900/30",
                    text: "text-pink-600 dark:text-pink-400",
                  },
                };
                type ColorKey = keyof typeof colorClasses;
                const colorKey: ColorKey =
                  (action.color as ColorKey) in colorClasses
                    ? (action.color as ColorKey)
                    : "blue";
                const classes = colorClasses[colorKey];

                // Use regular <a> tag for external links
                if (action.external) {
                  return (
                    <a
                      key={idx}
                      href={action.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 ${classes.border} hover:shadow-lg transition-all duration-200`}
                    >
                      <div
                        className={`p-2 rounded-lg ${classes.bg} w-fit mb-2 group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className={`h-5 w-5 ${classes.text}`} />
                      </div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {action.label}
                      </div>
                    </a>
                  );
                } else {
                  return (
                    <Link
                      key={idx}
                      to={action.link}
                      className={`group p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 ${classes.border} hover:shadow-lg transition-all duration-200`}
                    >
                      <div
                        className={`p-2 rounded-lg ${classes.bg} w-fit mb-2 group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className={`h-5 w-5 ${classes.text}`} />
                      </div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {action.label}
                      </div>
                    </Link>
                  );
                }
              })}
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-white/40 backdrop-blur-xl dark:bg-slate-950/80 border border-white/40 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Studienfortschritt
              </h2>
            </div>
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  72%
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  abgeschlossen
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  style={{ width: "72%" }}
                />
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Du bist auf einem guten Weg! Weiter so! 🎉
            </p>
            <Link
              to="/curriculum"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition-colors"
            >
              Details anzeigen <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Recommendation Card */}
          <div className="bg-white/40 backdrop-blur-xl dark:bg-slate-950/80 border border-white/40 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-16 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  STUDIEN EMPFEHLEN
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Empfehle die IU und erhalte{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    bis zu 200€
                  </span>{" "}
                  als Dankeschön!
                </p>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm">
                  Bonus abholen
                </button>
              </div>
            </div>
          </div>

          {/* Exam Guide */}
          <div className="bg-white/40 backdrop-blur-xl dark:bg-slate-950/80 border border-white/40 dark:border-slate-800 rounded-2xl p-6">
            <div className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Prüfungs-Guide
            </div>
            <div className="h-32 rounded-xl bg-gradient-to-br from-orange-200 to-amber-300 dark:from-orange-900/30 dark:to-amber-900/30 mb-4" />
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Hier findest Du alle relevanten Infos zu Deinen Prüfungen.
            </p>
          </div>
        </div>
      </div>
      {/* Onboarding für Erstis - nur anzeigen wenn semester === 1 aus der Datenbank */}
      <FirstSemesterOnboarding
        isFirstSemester={isFirstSemester}
        onComplete={() => {
          console.log("✅ Onboarding abgeschlossen!");
        }}
      />
    </div>
  );
}







