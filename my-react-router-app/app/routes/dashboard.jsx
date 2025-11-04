import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import {
  Calendar,
  BookOpen,
  CheckSquare,
  Clock,
  FileText,
  Bell,
  ArrowRight,
  Play,
} from "lucide-react";

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
            Accept: "application/json",
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
      <AppShell>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-slate-700">Loading...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  // Mock data
  const news = [
    {
      title: "Upcoming Senate election at IU International University",
      date: "2.11.2025",
      category: "Academics",
      featured: true,
    },
    {
      title: "Information about the availability of the Campus",
      date: "2.11.2025",
      category: "Library",
      description: "On October 30, 2025, the front desk at Campus Würzburg will be unstaffed.",
    },
  ];

  const modules = [
    { title: "Unternehmensgründung und..." },
    { title: "E-Commerce" },
    { title: "Algorithmen, Datenstrukturen und..." },
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        {/* Greeting Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8 mt-6">
          <div className="flex-1">
            <h1 className="text-[36px] font-semibold text-slate-900 dark:text-white leading-tight mb-2">
              Hi, {user?.name ? user.name.split(" ")[0] : "Student"}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Welcome back! Here's what's new today.
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
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* News Section */}
            <div>
              <h2 className="text-sm font-semibold mb-3 text-slate-600 dark:text-slate-400">
                News
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.map((item, i) => (
                  <div
                    key={i}
                    className="relative rounded-2xl p-5 border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Colored top border */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
                        i === 0 ? "bg-blue-400" : "bg-purple-400"
                      }`}
                    />
                    
                    {/* Category and Featured badges */}
                    <div className="absolute top-3 right-4 flex flex-col gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                        {item.category}
                      </span>
                      {item.featured && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                          FEATURED
                        </span>
                      )}
                    </div>

                    <div className="mt-2">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 pr-20">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 dark:text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>{i === 0 ? "Faculty of Computer Science" : "Library Team"}</span>
                      </div>
                      <button className="mt-4 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors inline-flex items-center gap-1">
                        Read more <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl p-6 md:col-span-2 border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-4">FAQ</div>
                <div className="h-28 rounded-xl bg-gradient-to-r from-indigo-500/30 to-blue-500/30" />
              </div>
              <div className="rounded-2xl p-6 border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                  Practical reports
                </div>
                <div className="h-28 rounded-xl bg-gradient-to-br from-sky-400/20 to-sky-600/20" />
              </div>
              <div className="rounded-2xl p-6 border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 md:col-start-3 md:row-start-1 hidden md:block hover:shadow-lg transition-shadow duration-300">
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                  Your campus
                </div>
                <div className="h-28 rounded-xl bg-gradient-to-br from-violet-400/20 to-fuchsia-500/20" />
              </div>
            </div>

            {/* Modules */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Modules
                </h2>
                <button
                  className="text-slate-500 dark:text-slate-400 text-sm hover:text-slate-700 dark:hover:text-slate-300"
                  title="Refresh"
                >
                  ⟳
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {modules.map((m, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border overflow-hidden bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="h-40 w-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
                    <div className="p-4">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
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
            <div className="rounded-2xl p-6 border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="h-12 w-16 rounded bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    RECOMMEND STUDIES
                  </div>
                  <p className="text-xs mt-2 text-slate-600 dark:text-slate-400 mb-4">
                    Recommend the IU and get{" "}
                    <span className="font-bold">up to 200€</span> as a thank you!
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm">
                    Get your bonus now
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6 border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
              <div className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                Prüfungs-Guide
              </div>
              <div className="mt-4 h-40 rounded-xl bg-gradient-to-br from-orange-200 to-amber-300 dark:from-orange-900/30 dark:to-amber-900/30" />
              <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">
                Hier findest Du alle relevanten Infos zu Deinen Prüfungen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
