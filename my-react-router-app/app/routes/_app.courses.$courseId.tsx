import React, { useEffect, useState, useCallback } from "react";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useRevalidator,
} from "react-router-dom";
import path from "node:path";
import fs from "node:fs/promises";
import {
  ClipboardList,
  FolderOpen,
  PencilLine,
  MessageSquare,
  Rss,
  FileText,
  ClipboardCheck,
  Video,
} from "lucide-react";
import { saveRecentFile } from "~/utils/recentFiles";
import { saveRecentCourse } from "~/utils/recentCourses";
import { showErrorToast, showSuccessToast } from "~/utils/toast";
import { prisma } from "~/services/prisma";
import { TimeoutError, withTimeout } from "~/utils/loaderUtils";
import { calculateDaysLeft } from "~/utils/tasksSample";
import { TRANSLATIONS, getCourseConfig } from "../data/coursesConfig";
import { useLanguage } from "~/store/LanguageContext";
import type { CourseSubmission } from "~/types/course";
import type {
  Course,
  CourseDetailData,
  CourseResource,
  VideoResource,
} from "~/types/courseDetail";

// New Extractions
import { COURSE_TYPE_MAP } from "~/config/course";
import { formatGermanDate } from "~/utils/dateUtils";
import { getVideoThumbnailUrl } from "~/utils/videoUtils";
import { useSubmissionStatus } from "~/hooks/useSubmissionStatus";

// Components
import { CourseHeader } from "~/features/courses/detail/CourseHeader";
import { CourseTabNavigation } from "~/features/courses/detail/CourseTabNavigation";
import { CourseOverviewTab } from "~/features/courses/detail/CourseOverviewTab";
import { CourseResourcesTab } from "~/features/courses/detail/CourseResourcesTab";
import { CourseVideosTab } from "~/features/courses/detail/CourseVideosTab";
import { CourseFeedTab } from "~/features/courses/detail/CourseFeedTab";
import { CourseSubmissionsTab } from "~/features/courses/detail/CourseSubmissionsTab";
import { CourseOnlineTestsTab } from "~/features/courses/detail/CourseOnlineTestsTab";
import { CourseNotesTab } from "~/features/courses/detail/CourseNotesTab";
import { CourseForumTab } from "~/features/courses/detail/CourseForumTab";
import { UploadModal } from "~/features/courses/detail/UploadModal";
import { NewTopicModal } from "~/features/courses/detail/NewTopicModal";
import { VideoModal } from "~/features/courses/detail/VideoModal";
import publicStudyManifest from "~/data/public-study-files.json";

const COURSE_TIMEOUT_MS = 2500;
// Note: We no longer scan this directory at runtime to avoid Vercel size limits.
// See scripts/generate-study-manifest.js and vercel.json.
// const PUBLIC_STUDY_DIR = path.resolve(...);

const toResourceType = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (["mp4", "webm", "mov"].includes(ext)) return "video";
  if (["pdf"].includes(ext)) return "pdf";
  return "file";
};

const toPublicResourceType = (relPath: string, fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const lowerPath = relPath.toLowerCase();
  if (["mp4", "webm", "mov"].includes(ext)) return "video";
  if (["mp3", "wav", "m4a", "aac", "ogg"].includes(ext)) return "podcast";
  if (lowerPath.includes("/podcasts/")) return "podcast";
  if (lowerPath.includes("/skript/") || lowerPath.includes("/script/"))
    return "script";
  if (lowerPath.includes("/folien/")) return "slides";
  if (lowerPath.includes("/musterklausuren/")) return "exam";
  return "reading";
};

const sizeFromExt = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toUpperCase();
  return ext ? ext : undefined;
};

const titleFromPath = (filePath: string) => {
  const base = filePath.split("/").pop() || filePath;
  const name = base.replace(/\.[^/.]+$/, "");
  return name.replace(/[_-]+/g, " ").trim();
};

export const loader = async ({
  request,
  params,
}: {
  request: Request;
  params: { courseId?: string };
}) => {
  let errorMessage: string | null = null;
  const sessionToken = request.headers
    .get("Cookie")
    ?.split("session=")[1]
    ?.split(";")[0];

  let user = await withTimeout(
    prisma.session
      .findFirst({
        where: {
          token: sessionToken,
        },
        include: { user: true },
      })
      .then((s: any) => s?.user),
    COURSE_TIMEOUT_MS,
    "Loading user session timed out",
  ).catch((error) => {
    if (!errorMessage) {
      errorMessage =
        error instanceof TimeoutError
          ? "Course data is taking longer than expected."
          : "Course data is unavailable right now.";
    }
    return null;
  });

  // FALLBACK: If no user found, use Demo Student
  if (!user) {
    user = await withTimeout(
      prisma.user.findUnique({
        where: { email: "student.demo@iu-study.org" },
      }),
      COURSE_TIMEOUT_MS,
      "Loading demo user timed out",
    ).catch((error) => {
      if (!errorMessage) {
        errorMessage =
          error instanceof TimeoutError
            ? "Course data is taking longer than expected."
            : "Course data is unavailable right now.";
      }
      return null;
    });
  }

  // If still no user, return empty (should ideally redirect)
  if (!user) {
    console.warn(" Course Loader: No user found even after fallback.");
    return Response.json({
      submissions: [],
      course: null,
      user_id: 0,
      studiengangName: "",
      error: errorMessage || "User not found",
    });
  }
  const typedUser = user as any;
  console.log(
    ` Course Loader: User found: ${typedUser.email} (ID: ${typedUser.id})`,
  );

  const courseIdParam = params.courseId || "";
  const courseIdNum = Number(courseIdParam);
  const isNumeric = !isNaN(courseIdNum) && courseIdParam.trim() !== "";

  // Fetch course from DB with files
  console.log(` Course Loader: Fetching course with param ${courseIdParam}...`);

  const course = await withTimeout(
    prisma.course.findFirst({
      where: isNumeric
        ? { OR: [{ id: courseIdNum }, { code: courseIdParam }] }
        : { code: { equals: courseIdParam, mode: "insensitive" } },
      include: {
        files: {
          where: { user_id: typedUser.id },
        },
        major: true,
      },
    }),
    COURSE_TIMEOUT_MS,
    "Loading course data timed out",
  ).catch((error) => {
    console.error(" Course Loader: course query failed:", error);
    if (!errorMessage) {
      errorMessage =
        error instanceof TimeoutError
          ? "Course data is taking longer than expected."
          : "Course data is unavailable right now.";
    }
    return null;
  });

  const typedCourse = course as any;

  if (!typedCourse) {
    console.warn(` Course Loader: Course ${courseIdParam} not found in DB.`);

    // Attempt fallback to static config if not in DB
    const configCourses = getCourseConfig("de");
    const configMatch = configCourses.find(
      (c) =>
        c.id === courseIdNum ||
        c.code?.toLowerCase() === courseIdParam.toLowerCase(),
    );

    if (!configMatch) {
      return Response.json({
        submissions: [],
        course: null,
        user_id: typedUser.id,
        studiengangName: (typedUser as any).major?.name || "IU Studium",
        error: errorMessage || "Course not found",
      });
    }

    // Return static config data as course
    const fallbackData: Course = {
      id: configMatch.id,
      title: configMatch.title,
      name_de: configMatch.title,
      name_en: configMatch.title,
      instructor: "Dozent",
      description:
        "Dieses Modul vermittelt tiefgehende Kenntnisse im Fachbereich.",
      startDate: "01.10.2024",
      endDate: "31.03.2025",
      progress: configMatch.progress || 0,
      credits: configMatch.credits || 5,
      semester: parseInt(configMatch.semester as string) || 1,
      color: configMatch.color || "cyan",
      resources: [],
      code: configMatch.code,
      name: configMatch.title,
    };

    return {
      submissions: [],
      course: fallbackData,
      user_id: typedUser.id,
      studiengangName: (typedUser as any).major?.name || "IU Studium",
      error: errorMessage,
    };
  }

  console.log(` Course Loader: Course found: ${typedCourse.name}`);

  // Map database files to UI resources
  let resources: CourseResource[] = (typedCourse.files || []).map((f: any) => ({
    id: f.id,
    title: f.name,
    url: f.url,
    size: f.size || "Unknown",
    type:
      f.file_type === "video"
        ? "video"
        : f.file_type === "pdf"
          ? "script"
          : "file",
    duration: f.file_type === "video" ? f.size || "12:45" : undefined,
    date: formatGermanDate(f.uploaded_at),
  }));

  // Attach public study materials as dummy resources for current-semester courses
  if (Number(typedCourse.semester) === Number(typedUser.semester)) {
    try {
      // Use pre-generated manifest to avoid scanning large directory on Vercel
      const relPaths = (publicStudyManifest as string[]).filter(
        (p) => !p.endsWith("/.gitkeep") && !p.endsWith(".gitkeep"),
      );
      const publicResources: CourseResource[] = relPaths.map((relPath, idx) => {
        const fileName = relPath.split("/").pop() || relPath;
        const type = toPublicResourceType(relPath, fileName);
        return {
          id: `public-${typedCourse.id}-${idx}`,
          title: titleFromPath(relPath),
          url: `/uploads/studiengaenge/${relPath}`,
          type,
          size: sizeFromExt(fileName),
        };
      });
      const existingUrls = new Set(resources.map((r) => r.url));
      resources = [
        ...resources,
        ...publicResources.filter((r) => !existingUrls.has(r.url)),
      ];
    } catch (error) {
      console.warn(
        "Course Loader: failed to attach public study materials from manifest",
        error,
      );
    }
  }

  // Add comprehensive scripts and podcasts for all courses
  const weeks = 8; // 8 weeks of content per course
  const sampleResources: CourseResource[] = [];

  // Add comprehensive scripts and podcasts for all courses (only if not from database)
  const hasExistingVideos = resources.some((r) => r.type === "video");
  const hasExistingScripts = resources.some((r) => r.type === "script");

  if (!hasExistingVideos || !hasExistingScripts) {
    // Generate scripts for each week (only if missing)
    if (!hasExistingScripts) {
      for (let w = 1; w <= weeks; w++) {
        sampleResources.push({
          id: `script-${typedCourse.id}-${w}`,
          title: `${typedCourse.name} - Woche ${w} Skript`,
          url: "/uploads/modulhandbuch-winfo.pdf",
          type: "script",
          size: `${(1.2 + Math.random() * 2).toFixed(1)} MB`,
          date: formatGermanDate(
            new Date(Date.now() - (weeks - w) * 7 * 24 * 60 * 60 * 1000),
          ),
        });
      }
    }

    // Generate podcasts for each week
    for (let w = 1; w <= weeks; w++) {
      const minutes = 35 + Math.floor(Math.random() * 25);
      const seconds = Math.floor(Math.random() * 60);
      sampleResources.push({
        id: `podcast-${typedCourse.id}-${w}`,
        title: `${typedCourse.name} - Vorlesung Woche ${w}`,
        url: "https://www.youtube.com/embed/H1elmMBnykA",
        type: "podcast",
        size: "MP3",
        duration: `${minutes}:${seconds.toString().padStart(2, "0")}`,
        date: formatGermanDate(
          new Date(Date.now() - (weeks - w) * 7 * 24 * 60 * 60 * 1000),
        ),
      });
    }

    // Generate videos for each week (only if missing)
    if (!hasExistingVideos) {
      const videoUrls = [
        "https://www.youtube.com/embed/H1elmMBnykA",
        "https://www.youtube.com/embed/1Rs2ND1ryYc",
        "https://www.youtube.com/embed/Zftx68K-1D4",
        "https://www.youtube.com/embed/3qBXWUpoPHo",
      ];
      for (let w = 1; w <= weeks; w++) {
        const videoMinutes = 20 + Math.floor(Math.random() * 15);
        const videoSeconds = Math.floor(Math.random() * 60);
        const videoUrl = videoUrls[(typedCourse.id + w) % videoUrls.length];
        sampleResources.push({
          id: `video-${typedCourse.id}-${w}`,
          title: `${typedCourse.name} - Lektionsvideo Woche ${w}`,
          url: videoUrl,
          type: "video",
          size: "HD",
          duration: `${videoMinutes}:${videoSeconds.toString().padStart(2, "0")}`,
          date: formatGermanDate(
            new Date(Date.now() - (weeks - w) * 7 * 24 * 60 * 60 * 1000),
          ),
        });
      }
    }

    // Add sample resources to all courses
    const existingIds = new Set(resources.map((r) => r.id));
    resources = [
      ...resources,
      ...sampleResources.filter((r) => !existingIds.has(r.id)),
    ];
  }
  const tasks = (await withTimeout(
    prisma.studentTask.findMany({
      where: {
        user_id: typedUser.id,
        course: typedCourse.name,
      },
      orderBy: { due_date: "asc" },
    }),
    COURSE_TIMEOUT_MS,
    "Loading course tasks timed out",
  ).catch((error) => {
    if (!errorMessage) {
      errorMessage =
        error instanceof TimeoutError
          ? "Course data is taking longer than expected."
          : "Course data is unavailable right now.";
    }
    return [];
  })) as any[];

  let baseSubmissions: CourseSubmission[] = tasks
    .filter(
      (row: { title: string; kind: string }) =>
        !row.title.toLowerCase().includes("klausur") && row.kind !== "KLAUSUR",
    )
    .map((row: any) => ({
      id: row.id,
      title: row.title,
      course: row.course,
      type: row.type || "Abgabe",
      courseCode: typedCourse.code || `MOD-${typedCourse.id}`,
      professor: "Dozent", // Placeholder as we don't have this in Course model yet
      due_date_iso: new Date(row.due_date).toISOString().slice(0, 10),
      due_date: formatGermanDate(new Date(row.due_date)),
      correction_date: formatGermanDate(
        new Date(
          new Date(row.due_date).setDate(new Date(row.due_date).getDate() + 14),
        ),
      ),
      status: "pending",
      similarity: undefined,
      submissions: [],
      days_until_due: calculateDaysLeft(
        new Date(row.due_date).toISOString().slice(0, 10),
      ),
    }));

  // Enforce rule: 'Wissenschaftliches Arbeiten' has only ONE submission
  const isScientificWork = typedCourse.name === "Wissenschaftliches Arbeiten";
  const submissions =
    isScientificWork && baseSubmissions.length > 0
      ? [baseSubmissions[0]]
      : baseSubmissions;

  // Augment course object for UI
  const courseData: Course = {
    id: typedCourse.id,
    title: typedCourse.name,
    name_de: typedCourse.name_de || typedCourse.name,
    name_en: typedCourse.name_en || typedCourse.name,
    instructor: "Dozent",
    description:
      typedCourse.description ||
      "Dieses Modul vermittelt tiefgehende Kenntnisse im Fachbereich.",
    startDate: "01.10.2024",
    endDate: "31.03.2025",
    progress: Number(typedCourse.progress) || 0,
    credits: Number(typedCourse.credits) || 5,
    semester: Number(typedCourse.semester) || 1,
    color: typedCourse.color || "cyan",
    resources: resources,
    code: typedCourse.code,
    name: typedCourse.name,
  };

  return {
    submissions,
    course: courseData,
    user_id: typedUser.id,
    studiengangName: (user as any).major?.name || "IU Studium",
    error: errorMessage,
  };
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const loaderData = useLoaderData() as CourseDetailData;
  const revalidator = useRevalidator();
  const courseSubmissions: CourseSubmission[] = loaderData?.submissions ?? [];
  const { user_id, studiengangName } = loaderData || {};
  const { language } = useLanguage();
  const courses = getCourseConfig(language);
  const navigate = useNavigate();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const retryLabel = language === "de" ? "Erneut versuchen" : "Try again";

  // Find the course by ID or Code (from loader or fallback to config)
  const courseIdParam = courseId || "";
  const courseIdNum = Number(courseIdParam);
  const fallbackCourse = courses.find(
    (c) =>
      c.id === courseIdNum ||
      (c.code && c.code.toLowerCase() === courseIdParam.toLowerCase()),
  );
  const course: Course | null =
    loaderData?.course ||
    (fallbackCourse
      ? ({
          ...fallbackCourse,
          id: fallbackCourse.id,
          title: fallbackCourse.title,
          name: fallbackCourse.title,
          instructor: "Dozent", // defaults for fallback
          startDate: "01.10.2024",
          endDate: "31.03.2025",
          resources: [],
          credits: fallbackCourse.credits || 5,
          semester: parseInt(fallbackCourse.semester as string) || 1,
          color: fallbackCourse.color || "cyan",
          progress: fallbackCourse.progress || 0,
        } as unknown as Course)
      : null);

  useEffect(() => {
    if (course && user_id) {
      saveRecentCourse(
        {
          id: course.id,
          name: course.title || course.name || "",
          studiengang: studiengangName || "IU Studium",
          semester: `${course.semester}. Semester`,
          color: course.color || "cyan",
        },
        user_id,
      );
    }
  }, [course, user_id, studiengangName]);

  const translate = (value: string) =>
    language === "de" ? value : COURSE_TYPE_MAP[value]?.en || value;

  // Use custom hook for submission status persistence
  const { savedStatus, persistStatus } = useSubmissionStatus();

  const [submissions, setSubmissions] = useState<CourseSubmission[]>(
    courseSubmissions.map((s) => ({
      ...s,
      status: savedStatus[s.id]?.status ?? "pending",
      similarity: savedStatus[s.id]?.similarity,
      submitted_file_name: savedStatus[s.id]?.fileName,
      submitted_file_size: savedStatus[s.id]?.fileSize,
    })),
  );

  // Upload Modal State
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
        submitted_file_name: savedStatus[s.id]?.fileName,
        submitted_file_size: savedStatus[s.id]?.fileSize,
      })),
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

  const onAcceptChange = (field: "honor" | "privacy", checked: boolean) => {
    setAccepted((prev) => ({ ...prev, [field]: checked }));
  };

  const handleSubmit = () => {
    if (!accepted.honor || !accepted.privacy) {
      showErrorToast(
        language === "de"
          ? "Bitte akzeptiere die Eidesstattliche Erklärung und den Datenschutz."
          : "Please accept the honor and privacy statements.",
      );
      return;
    }
    if (!uploadedFile) {
      showErrorToast(
        language === "de"
          ? "Bitte lade deine Datei hoch."
          : "Please upload your file.",
      );
      return;
    }
    if (!selectedSubmission) return;

    const similarity = Math.floor(Math.random() * 10 + 5);
    setSubmissions((prev) => {
      const updated = prev.map((s) =>
        s.id === selectedSubmission.id
          ? {
              ...s,
              status: "submitted" as const,
              similarity,
              submitted_file_name: uploadedFile.name,
              submitted_file_size: uploadedFile.size,
            }
          : s,
      );
      const persisted: Record<
        number,
        {
          status: "pending" | "submitted";
          similarity?: number;
          fileName?: string;
          fileSize?: number;
        }
      > = {};
      const persistedByCourse: Record<
        string,
        {
          status: "pending" | "submitted";
          similarity?: number;
          fileName?: string;
          fileSize?: number;
        }
      > = {};
      const courseKeyBase =
        selectedSubmission.course || course?.title || course?.name || "Course";
      updated.forEach((s) => {
        if (s.status === "submitted") {
          persisted[s.id] = {
            status: s.status,
            similarity: s.similarity,
            fileName: s.submitted_file_name,
            fileSize: s.submitted_file_size,
          };
          persistedByCourse[`${courseKeyBase}::${s.title}`] = {
            status: s.status,
            similarity: s.similarity,
            fileName: s.submitted_file_name,
            fileSize: s.submitted_file_size,
          };
        }
      });
      persistStatus(persisted);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "submissionStatusByCourse",
          JSON.stringify(persistedByCourse),
        );
      }
      return updated;
    });
    setShowModal(false);
    showSuccessToast(
      language === "de" ? "Abgabe gespeichert." : "Submission saved.",
    );
  };

  const [activeTab, setActiveTab] = useState("overview");
  const [playingVideo, setPlayingVideo] = useState<VideoResource | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Forum state
  const [forumView, setForumView] = useState<"list" | "thread">("list");
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [forumTopics, setForumTopics] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("Student");
  const [likedPostIds, setLikedPostIds] = useState<number[]>([]);
  const [likedTopicIds, setLikedTopicIds] = useState<number[]>([]);

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
  const fetchTopics = useCallback(async () => {
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
        setSelectedTopic(updated);
      }
    }
  }, [forumTopics]);

  // If course not found, redirect to courses list
  useEffect(() => {
    if (!course && !loaderData?.error) {
      navigate("/courses");
    }
  }, [course, loaderData?.error, navigate]);

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="rounded-2xl border border-iu-red/30 bg-iu-red/5 p-6 text-sm text-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold">
              {language === "de"
                ? "Kurs nicht verfügbar"
                : "Course unavailable"}
            </p>
            <p className="text-muted-foreground">
              {language === "de"
                ? "Die Kursdaten konnten nicht geladen werden. Bitte versuche es erneut."
                : "Course data could not be loaded. Please try again."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => revalidator.revalidate()}
            className="inline-flex items-center justify-center rounded-full border border-iu-red/30 px-4 py-2 font-semibold text-iu-red hover:bg-iu-red/10 transition-colors"
          >
            {retryLabel}
          </button>
        </div>
      </div>
    );
  }

  // Handlers
  const handleFileClick = (item: CourseResource, sectionId: string) => {
    saveRecentFile(
      {
        id: item.id,
        name: item.title,
        type: item.type || sectionId,
        url: item.url,
        duration: item.duration,
      },
      course.name || course.title,
      studiengangName || "IU Studium",
    );
  };

  const handleVideoClick = (video: VideoResource) => {
    saveRecentFile(
      {
        id: video.id,
        name: video.title,
        type: "video",
        url: video.url,
        duration: video.duration,
      },
      course.name || course.title,
      studiengangName || "IU Studium",
    );
    setPlayingVideo(video);
  };

  const handleCreateTopicClick = () => {
    setShowNewTopicModal(true);
  };

  const handleTopicClick = (topic: any) => {
    const updatedTopic = forumTopics.find((t) => t.id === topic.id);
    setSelectedTopic(updatedTopic);
    setForumView("thread");
  };

  const handleBackToTopics = () => {
    setForumView("list");
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
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
          lastPost: new Date().toLocaleDateString("de-DE"),
        };

        setSelectedTopic(updatedTopic);
        setForumTopics(
          forumTopics.map((t) => (t.id === updatedTopic.id ? updatedTopic : t)),
        );
        setReplyContent("");
        showSuccessToast(
          language === "de" ? "Antwort gepostet!" : "Reply posted!",
        );
      }
    } catch (e) {
      console.error("Failed to post reply", e);
      showErrorToast(
        language === "de"
          ? "Antwort konnte nicht gepostet werden"
          : "Failed to post reply",
      );
    }
  };

  const handleLikePost = async (postId: number) => {
    if (!postId || likedPostIds.includes(postId)) return;
    try {
      const res = await fetch("/api/forum/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action: "like" }),
      });
      if (!res.ok) return;
      const data = await res.json().catch(() => null);
      setLikedPostIds((prev) => [...prev, postId]);
      if (selectedTopic) {
        const updatedTopic = {
          ...selectedTopic,
          posts: selectedTopic.posts.map((post: any) =>
            post.id === postId
              ? { ...post, likes: data?.likes ?? (post.likes || 0) + 1 }
              : post,
          ),
        };
        setSelectedTopic(updatedTopic);
        setForumTopics(
          forumTopics.map((t) => (t.id === updatedTopic.id ? updatedTopic : t)),
        );
      }
    } catch (error) {
      console.error("Failed to like post", error);
    }
  };

  const handleLikeTopic = async (topicId: number) => {
    if (!topicId || likedTopicIds.includes(topicId)) return;
    try {
      const res = await fetch("/api/forum", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, action: "like" }),
      });
      if (!res.ok) return;
      const data = await res.json().catch(() => null);
      setLikedTopicIds((prev) => [...prev, topicId]);
      if (selectedTopic && selectedTopic.id === topicId) {
        const updatedTopic = {
          ...selectedTopic,
          likes: data?.likes ?? (selectedTopic.likes || 0) + 1,
        };
        setSelectedTopic(updatedTopic);
        setForumTopics(
          forumTopics.map((t) => (t.id === updatedTopic.id ? updatedTopic : t)),
        );
      }
    } catch (error) {
      console.error("Failed to like topic", error);
    }
  };

  const handleCreateTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !newTopicContent.trim()) {
      showErrorToast(
        language === "de"
          ? "Bitte fülle alle Felder aus"
          : "Please fill in all fields",
      );
      return;
    }

    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          title: newTopicTitle,
          content: newTopicContent,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setForumTopics([data.topic, ...forumTopics]);
        setShowNewTopicModal(false);
        setNewTopicTitle("");
        setNewTopicContent("");
        showSuccessToast(
          language === "de" ? "Thema erstellt!" : "Topic created!",
        );
      } else {
        const error = await res.json();
        showErrorToast(error.error || "Failed to create topic");
      }
    } catch (e) {
      console.error("Failed to create topic", e);
      showErrorToast(
        language === "de"
          ? "Fehler beim Erstellen der Diskussion"
          : "Error creating discussion",
      );
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      showSuccessToast(
        language === "de"
          ? "In die Zwischenablage kopiert!"
          : "Copied to clipboard!",
      );
    });
  };

  return (
    <div className="pb-20 overflow-x-hidden">
      <CourseHeader
        course={course}
        language={language}
        onBack={() => navigate("/courses")}
      />

      {loaderData?.error && (
        <div className="max-w-7xl mx-auto mt-4 rounded-2xl border border-iu-red/30 bg-iu-red/5 p-4 text-sm text-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="font-semibold">
              {language === "de" ? "Fehler beim Laden" : "Loading issue"}
            </p>
            <p className="text-muted-foreground">
              {language === "de"
                ? "Dokumente konnten nicht geladen werden. Bitte versuche es erneut."
                : "Documents could not be loaded. Please try again."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => revalidator.revalidate()}
            className="inline-flex items-center justify-center rounded-full border border-iu-red/30 px-4 py-2 font-semibold text-iu-red hover:bg-iu-red/10 transition-colors"
          >
            {retryLabel}
          </button>
        </div>
      )}

      <CourseTabNavigation
        tabs={[
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
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="max-w-7xl mx-auto py-2">
        {activeTab === "overview" && (
          <CourseOverviewTab
            course={course}
            language={language}
            t={t}
            submissions={submissions}
            translate={translate}
            onTabChange={setActiveTab}
          />
        )}

        {activeTab === "resources" && (
          <CourseResourcesTab
            course={course}
            language={language}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            onFileClick={handleFileClick}
          />
        )}

        {activeTab === "videos" && (
          <CourseVideosTab
            course={course}
            language={language}
            t={t}
            getThumbnailUrl={getVideoThumbnailUrl}
            onVideoClick={handleVideoClick}
          />
        )}

        {activeTab === "coursefeed" && <CourseFeedTab language={language} />}

        {activeTab === "abgabe" && (
          <CourseSubmissionsTab
            language={language}
            t={t}
            submissions={submissions}
            translate={translate}
            openModal={openModal}
          />
        )}

        {activeTab === "online-tests" && (
          <CourseOnlineTestsTab course={course} language={language} />
        )}

        {activeTab === "notes" && <CourseNotesTab language={language} />}

        {activeTab === "forum" && (
          <CourseForumTab
            language={language}
            t={t}
            forumView={forumView}
            forumTopics={forumTopics}
            selectedTopic={selectedTopic}
            currentUser={currentUser}
            replyContent={replyContent}
            onSetReplyContent={setReplyContent}
            onCreateTopicClick={handleCreateTopicClick}
            onTopicClick={handleTopicClick}
            onBackToTopics={handleBackToTopics}
            onPostReply={handlePostReply}
            onCopyMessage={handleCopyMessage}
            onLikePost={handleLikePost}
            onLikeTopic={handleLikeTopic}
          />
        )}
      </main>

      {showModal && (
        <UploadModal
          language={language}
          showModal={showModal}
          selectedSubmission={selectedSubmission}
          accepted={accepted}
          uploadedFile={uploadedFile}
          onClose={() => setShowModal(false)}
          onAcceptChange={onAcceptChange}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
        />
      )}

      {playingVideo && (
        <VideoModal
          language={language}
          courseTitle={course.title}
          playingVideo={playingVideo}
          onClose={() => setPlayingVideo(null)}
        />
      )}

      {showNewTopicModal && (
        <NewTopicModal
          language={language}
          showModal={showNewTopicModal}
          newTopicTitle={newTopicTitle}
          newTopicContent={newTopicContent}
          onClose={() => setShowNewTopicModal(false)}
          onTitleChange={setNewTopicTitle}
          onContentChange={setNewTopicContent}
          onSubmit={handleCreateTopicSubmit}
        />
      )}
    </div>
  );
}
