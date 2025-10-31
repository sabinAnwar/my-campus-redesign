import React, { useMemo, useState } from "react";
import AppShell from "../components/AppShell";

// Helper: build calendar weeks for a given month
function buildMonth(year, month /* 0-11 */) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const daysInMonth = last.getDate();

  // Start from Monday (ISO). Compute offset: Mon=1..Sun=7
  const weekday = (d) => {
    const w = d.getDay();
    return w === 0 ? 7 : w; // Sunday -> 7
  };

  const weeks = [];
  let week = new Array(7).fill(null);
  let cursor = 1;

  // Fill initial empty days
  const startOffset = weekday(first) - 1; // 0..6
  for (let i = 0; i < startOffset; i++) week[i] = null;

  while (cursor <= daysInMonth) {
    for (let i = startOffset; i < 7 && cursor <= daysInMonth; i++) {
      week[i] = cursor++;
      if (i === 6 || cursor > daysInMonth) {
        weeks.push(week);
        week = new Array(7).fill(null);
      }
    }
    // after first row
    for (var j = 0; j < 7 && cursor <= daysInMonth; j++) {
      week[j] = cursor++;
      if (j === 6 || cursor > daysInMonth) {
        weeks.push(week);
        week = new Array(7).fill(null);
      }
    }
  }
  return weeks;
}

function MonthCard({ year, month, title, highlights = {} }) {
  const weeks = useMemo(() => buildMonth(year, month), [year, month]);
  const dow = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const isHighlighted = (day) => {
    if (!day) return false;
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return !!highlights[key];
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 w-full">
      <div className="text-sm font-bold text-slate-800 mb-2">{title}</div>
      <div className="grid grid-cols-7 text-[11px] text-slate-500 mb-1">
        {dow.map((d) => (
          <div key={d} className="text-center py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-xs">
        {weeks.map((w, wi) => (
          <React.Fragment key={wi}>
            {w.map((day, di) => (
              <div
                key={di}
                className={
                  "h-7 flex items-center justify-center rounded " +
                  (day
                    ? isHighlighted(day)
                      ? "bg-yellow-200 text-slate-900 font-semibold"
                      : "hover:bg-slate-100"
                    : "")
                }
              >
                {day || ""}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function Praxisbericht() {
  const [term, setTerm] = useState("7. Term - WISE-2025");
  const [option, setOption] = useState("I don't know yet.");
  const [view, setView] = useState("calendar"); // list | calendar

  // Example submitted count (for the pill)
  const submitted = 4;
  const required = 6;

  const months = [
    { y: 2025, m: 9, title: "October 2025" },
    { y: 2025, m: 10, title: "November 2025" },
    { y: 2025, m: 11, title: "December 2025" },
    { y: 2026, m: 0, title: "January 2026" },
    { y: 2026, m: 1, title: "February 2026" },
    { y: 2026, m: 2, title: "March 2026" },
  ];

  const onSave = () => {
    // In a real app, submit to API
    console.log({ term, option });
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-[28px] font-bold text-slate-900 mb-6">Praxisberichte</h1>

        {/* Time period */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Time period</label>
          <div className="flex items-center gap-3">
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-slate-50"
            >
              <option>7. Term - WISE-2025</option>
              <option>6. Term - SS-2025</option>
              <option>5. Term - WISE-2024</option>
            </select>
          </div>
        </div>

        {/* Hiring option */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Hiring option by practice partner
          </label>
          <div className="flex items-center gap-3">
            <select
              value={option}
              onChange={(e) => setOption(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm bg-slate-50"
            >
              <option>Please select the option that applies to you from the drop-down:</option>
              <option>I don't know yet.</option>
              <option>Already hired.</option>
              <option>In process.</option>
            </select>
            <button
              onClick={onSave}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
            >
              Save
            </button>
          </div>
        </div>

        {/* Submitted reports */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-semibold text-slate-700">Submitted reports</span>
          <span className="inline-flex items-center justify-center text-[12px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
            {submitted}/{required}
          </span>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-4 mb-2 text-sm">
          <button
            onClick={() => setView("list")}
            className={
              "px-2 py-1 rounded " + (view === "list" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100")
            }
          >
            List
          </button>
          <button
            onClick={() => setView("calendar")}
            className={
              "px-2 py-1 rounded " + (view === "calendar" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100")
            }
          >
            Calendar
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Click on the corresponding calendar week, to edit an already handed in report or to file a new report for this week.
          Your report template can be found below the calendar:
        </p>

        {view === "calendar" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {months.map((m) => (
              <MonthCard key={`${m.y}-${m.m}`} year={m.y} month={m.m} title={m.title} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-slate-600 text-sm">No reports yet. Switch to Calendar to create one.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
