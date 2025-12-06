import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "~/contexts/LanguageContext";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  X,
  Info,
  BookOpen,
  Building2,
  Briefcase,
  Users,
  Heart,
  Plane,
  Globe,
  Laptop,
  Palette,
  TrendingUp,
  Home,
  Check,
  PlusCircle,
  Sparkles,
  BookMarked,
  ArrowRight,
  ExternalLink,
  Award,
  Clock,
} from "lucide-react";

export const loader = async () => null;

// Translations
const TRANSLATIONS = {
  de: {
    back: "Zurück zur Studienorganisation",
    title: "Zusatzkurs wählen",
    subtitle: "Wählen Sie einen Weiterbildungskurs aus dem Angebot der IU",
    howItWorks: "So funktioniert es",
    step1: "Kurs auswählen: Wählen Sie einen Weiterbildungskurs aus",
    step2: "Zur Antragsverwaltung: Dort finden Sie den Antrag \"Kostenlose Online-Weiterbildung\"",
    step3: "Antrag ausfüllen: Tragen Sie den ausgewählten Kurs in das Formular ein",
    importantNote: "Wichtiger Hinweis",
    noteText: "Pro Antrag kann nur ein Zusatzkurs beantragt werden. Wenn Sie mehrere Kurse belegen möchten, müssen Sie für jeden Kurs einen separaten Antrag in der Antragsverwaltung stellen.",
    searchPlaceholder: "Kurs suchen...",
    allCategories: "Alle Kategorien",
    selectedCourse: "Ausgewählter Kurs",
    noCourseSelected: "Noch kein Kurs ausgewählt",
    selectCourseHint: "Wählen Sie einen Kurs aus dem Katalog aus",
    yourData: "Ihre Daten",
    firstName: "Vorname",
    lastName: "Nachname",
    matriculation: "Matrikel-Nr.",
    program: "Studiengang",
    semester: "Semester",
    summary: "Zusammenfassung",
    courseCount: "Anzahl Kurse",
    credits: "Credits",
    goToApplication: "Zur Antragsverwaltung",
    courses: "Kurse",
    noCourses: "Keine Kurse gefunden",
  },
  en: {
    back: "Back to Study Organization",
    title: "Select Additional Course",
    subtitle: "Choose a continuing education course from IU's offerings",
    howItWorks: "How it works",
    step1: "Select a course: Choose one continuing education course",
    step2: "Go to Application Management: Find the \"Free Online Continuing Education\" application there",
    step3: "Fill out the application: Enter the selected course in the form",
    importantNote: "Important Notice",
    noteText: "Only one additional course can be requested per application. If you want to take multiple courses, you must submit a separate application for each course in the Application Management.",
    searchPlaceholder: "Search course...",
    allCategories: "All Categories",
    selectedCourse: "Selected Course",
    noCourseSelected: "No course selected yet",
    selectCourseHint: "Select a course from the catalog",
    yourData: "Your Data",
    firstName: "First Name",
    lastName: "Last Name",
    matriculation: "Matriculation No.",
    program: "Study Program",
    semester: "Semester",
    summary: "Summary",
    courseCount: "Number of Courses",
    credits: "Credits",
    goToApplication: "Go to Application Management",
    courses: "Courses",
    noCourses: "No courses found",
  },
};

// Student Data
const STUDENT_DATA = {
  vorname: "Sabin",
  nachname: "El Anwar",
  matrikelnummer: "102203036",
  studiengang: "Wirtschaftsinformatik (B.Sc.)",
  semester: 6,
};

type CourseItem = {
  id: string;
  name: string;
  credits: number;
  type: string;
  status?: "passed" | "enrolled";
  grade?: string;
};

type CategoryCourse = {
  id: string;
  name: string;
  credits: number;
  type: string;
  status?: string;
  grade?: string;
};

// Zusatzkurse / Weiterbildungskurse Categories
const ZUSATZKURSE_CATEGORIES = [
  {
    id: "architektur",
    name: "Architektur",
    icon: Building2,
    color: "slate",
    description: "Zusätzliche Kompetenzen im Bereich Architektur und Design",
    courses: [
      { id: "arch-001", name: "Darstellen: CAD", credits: 5, type: "Weiterbildung" },
      { id: "arch-002", name: "Darstellen: Modellbau", credits: 5, type: "Weiterbildung" },
    ],
  },
  {
    id: "bauingenieurwesen",
    name: "Bauingenieurwesen",
    icon: Home,
    color: "orange",
    description: "Technische Kenntnisse im Bauwesen",
    courses: [
      { id: "bau-001", name: "Gebäudetechnik", credits: 5, type: "Weiterbildung" },
    ],
  },
  {
    id: "bwl",
    name: "BWL",
    icon: Briefcase,
    color: "blue",
    description: "Betriebswirtschaftliche Zusatzqualifikationen",
    courses: [
      { id: "bwl-001", name: "Planen und Entscheiden", credits: 5, type: "Weiterbildung" },
      { id: "bwl-002", name: "Enterprise Resource Planning", credits: 5, type: "Weiterbildung" },
      { id: "bwl-003", name: "Unternehmensplanung und –kontrolle", credits: 5, type: "Weiterbildung" },
      { id: "bwl-004", name: "Business-Controlling I", credits: 5, type: "Weiterbildung" },
      { id: "bwl-005", name: "Business-Controlling II", credits: 5, type: "Weiterbildung" },
      { id: "bwl-006", name: "Financial Services Management I", credits: 5, type: "Weiterbildung" },
      { id: "bwl-007", name: "Financial Services Management II", credits: 5, type: "Weiterbildung" },
      { id: "bwl-008", name: "International Management", credits: 5, type: "Weiterbildung" },
      { id: "bwl-009", name: "Luftverkehrsmanagement", credits: 5, type: "Weiterbildung" },
      { id: "bwl-010", name: "Corporate Finance", credits: 5, type: "Weiterbildung" },
      { id: "bwl-011", name: "Finanzmanagement", credits: 5, type: "Weiterbildung" },
      { id: "bwl-012", name: "BWL I", credits: 5, type: "Weiterbildung" },
      { id: "bwl-013", name: "BWL II", credits: 5, type: "Weiterbildung" },
      { id: "bwl-014", name: "Unternehmensführung", credits: 5, type: "Weiterbildung" },
      { id: "bwl-015", name: "Unternehmensrecht", credits: 5, type: "Weiterbildung" },
      { id: "bwl-016", name: "Investition und Finanzierung", credits: 5, type: "Weiterbildung" },
      { id: "bwl-017", name: "Nachhaltigkeits- und Qualitätsmanagement", credits: 5, type: "Weiterbildung" },
      { id: "bwl-018", name: "Makroökonomie", credits: 5, type: "Weiterbildung" },
      { id: "bwl-019", name: "Mikroökonomie I", credits: 5, type: "Weiterbildung" },
      { id: "bwl-020", name: "Mikroökonomie II", credits: 5, type: "Weiterbildung" },
      { id: "bwl-021", name: "Ökonomie und Markt", credits: 5, type: "Weiterbildung" },
      { id: "bwl-022", name: "Statistik", credits: 5, type: "Weiterbildung" },
    ],
  },
  {
    id: "immobilienmanagement",
    name: "Immobilienmanagement",
    icon: Building2,
    color: "emerald",
    description: "Spezialisierung auf Immobilienwirtschaft",
    courses: [
      { id: "immo-001", name: "Angewandter Vertrieb I", credits: 5, type: "Weiterbildung" },
      { id: "immo-002", name: "Angewandter Vertrieb II", credits: 5, type: "Weiterbildung" },
      { id: "immo-003", name: "Negotiation I", credits: 5, type: "Weiterbildung" },
      { id: "immo-004", name: "Negotiation II", credits: 5, type: "Weiterbildung" },
      { id: "immo-005", name: "Immobilienrecht I", credits: 5, type: "Weiterbildung" },
      { id: "immo-006", name: "Immobilienrecht II", credits: 5, type: "Weiterbildung" },
    ],
  },
  {
    id: "it",
    name: "IT",
    icon: Laptop,
    color: "indigo",
    description: "Erweiterte IT-Kompetenzen und Spezialisierungen",
    courses: [
      { id: "it-001", name: "Grundlagen der industriellen Softwaretechnik", credits: 5, type: "Weiterbildung" },
      { id: "it-002", name: "Requirements Engineering", credits: 5, type: "Weiterbildung" },
      { id: "it-003", name: "Grundlagen der Softwaretechnik", credits: 5, type: "Weiterbildung" },
      { id: "it-004", name: "Einführung in Datenschutz und IT-Sicherheit", credits: 5, type: "Weiterbildung" },
      { id: "it-005", name: "Kryptografische Verfahren", credits: 5, type: "Weiterbildung" },
      { id: "it-006", name: "Mathematik Grundlagen I", credits: 5, type: "Weiterbildung" },
      { id: "it-007", name: "Mathematik Grundlagen II", credits: 5, type: "Weiterbildung" },
      { id: "it-008", name: "Automatisierung und Robotics", credits: 5, type: "Weiterbildung" },
      { id: "it-009", name: "Einführung in das Internet of Things", credits: 5, type: "Weiterbildung" },
      { id: "it-010", name: "Smart Devices", credits: 5, type: "Weiterbildung" },
      { id: "it-011", name: "Smart Mobility", credits: 5, type: "Weiterbildung" },
      { id: "it-012", name: "Smart Services", credits: 5, type: "Weiterbildung" },
      { id: "it-013", name: "Informatik und Gesellschaft", credits: 5, type: "Weiterbildung" },
      { id: "it-014", name: "Data Analytics und Big Data", credits: 5, type: "Weiterbildung" },
      { id: "it-015", name: "IT Project Management", credits: 5, type: "Weiterbildung" },
      { id: "it-016", name: "IT Architecture Management", credits: 5, type: "Weiterbildung" },
      { id: "it-017", name: "Artificial Intelligence", credits: 5, type: "Weiterbildung" },
      { id: "it-018", name: "Projekt: KI-Exzellenz mit kreativen Prompt-Techniken", credits: 5, type: "Weiterbildung", status: "passed", grade: "1,0" },
    ],
  },
  {
    id: "kindheitspaedagogik",
    name: "Kindheitspädagogik",
    icon: Users,
    color: "pink",
    description: "Pädagogische Zusatzqualifikationen",
    courses: [
      { id: "kp-001", name: "Interkulturelle Psychologie", credits: 5, type: "Weiterbildung" },
      { id: "kp-002", name: "Konfliktmanagement und Mediation", credits: 5, type: "Weiterbildung" },
      { id: "kp-003", name: "Psychologische Diagnostik", credits: 5, type: "Weiterbildung" },
      { id: "kp-004", name: "Social Entrepreneurship", credits: 5, type: "Weiterbildung" },
      { id: "kp-005", name: "Einführung in die Heilpädagogik", credits: 5, type: "Weiterbildung" },
    ],
  },
  {
    id: "kommunikation",
    name: "Kommunikation & PR",
    icon: Globe,
    color: "violet",
    description: "Kommunikationskompetenzen und Public Relations",
    courses: [
      { id: "kom-001", name: "Medienökonomie", credits: 5, type: "Weiterbildung" },
      { id: "kom-002", name: "Grundlagen Print- und Layoutsysteme", credits: 5, type: "Weiterbildung" },
      { id: "kom-003", name: "Kommunikation und Public Relations", credits: 5, type: "Weiterbildung" },
      { id: "kom-004", name: "Digital Skills", credits: 5, type: "Weiterbildung" },
    ],
  },
  {
    id: "marketing",
    name: "Marketingmanagement",
    icon: TrendingUp,
    color: "rose",
    description: "Marketing- und Vertriebskompetenzen",
    courses: [
      { id: "mark-001", name: "Globale Unternehmen und Globalisierung", credits: 5, type: "Weiterbildung" },
      { id: "mark-002", name: "Global Sourcing", credits: 5, type: "Weiterbildung" },
      { id: "mark-003", name: "Wirtschaftspsychologie", credits: 5, type: "Weiterbildung" },
      { id: "mark-004", name: "Online-Marketing", credits: 5, type: "Weiterbildung" },
      { id: "mark-005", name: "Social Media Marketing", credits: 5, type: "Weiterbildung" },
      { id: "mark-006", name: "E-Commerce I", credits: 5, type: "Weiterbildung" },
      { id: "mark-007", name: "E-Commerce II", credits: 5, type: "Weiterbildung" },
      { id: "mark-008", name: "Internationales Brand Management", credits: 5, type: "Weiterbildung" },
    ],
  },
  {
    id: "mediendesign",
    name: "Mediendesign",
    icon: Palette,
    color: "fuchsia",
    description: "Kreative und gestalterische Kompetenzen",
    courses: [
      { id: "med-001", name: "Customer Relationship Management", credits: 5, type: "Weiterbildung" },
      { id: "med-002", name: "Digitales Redaktionsmanagement", credits: 5, type: "Weiterbildung" },
      { id: "med-003", name: "Storytelling", credits: 5, type: "Weiterbildung" },
      { id: "med-004", name: "Corporate Communication", credits: 5, type: "Weiterbildung" },
      { id: "med-005", name: "Influencer Marketing", credits: 5, type: "Weiterbildung" },
      { id: "med-006", name: "Web-Analytics", credits: 5, type: "Weiterbildung" },
    ],
  },
  {
    id: "personal",
    name: "Personal",
    icon: Users,
    color: "cyan",
    description: "HR und Personalmanagement",
    courses: [
      { id: "pers-001", name: "Grundlagen der Arbeits- und Organisationspsychologie", credits: 5, type: "Weiterbildung" },
      { id: "pers-002", name: "Advanced Leadership I", credits: 5, type: "Weiterbildung" },
      { id: "pers-003", name: "Advanced Leadership II", credits: 5, type: "Weiterbildung" },
      { id: "pers-004", name: "Personalwesen Spezialisierung I", credits: 5, type: "Weiterbildung" },
      { id: "pers-005", name: "Agiles Management", credits: 5, type: "Weiterbildung" },
    ],
  },
  {
    id: "soziales",
    name: "Soziales & Gesundheit",
    icon: Heart,
    color: "red",
    description: "Gesundheits- und Sozialwesen",
    courses: [
      { id: "soz-001", name: "Interkulturelles Management", credits: 5, type: "Weiterbildung" },
      { id: "soz-002", name: "Sozialmanagement", credits: 5, type: "Weiterbildung" },
      { id: "soz-003", name: "Betriebliches Gesundheitsmanagement", credits: 5, type: "Weiterbildung" },
      { id: "soz-004", name: "Betriebspsychologie", credits: 5, type: "Weiterbildung" },
      { id: "soz-005", name: "Social Psychology", credits: 5, type: "Weiterbildung" },
    ],
  },
  {
    id: "tourismus",
    name: "Tourismus & Gastronomie",
    icon: Plane,
    color: "sky",
    description: "Event- und Tourismusmanagement",
    courses: [
      { id: "tour-001", name: "Kreuzfahrttourismus", credits: 5, type: "Weiterbildung" },
      { id: "tour-002", name: "Gastronomiemanagement", credits: 5, type: "Weiterbildung" },
      { id: "tour-003", name: "Sportevents", credits: 5, type: "Weiterbildung" },
      { id: "tour-004", name: "Messe- und Ausstellungsmanagement", credits: 5, type: "Weiterbildung" },
      { id: "tour-005", name: "Nachhaltigkeitsmanagement", credits: 5, type: "Weiterbildung" },
      { id: "tour-006", name: "Gesundheitstourismus", credits: 5, type: "Weiterbildung" },
    ],
  },
  {
    id: "sprachen",
    name: "Sprachkurse",
    icon: Globe,
    color: "teal",
    description: "Fremdsprachenkenntnisse erweitern",
    courses: [
      { id: "spr-001", name: "Fremdsprache Französisch", credits: 5, type: "Weiterbildung" },
      { id: "spr-002", name: "Fremdsprache Italienisch", credits: 5, type: "Weiterbildung" },
      { id: "spr-003", name: "Fremdsprache Spanisch", credits: 5, type: "Weiterbildung" },
      { id: "spr-004", name: "Fremdsprache Englisch", credits: 5, type: "Weiterbildung" },
      { id: "spr-005", name: "Gebärdensprache", credits: 5, type: "Weiterbildung" },
    ],
  },
  {
    id: "onlineklausur",
    name: "Online-Module",
    icon: Laptop,
    color: "purple",
    description: "Flexible Online-Weiterbildungen",
    courses: [
      { id: "onl-001", name: "Sozialwirtschaft", credits: 5, type: "Weiterbildung" },
      { id: "onl-002", name: "Computertraining", credits: 5, type: "Weiterbildung" },
      { id: "onl-003", name: "Marketing", credits: 5, type: "Weiterbildung" },
      { id: "onl-004", name: "Recht", credits: 5, type: "Weiterbildung" },
      { id: "onl-005", name: "Wirtschaftsmathematik", credits: 5, type: "Weiterbildung" },
      { id: "onl-006", name: "Projektmanagement", credits: 5, type: "Weiterbildung" },
      { id: "onl-007", name: "Digital Skills", credits: 5, type: "Weiterbildung" },
      { id: "onl-008", name: "Collaborative Work", credits: 5, type: "Weiterbildung" },
      { id: "onl-009", name: "Personal Skills", credits: 5, type: "Weiterbildung" },
    ],
  },
];

export default function Klausuranmeldung() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["it"]));
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());

  // Filter courses based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return ZUSATZKURSE_CATEGORIES;
    
    const query = searchQuery.toLowerCase();
    return ZUSATZKURSE_CATEGORIES.map(cat => ({
      ...cat,
      courses: cat.courses.filter(course => 
        course.name.toLowerCase().includes(query)
      )
    })).filter(cat => cat.courses.length > 0);
  }, [searchQuery]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const toggleCourse = (courseId: string) => {
    setSelectedCourses(prev => {
      // Single selection - only one course at a time
      if (prev.has(courseId)) {
        // Deselect if clicking the same course
        return new Set();
      } else {
        // Select only this course (deselect any previous)
        return new Set([courseId]);
      }
    });
  };

  const handleGoToAntragsverwaltung = () => {
    // Save selected courses to localStorage for the Antragsverwaltung to use
    const coursesData = selectedCourseDetails.map(c => ({
      id: c.id,
      name: c.name,
      credits: c.credits
    }));
    localStorage.setItem("selectedWeiterbildungskurse", JSON.stringify(coursesData));
    navigate("/antragsverwaltung");
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; iconBg: string }> = {
      slate: { bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", iconBg: "bg-slate-500" },
      orange: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", iconBg: "bg-orange-500" },
      blue: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", iconBg: "bg-blue-500" },
      emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", iconBg: "bg-emerald-500" },
      indigo: { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", iconBg: "bg-indigo-500" },
      pink: { bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", iconBg: "bg-pink-500" },
      violet: { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", iconBg: "bg-violet-500" },
      rose: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", iconBg: "bg-rose-500" },
      fuchsia: { bg: "bg-fuchsia-500/10", text: "text-fuchsia-600 dark:text-fuchsia-400", iconBg: "bg-fuchsia-500" },
      cyan: { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", iconBg: "bg-cyan-500" },
      red: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", iconBg: "bg-red-500" },
      sky: { bg: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400", iconBg: "bg-sky-500" },
      teal: { bg: "bg-teal-500/10", text: "text-teal-600 dark:text-teal-400", iconBg: "bg-teal-500" },
      purple: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", iconBg: "bg-purple-500" },
    };
    return colors[color] || colors.blue;
  };

  const selectedCourseDetails = useMemo(() => {
    const details: { id: string; name: string; credits: number; type: string; status?: string; grade?: string }[] = [];
    ZUSATZKURSE_CATEGORIES.forEach(cat => {
      cat.courses.forEach(course => {
        if (selectedCourses.has(course.id)) {
          details.push(course);
        }
      });
    });
    return details;
  }, [selectedCourses]);

  const totalCredits = selectedCourseDetails.reduce((sum, c) => sum + c.credits, 0);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/study-organization"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.back}
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-black dark:text-white mb-3 flex items-center gap-3">
              <PlusCircle className="w-10 h-10 text-primary" />
              {t.title}
            </h1>
            <p className="text-lg text-slate-700 dark:text-slate-300">
              {t.subtitle}
            </p>
          </div>

          {/* Student Info Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 min-w-[280px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {STUDENT_DATA.vorname} {STUDENT_DATA.nachname}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t.matriculation}: {STUDENT_DATA.matrikelnummer}
                </p>
              </div>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <p>{STUDENT_DATA.studiengang}</p>
              <p>{STUDENT_DATA.semester}. {t.semester}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-4 p-5 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-500/20 flex items-start gap-4">
        <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
            {t.howItWorks}
          </h3>
          <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-decimal list-inside">
            <li>{t.step1}</li>
            <li>{t.step2}</li>
            <li>{t.step3}</li>
          </ol>
        </div>
      </div>

      {/* Important Notice Banner */}
      <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
        <div className="p-2 rounded-lg bg-amber-500/20">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
            {t.importantNote}
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {t.noteText}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Course Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          {/* Categories */}
          <div className="space-y-4">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              const colorClasses = getColorClasses(category.color);
              const isExpanded = expandedCategories.has(category.id);
              const selectedInCategory = category.courses.filter(c => selectedCourses.has(c.id)).length;

              return (
                <div
                  key={category.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${colorClasses.iconBg}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {category.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {selectedInCategory > 0 && (
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {selectedInCategory} ausgewählt
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{category.courses.length} Kurse</span>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Courses List */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 dark:border-slate-800">
                      {category.courses.map((course) => {
                        const isSelected = selectedCourses.has(course.id);
                        const isPassed = course.status === "passed";
                        const isDisabled = isPassed;

                        return (
                          <div
                            key={course.id}
                            onClick={() => !isDisabled && toggleCourse(course.id)}
                            className={`flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0 transition-colors ${
                              isDisabled
                                ? "opacity-60 cursor-not-allowed"
                                : "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30"
                            } ${isSelected ? "bg-primary/5" : ""}`}
                          >
                            <div className="flex items-center gap-4">
                              {/* Checkbox */}
                              <div
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                  isSelected
                                    ? "bg-primary border-primary"
                                    : isPassed
                                    ? "bg-emerald-500 border-emerald-500"
                                    : "border-slate-300 dark:border-slate-600"
                                }`}
                              >
                                {(isSelected || isPassed) && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>

                              <div>
                                <p className="font-medium text-slate-900 dark:text-white">
                                  {course.name}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-sm text-slate-500 dark:text-slate-400">
                                    {course.credits} CP
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${colorClasses.bg} ${colorClasses.text}`}>
                                    {course.type}
                                  </span>
                                  {isPassed && (
                                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                      ✓ Bestanden ({course.grade})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selection Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Selection Summary Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-primary/5 to-purple-500/5">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-primary" />
                  {t.selectedCourse}
                </h3>
              </div>

              <div className="p-5">
                {selectedCourseDetails.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {t.noCourseSelected}
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                      {t.selectCourseHint}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedCourseDetails.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white text-sm truncate">
                            {course.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {course.credits} CP
                          </p>
                        </div>
                        <button
                          onClick={() => toggleCourse(course.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Summary Stats */}
                {selectedCourseDetails.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500 dark:text-slate-400">{t.courseCount}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedCourseDetails.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">{t.credits}</span>
                      <span className="font-semibold text-primary">{totalCredits} CP</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <button
                  onClick={handleGoToAntragsverwaltung}
                  disabled={selectedCourseDetails.length === 0}
                  className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    selectedCourseDetails.length === 0
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20 active:scale-95"
                  }`}
                >
                  <ExternalLink className="w-5 h-5" />
                  {t.goToApplication}
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                  Wählen Sie dort den Antrag<br/>
                  <strong>"Antrag auf kostenlose Online-Weiterbildung"</strong>
                </p>
              </div>
            </div>

            {/* Direct Link Card */}
            <Link
              to="/antragsverwaltung"
              className="block p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/30 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    Antragsverwaltung
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Alle Anträge verwalten
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
