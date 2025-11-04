import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { Calendar, CheckSquare, FileText, Clock, AlertCircle } from "lucide-react";

const TRANSLATIONS = {
  de: {
    tasks: "Aufgaben",
    allTasks: "Alle Aufgaben",
    completed: "Abgeschlossen",
    pending: "Ausstehend",
    overdue: "Überfällig",
    dueSoon: "Fällig in Kürze",
    logout: "Abmelden",
    markComplete: "Fertigstellen",
    markIncomplete: "Rückgängig",
    filter: "Filtern",
    noTasks: "Keine Aufgaben",
    tasksDueToday: "Aufgaben für heute",
    tasksThisWeek: "Aufgaben diese Woche",
    tasksThisMonth: "Aufgaben diesen Monat",
    assignedBy: "Zugewiesen von",
    dueDate: "Fälligkeitsdatum",
    priority: "Priorität",
    high: "Hoch",
    medium: "Mittel",
    low: "Niedrig",
    work: "Arbeit",
    course: "Kurs",
    personal: "Persönlich",
  },
  en: {
    tasks: "Tasks",
    allTasks: "All Tasks",
    completed: "Completed",
    pending: "Pending",
    overdue: "Overdue",
    dueSoon: "Due Soon",
    logout: "Logout",
    markComplete: "Complete",
    markIncomplete: "Undo",
    filter: "Filter",
    noTasks: "No tasks",
    tasksDueToday: "Tasks due today",
    tasksThisWeek: "Tasks this week",
    tasksThisMonth: "Tasks this month",
    assignedBy: "Assigned by",
    dueDate: "Due date",
    priority: "Priority",
    high: "High",
    medium: "Medium",
    low: "Low",
    work: "Work",
    course: "Course",
    personal: "Personal",
  },
};

export const loader = async () => {
  return null;
};

export default function Tasks() {
  const [language, setLanguage] = useState("de");
  const [filter, setFilter] = useState("all");
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: language === "de" ? "Projektarbeit abschließen" : "Complete project work",
      description: language === "de" 
        ? "React Dashboard mit Tailwind CSS gestalten"
        : "Design React Dashboard with Tailwind CSS",
      dueDate: "2025-01-20",
      type: "course",
      priority: "high",
      completed: false,
      assignedBy: "Prof. Dr. Sarah Schmidt",
    },
    {
      id: 2,
      title: language === "de" ? "Wochenabschlussbericht" : "Weekly report",
      description: language === "de"
        ? "Arbeitszeiten und Lernfortschritt dokumentieren"
        : "Document working hours and learning progress",
      dueDate: "2025-01-17",
      type: "work",
      priority: "high",
      completed: false,
      assignedBy: "Markus Weber",
    },
    {
      id: 3,
      title: language === "de" ? "Datenbank-Quiz" : "Database Quiz",
      description: language === "de"
        ? "Online-Quiz zu SQL und Datenbankdesign"
        : "Online quiz on SQL and database design",
      dueDate: "2025-01-18",
      type: "course",
      priority: "medium",
      completed: true,
      assignedBy: "Prof. Dr. Thomas Müller",
    },
    {
      id: 4,
      title: language === "de" ? "Team-Meeting vorbereiten" : "Prepare team meeting",
      description: language === "de"
        ? "Präsentation für Q1 Planungstreffen"
        : "Presentation for Q1 planning meeting",
      dueDate: "2025-01-22",
      type: "work",
      priority: "medium",
      completed: false,
      assignedBy: "Markus Weber",
    },
    {
      id: 5,
      title: language === "de" ? "Code Review durchführen" : "Perform code review",
      description: language === "de"
        ? "Review des Pull Requests von Team-Mitglied XYZ"
        : "Review pull request from team member XYZ",
      dueDate: "2025-01-19",
      type: "work",
      priority: "low",
      completed: false,
      assignedBy: "Markus Weber",
    },
  ]);

  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  const getFilteredTasks = () => {
    switch (filter) {
      case "completed":
        return tasks.filter(t => t.completed);
      case "pending":
        return tasks.filter(t => !t.completed);
      case "overdue":
        return tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date());
      default:
        return tasks;
    }
  };

  const toggleTaskComplete = (id) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "work":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "course":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "personal":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const filteredTasks = getFilteredTasks();
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;

  // Calculate days until deadline
  const calculateDaysLeft = (dueDateString) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Turnitin submissions data
  const turnitinSubmissions = [
    {
      id: 1,
      title: "Hausarbeit: Digitale Transformation im E-Commerce",
      course: "E-Commerce",
      dueDate: "15.11.2025",
      correctionDate: "22.11.2025",
      status: "pending",
      type: "Hausarbeit",
      pages: "15-20 Seiten",
      daysUntilDue: calculateDaysLeft("2025-11-15"),
      daysUntilCorrection: 10,
    },
    {
      id: 2,
      title: "Seminararbeit: Datenbankmodellierung für große Unternehmen",
      course: "Datenbankdesign",
      dueDate: "18.11.2025",
      correctionDate: "25.11.2025",
      status: "submitted",
      type: "Seminararbeit",
      pages: "20-25 Seiten",
      similarity: 12,
      submittedDate: "15.11.2025",
      daysUntilDue: calculateDaysLeft("2025-11-18"),
      daysUntilCorrection: 13,
    },
    {
      id: 3,
      title: "Projektarbeit: Entwicklung eines Algorithmus für Routenoptimierung",
      course: "Algorithmen und Datenstrukturen",
      dueDate: "20.11.2025",
      correctionDate: "27.11.2025",
      status: "pending",
      type: "Projektarbeit",
      pages: "25-30 Seiten",
      daysUntilDue: calculateDaysLeft("2025-11-20"),
      daysUntilCorrection: 15,
    },
    {
      id: 4,
      title: "Hausarbeit: Webentwicklung mit modernen Frameworks",
      course: "Webentwicklung",
      dueDate: "12.11.2025",
      correctionDate: "19.11.2025",
      status: "submitted",
      type: "Hausarbeit",
      pages: "12-15 Seiten",
      similarity: 8,
      submittedDate: "10.11.2025",
      daysUntilDue: calculateDaysLeft("2025-11-12"),
      daysUntilCorrection: 7,
    },
    {
      id: 5,
      title: "Forschungsarbeit: Künstliche Intelligenz in der Wirtschaftsinformatik",
      course: "Wirtschaftsinformatik",
      dueDate: "25.11.2025",
      correctionDate: "02.12.2025",
      status: "pending",
      type: "Forschungsarbeit",
      pages: "30-35 Seiten",
      daysUntilDue: calculateDaysLeft("2025-11-25"),
      daysUntilCorrection: 20,
    },
  ].sort((a, b) => a.daysUntilDue - b.daysUntilDue);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 mt-4">
          <h1 className="text-[36px] font-bold text-black leading-tight mb-2">
            {t.tasks}
          </h1>
          <p className="text-gray-700 text-sm font-medium">
            Verwalte deine Aufgaben und Abgabefristen
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Turnitin Abgaben Section */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 border border-gray-300">
                    <FileText className="h-5 w-5 text-gray-700" />
                  </div>
                  <h2 className="text-lg font-bold text-black">Turnitin Abgaben</h2>
                </div>
              </div>
              <div className="space-y-4">
                {turnitinSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-black text-sm mb-1">{submission.title}</h3>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          <p className="text-xs text-gray-600">{submission.course}</p>
                          <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-semibold border border-gray-300">
                            {submission.type}
                          </span>
                          {submission.pages && (
                            <span className="text-xs text-gray-500">{submission.pages}</span>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${
                        submission.status === "submitted" 
                          ? "bg-gray-100 text-gray-800 border-gray-300" 
                          : "bg-white text-gray-700 border-gray-400"
                      }`}>
                        {submission.status === "submitted" ? "Abgegeben" : "Ausstehend"}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-3.5 w-3.5 text-gray-600" />
                          <span className="text-xs font-semibold text-gray-700">Abgabefrist</span>
                        </div>
                        <p className="text-sm font-bold text-black">{submission.dueDate}</p>
                        <p className={`text-xs mt-1 font-medium ${
                          submission.daysUntilDue <= 3 ? "text-orange-500" : "text-gray-500"
                        }`}>
                          {submission.daysUntilDue < 0 
                            ? "Überfällig" 
                            : submission.daysUntilDue === 0 
                            ? "Heute fällig" 
                            : submission.daysUntilDue === 1 
                            ? "1 Tag verbleibend" 
                            : `${submission.daysUntilDue} Tage verbleibend`}
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CheckSquare className="h-3.5 w-3.5 text-gray-600" />
                          <span className="text-xs font-semibold text-gray-700">Korrektur</span>
                        </div>
                        <p className="text-sm font-bold text-black">{submission.correctionDate}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {submission.daysUntilCorrection} Tage nach Abgabe
                        </p>
                      </div>
                    </div>

                    {submission.status === "submitted" && submission.similarity !== undefined && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-700">Turnitin Ähnlichkeit:</span>
                            {submission.submittedDate && (
                              <span className="text-xs text-gray-500">Abgegeben: {submission.submittedDate}</span>
                            )}
                          </div>
                          <span className={`text-sm font-bold px-2 py-1 rounded border-2 ${
                            submission.similarity < 15
                              ? "bg-green-50/50 text-green-600 border-green-300"
                              : submission.similarity < 30
                              ? "bg-orange-50/50 text-orange-600 border-orange-300"
                              : "bg-red-50/50 text-red-600 border-red-300"
                          }`}>
                            {submission.similarity}%
                          </span>
                        </div>
                      </div>
                    )}

                    {submission.status === "pending" && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <button className="w-full py-2 px-4 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors border border-gray-800">
                          Abgabe vorbereiten
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Regular Tasks Section */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 border border-gray-300">
                    <CheckSquare className="h-5 w-5 text-gray-700" />
                  </div>
                  <h2 className="text-lg font-bold text-black">Meine Aufgaben</h2>
                </div>
              </div>

              {/* Filters */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: "all", label: t.allTasks },
                    { id: "pending", label: t.pending },
                    { id: "completed", label: t.completed },
                    { id: "overdue", label: t.overdue },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition border-2 ${
                        filter === f.id
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 text-sm font-semibold mb-1">{t.allTasks}</p>
                  <p className="text-2xl font-bold text-black">{tasks.length}</p>
                </div>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 text-sm font-semibold mb-1">{t.completed}</p>
                  <p className="text-2xl font-bold text-black">{completedCount}</p>
                </div>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 text-sm font-semibold mb-1">{t.pending}</p>
                  <p className="text-2xl font-bold text-black">{pendingCount}</p>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-4">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => {
                    const daysLeft = calculateDaysLeft(task.dueDate);
                    return (
                      <div
                        key={task.id}
                        className={`border-2 rounded-xl p-4 transition hover:shadow-md ${
                          task.completed
                            ? "bg-gray-50 border-gray-200 opacity-75"
                            : daysLeft < 0
                            ? "bg-red-50/30 border-red-200"
                            : daysLeft <= 3
                            ? "bg-orange-50/30 border-orange-200"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskComplete(task.id)}
                            className="w-5 h-5 mt-1 cursor-pointer rounded border-gray-400"
                          />

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className={`text-base font-bold ${
                                task.completed
                                  ? "text-gray-500 line-through"
                                  : "text-black"
                              }`}>
                                {task.title}
                              </h3>
                              <div className="flex gap-2">
                                <span className={`text-xs font-semibold px-2 py-1 rounded border ${
                                  task.type === "work" ? "bg-blue-50/50 text-blue-700 border-blue-300" :
                                  task.type === "course" ? "bg-purple-50/50 text-purple-700 border-purple-300" :
                                  "bg-green-50/50 text-green-700 border-green-300"
                                }`}>
                                  {language === "de" 
                                    ? (task.type === "work" ? "Arbeit" : task.type === "course" ? "Kurs" : "Persönlich")
                                    : (task.type === "work" ? "Work" : task.type === "course" ? "Course" : "Personal")}
                                </span>
                                <span className={`text-xs font-semibold px-2 py-1 rounded border ${
                                  task.priority === "high" ? "bg-red-50/50 text-red-700 border-red-300" :
                                  task.priority === "medium" ? "bg-orange-50/50 text-orange-700 border-orange-300" :
                                  "bg-green-50/50 text-green-700 border-green-300"
                                }`}>
                                  {language === "de"
                                    ? (task.priority === "high" ? "Hoch" : task.priority === "medium" ? "Mittel" : "Niedrig")
                                    : (task.priority === "high" ? "High" : task.priority === "medium" ? "Medium" : "Low")}
                                </span>
                              </div>
                            </div>

                            <p className={`text-sm mb-3 ${task.completed ? "text-gray-500" : "text-gray-600"}`}>
                              {task.description}
                            </p>

                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">👤 {task.assignedBy}</span>
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {new Date(task.dueDate).toLocaleDateString(language === "de" ? "de-DE" : "en-US")}
                                </span>
                                {!task.completed && (
                                  <span className={`font-bold px-2 py-0.5 rounded ${
                                    daysLeft < 0 ? "bg-red-100 text-red-700" :
                                    daysLeft === 0 ? "bg-red-200 text-red-800" :
                                    daysLeft <= 3 ? "bg-orange-100 text-orange-700" :
                                    "bg-gray-100 text-gray-700"
                                  }`}>
                                    {daysLeft < 0 ? `${Math.abs(daysLeft)} Tage überfällig` :
                                    daysLeft === 0 ? "Heute!" :
                                    daysLeft === 1 ? "1 Tag" :
                                    `${daysLeft} Tage`}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-gray-200">
                    <p className="text-gray-600 text-lg">{t.noTasks}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-black mb-4">Übersicht</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Gesamt</span>
                  <span className="text-lg font-bold text-black">{tasks.length}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Abgeschlossen</span>
                  <span className="text-lg font-bold text-black">{completedCount}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Ausstehend</span>
                  <span className="text-lg font-bold text-black">{pendingCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Turnitin Abgaben</span>
                  <span className="text-lg font-bold text-black">{turnitinSubmissions.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
