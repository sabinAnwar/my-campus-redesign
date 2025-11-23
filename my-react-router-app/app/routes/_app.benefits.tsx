import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Search,
  ArrowUpRight,
  Laptop,
  BarChart3,
  Music,
  ClipboardList,
  GraduationCap,
  Star,
  LifeBuoy,
} from "lucide-react";

const toolCategories = [
  {
    title: "Productivity & Software",
    icon: Laptop,
    color: "blue",
    gradient: "from-blue-600 to-cyan-600",
    tools: [
      {
        name: "Microsoft Office 365",
        description: "Word, Excel, PowerPoint, Teams – gratis mit IU-Mail.",
        url: "https://www.office.com/",
        support: "https://support.microsoft.com/de-DE",
        logo: { text: "O365", bg: "bg-blue-600" },
        featured: true,
      },
      {
        name: "Azure for Students (100€)",
        description: "Cloud-Services testen ohne Kreditkarte.",
        url: "https://azure.microsoft.com/de-de/free/students/",
        logo: { text: "AZ", bg: "bg-indigo-600" },
      },
      {
        name: "MathWorks MATLAB",
        description: "Campuslizenz für MATLAB & Simulink.",
        url: "https://de.mathworks.com/academia/tah-portal/iubh-internationale-hochschule-31521908.html",
        logo: { text: "ML", bg: "bg-orange-500" },
      },
      {
        name: "LinkedIn Learning",
        description: "Kurse via IU SSO freischalten.",
        url: "https://auth.iu.org/samlp/mLktF8EpyrPwZPqPsr8oJAuvxmYfj1LB",
        logo: { text: "Li", bg: "bg-sky-600" },
        featured: true,
      },
    ],
  },
  {
    title: "Research & Datenbanken",
    icon: BarChart3,
    color: "emerald",
    gradient: "from-emerald-600 to-teal-600",
    tools: [
      {
        name: "Statista Premium",
        description: "Zugriff über LIS/OpenAthens.",
        url: "https://connect.openathens.net/statista.com/6ca2c067-1dee-4791-b1700d4d57d005ba/auth/rcv/saml2/post",
        logo: { text: "S", bg: "bg-emerald-600" },
        featured: true,
      },
      {
        name: "Knovel Tutorials",
        description: "Video-Anleitungen für Knovel.",
        url: "https://www.elsevier.support/knovel/answer/where-can-i-find-video-tutorials-for-knovel",
        logo: { text: "K", bg: "bg-teal-600" },
      },
      {
        name: "Beck-Online Intro",
        description: "Kurzvideo zur Rechtsdatenbank.",
        url: "https://www.youtube.com/watch?v=zP-uzpxHSjw",
        logo: { text: "B", bg: "bg-amber-600" },
      },
      {
        name: "Nautos FAQ",
        description: "Normendatenbank – häufige Fragen.",
        url: "https://nautos-de.eu1.proxy.openathens.net/2RO/faq#persoenliche_einstellung",
        logo: { text: "N", bg: "bg-slate-600" },
      },
      {
        name: "Research Tutorials",
        description: "Unipark, WISO, IEEE, Knovel, Elicit.",
        url: "https://www.youtube.com/watch?v=oShRg-BPA-0&list=PLCWHRfa4mbG1Nsqd4D7iT-HVP28EGVq_5",
        logo: { text: "RT", bg: "bg-purple-600" },
      },
    ],
  },
  {
    title: "Lernen & Upskilling",
    icon: GraduationCap,
    color: "violet",
    gradient: "from-violet-600 to-purple-600",
    tools: [
      {
        name: "Google Zukunftswerkstatt",
        description: "Kostenlose Digital- und KI-Trainings.",
        url: "https://grow.google/intl/de/",
        logo: { text: "G", bg: "bg-green-600" },
      },
      {
        name: "Udemy Deals",
        description: "Rabattierte Kurse für Tech & Business.",
        url: "https://www.udemy.com/",
        logo: { text: "U", bg: "bg-pink-600" },
      },
      {
        name: "IU Bootcamp",
        description: "Programmieren lernen für IU-Studierende.",
        url: "https://mycampus-classic.iu.org/course/view.php?id=4510",
        alt: "https://programmieren-starten.de/",
        logo: { text: "BC", bg: "bg-indigo-500" },
        featured: true,
      },
      {
        name: "IU Learn App",
        description: "Skripte, Videos, Tests & Karteikarten.",
        url: "#",
        logo: { text: "Learn", bg: "bg-cyan-600" },
      },
      {
        name: "Speexx Sprachkurse",
        description: "DE/EN/FR/IT/ES – sofort starten, keine ECTS.",
        url: "https://portal.speexx.com/",
        logo: { text: "SPX", bg: "bg-red-500" },
      },
    ],
  },
];

const categoryBadge: any = {
  blue: "bg-blue-600/20 dark:bg-blue-600/30 border-blue-500/40",
  emerald: "bg-emerald-600/20 dark:bg-emerald-600/30 border-emerald-500/40",
  violet: "bg-violet-600/20 dark:bg-violet-600/30 border-violet-500/40",
  amber: "bg-amber-600/20 dark:bg-amber-600/30 border-amber-500/40",
  lime: "bg-lime-600/20 dark:bg-lime-600/30 border-lime-500/40",
};

export default function StudentBenefits() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCategories = toolCategories.filter((category) => {
    if (selectedCategory !== "all" && category.title !== selectedCategory)
      return false;
    if (!search) return true;
    return category.tools.some(
      (tool) =>
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalTools = toolCategories.reduce(
    (sum, cat) => sum + cat.tools.length,
    0
  );

  const featuredTools = toolCategories.flatMap((cat) =>
    cat.tools
      .filter((tool) => tool.featured)
      .map((tool) => ({
        ...tool,
        category: cat.title,
      }))
  );

  return (
    <div className="min-h-screen dark:via-slate-900 dark:to-slate-950 text-foreground transition-all">
      {/* 🔥 Mixed Clean + Glow Header */}

      {/* Clean Header – exactly like “Module” screenshot */}
      <div
        className="
    rounded-3xl
    bg-white dark:bg-slate-900
    border border-slate-200 dark:border-slate-800
    p-10 mb-10
  "
      >
        {/* Back link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-primary font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zum Dashboard
        </Link>

        {/* Badge */}
        <div
          className="
      mt-4 inline-flex w-full
      items-center px-4 py-1.5
      rounded-full text-xs font-semibold
    dark:bg-slate-800
      text-slate-600 dark:text-slate-300
    "
        >
          Exklusiv für IU Studierende
        </div>

        {/* Title EXACTLY like in your screenshot */}
        <h1
          className="
      text-4xl md:text-5xl font-black mt-6
      text-slate-900 dark:text-slate-100
    "
        >
          Student Benefits Hub
        </h1>

        {/* Subtitle EXACTLY like screenshot */}
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
          Zugriff auf {totalTools}+ Premium-Tools und Services.
        </p>
      </div>

      {/* Featured Tools */}
      {featuredTools.length > 0 && (
        <div
          className="
          relative overflow-hidden rounded-2xl
          bg-gradient-to-br from-amber-50 to-orange-50
          dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20
          border border-amber-300/40 dark:border-amber-600/20
          p-6 mb-12 shadow-xl
        "
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg text-white">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-200">
              Featured Tools
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                className="
                  flex items-center gap-3 p-4 rounded-xl
                  bg-white dark:bg-slate-900/60
                  border border-amber-300/40 dark:border-amber-600/20
                  hover:shadow-lg hover:border-amber-500/60 dark:hover:border-amber-400/40
                  transition-all backdrop-blur-sm
                "
              >
                <div
                  className={`h-12 w-12 rounded-xl text-white font-black flex items-center justify-center shadow ${tool.logo.bg}`}
                >
                  {tool.logo.text}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{tool.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {tool.category}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-amber-600 dark:text-amber-300" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Search + Filters */}
      {/* Search + Filters */}
      <div
        className="
  sticky top-4 z-20 relative overflow-hidden
  rounded-2xl px-4 py-5 mb-10
  bg-gradient-to-br from-white/90 to-slate-100/80
  dark:from-slate-900/80 dark:via-slate-900/70 dark:to-slate-950/80
  border border-slate-300/60 dark:border-slate-700/50
  shadow-[0_8px_30px_rgb(0,0,0,0.12)]
  backdrop-blur-2xl
"
      >
        {/* Glow Bubbles (klein & elegant) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="
      absolute top-[-20px] right-[-25px] w-[160px] h-[160px]
      bg-purple-500/20 dark:bg-purple-600/20
      rounded-full blur-2xl
    "
          />

          <div
            className="
      absolute bottom-[-20px] left-[-25px] w-[160px] h-[160px]
      bg-orange-500/20 dark:bg-orange-600/20
      rounded-full blur-2xl
    "
          />
        </div>

        {/* Content */}
        <div className="relative flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tools durchsuchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
          w-full pl-10 pr-4 py-3 rounded-xl
          bg-background border border-border
          text-foreground placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-primary/40 transition
        "
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="
        px-4 py-3 rounded-xl bg-background border border-border
        text-foreground font-medium focus:ring-2 focus:ring-primary/40
        cursor-pointer transition
      "
          >
            <option value="all">Alle Kategorien</option>
            {toolCategories.map((cat) => (
              <option key={cat.title} value={cat.title}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tools Grid */}
      <section className="space-y-12">
        {filteredCategories.map((category) => (
          <div key={category.title} className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl border shadow ${categoryBadge[category.color]}`}
              >
                <category.icon className="w-5 h-5 text-current" />
              </div>
              <div>
                <h3 className="text-2xl font-black">{category.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.tools.length} Tools
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {category.tools.map((tool) => (
                <article
                  key={tool.name}
                  className="
                    group relative rounded-2xl p-5
                    bg-white dark:bg-slate-900/70
                    border border-border shadow-sm
                    hover:border-primary/50 hover:shadow-lg
                    transition-all backdrop-blur-sm
                  "
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-14 w-14 rounded-xl flex items-center justify-center text-white font-black shadow ${tool.logo.bg}`}
                    >
                      {tool.logo.text}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="text-lg font-bold">{tool.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {tool.description}
                      </p>

                      <div className="flex gap-4 pt-2">
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
                        >
                          Öffnen <ArrowUpRight className="w-4 h-4" />
                        </a>

                        {tool.support && (
                          <a
                            href={tool.support}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-primary text-sm"
                          >
                            <LifeBuoy className="inline w-4 h-4 mr-1" />
                            Support
                          </a>
                        )}

                        {tool.alt && (
                          <a
                            href={tool.alt}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-primary text-sm"
                          >
                            Alternative
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <div
        className="
        mt-20 relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80
        border border-border shadow-xl p-10 text-slate-300
      "
      >
        <p className="text-lg mb-2">Regelmäßig aktualisiert</p>
        <p className="text-sm text-muted-foreground">
          Zuletzt aktualisiert:{" "}
          {new Date().toLocaleDateString("de-DE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
