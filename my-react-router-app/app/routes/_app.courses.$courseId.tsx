import React, { useEffect, useState, useCallback } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
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
import { saveRecentFile } from "../lib/recentFiles";
import { saveRecentCourse } from "../lib/recentCourses";
import { showErrorToast, showSuccessToast } from "../lib/toast";
import { prisma } from "~/lib/prisma";
import { calculateDaysLeft } from "~/lib/tasksSample";
import {
  TRANSLATIONS,
  getCourseConfig,
} from "../data/coursesConfig";
import { useLanguage } from "~/contexts/LanguageContext";
import type { CourseSubmission } from "~/types/course";
import type { Course, CourseDetailData, CourseResource, VideoResource } from "~/types/courseDetail";

// New Extractions
import { COURSE_TYPE_MAP } from "~/constants/course";
import { formatGermanDate } from "~/lib/dateUtils";
import { getVideoThumbnailUrl } from "~/lib/videoUtils";
import { useSubmissionStatus } from "~/hooks/useSubmissionStatus";

// Components
import { CourseHeader } from "~/components/courses/detail/CourseHeader";
import { CourseTabNavigation } from "~/components/courses/detail/CourseTabNavigation";
import { CourseOverviewTab } from "~/components/courses/detail/CourseOverviewTab";
import { CourseResourcesTab } from "~/components/courses/detail/CourseResourcesTab";
import { CourseVideosTab } from "~/components/courses/detail/CourseVideosTab";
import { CourseFeedTab } from "~/components/courses/detail/CourseFeedTab";
import { CourseSubmissionsTab } from "~/components/courses/detail/CourseSubmissionsTab";
import { CourseOnlineTestsTab } from "~/components/courses/detail/CourseOnlineTestsTab";
import { CourseNotesTab } from "~/components/courses/detail/CourseNotesTab";
import { CourseForumTab } from "~/components/courses/detail/CourseForumTab";
import { UploadModal } from "~/components/courses/detail/UploadModal";
import { NewTopicModal } from "~/components/courses/detail/NewTopicModal";
import { VideoModal } from "~/components/courses/detail/VideoModal";

export const loader = async ({
  request,
  params,
}: {
  request: Request;
  params: { courseId?: string };
}) => {
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

  // FALLBACK: If no user found, use Demo Student
  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: "student.demo@iu-study.org" },
    });
  }

  // If still no user, return empty (should ideally redirect)
  if (!user) return { submissions: [], course: null, userId: 0, studiengangName: "" };

  const courseIdNum = Number(params.courseId);
  if (isNaN(courseIdNum)) return { submissions: [], course: null, userId: user.id, studiengangName: user.studiengang?.name };

  // Fetch course from DB with files
  const course = await prisma.course.findUnique({
    where: { id: courseIdNum },
    include: {
      files: {
        where: { userId: user.id },
      },
    },
  });

  if (!course) return { submissions: [], course: null, userId: user.id, studiengangName: user.studiengang?.name };

  // Map database files to UI resources
  const resources: CourseResource[] = course.files.map((f: { id: any; name: any; url: any; size: any; fileType: string; uploadedAt: Date; }) => ({
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
      (row: { title: string; kind: string; }) =>
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
  const courseData: Course = {
    id: course.id,
    title: course.name,
    instructor: "Dozent",
    description: course.description || "Dieses Modul vermittelt tiefgehende Kenntnisse im Fachbereich.",
    startDate: "01.10.2024",
    endDate: "31.03.2025",
    progress: Number(course.progress) || 0, // Ensure strictly number
    credits: Number(course.credits) || 5, // Ensure strictly number
    semester: Number(course.semester) || 1, // Ensure strictly number
    color: course.color || "cyan",
    resources: resources,
    code: course.code,
    name: course.name
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
  const loaderData = useLoaderData() as CourseDetailData;
  const courseSubmissions: CourseSubmission[] = loaderData?.submissions ?? [];
  const { userId, studiengangName } = loaderData || {};
  const { language } = useLanguage();
  const courses = getCourseConfig(language);
  const navigate = useNavigate();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  // Find the course by ID (from loader or fallback to config)
  // Casting partial course from config to full Course type if needed, or prefer loaderData
  const fallbackCourse = courses.find((c) => c.id === Number(courseId));
  const course: Course | null = loaderData?.course || (fallbackCourse ? {
    ...fallbackCourse,
    instructor: "Dozent", // defaults for fallback
    startDate: "01.10.2024",
    endDate: "31.03.2025",
    resources: []
  } as unknown as Course : null);

  useEffect(() => {
    if (course && userId) {
      saveRecentCourse(
        {
          id: course.id,
          name: course.title || course.name || "",
          studiengang: studiengangName || "IU Studium",
          semester: `${course.semester}. Semester`,
          color: course.color || "cyan",
        },
        userId
      );
    }
  }, [course, userId, studiengangName]);

  const translate = (value: string) =>
    language === "de" ? value : COURSE_TYPE_MAP[value]?.en || value;

  // Use custom hook for submission status persistence
  const { savedStatus, persistStatus } = useSubmissionStatus();

  const [submissions, setSubmissions] = useState<CourseSubmission[]>(
    courseSubmissions.map((s) => ({
      ...s,
      status: savedStatus[s.id]?.status ?? "pending",
      similarity: savedStatus[s.id]?.similarity,
      submittedFileName: savedStatus[s.id]?.fileName,
      submittedFileSize: savedStatus[s.id]?.fileSize,
    }))
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
        submittedFileName: savedStatus[s.id]?.fileName,
        submittedFileSize: savedStatus[s.id]?.fileSize,
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

  const onAcceptChange = (field: "honor" | "privacy", checked: boolean) => {
    setAccepted((prev) => ({ ...prev, [field]: checked }));
  };

  const handleSubmit = () => {
    if (!accepted.honor || !accepted.privacy) {
      showErrorToast(
        language === "de"
          ? "Bitte akzeptiere die Eidesstattliche Erklärung und den Datenschutz."
          : "Please accept the honor and privacy statements."
      );
      return;
    }
    if (!uploadedFile) {
      showErrorToast(
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
          ? {
              ...s,
              status: "submitted" as const,
              similarity,
              submittedFileName: uploadedFile.name,
              submittedFileSize: uploadedFile.size,
            }
          : s
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
        selectedSubmission.course || course.title || course.name || "Course";
      updated.forEach((s) => {
        if (s.status === "submitted") {
          persisted[s.id] = {
            status: s.status,
            similarity: s.similarity,
            fileName: s.submittedFileName,
            fileSize: s.submittedFileSize,
          };
          persistedByCourse[`${courseKeyBase}::${s.title}`] = {
            status: s.status,
            similarity: s.similarity,
            fileName: s.submittedFileName,
            fileSize: s.submittedFileSize,
          };
        }
      });
      persistStatus(persisted);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "submissionStatusByCourse",
          JSON.stringify(persistedByCourse)
        );
      }
      return updated;
    });
    setShowModal(false);
    showSuccessToast(
      language === "de" ? "Abgabe gespeichert." : "Submission saved."
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
    if (!course) {
      navigate("/courses");
    }
  }, [course, navigate]);
  
  if (!course) {
    return null;
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
      studiengangName || "IU Studium"
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
      studiengangName || "IU Studium"
    );
    setPlayingVideo(video);
  };

  const handleCreateTopicClick = () => {
      setShowNewTopicModal(true);
  };

  const handleTopicClick = (topic: any) => {
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
    const updatedTopic = updatedTopics.find((t) => t.id === topic.id);
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
          forumTopics.map((t) =>
            t.id === updatedTopic.id ? updatedTopic : t
          )
        );
        setReplyContent("");
        showSuccessToast(
          language === "de" ? "Antwort gepostet!" : "Reply posted!"
        );
      }
    } catch (e) {
      console.error("Failed to post reply", e);
      showErrorToast(
        language === "de" ? "Antwort konnte nicht gepostet werden" : "Failed to post reply"
      );
    }
  };

  const handleCreateTopicSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTopicTitle.trim() || !newTopicContent.trim()) {
        showErrorToast(
          language === "de"
            ? "Bitte fülle alle Felder aus"
            : "Please fill in all fields"
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
            language === "de" ? "Thema erstellt!" : "Topic created!"
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
            : "Error creating discussion"
        );
      }
  };


  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      showSuccessToast(
        language === "de"
          ? "In die Zwischenablage kopiert!"
          : "Copied to clipboard!"
      );
    });
  };

  return (
    <div className="pb-20">
      <CourseHeader 
        course={course} 
        language={language} 
        onBack={() => navigate("/courses")} 
      />

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

        {activeTab === "coursefeed" && (
            <CourseFeedTab language={language} />
        )}

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

        {activeTab === "notes" && (
            <CourseNotesTab language={language} />
        )}

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
