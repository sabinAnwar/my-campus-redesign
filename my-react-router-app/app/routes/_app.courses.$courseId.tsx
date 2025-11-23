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
} from "lucide-react";
import { TaskKind } from "@prisma/client";
import { saveRecentFile } from "../lib/recentFiles";
import { prisma } from "~/lib/prisma";
import { calculateDaysLeft } from "~/lib/tasksSample";
import { TRANSLATIONS, getCourseConfig } from "../data/coursesConfig";

type CourseSubmission = {
  id: number;
  title: string;
  course: string;
  type: string;
  courseCode?: string;
  professor?: string;
  dueDateIso: string;
  dueDate: string;
  correctionDate: string;
  status: "pending" | "submitted";
  similarity?: number;
  daysUntilDue: number;
  submissions: any[];
};

export const loader = async ({ params }: { params: { courseId?: string } }) => {
  const formatGermanDate = (date: Date) =>
    date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  const courseNameMap: Record<number, { course: string; courseCode?: string; professor?: string }> = {
    4: { course: "E-Commerce", courseCode: "ECOM301", professor: "Prof. Dr. Wagner" },
  };

  const courseIdNum = params.courseId ? Number(params.courseId) : NaN;
  const meta = courseNameMap[courseIdNum];

  if (!meta) {
    return { submissions: [] };
  }

  // Canonical tasks (shared with Tasks page) so dates/types stay in sync
  const canonicalTasks = [
    {
      title: "Hausarbeit: Customer Journey im Omnichannel Commerce",
      course: "E-Commerce",
      kind: TaskKind.ABGABE,
      type: "Hausarbeit",
      dueDate: new Date("2025-12-05"),
    },
    {
      title: "Projektarbeit: Commerce Plattform Redesign",
      course: "Commerce Engineering",
      kind: TaskKind.ABGABE,
      type: "Projektarbeit",
      dueDate: new Date("2025-12-20"),
    },
  ].filter((t) => t.course === meta.course);

  await Promise.all(
    canonicalTasks.map(async (task) => {
      const existing = await prisma.studentTask.findFirst({
        where: { title: task.title, course: task.course, type: task.type },
      });
      if (existing) {
        await prisma.studentTask.update({
          where: { id: existing.id },
          data: { dueDate: task.dueDate, kind: task.kind },
        });
      } else {
        await prisma.studentTask.create({ data: task });
      }
    })
  );

  const allowedTitles = canonicalTasks.map((t) => t.title);

  const rows = await prisma.studentTask.findMany({
    where: { kind: TaskKind.ABGABE, course: meta.course, title: { in: allowedTitles } },
    orderBy: { dueDate: "asc" },
  });

  const submissions: CourseSubmission[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    course: row.course,
    type: row.type,
    courseCode: meta.courseCode,
    professor: meta.professor,
    dueDateIso: new Date(row.dueDate).toISOString().slice(0, 10),
    dueDate: formatGermanDate(new Date(row.dueDate)),
    correctionDate: formatGermanDate(
      new Date(new Date(row.dueDate).setDate(new Date(row.dueDate).getDate() + 14))
    ),
    status: "pending",
    similarity: undefined,
    // ensure UI fields expected by the tab
    submissions: [],
    daysUntilDue: calculateDaysLeft(new Date(row.dueDate).toISOString().slice(0, 10)),
  }));

  return { submissions };
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const loaderData = (useLoaderData() as { submissions?: CourseSubmission[] }) || {};
  const courseSubmissions: CourseSubmission[] = loaderData.submissions ?? [];

  const loadSavedStatus = () => {
    if (typeof window === "undefined") return {} as Record<number, { status: "pending" | "submitted"; similarity?: number }>;
    try {
      return JSON.parse(localStorage.getItem("submissionStatus") || "{}") as Record<
        number,
        { status: "pending" | "submitted"; similarity?: number }
      >;
    } catch {
      return {};
    }
  };

  const persistStatus = (next: Record<number, { status: "pending" | "submitted"; similarity?: number }>) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("submissionStatus", JSON.stringify(next));
  };

  const [savedStatus, setSavedStatus] = useState<Record<number, { status: "pending" | "submitted"; similarity?: number }>>(
    loadSavedStatus()
  );

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
  const [selectedSubmission, setSelectedSubmission] = useState<CourseSubmission | null>(null);
  const [accepted, setAccepted] = useState<{ honor: boolean; privacy: boolean }>({
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
      alert(language === "de" ? "Bitte lade deine Datei hoch." : "Please upload your file.");
      return;
    }
    if (!selectedSubmission) return;

    const similarity = Math.floor(Math.random() * 10 + 5);
    setSubmissions((prev) => {
      const updated = prev.map((s) =>
        s.id === selectedSubmission.id ? { ...s, status: "submitted", similarity } : s
      );
      const persisted: Record<number, { status: "pending" | "submitted"; similarity?: number }> = {};
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
  const [language, setLanguage] = useState<"de" | "en">("de");
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];
  const courses = getCourseConfig(language);
  
  // Find the course by ID
  const course = courses.find((c) => c.id === Number(courseId));

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
      const updated = forumTopics.find(t => t.id === selectedTopic.id);
      if (updated) {
        // Preserve local optimistic updates if needed, but for now just sync
        setSelectedTopic(updated);
      }
    }
  }, [forumTopics]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };



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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/courses")}
                className="p-2 hover:bg-accent rounded-lg transition-all duration-200 hover:text-primary text-card-foreground"
              >
                ← {t.back}
              </button>
              <div className="border-l border-border pl-4">
                <h1 className="text-xl font-black text-card-foreground">
                  {course.code}: {course.title}
                </h1>
                <p className="text-sm text-primary font-semibold">
                  {course.instructor}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-1">
            {[
              { id: "overview", icon: ClipboardList, label: t.overview },
              { id: "resources", icon: FolderOpen, label: t.resources },
              { id: "videos", icon: Video, label: t.videos },
              { id: "coursefeed", icon: Rss, label: "Course Feed®" },
              {
                id: "abgabe",
                icon: PencilLine,
                label: language === "de" ? "Abgabe" : "Submissions",
              },
              {
                id: "online-tests",
                icon: ClipboardCheck,
                label:
                  language === "de"
                    ? "Online Tests & Evaluationen"
                    : "Online Tests & Evaluations",
              },
              { id: "notes", icon: FileText, label: "Notizen" },
              { id: "forum", icon: MessageSquare, label: t.forum },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Exam Information Alert */}
            <div className="bg-card rounded-2xl border-2 border-destructive/20 p-8 shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400 flex-shrink-0" />
                <h3 className="text-2xl font-black text-card-foreground">
                  {language === "de"
                    ? "Wichtig: Prüfungsinformation"
                    : "Important: Exam Information"}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <p className="text-xs uppercase tracking-wider font-semibold text-red-600 dark:text-red-400">
                      {language === "de" ? "Prüfungsdatum" : "Exam Date"}
                    </p>
                  </div>
                  <p className="text-3xl font-black text-card-foreground">
                    15. Feb 2025
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <p className="text-xs uppercase tracking-wider font-semibold text-red-600 dark:text-red-400">
                      {language === "de" ? "Uhrzeit" : "Time"}
                    </p>
                  </div>
                  <p className="text-3xl font-black text-card-foreground">
                    09:00 Uhr
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <p className="text-xs uppercase tracking-wider font-semibold text-red-600 dark:text-red-400">
                      {language === "de" ? "Ort" : "Location"}
                    </p>
                  </div>
                  <p className="text-3xl font-black text-card-foreground">
                    Hörsaal H1
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">
                    {t.credits}
                  </p>
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <p className="text-4xl font-black text-primary">
                  {course.credits}
                </p>
              </div>
              <div className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">
                    {t.progress || "Progress"}
                  </p>
                  <BarChart3 className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <p className="text-4xl font-black text-primary">
                  {course.progress}%
                </p>
              </div>
              <div className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">
                    {t.semester}
                  </p>
                  <CalendarDays className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <p className="text-2xl font-black text-cyan-600 dark:text-cyan-300">
                  W24/25
                </p>
              </div>
            </div>

            {/* Tutor Information */}
            <div className="bg-card rounded-2xl shadow-md border border-border p-8 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl font-black text-card-foreground mb-6 flex items-center gap-3">
                <GraduationCap className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
                {language === "de" ? "Dozent" : "Instructor"}
              </h3>
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-border">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 dark:from-cyan-500 dark:to-cyan-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-md">
                  {course.instructor?.charAt(0) || "?"}
                </div>
                <div>
                  <p className="text-xl font-bold text-card-foreground mb-1">
                    {course.instructor}
                  </p>
                  <p className="text-sm text-muted-foreground font-semibold">
                    {language === "de" ? "Kursleiter" : "Course Instructor"}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-muted rounded-xl p-6 border border-border">
                <p className="text-sm font-bold text-card-foreground mb-4 uppercase tracking-wide">
                  {language === "de" ? "Kontakt" : "Contact"}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Mail className="h-4 w-4" />
                  {language === "de"
                    ? "E-Mail nicht verfügbar"
                    : "Email not available"}
                </p>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-md border border-border p-8 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-6">
                {t.courseDescription}
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                {course.description}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-muted rounded-xl p-6 border border-border">
                  <p className="text-xs uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                    {t.startDate}
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {course.startDate}
                  </p>
                </div>
                <div className="bg-muted rounded-xl p-6 border border-border">
                  <p className="text-xs uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                    {t.endDate}
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {course.endDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Upload */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 font-black shadow-sm">
                  T
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                    {language === "de" ? "Abgabe verwalten" : "Manage submission"}
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {selectedSubmission?.title}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accepted.honor}
                    onChange={(e) =>
                      setAccepted((prev) => ({
                        ...prev,
                        honor: e.target.checked,
                      }))
                    }
                    className="mt-1 accent-neutral-900 dark:accent-white"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-200">
                    {language === "de"
                      ? "Ich bestätige die Eidesstattliche Erklärung."
                      : "I confirm the honor statement."}
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accepted.privacy}
                    onChange={(e) =>
                      setAccepted((prev) => ({
                        ...prev,
                        privacy: e.target.checked,
                      }))
                    }
                    className="mt-1 accent-neutral-900 dark:accent-white"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-200">
                    {language === "de"
                      ? "Ich akzeptiere den Datenschutz für den Upload."
                      : "I accept the privacy terms for upload."}
                  </span>
                </label>
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  uploadedFile
                    ? "border-neutral-600 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800/40"
                    : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 dark:hover:border-neutral-500 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40"
                }`}
              >
                {!uploadedFile && (
                  <>
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Upload className="h-10 w-10 text-neutral-700 dark:text-neutral-200" />
                      <p className="text-sm text-neutral-700 dark:text-neutral-200">
                        {language === "de"
                          ? "Datei hier ablegen oder klicken, um hochzuladen"
                          : "Drop file here or click to upload"}
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
                      className="cursor-pointer inline-block mt-4 bg-neutral-900 text-white text-sm px-4 py-2 rounded-md font-semibold shadow-sm hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
                    >
                      {language === "de" ? "Datei auswählen" : "Choose file"}
                    </label>
                  </>
                )}

                {uploadedFile && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 rounded-lg shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-neutral-900 dark:text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <div className="text-left">
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mt-4 overflow-hidden">
                      <div
                        className="h-2 bg-neutral-900 dark:bg-white animate-progress"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                    <p className="text-xs text-neutral-700 dark:text-neutral-200 mt-2 animate-fadeIn">
                      ✅ {language === "de" ? "Upload abgeschlossen." : "Upload complete."}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md text-sm font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                >
                  {language === "de" ? "Abbrechen" : "Cancel"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!accepted.honor || !accepted.privacy}
                  className={`px-4 py-2 rounded-md text-sm font-semibold shadow text-white transition-all ${
                    accepted.honor && accepted.privacy
                      ? "bg-neutral-900 hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                      : "bg-neutral-400 dark:bg-neutral-700 cursor-not-allowed"
                  }`}
                >
                  {language === "de" ? "Hochladen & Bestätigen" : "Upload & Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Resources Tab - Expandable Sections */}
        {activeTab === "resources" && (
          <div className="rounded-2xl border border-border bg-card shadow-md overflow-hidden divide-y divide-border">
            {(() => {
              const courseSections = [
                {
                  id: "skripte",
                  label: "Skripte",
                  icon: FileText,
                  items:
                    course.resources
                      ?.filter((r: any) => r.type === "script")
                      .map((s: any) => ({
                        id: s.id,
                        title: s.title,
                        url: s.url,
                        size: s.size,
                        type: "script",
                      })) || [],
                  defaultExpanded: false,
                },
                {
                  id: "basisliteratur",
                  label: "Basisliteratur",
                  icon: Book,
                  items: [
                    {
                      id: 1,
                      title:
                        "Hartmann, Peter (2019): Mathematik für Informatiker. Ein praxisbezogenes Lehrbuch",
                      type: "book",
                      url: "#",
                    },
                  ],
                  defaultExpanded: true,
                },
                {
                  id: "weiterfuehrende-literatur",
                  label: "Weiterführende Literatur",
                  icon: BookOpen,
                  items:
                    course.resources
                      ?.filter((r: any) => r.type === "furtherLiterature")
                      .map((lit: any) => ({
                        id: lit.id,
                        title: lit.title,
                        url: lit.url,
                        isExternal: lit.isExternal || false,
                        type: "literature",
                      })) || [],
                  defaultExpanded: false,
                },
                {
                  id: "repetitorium",
                  label: "Repetitorium",
                  icon: GraduationCap,
                  items: [],
                  defaultExpanded: false,
                },
                {
                  id: "foliensaetze",
                  label: "Foliensätze",
                  icon: Presentation,
                  items:
                    course.resources
                      ?.filter((r: any) => r.type === "file" && r.teacher)
                      .map((file: any) => ({
                        id: file.id,
                        title: file.title,
                        url: file.url,
                        size: file.size,
                        type: "file",
                        teacher: file.teacher,
                      })) || [],
                  defaultExpanded: false,
                },
                {
                  id: "musterklausur",
                  label: "Musterklausur",
                  icon: ClipboardCheck,
                  items:
                    course.resources
                      ?.filter((r: any) => r.type === "musterklausur")
                      .map((mk: any) => ({
                        id: mk.id,
                        title: mk.title,
                        url: mk.url,
                        size: mk.size,
                        type: "musterklausur",
                      })) || [],
                  defaultExpanded: false,
                },
                {
                  id: "podcasts",
                  label: "Podcasts",
                  icon: Headphones,
                  items:
                    course.resources
                      ?.filter((r: any) => r.type === "podcast")
                      .map((podcast: any) => ({
                        id: podcast.id,
                        title: podcast.title,
                        url: podcast.url,
                        duration: podcast.duration,
                        type: "podcast",
                      })) || [],
                  defaultExpanded: false,
                },
                {
                  id: "dokumente-tutorium",
                  label: "Dokumente Tutorium",
                  icon: Users,
                  items: [],
                  defaultExpanded: false,
                },
              ];

              return courseSections.map((section) => {
                const isExpanded =
                  expandedSections[section.id] !== undefined
                    ? expandedSections[section.id]
                    : section.defaultExpanded;

                return (
                  <div key={section.id} className="p-0">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent transition-colors duration-300 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <section.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-base font-semibold text-card-foreground">
                          {section.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <Minus className="h-4 w-4 text-slate-500" />
                        ) : (
                          <Plus className="h-4 w-4 text-slate-500" />
                        )}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50">
                        {section.items.length > 0 ? (
                          <div className="space-y-2">
                            {section.items.map((item: any) => {
                              const handleFileClick = (e: React.MouseEvent) => {
                                e.preventDefault();

                                // Detect file type from name and section
                                let fileType = item.type;
                                if (!fileType) {
                                  const fileName = item.title.toLowerCase();
                                  if (fileName.endsWith(".pdf")) {
                                    fileType = "pdf";
                                  } else if (
                                    fileName.endsWith(".xlsx") ||
                                    fileName.endsWith(".xls")
                                  ) {
                                    fileType = "excel";
                                  } else if (
                                    fileName.endsWith(".mp3") ||
                                    fileName.endsWith(".mp4") ||
                                    fileName.endsWith(".wav")
                                  ) {
                                    fileType = "podcast";
                                  } else if (section.id === "podcasts") {
                                    fileType = "podcast";
                                  } else if (section.id === "skripte") {
                                    fileType = "pdf";
                                  } else if (section.id === "foliensaetze") {
                                    fileType =
                                      fileName.endsWith(".xlsx") ||
                                      fileName.endsWith(".xls")
                                        ? "excel"
                                        : "pdf";
                                  } else {
                                    fileType = "file";
                                  }
                                }

                                // Track file as recently opened
                                saveRecentFile(
                                  {
                                    id: item.id,
                                    name: item.title,
                                    type: fileType,
                                    url: item.url,
                                  },
                                  course.title, // course name
                                  null // studiengang
                                );

                                // Open file
                                if (item.url && item.url !== "#") {
                                  window.open(
                                    item.url,
                                    "_blank",
                                    "noopener,noreferrer"
                                  );
                                }
                              };

                              return (
                                <div
                                  key={item.id}
                                  className="flex items-start gap-3 py-4 px-4 hover:bg-white dark:hover:bg-slate-800 rounded-lg cursor-pointer border border-transparent hover:border-cyan-200 dark:hover:border-cyan-700 transition-all duration-300 group"
                                  onClick={handleFileClick}
                                >
                                  <div className="mt-1 p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-800/50 transition-colors">
                                    {item.type === "podcast" ? (
                                      <Play className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                                    ) : (
                                      <FileText className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <a
                                      href={item.url || "#"}
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-sm text-cyan-600 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200 hover:underline font-semibold line-clamp-2 transition-colors"
                                    >
                                      {item.title}
                                    </a>
                                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                                      {item.duration && (
                                        <span className="text-xs text-slate-500 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/70 px-2 py-1 rounded">
                                          ⏱️ {item.duration}
                                        </span>
                                      )}
                                      {item.size && (
                                        <span className="text-xs text-slate-500 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/70 px-2 py-1 rounded">
                                          📦 {item.size}
                                        </span>
                                      )}
                                    </div>
                                    {item.isExternal && (
                                      <span className="ml-2 text-xs text-slate-500 dark:text-slate-300">
                                        External tool
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 py-2">
                            Noch keine Einträge
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
              🎥 {t.videos}
            </h3>
            <div className="space-y-2">
              {course.resources
                ?.filter((r: any) => r.type === "video")
                .map((resource: any) => {
                  const handleVideoClick = () => {
                    // Track video as recently opened
                    saveRecentFile(
                      {
                        id: resource.id,
                        name: resource.title,
                        type: "video",
                        url: resource.url,
                        duration: resource.duration,
                      },
                      course.title, // course name
                      null // studiengang
                    );

                    // Open video
                    if (resource.url && resource.url !== "#") {
                      window.open(
                        resource.url,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }
                  };

                  return (
                    <div
                      key={resource.id}
                      className="bg-white dark:bg-transparent rounded-lg p-4 border border-blue-100 dark:border-slate-700 hover:shadow-md transition cursor-pointer flex items-center justify-between"
                      onClick={handleVideoClick}
                    >
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {resource.title}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-300">
                          ⏱️ {resource.duration}
                        </p>
                      </div>
                      <button
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 font-semibold rounded hover:bg-blue-200 dark:hover:bg-blue-900/60"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVideoClick();
                        }}
                      >
                        ▶️ {language === "de" ? "Abspielen" : "Play"}
                      </button>
                    </div>
                  );
                })}
              {(!course.resources ||
                course.resources.filter((r: any) => r.type === "video")
                  .length === 0) && (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                  Noch keine Videos verfügbar
                </p>
              )}
            </div>
          </div>
        )}

        {/* Course Feed Tab */}
        {activeTab === "coursefeed" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                📰 Course Feed®
              </h3>
            </div>

            <div className="bg-white dark:bg-transparent rounded-lg p-8 border border-slate-200 dark:border-slate-700 text-center max-w-md mx-auto">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4">
                Course Feed®
              </h3>

              {/* Course Feed Image */}
              <div className="mb-6 flex justify-center">
                <img
                  src="/course-feed.png"
                  alt="Course Feed"
                  className="w-48 h-40 object-contain"
                />
              </div>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                {language === "de"
                  ? "Interagieren Sie mit Ihren Online-Tutoren und Mitstudierenden, stellen Sie Fragen und nehmen Sie an Live-Lehrveranstaltungen teil."
                  : "Interact with your online tutors and fellow students, ask questions and participate in live teaching events."}
              </p>

              {/* Sign Up Button */}
              <button className="w-full px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded hover:bg-slate-800 dark:hover:bg-slate-100 transition">
                {language === "de" ? "Anmelden" : "Sign up"}
              </button>
            </div>
          </div>
        )}

        {/* Abgabe (Submissions) Tab */}
        {activeTab === "abgabe" && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
              ✍️ {language === "de" ? "Abgabe" : "Submissions"}
            </h3>
            {submissions.length === 0 && (
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-6 text-center text-slate-600 dark:text-slate-300">
                {language === "de"
                  ? "Keine Abgaben für diesen Kurs vorhanden."
                  : "No submissions for this course yet."}
              </div>
            )}
            {submissions.map((assignment: any) => (
              <div
                key={assignment.id}
                className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-950/40"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 mb-1">
                      {assignment.title}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-1">
                      {assignment.course}
                      {assignment.courseCode ? ` · ${assignment.courseCode}` : ""}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-[11px] font-semibold">
                        {assignment.type}
                      </span>
                      {assignment.professor && (
                        <span className="text-[11px] text-neutral-600 dark:text-neutral-300">
                          {assignment.professor}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-sm text-xs font-semibold ${
                      assignment.status === "submitted"
                        ? "bg-neutral-900 text-white border border-neutral-900"
                        : "bg-neutral-100 text-neutral-800 border border-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700"
                    }`}
                  >
                    {assignment.status === "submitted" ? t.submitted : t.pending}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 border-t border-neutral-200 dark:border-neutral-800 pt-3">
                  <div>
                    <CalendarDays className="h-4 w-4 text-neutral-600 dark:text-neutral-300 inline mr-2" />
                    <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      {language === "de" ? "Abgabefrist:" : "Due Date:"}
                    </span>
                    <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50 mt-1">
                      {assignment.dueDate}
                    </p>
                  </div>
                  <div>
                    <ClipboardList className="h-4 w-4 text-neutral-600 dark:text-neutral-300 inline mr-2" />
                    <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      {language === "de" ? "Korrektur:" : "Correction:"}
                    </span>
                    <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50 mt-1">
                      {assignment.correctionDate}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
                  <span
                    className={`px-2 py-1 rounded-sm border ${
                      assignment.daysUntilDue > 5
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100 dark:border-emerald-800"
                        : assignment.daysUntilDue > 0
                          ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-800"
                          : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-100 dark:border-rose-800"
                    }`}
                  >
                    ⏳{" "}
                    {assignment.daysUntilDue > 0
                      ? `${assignment.daysUntilDue} Tage`
                      : "Überfällig"}
                  </span>
                  <span className="px-2 py-1 rounded-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                    📁 {assignment.course}
                  </span>
                </div>

                {assignment.status !== "submitted" && (
                  <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    {assignment.daysUntilDue > 0 ? (
                      <button
                        className="w-full py-2 text-sm font-semibold bg-neutral-900 text-white rounded-md hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
                        onClick={() => openModal(assignment)}
                      >
                        Abgabe verwalten
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2 text-sm font-semibold bg-neutral-400 dark:bg-neutral-700 text-white rounded-md cursor-not-allowed"
                      >
                        Frist verpasst – keine Abgabe möglich
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Online Tests & Evaluationen Tab */}
        {activeTab === "online-tests" && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
              📋{" "}
              {language === "de"
                ? "Online Tests & Evaluationen"
                : "Online Tests & Evaluations"}
            </h3>

            {/* Exam Date Information Card */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/40 dark:to-orange-950/30 rounded-lg border-2 border-red-200 dark:border-red-900/60 p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📅</div>
                <div className="flex-1">
                  <h4 className="text-lg font-black text-red-900 dark:text-red-100 mb-2">
                    {language === "de" ? "Prüfungstermin" : "Exam Date"}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {language === "de" ? "Datum" : "Date"}
                      </p>
                      <p className="text-lg font-black text-red-700 dark:text-red-200">
                        15. Februar 2025
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {language === "de" ? "Uhrzeit" : "Time"}
                      </p>
                      <p className="text-lg font-black text-red-700 dark:text-red-200">
                        09:00 - 11:00 Uhr
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded border border-red-200 dark:border-red-800">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">
                        ⚠️ {language === "de" ? "Ort:" : "Location:"}
                      </span>{" "}
                      Hörsaal H1, Hauptgebäude
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Online Tests Section */}
            {(() => {
              const onlineTests =
                course.resources?.filter(
                  (r: any) => r.type === "onlineTest" || r.type === "test"
                ) || [];
              return (
                <div className="bg-white dark:bg-transparent rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
                    <h4 className="font-black text-slate-900 dark:text-slate-100">
                      🧪 {language === "de" ? "Online Tests" : "Online Tests"}
                    </h4>
                  </div>
                  {onlineTests.length > 0 ? (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                      {onlineTests.map((test: any) => (
                        <div
                          key={test.id}
                          className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                                {test.title}
                              </h5>
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                ⏱️ 45 Minuten
                              </p>
                            </div>
                            <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                              {language === "de" ? "Verfügbar" : "Available"}
                            </span>
                          </div>
                          <a
                            href={test.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700/80 transition"
                          >
                            ▶️{" "}
                            {language === "de"
                              ? "Test starten"
                              : "Start Test"}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                      <p>
                        {language === "de"
                          ? "Keine Online Tests verfügbar"
                          : "No online tests available"}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Evaluations Section */}
            {(() => {
              const evaluations =
                course.resources?.filter((r: any) => r.type === "evaluation") ||
                [];
              return (
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mt-6">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
                    <h4 className="font-black text-slate-900 dark:text-slate-100">
                      ⭐ {language === "de" ? "Evaluationen" : "Evaluations"}
                    </h4>
                  </div>
                  {evaluations.length > 0 ? (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                      {evaluations.map((evaluation: any) => (
                        <div
                          key={evaluation.id}
                          className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                                {evaluation.title}
                              </h5>
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                {language === "de"
                                  ? "Bitte bewerten Sie diesen Kurs"
                                  : "Please rate this course"}
                              </p>
                            </div>
                            <span className="text-xs font-semibold px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                              {language === "de" ? "Umfrage" : "Survey"}
                            </span>
                          </div>
                          <a
                            href={evaluation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 dark:hover:bg-purple-700/80 transition"
                          >
                            📝{" "}
                            {language === "de" ? "Teilnehmen" : "Participate"}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                      <p>
                        {language === "de"
                          ? "Keine Evaluationen verfügbar"
                          : "No evaluations available"}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="space-y-4">
            <div
              className="bg-white dark:bg-transparent rounded-lg border border-blue-100 dark:border-slate-700 overflow-hidden"
              style={{ height: "800px" }}
            >
              <iframe
                src="https://study-scribe-83.lovable.app/"
                title="Study Scribe - Note Taking"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                allow="camera; microphone; clipboard-read; clipboard-write"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Forum Tab */}
        {activeTab === "forum" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {forumView === "list" && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-card-foreground tracking-tight">
                      {t.forum}
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      {language === "de" 
                        ? "Diskutieren Sie mit anderen Kursteilnehmern" 
                        : "Discuss with other course participants"}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowNewTopicModal(true)}
                    className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {t.createTopic}
                  </button>
                </div>

                {/* New Topic Modal */}
                {showNewTopicModal && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-start justify-center px-4 py-10 lg:px-8 lg:py-16 animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-card rounded-2xl shadow-2xl border border-border/50 max-w-2xl w-full p-8 scale-100 animate-in zoom-in-95 duration-200 relative overflow-hidden max-h-[90vh] overflow-y-auto">
                      {/* Modal Glow Effect */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                      
                      <div className="relative">
                        <div className="flex justify-between items-center mb-8">
                          <h3 className="text-2xl font-black text-card-foreground tracking-tight">
                            {language === "de" ? "Neues Thema erstellen" : "Create New Topic"}
                          </h3>
                          <button 
                            onClick={() => setShowNewTopicModal(false)}
                            className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-accent rounded-full"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                              {language === "de" ? "Titel" : "Title"}
                            </label>
                            <input
                              type="text"
                              value={newTopicTitle}
                              onChange={(e) => setNewTopicTitle(e.target.value)}
                              className="w-full px-4 py-3.5 rounded-xl border border-border bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                              placeholder={language === "de" ? "Worum geht es?" : "What is this about?"}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                              {language === "de" ? "Inhalt" : "Content"}
                            </label>
                            <textarea
                              value={newTopicContent}
                              onChange={(e) => setNewTopicContent(e.target.value)}
                              rows={8}
                              className="w-full px-4 py-3.5 rounded-xl border border-border bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
                              placeholder={language === "de" ? "Teilen Sie Ihre Gedanken..." : "Share your thoughts..."}
                            />
                          </div>
                          <div className="flex gap-3 justify-end pt-4 border-t border-border/50">
                            <button
                              onClick={() => {
                                setShowNewTopicModal(false);
                                setNewTopicTitle("");
                                setNewTopicContent("");
                              }}
                              className="px-6 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                            >
                              {language === "de" ? "Abbrechen" : "Cancel"}
                            </button>
                            <button
                              onClick={async () => {
                                if (!newTopicTitle.trim() || !newTopicContent.trim()) return;
                                
                                try {
                                  const res = await fetch("/api/forum", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      courseId: course.id,
                                      title: newTopicTitle,
                                      content: newTopicContent
                                    })
                                  });
                                  
                                  if (res.ok) {
                                    const data = await res.json();
                                    setForumTopics(prev => [data.topic, ...prev]);
                                    setNewTopicTitle("");
                                    setNewTopicContent("");
                                    setShowNewTopicModal(false);
                                  }
                                } catch (e) {
                                  console.error("Failed to create topic", e);
                                }
                              }}
                              className="px-8 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                            >
                              {language === "de" ? "Veröffentlichen" : "Publish"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Topics List */}
                <div className="grid gap-3">
                  {forumTopics.map((topic: any) => (
                    <div
                      key={topic.id}
                      onClick={() => {
                        // Update view count via API
                        if (topic.id) {
                           fetch("/api/forum", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ topicId: topic.id, action: "view" })
                           }).catch(console.error);
                        }
                        
                        // Optimistic update
                        const updatedTopics = forumTopics.map(t => {
                          if (t.id === topic.id) {
                            return { ...t, views: (t.views || 0) + 1 };
                          }
                          return t;
                        });
                        setForumTopics(updatedTopics);
                        
                        const updatedTopic = updatedTopics.find(t => t.id === topic.id);
                        setSelectedTopic(updatedTopic);
                        setForumView("thread");
                      }}
                      className={`group relative rounded-xl p-5 border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                        topic.status === "pinned"
                          ? "bg-gradient-to-br from-amber-50/50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/10 border-amber-200/50 dark:border-amber-800/50"
                          : "bg-card hover:bg-accent/50 border-border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            {topic.status === "pinned" && (
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center" title="Pinned">
                                <Flag className="w-3 h-3 fill-current" />
                              </span>
                            )}
                            <h4 className={`font-bold text-lg truncate pr-4 ${
                              topic.status === "pinned" ? "text-amber-900 dark:text-amber-100" : "text-card-foreground group-hover:text-primary transition-colors"
                            }`}>
                              {topic.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                {topic.author.charAt(0)}
                              </div>
                              {topic.author}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-border"></span>
                            <span>{topic.lastPost}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex flex-col items-end gap-1 text-muted-foreground">
                            <span className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md border border-border/50">
                              <MessageSquare className="w-3 h-3" />
                              <span className="font-medium text-foreground">{topic.replies}</span>
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-1 text-muted-foreground">
                            <span className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md border border-border/50">
                              <Eye className="w-3 h-3" />
                              <span className="font-medium text-foreground">{topic.views}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {forumView === "thread" && selectedTopic && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                {/* Navigation */}
                <button
                  onClick={() => setForumView("list")}
                  className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  {language === "de" ? "Zurück zur Übersicht" : "Back to Overview"}
                </button>

                {/* Thread Header */}
                <div className="bg-card rounded-2xl p-8 border border-border shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      {selectedTopic.status === "pinned" && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-800">
                          Pinned
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                        Discussion
                      </span>
                    </div>
                    
                    <h2 className="text-3xl font-black text-card-foreground mb-6 leading-tight tracking-tight">
                      {selectedTopic.title}
                    </h2>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground border-t border-border pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">
                          {selectedTopic.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{selectedTopic.author}</p>
                          <p className="text-xs">Topic Starter</p>
                        </div>
                      </div>
                      <div className="h-8 w-px bg-border"></div>
                      <div className="flex gap-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-lg leading-none">{selectedTopic.replies}</span>
                          <span className="text-xs uppercase tracking-wider">Replies</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-lg leading-none">{selectedTopic.views}</span>
                          <span className="text-xs uppercase tracking-wider">Views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Posts Stream */}
                <div className="space-y-4 relative max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                  <div className="absolute left-8 top-0 bottom-0 w-px bg-border/50 -z-10"></div>
                  
                  {selectedTopic.posts?.map((post: any, index: number) => (
                    <div key={post.id} className={`group relative pl-16 transition-all duration-500 ${index === 0 ? 'animate-in fade-in slide-in-from-bottom-4' : ''}`}>
                      {/* Avatar Connector */}
                      <div className="absolute left-0 top-0 w-16 flex justify-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm border-4 border-background z-10 ${
                          index === 0 
                            ? "bg-gradient-to-br from-primary to-purple-600 text-primary-foreground" 
                            : "bg-card text-card-foreground border-border"
                        }`}>
                          {post.author.charAt(0)}
                        </div>
                      </div>

                      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all group-hover:border-primary/20">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                          <div>
                            <h4 className="font-bold text-foreground text-lg">{post.author}</h4>
                            <p className="text-xs text-muted-foreground font-medium">{post.timestamp}</p>
                          </div>
                          {index === 0 && (
                            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary text-xs font-bold border border-primary/20 shadow-sm">
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
                              const updatedPosts = selectedTopic.posts.map((p: any) => {
                                if (p.id === post.id) {
                                  return { ...p, likes: (p.likes || 0) + 1 };
                                }
                                return p;
                              });
                              
                              const updatedTopic = { ...selectedTopic, posts: updatedPosts };
                              setSelectedTopic(updatedTopic);
                              setForumTopics(forumTopics.map(t => t.id === updatedTopic.id ? updatedTopic : t));

                              // API call
                              try {
                                await fetch("/api/forum/posts", {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ postId: post.id, action: "like" })
                                });
                              } catch (e) {
                                console.error("Failed to like post", e);
                              }
                            }}
                            className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{post.likes || 0}</span>
                            <span className="hidden sm:inline">{language === "de" ? "Gefällt mir" : "Like"}</span>
                          </button>
                          <button 
                            onClick={() => {
                              setReplyContent((prev) => {
                                const quote = `> ${post.content.split('\n').join('\n> ')}\n\n`;
                                return prev ? `${prev}\n${quote}` : quote;
                              });
                            }}
                            className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5"
                          >
                            <Quote className="w-4 h-4" />
                            <span>{language === "de" ? "Zitieren" : "Quote"}</span>
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
                        {language === "de" ? "Antwort verfassen" : "Write a Reply"}
                      </span>
                    </div>
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={5}
                      className="w-full px-6 py-4 bg-transparent text-foreground focus:outline-none resize-none placeholder:text-muted-foreground/50"
                      placeholder={language === "de" ? "Schreiben Sie Ihre Antwort hier..." : "Type your reply here..."}
                    />
                    <div className="p-3 flex justify-between items-center bg-muted/30 rounded-b-xl border-t border-border/50">
                      <div className="flex gap-2 px-2">
                        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors" title="Bold">
                          B
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors italic" title="Italic">
                          I
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors underline" title="Underline">
                          U
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
                                    content: replyContent
                                })
                            });

                            if (res.ok) {
                                const data = await res.json();
                                const newReply = data.post;
                                
                                const updatedTopic = {
                                    ...selectedTopic,
                                    posts: [...selectedTopic.posts, newReply],
                                    replies: (selectedTopic.replies || 0) + 1,
                                    lastPost: new Date().toLocaleDateString("de-DE")
                                };
                                
                                setSelectedTopic(updatedTopic);
                                setForumTopics(forumTopics.map(t => t.id === updatedTopic.id ? updatedTopic : t));
                                setReplyContent("");
                            }
                          } catch (e) {
                            console.error("Failed to post reply", e);
                          }
                        }}
                        className="px-8 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
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
    </div>
  )};
