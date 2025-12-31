import React, { useMemo, useState } from "react";
import { Download, User, BookOpen } from "lucide-react";
import { useLoaderData } from "react-router-dom";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";
import { useLanguage } from "~/contexts/LanguageContext";

import type {
  Module,
  ModuleHandbookLoaderData as LoaderData,
} from "~/types/module-handbook";

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
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header Section */}
      <header className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                <BookOpen size={28} />
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight">
                {t.title}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {t.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-iu-blue/20 bg-iu-blue/10 text-iu-blue text-sm font-bold w-fit">
                <span>{studiengangName || userProfile.program}</span>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/20 bg-pink-500/10 text-pink-500 text-sm font-bold w-fit">
                <span>{userProfile.focus}</span>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-iu-blue/20 bg-iu-blue/10 text-iu-blue text-sm font-bold w-fit">
                <span>{userProfile.campus}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={userProfile.pdfUrl}
              className="px-6 py-3 rounded-xl bg-iu-blue text-white font-bold transition-all hover:bg-iu-blue/90 shadow-lg shadow-iu-blue/20 flex items-center gap-2"
              download
            >
              <Download size={18} />
              {t.btnPdf}
            </a>
            <a
              href={`mailto:${userProfile.advisorEmail}?subject=${encodeURIComponent("Beratungstermin Modulhandbuch")}`}
              className="px-6 py-3 rounded-xl bg-card border border-border text-foreground font-bold hover:bg-muted transition-all flex items-center gap-2"
            >
              <User size={18} />
              {t.btnAdvisor}
            </a>
          </div>
        </div>
      </header>

      {/* Quick facts */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
          <p className="text-[10px] font-black text-iu-blue uppercase tracking-widest mb-2">
            {t.programLabel}
          </p>
          <p className="text-xl font-black text-foreground">
            {studiengangName || "Wirtschaftsinformatik"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground font-bold leading-relaxed">
            {language === "de"
              ? "Praxisorientiert mit Management-, Data- und Tech-Modulen."
              : "Practice-oriented with management, data, and tech modules."}
          </p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
          <p className="text-[10px] font-black text-iu-pink uppercase tracking-widest mb-2">
            {t.profileLabel}
          </p>
          <p className="text-xl font-black text-foreground">
            Sabin - {userProfile.campus}
          </p>
          <p className="mt-2 text-sm text-muted-foreground font-bold leading-relaxed">
            {language === "de"
              ? `Fokus ${userProfile.focus}, Advisor ${userProfile.advisor}, aktuell Semester ${userProfile.currentSemester}.`
              : `Focus ${userProfile.focus}, advisor ${userProfile.advisor}, current semester ${userProfile.currentSemester}.`}
          </p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
          <p className="text-[10px] font-black text-iu-orange uppercase tracking-widest mb-2">
            {t.trackLabel}
          </p>
          <p className="text-xl font-black text-foreground">Data & Analytics</p>
          <p className="mt-2 text-sm text-muted-foreground font-bold leading-relaxed">
            {language === "de"
              ? "Process Mining, BI, ML - perfekt fuer Wirtschaftsinformatik."
              : "Process Mining, BI, ML - great fit for Business Informatics."}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-[2rem] bg-card border border-border p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-6 mb-8">
          <h2 className="text-2xl font-black text-foreground uppercase tracking-widest">
            {t.modulesPerSemester}
          </h2>
          <div className="flex flex-wrap gap-2">
            {["all", ...semesterOptions].map((sem) => (
              <button
                key={sem}
                onClick={() => setSemesterFilter(sem as number | "all")}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                  semesterFilter === sem
                    ? "bg-iu-blue text-white border-iu-blue shadow-md"
                    : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {sem === "all"
                  ? language === "de"
                    ? "Alle"
                    : "All"
                  : `${t.semester} ${sem}`}
              </button>
            ))}
          </div>
        </div>

        {/* Aktive Module im aktuellen Semester */}
        <div className="mb-10 rounded-2xl border-l-4 border-iu-blue bg-iu-blue/5 p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-iu-blue dark:text-iu-blue mb-1">
                {t.currentSemesterTitle(userProfile.currentSemester)}
              </p>
              <p className="text-sm text-muted-foreground font-bold">
                {t.currentSemesterDesc}
              </p>
            </div>
            <div className="text-xs font-black text-foreground uppercase tracking-widest bg-background px-4 py-2 border border-border rounded-lg">
              {currentSemesterModules.length} {t.module}{" "}
              {currentSemesterModules.reduce((sum, m) => sum + m.ects, 0)} ECTS
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {currentSemesterModules.map((module) => (
              <div
                key={module.code}
                className="rounded-xl border border-border bg-card p-5 shadow-sm hover:border-iu-blue transition-colors group"
              >
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                  <span className="text-iu-blue dark:text-iu-blue">
                    {module.code}
                  </span>
                  <span className="px-2 py-1 rounded bg-iu-blue text-white">
                    {TYPE_LABELS[language][module.type]}
                  </span>
                </div>
                <h4 className="text-base font-black text-foreground mb-2 group-hover:text-iu-blue transition-colors">
                  {module.title}
                </h4>
                <p className="text-xs text-muted-foreground font-bold line-clamp-2 mb-4 leading-relaxed">
                  {module.description}
                </p>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground space-y-2 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span>{t.exam}</span>
                    <span className="text-foreground">{module.exam}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ECTS</span>
                    <span className="text-iu-blue">{module.ects}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredModules.map((module) => (
            <article
              key={module.code}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-iu-blue transition-all group"
            >
              <div
                className={`absolute right-0 top-0 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 border-l border-b rounded-bl-xl ${
                  module.type === "Pflicht"
                    ? "bg-iu-blue text-white border-iu-blue"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {TYPE_LABELS[language][module.type]}
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest mb-4">
                <span className="px-3 py-1 bg-muted text-iu-blue border border-border rounded-lg">
                  {module.code}
                </span>
                <span className="text-muted-foreground">
                  {t.semester} {module.semester}
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      module.status === "laufend"
                        ? "bg-iu-blue animate-pulse"
                        : module.status === "abgeschlossen"
                          ? "bg-iu-blue"
                          : "bg-amber-400"
                    }`}
                  />
                  <span className="text-muted-foreground">
                    {STATUS_LABELS[language][module.status]}
                  </span>
                </span>
              </div>

              <h3 className="text-xl font-black text-foreground mb-3 group-hover:text-iu-blue transition-colors">
                {module.title}
              </h3>

              <div className="flex flex-wrap gap-2 mb-4">
                {module.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 rounded-md bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-wider"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 line-clamp-2">
                {module.description}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                    {t.exam}
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {module.exam}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                    {t.workload}
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {module.workload}h / {module.ects} ECTS
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      {/* Recommendations */}
      <section className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl bg-card border border-border p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-foreground uppercase tracking-widest">
              {t.recommendationTitle(userProfile.focus)}
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-iu-blue/10 text-iu-blue dark:text-iu-blue border border-iu-blue/20">
              {t.recommendationChip}
            </span>
          </div>
          <ol className="space-y-6">
            <li className="flex items-start gap-6 group">
              <span className="mt-1 h-8 w-8 rounded-full bg-iu-blue text-white flex items-center justify-center text-sm font-black shrink-0 group-hover:bg-iu-pink transition-colors">
                1
              </span>
              <div>
                <p className="font-black text-foreground text-lg group-hover:text-iu-blue transition-colors">
                  Data & Process Analytics (WI-301)
                </p>
                <p className="mt-1 text-sm text-muted-foreground font-bold leading-relaxed">
                  Kombiniert BI, KPI-Design und Process Mining fuer
                  datenbasierte Entscheidungen.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-6 group">
              <span className="mt-1 h-8 w-8 rounded-full bg-iu-blue text-white flex items-center justify-center text-sm font-black shrink-0 group-hover:bg-iu-pink transition-colors">
                2
              </span>
              <div>
                <p className="font-black text-foreground text-lg group-hover:text-iu-blue transition-colors">
                  Advanced Analytics & Machine Learning (WI-401)
                </p>
                <p className="mt-1 text-sm text-muted-foreground font-bold leading-relaxed">
                  Vertieft Statistik und ML fuer automatisierte Vorhersagen
                  inklusive MLOps-Blick.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-6 group">
              <span className="mt-1 h-8 w-8 rounded-full bg-iu-blue text-white flex items-center justify-center text-sm font-black shrink-0 group-hover:bg-iu-pink transition-colors">
                3
              </span>
              <div>
                <p className="font-black text-foreground text-lg group-hover:text-iu-blue transition-colors">
                  Cloud Architekturen & DevOps (WI-302)
                </p>
                <p className="mt-1 text-sm text-muted-foreground font-bold leading-relaxed">
                  Damit deine Analytics-Use-Cases skalieren und automatisiert
                  ausgerollt werden.
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div className="rounded-2xl bg-card border border-border p-8 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-iu-blue via-iu-pink to-iu-orange" />
          <p className="text-[10px] font-black uppercase tracking-widest text-iu-pink mb-2">
            {t.downloadsTitle}
          </p>
          <h3 className="text-2xl font-black text-foreground leading-tight">
            {t.downloadsSubtitle}
          </h3>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground font-bold">
            {t.downloadsItems.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-iu-blue rounded-full" />
                {item.replace("- ", "")}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={userProfile.pdfUrl}
              download
              className="w-full px-6 py-3 rounded-xl bg-iu-blue text-white font-black uppercase tracking-widest shadow-lg hover:bg-iu-blue/90 transition-all text-center hover:-translate-y-0.5"
            >
              {t.downloadPdf}
            </a>
            <a
              href={`mailto:${userProfile.advisorEmail}?subject=${encodeURIComponent("Beratungstermin Modulhandbuch")}`}
              className="w-full px-6 py-3 rounded-xl border-2 border-border text-foreground font-black uppercase tracking-widest hover:bg-muted transition-all text-center hover:-translate-y-0.5"
            >
              {t.askAdvisor(userProfile.advisor)}
            </a>
          </div>
          <p className="mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-relaxed">
            {t.helpText}
          </p>
        </div>
      </section>
    </div>
  );
}
