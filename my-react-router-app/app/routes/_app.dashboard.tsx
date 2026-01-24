import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import FirstSemesterOnboarding from "~/components/ui/FirstSemesterOnboarding";
import { useLanguage } from "~/store/LanguageContext";
import { getRecentCourses } from "~/utils/recentCourses";
import { getStudyPlanByStudiengang } from "~/utils/studyPlans";
import { TRANSLATIONS } from "~/services/translations/dashboard";

import {
  BookOpen,
  CheckSquare,
  CalendarDays,
  DoorOpen,
  Library,
  GraduationCap,
  GripVertical,
} from "lucide-react";
import { STUDY_PLANS, DEFAULT_PALETTE, toISODate } from "~/utils/studyPlans";
import { calculateDaysLeft } from "~/utils/tasksSample";
import { Prisma } from "@prisma/client";
import { prisma } from "~/services/prisma";
import { Await, useAsyncValue, useLoaderData } from "react-router";
import { ACTIVE_COURSES_COUNT } from "~/utils/coursesMeta";
import type {
  DashboardTask,
  DashboardDeferredData,
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
} from "~/config/dashboard";

// Components
import { DashboardHeader } from "~/features/dashboard/DashboardHeader";
import { NewsSlider } from "~/features/dashboard/NewsSlider";
import { QuickActions } from "~/features/dashboard/QuickActions";
import { StudyProgressWidget } from "~/features/dashboard/StudyProgressWidget";
import { WeekOverview } from "~/features/dashboard/WeekOverview";
import { UpcomingTasks } from "~/features/dashboard/UpcomingTasks";
import { RecentCourses } from "~/features/dashboard/RecentCourses";
import { GradesWidget } from "~/features/dashboard/GradesWidget";
import { NewsModal } from "~/features/news/NewsModal";

export const loader = async ({ request }: { request: Request }) => {
  let isFirstSemester = false;
  let userName = "Student";
  let userCampusArea: string | null = null;
  let studiengangName: string | null = null;
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
              total_semesters: true,
              name: true,
              major: {
                include: { courses: true },
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
          total_semesters: true,
          name: true,
          major: {
            include: { courses: true },
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
          total_semesters: true,
          name: true,
          major: {
            include: { courses: true },
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
    studiengangName = (loggedInUser as any)?.major?.name || null;
  } catch (error) {
    console.error("Dashboard loader error:", error);
  }

  const deferredData = (async () => {
    let tasks: DashboardTask[] = [];
    let tasksTotal = 0;
    let praxisPartner: PraxisPartnerData | null = null;
    let praxisHours: PraxisHoursData = {
      required: 900,
      logged: 0,
      thisWeek: 0,
      target_per_week: 40,
    };
    let scheduleEvents: ScheduleEventData[] = [];
    let averageGrade: number | null = null;
    let newsItems: DashboardDeferredData["newsItems"] = [];

    try {
      const safeQuery = async <T,>(promise: Promise<T>, fallback: T) => {
        try {
          return await promise;
        } catch (error) {
          const isMissingTable =
            error instanceof Prisma.PrismaClientKnownRequestError &&
            (error.code === "P2021" ||
              error.message.toLowerCase().includes("does not exist"));
          if (isMissingTable) {
            console.warn("Dashboard loader: missing table, using fallback.");
            return fallback;
          }
          console.error("Dashboard loader: query failed, using fallback.", error);
          return fallback;
        }
      };

      if (userId) {
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
        let [
          tasksResult,
          totalCount,
          partner,
          target,
          totalHoursResult,
          weekHoursResult,
          eventsResult,
          marksResult,
        ] = await Promise.all([
          safeQuery(
            prisma.studentTask.findMany({
              where: { user_id: userId },
              orderBy: { due_date: "asc" },
              take: MAX_TASKS_TO_DISPLAY,
            }),
            []
          ),
          safeQuery(prisma.studentTask.count({ where: { user_id: userId } }), 0),
          safeQuery(
            prisma.practicalPartner.findUnique({ where: { user_id: userId } }),
            null
          ),
          safeQuery(
            prisma.practicalHoursTarget.findUnique({ where: { user_id: userId } }),
            null
          ),
          safeQuery(
            prisma.practicalHoursLog.aggregate({
              where: { user_id: userId },
              _sum: { hours: true },
            }),
            { _sum: { hours: 0 } }
          ),
          safeQuery(
            prisma.practicalHoursLog.aggregate({
              where: { user_id: userId, date: { gte: startOfWeek } },
              _sum: { hours: true },
            }),
            { _sum: { hours: 0 } }
          ),
          safeQuery(
            prisma.scheduleEvent.findMany({
              where: { user_id: userId, date: { gte: today, lt: endDate } },
              orderBy: [{ date: "asc" }, { start_time: "asc" }],
            }),
            []
          ),
          safeQuery(
            prisma.mark.findMany({
              where: { user_id: userId },
              select: { value: true, course: true },
            }),
            []
          ),
        ]);

        // Process tasks
        tasks = tasksResult.map((t: any) => ({
          id: t.id,
          title: t.title,
          course: t.course,
          kind: t.kind,
          type: t.type,
          due_date: t.due_date.toISOString(),
        }));
        tasksTotal = totalCount;

        // Process praxis partner
        if (partner) {
          praxisPartner = {
            company_name: partner.company_name,
            department: partner.department,
            supervisor: partner.supervisor,
            email: partner.email,
            phone: partner.phone,
            address: partner.address,
          };
        }

        // Process praxis hours
        praxisHours = {
          required: target?.required_hours ?? DEFAULT_REQUIRED_PRAXIS_HOURS,
          logged: Math.round(totalHoursResult._sum.hours ?? 0),
          thisWeek: Math.round(weekHoursResult._sum.hours ?? 0),
          target_per_week: target?.target_per_week ?? DEFAULT_TARGET_HOURS_PER_WEEK,
        };

        // If no events in the short window, fetch the next upcoming events from DB.
        if ((eventsResult as any[]).length === 0) {
          eventsResult = await safeQuery(
            prisma.scheduleEvent.findMany({
              where: { user_id: userId, date: { gte: today } },
              orderBy: [{ date: "asc" }, { start_time: "asc" }],
              take: 10,
            }),
            []
          );
        }

        // Process schedule events
        scheduleEvents = (eventsResult as any[]).map((e: any) => ({
          id: e.id,
          title: e.title,
          course_code: e.course_code,
          date: e.date.toISOString(),
          start_time: e.start_time,
          end_time: e.end_time,
          location: e.location,
          event_type: e.event_type,
          professor: e.professor,
        }));

        // Process average grade
        if (marksResult.length > 0) {
          const grades = marksResult.map((m: any) => parseFloat(m.value));
          averageGrade =
            grades.reduce((a: number, b: number) => a + b, 0) / grades.length;
        }
      }

      // Load news (does not require a user session)
      try {
        const newsResult = await prisma.news.findMany({
          where: { status: "PUBLISHED" },
          orderBy: [{ featured: "desc" }, { published_at: "desc" }],
          take: 5,
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            content: true,
            category: true,
            published_at: true,
            featured: true,
          },
        });
        newsItems = newsResult.map((n: any) => ({
          ...n,
          published_at: n.published_at
            ? new Date(n.published_at).toISOString()
            : new Date().toISOString(),
        }));
      } catch {
        // News table might not exist in development - continue with empty array
      }
    } catch (error) {
      console.error("Dashboard loader error:", error);
    }

    return {
      tasks,
      tasksTotal,
      praxisPartner,
      praxisHours,
      scheduleEvents,
      averageGrade,
      newsItems,
    };
  })();

  return {
    isFirstSemester,
    userName,
    userCampusArea,
    studiengangName,
    userId,
    deferred: deferredData,
  };
};

export default function Dashboard() {
  const {
    userName,
    userCampusArea,
    studiengangName,
    isFirstSemester,
    userId,
    deferred,
  } = useLoaderData() as DashboardLoaderData;

  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const locale = language === "de" ? "de-DE" : "en-US";

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.goodMorning;
    if (hour < 18) return t.goodAfternoon;
    return t.goodEvening;
  };

  return (
    <div className="max-w-7xl mx-auto dashboard-icons-white">
      <DashboardHeader userName={userName} t={t} getGreeting={getGreeting} />

      <Suspense fallback={<DashboardDeferredFallback />}>
        <Await resolve={deferred}>
          <DashboardDeferredContent
            userId={userId}
            userCampusArea={userCampusArea}
            studiengangName={studiengangName}
            isFirstSemester={isFirstSemester}
            t={t}
            language={language}
            locale={locale}
          />
        </Await>
      </Suspense>
    </div>
  );
}

type DashboardDeferredContentProps = {
  userId?: number;
  userCampusArea: string | null;
  studiengangName: string | null;
  isFirstSemester: boolean;
  t: any;
  language: string;
  locale: string;
};

function DashboardDeferredFallback() {
  return (
    <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
      <div className="h-40 sm:h-48 rounded-2xl sm:rounded-[2rem] border border-border/40 bg-card/40 animate-pulse" />
      <div className="h-64 sm:h-72 rounded-2xl sm:rounded-[2rem] border border-border/40 bg-card/40 animate-pulse" />
    </div>
  );
}

function DashboardDeferredContent({
  userId,
  userCampusArea,
  studiengangName,
  isFirstSemester,
  t,
  language,
  locale,
}: DashboardDeferredContentProps) {
  const {
    tasks,
    praxisPartner,
    praxisHours,
    scheduleEvents,
    averageGrade,
    newsItems,
  } = useAsyncValue() as DashboardDeferredData;

  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [showTour, setShowTour] = useState(false);
  
  // News modal state
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedNewsIndex, setSelectedNewsIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  type WidgetKey = "modules" | "grades" | "tasks" | "appointments";
  const DEFAULT_WIDGET_ORDER: WidgetKey[] = [
    "modules",
    "grades",
    "tasks",
    "appointments",
  ];
  const DEFAULT_WIDGET_VISIBILITY: Record<WidgetKey, boolean> = {
    modules: true,
    grades: true,
    tasks: true,
    appointments: true,
  };
  const [widgetOrder, setWidgetOrder] = useState<WidgetKey[]>(
    DEFAULT_WIDGET_ORDER
  );
  const [widgetVisibility, setWidgetVisibility] = useState<
    Record<WidgetKey, boolean>
  >(DEFAULT_WIDGET_VISIBILITY);
  const [draggedWidget, setDraggedWidget] = useState<WidgetKey | null>(null);
  const [dragOverWidget, setDragOverWidget] = useState<WidgetKey | null>(null);
  const widgetRefs = useRef<Record<WidgetKey, HTMLDivElement | null>>({
    modules: null,
    grades: null,
    tasks: null,
    appointments: null,
  });

  useEffect(() => {
    if (!isFirstSemester) return;
    try {
      const dismissed = localStorage.getItem("dashboard-onboarding-tour");
      if (dismissed !== "done") setShowTour(true);
    } catch {
      setShowTour(true);
    }
  }, [isFirstSemester]);

  const handleTourClose = () => {
    try {
      localStorage.setItem("dashboard-onboarding-tour", "done");
    } catch {}
    setShowTour(false);
  };

  const tourSteps =
    language === "de"
      ? [
          {
            id: "header",
            selector: '[data-onboard="dashboard-header"]',
            title: "Begruessung und Ueberblick",
            body: "Hier siehst du deinen persoenlichen Einstieg mit Begruessung und kurzem Kontext zum Dashboard.",
          },
          {
            id: "news",
            selector: '[data-onboard="dashboard-news"]',
            title: "Aktuelle News",
            body: "Wichtige Updates und Hinweise der Hochschule findest du hier.",
          },
          {
            id: "actions",
            selector: '[data-onboard="dashboard-quick-actions"]',
            title: "Schnellzugriffe",
            body: "Springe direkt zu den meist genutzten Bereichen wie Kurse, Aufgaben oder Bibliothek.",
          },
          {
            id: "progress",
            selector: '[data-onboard="dashboard-progress"]',
            title: "Studienfortschritt",
            body: "Dein aktueller Status, Stunden und die naechsten Phasen werden hier angezeigt.",
          },
          {
            id: "customize",
            selector: '[data-onboard="dashboard-customize"]',
            title: "Dashboard anpassen",
            body: "Widgets ein- oder ausblenden und die Reihenfolge per Drag and Drop festlegen.",
          },
          {
            id: "widgets",
            selector: '[data-onboard="dashboard-widgets"]',
            title: "Widgets",
            body: "Diese Karten zeigen dir Aufgaben, Termine, Noten und weitere wichtige Infos.",
          },
        ]
      : [
          {
            id: "header",
            selector: '[data-onboard="dashboard-header"]',
            title: "Greeting and overview",
            body: "Your personal dashboard entry with a quick overview.",
          },
          {
            id: "news",
            selector: '[data-onboard="dashboard-news"]',
            title: "Latest news",
            body: "Important updates and announcements appear here.",
          },
          {
            id: "actions",
            selector: '[data-onboard="dashboard-quick-actions"]',
            title: "Quick actions",
            body: "Jump directly to key areas like courses, tasks, or the library.",
          },
          {
            id: "progress",
            selector: '[data-onboard="dashboard-progress"]',
            title: "Study progress",
            body: "Your current status, logged hours, and upcoming phases.",
          },
          {
            id: "customize",
            selector: '[data-onboard="dashboard-customize"]',
            title: "Customize dashboard",
            body: "Show or hide widgets and reorder them with drag and drop.",
          },
          {
            id: "widgets",
            selector: '[data-onboard="dashboard-widgets"]',
            title: "Widgets",
            body: "These cards show tasks, appointments, grades, and more.",
          },
        ];
  // Load recent courses from localStorage (client-side only)
  useEffect(() => {
    if (userId) {
      setRecentCourses(getRecentCourses(MAX_RECENT_COURSES, userId));
    }
  }, [userId]);

  // Load widget preferences from localStorage
  useEffect(() => {
    const storageKey = userId
      ? `dashboard-widgets:${userId}`
      : "dashboard-widgets:guest";
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.order)) {
        setWidgetOrder(
          parsed.order.filter((k: WidgetKey) => DEFAULT_WIDGET_ORDER.includes(k))
        );
      }
      if (parsed.visibility && typeof parsed.visibility === "object") {
        setWidgetVisibility((prev) => ({
          ...prev,
          ...parsed.visibility,
        }));
      }
    } catch {}
  }, [userId]);

  // Persist widget preferences
  useEffect(() => {
    const storageKey = userId
      ? `dashboard-widgets:${userId}`
      : "dashboard-widgets:guest";
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          order: widgetOrder,
          visibility: widgetVisibility,
        })
      );
    } catch {}
  }, [userId, widgetOrder, widgetVisibility]);

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
        name: praxisPartner.company_name,
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
          time: e.start_time,
          type: e.event_type.charAt(0) + e.event_type.slice(1).toLowerCase(),
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
      const daysLeft = calculateDaysLeft(task.due_date);
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
        dueDate: new Date(task.due_date).toLocaleDateString(
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

  const widgetLabelMap: Record<WidgetKey, string> = {
    modules: t.modulesLabel ?? t.courses,
    grades: t.gradesLabel ?? "Grades",
    tasks: t.tasksLabel ?? t.tasks,
    appointments: t.appointmentsLabel ?? t.appointments,
  };

  const widgetContent: Record<WidgetKey, ReactNode> = {
    modules: (
      <RecentCourses
        recentCourses={recentCourses}
        language={language}
        t={t}
      />
    ),
    grades: (
      <GradesWidget
        averageGrade={averageGrade}
        language={language}
        t={t}
      />
    ),
    tasks: (
      <UpcomingTasks
        upcomingAssignments={upcomingAssignments}
        language={language}
        t={t}
      />
    ),
    appointments: <WeekOverview weekDays={weekDays} t={t} />,
  };

  const handleDragStart = (key: WidgetKey) => {
    setDraggedWidget(key);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLElement>,
    key: WidgetKey
  ) => {
    event.preventDefault();
    if (dragOverWidget !== key) setDragOverWidget(key);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLElement>,
    key: WidgetKey
  ) => {
    event.preventDefault();
    if (!draggedWidget || draggedWidget === key) {
      setDraggedWidget(null);
      setDragOverWidget(null);
      return;
    }
    const next = widgetOrder.filter((k) => k !== draggedWidget);
    const targetIndex = next.indexOf(key);
    next.splice(targetIndex, 0, draggedWidget);
    setWidgetOrder(next);
    setDraggedWidget(null);
    setDragOverWidget(null);
  };

  return (
    <>
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

      <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
        <div
          data-onboard="dashboard-customize"
          className="p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-border/60 bg-gradient-to-br from-card via-card/80 to-muted/30 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">
                {t.customizeLabel ?? "Dashboard settings"}
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-foreground">
                {t.customizeDashboard ?? "Customize dashboard"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-slate-200 font-semibold">
                {t.dragHint ?? "Drag to reorder"}
              </p>
              {isFirstSemester ? (
                <button
                  type="button"
                  onClick={() => setShowTour(true)}
                  className="mt-4 inline-flex items-center justify-center rounded-full border border-iu-blue/40 bg-iu-blue/5 px-4 py-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-iu-blue hover:bg-iu-blue/10 transition-colors"
                >
                  {language === "de" ? "Tour starten" : "Start tour"}
                </button>
              ) : null}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3 rounded-2xl border border-border/60 bg-card/70 p-4 sm:p-5 shadow-sm">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground dark:text-slate-200">
                  {t.widgetVisibility ?? "Widget visibility"}
                </p>
                {DEFAULT_WIDGET_ORDER.map((key) => {
                  const id = `vis-${key}`;
                  return (
                    <label
                      key={id}
                      htmlFor={id}
                      className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-foreground cursor-pointer group"
                    >
                      <input
                        id={id}
                        type="checkbox"
                        checked={widgetVisibility[key]}
                        onChange={() =>
                          setWidgetVisibility((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                        className="h-4 w-4 rounded-md border-2 border-slate-900/80 bg-white text-slate-900 accent-slate-900 focus:ring-2 focus:ring-slate-900/40 focus:ring-offset-2 focus:ring-offset-white transition-colors dark:border-slate-100/80 dark:bg-slate-950 dark:text-slate-100 dark:accent-white dark:focus:ring-white/40 dark:focus:ring-offset-slate-950"
                      />
                      <span className="group-hover:text-iu-blue transition-colors">
                        {t.showWidget ?? "Show"} {widgetLabelMap[key]}
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className="space-y-3 rounded-2xl border border-border/60 bg-card/70 p-4 sm:p-5 shadow-sm">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground dark:text-slate-200">
                  {t.widgetOrder ?? "Widget order"}
                </p>
                <p className="text-[10px] sm:text-xs font-semibold text-foreground">
                  {t.dragHint ?? "Drag the chips to reorder"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {widgetOrder.map((key) => (
                    <button
                      key={`order-${key}`}
                      type="button"
                      draggable
                      onDragStart={() => handleDragStart(key)}
                      onDragOver={(event) => handleDragOver(event, key)}
                      onDrop={(event) => handleDrop(event, key)}
                      onDragEnd={() => {
                        setDraggedWidget(null);
                        setDragOverWidget(null);
                      }}
                      className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border transition-all !cursor-grab active:!cursor-grabbing inline-flex items-center gap-2 ${
                        draggedWidget === key
                          ? "bg-iu-blue text-white border-iu-blue"
                          : dragOverWidget === key
                            ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100"
                            : "bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-900 dark:text-slate-50 dark:border-slate-700"
                      }`}
                      aria-label={`${t.dragHint ?? "Drag to reorder"}: ${widgetLabelMap[key]}`}
                    >
                      <GripVertical className="h-3 w-3 opacity-70" aria-hidden="true" />
                      {widgetLabelMap[key]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div data-onboard="dashboard-widgets" className="space-y-6 sm:space-y-8">
          {widgetOrder
            .filter((key) => widgetVisibility[key])
            .map((key) => (
              <div
                key={key}
                ref={(el) => {
                  widgetRefs.current[key] = el;
                }}
                className="rounded-2xl sm:rounded-[2rem] border border-border/60 p-3 sm:p-4"
              >
                {praxisPartner ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                        {t.praxisPartner}
                      </span>
                      <span className="text-xs font-black text-iu-blue dark:text-white uppercase tracking-widest px-2.5 py-1 rounded-full bg-iu-blue/10 dark:bg-iu-blue border border-iu-blue/10">
                        {praxisPartner.company_name}
                      </span>
                    </div>
                  </div>
                ) : null}
                <div className="flex items-center justify-between px-2 pb-3">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">
                    {widgetLabelMap[key]}
                  </span>
                </div>
                {widgetContent[key]}
              </div>
            ))}
        </div>
      </div>

      {/* News Modal */}
      {showNewsModal && newsItems[selectedNewsIndex] && (
        <NewsModal
          article={{
            slug: newsItems[selectedNewsIndex].slug,
            title: newsItems[selectedNewsIndex].title,
            excerpt: newsItems[selectedNewsIndex].excerpt ?? undefined,
            content: (newsItems[selectedNewsIndex].content || newsItems[selectedNewsIndex].excerpt) ?? undefined,
            category: newsItems[selectedNewsIndex].category ?? undefined,
            publishedAt: newsItems[selectedNewsIndex].publishedAt || newsItems[selectedNewsIndex].published_at,
            featured: newsItems[selectedNewsIndex].featured,
          }}
          loading={false}
          error=""
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

      <FirstSemesterOnboarding
        isOpen={showTour}
        steps={tourSteps}
        onClose={handleTourClose}
      />
    </>
  );
}
