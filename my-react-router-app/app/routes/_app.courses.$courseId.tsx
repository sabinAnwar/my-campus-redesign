import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  FolderOpen,
  PencilLine,
  MessageSquare,
  BookOpen,
  Book,
  GraduationCap,
  Presentation,
  Rss,
  FileText,
  Headphones,
  Users,
  ClipboardCheck,
  Plus,
  Minus,
  Play,
  Video,
  AlertCircle,
  Clock,
  MapPin,
  Mail,
  BarChart3,
  Eye,
  ThumbsUp,
  Quote,
  Send,
  X,
  ArrowLeft,
  MoreVertical,
  Flag,
  Trash2,
  Upload,
  Share2,
  Bold,
  Italic,
  Link as LinkIcon,
  Calendar,
  CalendarCheck,
  CheckCircle,
  Star,
} from "lucide-react";
import { TaskKind } from "@prisma/client";
import { saveRecentFile } from "../lib/recentFiles";
import { saveRecentCourse } from "../lib/recentCourses";
import { prisma } from "~/lib/prisma";
import { calculateDaysLeft } from "~/lib/tasksSample";
import { TRANSLATIONS, getCourseConfig } from "../data/coursesConfig";
import { useLanguage } from "~/contexts/LanguageContext";
import type { CourseSubmission } from "~/types/course";

export const loader = async ({
  request,
  params,
}: {
  request: Request;
  params: { courseId?: string };
}) => {
  const formatGermanDate = (date: Date) =>
    date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  let user = await prisma.session
    .findFirst({
      where: {
        token: request.headers
          .get("Cookie")
          ?.split("session=")[1]
          ?.split(";")[0],
      },
      include: { user: true },
    })
    .then((s: any) => s?.user);

  // FALLBACK: If no user found, use Sabin Elanwar
  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: "sabin.elanwar@iu-study.org" },
    });
  }

  if (!user) return { submissions: [], course: null };

  const courseIdNum = Number(params.courseId);
  if (isNaN(courseIdNum)) return { submissions: [], course: null };

  // Fetch course from DB
  // Fetch course from DB with files
  const course = await prisma.course.findUnique({
    where: { id: courseIdNum },
    include: {
      files: {
        where: { userId: user.id },
      },
    },
  });

  if (!course) return { submissions: [], course: null };

  // Map database files to UI resources
  const resources = course.files.map((f) => ({
    id: f.id,
    title: f.name,
    url: f.url,
    size: f.size || "Unknown",
    type:
      f.fileType === "video"
        ? "video"
        : f.fileType === "pdf"
          ? "script"
          : "file",
    duration: f.fileType === "video" ? f.size || "12:45" : undefined,
    date: formatGermanDate(f.uploadedAt),
  }));

  // Fetch tasks for this user and this course
  const tasks = await prisma.studentTask.findMany({
    where: {
      userId: user.id,
      course: course.name,
    },
    orderBy: { dueDate: "asc" },
  });

  let baseSubmissions: CourseSubmission[] = tasks
    .filter(
      (row) =>
        !row.title.toLowerCase().includes("klausur") && row.kind !== "KLAUSUR"
    )
    .map((row: any) => ({
      id: row.id,
      title: row.title,
      course: row.course,
      type: row.type || "Abgabe",
      courseCode: `MOD-${course.id}`, // Placeholder
      professor: "Dozent", // Placeholder as we don't have this in Course model yet
      dueDateIso: new Date(row.dueDate).toISOString().slice(0, 10),
      dueDate: formatGermanDate(new Date(row.dueDate)),
      correctionDate: formatGermanDate(
        new Date(
          new Date(row.dueDate).setDate(new Date(row.dueDate).getDate() + 14)
        )
      ),
      status: "pending",
      similarity: undefined,
      submissions: [],
      daysUntilDue: calculateDaysLeft(
        new Date(row.dueDate).toISOString().slice(0, 10)
      ),
    }));

  // Enforce rule: 'Wissenschaftliches Arbeiten' has only ONE submission
  const isScientificWork = course.name === "Wissenschaftliches Arbeiten";
  const submissions =
    isScientificWork && baseSubmissions.length > 0
      ? [baseSubmissions[0]]
      : baseSubmissions;

  // Augment course object for UI
  const courseData = {
    ...course,
    title: course.name, // Ensure title is available for UI
    instructor: "Dozent",
    code: course.code,
    startDate: "01.10.2024",
    endDate: "31.03.2025",
    description:
      course.description ||
      "Dieses Modul vermittelt tiefgehende Kenntnisse im Fachbereich.",
    resources,
  };

  return {
    submissions,
    course: courseData,
    userId: user.id,
    studiengangName: user.studiengang?.name || "IU Studium",
  };
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const loaderData =
    (useLoaderData() as {
      submissions?: CourseSubmission[];
      course?: any;
      userId?: number;
      studiengangName?: string;
    }) || {};
  const courseSubmissions: CourseSubmission[] = loaderData.submissions ?? [];
  const { userId, studiengangName } = loaderData;
  const { language } = useLanguage();
  const courses = getCourseConfig(language);

  // Find the course by ID (from loader or fallback to config)
  const course = (loaderData.course ||
    courses.find((c) => c.id === Number(courseId))) as any;

  useEffect(() => {
    if (course && userId) {
      saveRecentCourse(
        {
          id: course.id,
          name: course.name,
          studiengang: studiengangName || "IU Studium",
          semester: `${course.semester}. Semester`,
          color: course.color || "cyan",
        },
        userId
      );
    }
  }, [course, userId, studiengangName]);

  const typeMap: Record<string, { en: string }> = {
    Hausarbeit: { en: "Term Paper" },
    Projektarbeit: { en: "Project Work" },
    Klausur: { en: "Exam" },
    "Online-Klausur": { en: "Online Exam" },
    Workbook: { en: "Workbook" },
    Fallstudie: { en: "Case Study" },
    Portfolio: { en: "Portfolio" },
    Fachpräsentation: { en: "Presentation" },
  };

  const translate = (value: string) =>
    language === "de" ? value : typeMap[value]?.en || value;

  const loadSavedStatus = () => {
    if (typeof window === "undefined")
      return {} as Record<
        number,
        { status: "pending" | "submitted"; similarity?: number }
      >;
    try {
      return JSON.parse(
        localStorage.getItem("submissionStatus") || "{}"
      ) as Record<
        number,
        { status: "pending" | "submitted"; similarity?: number }
      >;
    } catch {
      return {};
    }
  };

  const persistStatus = (
    next: Record<
      number,
      { status: "pending" | "submitted"; similarity?: number }
    >
  ) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("submissionStatus", JSON.stringify(next));
  };

  const [savedStatus, setSavedStatus] =
    useState<
      Record<number, { status: "pending" | "submitted"; similarity?: number }>
    >(loadSavedStatus());

  useEffect(() => {
    const syncFromStorage = () => setSavedStatus(loadSavedStatus());
    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("focus", syncFromStorage);
    document.addEventListener("visibilitychange", syncFromStorage);
    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("focus", syncFromStorage);
      document.removeEventListener("visibilitychange", syncFromStorage);
    };
  }, []);

  const [submissions, setSubmissions] = useState<CourseSubmission[]>(
    courseSubmissions.map((s) => ({
      ...s,
      status: savedStatus[s.id]?.status ?? "pending",
      similarity: savedStatus[s.id]?.similarity,
    }))
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<CourseSubmission | null>(null);
  const [accepted, setAccepted] = useState<{
    honor: boolean;
    privacy: boolean;
  }>({
    honor: false,
    privacy: false,
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // keep UI in sync if loader data changes (e.g., after seed or navigation)
  useEffect(() => {
    setSubmissions(
      courseSubmissions.map((s) => ({
        ...s,
        status: savedStatus[s.id]?.status ?? "pending",
        similarity: savedStatus[s.id]?.similarity,
      }))
    );
  }, [courseSubmissions, savedStatus]);

  const openModal = (submission: CourseSubmission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
    setAccepted({ honor: false, privacy: false });
    setUploadedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) setUploadedFile(file);
  };

  const handleSubmit = () => {
    if (!accepted.honor || !accepted.privacy) {
      alert(
        language === "de"
          ? "Bitte akzeptiere die Eidesstattliche Erklärung und den Datenschutz."
          : "Please accept the honor and privacy statements."
      );
      return;
    }
    if (!uploadedFile) {
      alert(
        language === "de"
          ? "Bitte lade deine Datei hoch."
          : "Please upload your file."
      );
      return;
    }
    if (!selectedSubmission) return;

    const similarity = Math.floor(Math.random() * 10 + 5);
    setSubmissions((prev) => {
      const updated = prev.map((s) =>
        s.id === selectedSubmission.id
          ? { ...s, status: "submitted" as const, similarity }
          : s
      );
      const persisted: Record<
        number,
        { status: "pending" | "submitted"; similarity?: number }
      > = {};
      updated.forEach((s) => {
        if (s.status === "submitted") {
          persisted[s.id] = { status: s.status, similarity: s.similarity };
        }
      });
      persistStatus(persisted);
      setSavedStatus(persisted);
      return updated;
    });
    setShowModal(false);
    alert(language === "de" ? "Abgabe gespeichert." : "Submission saved.");
  };
  const [activeTab, setActiveTab] = useState("overview");
  const [playingVideo, setPlayingVideo] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0];
    } else if (url.includes("youtube.com/embed/")) {
      return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const getThumbnailUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0];
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0];
    }
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : "";
  };
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  // Forum state
  const [forumView, setForumView] = useState<"list" | "thread">("list");
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [forumTopics, setForumTopics] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("Student");

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        const headers: any = {};
        if (sessionToken) headers["X-Session-Token"] = sessionToken;

        const res = await fetch("/api/user", { headers });
        if (res.ok) {
          const data = await res.json();
          if (data?.user?.name) {
            setCurrentUser(data.user.name);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  // Fetch topics from API
  const fetchTopics = React.useCallback(async () => {
    if (!course?.id) return;
    try {
      const res = await fetch(`/api/forum?courseId=${course.id}`);
      if (res.ok) {
        const data = await res.json();
        setForumTopics(data.topics || []);
      }
    } catch (error) {
      console.error("Failed to fetch topics", error);
    }
  }, [course?.id]);

  // Initial fetch and polling
  useEffect(() => {
    fetchTopics();
    const interval = setInterval(fetchTopics, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [fetchTopics]);

  // Update selected topic when forumTopics changes (for real-time updates in thread view)
  useEffect(() => {
    if (selectedTopic) {
      const updated = forumTopics.find((t) => t.id === selectedTopic.id);
      if (updated) {
        // Preserve local optimistic updates if needed, but for now just sync
        setSelectedTopic(updated);
      }
    }
  }, [forumTopics]);

  // If course not found, redirect to courses list
  useEffect(() => {
    if (!course) {
      navigate("/courses");
    }
  }, [course, navigate]);

  if (!course) {
    return null;
  }

  return (
    <div className="pb-20">
      {/* Premium Header Aligned with Schedule */}
      <header className="sticky top-0 md:top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border/40 -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col gap-4">
            {/* Top Row: Back button + Title */}
            <div className="flex items-start gap-3">
              <button
                onClick={() => navigate("/courses")}
                className="group p-2 sm:p-3 rounded-xl bg-muted/50 hover:bg-iu-blue text-muted-foreground hover:text-white transition-all active:scale-95 border border-border/50 flex-shrink-0"
              >
                <ArrowLeft
                  size={18}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-iu-blue/10 text-iu-blue text-[9px] font-black uppercase tracking-wider border border-iu-blue/20">
                    {course.code}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-foreground tracking-tight leading-tight line-clamp-2">
                  {course.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-iu-blue" />
                  <span className="text-xs text-muted-foreground font-medium truncate">
                    {course.instructor}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Row */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-iu-blue/5 border border-iu-blue/10">
                <div className="w-2 h-2 rounded-full bg-iu-blue animate-pulse" />
                <span className="text-[10px] sm:text-xs font-bold text-foreground">
                  {course.progress || 0}%{" "}
                  {language === "de" ? "Abgeschlossen" : "Completed"}
                </span>
              </div>
              <div className="flex-1 max-w-[200px] h-1.5 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-iu-blue progress-bar"
                  style={{ width: `${course.progress || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-border/30 bg-card/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-1 overflow-x-auto py-2 sm:py-3 px-2 sm:px-4 lg:px-8 no-scrollbar scroll-smooth">
              {[
                { id: "overview", icon: ClipboardList, label: t.overview },
                { id: "resources", icon: FolderOpen, label: t.resources },
                { id: "videos", icon: Video, label: t.videos },
                { id: "coursefeed", icon: Rss, label: "Course Feed" },
                {
                  id: "abgabe",
                  icon: PencilLine,
                  label: language === "de" ? "Abgabe" : "Submissions",
                },
                {
                  id: "online-tests",
                  icon: ClipboardCheck,
                  label: language === "de" ? "Tests" : "Tests",
                },
                { id: "notes", icon: FileText, label: "Notizen" },
                { id: "forum", icon: MessageSquare, label: t.forum },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-5 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold sm:font-black transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-iu-blue text-white shadow-lg shadow-iu-blue/30 scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline sm:inline">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-10">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Exam Information Banner */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-iu-blue/20 bg-gradient-to-br from-iu-blue/10 via-background to-background p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl shadow-iu-blue/5">
              <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-iu-blue/10 rounded-full blur-[80px] -mr-24 sm:-mr-48 -mt-24 sm:-mt-48 animate-pulse" />

              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 lg:gap-10">
                <div className="flex items-start gap-3 sm:gap-6">
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-iu-blue text-white shadow-xl shadow-iu-blue/20 rotate-[-4deg]">
                    <AlertCircle className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-foreground mb-1 sm:mb-2 flex items-center gap-2">
                      {language === "de"
                        ? "Wichtige Prüfungsinformation"
                        : "Important Exam Information"}
                      <span className="flex h-2 w-2 rounded-full bg-iu-blue animate-ping" />
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-lg font-medium leading-relaxed">
                      {language === "de"
                        ? "Verpasse keine Termine! Hier findest du alle relevanten Details für deine bevorstehende Modulprüfung."
                        : "Don't miss any deadlines! Here you'll find all relevant details for your upcoming module exam."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full lg:w-auto">
                  {(() => {
                    const examTask =
                      submissions.find(
                        (s) =>
                          s.type === "Online-Klausur" || s.type === "Klausur"
                      ) || submissions[0];
                    return (
                      <>
                        <div className="p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-card border border-border/50 shadow-sm hover:border-iu-blue/30 transition-all group/stat">
                          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 text-iu-blue">
                            <CalendarDays className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover/stat:scale-110 transition-transform" />
                            <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-wider sm:tracking-widest opacity-70">
                              Datum
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-xs md:text-base font-black text-foreground truncate">
                            {examTask?.dueDate || "—"}
                          </p>
                        </div>
                        <div className="p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-card border border-border/50 shadow-sm hover:border-iu-blue/30 transition-all group/stat">
                          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 text-iu-blue">
                            <ClipboardCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover/stat:scale-110 transition-transform" />
                            <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-wider sm:tracking-widest opacity-70">
                              Form
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-xs md:text-base font-black text-foreground truncate">
                            {examTask ? translate(examTask.type) : "—"}
                          </p>
                        </div>
                        <div className="p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-card border border-border/50 shadow-sm hover:border-iu-blue/30 transition-all group/stat">
                          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 text-iu-blue">
                            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover/stat:scale-110 transition-transform" />
                            <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-wider sm:tracking-widest opacity-70">
                              Ort
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-xs md:text-base font-black text-foreground truncate">
                            {examTask?.type === "Online-Klausur"
                              ? "Online"
                              : "Hörsaal H1"}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Quick Stats & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8 lg:items-start">
              {/* Left Column (Description & Stats) */}
              <div className="lg:col-span-8 space-y-8">
                {/* Course Description Card */}
                <div className="group relative rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-4 sm:p-6 md:p-10 lg:p-12 shadow-sm transition-all hover:shadow-2xl hover:shadow-iu-blue/5 hover:border-iu-blue/20 overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-iu-blue/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-foreground mb-4 sm:mb-6 md:mb-8 flex items-center gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 md:p-3.5 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue border border-iu-blue/20 group-hover:rotate-3 transition-transform">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    {t.courseDescription}
                  </h3>

                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed font-medium mb-6 sm:mb-8 md:mb-10">
                      {course.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div className="relative p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl md:rounded-3xl bg-muted/20 border border-border/30 group/item transition-all hover:bg-iu-blue/5 hover:border-iu-blue/20">
                      <div className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-iu-blue/60 uppercase tracking-wider sm:tracking-[0.2em] mb-1 sm:mb-2 md:mb-3">
                        {t.startDate}
                      </div>
                      <div className="text-sm sm:text-lg md:text-2xl font-black text-foreground flex items-center gap-2 sm:gap-3">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-iu-blue/40" />
                        {course.startDate}
                      </div>
                    </div>
                    <div className="relative p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl md:rounded-3xl bg-muted/20 border border-border/30 group/item transition-all hover:bg-iu-blue/5 hover:border-iu-blue/20">
                      <div className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-iu-blue/60 uppercase tracking-wider sm:tracking-[0.2em] mb-1 sm:mb-2 md:mb-3">
                        {t.endDate}
                      </div>
                      <div className="text-sm sm:text-lg md:text-2xl font-black text-foreground flex items-center gap-2 sm:gap-3">
                        <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5 text-iu-blue/40" />
                        {course.endDate}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Stats Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                  {/* Credits */}
                  {/* Credits */}
                  <div className="group p-3 sm:p-5 md:p-8 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl hover:border-iu-blue/30 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-3 sm:mb-5 md:mb-8">
                      <div className="p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl bg-iu-blue/10 text-iu-blue group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="text-[7px] sm:text-[8px] md:text-[10px] font-black text-muted-foreground/40 uppercase tracking-wider sm:tracking-widest">
                        ECTS
                      </div>
                    </div>
                    <div>
                      <span className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground tracking-tighter">
                        {course.credits}
                      </span>
                      <span className="text-sm sm:text-base md:text-xl font-black text-iu-blue ml-0.5 sm:ml-1">
                        CP
                      </span>
                    </div>
                    <p className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground mt-1 sm:mt-2 md:mt-3 font-bold uppercase tracking-wide sm:tracking-wider opacity-60 hidden sm:block">
                      Studienaufwand
                    </p>
                  </div>

                  {/* Efficiency/Progress */}
                  {/* Efficiency/Progress */}
                  <div className="group p-3 sm:p-5 md:p-8 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl hover:border-iu-blue/30 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-3 sm:mb-5 md:mb-8">
                      <div className="p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl bg-iu-blue/10 text-iu-blue group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="text-[7px] sm:text-[8px] md:text-[10px] font-black text-muted-foreground/40 uppercase tracking-wider sm:tracking-widest">
                        Stats
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground tracking-tighter">
                      {course.progress}%
                    </div>
                    <div className="mt-2 sm:mt-3 md:mt-5 space-y-1 sm:space-y-2">
                      <div className="w-full bg-muted/30 rounded-full h-1 sm:h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-iu-blue to-iu-blue h-full rounded-full progress-bar shadow-lg"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="text-[7px] sm:text-[9px] md:text-[10px] text-muted-foreground font-black uppercase tracking-wider sm:tracking-widest opacity-60 hidden sm:block">
                        Fortschritt
                      </p>
                    </div>
                  </div>

                  {/* Course Intensity */}
                  {/* Course Intensity */}
                  <div className="group p-3 sm:p-5 md:p-8 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl hover:border-iu-blue/30 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-3 sm:mb-5 md:mb-8">
                      <div className="p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl bg-iu-blue/10 text-iu-blue group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="text-[7px] sm:text-[8px] md:text-[10px] font-black text-muted-foreground/40 uppercase tracking-wider sm:tracking-widest">
                        Time
                      </div>
                    </div>
                    <div className="text-base sm:text-xl md:text-3xl font-black text-foreground tracking-tight">
                      Winter 24
                    </div>
                    <p className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground mt-1 sm:mt-2 md:mt-4 font-bold uppercase tracking-wide sm:tracking-wider opacity-60 hidden sm:block">
                      Aktuelles Semester
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column (Instructor & Tools) */}
              <div className="lg:col-span-4 space-y-4 sm:space-y-6 md:space-y-8">
                {/* Instructor Profile Card */}
                <div className="rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-4 sm:p-6 md:p-10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-iu-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4 sm:mb-6 md:mb-8">
                      <div className="absolute inset-0 bg-iu-blue/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-iu-blue to-iu-blue flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-black shadow-2xl relative z-10 border-2 sm:border-4 border-card group-hover:scale-105 group-hover:rotate-2 transition-all duration-500">
                        {course.instructor?.charAt(0) || "?"}
                      </div>
                      <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-lg sm:rounded-xl bg-iu-blue border-2 sm:border-4 border-card flex items-center justify-center text-white shadow-lg z-20">
                        <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 fill-current" />
                      </div>
                    </div>

                    <h4 className="text-lg sm:text-xl md:text-2xl font-black text-foreground tracking-tight mb-0.5 sm:mb-1">
                      {course.instructor}
                    </h4>
                    <p className="text-[8px] sm:text-[9px] md:text-[10px] text-iu-blue font-black uppercase tracking-widest sm:tracking-[0.2em] mb-4 sm:mb-6 md:mb-10">
                      {language === "de"
                        ? "Modulverantwortlicher"
                        : "Module Coordinator"}
                    </p>

                    <div className="w-full space-y-2 sm:space-y-3">
                      <a
                        href={`mailto:${course.instructor?.toLowerCase().replace(" ", ".")}@iu-fernstudium.de`}
                        className="w-full p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl bg-muted/20 border border-border/30 flex items-center justify-center gap-2 sm:gap-3 hover:bg-iu-blue/10 hover:border-iu-blue/20 transition-all group/mail"
                      >
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-iu-blue group-hover/mail:scale-110 transition-transform" />
                        <span className="text-xs sm:text-sm font-black text-foreground">
                          Email
                        </span>
                      </a>

                      <button className="w-full py-3 sm:py-4 rounded-lg sm:rounded-xl md:rounded-2xl bg-iu-blue text-white font-bold sm:font-black text-xs sm:text-sm hover:bg-iu-blue transition-all shadow-xl shadow-iu-blue/25 active:scale-95 flex items-center justify-center gap-2">
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                        {language === "de" ? "Nachricht" : "Message"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Global Resources Quick Links */}
                <div className="rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-sm">
                  <h3 className="text-[9px] sm:text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest sm:tracking-[0.2em] mb-4 sm:mb-6 md:mb-8 px-1 sm:px-2">
                    {language === "de"
                      ? "Wichtige Dokumente"
                      : "Critical Documents"}
                  </h3>
                  <div className="space-y-1 sm:space-y-2">
                    {[
                      {
                        label: "Modulhandbuch",
                        icon: FileText,
                        color: "text-iu-blue",
                      },
                      {
                        label: "Prüfungsordnung",
                        icon: ClipboardList,
                        color: "text-iu-purple",
                      },
                      {
                        label: "Literaturliste",
                        icon: Book,
                        color: "text-iu-orange",
                      },
                    ].map((link, idx) => (
                      <button
                        key={idx}
                        className="w-full flex items-center justify-between p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl hover:bg-muted/40 transition-all group"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                          <div
                            className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-card border border-border group-hover:scale-110 transition-transform ${link.color}`}
                          >
                            <link.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-iu-blue transition-colors">
                            {link.label}
                          </span>
                        </div>
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground/30 group-hover:text-iu-blue group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Upload */}
        {showModal && (
          <div className="fixed inset-0 bg-background/60 dark:bg-black/60 backdrop-blur-xl flex items-center justify-center z-[100] animate-in fade-in duration-300 p-2 sm:p-4">
            <div className="bg-card/90 backdrop-blur-2xl rounded-xl sm:rounded-2xl md:rounded-[3rem] shadow-2xl p-4 sm:p-6 md:p-10 w-full max-w-2xl relative animate-in zoom-in-95 duration-300 border border-border/50 overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-iu-blue/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32" />
              <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-iu-purple/10 rounded-full blur-3xl -ml-12 sm:-ml-24 -mb-12 sm:-mb-24" />

              <div className="relative flex items-center gap-6 mb-10">
                <div className="h-20 w-20 rounded-[2rem] bg-iu-blue text-white flex items-center justify-center text-3xl font-black shadow-2xl shadow-iu-blue/30">
                  <Upload size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">
                    {language === "de"
                      ? "Abgabe verwalten"
                      : "Manage submission"}
                  </h2>
                  <p className="text-lg text-muted-foreground font-medium mt-1">
                    {selectedSubmission?.title}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-10 relative">
                <label className="flex items-start gap-4 p-5 rounded-2xl bg-muted/40 border border-border/50 cursor-pointer hover:bg-iu-blue/5 hover:border-iu-blue/20 transition-all group">
                  <input
                    type="checkbox"
                    checked={accepted.honor}
                    onChange={(e) =>
                      setAccepted((prev) => ({
                        ...prev,
                        honor: e.target.checked,
                      }))
                    }
                    className="mt-1 w-5 h-5 accent-iu-blue"
                  />
                  <span className="text-[15px] font-black text-muted-foreground group-hover:text-foreground transition-colors">
                    {language === "de"
                      ? "Ich bestätige die Eidesstattliche Erklärung."
                      : "I confirm the honor statement."}
                  </span>
                </label>

                <label className="flex items-start gap-4 p-5 rounded-2xl bg-muted/40 border border-border/50 cursor-pointer hover:bg-iu-blue/5 hover:border-iu-blue/20 transition-all group">
                  <input
                    type="checkbox"
                    checked={accepted.privacy}
                    onChange={(e) =>
                      setAccepted((prev) => ({
                        ...prev,
                        privacy: e.target.checked,
                      }))
                    }
                    className="mt-1 w-5 h-5 accent-iu-blue"
                  />
                  <span className="text-[15px] font-black text-muted-foreground group-hover:text-foreground transition-colors">
                    {language === "de"
                      ? "Ich akzeptiere den Datenschutz für den Upload."
                      : "I accept the privacy terms for upload."}
                  </span>
                </label>
              </div>

              <div
                className={`border-4 border-dashed rounded-[2rem] p-12 text-center transition-all relative group/drop ${
                  uploadedFile
                    ? "border-iu-blue/50 bg-iu-blue/5 shadow-inner"
                    : "border-border hover:border-iu-blue/50 hover:bg-iu-blue/5"
                }`}
              >
                {!uploadedFile && (
                  <>
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="p-5 rounded-[1.5rem] bg-muted group-hover/drop:bg-iu-blue/10 transition-colors">
                        <Upload className="h-10 w-10 text-muted-foreground group-hover/drop:text-iu-blue transition-colors" />
                      </div>
                      <p className="text-lg font-black text-muted-foreground group-hover/drop:text-foreground transition-all">
                        {language === "de"
                          ? "Datei hier ablegen oder klicken"
                          : "Drop file here or click"}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="course-file-upload"
                    />
                    <label
                      htmlFor="course-file-upload"
                      className="cursor-pointer inline-block mt-8 bg-iu-blue text-white text-sm px-10 py-4 rounded-2xl font-black shadow-xl shadow-iu-blue/25 hover:bg-iu-blue transition-all active:scale-95"
                    >
                      {language === "de" ? "Datei auswählen" : "Choose file"}
                    </label>
                  </>
                )}

                {uploadedFile && (
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center gap-5 bg-card border border-iu-blue/30 p-5 rounded-[2rem] shadow-2xl">
                        <div className="p-3 bg-iu-blue/10 text-iu-blue rounded-xl">
                          <FileText size={24} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-foreground">
                            {uploadedFile.name}
                          </p>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-muted rounded-full h-2.5 max-w-sm mx-auto overflow-hidden border border-border/30">
                      <div className="h-full bg-iu-blue shadow-[0_0_15px_rgba(36,94,235,0.5)] progress-bar w-full"></div>
                    </div>
                    <p className="text-xs font-black text-iu-blue uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                      <CheckCircle size={14} />
                      {language === "de"
                        ? "Upload abgeschlossen"
                        : "Upload complete"}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-border/50">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-10 py-4 rounded-2xl text-sm font-black bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95"
                >
                  {language === "de" ? "Abbrechen" : "Cancel"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!accepted.honor || !accepted.privacy}
                  className={`px-12 py-4 rounded-2xl text-sm font-black shadow-2xl transition-all active:scale-95 ${
                    accepted.honor && accepted.privacy
                      ? "bg-iu-blue text-white shadow-iu-blue/30 hover:bg-iu-blue"
                      : "bg-muted/50 text-muted-foreground/50 cursor-not-allowed opacity-50"
                  }`}
                >
                  {language === "de"
                    ? "Abgabe bestätigen"
                    : "Confirm submission"}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="space-y-4 sm:space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-600">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-8 md:mb-12">
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tighter mb-1 sm:mb-2">
                  {t.resources}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-medium max-w-2xl">
                  {language === "de"
                    ? "Greife auf alle essenziellen Lernmaterialien wie Skripte, Foliensätze und Podcasts zu."
                    : "Access all essential learning materials including scripts, slide decks, and podcasts."}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-iu-blue uppercase tracking-wider sm:tracking-widest bg-iu-blue/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-iu-blue/10">
                <FolderOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {course.resources?.length || 0} Dokumente
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {(() => {
                const courseSections = [
                  {
                    id: "skripte",
                    label: "Skripte",
                    icon: FileText,
                    items:
                      course.resources?.filter(
                        (r: any) => r.type === "script"
                      ) || [],
                    color: "cyan",
                    defaultExpanded: true,
                  },
                  {
                    id: "basisliteratur",
                    label: "Basisliteratur",
                    icon: Book,
                    items: [
                      {
                        id: 1,
                        title:
                          "Hartmann, Peter (2019): Mathematik für Informatiker",
                        type: "book",
                        url: "#",
                      },
                    ],
                    color: "amber",
                    defaultExpanded: false,
                  },
                  {
                    id: "foliensaetze",
                    label: "Foliensätze",
                    icon: Presentation,
                    items:
                      course.resources?.filter(
                        (r: any) => r.type === "file" && r.teacher
                      ) || [],
                    color: "purple",
                    defaultExpanded: false,
                  },
                  {
                    id: "podcasts",
                    label: "Podcasts",
                    icon: Headphones,
                    items:
                      course.resources?.filter(
                        (r: any) => r.type === "podcast"
                      ) || [],
                    color: "rose",
                    defaultExpanded: false,
                  },
                ];

                return courseSections.map((section) => {
                  const isExpanded =
                    expandedSections[section.id] !== undefined
                      ? expandedSections[section.id]
                      : section.defaultExpanded;
                  const colorClass =
                    section.color === "cyan"
                      ? "text-iu-blue bg-iu-blue/10"
                      : section.color === "amber"
                        ? "text-iu-orange bg-iu-orange/10"
                        : section.color === "purple"
                          ? "text-iu-purple bg-iu-purple/10"
                          : "text-iu-red bg-iu-red/10";

                  return (
                    <div
                      key={section.id}
                      className="group/section rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden transition-all hover:border-iu-blue/20 shadow-sm"
                    >
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-8 py-7 flex items-center justify-between hover:bg-muted/30 transition-all text-left group"
                      >
                        <div className="flex items-center gap-5">
                          <div
                            className={`p-4 rounded-2xl ${colorClass} group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm`}
                          >
                            <section.icon size={24} />
                          </div>
                          <div>
                            <span className="text-xl font-black text-foreground block group-hover:text-iu-blue transition-colors">
                              {section.label}
                            </span>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 block">
                              {section.items.length}{" "}
                              {language === "de" ? "Elemente" : "Elements"}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`p-2.5 rounded-xl bg-muted/50 text-muted-foreground transition-all duration-300 group-hover:text-iu-blue ${isExpanded ? "rotate-180 bg-iu-blue/10" : ""}`}
                        >
                          <Plus
                            size={20}
                            className={isExpanded ? "rotate-45" : ""}
                          />
                        </div>
                      </button>

                      <div
                        className={`px-8 transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[1000px] pb-8 opacity-100" : "max-h-0 pb-0 opacity-0 overflow-hidden"}`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/20">
                          {section.items.length > 0 ? (
                            section.items.map((item: any) => (
                              <a
                                key={item.id}
                                href={item.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-5 rounded-2xl bg-muted/20 border border-border/30 hover:border-iu-blue/30 hover:bg-iu-blue/5 transition-all cursor-pointer group/item shadow-sm hover:shadow-iu-blue/5"
                              >
                                <div className="p-3 rounded-xl bg-card border border-border/50 text-iu-blue group-hover/item:scale-110 transition-transform">
                                  {item.type === "podcast" ? (
                                    <Play size={20} className="fill-current" />
                                  ) : (
                                    <FileText size={20} />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-black text-foreground truncate group-hover/item:text-iu-blue transition-colors">
                                    {item.title}
                                  </div>
                                  <div className="flex items-center gap-3 mt-2">
                                    {item.size && (
                                      <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest px-2 py-0.5 rounded bg-muted/50 border border-border/50">
                                        {item.size}
                                      </span>
                                    )}
                                    {item.duration && (
                                      <span className="text-[9px] font-black text-iu-blue/60 uppercase tracking-widest px-2 py-0.5 rounded bg-iu-blue/5 border border-iu-blue/10">
                                        {item.duration}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="p-2 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all bg-iu-blue text-white shadow-lg translate-x-2 group-hover/item:translate-x-0">
                                  <Upload size={14} className="rotate-90" />
                                </div>
                              </a>
                            ))
                          ) : (
                            <div className="col-span-full py-10 text-center">
                              <p className="text-muted-foreground font-bold italic opacity-40">
                                {language === "de"
                                  ? "Keine Einträge in dieser Kategorie"
                                  : "No entries in this category"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div className="space-y-4 sm:space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-600">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-8 md:mb-12">
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tighter mb-1 sm:mb-2">
                  {t.videos}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-medium max-w-2xl">
                  {language === "de"
                    ? "Studiere in deinem eigenen Tempo mit unseren Video-Vorlesungen und interaktiven Inhalten."
                    : "Study at your own pace with our video lectures and interactive content."}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-iu-blue uppercase tracking-wider sm:tracking-widest bg-iu-blue/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-iu-blue/10">
                <Video className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {course.resources?.filter((r: any) => r.type === "video")
                  .length || 0}{" "}
                Vorlesungen
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
              {course.resources
                ?.filter((r: any) => r.type === "video")
                .map((video: any) => (
                  <div
                    key={video.id}
                    onClick={() => {
                      saveRecentFile(
                        {
                          id: video.id,
                          name: video.title,
                          type: "video",
                          url: video.url,
                          duration: video.duration,
                        },
                        course.name,
                        studiengangName
                      );
                      setPlayingVideo(video);
                    }}
                    className="group relative rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden hover:border-iu-blue/40 hover:shadow-2xl hover:shadow-iu-blue/10 transition-all duration-500 cursor-pointer"
                  >
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      {getThumbnailUrl(video.url) ? (
                        <img
                          src={getThumbnailUrl(video.url)}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-iu-blue/5">
                          <Video size={48} className="text-iu-blue/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-iu-blue text-white flex items-center justify-center shadow-2xl scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
                          <Play size={28} className="fill-current ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                          {video.duration || "12:45"}
                        </span>
                      </div>
                    </div>
                    <div className="p-7">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h4 className="text-xl font-black text-foreground leading-tight line-clamp-2 group-hover:text-iu-blue transition-colors">
                          {video.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-border/10">
                        <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                          <Users size={12} className="text-iu-blue/50" />
                          <span>IU Study Content</span>
                        </div>
                        <button className="text-[10px] font-black text-iu-blue uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                          Starten &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Course Feed Tab */}
        {activeTab === "coursefeed" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-black text-foreground tracking-tight">
                  Course Feed
                </h3>
                <p className="text-muted-foreground mt-1 font-medium">
                  {language === "de"
                    ? "Bleibe auf dem Laufenden mit dem offiziellen Kurs-Feed."
                    : "Stay up to date with the official course feed."}
                </p>
              </div>
            </div>

            <div className="rounded-[3rem] border border-border bg-card/50 backdrop-blur-xl p-16 text-center max-w-3xl mx-auto relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-iu-blue/10 rounded-full blur-3xl -mr-40 -mt-40 group-hover:bg-iu-blue/20 transition-colors duration-700" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-iu-purple/5 rounded-full blur-3xl -ml-32 -mb-32" />

              <div className="relative z-10">
                <div className="w-28 h-28 rounded-[2.5rem] bg-iu-blue/10 flex items-center justify-center mx-auto mb-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
                  <Rss size={56} className="text-iu-blue" />
                </div>

                <h3 className="text-4xl font-black text-foreground mb-6 tracking-tight">
                  Course Feed
                </h3>

                <p className="text-muted-foreground text-xl mb-12 leading-relaxed max-w-lg mx-auto font-medium">
                  {language === "de"
                    ? "Interagieren Sie mit Ihren Online-Tutoren und Mitstudierenden, stellen Sie Fragen und nehmen Sie an Live-Lehrveranstaltungen teil."
                    : "Interact with your online tutors and fellow students, ask questions and participate in live teaching events."}
                </p>

                <button className="px-12 py-5 bg-iu-blue text-white font-black rounded-2xl hover:bg-iu-blue transition-all shadow-xl shadow-iu-blue/25 active:scale-95 group/btn">
                  <span className="flex items-center gap-3">
                    {language === "de" ? "Jetzt Anmelden" : "Sign up Now"}
                    <ArrowLeft
                      size={20}
                      className="rotate-180 group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === "abgabe" && (
          <div className="space-y-4 sm:space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 md:gap-8 mb-2 sm:mb-4">
              <div className="max-w-xl">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tighter mb-1 sm:mb-2 md:mb-3">
                  {t.submissions}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-medium">
                  {language === "de"
                    ? "Behalte deine Deadlines im Auge und verwalte deine schriftlichen Ausarbeitungen an einem zentralen Ort."
                    : "Keep track of your deadlines and manage your written assignments in one central place."}
                </p>
              </div>
              <button className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl md:rounded-2xl bg-iu-blue text-white font-bold sm:font-black text-xs sm:text-sm hover:bg-iu-blue transition-all shadow-xl shadow-iu-blue/25 flex items-center gap-2 sm:gap-3 active:scale-95 group">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline">
                  {language === "de"
                    ? "Hausarbeit abgeben"
                    : "Submit Assignment"}
                </span>
                <span className="sm:hidden">
                  {language === "de" ? "Abgeben" : "Submit"}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-5">
              {submissions.length === 0 ? (
                <div className="rounded-xl sm:rounded-2xl md:rounded-[3rem] border-2 border-dashed border-border/40 p-8 sm:p-12 md:p-20 text-center bg-muted/5">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl md:rounded-3xl bg-muted/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-muted-foreground opacity-30" />
                  </div>
                  <h4 className="text-base sm:text-lg md:text-xl font-black text-foreground mb-1 sm:mb-2">
                    Keine Abgaben gefunden
                  </h4>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">
                    {language === "de"
                      ? "Für dieses Modul sind aktuell keine Abgaben hinterlegt."
                      : "No submissions are currently registered for this module."}
                  </p>
                </div>
              ) : (
                submissions.map((assignment: any) => {
                  const isExam =
                    assignment.type === "Klausur" ||
                    assignment.type === "Online-Klausur";
                  const isSubmitted = assignment.status === "submitted";

                  return (
                    <div
                      key={assignment.id}
                      className={`group relative rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-4 sm:p-6 md:p-10 hover:border-iu-blue/30 transition-all shadow-sm hover:shadow-2xl hover:shadow-iu-blue/5 ${isSubmitted ? "opacity-90" : ""}`}
                    >
                      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6 md:gap-10">
                        <div className="flex items-start sm:items-center gap-3 sm:gap-5 md:gap-8 flex-1">
                          <div
                            className={`p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl md:rounded-[2rem] shadow-inner transition-transform duration-500 group-hover:scale-110 flex-shrink-0 ${isExam ? "bg-iu-red/10 text-iu-red" : "bg-iu-blue/10 text-iu-blue"}`}
                          >
                            {isExam ? (
                              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10" />
                            ) : (
                              <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10" />
                            )}
                          </div>

                          <div className="space-y-1 sm:space-y-2 md:space-y-3 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                              <h4 className="text-base sm:text-lg md:text-2xl font-black text-foreground group-hover:text-iu-blue transition-colors tracking-tight truncate max-w-[200px] sm:max-w-sm">
                                {assignment.title}
                              </h4>
                              {isSubmitted && (
                                <div className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-iu-blue/10 text-iu-blue text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest border border-iu-blue/20 flex items-center gap-1">
                                  <CheckCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                                  ERFOLGREICH
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6">
                              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 text-xs sm:text-sm">
                                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-iu-blue/60" />
                                <span className="text-muted-foreground font-medium lowercase hidden sm:inline">
                                  Deadline:
                                </span>
                                <span
                                  className={`font-bold sm:font-black tracking-tight ${assignment.daysUntilDue < 7 ? "text-iu-red" : "text-foreground"}`}
                                >
                                  {assignment.dueDate}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 text-xs sm:text-sm">
                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-iu-blue/60" />
                                <span className="text-muted-foreground font-medium lowercase hidden sm:inline">
                                  Typ:
                                </span>
                                <span className="font-bold sm:font-black text-foreground uppercase text-[10px] sm:text-[11px] tracking-wider">
                                  {translate(assignment.type)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
                          {isSubmitted &&
                            assignment.similarity !== undefined && (
                              <div className="flex flex-col items-end px-3 sm:px-4 md:px-6 border-r border-border/30">
                                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-wider sm:tracking-widest mb-0.5 sm:mb-1">
                                  KI
                                </span>
                                <span className="text-base sm:text-lg md:text-xl font-black text-iu-blue">
                                  {assignment.similarity}%
                                </span>
                              </div>
                            )}

                          {!assignment.title
                            .toLowerCase()
                            .includes("klausur") && (
                            <button
                              onClick={() => openModal(assignment)}
                              className={`px-4 sm:px-6 md:px-10 py-2.5 sm:py-3 md:py-5 rounded-lg sm:rounded-xl md:rounded-2xl font-bold sm:font-black transition-all active:scale-95 text-xs sm:text-sm min-w-[100px] sm:min-w-[140px] md:min-w-[180px] ${
                                isSubmitted
                                  ? "bg-muted/50 text-foreground hover:bg-muted border border-border/50"
                                  : "bg-iu-blue text-white hover:bg-iu-blue shadow-xl shadow-iu-blue/30"
                              }`}
                            >
                              {isSubmitted
                                ? language === "de"
                                  ? "Abgabe ansehen"
                                  : "View Submission"
                                : language === "de"
                                  ? "Jetzt abgeben"
                                  : "Submit Now"}
                            </button>
                          )}

                          {isExam && (
                            <div className="px-8 py-4 rounded-2xl bg-iu-red/5 border border-iu-red/10 text-iu-red font-black text-sm uppercase tracking-widest">
                              Externes Portal
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Online Tests & Evaluationen Tab */}
        {activeTab === "online-tests" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-600">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h3 className="text-3xl lg:text-4xl font-black text-foreground tracking-tighter mb-2">
                  {language === "de" ? "Wissen überprüfen" : "Knowledge Check"}
                </h3>
                <p className="text-lg text-muted-foreground font-medium max-w-2xl">
                  {language === "de"
                    ? "Bereite dich optimal auf deine Prüfung vor mit unseren interaktiven Online-Tests und gebe wertvolles Feedback."
                    : "Prepare optimally for your exam with our interactive online tests and provide valuable feedback."}
                </p>
              </div>
            </div>

            {/* Exam Date Information Card - Redesigned */}
            <div className="relative overflow-hidden rounded-[3rem] border border-iu-red/10 bg-gradient-to-br from-iu-red/5 to-transparent p-10 group shadow-2xl shadow-iu-red/5">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-iu-red/10 rounded-full blur-3xl pointer-events-none group-hover:bg-iu-red/20 transition-colors duration-700" />

              <div className="flex flex-col lg:flex-row lg:items-center gap-10 relative">
                <div className="p-6 rounded-3xl bg-iu-red text-white shadow-xl rotate-[-2deg]">
                  <Calendar size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h4 className="text-2xl font-black text-iu-red">
                      {language === "de" ? "Nächste Prüfung" : "Upcoming Exam"}
                    </h4>
                    <span className="px-3 py-1 rounded-full bg-iu-red/10 text-iu-red text-[10px] font-black uppercase tracking-widest border border-iu-red/20 animate-pulse">
                      Live Status
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-iu-red/60 uppercase tracking-widest">
                        {language === "de" ? "Datum & Zeit" : "Date & Time"}
                      </p>
                      <p className="text-2xl font-black text-foreground">
                        15. Feb 2025, 09:00
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-iu-red/60 uppercase tracking-widest">
                        {language === "de" ? "Modus / Ort" : "Mode / Location"}
                      </p>
                      <p className="text-2xl font-black text-foreground">
                        Hörsaal H1 (Campus)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-iu-red/60 uppercase tracking-widest">
                        Anmeldung
                      </p>
                      <p className="text-2xl font-black text-iu-blue flex items-center gap-2">
                        <CheckCircle size={24} /> Bestätigt
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Online Tests Section */}
              {(() => {
                const onlineTests =
                  course.resources?.filter(
                    (r: any) => r.type === "onlineTest" || r.type === "test"
                  ) || [];
                return onlineTests.map((test: any) => (
                  <div
                    key={test.id}
                    className="group relative rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-10 hover:border-iu-blue/30 transition-all shadow-sm hover:shadow-2xl"
                  >
                    <div className="flex items-start justify-between mb-10">
                      <div className="p-5 rounded-3xl bg-iu-blue/10 text-iu-blue shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <CheckCircle size={32} />
                      </div>
                      <div className="px-4 py-1.5 rounded-xl bg-iu-blue/10 text-iu-blue text-[9px] font-black uppercase tracking-[0.2em] border border-iu-blue/20">
                        Module Test
                      </div>
                    </div>
                    <h4 className="text-2xl font-black text-foreground mb-4 group-hover:text-iu-blue transition-colors tracking-tight">
                      {test.title}
                    </h4>
                    <div className="flex items-center gap-6 mb-10 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-iu-blue" /> 45 Min
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ClipboardList size={12} className="text-iu-blue" /> 15
                        Fragen
                      </span>
                    </div>
                    <a
                      href={test.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-iu-blue text-white font-black rounded-2xl hover:bg-iu-blue transition-all shadow-xl shadow-iu-blue/25 active:scale-95 group/btn"
                    >
                      <Play
                        size={20}
                        className="fill-current group-hover:translate-x-1 transition-transform"
                      />
                      {language === "de" ? "Test starten" : "Start Test"}
                    </a>
                  </div>
                ));
              })()}

              {/* Evaluations Section */}
              {(() => {
                const evaluations =
                  course.resources?.filter(
                    (r: any) => r.type === "evaluation"
                  ) || [];
                return evaluations.map((evaluation: any) => (
                  <div
                    key={evaluation.id}
                    className="group relative rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-10 hover:border-iu-purple/30 transition-all shadow-sm hover:shadow-2xl"
                  >
                    <div className="flex items-start justify-between mb-10">
                      <div className="p-5 rounded-3xl bg-iu-purple/10 text-iu-purple shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <Star size={32} />
                      </div>
                      <div className="px-4 py-1.5 rounded-xl bg-iu-purple/10 text-iu-purple text-[9px] font-black uppercase tracking-[0.2em] border border-iu-purple/20">
                        Feedback
                      </div>
                    </div>
                    <h4 className="text-2xl font-black text-foreground mb-4 group-hover:text-iu-purple transition-colors tracking-tight">
                      {evaluation.title}
                    </h4>
                    <p className="text-muted-foreground text-sm font-medium mb-10 leading-relaxed">
                      {language === "de"
                        ? "Deine Meinung zählt! Hilf uns das Modul zu verbessern."
                        : "Your opinion matters! Help us improve the module content."}
                    </p>
                    <a
                      href={evaluation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-iu-purple text-white font-black rounded-2xl hover:bg-iu-purple transition-all shadow-xl shadow-iu-purple/25 active:scale-95 group/btn"
                    >
                      <FileSearch
                        size={20}
                        className="group-hover:translate-y-[-2px] transition-transform"
                      />
                      {language === "de" ? "Feedback geben" : "Give Feedback"}
                    </a>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {/* Notizen Tab (Study Scribe) - Scrollbar Fix */}
        {activeTab === "notes" && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
              <div>
                <h3 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter mb-3">
                  Study Scribe
                </h3>
                <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
                  {language === "de"
                    ? "Dein KI-gestützter Begleiter für strukturierte Notizen."
                    : "Your AI-powered companion for structured note-taking."}
                </p>
              </div>
            </div>

            {/* Premium Iframe Container - Simplified to avoid 3-scrollbars */}
            <div className="relative group">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-iu-blue/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative bg-card/20 backdrop-blur-xl rounded-[2.5rem] border border-border/40 shadow-2xl overflow-hidden">
                <div className="w-full relative overflow-hidden forum-container-height">
                  <iframe
                    src="https://study-scribe-83.lovable.app/"
                    title="Study Scribe"
                    className="w-full h-full border-none"
                    allow="camera; microphone; clipboard-read; clipboard-write;"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forum Tab */}
        {activeTab === "forum" && (
          <div className="space-y-10 animate-in fade-in duration-600">
            {forumView === "list" && (
              <>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
                  <div>
                    <h3 className="text-3xl lg:text-4xl font-black text-foreground tracking-tighter mb-3">
                      {t.forum}
                    </h3>
                    <p className="text-lg text-muted-foreground font-medium max-w-2xl">
                      {language === "de"
                        ? "Vernetze dich mit deinen Kommilitonen, diskutiere Kursinhalte und teile dein Wissen."
                        : "Connect with your fellow students, discuss course content and share your knowledge."}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNewTopicModal(true)}
                    className="px-8 py-5 bg-iu-blue text-white font-black rounded-2xl hover:bg-iu-blue transition-all shadow-xl shadow-iu-blue/25 active:scale-95 flex items-center gap-3 group"
                  >
                    <Plus
                      size={20}
                      className="group-hover:rotate-90 transition-transform duration-300"
                    />
                    {t.createTopic}
                  </button>
                </div>

                {/* Topics List */}
                <div className="grid gap-5">
                  {forumTopics.length === 0 ? (
                    <div className="rounded-[3rem] border-2 border-dashed border-border/40 p-20 text-center bg-muted/5">
                      <MessageSquare
                        size={48}
                        className="mx-auto text-muted-foreground opacity-20 mb-6"
                      />
                      <p className="text-muted-foreground font-bold">
                        Noch keine Diskussionen gestartet. Sei der Erste!
                      </p>
                    </div>
                  ) : (
                    forumTopics.map((topic: any) => (
                      <div
                        key={topic.id}
                        onClick={() => {
                          if (topic.id) {
                            fetch("/api/forum", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                topicId: topic.id,
                                action: "view",
                              }),
                            }).catch(console.error);
                          }
                          const updatedTopics = forumTopics.map((t) => {
                            if (t.id === topic.id)
                              return { ...t, views: (t.views || 0) + 1 };
                            return t;
                          });
                          setForumTopics(updatedTopics);
                          const updatedTopic = updatedTopics.find(
                            (t) => t.id === topic.id
                          );
                          setSelectedTopic(updatedTopic);
                          setForumView("thread");
                        }}
                        className={`group relative rounded-[2.5rem] p-10 border transition-all duration-500 cursor-pointer shadow-sm hover:shadow-2xl ${
                          topic.status === "pinned"
                            ? "bg-iu-orange/5 border-iu-orange/20 hover:border-iu-orange/40"
                            : "bg-card/40 backdrop-blur-xl border-border/40 hover:border-iu-blue/30"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-4 mb-5">
                              {topic.status === "pinned" && (
                                <div className="p-2 rounded-xl bg-iu-orange text-white shadow-lg animate-bounce duration-1000">
                                  <Flag size={14} className="fill-current" />
                                </div>
                              )}
                              <h4 className="text-2xl font-black text-foreground truncate group-hover:text-iu-blue transition-colors tracking-tight">
                                {topic.title}
                              </h4>
                            </div>
                            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em]">
                              <div className="flex items-center gap-3 py-1.5 px-3 rounded-xl bg-muted/40 border border-border/30">
                                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-iu-blue to-iu-blue text-white flex items-center justify-center font-black">
                                  {topic.author.charAt(0)}
                                </div>
                                <span className="text-foreground">
                                  {topic.author}
                                </span>
                              </div>
                              <span className="flex items-center gap-2">
                                <Clock size={12} className="text-iu-blue/40" />
                                {topic.lastPost}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {forumView === "thread" && selectedTopic && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                {/* Navigation Row */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setForumView("list")}
                    className="group flex items-center gap-4 text-muted-foreground hover:text-iu-blue transition-all font-black text-xs uppercase tracking-widest"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center group-hover:shadow-xl group-hover:border-iu-blue/30 transition-all">
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </div>
                    {language === "de"
                      ? "Zurück zur Forenübersicht"
                      : "Back to Forum"}
                  </button>

                  <div className="flex gap-2">
                    <button className="p-3 rounded-xl bg-card border border-border/50 hover:bg-muted/50 transition-all">
                      <Share2 size={18} className="text-muted-foreground" />
                    </button>
                    <button className="p-3 rounded-xl bg-card border border-border/50 hover:bg-muted/50 transition-all">
                      <MoreVertical
                        size={18}
                        className="text-muted-foreground"
                      />
                    </button>
                  </div>
                </div>

                {/* Thread Header Card */}
                <div className="bg-card/40 backdrop-blur-xl rounded-[3rem] p-12 border border-border/40 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-iu-blue/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-10">
                      <span className="px-4 py-1.5 rounded-xl bg-iu-blue/10 text-iu-blue text-[10px] font-black uppercase tracking-[0.2em] border border-iu-blue/20">
                        {selectedTopic.status === "pinned"
                          ? "Wichtig"
                          : "Diskussion"}
                      </span>
                      <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                        {selectedTopic.lastPost}
                      </span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-12 leading-tight tracking-tighter">
                      {selectedTopic.title}
                    </h2>

                    <div className="flex flex-wrap items-center justify-between gap-10 pt-10 border-t border-border/20">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-iu-blue to-iu-blue text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-iu-blue/20 ring-4 ring-card">
                          {selectedTopic.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-xl text-foreground mb-0.5">
                            {selectedTopic.author}
                          </p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-iu-blue/60">
                            Themenersteller
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-10">
                        <div className="flex flex-col items-center">
                          <span className="font-black text-3xl text-foreground leading-none mb-2 tracking-tighter">
                            {selectedTopic.replies}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                            Antworten
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-black text-3xl text-foreground leading-none mb-2 tracking-tighter">
                            {selectedTopic.views}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                            Views
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Posts Stream */}
                <div className="space-y-4 relative max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                  <div className="absolute left-8 top-0 bottom-0 w-px bg-border/50 -z-10"></div>

                  {selectedTopic.posts?.map((post: any, index: number) => (
                    <div
                      key={post.id}
                      className={`group relative pl-16 transition-all duration-500 ${index === 0 ? "animate-in fade-in slide-in-from-bottom-4" : ""}`}
                    >
                      {/* Avatar Connector */}
                      <div className="absolute left-0 top-0 w-16 flex justify-center">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border-4 border-background z-10 transition-transform hover:scale-110 ${
                            index === 0
                              ? "bg-gradient-to-br from-iu-blue to-iu-blue text-white shadow-iu-blue/20"
                              : "bg-card text-foreground border-border/50"
                          }`}
                        >
                          {post.author.charAt(0)}
                        </div>
                      </div>

                      <div className="bg-card/40 backdrop-blur-xl rounded-[2rem] p-8 border border-border/50 shadow-sm hover:shadow-xl transition-all group-hover:border-iu-blue/30">
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-border/50">
                          <div>
                            <h4 className="font-black text-foreground text-xl tracking-tight">
                              {post.author}
                            </h4>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                              {post.timestamp}
                            </p>
                          </div>
                          {index === 0 && (
                            <span className="px-4 py-1.5 rounded-xl bg-iu-blue/10 text-iu-blue text-[10px] font-black uppercase tracking-[0.2em] border border-iu-blue/20 shadow-sm">
                              Original Post
                            </span>
                          )}
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none">
                          <p className="text-card-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                            {post.content}
                          </p>
                        </div>

                        <div className="flex gap-4 mt-6 pt-4 border-t border-border/50">
                          <button
                            onClick={async () => {
                              // Optimistic update
                              const updatedPosts = selectedTopic.posts.map(
                                (p: any) => {
                                  if (p.id === post.id) {
                                    return { ...p, likes: (p.likes || 0) + 1 };
                                  }
                                  return p;
                                }
                              );

                              const updatedTopic = {
                                ...selectedTopic,
                                posts: updatedPosts,
                              };
                              setSelectedTopic(updatedTopic);
                              setForumTopics(
                                forumTopics.map((t) =>
                                  t.id === updatedTopic.id ? updatedTopic : t
                                )
                              );

                              // API call
                              try {
                                await fetch("/api/forum/posts", {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    postId: post.id,
                                    action: "like",
                                  }),
                                });
                              } catch (e) {
                                console.error("Failed to like post", e);
                              }
                            }}
                            className="text-[10px] font-black text-muted-foreground hover:text-iu-blue flex items-center gap-3 transition-all px-4 py-2.5 rounded-xl hover:bg-iu-blue/5 border border-transparent hover:border-iu-blue/20 uppercase tracking-[0.2em]"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{post.likes || 0}</span>
                            <span className="hidden sm:inline">
                              {language === "de" ? "Gefällt mir" : "Like"}
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setReplyContent((prev) => {
                                const quote = `> ${post.content.split("\n").join("\n> ")}\n\n`;
                                return prev ? `${prev}\n${quote}` : quote;
                              });
                            }}
                            className="text-[10px] font-black text-muted-foreground hover:text-iu-blue flex items-center gap-3 transition-all px-4 py-2.5 rounded-xl hover:bg-iu-blue/5 border border-transparent hover:border-iu-blue/20 uppercase tracking-[0.2em]"
                          >
                            <Quote className="w-4 h-4" />
                            <span>
                              {language === "de" ? "Zitieren" : "Quote"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Area */}
                <div className="pl-16 mt-8">
                  <div className="bg-card rounded-2xl p-1 border border-border shadow-lg">
                    <div className="p-4 border-b border-border/50 bg-muted/30 rounded-t-xl flex items-center gap-2">
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-2">
                        {language === "de"
                          ? "Antwort verfassen"
                          : "Write a Reply"}
                      </span>
                    </div>
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={5}
                      className="w-full px-6 py-4 bg-transparent text-foreground focus:outline-none resize-none placeholder:text-muted-foreground/50"
                      placeholder={
                        language === "de"
                          ? "Schreiben Sie Ihre Antwort hier..."
                          : "Type your reply here..."
                      }
                    />
                    <div className="p-3 flex justify-between items-center bg-muted/30 rounded-b-xl border-t border-border/50">
                      <div className="flex gap-2 px-2">
                        <button
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors"
                          title="Bold"
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors italic"
                          title="Italic"
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors"
                          title="Link"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={async () => {
                          if (!replyContent.trim() || !selectedTopic) return;

                          try {
                            const res = await fetch("/api/forum/posts", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                topicId: selectedTopic.id,
                                content: replyContent,
                              }),
                            });

                            if (res.ok) {
                              const data = await res.json();
                              const newReply = data.post;

                              const updatedTopic = {
                                ...selectedTopic,
                                posts: [...selectedTopic.posts, newReply],
                                replies: (selectedTopic.replies || 0) + 1,
                                lastPost: new Date().toLocaleDateString(
                                  "de-DE"
                                ),
                              };

                              setSelectedTopic(updatedTopic);
                              setForumTopics(
                                forumTopics.map((t) =>
                                  t.id === updatedTopic.id ? updatedTopic : t
                                )
                              );
                              setReplyContent("");
                            }
                          } catch (e) {
                            console.error("Failed to post reply", e);
                          }
                        }}
                        className="px-10 py-3 bg-iu-blue text-white font-black rounded-xl hover:bg-iu-blue transition-all shadow-xl shadow-iu-blue/25 active:scale-95"
                      >
                        {language === "de" ? "Antworten" : "Post Reply"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Video Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            onClick={() => setPlayingVideo(null)}
          />
          <div className="relative w-full max-w-4xl bg-card rounded-[2rem] overflow-hidden shadow-2xl border border-border animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/50 bg-card/80">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-iu-blue flex items-center justify-center text-white shadow-lg">
                  <Video size={20} />
                </div>
                <div>
                  <h3 className="font-black text-foreground text-xl tracking-tight">
                    {playingVideo.title}
                  </h3>
                  <p className="text-[9px] text-iu-blue font-black uppercase tracking-[0.15em] mt-0.5">
                    {course.title}{" "}
                    <span className="mx-2 text-iu-blue/30">|</span>{" "}
                    {playingVideo.duration}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPlayingVideo(null)}
                className="p-4 rounded-2xl bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-95 group"
              >
                <X
                  size={28}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </button>
            </div>

            {/* Video Container */}
            <div className="aspect-video bg-black">
              <iframe
                width="100%"
                height="100%"
                src={`${getEmbedUrl(playingVideo.url)}?autoplay=1`}
                title={playingVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-card/80 border-t border-border/50 flex justify-between items-center px-6">
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-50">
                IU Module Player
              </span>
              <button
                onClick={() => setPlayingVideo(null)}
                className="px-6 py-2.5 bg-iu-blue text-white font-bold text-sm rounded-xl hover:bg-iu-blue/90 transition-all active:scale-95"
              >
                {language === "de" ? "Schließen" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
