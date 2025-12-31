import React, { useMemo, useState } from "react";
import { useLanguage } from "~/contexts/LanguageContext";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";
import { useLoaderData } from "react-router-dom";
import { getCourseConfig } from "../data/coursesConfig";
import {
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Download,
  FileText,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowUpDown,
  Award,
  BookOpen,
  Calendar,
  BarChart3,
  MoreHorizontal,
  Printer,
  FileSpreadsheet,
} from "lucide-react";

export const loader = async ({ request }: { request: Request }) => {
  // 1. Try session user
  const user = await getUserFromRequest(request);
  let userId = user?.id;

  // 2. Fallback to Sabin
  if (!userId) {
    const sabin = await prisma.user.findUnique({
      where: { email: "sabin.elanwar@iu-study.org" },
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
      praxisPartner: true,
      studiengang: true,
    },
  });

  return {
    user: dbUser,
    marks: dbUser?.marks || [],
    praxisPartner: dbUser?.praxisPartner || null,
  };
};



import {
  TRANSLATIONS,
  STUDENT_DATA,
  SEMESTERS,
  VERTIEFUNG_DATA_ANALYTICS,
  ZUSATZ_MODULE,
  CHIP_CLASSES,
  CHIP_LABEL,
} from "~/constants/grades";
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
  const { user, marks, praxisPartner } = useLoaderData<typeof loader>();
  const t = TRANSLATIONS[language];

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

  // Group DB marks by semester and include all courses from config
  const courseConfig = getCourseConfig(language);
  const dbSections: Section[] = useMemo(() => {
    const config = getCourseConfig("de"); // Use German titles for matching
    const sectionsMap: Record<string, GradeModule[]> = {};

    // Get the localized semester names from the current language config
    const localizedConfig = getCourseConfig(language);
    const maxSemesterNum = Math.max(
      ...localizedConfig.map((cc) => parseInt(cc.semester) || 0)
    );
    const maxSemesterStr = maxSemesterNum.toString();

    localizedConfig.forEach((cc, idx) => {
      const sem = cc.semester;
      if (!sectionsMap[sem]) sectionsMap[sem] = [];

      // Find if this user has a mark for this course (match by titleDE)
      const dbMark = marks.find((m: any) => m.course === cc.titleDE);

      let status: StatusKey = dbMark ? (dbMark.value > 4.0 ? "F" : "P") : "M";
      let note = dbMark ? dbMark.value : null;
      let datum = dbMark
        ? new Date(dbMark.date).toLocaleDateString(
            language === "de" ? "de-DE" : "en-US"
          )
        : "—";
      let bewertung = dbMark
        ? dbMark.value <= 4.0
          ? language === "de"
            ? "Bestanden"
            : "Pass"
          : language === "de"
            ? "Nicht bestanden"
            : "Fail"
        : "—";

      // Force last semester courses to be registered (CE)
      if (sem.startsWith(maxSemesterStr)) {
        status = "CE";
        note = null;
        datum = "—";
        bewertung = "—";
      }

      // Active courses (current semester) must not have marks if not passed
      const currentSemStr = (user?.semester || 1).toString();
      if (sem.startsWith(currentSemStr) && status !== "P") {
        note = null;
        bewertung = "—";
      }

      sectionsMap[sem].push({
        name: language === "de" ? cc.titleDE : cc.title,
        status,
        note,
        credits: cc.credits,
        datum,
        bewertung,
      });
    });

    // Convert map to sorted array
    return Object.entries(sectionsMap)
      .map(([name, modules]) => ({
        name,
        modules,
      }))
      .sort((a, b) => {
        // Sort by semester number if possible
        const numA = parseInt(a.name) || 0;
        const numB = parseInt(b.name) || 0;
        return numA - numB;
      });
  }, [marks, language]);

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
    matrikelnummer: user?.matriculationNumber || "N/A",
    studiengang: user?.studyProgram || user?.studiengang?.name || "N/A",
    gesamtDurchschnitt: (() => {
      const pm = marks.filter((m: any) => m.value <= 4.0);
      let totalCr = 0;
      let wSum = 0;
      pm.forEach((m: any) => {
        const config = courseConfig.find((cc) => cc.titleDE === m.course);
        const cr = config?.credits || 5;
        totalCr += cr;
        wSum += m.value * cr;
      });
      return totalCr > 0 ? (wSum / totalCr).toFixed(2) : "0.00";
    })(),
    company:
      praxisPartner?.companyName ||
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
    <div className="max-w-7xl mx-auto space-y-10">
      {/* HEADER BANNER */}
      <header className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                <GraduationCap size={28} />
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight">
                {t.transcriptTitle}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-lg text-muted-foreground font-medium">
              <Award size={20} className="text-iu-blue" />
              {t.universityName}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={exportPDF}
              className="group flex items-center gap-2 bg-iu-blue hover:bg-iu-blue/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-iu-blue/20"
            >
              <Printer className="h-4 w-4" />
              {t.exportPDF}
            </button>
            <button
              onClick={exportCSV}
              className="group flex items-center gap-2 bg-card hover:bg-muted text-foreground font-bold py-3 px-6 rounded-xl transition-all duration-300 border border-border"
            >
              <FileSpreadsheet className="h-4 w-4" />
              {t.exportCSV}
            </button>
          </div>
        </div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
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
        ].map((stat, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-border p-10 shadow-2xl hover:shadow-iu-blue/10 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <stat.icon className="h-24 w-24" />
            </div>
            <div className="relative z-10">
              <div
                className={`p-4 rounded-2xl ${stat.bg}/10 w-fit mb-6 group-hover:scale-110 transition-transform duration-500`}
              >
                <stat.icon className={`h-8 w-8 text-${stat.color}`} />
              </div>
              <p className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
                {stat.label}
              </p>
              <p className="text-5xl font-black text-foreground tracking-tight">
                {stat.val}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CONTROLS & FILTER */}
      <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-iu-blue/10 rounded-2xl">
            <Filter className="h-8 w-8 text-iu-blue" />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            {t.filterAndSort}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative group">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-iu-blue transition-colors"
              size={24}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-16 pr-6 py-5 rounded-2xl border border-border bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-iu-blue/10 focus:border-iu-blue transition-all shadow-inner text-lg font-bold"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-background/50 border border-border rounded-2xl px-6 py-4 shadow-inner group focus-within:border-iu-blue transition-colors">
              <Filter
                size={20}
                className="text-muted-foreground group-focus-within:text-iu-blue"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-transparent text-base font-black uppercase tracking-widest text-foreground focus:outline-none cursor-pointer"
              >
                <option value="ALL">{t.allStatus}</option>
                <option value="P">{t.statusPassed}</option>
                <option value="M">{t.statusOpen}</option>
                <option value="CE">{t.statusRegistered}</option>
                <option value="E">{t.statusExamRegistered}</option>
                <option value="F">{t.statusFailed}</option>
              </select>
            </div>

            <div className="flex items-center gap-3 bg-background/50 border border-border rounded-2xl px-6 py-4 shadow-inner group focus-within:border-iu-blue transition-colors">
              <ArrowUpDown
                size={20}
                className="text-muted-foreground group-focus-within:text-iu-blue"
              />
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as any)}
                className="bg-transparent text-base font-black uppercase tracking-widest text-foreground focus:outline-none cursor-pointer"
              >
                <option value="none">{t.sortNone}</option>
                <option value="datum">{t.sortDate}</option>
                <option value="note">{t.sortGrade}</option>
              </select>
              <button
                onClick={() =>
                  setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                }
                className="p-2 hover:bg-iu-blue/10 rounded-xl transition-colors text-iu-blue"
              >
                {sortDir === "asc" ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-2xl border border-border">
              <button
                onClick={expandAll}
                className="px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-iu-blue hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                {t.expandAll}
              </button>
              <div className="w-px h-6 bg-border" />
              <button
                onClick={collapseAll}
                className="px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-iu-blue hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                {t.collapseAll}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="space-y-8 pb-20">
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
              className={`group rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
                isOpen
                  ? "border-iu-blue/30 bg-card/80 shadow-2xl shadow-iu-blue/10"
                  : "border-border bg-card/40 hover:border-iu-blue/30 hover:bg-card/60"
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className={`w-full text-left px-10 py-8 flex items-center justify-between transition-all ${
                  isOpen ? "bg-iu-blue/5" : ""
                }`}
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      isOpen
                        ? "bg-iu-blue text-white shadow-xl shadow-iu-blue/20 scale-110"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-foreground tracking-tight mb-2">
                      {section.name}
                    </h4>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-widest">
                        <CheckCircle2 size={14} className="text-iu-blue" />
                        {sectionPassed} / {sectionTotal}{" "}
                        {language === "de" ? "Abgeschlossen" : "Completed"}
                      </div>
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-iu-blue shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000"
                          style={{ width: `${sectionProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-2xl transition-all duration-500 ${
                    isOpen
                      ? "bg-iu-blue/10 text-iu-blue rotate-180"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <ChevronDown size={24} />
                </div>
              </button>

              {isOpen && (
                <div className="px-10 pb-10">
                  {section.modules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                      <Search size={64} className="mb-6 opacity-10" />
                      <p className="text-lg font-bold uppercase tracking-widest">
                        {t.noEntries}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-separate border-spacing-y-4">
                        <thead>
                          <tr className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                            <th className="text-left px-6 py-4">{t.module}</th>
                            <th className="text-left px-6 py-4">{t.status}</th>
                            <th className="text-center px-6 py-4">{t.grade}</th>
                            <th className="text-center px-6 py-4">
                              {t.credits}
                            </th>
                            <th className="text-left px-6 py-4">{t.date}</th>
                            <th className="text-right px-6 py-4">
                              {t.assessment}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.modules.map((m, j) => (
                            <tr
                              key={j}
                              className="group/row bg-background/40 hover:bg-iu-blue/5 transition-all duration-300 rounded-2xl"
                            >
                              <td className="px-6 py-6 rounded-l-2xl border-y border-l border-border/50 group-hover/row:border-iu-blue/30">
                                <div className="font-black text-foreground text-base leading-tight uppercase tracking-tight group-hover/row:text-iu-blue transition-colors">
                                  {m.name}
                                </div>
                              </td>
                              <td className="px-6 py-6 border-y border-border/50 group-hover/row:border-iu-blue/30">
                                <span
                                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                    m.status === "P"
                                      ? "bg-iu-blue/10 text-iu-blue dark:text-iu-blue border border-iu-blue/20"
                                      : m.status === "F"
                                        ? "bg-iu-red/10 text-iu-red border border-iu-red/20"
                                        : m.status === "M"
                                          ? "bg-iu-orange/10 text-iu-orange border border-iu-orange/20"
                                          : "bg-iu-blue/10 text-iu-blue border border-iu-blue/20"
                                  }`}
                                >
                                  {m.status === "P" && (
                                    <CheckCircle2 size={12} />
                                  )}
                                  {m.status === "F" && (
                                    <AlertCircle size={12} />
                                  )}
                                  {["M", "CE", "E"].includes(m.status) && (
                                    <Clock size={12} />
                                  )}
                                  {getChipLabel(m.status, language)}
                                </span>
                              </td>
                              <td className="px-6 py-6 text-center border-y border-border/50 group-hover/row:border-iu-blue/30">
                                {m.note == null ? (
                                  <span className="text-muted-foreground/30 font-black">
                                    —
                                  </span>
                                ) : (
                                  <span
                                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl font-black text-base shadow-lg transition-transform group-hover/row:scale-110 ${
                                      m.note <= 1.5
                                        ? "bg-iu-blue text-white shadow-iu-blue/20"
                                        : m.note <= 2.5
                                          ? "bg-iu-purple text-white shadow-iu-purple/20"
                                          : m.note <= 3.5
                                            ? "bg-iu-orange text-white shadow-iu-orange/20"
                                            : "bg-muted-foreground text-white shadow-muted/20"
                                    }`}
                                  >
                                    {m.note.toFixed(1)}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-6 text-center border-y border-border/50 group-hover/row:border-iu-blue/30">
                                <div className="text-sm font-black text-foreground">
                                  {m.credits}{" "}
                                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest ml-1">
                                    ECTS
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-6 border-y border-border/50 group-hover/row:border-iu-blue/30">
                                <div className="text-sm font-bold text-muted-foreground">
                                  {m.datum}
                                </div>
                              </td>
                              <td className="px-6 py-6 text-right rounded-r-2xl border-y border-r border-border/50 group-hover/row:border-iu-blue/30">
                                <div className="text-xs font-bold text-muted-foreground italic">
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

      {/* LEGEND */}
      <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-iu-blue/10 text-iu-blue rounded-2xl">
            <MoreHorizontal size={28} />
          </div>
          <h3 className="text-3xl font-black text-foreground tracking-tight">
            {t.legend}
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { c: "bg-iu-green", label: t.statusPassed, icon: CheckCircle2 },
            { c: "bg-iu-blue", label: t.statusRegistered, icon: Clock },
            {
              c: "bg-iu-purple",
              label: t.statusExamRegistered,
              icon: Calendar,
            },
            { c: "bg-iu-orange", label: t.statusOpen, icon: Clock },
            { c: "bg-iu-red", label: t.statusFailed, icon: AlertCircle },
          ].map((it, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 rounded-2xl border border-border bg-background/40 p-5 transition-all hover:bg-iu-blue/5 hover:border-iu-blue/30 group"
            >
              <div
                className={`w-12 h-12 rounded-xl ${it.c} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
              >
                <it.icon size={20} />
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-tight">
                {it.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[
            { c: "bg-iu-blue", label: t.gradeExcellent },
            { c: "bg-iu-purple", label: t.gradeGood },
            { c: "bg-iu-orange", label: t.gradeSatisfactory },
            { c: "bg-muted-foreground", label: t.gradeSufficient },
          ].map((it, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 rounded-2xl border border-border bg-background/40 p-5 transition-all hover:bg-iu-blue/5 hover:border-iu-blue/30 group"
            >
              <div
                className={`w-5 h-5 rounded-lg ${it.c} shadow-lg group-hover:scale-125 transition-transform`}
              />
              <div className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                {it.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
