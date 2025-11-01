import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">IU</span>
              </div>
              <div>
                <h1 className="text-lg font-black text-blue-900">IU Portal</h1>
                <p className="text-xs text-blue-600">{t.tasks}</p>
              </div>
            </Link>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-100 text-slate-900 rounded-lg border border-slate-200 cursor-pointer"
              >
                <option value="de">DE</option>
                <option value="en">EN</option>
              </select>
              <button
                onClick={() => navigate("/logout")}
                className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200"
              >
                {t.logout}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title & Stats */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-blue-900 mb-4">📋 {t.tasks}</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
              <p className="text-slate-600 text-sm font-semibold mb-1">{t.allTasks}</p>
              <p className="text-2xl font-black text-blue-900">{tasks.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
              <p className="text-slate-600 text-sm font-semibold mb-1">{t.completed}</p>
              <p className="text-2xl font-black text-green-600">{completedCount}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm">
              <p className="text-slate-600 text-sm font-semibold mb-1">{t.pending}</p>
              <p className="text-2xl font-black text-orange-600">{pendingCount}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 mb-6">
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
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === f.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`rounded-lg border p-5 transition hover:shadow-md ${
                  task.completed
                    ? "bg-slate-50 border-slate-200 opacity-75"
                    : "bg-white border-blue-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskComplete(task.id)}
                    className="w-6 h-6 mt-1 cursor-pointer rounded border-blue-300"
                  />

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-lg font-semibold ${
                        task.completed
                          ? "text-slate-600 line-through"
                          : "text-slate-900"
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex gap-2">
                        <span className={`text-xs font-semibold px-3 py-1 rounded border ${getTypeColor(task.type)}`}>
                          {language === "de" 
                            ? (task.type === "work" ? "Arbeit" : task.type === "course" ? "Kurs" : "Persönlich")
                            : (task.type === "work" ? "Work" : task.type === "course" ? "Course" : "Personal")}
                        </span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded border ${getPriorityColor(task.priority)}`}>
                          {language === "de"
                            ? (task.priority === "high" ? "Hoch" : task.priority === "medium" ? "Mittel" : "Niedrig")
                            : (task.priority === "high" ? "High" : task.priority === "medium" ? "Medium" : "Low")}
                        </span>
                      </div>
                    </div>

                    <p className={`text-sm mb-3 ${task.completed ? "text-slate-500" : "text-slate-600"}`}>
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>📍 {task.assignedBy}</span>
                      <span>📅 {new Date(task.dueDate).toLocaleDateString(language === "de" ? "de-DE" : "en-US")}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
              <p className="text-slate-600 text-lg">{t.noTasks}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
