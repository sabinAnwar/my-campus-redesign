import React, { useMemo, useState } from "react";
import AppShell from "../components/AppShell";

export const loader = async () => null;
/* ---------- STUDENT ---------- */
const studentData = {
  vorname: "Sabin",
  name: "El Anwar",
  matrikelnummer: "102203036",
  studiengang: "Wirtschaftsinformatik (HH-BA-WINFO-WiSe-22-GTW)",
  gesamtDurchschnitt: 1.58,
};

/* ---------- DATA: SEMESTER + VERTIEFUNG + ZUSATZ ---------- */
const semesters = [
  {
    name: "1. Semester",
    modules: [
      {
        name: "Grundlagen der BWL",
        status: "P",
        note: 1.3,
        credits: 5,
        datum: "31.03.2023",
      },
      {
        name: "Mathematik I",
        status: "P",
        note: 2.3,
        credits: 5,
        datum: "21.02.2023",
      },
      {
        name: "Industrielle Softwaretechnik (MP)",
        status: "P",
        note: 2.0,
        credits: 5,
        datum: "16.02.2023",
      },
      {
        name: "Wissenschaftliches Arbeiten",
        status: "P",
        note: 1.0,
        credits: 5,
        datum: "26.03.2023",
      },
      {
        name: "Praxisprojekt I",
        status: "P",
        note: 1.3,
        credits: 5,
        datum: "29.06.2023",
      },
    ],
  },
  {
    name: "2. Semester",
    modules: [
      {
        name: "Buchführung und Jahresabschluss",
        status: "P",
        note: 1.7,
        credits: 5,
        datum: "21.08.2023",
        bewertung: "90/100",
      },
      {
        name: "Mathematik Grundlagen II",
        status: "P",
        note: 4.0,
        credits: 5,
        datum: "25.08.2023",
        bewertung: "51.11/100",
      },
      {
        name: "Objektorientierte Programmierung I",
        status: "P",
        note: 2.7,
        credits: 5,
        datum: "18.08.2023",
        bewertung: "84.3/90",
      },
      {
        name: "Fallstudie Digitale Business Modelle",
        status: "P",
        note: 1.7,
        credits: 5,
        datum: "20.07.2023",
        bewertung: "89/100",
      },
      {
        name: "Praxisprojekt II",
        status: "P",
        note: 1.0,
        credits: 5,
        datum: "24.10.2023",
        bewertung: "100/100",
      },
    ],
  },
  {
    name: "3. Semester",
    modules: [
      {
        name: "Kosten- und Leistungsrechnung",
        status: "P",
        note: 1.3,
        credits: 5,
        datum: "06.02.2024",
        bewertung: "91.11/100",
      },
      {
        name: "Marketing",
        status: "P",
        note: 2.0,
        credits: 5,
        datum: "–",
        bewertung: "81/100",
      },
      {
        name: "Requirement Engineering (MP)",
        status: "P",
        note: 2.3,
        credits: 5,
        datum: "14.02.2024",
        bewertung: "70.5/90",
      },
      {
        name: "Praxisprojekt III",
        status: "P",
        note: 1.0,
        credits: 5,
        datum: "30.03.2024",
        bewertung: "86.4/80",
      },
      {
        name: "Objektorientierte Programmierung II",
        status: "P",
        note: 2.3,
        credits: 5,
        datum: "–",
        bewertung: "76/100",
      },
    ],
  },
  {
    name: "4. Semester",
    modules: [
      {
        name: "Datenschutz und IT-Sicherheit (MP)",
        status: "P",
        note: 1.0,
        credits: 5,
        datum: "15.08.2024",
        bewertung: "87/90",
      },
      {
        name: "Fallstudie Software-Engineering (MP)",
        status: "P",
        note: 1.3,
        credits: 5,
        datum: "–",
        bewertung: "91.3/100",
      },
      {
        name: "IT-Consulting & Dienstleistungsmanagement",
        status: "P",
        note: 1.7,
        credits: 5,
        datum: "30.09.2024",
        bewertung: "81/90",
      },
      {
        name: "Praxisprojekt IV",
        status: "P",
        note: 1.0,
        credits: 5,
        datum: "01.10.2024",
        bewertung: "97/100",
      },
      {
        name: "Qualitätssicherung im Softwareprozess (MP)",
        status: "P",
        note: 1.0,
        credits: 5,
        datum: "–",
        bewertung: "96.25/100",
      },
    ],
  },
  {
    name: "5. Semester",
    modules: [
      {
        name: "Data Analytics und Big Data (MP)",
        status: "P",
        note: 1.0,
        credits: 5,
        datum: "–",
        bewertung: "96/100",
      },
      {
        name: "Design Thinking",
        status: "P",
        note: 1.3,
        credits: 5,
        datum: "–",
        bewertung: "91/100",
      },
      {
        name: "Betriebssysteme, Rechnernetze & verteilte Systeme",
        status: "P",
        note: 1.7,
        credits: 5,
        datum: "11.02.2025",
        bewertung: "78/90",
      },
      {
        name: "Praxisprojekt V",
        status: "P",
        note: 1.3,
        credits: 5,
        datum: "01.04.2025",
        bewertung: "91/100",
      },
    ],
  },
  {
    name: "6. Semester",
    modules: [
      {
        name: "IT-Architekturmanagement",
        status: "P",
        note: 1.3,
        credits: 5,
        datum: "21.08.2025",
        bewertung: "93.33/100",
      },
      {
        name: "Planen und Entscheiden",
        status: "P",
        note: 1.3,
        credits: 5,
        datum: "31.07.2025",
        bewertung: "92/100",
      },
      {
        name: "Praxisprojekt VI",
        status: "E",
        note: null,
        credits: 5,
        datum: "29.09.2025",
        bewertung: "Bewertung folgt",
      },
    ],
  },
  {
    name: "7. Semester",
    modules: [
      { name: "E-Commerce", status: "CE", note: null, credits: 5, datum: "–" },
      {
        name: "Personal- und Unternehmensführung",
        status: "CE",
        note: null,
        credits: 5,
        datum: "–",
      },
      {
        name: "Unternehmensgründung & Innovationsmanagement",
        status: "CE",
        note: null,
        credits: 5,
        datum: "–",
      },
      {
        name: "Bachelorarbeit",
        status: "M",
        note: null,
        credits: 10,
        datum: "–",
      },
      {
        name: "Praxisberichte VII",
        status: "CE",
        note: null,
        credits: 5,
        datum: "–",
      },
    ],
  },
];

const vertiefungDataAnalytics = {
  name: "Vertiefung: Data Analytics",
  modules: [
    {
      name: "Algorithmen, Datenstrukturen & Programmiersprachen I",
      status: "P",
      note: 1.7,
      credits: 5,
      datum: "19.08.2025",
    },
    { name: "… Fallstudie", status: "CE", note: null, credits: 5, datum: "–" },
    {
      name: "Business Intelligence I",
      status: "P",
      note: 1.3,
      credits: 5,
      datum: "–",
      bewertung: "92/100",
    },
    {
      name: "Business Intelligence II",
      status: "P",
      note: 1.0,
      credits: 5,
      datum: "01.08.2025",
      bewertung: "100/100",
    },
  ],
};

const zusatzModule = {
  name: "Zusatzmodule & Projekte",
  modules: [
    {
      name: "Projekt: KI-Exzellenz mit kreativen Prompt-Techniken",
      status: "P",
      note: 1.0,
      credits: 5,
      datum: "23.02.2025",
      bewertung: "100/100",
    },
    {
      name: "Artificial Intelligence (Wahlbereich)",
      status: "M",
      note: null,
      credits: 5,
      datum: "–",
    },
  ],
};

/* ---------- STATUS CHIP COLORS ---------- */
const chipClasses = {
  P: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  F: "bg-red-50 text-red-700 ring-1 ring-red-200",
  M: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  CE: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  E: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
};
const chipLabel = {
  P: "Bestanden",
  F: "Nicht bestanden",
  M: "Offen",
  CE: "Angemeldet",
  E: "Zur Prüfung angemeldet",
};

function parseDate(d) {
  if (!d || d === "–") return null;
  // dd.mm.yyyy
  const [dd, mm, yyyy] = d.split(".");
  return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
}

function formatCSVCell(val) {
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
  const [expanded, setExpanded] = useState([0, 1, 2]); // some open by default
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("none"); // none | datum | note
  const [sortDir, setSortDir] = useState("desc"); // asc | desc

  const allSections = useMemo(
    () => [...semesters, vertiefungDataAnalytics, zusatzModule],
    []
  );

  const stats = useMemo(() => {
    const modules = allSections.flatMap((s) => s.modules);
    const total = modules.length;
    const passed = modules.filter((m) => m.status === "P").length;
    const open = modules.filter((m) =>
      ["M", "CE", "E"].includes(m.status)
    ).length;
    const failed = modules.filter((m) => m.status === "F").length;
    const passRate = total ? Math.round((passed / total) * 100) : 0;
    return { total, passed, open, failed, passRate };
  }, [allSections]);

  const toggle = (i) =>
    setExpanded((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );

  const collapseAll = () => setExpanded([]);
  const expandAll = () => setExpanded(allSections.map((_, i) => i));

  const moduleMatches = (m) => {
    const sOk =
      statusFilter === "ALL"
        ? true
        : (m.status || "").toUpperCase() === statusFilter;
    const q = search.trim().toLowerCase();
    const qOk = !q || (m.name || "").toLowerCase().includes(q);
    return sOk && qOk;
  };

  const sortedModules = (mods) => {
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

  const filteredSections = useMemo(() => {
    return allSections.map((section) => {
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
    w.document.write(html);
    w.document.close();
  };

  return (
    <AppShell>
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/40">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* soft gradient accent */}
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(99,102,241,0.08),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_10%_120%,rgba(6,182,212,0.08),transparent_60%)] pointer-events-none" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <div className="text-slate-400 uppercase tracking-wider text-xs font-semibold">
                  Transcript & Notenverwaltung
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  IU Internationale Hochschule
                </h1>
                <div className="mt-2 text-slate-600">
                  {studentData.vorname} {studentData.name} •{" "}
                  {studentData.matrikelnummer}
                </div>
                <div className="text-slate-500 text-sm">
                  {studentData.studiengang}
                </div>
              </div>

              <div className="shrink-0">
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-right">
                  <div className="text-xs text-slate-500">
                    Gesamtdurchschnitt
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">
                    {studentData.gesamtDurchschnitt}
                  </div>
                </div>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Module gesamt</div>
                <div className="text-2xl font-bold">{stats.total}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Bestanden</div>
                <div className="text-2xl font-bold">{stats.passed}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Offen/Angem.</div>
                <div className="text-2xl font-bold">{stats.open}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Durchgefallen</div>
                <div className="text-2xl font-bold">{stats.failed}</div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS (Below Header) */}
        <div className="mt-4 flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Suchen (Modulname)…"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <svg
                className="w-5 h-5 text-slate-400 absolute right-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="ALL">Alle Status</option>
            <option value="P">P — Bestanden</option>
            <option value="M">M — Offen</option>
            <option value="CE">CE — Angemeldet</option>
            <option value="E">E — Zur Prüfung angemeldet</option>
            <option value="F">F — Nicht bestanden</option>
          </select>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="none">Sortierung: Keine</option>
              <option value="datum">Datum</option>
              <option value="note">Note</option>
            </select>

            <button
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm hover:bg-slate-50"
              title="Richtung umschalten"
            >
              {sortDir === "asc" ? "↑" : "↓"}
            </button>
          </div>

          {/* Expand/Collapse */}
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm hover:bg-slate-50"
            >
              Alle ausklappen
            </button>
            <button
              onClick={collapseAll}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm hover:bg-slate-50"
            >
              Alle einklappen
            </button>
          </div>

          {/* Exports */}
          <div className="flex gap-2">
            <button
              onClick={exportPDF}
              className="rounded-xl border border-indigo-200 bg-indigo-600 text-white px-3 py-2.5 shadow-sm hover:bg-indigo-700"
            >
              Export PDF
            </button>
            <button
              onClick={exportCSV}
              className="rounded-xl border border-cyan-200 bg-cyan-600 text-white px-3 py-2.5 shadow-sm hover:bg-cyan-700"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* PERFORMANCE */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-slate-800">
              Performance-Übersicht
            </div>
            <div className="text-sm text-slate-500">
              Passrate: {stats.passRate}%
            </div>
          </div>
          <div className="mt-3 h-3 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-3 bg-gradient-to-r from-indigo-500 to-cyan-400"
              style={{ width: `${stats.passRate}%` }}
            />
          </div>
          <div className="mt-2 flex gap-4 text-sm text-slate-500">
            <span>✅ Bestanden: {stats.passed}</span>
            <span>🕒 Offen/CE/E: {stats.open}</span>
            <span>⛔️ F: {stats.failed}</span>
          </div>
        </div>

        {/* SECTIONS */}
        <div className="mt-6 space-y-4">
          {filteredSections.map((section, i) => {
            const isOpen = expanded.includes(i);
            return (
              <div
                key={section.name}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full text-left px-5 py-4 bg-gradient-to-r from-indigo-50 to-cyan-50 border-b border-slate-200 flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-800">
                    {section.name}
                  </span>
                  <span className="text-slate-500">{isOpen ? "▴" : "▾"}</span>
                </button>

                {isOpen && (
                  <div className="p-4">
                    {section.modules.length === 0 ? (
                      <div className="text-sm text-slate-500 px-2 py-4">
                        Keine Einträge für diesen Filter.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-[720px] w-full">
                          <thead>
                            <tr className="text-xs uppercase tracking-wide text-slate-500 bg-slate-50">
                              {[
                                "Modul",
                                "Status",
                                "Note",
                                "Credits",
                                "Datum",
                                "Bewertung",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="text-left px-3 py-3 border-b border-slate-200"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.modules.map((m, j) => (
                              <tr
                                key={j}
                                className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors"
                              >
                                <td className="px-3 py-3 font-medium text-slate-800">
                                  {m.name}
                                </td>
                                <td className="px-3 py-3">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${chipClasses[m.status] || "bg-slate-100 text-slate-700 ring-1 ring-slate-200"}`}
                                  >
                                    {m.status} · {chipLabel[m.status] || "—"}
                                  </span>
                                </td>
                                <td className="px-3 py-3">
                                  {m.note == null ? (
                                    <span className="text-slate-400">—</span>
                                  ) : (
                                    <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm font-bold text-slate-900">
                                      {m.note}
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-3 font-semibold text-slate-800">
                                  {m.credits ?? "—"}
                                </td>
                                <td className="px-3 py-3 text-slate-600">
                                  {m.datum ?? "—"}
                                </td>
                                <td className="px-3 py-3 text-slate-600">
                                  {m.bewertung ?? "—"}
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
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="font-extrabold text-slate-900 mb-3">Legende</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { c: "bg-emerald-500", label: "P — Bestanden" },
              { c: "bg-blue-500", label: "CE — Angemeldet" },
              { c: "bg-violet-500", label: "E — Zur Prüfung angemeldet" },
              { c: "bg-amber-500", label: "M — Offen" },
              { c: "bg-red-500", label: "F — Nicht bestanden" },
            ].map((it) => (
              <div
                key={it.label}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <span className={`h-3 w-3 rounded ${it.c}`} />
                <div className="text-sm text-slate-700">{it.label}</div>
              </div>
            ))}
            {[
              { c: "bg-emerald-500", label: "Note ≤ 1.5 · sehr gut" },
              { c: "bg-blue-500", label: "1.6–2.5 · gut" },
              { c: "bg-amber-500", label: "2.6–3.5 · befriedigend" },
              { c: "bg-red-500", label: "≥ 3.6 · ausreichend / mangelhaft" },
            ].map((it) => (
              <div
                key={it.label}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <span className={`h-3 w-3 rounded ${it.c}`} />
                <div className="text-sm text-slate-700">{it.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-xs text-slate-500">
            Modernes SaaS-Layout · Light Mode · Indigo/Cyan Akzente
          </div>
        </div>
      </div>
    </div>
      
    </AppShell>
  );
}
