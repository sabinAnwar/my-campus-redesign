import { useMemo, useState } from "react";
import type { Course } from "@prisma/client";
import { useLanguage } from "~/store/LanguageContext";
import { prisma } from "~/services/prisma";
import { getUserFromRequest } from "~/services/auth.server";
import { useLoaderData } from "react-router-dom";
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import {
  GradesHeader,
  GradesStatsGrid,
  GradesFilterControls,
  GradesLegend,
} from "~/features/grades";

export const loader = async ({ request }: { request: Request }) => {
  // 1. Try session user
  const user = await getUserFromRequest(request);
  let userId = user?.id;

  // 2. Fallback to Sabin
  if (!userId) {
    const sabin = await prisma.user.findUnique({
      where: { email: "student.demo@iu-study.org" },
      select: { id: true },
    });
    userId = sabin?.id;
  }

  if (!userId) return { user: null, marks: [], praxisPartner: null };

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      marks: {
        include: { teacher: true },
        orderBy: { date: "desc" },
      },
      practical_partner: true,
      major: { include: { courses: true } },
    },
  });

  return {
    user: dbUser,
    marks: dbUser?.marks || [],
    praxis_partner: (dbUser as any)?.practical_partner || null,
  };
};

import { TRANSLATIONS } from "~/services/translations/grades";
import type {
  GradeStatusKey as StatusKey,
  GradeModule,
  GradeSection as Section,
} from "~/types/grades";

// Helper function to get translated chip label
const getChipLabel = (status: StatusKey, language: "de" | "en"): string => {
  return TRANSLATIONS[language].chipLabels[status];
};

function parseDate(d: string) {
  if (!d || d === "–") return null;
  // dd.mm.yyyy
  const [dd, mm, yyyy] = d.split(".");
  return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
}

function formatCSVCell(val: unknown) {
  if (val == null) return "";
  const s = String(val);
  if (
    s.includes(",") ||
    s.includes(";") ||
    s.includes('"') ||
    s.includes("\n")
  ) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export default function GradesDashboardIU() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const { user, marks, praxis_partner } = useLoaderData<typeof loader>();

  // State for expanded sections (default: current semester is open)
  const [expanded, setExpanded] = useState<number[]>(() => {
    const current = user?.semester ? user.semester - 1 : 0;
    return [current];
  });
  const [statusFilter, setStatusFilter] = useState<"ALL" | StatusKey>("ALL");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"none" | "datum" | "note">("none");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "FAILED" | "OPEN">(
    "OVERVIEW"
  );

  const dbCourses: Course[] = user?.major?.courses ?? [];

  const dbSections: Section[] = useMemo(() => {
    const sectionsMap: Record<string, GradeModule[]> = {};

    const matchMark = (course: Course) =>
      marks.find((m: any) => {
        if (typeof m.course !== "string") return false;
        const courseKeys = [
          course.name,
          course.name_de,
          course.name_en,
          course.code,
        ]
          .filter(Boolean)
          .map((val) => String(val).toLowerCase());
        return courseKeys.includes(m.course.toLowerCase());
      });

    dbCourses.forEach((course) => {
      const sem = String(course.semester ?? 1);
      if (!sectionsMap[sem]) sectionsMap[sem] = [];

      const dbMark = matchMark(course);
      const hasMark = Boolean(dbMark);
      const status: StatusKey = hasMark
        ? dbMark.value > 4.0
          ? "F"
          : "P"
        : "M";

      const note = hasMark ? dbMark.value : null;
      const datum = hasMark
        ? new Date(dbMark.date).toLocaleDateString(
            language === "de" ? "de-DE" : "en-US"
          )
        : "—";
      const bewertung = hasMark ? (dbMark.value <= 4.0 ? t.pass : t.fail) : "—";

      sectionsMap[sem].push({
        name:
          language === "de"
            ? course.name_de || course.name
            : course.name_en || course.name,
        status,
        note,
        credits: course.credits ?? 5,
        datum,
        bewertung,
      });
    });

    return Object.entries(sectionsMap)
      .map(([name, modules]) => ({
        name,
        modules,
      }))
      .sort((a, b) => {
        const numA = parseInt(a.name) || 0;
        const numB = parseInt(b.name) || 0;
        return numA - numB;
      });
  }, [dbCourses, marks, language, t]);

  // Handle Tab Filtering
  const displayedSections = useMemo(() => {
    if (activeTab === "OVERVIEW") return dbSections;

    return dbSections
      .map((section) => ({
        ...section,
        modules: section.modules.filter((m) => {
          if (activeTab === "FAILED") return m.status === "F";
          if (activeTab === "OPEN")
            return m.status === "M" || m.status === "CE" || m.status === "E";
          return true;
        }),
      }))
      .filter((section) => section.modules.length > 0);
  }, [dbSections, activeTab]);

  const studentData = {
    vorname: user?.name?.split(" ")[0] || "Student",
    name: user?.name?.split(" ").slice(1).join(" ") || "",
    matrikelnummer: user?.matriculation_number || "N/A",
    studiengang: user?.study_program || (user as any)?.major?.name || "N/A",
    gesamtDurchschnitt: (() => {
      const pm = marks.filter((m: any) => m.value <= 4.0);
      let totalCr = 0;
      let wSum = 0;
      pm.forEach((m: any) => {
        const course = dbCourses.find((c) => {
          const keys = [
            c.name,
            c.name_de,
            c.name_en,
            c.code,
          ]
            .filter(Boolean)
            .map((val) => String(val).toLowerCase());
          return typeof m.course === "string" && keys.includes(m.course.toLowerCase());
        });
        const cr = course?.credits ?? 5;
        totalCr += cr;
        wSum += m.value * cr;
      });
      return totalCr > 0 ? (wSum / totalCr).toFixed(2) : "0.00";
    })(),
    company:
      praxis_partner?.company_name ||
      (language === "de"
        ? "Kein Unternehmen hinterlegt"
        : "No company assigned"),
  };

  const allSections = useMemo<Section[]>(
    () => displayedSections,
    [displayedSections]
  );

  const stats = useMemo(() => {
    const modules = dbSections.flatMap((s) => s.modules);
    const total = modules.length;
    const passed = modules.filter((m) => m.status === "P").length;
    const open = modules.filter((m) =>
      ["M", "CE", "E"].includes(m.status)
    ).length;
    const failed = modules.filter((m) => m.status === "F").length;
    const passRate = total ? Math.round((passed / total) * 100) : 0;

    // ECTS Progress
    const totalECTS = modules.reduce((acc, m) => acc + (m.credits || 0), 0);
    const passedECTS = modules
      .filter((m) => m.status === "P")
      .reduce((acc, m) => acc + (m.credits || 0), 0);
    const ectsProgress = totalECTS
      ? Math.round((passedECTS / totalECTS) * 100)
      : 0;

    // Grade Distribution
    const grades = modules
      .filter((m) => m.status === "P" && m.note !== null)
      .map((m) => m.note as number);
    const distribution = {
      excellent: grades.filter((g) => g <= 1.5).length,
      good: grades.filter((g) => g > 1.5 && g <= 2.5).length,
      satisfactory: grades.filter((g) => g > 2.5 && g <= 3.5).length,
      sufficient: grades.filter((g) => g > 3.5 && g <= 4.0).length,
    };

    // Progress for current semester
    const currentSemNum = user?.semester || 1;
    const currentSemSection = dbSections.find((s) =>
      s.name.startsWith(currentSemNum.toString())
    );
    const currentSemTotal = currentSemSection?.modules.length || 0;
    const currentSemPassed =
      currentSemSection?.modules.filter((m) => m.status === "P").length || 0;

    return {
      total,
      passed,
      open,
      failed,
      passRate,
      currentSemTotal,
      currentSemPassed,
      totalECTS,
      passedECTS,
      ectsProgress,
      distribution,
    };
  }, [dbSections, user]);

  const toggle = (i: number) =>
    setExpanded((prev: number[]) =>
      prev.includes(i) ? prev.filter((x: number) => x !== i) : [...prev, i]
    );

  const collapseAll = () => setExpanded([]);
  const expandAll = () => setExpanded(allSections.map((_, i) => i));

  const moduleMatches = (m: GradeModule) => {
    const sOk = statusFilter === "ALL" ? true : m.status === statusFilter;
    const q = search.trim().toLowerCase();
    const qOk = !q || (m.name || "").toLowerCase().includes(q);
    return sOk && qOk;
  };

  const sortedModules = (mods: GradeModule[]): GradeModule[] => {
    if (sortKey === "none") return mods;
    const copy = [...mods];
    copy.sort((a, b) => {
      if (sortKey === "note") {
        const na = a.note == null ? Infinity : a.note;
        const nb = b.note == null ? Infinity : b.note;
        return sortDir === "asc" ? na - nb : nb - na;
      }
      if (sortKey === "datum") {
        const da = parseDate(a.datum)?.getTime() ?? -Infinity;
        const db = parseDate(b.datum)?.getTime() ?? -Infinity;
        return sortDir === "asc" ? da - db : db - da;
      }
      return 0;
    });
    return copy;
  };

  const filteredSections = useMemo<Section[]>(() => {
    return allSections.map((section: Section) => {
      const visible = sortedModules(section.modules.filter(moduleMatches));
      return { ...section, modules: visible };
    });
  }, [allSections, statusFilter, search, sortKey, sortDir]);

  const exportCSV = () => {
    const rows = [
      ["Sektion", "Modul", "Status", "Note", "Credits", "Datum", "Bewertung"]
        .map(formatCSVCell)
        .join(";"),
    ];
    allSections.forEach((sec) => {
      const mods = sortedModules(sec.modules.filter(moduleMatches));
      mods.forEach((m) => {
        rows.push(
          [
            sec.name,
            m.name,
            m.status,
            m.note ?? "",
            m.credits ?? "",
            m.datum ?? "",
            m.bewertung ?? "",
          ]
            .map(formatCSVCell)
            .join(";")
        );
      });
    });
    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    // Minimal, print-friendly transcript (no external libs)
    const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Transcript – ${studentData.vorname} ${studentData.name}</title>
  <style>
    *{ box-sizing: border-box; }
    body{ font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"; margin: 24px; color: #0f172a; }
    h1{ font-size: 20px; margin: 0 0 4px; }
    h2{ font-size: 16px; margin: 18px 0 8px; }
    .muted{ color: #6b7280; font-size: 12px; }
    .row{ display:flex; justify-content: space-between; align-items: flex-end; gap: 16px; border-bottom:1px solid #e5e7eb; padding-bottom:12px; margin-bottom:16px;}
    .badge{ font-weight:700; font-size: 18px; }
    table{ width:100%; border-collapse: collapse; margin-top: 8px; }
    th, td{ border-bottom:1px solid #e5e7eb; text-align:left; padding:8px 6px; font-size: 12px; }
    th{ background:#f8fafc; color:#334155; text-transform:uppercase; letter-spacing:.04em; }
    .section{ page-break-inside: avoid; margin-bottom: 12px; }
    @media print { @page { size: A4; margin: 16mm; } }
  </style>
</head>
<body>
  <div class="row">
    <div>
      <div style="font-weight:800; font-size:22px;">IU Internationale Hochschule</div>
      <div class="muted">Official Transcript of Records</div>
    </div>
    <div class="badge">${studentData.gesamtDurchschnitt}</div>
  </div>

  <div style="margin-bottom:12px;">
    <div><strong>Studierende*r:</strong> ${studentData.vorname} ${studentData.name}</div>
    <div><strong>Matrikelnummer:</strong> ${studentData.matrikelnummer}</div>
    <div class="muted">${studentData.studiengang}</div>
  </div>

  ${allSections
    .map(
      (sec) => `
    <div class="section">
      <h2>${sec.name}</h2>
      <table>
        <thead>
          <tr><th>Modul</th><th>Status</th><th>Note</th><th>Credits</th><th>Datum</th><th>Bewertung</th></tr>
        </thead>
        <tbody>
          ${sortedModules(sec.modules.filter(moduleMatches))
            .map(
              (m) => `
            <tr>
              <td>${m.name ?? ""}</td>
              <td>${m.status ?? ""}</td>
              <td>${m.note ?? ""}</td>
              <td>${m.credits ?? ""}</td>
              <td>${m.datum ?? ""}</td>
              <td>${m.bewertung ?? ""}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>`
    )
    .join("")}
  <div class="muted" style="margin-top:16px;">Generiert am ${new Date().toLocaleDateString("de-DE")}</div>
  <script>window.onload = () => window.print()</script>
</body>
</html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <GradesHeader
        title={t.transcriptTitle}
        universityName={t.universityName}
        exportPDFLabel={t.exportPDF}
        exportCSVLabel={t.exportCSV}
        onExportPDF={exportPDF}
        onExportCSV={exportCSV}
        language={language}
      />


      <GradesStatsGrid
        stats={[
          {
            label: t.overallAverage,
            val: studentData.gesamtDurchschnitt,
            icon: TrendingUp,
            color: "iu-blue",
            bg: "bg-iu-blue",
          },
          {
            label: t.totalModules,
            val: stats.total,
            icon: BookOpen,
            color: "iu-purple",
            bg: "bg-iu-purple",
          },
          {
            label: t.passed,
            val: stats.passed,
            icon: CheckCircle2,
            color: "iu-green",
            bg: "bg-iu-green",
          },
          {
            label: t.failed,
            val: stats.failed,
            icon: AlertCircle,
            color: "iu-red",
            bg: "bg-iu-red",
          },
        ]}
      />

      <GradesFilterControls
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortKey={sortKey}
        onSortKeyChange={setSortKey}
        sortDir={sortDir}
        onSortDirToggle={() =>
          setSortDir((d) => (d === "asc" ? "desc" : "asc"))
        }
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
        labels={{
          filterAndSort: t.filterAndSort,
          searchPlaceholder: t.searchPlaceholder,
          allStatus: t.allStatus,
          statusPassed: t.statusPassed,
          statusOpen: t.statusOpen,
          statusRegistered: t.statusRegistered,
          statusExamRegistered: t.statusExamRegistered,
          statusFailed: t.statusFailed,
          sortNone: t.sortNone,
          sortDate: t.sortDate,
          sortGrade: t.sortGrade,
          expandAll: t.expandAll,
          collapseAll: t.collapseAll,
        }}
      />

      {/* SECTIONS */}
      <div className="space-y-4 pb-8 sm:pb-12">
        {filteredSections.map((section, i) => {
          const isOpen = expanded.includes(i);
          const sectionPassed = section.modules.filter(
            (m) => m.status === "P"
          ).length;
          const sectionTotal = section.modules.length;
          const sectionProgress =
            sectionTotal > 0
              ? Math.round((sectionPassed / sectionTotal) * 100)
              : 0;

          return (
            <div
              key={section.name}
              className={`group rounded-xl sm:rounded-2xl border transition-all duration-500 overflow-hidden ${
                isOpen
                  ? "border-slate-500 bg-card shadow-lg shadow-slate-400/5"
                  : "border-border bg-card/40 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-card/60"
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className={`w-full text-left px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between transition-all ${
                  isOpen ? "bg-iu-blue/5" : ""
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-500 ${
                      isOpen
                        ? "bg-iu-blue text-white shadow-lg shadow-iu-blue/20 scale-105"
                        : "bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white"
                    }`}
                  >
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-foreground tracking-tight mb-0.5 sm:mb-1">
                      {section.name}
                    </h4>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        <CheckCircle2 size={10} className="text-iu-blue dark:text-white" />
                        {sectionPassed} / {sectionTotal} {t.completed}
                      </div>
                      <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-iu-blue transition-all duration-1000"
                          style={{ width: `${sectionProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-500 ${
                    isOpen
                      ? "bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white rotate-180"
                      : "bg-muted dark:bg-muted/20 text-muted-foreground"
                  }`}
                >
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  {section.modules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-muted-foreground">
                      <Search size={32} className="mb-3 opacity-20" />
                      <p className="text-sm sm:text-base font-bold uppercase tracking-wide">
                        {t.noEntries}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                      <table className="w-full border-separate border-spacing-y-1 sm:border-spacing-y-2 min-w-[600px]">
                        <thead>
                          <tr className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-muted-foreground">
                            <th className="text-left px-2 sm:px-4 py-2">
                              {t.module}
                            </th>
                            <th className="text-left px-2 sm:px-4 py-2">
                              {t.status}
                            </th>
                            <th className="text-center px-2 sm:px-4 py-2">
                              {t.grade}
                            </th>
                            <th className="text-center px-2 sm:px-4 py-2">
                              {t.credits}
                            </th>
                            <th className="text-left px-2 sm:px-4 py-2">
                              {t.date}
                            </th>
                            <th className="text-right px-2 sm:px-4 py-2">
                              {t.assessment}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.modules.map((m, j) => (
                            <tr
                              key={j}
                              className="group/row bg-background/40 hover:bg-iu-blue/5 transition-all duration-300 rounded-lg"
                            >
                              <td className="px-2 sm:px-4 py-2.5 sm:py-3 rounded-l-lg border-y border-l border-border/50 group-hover/row:border-slate-400">
                                <div className="font-bold text-foreground text-xs sm:text-sm leading-tight group-hover/row:translate-x-1 transition-transform">
                                  {m.name}
                                </div>
                              </td>
                              <td className="px-2 sm:px-4 py-2.5 sm:py-3 border-y border-border/50 group-hover/row:border-iu-blue/30">
                                <span
                                  className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wide shadow-sm text-white border ${
                                    m.status === "P"
                                      ? "bg-iu-green border-iu-green/30"
                                      : m.status === "F"
                                        ? "bg-iu-red border-iu-red/30"
                                        : m.status === "M"
                                          ? "bg-iu-brown border-iu-brown/30"
                                          : m.status === "CE"
                                            ? "bg-iu-indigo border-iu-indigo/30"
                                            : "bg-iu-blue border-iu-blue/30"
                                  }`}
                                >
                                  {m.status === "P" && (
                                    <CheckCircle2 size={10} />
                                  )}
                                  {m.status === "F" && (
                                    <AlertCircle size={10} />
                                  )}
                                  {["M", "CE", "E"].includes(m.status) && (
                                    <Clock size={10} />
                                  )}
                                  {getChipLabel(m.status, language)}
                                </span>
                              </td>
                              <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-center border-y border-border/50 group-hover/row:border-iu-blue/30">
                                {m.note == null ? (
                                  <span className="text-muted-foreground font-bold">
                                    —
                                  </span>
                                ) : (
                                  <span
                                    className={`inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded font-bold text-xs sm:text-sm shadow transition-transform group-hover/row:scale-105 ${
                                      m.note <= 1.5
                                        ? "bg-iu-blue text-white"
                                        : m.note <= 2.5
                                          ? "bg-iu-indigo text-white"
                                          : m.note <= 3.5
                                            ? "bg-iu-brown text-white"
                                            : "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                    }`}
                                  >
                                    {m.note.toFixed(1)}
                                  </span>
                                )}
                              </td>
                              <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-center border-y border-border/50 group-hover/row:border-iu-blue/30">
                                <div className="text-xs sm:text-sm font-medium text-foreground">
                                  {m.credits}{" "}
                                  <span className="text-[8px] text-foreground/65 uppercase tracking-wide">
                                    ECTS
                                  </span>
                                </div>
                              </td>
                              <td className="px-2 sm:px-4 py-2.5 sm:py-3 border-y border-border/50 group-hover/row:border-iu-blue/30">
                                <div className="text-[10px] sm:text-xs font-medium text-foreground/70">
                                  {m.datum}
                                </div>
                              </td>
                              <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-right rounded-r-lg border-y border-r border-border/50 group-hover/row:border-iu-blue/30">
                                <div className="text-[10px] sm:text-xs font-medium text-foreground/70 italic">
                                  {m.bewertung || "—"}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <GradesLegend
        labels={{
          legend: t.legend,
          statusPassed: t.statusPassed,
          statusRegistered: t.statusRegistered,
          statusExamRegistered: t.statusExamRegistered,
          statusOpen: t.statusOpen,
          statusFailed: t.statusFailed,
          gradeExcellent: t.gradeExcellent,
          gradeGood: t.gradeGood,
          gradeSatisfactory: t.gradeSatisfactory,
          gradeSufficient: t.gradeSufficient,
        }}
      />
    </div>
  );
}
