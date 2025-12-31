import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import FirstSemesterOnboarding from "~/components/FirstSemesterOnboarding";
import { useLanguage } from "~/contexts/LanguageContext";
import { ensureCanonicalTasks } from "~/lib/tasks.server";
import { getRecentCourses } from "~/lib/recentCourses";
import { getStudyPlanByStudiengang } from "~/lib/studyPlans";
import { TRANSLATIONS } from "~/constants/dashboard";

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
  LayoutGrid,
  Activity,
} from "lucide-react";
import { STUDY_PLANS, DEFAULT_PALETTE, toISODate } from "~/lib/studyPlans";
import { calculateDaysLeft } from "~/lib/tasksSample";
import { prisma } from "~/lib/prisma";
import { useLoaderData } from "react-router";
import { ACTIVE_COURSES_COUNT } from "~/lib/coursesMeta";
import type {
  DashboardTask,
  PraxisPartnerData,
  PraxisHoursData,
  ScheduleEventData,
  DashboardLoaderData,
  RecentCourse,
} from "~/types/dashboard";

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
  let studiengangName: string | null = null;
  let newsItems: DashboardLoaderData["newsItems"] = [];
  let userId: number | undefined;

  try {
    // Get logged-in user from session
    const cookieHeader = request.headers.get("Cookie") || "";
    const sessionToken = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("session="))
      ?.split("=")[1];

    let loggedInUser: {
      id: number;
      semester: number;
      totalSemesters: number;
      name: string | null;
    } | null = null;

    // 1. Try to get user from session
    if (sessionToken) {
      const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: {
          user: {
            select: {
              id: true,
              semester: true,
              totalSemesters: true,
              name: true,
              studiengang: {
                select: { name: true },
              },
            },
          },
        },
      });
      if (session?.user) {
        loggedInUser = session.user;
        userId = session.user.id;
      }
    }

    // 2. Fallback to Sabin ONLY if no session found (Dev mode / Fallback)
    if (!loggedInUser) {
      const sabinUser = await prisma.user.findUnique({
        where: { email: "sabin.elanwar@iu-study.org" },
        select: {
          id: true,
          semester: true,
          totalSemesters: true,
          name: true,
          studiengang: {
            select: { name: true },
          },
        },
      });
      if (sabinUser) {
        loggedInUser = sabinUser;
        userId = sabinUser.id;
      }
    }

    // 3. Last resort fallback
    if (!loggedInUser) {
      loggedInUser = await prisma.user.findFirst({
        select: {
          id: true,
          semester: true,
          totalSemesters: true,
          name: true,
          studiengang: {
            select: { name: true },
          },
        },
      });
      if (loggedInUser) {
        userId = loggedInUser.id;
      }
    }

    const userSemester = loggedInUser?.semester ?? 1;
    isFirstSemester = userSemester === 1;
    userName = loggedInUser?.name || "Student";
    userCampusArea = (loggedInUser as any)?.campusArea || null;
    studiengangName = (loggedInUser as any)?.studiengang?.name || null;

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
      userId
        ? await (async () => {
            // Ensure tasks exist for this user before fetching
            await ensureCanonicalTasks(userId);
            return prisma.studentTask.findMany({
              where: { userId },
              orderBy: { dueDate: "asc" },
              take: 6,
            });
          })()
        : [],
      userId ? prisma.studentTask.count({ where: { userId } }) : 0,
      // Praxis Partner
      userId ? prisma.praxisPartner.findUnique({ where: { userId } }) : null,
      // Hours Target
      userId
        ? prisma.praxisHoursTarget.findUnique({ where: { userId } })
        : null,
      // Total Hours
      userId
        ? prisma.praxisHoursLog.aggregate({
            where: { userId },
            _sum: { hours: true },
          })
        : { _sum: { hours: 0 } },
      // Week Hours
      userId
        ? prisma.praxisHoursLog.aggregate({
            where: { userId, date: { gte: startOfWeek } },
            _sum: { hours: true },
          })
        : { _sum: { hours: 0 } },
      // Schedule Events
      userId
        ? prisma.scheduleEvent.findMany({
            where: { userId, date: { gte: today, lt: endDate } },
            orderBy: [{ date: "asc" }, { startTime: "asc" }],
          })
        : [],
      // Marks for average grade - filtered by user
      userId
        ? prisma.mark.findMany({ where: { userId }, select: { value: true } })
        : [],
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
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
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
    studiengangName,
    newsItems,
    userId, // Return userId for client-side storage keys
  };
};

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
    studiengangName,
    newsItems,
    userId, // Get userId from loader
  } = useLoaderData() as DashboardLoaderData;

  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  // Use server-loaded user data directly - no client fetch needed!
  const user = { name: userName, campusArea: userCampusArea };

  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const navigate = useNavigate();

  // Only load recent courses on client (localStorage access) - user specific!
  useEffect(() => {
    if (userId) {
      setRecentCourses(getRecentCourses(6, userId));
    }
  }, [userId]);

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
    setCurrentNewsIndex(
      (prev) => (prev - 1 + newsItems.length) % newsItems.length
    );
  };

  const getCategoryColor = (category?: string | null) => {
    const key = (category || "").toLowerCase();
    if (key.includes("exam")) return "from-iu-orange to-iu-red";
    if (key.includes("it") || key.includes("tech"))
      return "from-iu-purple to-iu-pink";
    if (key.includes("scholar")) return "from-iu-green to-iu-blue";
    if (key.includes("library")) return "from-iu-purple to-iu-blue";
    if (key.includes("career")) return "from-iu-blue to-iu-purple";
    if (key.includes("academic") || key.includes("module"))
      return "from-iu-blue to-iu-purple";
    return "from-primary to-iu-purple";
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
      bgGradient: "from-iu-blue to-iu-blue/80",
      link: "/courses",
    },
    {
      label: t.tasks,
      value: String(tasksTotal ?? 0),
      change: `5 ${t.due}`,
      icon: CheckSquare,
      color: "orange",
      bgGradient: "from-iu-orange to-iu-orange/80",
      link: "/tasks",
    },
    {
      label: t.todayAppointments,
      value: "3",
      change: t.appointments,
      icon: CalendarDays,
      color: "purple",
      bgGradient: "from-iu-purple to-iu-purple/80",
      link: "/courses/schedule",
    },
    {
      label: t.avgGrade,
      value: averageGrade ? averageGrade.toFixed(1) : "-",
      change: t.average,
      icon: Award,
      color: "green",
      bgGradient: "from-iu-green to-iu-green/80",
      link: "/notenverwaltung",
    },
  ];

  const bookingLink = user?.campusArea
    ? `/raumbuchung?campus=${encodeURIComponent(user.campusArea)}`
    : "/raumbuchung";

  // Dual Student Logic
  const currentPlan = getStudyPlanByStudiengang(
    studiengangName || userCampusArea
  );
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
    bgGradient: "from-iu-blue to-blue-600",
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
            ? language === "de"
              ? "Klausurtermin"
              : "Exam"
            : language === "de"
              ? "Abgabe"
              : "Submission",
        dueDate: new Date(task.dueDate).toLocaleDateString(
          language === "de" ? "de-DE" : "en-US"
        ),
        daysLeft,
        color: task.kind === "KLAUSUR" ? "blue" : "orange",
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
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 md:gap-10 pb-6 sm:pb-8 border-b border-border/10 mb-6 sm:mb-8 md:mb-12">
        <div className="flex-1 space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight mb-2 sm:mb-4">
              {getGreeting()},{" "}
              <span className="text-iu-blue">{userName.split(" ")[0]}</span>{" "}
              <span className="inline-block animate-wave origin-[70%_70%]">
                👋
              </span>
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm font-medium max-w-2xl leading-relaxed">
              {t.overview}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link
              to="/benefits"
              className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-iu-blue text-white font-bold text-sm sm:text-base hover:opacity-90 transition-all shadow-xl shadow-iu-blue/20 active:scale-95 group"
            >
              {t.studentBenefits}
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Greeting Animation - Stylish Icon for better LCP */}
        <div className="hidden sm:flex justify-center md:justify-end w-full md:w-auto">
          <div className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[160px] md:h-[160px] flex items-center justify-center">
            {/* Animated gradient ring */}
            <div className="absolute inset-0 bg-gradient-to-br from-iu-blue/30 via-iu-purple/30 to-iu-pink/30 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] animate-pulse blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-iu-blue/20 via-iu-purple/20 to-iu-pink/20 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] animate-spin-slow animate-duration-15s" />
            <div className="absolute inset-2 sm:inset-3 md:inset-4 bg-card rounded-[1.2rem] sm:rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-border flex items-center justify-center backdrop-blur-3xl">
              {/* Sparkles Icon with glow effect */}
              <div className="relative">
                <div className="absolute inset-0 blur-2xl opacity-40 bg-iu-blue rounded-full"></div>
                <Sparkles className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-iu-blue drop-shadow-[0_0_20px_rgba(36,94,235,0.5)] animate-bounce-slow" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Slider Section - Single Card Fade */}
      {newsItems.length > 0 && (
        <div className="mb-6 sm:mb-8 md:mb-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
              <Newspaper className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground flex items-center gap-2 sm:gap-3">
              {language === "de" ? "Aktuelle News" : "Latest News"}
            </h3>
          </div>
          {/* Compact News Banner */}
          <Link
            to={`/news/${newsItems[currentNewsIndex]?.slug}`}
            className="group block relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-border bg-card/60 backdrop-blur-xl hover:bg-card hover:border-iu-blue/30 hover:shadow-2xl transition-all duration-500"
          >
            {/* Gradient Top Line */}
            <div
              className={`h-1 w-full bg-gradient-to-r ${getCategoryColor(newsItems[currentNewsIndex]?.category)}`}
            />

            <div className="p-3 sm:p-4 md:p-5 flex items-center gap-2 sm:gap-4 md:gap-6">
              {/* News Icon */}
              <div
                className={`flex-shrink-0 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${getCategoryColor(newsItems[currentNewsIndex]?.category)} shadow-xl`}
              >
                <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-0.5 sm:mb-1">
                  <span
                    className={`px-1.5 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${getCategoryColor(newsItems[currentNewsIndex]?.category)} text-white shadow-sm`}
                  >
                    {newsItems[currentNewsIndex]?.category || "News"}
                  </span>
                  <span className="hidden sm:block text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
                    {new Date(
                      newsItems[currentNewsIndex]?.publishedAt
                    ).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "long",
                    })}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-amber-500 transition-colors">
                  {newsItems[currentNewsIndex]?.title}
                </h3>
              </div>

              {/* Navigation & Link */}
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                {/* Dots */}
                <div className="hidden lg:flex items-center gap-1.5">
                  {newsItems.slice(0, 5).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentNewsIndex(idx);
                      }}
                      className={`rounded-full transition-all duration-300 ${
                        idx === currentNewsIndex
                          ? "w-8 h-2 bg-iu-blue"
                          : "w-2 h-2 bg-muted hover:bg-muted-foreground/50"
                      }`}
                    />
                  ))}
                </div>

                {/* Arrows */}
                <div className="flex gap-1 sm:gap-1.5">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      prevNews();
                    }}
                    className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-muted border border-border hover:bg-iu-blue hover:text-white hover:border-iu-blue transition-all active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      nextNews();
                    }}
                    className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-muted border border-border hover:bg-iu-blue hover:text-white hover:border-iu-blue transition-all active:scale-95"
                  >
                    <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* All News Link */}
                <span className="hidden sm:flex items-center gap-2 text-xs text-iu-blue font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  LESEN <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}
      {/* Quick Actions Section */}
      <div className="mb-6 sm:mb-8 md:mb-12">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-iu-purple/10 text-iu-purple shadow-sm border border-iu-purple/10">
            <LayoutGrid className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground flex items-center gap-2 sm:gap-3">
            {t.quickActions}
          </h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-6">
          {quickActions.map((action, idx) => {
            const colorClasses = {
              blue: {
                border: "hover:border-iu-blue/40 hover:bg-iu-blue/5",
                bg: "bg-iu-blue/10",
                text: "text-iu-blue",
              },
              purple: {
                border: "hover:border-iu-purple/40 hover:bg-iu-purple/5",
                bg: "bg-iu-purple/10",
                text: "text-iu-purple",
              },
              orange: {
                border: "hover:border-iu-orange/40 hover:bg-iu-orange/5",
                bg: "bg-iu-orange/10",
                text: "text-iu-orange",
              },
              green: {
                border: "hover:border-iu-blue/40 hover:bg-iu-blue/5",
                bg: "bg-iu-blue/10",
                text: "text-iu-blue dark:text-iu-blue",
              },
              indigo: {
                border: "hover:border-iu-blue/40 hover:bg-iu-blue/5",
                bg: "bg-iu-blue/10",
                text: "text-iu-blue",
              },
              pink: {
                border: "hover:border-iu-pink/40 hover:bg-iu-pink/5",
                bg: "bg-iu-pink/10",
                text: "text-iu-pink",
              },
            };
            type ColorKey = keyof typeof colorClasses;
            const colorKey: ColorKey =
              (action.color as ColorKey) in colorClasses
                ? (action.color as ColorKey)
                : "blue";
            const classes = colorClasses[colorKey];

            return (
              <Link
                key={idx}
                to={action.link}
                className={`group p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-border bg-card/60 backdrop-blur-xl ${classes.border} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center`}
              >
                <div
                  className={`p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl ${classes.bg} mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform shadow-sm`}
                >
                  <action.icon
                    className={`h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 ${classes.text}`}
                  />
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-xs font-black text-foreground uppercase tracking-wider sm:tracking-widest md:tracking-[0.2em] leading-tight">
                  {action.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Dual Student Status Widget - Enhanced */}
      <div className="mb-6 sm:mb-8 md:mb-12">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-iu-pink/10 text-iu-pink shadow-sm border border-iu-pink/10">
            <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground flex items-center gap-2 sm:gap-3">
            {language === "de" ? "Studienverlauf" : "Study Progress"}
          </h3>
        </div>
        <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-border bg-card/40 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-iu-blue/10 to-transparent rounded-full -mr-24 -mt-24 transition-transform group-hover:scale-110 duration-1000 blur-3xl" />

          <div className="relative z-10">
            {/* Top Section: Current Phase + Progress */}
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 items-start lg:items-center mb-6 sm:mb-8 md:mb-10">
              {/* Left: Status & Progress */}
              <div className="flex-1 w-full space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-5">
                  <div
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${statusConfig.bg} ${statusConfig.text} shadow-lg ring-1 ${statusConfig.ring}`}
                  >
                    {currentStatus === "praxis" ? (
                      <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : currentStatus === "klausurphase" ? (
                      <ClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <BookMarked className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <h2 className="text-sm sm:text-base md:text-lg font-bold text-foreground tracking-tight italic opacity-50">
                        {statusConfig.label}
                      </h2>
                      <span
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-widest ${statusConfig.bg} ${statusConfig.text} border border-current/20`}
                      >
                        {t.current}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
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

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-0.5 sm:space-y-1">
                      <span className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest leading-none">
                        {t.phaseProgress}
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-foreground tabular-nums">
                        {Math.round(phaseProgress)}%
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-iu-blue uppercase tracking-widest">
                      {t.daysLeft} {phaseDaysLeft} {t.days}
                    </span>
                  </div>
                  <div className="h-3 sm:h-4 w-full bg-muted border border-border/50 rounded-full overflow-hidden p-0.5 sm:p-1">
                    <div
                      className="h-full bg-iu-blue rounded-full progress-bar shadow-[0_0_15px_rgba(36,94,235,0.4)]"
                      style={{ width: `${phaseProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                    <span>
                      {t.day} {Math.ceil(phaseTotalDays - phaseDaysLeft)} {t.of}{" "}
                      {phaseTotalDays}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Next Phase & Quick Action */}
              <div className="w-full lg:w-auto lg:min-w-[280px] sm:lg:min-w-[320px] flex flex-col gap-4 sm:gap-5 border-t lg:border-t-0 lg:border-l border-border pt-6 sm:pt-8 lg:pt-0 lg:pl-8 md:lg:pl-10">
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    {t.nextPhase}
                  </p>
                  <div className="flex items-center gap-3 sm:gap-4 bg-muted/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-card border border-border text-iu-blue shadow-sm">
                      <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-xs sm:text-sm uppercase tracking-tight">
                        {nextBlock
                          ? STUDY_PLANS[0].paletteOverrides?.[nextBlock.status]
                              ?.label || DEFAULT_PALETTE[nextBlock.status].label
                          : t.semesterEnd}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold">
                        {t.from}{" "}
                        {nextBlock
                          ? new Date(nextBlock.start).toLocaleDateString(
                              language === "de" ? "de-DE" : "en-US",
                              { day: "2-digit", month: "long" }
                            )
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {currentStatus === "praxis" ? (
                  <Link
                    to="/praxisbericht2"
                    className="flex items-center justify-center gap-2 sm:gap-3 w-full py-3 sm:py-4 md:py-5 px-4 sm:px-6 bg-foreground text-background rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:opacity-90 transition-all shadow-xl active:scale-95"
                  >
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t.writePraxisReport}
                  </Link>
                ) : (
                  <Link
                    to="/courses/schedule"
                    className="flex items-center justify-center gap-2 sm:gap-3 w-full py-3 sm:py-4 md:py-5 px-4 sm:px-6 bg-foreground text-background rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:opacity-90 transition-all shadow-xl active:scale-95"
                  >
                    <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t.viewSchedule}
                  </Link>
                )}
              </div>
            </div>

            {/* Bottom Section: Company Info + Praxis Hours (only in praxis phase) */}
            {currentStatus === "praxis" && (
              <div className="grid md:grid-cols-2 gap-8 pt-10 border-t border-border/50">
                {/* Company Info Card */}
                {companyInfo ? (
                  <div className="p-6 rounded-[2rem] bg-card/60 border border-border shadow-inner">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-iu-blue/10 text-iu-blue">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">
                          {t.praxisPartner}
                        </h3>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <p className="text-xl font-bold text-foreground leading-tight">
                          {companyInfo.name}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium mt-1">
                          {companyInfo.department}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-foreground/80 font-bold bg-muted/50 p-3 rounded-xl border border-border/50 w-fit">
                        <Users className="w-4 h-4 text-iu-blue" />
                        <span>
                          {t.supervisor}: {companyInfo.supervisor}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-4">
                        {companyInfo.email && (
                          <a
                            href={`mailto:${companyInfo.email}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-iu-blue text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-iu-blue/10"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            {language === "de"
                              ? "E-Mail schreiben"
                              : "Send E-Mail"}
                          </a>
                        )}
                        {companyInfo.phone && (
                          <a
                            href={`tel:${companyInfo.phone}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-xs font-bold uppercase tracking-widest text-foreground hover:bg-muted transition-all"
                          >
                            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                            {language === "de" ? "Anrufen" : "Call now"}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-[2rem] bg-card/60 border border-border text-center flex flex-col items-center justify-center py-10">
                    <Building2 className="w-12 h-12 text-muted-foreground/20 mb-4" />
                    <p className="text-base text-muted-foreground font-bold max-w-xs">
                      {language === "de"
                        ? "Kein Praxispartner hinterlegt"
                        : "No practice partner set"}
                    </p>
                  </div>
                )}

                {/* Praxis Hours Tracker */}
                <div className="p-6 rounded-[2rem] bg-iu-blue/5 border border-iu-blue/20 shadow-inner">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-iu-blue/10 text-iu-blue">
                        <Timer className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-black text-foreground tracking-tight">
                        {t.praxisHours}
                      </h3>
                    </div>
                    <div className="px-5 py-2 rounded-full bg-iu-blue text-white text-base font-black shadow-lg shadow-iu-blue/20">
                      {praxisProgress}%
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                          {t.hoursLogged}
                        </span>
                        <div className="text-2xl font-black text-foreground tabular-nums">
                          {praxisHours.logged}{" "}
                          <span className="text-muted-foreground font-bold text-sm">
                            / {praxisHours.required}h
                          </span>
                        </div>
                      </div>
                      <div className="h-4 bg-card border border-border/50 rounded-full overflow-hidden p-1">
                        <div
                          className="h-full bg-iu-blue rounded-full progress-bar shadow-[0_0_10px_rgba(36,94,235,0.3)]"
                          style={{ width: `${praxisProgress}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-card border border-border/50">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                          {t.thisWeek}
                        </p>
                        <p className="text-2xl font-black text-iu-blue">
                          {praxisHours.thisWeek}h
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-card border border-border/50">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                          {t.targetPerWeek}
                        </p>
                        <p className="text-2xl font-black text-foreground">
                          {praxisHours.targetPerWeek}h
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Schedule Overview - New Section */}
      <div className="mb-6 sm:mb-8 md:mb-12">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue dark:text-iu-blue shadow-sm border border-iu-blue/10">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground flex items-center gap-2 sm:gap-3">
            {t.weekOverview}
          </h3>
        </div>
        <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-border bg-card/60 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-end mb-6">
            <Link
              to="/courses/schedule"
              className="px-6 py-2.5 rounded-full bg-iu-blue/10 text-iu-blue hover:bg-iu-blue hover:text-white font-bold text-sm transition-all flex items-center gap-2 group/btn"
            >
              {t.showFullSchedule}
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="week-days-scroll">
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className={`relative p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl md:rounded-[2rem] border transition-all duration-300 min-w-[120px] sm:min-w-0 flex-shrink-0 ${
                  day.isToday
                    ? "bg-iu-blue/5 border-iu-blue/40 ring-2 sm:ring-4 ring-iu-blue/10 hover:bg-card shadow-xl"
                    : "bg-muted/40 border-border hover:border-iu-blue/20 hover:bg-card shadow-sm"
                }`}
              >
                <div className="text-center mb-2 sm:mb-4 space-y-0.5 sm:space-y-1">
                  <p
                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${day.isToday ? "text-iu-blue" : "text-muted-foreground"}`}
                  >
                    {day.dayName}
                  </p>
                  <p
                    className={`text-xl sm:text-2xl md:text-3xl font-black ${day.isToday ? "text-iu-blue" : "text-foreground"}`}
                  >
                    {day.dayNum}
                  </p>
                  {day.isToday && (
                    <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black bg-iu-blue text-white shadow-lg shadow-iu-blue/20">
                      {language === "de" ? "HEUTE" : "TODAY"}
                    </span>
                  )}
                </div>
                <div className="space-y-1 sm:space-y-1.5 min-h-[50px] sm:min-h-[60px]">
                  {day.events.length === 0 ? (
                    <p className="text-[10px] text-muted-foreground/60 text-center italic">
                      Keine Termine
                    </p>
                  ) : (
                    day.events.slice(0, 2).map((event, eIdx) => (
                      <div
                        key={eIdx}
                        className={`p-1.5 rounded-lg text-[10px] ${
                          event.type === "Vorlesung"
                            ? "bg-iu-blue/10 text-iu-blue"
                            : event.type === "Workshop"
                              ? "bg-iu-blue/10 text-iu-blue dark:text-iu-blue"
                              : "bg-iu-orange/10 text-iu-orange"
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
                    <p className="text-[10px] text-muted-foreground text-center">
                      +{day.events.length - 2} mehr
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid-container">
        {/* Row 1: Today's Schedule and Upcoming Tasks (2 columns) */}
        <div className="dashboard-row-top">
          {/* Today's Schedule - Creative Gradient */}
          {todayClasses.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
                  <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-foreground tracking-tight">
                  {language === "de" ? "Dein Zeitplan" : "Your Schedule"}
                </h2>
              </div>
              <div className="relative group overflow-hidden bg-card/40 backdrop-blur-xl border border-border rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-xl transition-all duration-500 hover:shadow-iu-blue/10 h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-iu-blue/10 blur-[100px] rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-125 duration-1000" />
                <div className="relative z-10 flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-iu-blue text-white shadow-[0_0_20px_rgba(36,94,235,0.3)] border border-iu-blue/50">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                  </div>
                  <Link
                    to="/courses/schedule"
                    className="p-2.5 rounded-full bg-muted/50 text-iu-blue hover:bg-iu-blue hover:text-white transition-all shadow-sm border border-border"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
                <div className="relative z-10 space-y-5">
                  {todayClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className={`flex items-start gap-5 p-6 rounded-[2rem] border transition-all duration-500 bg-card/40 hover:bg-card hover:shadow-xl group/item ${
                        cls.color === "blue" || cls.color === "purple"
                          ? "border-iu-blue/20 hover:border-iu-blue/40"
                          : "border-iu-blue/20 hover:border-iu-blue/40"
                      }`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl border shadow-lg group-hover:scale-110 transition-transform ${
                          cls.color === "blue" || cls.color === "purple"
                            ? "bg-iu-blue/10 border-iu-blue/20 text-iu-blue"
                            : "bg-iu-blue/10 border-iu-blue/20 text-iu-blue dark:text-iu-blue"
                        }`}
                      >
                        <Clock className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-foreground truncate group-hover/item:text-amber-500 transition-colors">
                            {cls.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                              cls.color === "blue" || cls.color === "purple"
                                ? "bg-iu-blue/10 border-iu-blue/20 text-iu-blue"
                                : "bg-iu-blue/10 border-iu-blue/20 text-iu-blue dark:text-iu-blue"
                            }`}
                          >
                            {cls.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
                          <span className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground/30" />
                            {cls.time}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-muted-foreground/30" />
                            {cls.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4 h-full">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
                  <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-foreground tracking-tight">
                  {language === "de" ? "Dein Zeitplan" : "Your Schedule"}
                </h2>
              </div>
              <div className="relative overflow-hidden bg-card/40 backdrop-blur-xl border border-border rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 h-[200px] sm:h-[250px] md:h-[300px] flex flex-col items-center justify-center text-center">
                <CalendarDays className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-muted-foreground/20 mb-2 sm:mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground font-medium italic">
                  {t.noClassesToday}
                </p>
              </div>
            </div>
          )}

          {/* Upcoming Assignments - Creative Gradient */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
              <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-orange/10 text-iu-orange shadow-sm border border-iu-orange/10">
                <CheckSquare className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground flex items-center gap-2 sm:gap-3">
                {language === "de" ? "Deine Aufgaben" : "Your Tasks"}
              </h3>
            </div>
            <div className="relative group overflow-hidden bg-card/40 backdrop-blur-xl border border-border rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-xl transition-all duration-500 hover:shadow-iu-orange/10 h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-iu-orange/10 blur-[100px] rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-125 duration-1000" />
              <div className="relative z-10 flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-iu-orange text-white shadow-[0_0_20px_rgba(242,148,0,0.3)] border border-iu-orange/50">
                    <CheckSquare className="h-6 w-6" />
                  </div>
                </div>
                <Link
                  to="/tasks"
                  className="p-2.5 rounded-full bg-muted/50 text-iu-orange hover:bg-iu-orange hover:text-white transition-all shadow-sm border border-border"
                >
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
              <div className="relative z-10 space-y-5">
                {upcomingAssignments.length > 0 ? (
                  upcomingAssignments.slice(0, 3).map((assignment) => (
                    <div
                      key={assignment.id}
                      className={`flex items-start gap-5 p-6 rounded-[2rem] border transition-all duration-500 group/item ${
                        assignment.color === "blue"
                          ? "bg-iu-blue/5 border-iu-blue/20 hover:border-iu-blue/40 shadow-md"
                          : "bg-iu-orange/5 border-iu-orange/20 hover:border-iu-orange/40 shadow-md"
                      }`}
                    >
                      <button className="mt-1 flex-shrink-0 group-hover/item:scale-110 transition-transform">
                        {assignment.completed ? (
                          <CheckCircle2 className="h-6 w-6 text-iu-green" />
                        ) : (
                          <Circle
                            className={`h-6 w-6 transition-colors ${
                              assignment.color === "blue"
                                ? "text-iu-blue/30 hover:text-iu-blue"
                                : "text-iu-orange/30 hover:text-iu-orange"
                            }`}
                          />
                        )}
                      </button>
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-foreground truncate group-hover/item:text-amber-500 transition-colors">
                            {assignment.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              assignment.color === "blue"
                                ? "bg-iu-blue/10 border-iu-blue/20 text-iu-blue"
                                : "bg-iu-orange/10 border-iu-orange/20 text-iu-orange"
                            }`}
                          >
                            {assignment.kind}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5 truncate">
                            {assignment.course}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${
                              assignment.daysLeft <= 3
                                ? "text-iu-red"
                                : "text-muted-foreground/30"
                            }`}
                          >
                            {assignment.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground font-medium italic">
                      {language === "de"
                        ? "Keine anstehenden Aufgaben"
                        : "No upcoming tasks"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Zuletzt besuchte Kurse (1 column / full width) */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
              <History className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground flex items-center gap-2 sm:gap-3">
              {language === "de" ? "Zuletzt besucht" : "Recently visited"}
            </h3>
          </div>
          <div className="bg-card/60 backdrop-blur-xl border border-border rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-iu-blue/5 blur-[100px] rounded-full -mr-48 -mt-48 transition-transform group-hover:scale-125 duration-1000" />
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue border border-iu-blue/20 shadow-inner">
                  <History className="h-6 w-6" />
                </div>
              </div>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-iu-blue/10 text-iu-blue hover:bg-iu-blue hover:text-white font-bold text-sm transition-all group/btn"
              >
                {language === "de" ? "Alle Kurse anzeigen" : "View All Courses"}
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative z-10 flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:pb-0 scrollbar-hide">
              {recentCourses.length === 0 ? (
                <div className="col-span-full w-full text-center py-20 bg-muted/20 rounded-[2rem] border border-dashed border-border px-8">
                  <BookOpen className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
                  <p className="text-lg text-muted-foreground font-bold mb-8 leading-relaxed">
                    {language === "de"
                      ? "Noch keine Kurse besucht"
                      : "No courses visited yet"}
                  </p>
                  <Link
                    to="/courses"
                    className="inline-flex items-center justify-center gap-4 w-full md:w-auto px-10 py-4 bg-iu-blue text-white rounded-2xl text-base font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-iu-blue/20 active:scale-95"
                  >
                    {language === "de" ? "Entdecken" : "Explore"}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              ) : (
                recentCourses.slice(0, 6).map((course) => {
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
                    blue: "bg-iu-blue/5 border-iu-blue/10 hover:border-iu-blue/40",
                    purple:
                      "bg-iu-purple/5 border-iu-purple/10 hover:border-iu-purple/40",
                    green:
                      "bg-iu-green/5 border-iu-green/10 hover:border-iu-green/40",
                    orange:
                      "bg-iu-orange/5 border-iu-orange/10 hover:border-iu-orange/40",
                    pink: "bg-iu-pink/5 border-iu-pink/10 hover:border-iu-pink/40",
                    indigo:
                      "bg-iu-blue/5 border-iu-blue/10 hover:border-iu-blue/40",
                  };

                  const iconColorClasses = {
                    blue: "bg-iu-blue/10 text-iu-blue",
                    purple: "bg-iu-purple/10 text-iu-purple",
                    green: "bg-iu-green/10 text-iu-green",
                    orange: "bg-iu-orange/10 text-iu-orange",
                    pink: "bg-iu-pink/10 text-iu-pink",
                    indigo: "bg-iu-blue/10 text-iu-blue",
                  };

                  return (
                    <Link
                      key={course.id}
                      to={`/courses/${course.id}`}
                      className={`block min-w-[280px] sm:min-w-0 shrink-0 border rounded-[2rem] p-6 transition-all duration-300 bg-card/40 hover:bg-card hover:shadow-xl hover:-translate-y-1 group/card ${
                        colorClasses[
                          course.color as keyof typeof colorClasses
                        ] || colorClasses.blue
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={`p-4 rounded-xl shadow-inner group-hover/card:scale-110 transition-transform ${
                            iconColorClasses[
                              course.color as keyof typeof iconColorClasses
                            ] || iconColorClasses.blue
                          }`}
                        >
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <h3 className="text-sm font-bold text-foreground truncate group-hover/card:text-amber-500 transition-colors">
                            {course.name}
                          </h3>
                          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5 flex items-center gap-3 leading-none">
                            <Clock className="h-3 w-3" />
                            <span>{timeText}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground/20 group-hover/card:text-iu-blue group-hover/card:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
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







