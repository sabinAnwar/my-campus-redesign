import { Instagram, Facebook, Linkedin, Youtube, Globe, Users, Trophy, Presentation, GraduationCap, BookOpen, Lightbulb } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";

// ────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS
// ────────────────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  de: {
    title: "Social Media & Kanäle",
    subtitle: "Hier findest du alle wichtigen Verbindungen – von offiziellen Hochschul-News bis hin zu exklusiven Inhalten deiner Dozenten.",
    officialChannels: "Offizielle Kanäle der IU",
    officialSubtitle: "Zentrale Übersicht für Studierende, Mitarbeitende und Partner",
    facultyChannels: "Kanäle von Lehrenden",
    facultySubtitle: "Fachbezogene Inhalte, Tipps und Zusatzmaterial von deinen Professoren",
    alumniCommunity: "IU Alumni Community",
    alumniSubtitle: "Bleib vernetzt und profitiere von exklusiven Vorteilen",
    toChannel: "Zum Kanal",
    iuConnect: "IU Connect Platform",
    iuConnectDesc: "Werde Teil der Community auf connect.iu.de. Finde ehemalige Kommilitonen über das Mitgliederverzeichnis, filtere nach Stadt oder Studiengang und teile deine Erfahrungen.",
    registerNow: "Jetzt registrieren",
    linkedinGroup: "LinkedIn Gruppe",
    alumniDiscounts: "Exklusive Alumni-Rabatte",
    masterDiscount: "15% auf Master & MBA",
    masterDiscountNote: "Gültig für Fernstudium Masterprogramme ab 60 ECTS.",
    trainingDiscount: "10% auf Weiterbildungen",
    trainingDiscountNote: "Auf Kurse der zertifizierten IU Akademie.",
    brandAmbassador: "Werde IU Brand Ambassador",
    ambassadorDesc: "Du bist auf Social Media aktiv und möchtest deinen Weg an der IU teilen? Werde Micro Affiliate Partner!",
    whatAwaits: "Das erwartet dich",
    whatAwaitsDesc: "Feste Vergütung für Leads, Performance-Plattform und Zugang zur exklusiven Creator-Community.",
    yourProfile: "Dein Profil",
    yourProfileDesc: "Du zeigst deinen Studienalltag auf Instagram/TikTok und trittst als Botschafter:in auf.",
    interested: "Interesse geweckt? Schreib uns:",
    channels: {
      instagram: "Offizielle News, Campus-Updates und Stories für alle Studierenden.",
      instagramCareer: "Karrieretipps, Jobmessen und Erfolgsgeschichten.",
      linkedin: "Professionelles Netzwerk für Studierende, Alumni und Partner.",
      facebook: "Community-Austausch und Diskussionen rund ums Studium.",
      youtube: "Studieninfos, Webinare und Einblicke in den Campus-Alltag.",
      twitter: "Kurznachrichten und Updates zum dualen Studium.",
      tiktok: "Kurze Videos, Lifehacks und Unterhaltung rund ums Studium.",
      website: "Zentrale Anlaufstelle für alle offiziellen Informationen.",
    },
    faculty: {
      unplugged: "Dr. Florian Perst (Academic Lecturer Business & Wissenschaftliches Arbeiten): Einblicke, Tipps und Motivation.",
      wissenschaftlich: "Tipps & Tricks von Prof. Dr. Müller zum Schreiben von Hausarbeiten.",
      mathe: "Zusätzliche Erklärvideos und Übungen von Prof. Schmidt.",
      tech: "Aktuelle Trends aus der IT-Welt, kuratiert von Prof. Weber.",
    },
    tags: {
      instagram: "Instagram",
      learning: "Lernmethoden",
      course: "Kursbegleitung",
      expertise: "Fachwissen",
    },
  },
  en: {
    title: "Social Media & Channels",
    subtitle: "Find all important connections here – from official university news to exclusive content from your lecturers.",
    officialChannels: "Official IU Channels",
    officialSubtitle: "Central overview for students, staff, and partners",
    facultyChannels: "Faculty Channels",
    facultySubtitle: "Subject-related content, tips, and additional material from your professors",
    alumniCommunity: "IU Alumni Community",
    alumniSubtitle: "Stay connected and benefit from exclusive advantages",
    toChannel: "Go to Channel",
    iuConnect: "IU Connect Platform",
    iuConnectDesc: "Become part of the community on connect.iu.de. Find former classmates via the member directory, filter by city or program, and share your experiences.",
    registerNow: "Register Now",
    linkedinGroup: "LinkedIn Group",
    alumniDiscounts: "Exclusive Alumni Discounts",
    masterDiscount: "15% off Master & MBA",
    masterDiscountNote: "Valid for distance learning Master programs from 60 ECTS.",
    trainingDiscount: "10% off Further Education",
    trainingDiscountNote: "On courses from the certified IU Academy.",
    brandAmbassador: "Become an IU Brand Ambassador",
    ambassadorDesc: "Are you active on social media and want to share your journey at IU? Become a Micro Affiliate Partner!",
    whatAwaits: "What awaits you",
    whatAwaitsDesc: "Fixed compensation for leads, performance platform, and access to the exclusive creator community.",
    yourProfile: "Your Profile",
    yourProfileDesc: "You showcase your student life on Instagram/TikTok and act as an ambassador.",
    interested: "Interested? Contact us:",
    channels: {
      instagram: "Official news, campus updates, and stories for all students.",
      instagramCareer: "Career tips, job fairs, and success stories.",
      linkedin: "Professional network for students, alumni, and partners.",
      facebook: "Community exchange and discussions about studying.",
      youtube: "Study info, webinars, and insights into campus life.",
      twitter: "Short updates about dual studies.",
      tiktok: "Short videos, life hacks, and entertainment about studying.",
      website: "Central hub for all official information.",
    },
    faculty: {
      unplugged: "Dr. Florian Perst (Academic Lecturer Business & Academic Writing): Insights, tips, and motivation.",
      wissenschaftlich: "Tips & tricks from Prof. Dr. Müller on writing term papers.",
      mathe: "Additional explanation videos and exercises from Prof. Schmidt.",
      tech: "Current trends in IT, curated by Prof. Weber.",
    },
    tags: {
      instagram: "Instagram",
      learning: "Learning Methods",
      course: "Course Support",
      expertise: "Expertise",
    },
  },
};

export default function SocialMedia() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const officialChannels = [
    {
      name: "Instagram (IU Internationale Hochschule)",
      url: "https://www.instagram.com/iu.internationale.hochschule/",
      icon: Instagram,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
      description: t.channels.instagram
    },
    {
      name: "Instagram (IU Career)",
      url: "https://www.instagram.com/iu.career/",
      icon: Instagram,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      description: t.channels.instagramCareer
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/school/iu-internationale-hochschule/",
      icon: Linkedin,
      color: "text-blue-700",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      description: t.channels.linkedin
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/iu.internationale.hochschule",
      icon: Facebook,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      description: t.channels.facebook
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/c/IUInternationaleHochschule",
      icon: Youtube,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      description: t.channels.youtube
    },
    {
      name: "X (Twitter)",
      url: "https://twitter.com/IUdualesstudium",
      icon: ({ className }: { className?: string }) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      ),
      color: "text-slate-900 dark:text-slate-100",
      bgColor: "bg-slate-100 dark:bg-slate-800",
      description: t.channels.twitter
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@iu.hochschule",
      icon: ({ className }: { className?: string }) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ),
      color: "text-slate-900 dark:text-slate-100",
      bgColor: "bg-slate-100 dark:bg-slate-800",
      description: t.channels.tiktok
    },
    {
      name: "IU Website",
      url: "https://www.iu.de/",
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/10",
      description: t.channels.website
    }
  ];

  const facultyChannels = [
    {
      title: "Studium Unplugged",
      url: "https://www.instagram.com/studium_unplugged?igsh=MWlsOWVvZndlbGs3aA==",
      icon: Instagram,
      description: t.faculty.unplugged,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
      tag: t.tags.instagram
    },
    {
      title: language === "de" ? "Wissenschaftliches Arbeiten" : "Academic Writing",
      url: "#",
      icon: BookOpen,
      description: t.faculty.wissenschaftlich,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
      tag: t.tags.learning
    },
    {
      title: language === "de" ? "Mathe-Support Kanal" : "Math Support Channel",
      url: "#",
      icon: Lightbulb,
      description: t.faculty.mathe,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
      tag: t.tags.course
    },
    {
      title: "Tech & Innovation Blog",
      url: "#",
      icon: GraduationCap,
      description: t.faculty.tech,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
      tag: t.tags.expertise
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-foreground">{t.title}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {t.subtitle}
        </p>
      </div>

      {/* Official Channels Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t.officialChannels}</h2>
            <p className="text-muted-foreground text-sm">{t.officialSubtitle}</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {officialChannels.map((channel) => (
            <a
              key={channel.name}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${channel.bgColor} ${channel.color} group-hover:scale-110 transition-transform duration-300`}>
                  <channel.icon className="w-8 h-8" />
                </div>
                <div className="p-2 rounded-full bg-accent/50 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Globe className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {channel.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {channel.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Faculty Channels Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-3xl -z-10 transform scale-[1.02]" />
        <div className="p-6 md:p-8 rounded-3xl border border-blue-100 dark:border-blue-900/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{t.facultyChannels}</h2>
              <p className="text-muted-foreground text-sm">{t.facultySubtitle}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {facultyChannels.map((channel) => (
              <a 
                key={channel.title} 
                href={channel.url}
                target={channel.url.startsWith("http") ? "_blank" : undefined}
                rel={channel.url.startsWith("http") ? "noopener noreferrer" : undefined}
                className="bg-background border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group block"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl ${channel.bgColor} ${channel.color} flex items-center justify-center`}>
                    <channel.icon className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-accent text-xs font-medium text-muted-foreground">
                    {channel.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {channel.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {channel.description}
                </p>
                <div className="flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                  {t.toChannel} <span className="ml-1">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Community Section */}
      <section>
        <div className="py-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-white dark:bg-white/10 rounded-lg shadow-sm dark:shadow-none">
              <Users className="w-6 h-6 text-slate-900 dark:text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.alumniCommunity}</h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm">{t.alumniSubtitle}</p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column: Connect & Discounts */}
            <div className="space-y-6">
              {/* IU Connect */}
              <div className="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-md dark:hover:bg-white/15 transition-all">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
                  <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  {t.iuConnect}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                  {t.iuConnectDesc}
                </p>
                <div className="flex gap-3">
                  <a 
                    href="https://connect.iu.de/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    {t.registerNow}
                  </a>
                  <a 
                    href="https://www.linkedin.com/groups/152020/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077b5] hover:bg-[#006396] text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    {t.linkedinGroup}
                  </a>
                </div>
              </div>

              {/* Discounts */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/50 dark:to-emerald-800/30 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Trophy className="w-5 h-5" />
                  {t.alumniDiscounts}
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white dark:bg-black/20 rounded-xl p-4 border border-emerald-100 dark:border-white/5 shadow-sm dark:shadow-none">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-lg text-slate-900 dark:text-white">{t.masterDiscount}</span>
                      <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 text-xs px-2 py-1 rounded font-mono border border-emerald-200 dark:border-transparent">Koopalumni</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.masterDiscountNote}</p>
                  </div>

                  <div className="bg-white dark:bg-black/20 rounded-xl p-4 border border-emerald-100 dark:border-white/5 shadow-sm dark:shadow-none">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-lg text-slate-900 dark:text-white">{t.trainingDiscount}</span>
                      <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 text-xs px-2 py-1 rounded font-mono border border-emerald-200 dark:border-transparent">ALUMNIUPS10</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.trainingDiscountNote}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Micro Affiliate */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col hover:shadow-md transition-all">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
                  <Presentation className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  {t.brandAmbassador}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {t.ambassadorDesc}
                </p>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg h-fit">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{t.whatAwaits}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.whatAwaitsDesc}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg h-fit">
                    <Globe className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{t.yourProfile}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.yourProfileDesc}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/10">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{t.interested}</p>
                <a 
                  href="mailto:micro-affiliate@iu.org"
                  className="block w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white font-bold rounded-lg transition-colors"
                >
                  micro-affiliate@iu.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
