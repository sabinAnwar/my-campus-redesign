import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AppShell from "../components/AppShell";

export async function loader() {
  return null;
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          credentials: "include",
          headers: {
            "Accept": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user || { name: "Student" });
          setLoading(false);
        } else if (response.status === 401) {
          console.log("User not authenticated, redirecting to login");
          navigate("/login", { replace: true });
        } else {
          console.log("Could not fetch user, using default");
          setUser({ name: "Student" });
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser({ name: "Student" });
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-slate-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main column */}
        <div className="lg:col-span-8 space-y-8 min-w-0">
          {/* Greeting section with aligned robot */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-start md:justify-between gap-8 mt-6">
            {/* Text Section */}
            <div className="flex-1">
              <h1 className="text-[36px] font-semibold text-slate-900 leading-tight">
                Hi, {user?.name?.split(" ")[0] || "Student"}
              </h1>
              <p className="text-slate-600 text-sm mt-2">
                Welcome back! Here’s what’s new today.
              </p>
            </div>

            {/* Robot Section */}
            <div className="flex justify-center md:justify-end w-full md:w-auto">
              <div className="relative w-[180px] h-[180px] md:w-[230px] md:h-[230px] animate-float">
                <iframe
                  src="https://my.spline.design/genkubgreetingrobot-CBmqahXcuk8nIjmKWGDo53mA/"
                  frameBorder="0"
                  width="100%"
                  height="100%"
                  allow="autoplay; fullscreen"
                  title="Spline robot"
                  className="rounded-full pointer-events-none"
                  style={{
                    background: "transparent",
                    transform: "scale(1.05)",
                    overflow: "hidden",
                  }}
                ></iframe>
                {/* Hide watermark */}
                <style>
                  {`
                    iframe::-webkit-media-controls-enclosure { display: none !important; }
                    iframe + div,
                    iframe ~ div {
                      display: none !important;
                    }
                  `}
                </style>
              </div>
            </div>
          </div>

          {/* News */}
          <div>
            <h2 className="text-sm font-semibold mb-3 text-slate-600">News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="relative rounded-2xl p-5 border bg-white border-slate-200 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="absolute top-3 right-4 hidden md:flex flex-col gap-1.5 opacity-70">
                    <span className="bg-slate-300 h-[2px] w-10 rounded"></span>
                    <span className="bg-slate-300 h-[2px] w-8 rounded"></span>
                    <span className="bg-slate-300 h-[2px] w-6 rounded"></span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {i === 1
                      ? "Upcoming Senate election at IU International..."
                      : "Information about the availability of the Campus..."}
                  </p>
                  <p className="mt-2 text-xs text-slate-600">
                    On October 30, 2025, the front desk at Campus Würzburg will
                    be unstaffed.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <div className="bg-[#0b0b10] text-white rounded-2xl p-6 md:col-span-2 border border-slate-900/20">
              <div className="text-sm font-semibold">FAQ</div>
              <div className="mt-6 h-28 rounded-xl bg-gradient-to-r from-indigo-500/30 to-blue-500/30" />
            </div>
            <div className="rounded-2xl p-6 border bg-white border-slate-200">
              <div className="text-sm font-semibold text-slate-900">
                Practical reports
              </div>
              <div className="mt-6 h-28 rounded-xl bg-gradient-to-br from-sky-400/20 to-sky-600/20" />
            </div>
            <div className="rounded-2xl p-6 border bg-white border-slate-200 md:col-start-3 md:row-start-1 hidden md:block">
              <div className="text-sm font-semibold text-slate-900">
                Your campus
              </div>
              <div className="mt-6 h-28 rounded-xl bg-gradient-to-br from-violet-400/20 to-fuchsia-500/20" />
            </div>
          </div>

          {/* Modules */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-600">Modules</h2>
              <button
                className="text-slate-500 text-sm hover:text-slate-700"
                title="Refresh"
              >
                ⟳
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[
                { title: "Unternehmensgründung und..." },
                { title: "E-Commerce" },
                { title: "Algorithmen, Datenstrukturen und..." },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border overflow-hidden bg-white border-slate-200 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="h-40 w-full bg-gradient-to-br from-slate-200 to-slate-300" />
                  <div className="p-4">
                    <div className="text-sm font-semibold text-slate-900">
                      {m.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl p-6 border bg-white border-slate-200">
            <div className="flex items-start gap-4">
              <div className="h-12 w-16 rounded bg-slate-200" />
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">
                  RECOMMEND STUDIES
                </div>
                <p className="text-xs mt-2 text-slate-600">
                  Recommend the IU and get{" "}
                  <span className="font-bold">up to 200€</span> as a thank you!
                </p>
                <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:opacity-90">
                  Get your bonus now
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 border bg-white border-slate-200">
            <div className="text-sm font-bold text-slate-900">
              Prüfungs-Guide
            </div>
            <div className="mt-4 h-40 rounded-xl bg-gradient-to-br from-orange-200 to-amber-300" />
            <p className="mt-4 text-xs text-slate-600">
              Hier findest Du alle relevanten Infos zu Deinen Prüfungen.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
