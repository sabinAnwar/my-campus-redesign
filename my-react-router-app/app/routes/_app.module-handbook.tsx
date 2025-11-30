import React, { useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";
import { useLanguage } from "~/contexts/LanguageContext";

type Module = {
  code: string;
  title: string;
  semester: number;
  ects: number;
  type: "Pflicht" | "Wahl";
  exam: string;
  workload: number;
  status: "laufend" | "geplant" | "abgeschlossen";
  skills: string[];
  description: string;
};

const userProfile = {
  name: "Sabin",
  program: "B.Sc. Wirtschaftsinformatik",
  campus: "Campus Hamburg",
  cohort: "WiSe 23/24",
  focus: "Data & Process Management",
  advisor: "Dr. Johanna Kuester",
  advisorEmail: "studienberatung@campus-hamburg.example",
  pdfUrl: "/uploads/modulhandbuch-winfo.pdf",
  currentSemester: 7,
};

type LoaderData = {
  courses: Array<{
    id: number;
    code: string;
    name: string;
    description: string | null;
    studiengang?: { name: string } | null;
  }>;
  studiengangName: string | null;
};

const TEXT = {
  de: {
    title: "Modulplan Wirtschaftsinformatik",
    subtitle: "Kurzer Ueberblick zu Modulen, Pruefungsformen und ECTS je Semester.",
    legendMandatory: "Pflicht = blau - Wahl = grau - Projektarbeiten sind markiert.",
    legendStatus: "Status laufend - Gelb = geplant - Blau = abgeschlossen.",
    legendFields: "ECTS, Pruefungsform und Workload stehen direkt im Modul.",
    btnPdf: "Modulhandbuch PDF",
    btnAdvisor: "Beratungstermin",
    contact: "Ansprechpartner",
    programLabel: "Studium",
    profileLabel: "Dein Profil",
    trackLabel: "Empfohlener Track",
    modulesPerSemester: "Module je Semester",
    currentSemesterTitle: (sem: number) => `Aktuell Semester ${sem}`,
    currentSemesterDesc: "Diese Module laufen jetzt und zeigen Pruefungsform und ECTS.",
    module: "Modul",
    semester: "Semester",
    exam: "Pruefung",
    workload: "Workload",
    statusRunning: "laufend",
    statusPlanned: "geplant",
    statusDone: "abgeschlossen",
    recommendationTitle: (focus: string) => `Empfohlene Reihenfolge fuer ${focus}`,
    recommendationChip: "Kuratiert fuer Sabin",
    downloadsTitle: "Downloads & Support",
    downloadsSubtitle: "Alles fuer dein Modulhandbuch",
    downloadsItems: [
      "- Vollstaendiges Modulhandbuch (PDF)",
      "- Pruefungsordnung und Fristen",
      "- Kontakt Studienbuero & Beratung",
    ],
    downloadPdf: "PDF herunterladen",
    askAdvisor: (advisor: string) => `Frage an ${advisor}`,
    helpText: "Fuer Rueckfragen zu Wahlpflichtfaechern melde dich jederzeit per Mail.",
  },
  en: {
    title: "Module Plan Business Informatics",
    subtitle: "Quick overview of modules, exam formats and ECTS per semester.",
    legendMandatory: "Mandatory = blue - Elective = gray - Project courses are labeled.",
    legendStatus: "Green = running - Yellow = planned - Blue = completed.",
    legendFields: "ECTS, exam type and workload are shown inside each module.",
    btnPdf: "Module Handbook PDF",
    btnAdvisor: "Advising appointment",
    contact: "Contact",
    programLabel: "Program",
    profileLabel: "Your profile",
    trackLabel: "Recommended track",
    modulesPerSemester: "Modules per semester",
    currentSemesterTitle: (sem: number) => `Current semester ${sem}`,
    currentSemesterDesc: "Modules currently running with exam type and ECTS.",
    module: "Module",
    semester: "Semester",
    exam: "Exam",
    workload: "Workload",
    statusRunning: "running",
    statusPlanned: "planned",
    statusDone: "completed",
    recommendationTitle: (focus: string) => `Suggested order for ${focus}`,
    recommendationChip: "Curated for Sabin",
    downloadsTitle: "Downloads & support",
    downloadsSubtitle: "Everything for your handbook",
    downloadsItems: [
      "- Full module handbook (PDF)",
      "- Exam regulations and deadlines",
      "- Contact study office & advising",
    ],
    downloadPdf: "Download PDF",
    askAdvisor: (advisor: string) => `Ask ${advisor}`,
    helpText: "Reach out anytime for elective questions via email.",
  },
};

const TYPE_LABELS = {
  de: { Pflicht: "Pflicht", Wahl: "Wahl" },
  en: { Pflicht: "Mandatory", Wahl: "Elective" },
};

const STATUS_LABELS = {
  de: { laufend: "laufend", geplant: "geplant", abgeschlossen: "abgeschlossen" },
  en: { laufend: "running", geplant: "planned", abgeschlossen: "completed" },
};

const COURSE_META: Record<
  string,
  {
    ects: number;
    exam: string;
    semester: number;
    type: Module["type"];
    workload: number;
    skills?: string[];
    status?: Module["status"];
    description?: string;
  }
> = {
  "WI-101": {
    ects: 6,
    exam: "Klausur (120 Min)",
    semester: 1,
    type: "Pflicht",
    workload: 150,
    skills: ["Java", "Git", "Testing", "Clean Code"],
    description:
      "Grundlagen der Softwareentwicklung mit Fokus auf wartbare Architektur, Versionskontrolle und Testautomatisierung.",
    status: "laufend",
  },
  "WI-102": {
    ects: 5,
    exam: "Klausur (90 Min)",
    semester: 1,
    type: "Pflicht",
    workload: 125,
    skills: ["Wahrscheinlichkeit", "Hypothesentests", "Python"],
    description:
      "Mathematische Werkzeuge fuer datengetriebene Entscheidungen und erste Schritte in der explorativen Datenanalyse.",
    status: "laufend",
  },
  "WI-201": {
    ects: 6,
    exam: "Projekt + Fachgespraech",
    semester: 2,
    type: "Pflicht",
    workload: 150,
    skills: ["SQL", "Datenmodellierung", "Indexing", "APIs"],
    description:
      "Relationale Modellierung, Normalformen, Query-Optimierung und API-Anbindung mit praxisnahen Cases.",
    status: "geplant",
  },
  "WI-202": {
    ects: 5,
    exam: "Hausarbeit",
    semester: 2,
    type: "Pflicht",
    workload: 125,
    skills: ["COBIT", "ITIL", "Stakeholder-Management"],
    description:
      "Steuerung von IT-Landschaften, Service-Management und Risikobetrachtung fuer digitale Transformation.",
    status: "geplant",
  },
  "WI-301": {
    ects: 6,
    exam: "Case Study + Praesentation",
    semester: 3,
    type: "Wahl",
    workload: 150,
    skills: ["Power BI", "Process Mining", "Python"],
    description:
      "Analytische Auswertung von Prozessen, KPI-Design und Visualisierung datenbasierter Handlungsempfehlungen.",
    status: "geplant",
  },
  "WI-302": {
    ects: 6,
    exam: "Projekt (CI/CD Pipeline)",
    semester: 3,
    type: "Wahl",
    workload: 150,
    skills: ["Docker", "Kubernetes", "CI/CD"],
    description:
      "Deployment-Strategien, Observability und Automatisierung fuer skalierbare Anwendungen in der Cloud.",
    status: "geplant",
  },
  "WI-401": {
    ects: 6,
    exam: "Portfolio + Viva",
    semester: 4,
    type: "Wahl",
    workload: 150,
    skills: ["Regression", "Classification", "MLOps"],
    description:
      "Modellierung, Evaluierung und Operationalisierung von ML-Loesungen mit Fokus auf Business Impact.",
    status: "geplant",
  },
  "WI-402": {
    ects: 5,
    exam: "Praxisprojekt",
    semester: 4,
    type: "Wahl",
    workload: 125,
    skills: ["Product Discovery", "Roadmapping", "OKRs"],
    description:
      "Von der Idee zum digitalen Produkt: Nutzerzentrierte Entwicklung, Priorisierung und Go-to-Market-Plan.",
    status: "geplant",
  },
  "WI-501": {
    ects: 5,
    exam: "Hausarbeit + Praesentation",
    semester: 5,
    type: "Wahl",
    workload: 150,
    skills: ["Enterprise Architecture", "BPMN", "Stakeholder"],
    description:
      "Architektur- und Prozessgestaltung fuer skalierende Organisationen inkl. BPMN und EA-Patterns.",
    status: "geplant",
  },
  "WI-502": {
    ects: 5,
    exam: "Praesentation + Beratungsdossier",
    semester: 5,
    type: "Wahl",
    workload: 125,
    skills: ["Consulting", "Kommunikation", "Workshops"],
    description:
      "IT-Consulting mit Fokus auf Workshops, Storylining und Umsetzungsplaene fuer Stakeholder.",
    status: "geplant",
  },
  "WI-503": {
    ects: 5,
    exam: "Praesentation + Reflexion",
    semester: 5,
    type: "Pflicht",
    workload: 125,
    skills: ["Change", "Kommunikation", "Team"],
    description: "Change Management in IT-Projekten mit Fokus auf Kommunikation und Adoption.",
    status: "geplant",
  },
  "WI-504": {
    ects: 5,
    exam: "Portfolio",
    semester: 5,
    type: "Wahl",
    workload: 125,
    skills: ["Leadership", "Agilitaet", "Facilitation"],
    description: "Agile Leadership, Moderation und Servant Leadership fuer Tech Teams.",
    status: "geplant",
  },
  "WI-505": {
    ects: 5,
    exam: "Projektarbeit 5 + Praesentation",
    semester: 5,
    type: "Pflicht",
    workload: 150,
    skills: ["Projektarbeit", "Praxis", "Reporting"],
    description: "Projektarbeit 5 fuer duale Studierende mit Praxisanteil und Abschlusspruefung.",
    status: "geplant",
  },
  "WI-601": {
    ects: 5,
    exam: "Klausur (90 Min)",
    semester: 6,
    type: "Pflicht",
    workload: 150,
    skills: ["Security", "Compliance", "Risk"],
    description:
      "IT-Security, Datenschutz und Compliance mit Risikoanalyse und technischen Kontrollen.",
    status: "geplant",
  },
  "WI-602": {
    ects: 5,
    exam: "Hausarbeit",
    semester: 6,
    type: "Wahl",
    workload: 125,
    skills: ["Data Governance", "Ethics", "Policies"],
    description:
      "Datenqualitaet, Governance-Modelle und ethische Leitplanken fuer datengetriebene Produkte.",
    status: "geplant",
  },
  "WI-603": {
    ects: 5,
    exam: "Klausur (90 Min)",
    semester: 6,
    type: "Wahl",
    workload: 150,
    skills: ["Cloud", "Security", "Compliance"],
    description: "Cloud Security, Identity und Compliance Kontrollen in verteilten Systemen.",
    status: "geplant",
  },
  "WI-604": {
    ects: 5,
    exam: "Hausarbeit + Dashboard",
    semester: 6,
    type: "Wahl",
    workload: 125,
    skills: ["BI", "Datenmodellierung", "Reporting"],
    description: "Business Intelligence mit Datenmodellen, KPIs und Visualisierung.",
    status: "geplant",
  },
  "WI-605": {
    ects: 5,
    exam: "Projektarbeit 6 + Praesentation",
    semester: 6,
    type: "Pflicht",
    workload: 150,
    skills: ["Projektarbeit", "Praxis", "Stakeholder"],
    description: "Projektarbeit 6 fuer duale Studierende mit Abschlusspruefung.",
    status: "geplant",
  },
  "WI-701": {
    ects: 12,
    exam: "Bachelorarbeit + Kolloquium (60 Min)",
    semester: 7,
    type: "Pflicht",
    workload: 360,
    skills: ["Research", "Academic Writing", "Defense"],
    description:
      "Eigenstaendige wissenschaftliche Arbeit mit Kolloquium, Themenfokus Wirtschaftsinformatik.",
    status: "laufend",
  },
  "WI-702": {
    ects: 8,
    exam: "Projektbericht + Praesentation",
    semester: 7,
    type: "Pflicht",
    workload: 200,
    skills: ["Projektmanagement", "Praesentation", "Stakeholder"],
    description:
      "Praxisprojekt mit Unternehmensbezug, Abschluss durch schriftlichen Bericht und Praesentation.",
    status: "laufend",
  },
  "WI-703": {
    ects: 5,
    exam: "Praesentation (Team) + Reflexion",
    semester: 7,
    type: "Wahl",
    workload: 150,
    skills: ["Strategy", "Product", "Pitching"],
    description:
      "Strategische Entwicklung digitaler Produkte, Team-Pitch und persoenliche Reflexion.",
    status: "laufend",
  },
  "WI-704": {
    ects: 5,
    exam: "Praesentation + Reflexion",
    semester: 7,
    type: "Wahl",
    workload: 125,
    skills: ["Career", "Professional Skills"],
    description: "Career Lab mit Fokus auf Profil, Pitch und Bewerbungsunterlagen.",
    status: "laufend",
  },
  "WI-705": {
    ects: 5,
    exam: "Projektarbeit 7 + Praesentation",
    semester: 7,
    type: "Pflicht",
    workload: 150,
    skills: ["Projektarbeit", "Abschluss", "Praxis"],
    description: "Projektarbeit 7 fuer duale Studierende als Abschlussprojekt.",
    status: "laufend",
  },
  "WI-103": {
    ects: 5,
    exam: "Klausur (90 Min)",
    semester: 1,
    type: "Pflicht",
    workload: 125,
    skills: ["BWL", "Rechnung", "Organisation"],
    description: "Betriebswirtschaftliche Grundlagen fuer Wirtschaftsinformatiker.",
    status: "laufend",
  },
  "WI-104": {
    ects: 5,
    exam: "Portfolio + Praesentation",
    semester: 1,
    type: "Wahl",
    workload: 125,
    skills: ["Kommunikation", "Team", "Praesentation"],
    description: "Kommunikation und Teamarbeit mit Praesentationsuebungen.",
    status: "laufend",
  },
  "WI-105": {
    ects: 5,
    exam: "Projektarbeit 1 + Praesentation",
    semester: 1,
    type: "Pflicht",
    workload: 150,
    skills: ["Projektarbeit", "Praxis", "Dokumentation"],
    description: "Projektarbeit 1 fuer duale Studierende mit Praxisbezug.",
    status: "laufend",
  },
  "WI-203": {
    ects: 5,
    exam: "Hausarbeit",
    semester: 2,
    type: "Pflicht",
    workload: 125,
    skills: ["Requirements", "Dokumentation", "Methodik"],
    description: "Requirements Engineering und Spezifikationstechniken.",
    status: "geplant",
  },
  "WI-204": {
    ects: 5,
    exam: "Klausur (90 Min)",
    semester: 2,
    type: "Wahl",
    workload: 125,
    skills: ["Statistik", "Datenanalyse"],
    description: "Vertiefung Statistik mit Anwendungen in der Datenanalyse.",
    status: "geplant",
  },
  "WI-205": {
    ects: 5,
    exam: "Projektarbeit 2 + Praesentation",
    semester: 2,
    type: "Pflicht",
    workload: 150,
    skills: ["Projektarbeit", "Praxis", "Team"],
    description: "Projektarbeit 2 fuer duale Studierende.",
    status: "geplant",
  },
  "WI-303": {
    ects: 5,
    exam: "Klausur (90 Min)",
    semester: 3,
    type: "Wahl",
    workload: 125,
    skills: ["IT-Recht", "Compliance"],
    description: "IT-Recht, Datenschutz und Vertragsrecht im digitalen Umfeld.",
    status: "geplant",
  },
  "WI-304": {
    ects: 5,
    exam: "Projekt + Praesentation",
    semester: 3,
    type: "Wahl",
    workload: 125,
    skills: ["UX", "Design Thinking"],
    description: "UX und Design Thinking mit Prototyping.",
    status: "geplant",
  },
  "WI-305": {
    ects: 5,
    exam: "Projektarbeit 3 + Praesentation",
    semester: 3,
    type: "Pflicht",
    workload: 150,
    skills: ["Projektarbeit", "Praxis", "Stakeholder"],
    description: "Projektarbeit 3 fuer duale Studierende.",
    status: "geplant",
  },
  "WI-403": {
    ects: 5,
    exam: "Hausarbeit + Dashboard",
    semester: 4,
    type: "Wahl",
    workload: 125,
    skills: ["Data Warehousing", "ETL", "Modellierung"],
    description: "Data Warehousing, ETL Pipelines und Modellierung.",
    status: "geplant",
  },
  "WI-404": {
    ects: 5,
    exam: "Praesentation + Projektplan",
    semester: 4,
    type: "Pflicht",
    workload: 125,
    skills: ["Projektmanagement", "Planung"],
    description: "Projektmanagement mit Planung, Risiko und Steuerung.",
    status: "geplant",
  },
  "WI-405": {
    ects: 5,
    exam: "Projektarbeit 4 + Praesentation",
    semester: 4,
    type: "Pflicht",
    workload: 150,
    skills: ["Projektarbeit", "Praxis", "Reporting"],
    description: "Projektarbeit 4 fuer duale Studierende.",
    status: "geplant",
  },
};

export const loader = async ({ request }: { request: Request }) => {
  const user = await getUserFromRequest(request);
  const where = user?.studiengangId
    ? { studiengangId: user.studiengangId }
    : undefined;

  let courses: LoaderData["courses"] = [];

  try {
    courses = await prisma.course.findMany({
      where,
      include: { studiengang: true },
      orderBy: [{ studiengang: { name: "asc" } }, { code: "asc" }],
    });
  } catch (error) {
    console.error("Module handbook: failed to load courses from DB", error);
    courses = [];
  }

  const studiengangName =
    courses.find((c) => c.studiengang?.name)?.studiengang?.name || null;

  return { courses, studiengangName };
};

export default function ModuleHandbookPage() {
  const { courses, studiengangName } = useLoaderData() as LoaderData;
  const [semesterFilter, setSemesterFilter] = useState<number | "all">("all");
  const { language } = useLanguage();
  const t = TEXT[language];

  const deriveSemesterFromCode = (code: string) => {
    const numericPart = code.split("-")[1]?.trim();
    const leadingDigit = numericPart ? parseInt(numericPart[0], 10) : NaN;
    return Number.isFinite(leadingDigit) && leadingDigit > 0 ? leadingDigit : 1;
  };

  const modules = useMemo<Module[]>(() => {
    const fallbackMeta = {
      ects: 5,
      exam: "Klausur",
      semester: 1,
      type: "Pflicht" as const,
      workload: 150,
      skills: ["Grundlagen"],
      status: "geplant" as const,
    };

    return courses.map((course) => {
      const meta = COURSE_META[course.code] || fallbackMeta;
      const semester =
        meta.semester && Number.isFinite(meta.semester)
          ? meta.semester
          : deriveSemesterFromCode(course.code);
      const status =
        meta.status ??
        (semester <= userProfile.currentSemester ? "laufend" : "geplant");
      return {
        code: course.code,
        title: course.name,
        semester,
        ects: meta.ects,
        type: meta.type,
        exam: meta.exam,
        workload: meta.workload,
        status,
        skills: meta.skills || ["Allgemeine Kompetenzen"],
        description:
          course.description ||
          meta.description ||
          "Noch keine Beschreibung im Modulhandbuch.",
      };
    });
  }, [courses]);

  const ectsCompleted = useMemo(
    () =>
      modules.reduce((sum, mod) => {
        const isCompleted = mod.semester < userProfile.currentSemester;
        const isRunning = mod.semester === userProfile.currentSemester;
        return sum + (isCompleted || isRunning ? mod.ects : 0);
      }, 0),
    [modules]
  );
  const ectsTotal = 180;

  const filteredModules = useMemo(() => {
    if (semesterFilter === "all") return modules;
    return modules.filter((m) => m.semester === semesterFilter);
  }, [modules, semesterFilter]);

  const semesterOptions = useMemo(() => {
    const values = Array.from(new Set(modules.map((m) => m.semester))).sort(
      (a, b) => a - b
    );
    return values.length ? values : [1];
  }, [modules]);

  const currentSemesterModules = useMemo(
    () =>
      modules.filter((m) => m.semester === userProfile.currentSemester) || [],
    [modules]
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Hero */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-wide text-slate-600 dark:text-slate-200 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-100 border border-blue-200/70 dark:border-blue-800">
              {language === "de" ? "Modulhandbuch" : "Module handbook"}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800/70 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
              {studiengangName || userProfile.program}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100 border border-emerald-200/70 dark:border-emerald-800">
              {userProfile.campus}
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-[2fr,1fr] md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                {t.title}
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                {t.subtitle}
              </p>
              <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  <span>{t.legendMandatory}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{t.legendStatus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  <span>{t.legendFields}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href={userProfile.pdfUrl}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition-colors"
                  download
                >
                  {t.btnPdf}
                </a>
                <a
                  href={`mailto:${userProfile.advisorEmail}?subject=${encodeURIComponent("Beratungstermin Modulhandbuch")}`}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t.btnAdvisor}
                </a>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t.contact}: {userProfile.advisor}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {language === "de" ? "Schwerpunkt" : "Focus"}
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">{userProfile.focus}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t.semester}
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {userProfile.currentSemester}. {t.semester}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {language === "de" ? "Kohorte" : "Cohort"}
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">{userProfile.cohort}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {language === "de" ? "Standort" : "Campus"}
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">{userProfile.campus}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick facts */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-md">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {t.programLabel}
            </p>
            <p className="mt-1 text-lg font-bold">
              {studiengangName || "Wirtschaftsinformatik"}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {language === "de"
                ? "Praxisorientiert mit Management-, Data- und Tech-Modulen."
                : "Practice-oriented with management, data, and tech modules."}
            </p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-md">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {t.profileLabel}
            </p>
            <p className="mt-1 text-lg font-bold">Sabin - {userProfile.campus}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {language === "de"
                ? `Fokus ${userProfile.focus}, Advisor ${userProfile.advisor}, aktuell Semester ${userProfile.currentSemester}.`
                : `Focus ${userProfile.focus}, advisor ${userProfile.advisor}, current semester ${userProfile.currentSemester}.`}
            </p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-md">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {t.trackLabel}
            </p>
            <p className="mt-1 text-lg font-bold">Data & Analytics</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {language === "de"
                ? "Process Mining, BI, ML - perfekt fuer Wirtschaftsinformatik."
                : "Process Mining, BI, ML - great fit for Business Informatics."}
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-md">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t.modulesPerSemester}
            </h2>
            <div className="ml-auto flex flex-wrap gap-2">
              {["all", ...semesterOptions].map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSemesterFilter(sem as number | "all")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 ${
                    semesterFilter === sem
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400"
                  }`}
                >
                  {sem === "all" ? (language === "de" ? "Alle" : "All") : `${t.semester} ${sem}`}
                </button>
              ))}
            </div>
          </div>

          {/* Aktive Module im aktuellen Semester */}
          <div className="mt-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-900/20 p-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                  {t.currentSemesterTitle(userProfile.currentSemester)}
                </p>
                <p className="text-sm text-emerald-800 dark:text-emerald-100">
                  {t.currentSemesterDesc}
                </p>
              </div>
              <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-100">
              {currentSemesterModules.length} {t.module} -{" "}
                {currentSemesterModules.reduce((sum, m) => sum + m.ects, 0)}{" "}
              ECTS
              </div>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {currentSemesterModules.map((module) => (
                  <div
                    key={module.code}
                    className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-950 p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-100 mb-2">
                      <span className="font-bold">{module.code}</span>
                      <span className="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-800/60 text-[11px] font-bold">
                        {TYPE_LABELS[language][module.type]}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      {module.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                      {module.description}
                    </p>
                    <div className="text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>{t.exam}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {module.exam}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>ECTS</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {module.ects}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filteredModules.map((module) => (
              <article
                key={module.code}
                className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <div
                  className={`absolute right-4 top-4 text-[11px] uppercase tracking-wide px-3 py-1 rounded-full border ${
                    module.type === "Pflicht"
                      ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-100 dark:border-blue-800"
                      : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-200 dark:border-slate-700"
                  }`}
                >
                  {TYPE_LABELS[language][module.type]}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200">
                    {module.code}
                  </span>
                  <span>
                    {t.semester} {module.semester}
                  </span>
                  <span className="flex items-center gap-1">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        module.status === "laufend"
                          ? "bg-emerald-500"
                          : module.status === "geplant"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                      }`}
                    />
                    {module.status === "laufend"
                      ? STATUS_LABELS[language].laufend
                      : module.status === "geplant"
                        ? STATUS_LABELS[language].geplant
                        : STATUS_LABELS[language].abgeschlossen}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {module.description}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      ECTS
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {module.ects}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {t.exam}
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {module.exam}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {t.workload}
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {module.workload}h
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {module.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {t.recommendationTitle(userProfile.focus)}
              </h3>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-100 dark:border-emerald-800">
                {t.recommendationChip}
              </span>
            </div>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Data & Process Analytics (WI-301)
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Kombiniert BI, KPI-Design und Process Mining fuer datenbasierte Entscheidungen.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Advanced Analytics & Machine Learning (WI-401)
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Vertieft Statistik und ML fuer automatisierte Vorhersagen inklusive MLOps-Blick.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Cloud Architekturen & DevOps (WI-302)
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Damit deine Analytics-Use-Cases skalieren und automatisiert ausgerollt werden.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-blue-900 to-slate-900 text-white p-5 shadow-2xl">
            <p className="text-xs uppercase tracking-wide text-slate-200/80">
              {t.downloadsTitle}
            </p>
            <h3 className="text-xl font-black mt-2">
              {t.downloadsSubtitle}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-100">
              {t.downloadsItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col gap-2">
              <a
                href={userProfile.pdfUrl}
                download
                className="w-full px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold shadow-lg hover:-translate-y-0.5 transition-all text-center"
              >
                {t.downloadPdf}
              </a>
              <a
                href={`mailto:${userProfile.advisorEmail}?subject=${encodeURIComponent("Beratungstermin Modulhandbuch")}`}
                className="w-full px-4 py-2 rounded-xl border border-white/40 text-white font-semibold hover:bg-white/10 transition-all text-center"
              >
                {t.askAdvisor(userProfile.advisor)}
              </a>
            </div>
            <p className="mt-3 text-xs text-slate-200/70">
              {t.helpText}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
