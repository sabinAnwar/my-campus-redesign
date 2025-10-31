import React, { useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import { Download } from "lucide-react";

export const loader = async () => null;

function formatHeaderDate(d) {
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${weekday}, ${y}-${m}-${day}`;
}

function useMonthMatrix(year, month /* 0-11, Monday-first */) {
  return useMemo(() => {
    const first = new Date(year, month, 1);
    const firstDay = (first.getDay() + 6) % 7; // convert Sun(0)..Sat(6) -> Mon(0)..Sun(6)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    // Leading blanks
    for (let i = 0; i < firstDay; i++) cells.push(null);
    // Days of month
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    // Trailing blanks to fill 6 rows
    while (cells.length % 7 !== 0) cells.push(null);
    while (cells.length < 42) cells.push(null);
    return cells;
  }, [year, month]);
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function CourseSchedule() {
  const today = new Date();
  const [tab, setTab] = useState("class"); // class | virtual
  const [showOptional, setShowOptional] = useState(false);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const monthCells = useMonthMatrix(year, month);

  const isTodayInView = today.getFullYear() === year && today.getMonth() === month;

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-[24px] md:text-[28px] font-semibold text-slate-900">Course events</h1>

        {/* Tabs */}
        <div className="mt-6">
          <div className="inline-flex rounded-full bg-slate-100 p-1">
            <button
              onClick={() => setTab("class")}
              className={`px-4 md:px-5 py-2 rounded-full text-sm font-semibold transition ${
                tab === "class" ? "bg-white shadow text-slate-900" : "text-slate-700 hover:text-slate-900"
              }`}
            >
              Class schedule
            </button>
            <button
              onClick={() => setTab("virtual")}
              className={`px-4 md:px-5 py-2 rounded-full text-sm font-semibold transition ${
                tab === "virtual" ? "bg-white shadow text-slate-900" : "text-slate-700 hover:text-slate-900"
              }`}
            >
              Virtual rooms
            </button>
          </div>
        </div>

        {/* Two-column layout */}
  <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-10 items-start">
          {/* Main left */}
          <div className="min-h-[520px] flex flex-col">
            {/* Current date line */}
            <div className="text-[18px] font-semibold text-indigo-700/80 mb-10">
              {formatHeaderDate(today)}
            </div>

            {/* Empty-state illustration */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <svg width="180" height="140" viewBox="0 0 240 180" className="text-slate-300" aria-hidden>
                <rect x="30" y="40" width="180" height="110" rx="10" className="fill-current opacity-30"></rect>
                <rect x="45" y="60" width="150" height="14" rx="7" className="fill-current opacity-60"></rect>
                <rect x="45" y="85" width="120" height="10" rx="5" className="fill-current opacity-50"></rect>
                <rect x="45" y="105" width="90" height="10" rx="5" className="fill-current opacity-40"></rect>
              </svg>
              <p className="mt-6 text-slate-600 font-semibold">There are no further events.</p>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="lg:sticky lg:top-6">
            <div className="flex items-center justify-between mb-4">
              <a href="#" className="inline-flex items-center gap-2 text-indigo-700 hover:text-indigo-800 font-semibold">
                <Download className="h-4 w-4" /> Export iCalendar
              </a>
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4 select-none">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" checked={showOptional} onChange={(e) => setShowOptional(e.target.checked)} />
              Show optional events
            </label>

            {/* Controls */}
            <div className="flex gap-3 mb-4">
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm"
              >
                {Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm"
              >
                {MONTHS.map((m, idx) => (
                  <option key={m} value={idx}>{m} (0)</option>
                ))}
              </select>
            </div>

            {/* Calendar */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <div className="grid grid-cols-7 text-center text-[13px] font-semibold text-slate-600 mb-2">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
                  <div key={d} className="py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {monthCells.map((d, i) => {
                  const isToday = !!d && isTodayInView && d.getDate() === today.getDate();
                  return (
                    <div key={i} className="aspect-square">
                      {d ? (
                        <div
                          className={`w-full h-full flex items-center justify-center rounded-xl text-sm font-semibold ${
                            isToday
                              ? 'bg-white text-slate-900 ring-1 ring-slate-300'
                              : 'text-slate-700 hover:bg-white/60'
                          }`}
                        >
                          {d.getDate()}
                        </div>
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center gap-6 text-[13px] font-semibold text-slate-700">
                <span className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Optional events</span>
                <span className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span> Mandatory events</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
