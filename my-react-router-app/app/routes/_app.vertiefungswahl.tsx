import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "~/contexts/LanguageContext";
import {
  BarChart3,
  Code2,
  FolderKanban,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Info,
  Sparkles,
  Target,
  TrendingUp,
  Database,
  Brain,
  GitBranch,
  Settings2,
  Users,
  Calendar,
  Award,
  AlertCircle,
  Check,
} from "lucide-react";

export const loader = async () => null;

// Translations
const TRANSLATIONS = {
  de: {
    back: "Zurück zur Studienorganisation",
    title: "Vertiefungswahl",
    subtitle: "Wählen Sie Ihre Vertiefungsrichtung für den Studiengang",
    currentChoice: "Aktuelle Wahl",
    infoTitle: "Wann muss ich wählen?",
    infoText: "Die Vertiefungswahl erfolgt in der Regel nach dem 4. Semester. Die gewählten Vertiefungskurse werden im 5. und 6. Semester belegt. Sie können Ihre Wahl bis zum Semesterbeginn ändern.",
    courses: "Kurse",
    creditPoints: "Credit Points",
    chosen: "Gewählt",
    alreadyChosen: "Bereits gewählt",
    chooseSpecialization: "Vertiefung wählen",
    coursesInSpec: "Kurse in dieser Vertiefung",
    semester: "Semester",
    careerPaths: "Karrieremöglichkeiten",
    confirmTitle: "Vertiefung bestätigen",
    confirmText: "Sind Sie sicher, dass Sie",
    confirmText2: "als Ihre Vertiefung wählen möchten? Diese Wahl kann bis zum Semesterbeginn geändert werden.",
    cancel: "Abbrechen",
    confirm: "Bestätigen",
    successMsg: "Vertiefung erfolgreich gespeichert!",
    searchCourse: "Kurs suchen...",
  },
  en: {
    back: "Back to Study Organization",
    title: "Specialization Selection",
    subtitle: "Choose your specialization for the",
    currentChoice: "Current Choice",
    infoTitle: "When do I need to choose?",
    infoText: "Specialization selection typically occurs after the 4th semester. The chosen specialization courses will be taken in the 5th and 6th semesters. You can change your selection until the semester begins.",
    courses: "Courses",
    creditPoints: "Credit Points",
    chosen: "Chosen",
    alreadyChosen: "Already chosen",
    chooseSpecialization: "Choose Specialization",
    coursesInSpec: "Courses in this Specialization",
    semester: "Semester",
    careerPaths: "Career Opportunities",
    confirmTitle: "Confirm Specialization",
    confirmText: "Are you sure you want to choose",
    confirmText2: "as your specialization? This choice can be changed until the semester begins.",
    cancel: "Cancel",
    confirm: "Confirm",
    successMsg: "Specialization saved successfully!",
    searchCourse: "Search course...",
  },
};

// Vertiefungskurse basierend auf Wirtschaftsinformatik Studiengang
const VERTIEFUNGEN = {
  datenanalyse: {
    id: "datenanalyse",
    name: "Datenanalyse",
    nameEn: "Data Analytics",
    icon: BarChart3,
    color: "emerald",
    gradient: "from-emerald-500 to-teal-600",
    darkGradient: "from-emerald-600 to-teal-700",
    description:
      "Lernen Sie, aus Daten wertvolle Erkenntnisse zu gewinnen und datengetriebene Entscheidungen zu treffen.",
    highlights: [
      "Big Data & Machine Learning",
      "Statistische Analysen",
      "Business Intelligence",
      "Predictive Analytics",
    ],
    courses: [
      {
        id: "da-101",
        code: "DLBDSEDA01",
        name: "Einführung in die Datenanalyse",
        credits: 5,
        semester: 5,
        description:
          "Grundlagen der explorativen Datenanalyse, Datenvisualisierung und statistische Methoden.",
        topics: [
          "Datenaufbereitung",
          "Explorative Analyse",
          "Visualisierung",
          "Statistische Tests",
        ],
      },
      {
        id: "da-102",
        code: "DLBDSABD01",
        name: "Big Data Technologies",
        credits: 5,
        semester: 5,
        description:
          "Verteilte Datenverarbeitung mit Hadoop, Spark und modernen Cloud-Plattformen.",
        topics: ["Hadoop", "Apache Spark", "Cloud Analytics", "Data Lakes"],
      },
      {
        id: "da-201",
        code: "DLBDSEAIS01",
        name: "Machine Learning",
        credits: 5,
        semester: 6,
        description:
          "Anwendung von Machine Learning Algorithmen für Vorhersagen und Mustererkennung.",
        topics: [
          "Supervised Learning",
          "Unsupervised Learning",
          "Neural Networks",
          "Feature Engineering",
        ],
      },
      {
        id: "da-202",
        code: "DLBDSABI01",
        name: "Business Intelligence & Reporting",
        credits: 5,
        semester: 6,
        description:
          "BI-Tools, Dashboard-Design und unternehmensweite Reporting-Strategien.",
        topics: ["Power BI", "Tableau", "KPIs", "Self-Service BI"],
      },
    ],
    careerPaths: [
      "Data Analyst",
      "Business Intelligence Analyst",
      "Data Scientist",
      "Analytics Consultant",
    ],
  },
  softwareengineering: {
    id: "softwareengineering",
    name: "Software Engineering",
    nameEn: "Software Engineering",
    icon: Code2,
    color: "blue",
    gradient: "from-blue-500 to-indigo-600",
    darkGradient: "from-blue-600 to-indigo-700",
    description:
      "Entwickeln Sie professionelle Software mit modernen Methoden und Best Practices.",
    highlights: [
      "Agile Entwicklung",
      "Clean Code & Testing",
      "DevOps & CI/CD",
      "Softwarearchitektur",
    ],
    courses: [
      {
        id: "se-101",
        code: "DLBCSESWM01",
        name: "Moderne Softwaremethodik",
        credits: 5,
        semester: 5,
        description:
          "Agile Methoden, Scrum, Kanban und modernes Requirements Engineering.",
        topics: [
          "Scrum",
          "Kanban",
          "User Stories",
          "Continuous Improvement",
        ],
      },
      {
        id: "se-102",
        code: "DLBCSETEST01",
        name: "Software Testing & Qualitätssicherung",
        credits: 5,
        semester: 5,
        description:
          "Unit Tests, Integration Tests, TDD und automatisierte Testframeworks.",
        topics: [
          "Unit Testing",
          "Integration Testing",
          "TDD/BDD",
          "Test Automation",
        ],
      },
      {
        id: "se-201",
        code: "DLBCSESWA01",
        name: "Softwarearchitektur",
        credits: 5,
        semester: 6,
        description:
          "Architekturpatterns, Microservices, Domain-Driven Design und Systemdesign.",
        topics: [
          "Microservices",
          "Clean Architecture",
          "DDD",
          "Design Patterns",
        ],
      },
      {
        id: "se-202",
        code: "DLBCSEDEVOPS01",
        name: "DevOps & Cloud Engineering",
        credits: 5,
        semester: 6,
        description:
          "CI/CD Pipelines, Container-Orchestrierung und Cloud-native Entwicklung.",
        topics: ["Docker", "Kubernetes", "CI/CD", "Infrastructure as Code"],
      },
    ],
    careerPaths: [
      "Software Developer",
      "DevOps Engineer",
      "Software Architect",
      "Full-Stack Developer",
    ],
  },
  projektmanagement: {
    id: "projektmanagement",
    name: "Projektmanagement",
    nameEn: "Project Management",
    icon: FolderKanban,
    color: "amber",
    gradient: "from-amber-500 to-orange-600",
    darkGradient: "from-amber-600 to-orange-700",
    description:
      "Führen Sie IT-Projekte erfolgreich zum Abschluss mit modernsten PM-Methoden.",
    highlights: [
      "Klassisches & Agiles PM",
      "Ressourcenplanung",
      "Risikomanagement",
      "Stakeholder Management",
    ],
    courses: [
      {
        id: "pm-101",
        code: "DLBPMITPM01",
        name: "IT-Projektmanagement Grundlagen",
        credits: 5,
        semester: 5,
        description:
          "Projektplanung, Steuerung und Kontrolle von IT-Projekten.",
        topics: [
          "Projektplanung",
          "Meilensteine",
          "Gantt-Charts",
          "Projektkontrolle",
        ],
      },
      {
        id: "pm-102",
        code: "DLBPMARM01",
        name: "Agiles & Hybrides Projektmanagement",
        credits: 5,
        semester: 5,
        description: "Kombination klassischer und agiler Methoden für flexible Projektführung.",
        topics: ["Hybrid PM", "Scaled Agile", "SAFe", "Lean Management"],
      },
      {
        id: "pm-201",
        code: "DLBPMRISK01",
        name: "Risiko- und Qualitätsmanagement",
        credits: 5,
        semester: 6,
        description:
          "Identifikation, Bewertung und Steuerung von Projektrisiken.",
        topics: [
          "Risikoanalyse",
          "Qualitätskontrolle",
          "FMEA",
          "Stakeholder Analyse",
        ],
      },
      {
        id: "pm-202",
        code: "DLBPMPMO01",
        name: "Portfolio- und Programmmanagement",
        credits: 5,
        semester: 6,
        description:
          "Strategisches Management mehrerer Projekte und PMO-Aufbau.",
        topics: [
          "Portfoliomanagement",
          "PMO Setup",
          "Strategic Alignment",
          "Benefits Realization",
        ],
      },
    ],
    careerPaths: [
      "IT Project Manager",
      "Scrum Master",
      "Product Owner",
      "PMO Lead",
    ],
  },
};

type VertiefungId = keyof typeof VERTIEFUNGEN;

export default function Vertiefungswahl() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  
  const [selectedVertiefung, setSelectedVertiefung] =
    useState<VertiefungId | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [savedChoice, setSavedChoice] = useState<VertiefungId | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load saved choice from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("vertiefungswahl");
    if (saved && saved in VERTIEFUNGEN) {
      setSavedChoice(saved as VertiefungId);
    }
  }, []);

  const handleConfirm = () => {
    if (selectedVertiefung) {
      localStorage.setItem("vertiefungswahl", selectedVertiefung);
      setSavedChoice(selectedVertiefung);
      setConfirmModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<
      string,
      { bg: string; text: string; border: string; ring: string }
    > = {
      emerald: {
        bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/30",
        ring: "ring-emerald-500/30",
      },
      blue: {
        bg: "bg-blue-500/10 dark:bg-blue-500/20",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-500/30",
        ring: "ring-blue-500/30",
      },
      amber: {
        bg: "bg-amber-500/10 dark:bg-amber-500/20",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/30",
        ring: "ring-amber-500/30",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">
              {t.successMsg}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-12">
        <Link
          to="/study-organization"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.back}
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-black dark:text-white mb-3 flex items-center gap-3">
              <GraduationCap className="w-10 h-10 text-primary" />
              {t.title}
            </h1>
            <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl">
              {t.subtitle}{" "}
              <span className="font-semibold text-primary">
                Wirtschaftsinformatik (B.Sc.)
              </span>
            </p>
          </div>

          {savedChoice && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                  {t.currentChoice}
                </p>
                <p className="text-emerald-800 dark:text-emerald-200 font-bold">
                  {VERTIEFUNGEN[savedChoice].name}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-10 p-5 rounded-2xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 flex items-start gap-4">
        <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
            {t.infoTitle}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t.infoText}
          </p>
        </div>
      </div>

      {/* Vertiefungen Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {Object.values(VERTIEFUNGEN).map((vertiefung) => {
          const Icon = vertiefung.icon;
          const colorClasses = getColorClasses(vertiefung.color);
          const isSelected = selectedVertiefung === vertiefung.id;
          const isSaved = savedChoice === vertiefung.id;

          return (
            <div
              key={vertiefung.id}
              onClick={() => setSelectedVertiefung(vertiefung.id as VertiefungId)}
              className={`relative group cursor-pointer overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
                isSelected
                  ? `border-${vertiefung.color}-500 shadow-xl shadow-${vertiefung.color}-500/20`
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              } bg-white dark:bg-slate-900`}
            >
              {/* Header Gradient */}
              <div
                className={`h-32 bg-gradient-to-br ${vertiefung.gradient} dark:${vertiefung.darkGradient} relative`}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {isSaved && (
                    <span className="px-2 py-1 rounded-full bg-white/30 text-white text-xs font-bold backdrop-blur-sm">
                      {t.chosen}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <div className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-lg">
                    <Check className="w-5 h-5 text-emerald-500" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {vertiefung.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {vertiefung.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2 mb-6">
                  {vertiefung.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                    >
                      <Sparkles
                        className={`w-4 h-4 ${colorClasses.text}`}
                      />
                      {highlight}
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <BookOpen className="w-4 h-4" />
                    <span>{vertiefung.courses.length} {t.courses}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <Award className="w-4 h-4" />
                    <span>
                      {vertiefung.courses.reduce((a, c) => a + c.credits, 0)} CP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Vertiefung Details */}
      {selectedVertiefung && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg">
            {/* Header */}
            <div
              className={`p-8 bg-gradient-to-br ${VERTIEFUNGEN[selectedVertiefung].gradient} dark:${VERTIEFUNGEN[selectedVertiefung].darkGradient}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                    {React.createElement(
                      VERTIEFUNGEN[selectedVertiefung].icon,
                      { className: "w-8 h-8 text-white" }
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {VERTIEFUNGEN[selectedVertiefung].name}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {VERTIEFUNGEN[selectedVertiefung].courses.length} Kurse •{" "}
                      {VERTIEFUNGEN[selectedVertiefung].courses.reduce(
                        (a, c) => a + c.credits,
                        0
                      )}{" "}
                      Credit Points
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setConfirmModal(true)}
                  disabled={savedChoice === selectedVertiefung}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    savedChoice === selectedVertiefung
                      ? "bg-white/30 text-white/70 cursor-not-allowed"
                      : "bg-white text-slate-900 hover:bg-white/90 shadow-lg hover:shadow-xl active:scale-95"
                  }`}
                >
                  {savedChoice === selectedVertiefung ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      {t.alreadyChosen}
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5" />
                      {t.chooseSpecialization}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="p-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {t.coursesInSpec}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {VERTIEFUNGEN[selectedVertiefung].courses.map((course) => (
                  <div
                    key={course.id}
                    className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
                          {course.code}
                        </p>
                        <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                          {course.name}
                        </h4>
                      </div>
                      <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                        {course.credits} CP
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {course.topics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Calendar className="w-4 h-4" />
                        {course.semester}. {t.semester}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Career Paths */}
              <div className="mt-8 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  {t.careerPaths}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {VERTIEFUNGEN[selectedVertiefung].careerPaths.map(
                    (path, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm"
                      >
                        {path}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && selectedVertiefung && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="max-w-md w-full mx-4 p-6 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${VERTIEFUNGEN[selectedVertiefung].gradient}`}
              >
                {React.createElement(VERTIEFUNGEN[selectedVertiefung].icon, {
                  className: "w-6 h-6 text-white",
                })}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.confirmTitle}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {VERTIEFUNGEN[selectedVertiefung].name}
                </p>
              </div>
            </div>

            <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-200 text-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p>
                  {t.confirmText}{" "}
                  <strong>{VERTIEFUNGEN[selectedVertiefung].name}</strong> {t.confirmText2}
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={() => setConfirmModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-3 rounded-xl bg-gradient-to-r ${VERTIEFUNGEN[selectedVertiefung].gradient} text-white font-semibold hover:opacity-90 transition-opacity shadow-lg active:scale-95`}
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
