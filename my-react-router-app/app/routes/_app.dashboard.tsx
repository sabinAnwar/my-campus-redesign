import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import FirstSemesterOnboarding from "~/components/ui/FirstSemesterOnboarding";
import { useLanguage } from "~/contexts/LanguageContext";
import { ensureCanonicalTasks } from "~/lib/tasks.server";
import { getRecentCourses } from "~/lib/recentCourses";
import { getStudyPlanByStudiengang } from "~/lib/studyPlans";
import { TRANSLATIONS } from "~/services/translations/dashboard";

import {
  BookOpen,
  CheckSquare,
  CalendarDays,
  DoorOpen,
  Library,
  GraduationCap,
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

// Constants
import {
  NEWS_AUTO_SLIDE_INTERVAL_MS,
  MAX_TASKS_TO_DISPLAY,
  MAX_RECENT_COURSES,
  SCHEDULE_DAYS_AHEAD,
  WEEK_DAYS_TO_DISPLAY,
  DEFAULT_REQUIRED_PRAXIS_HOURS,
  DEFAULT_TARGET_HOURS_PER_WEEK,
} from "~/constants/dashboard";

// Components
import { DashboardHeader } from "~/components/dashboard/DashboardHeader";
import { NewsSlider } from "~/components/dashboard/NewsSlider";
import { QuickActions } from "~/components/dashboard/QuickActions";
import { StudyProgressWidget } from "~/components/dashboard/StudyProgressWidget";
import { WeekOverview } from "~/components/dashboard/WeekOverview";
import { UpcomingTasks } from "~/components/dashboard/UpcomingTasks";
import { RecentCourses } from "~/components/dashboard/RecentCourses";
import { NewsModal } from "~/components/news/NewsModal";

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

    // 2. Fallback to Demo Student ONLY if no session found (Dev mode / Fallback)
    if (!loggedInUser) {
      const demoUser = await prisma.user.findUnique({
        where: { email: "student.demo@iu-study.org" },
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
      if (demoUser) {
        loggedInUser = demoUser;
        userId = demoUser.id;
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
    endDate.setDate(endDate.getDate() + SCHEDULE_DAYS_AHEAD);

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
              take: MAX_TASKS_TO_DISPLAY,
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
      required: target?.requiredHours ?? DEFAULT_REQUIRED_PRAXIS_HOURS,
      logged: Math.round(totalHoursResult._sum.hours ?? 0),
      thisWeek: Math.round(weekHoursResult._sum.hours ?? 0),
      targetPerWeek: target?.targetPerWeek ?? DEFAULT_TARGET_HOURS_PER_WEEK,
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
          content: true,
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
      // News table might not exist in development - continue with empty array
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
    userId,
  } = useLoaderData() as DashboardLoaderData;

  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const locale = language === "de" ? "de-DE" : "en-US";

  // Use server-loaded user data directly - no client fetch needed!
  const user = { name: userName, campusArea: userCampusArea };

  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  
  // News modal state
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedNewsIndex, setSelectedNewsIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Load recent courses from localStorage (client-side only)
  useEffect(() => {
    if (userId) {
      setRecentCourses(getRecentCourses(MAX_RECENT_COURSES, userId));
    }
  }, [userId]);

  // Auto-slide news carousel
  useEffect(() => {
    if (newsItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, NEWS_AUTO_SLIDE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [newsItems.length]);

  // News modal handlers
  const handleNewsClick = (index: number) => {
    setSelectedNewsIndex(index);
    setShowNewsModal(true);
  };

  const handleCloseNewsModal = () => {
    setShowNewsModal(false);
  };

  const handlePrevNews = () => {
    setSelectedNewsIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextNews = () => {
    setSelectedNewsIndex((prev) => Math.min(newsItems.length - 1, prev + 1));
  };

  const handleCopyLink = () => {
    const article = newsItems[selectedNewsIndex];
    if (article) {
      navigator.clipboard.writeText(`${window.location.origin}/news/${article.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.goodMorning;
    if (hour < 18) return t.goodAfternoon;
    return t.goodEvening;
  };

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

  const currentStatus = currentBlock?.status || "vorlesung";
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

  // Weekly Schedule Mini-View - generates days for mobile scroll view
  const getWeekDays = () => {
    const days = [];
    const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    for (let i = 0; i < WEEK_DAYS_TO_DISPLAY; i++) {
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
    <div className="max-w-7xl mx-auto">
      <DashboardHeader userName={userName} t={t} getGreeting={getGreeting} />

      <NewsSlider
        newsItems={newsItems}
        currentNewsIndex={currentNewsIndex}
        setCurrentNewsIndex={setCurrentNewsIndex}
        onNewsClick={handleNewsClick}
        t={t}
      />

      <QuickActions quickActions={quickActions} t={t} />

      <StudyProgressWidget
        currentStatus={currentStatus}
        statusConfig={statusConfig}
        currentBlock={currentBlock}
        nextBlock={nextBlock}
        phaseProgress={phaseProgress}
        phaseDaysLeft={phaseDaysLeft}
        phaseTotalDays={phaseTotalDays}
        companyInfo={companyInfo}
        praxisHours={praxisHours}
        praxisProgress={praxisProgress}
        language={language}
        t={t}
      />

      <WeekOverview weekDays={weekDays} t={t} />

      <div className="dashboard-grid-container">
        {/* Row 1: Today's Schedule and Upcoming Tasks (2 columns) */}
        <div className="dashboard-row-top">
          <UpcomingTasks
            upcomingAssignments={upcomingAssignments}
            language={language}
            t={t}
          />
        </div>

        {/* Row 2: Recently Visited Courses */}
        <RecentCourses
          recentCourses={recentCourses}
          language={language}
          t={t}
        />
      </div>

      {/* Onboarding für Erstis */}
      <FirstSemesterOnboarding
        isFirstSemester={isFirstSemester}
        onComplete={() => {
          console.log(" Onboarding abgeschlossen!");
        }}
      />

      {/* News Modal */}
      {showNewsModal && newsItems[selectedNewsIndex] && (
        <NewsModal
          article={{
            slug: newsItems[selectedNewsIndex].slug,
            title: newsItems[selectedNewsIndex].title,
            excerpt: newsItems[selectedNewsIndex].excerpt,
            content: newsItems[selectedNewsIndex].content || newsItems[selectedNewsIndex].excerpt,
            category: newsItems[selectedNewsIndex].category,
            publishedAt: newsItems[selectedNewsIndex].publishedAt,
            author: null,
            coverImage: null,
          }}
          loading={false}
          error={null}
          atStart={selectedNewsIndex === 0}
          atEnd={selectedNewsIndex === newsItems.length - 1}
          copied={copied}
          copyLink={handleCopyLink}
          onClose={handleCloseNewsModal}
          onPrev={handlePrevNews}
          onNext={handleNextNews}
          closeBtnRef={closeBtnRef}
          locale={locale}
          labels={{
            categoryFallback: "News",
            loading: language === "de" ? "Laden..." : "Loading...",
            published: language === "de" ? "Veröffentlicht" : "Published",
            author: language === "de" ? "Autor" : "Author",
            close: language === "de" ? "Schließen" : "Close",
          }}
        />
      )}
    </div>
  );
}
