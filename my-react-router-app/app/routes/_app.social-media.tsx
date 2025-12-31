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
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
      description: t.channels.instagram,
    },
    {
      name: "Instagram (IU Career)",
      url: "https://www.instagram.com/iu.career/",
      icon: Instagram,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
      description: t.channels.instagramCareer,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/school/iu-internationale-hochschule/",
      icon: Linkedin,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
      borderColor: "border-blue-600/20",
      description: t.channels.linkedin,
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/iu.internationale.hochschule",
      icon: Facebook,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      description: t.channels.facebook,
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/c/IUInternationaleHochschule",
      icon: Youtube,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      description: t.channels.youtube,
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
      color: "text-foreground",
      bgColor: "bg-foreground/5",
      borderColor: "border-foreground/10",
      description: t.channels.twitter,
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
      color: "text-foreground",
      bgColor: "bg-foreground/5",
      borderColor: "border-foreground/10",
      description: t.channels.tiktok,
    },
    {
      name: "IU Website",
      url: "https://www.iu.de/",
      icon: Globe,
      color: "text-iu-blue",
      bgColor: "bg-iu-blue/10",
      borderColor: "border-iu-blue/20",
      description: t.channels.website,
    },
  ];

  const facultyChannels = [
    {
      title: "Studium Unplugged",
      url: "https://www.instagram.com/studium_unplugged?igsh=MWlsOWVvZndlbGs3aA==",
      icon: Instagram,
      description: t.faculty.unplugged,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
      tag: t.tags.instagram,
    },
    {
      title:
        language === "de" ? "Wissenschaftliches Arbeiten" : "Academic Writing",
      url: "#",
      icon: BookOpen,
      description: t.faculty.wissenschaftlich,
      color: "text-iu-blue",
      bgColor: "bg-iu-blue/10",
      borderColor: "border-iu-blue/20",
      tag: t.tags.learning,
    },
    {
      title: language === "de" ? "Mathe-Support Kanal" : "Math Support Channel",
      url: "#",
      icon: Lightbulb,
      description: t.faculty.mathe,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      tag: t.tags.course,
    },
  ];

  return (
    <main className="max-w-7xl mx-auto relative z-10 space-y-12">
      {/* Header Section */}
      <div className="animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
            <Users size={28} />
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">
            {t.title}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Official Channels Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue">
            <Globe size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              {t.officialChannels}
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              {t.officialSubtitle}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {officialChannels.map((channel, idx) => (
            <a
              key={channel.name}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-8 rounded-[2.5rem] bg-card/50 backdrop-blur-xl border border-border hover:border-iu-blue/30 transition-all duration-500 flex flex-col"
            >
              <div className="flex items-start justify-between mb-8">
                <div
                  className={`p-4 rounded-2xl border ${channel.borderColor} ${channel.bgColor} ${channel.color} group-hover:scale-110 transition-transform duration-500`}
                >
                  <channel.icon className="w-8 h-8" />
                </div>
                <div className="p-2 rounded-full bg-muted/50 text-muted-foreground group-hover:bg-iu-blue group-hover:text-white transition-all duration-500">
                  <Globe size={16} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3 leading-tight group-hover:text-iu-blue transition-colors">
                {channel.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed flex-1">
                {channel.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Faculty Channels Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <div className="rounded-[3rem] bg-card/30 backdrop-blur-xl p-10 md:p-16 border border-border relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full" />

          <div className="flex items-center gap-4 mb-12 relative z-10">
            <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-500">
              <GraduationCap size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                {t.facultyChannels}
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                {t.facultySubtitle}
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative z-10">
            {facultyChannels.map((channel) => (
              <a
                key={channel.title}
                href={channel.url}
                target={channel.url.startsWith("http") ? "_blank" : undefined}
                rel={
                  channel.url.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="bg-background/50 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 hover:border-violet-500/30 transition-all duration-500 group block"
              >
                <div className="flex justify-between items-start mb-8">
                  <div
                    className={`w-14 h-14 rounded-2xl border ${channel.borderColor} ${channel.bgColor} ${channel.color} flex items-center justify-center`}
                  >
                    <channel.icon size={28} />
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-muted/50 text-[10px] font-black text-muted-foreground uppercase tracking-widest border border-border">
                    {channel.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-violet-500 transition-colors">
                  {channel.title}
                </h3>
                <p className="text-sm text-muted-foreground font-medium mb-8 leading-relaxed">
                  {channel.description}
                </p>
                <div className="flex items-center text-sm font-bold text-violet-500 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                  {t.toChannel} <span className="ml-2">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Community Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
            <Users size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              {t.alumniCommunity}
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              {t.alumniSubtitle}
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Connect & Discounts */}
          <div className="space-y-8">
            {/* IU Connect */}
            <div className="bg-card/50 backdrop-blur-xl border border-border rounded-[2.5rem] p-10 hover:border-blue-500/30 transition-all duration-500 group">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
                <Globe size={24} className="text-blue-500" />
                {t.iuConnect}
              </h3>
              <p className="text-muted-foreground font-medium text-base mb-10 leading-relaxed">
                {t.iuConnectDesc}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://connect.iu.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-blue-600/20"
                >
                  {t.registerNow}
                </a>
                <a
                  href="https://www.linkedin.com/groups/152020/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#0077b5] hover:bg-[#0077b5]/90 text-white rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-[#0077b5]/20"
                >
                  <Linkedin size={20} />
                  {t.linkedinGroup}
                </a>
              </div>
            </div>

            {/* Discounts */}
            <div className="bg-iu-blue/5 border border-iu-blue/20 rounded-[2.5rem] p-10 relative overflow-hidden group">
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-iu-blue/10 blur-[40px] rounded-full" />

              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-iu-blue dark:text-iu-blue relative z-10">
                <Trophy size={24} />
                {t.alumniDiscounts}
              </h3>

              <div className="space-y-4 relative z-10">
                <div className="bg-background/50 backdrop-blur-xl border border-iu-blue/20 rounded-3xl p-6 shadow-xl group-hover:border-iu-blue transition-colors duration-500">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-lg text-foreground">
                      {t.masterDiscount}
                    </span>
                    <span className="bg-iu-blue/10 text-iu-blue dark:text-iu-blue border border-iu-blue/30 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                      Koopalumni
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {t.masterDiscountNote}
                  </p>
                </div>

                <div className="bg-background/50 backdrop-blur-xl border border-iu-blue/20 rounded-3xl p-6 shadow-xl group-hover:border-iu-blue transition-colors duration-500">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-lg text-foreground">
                      {t.trainingDiscount}
                    </span>
                    <span className="bg-iu-blue/10 text-iu-blue dark:text-iu-blue border border-iu-blue/30 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                      ALUMNIUPS10
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {t.trainingDiscountNote}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Micro Affiliate */}
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-[2.5rem] p-10 flex flex-col hover:border-violet-500/30 transition-all duration-500 group">
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-foreground">
                <Presentation size={24} className="text-violet-500" />
                {t.brandAmbassador}
              </h3>
              <p className="text-muted-foreground font-medium text-base leading-relaxed">
                {t.ambassadorDesc}
              </p>
            </div>

            <div className="space-y-10 flex-1">
              <div className="flex gap-6">
                <div className="p-4 rounded-2xl bg-violet-500/10 text-violet-500 h-fit">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-foreground">
                    {t.whatAwaits}
                  </h4>
                  <p className="text-sm text-muted-foreground font-medium mt-2 leading-relaxed">
                    {t.whatAwaitsDesc}
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="p-4 rounded-2xl bg-violet-500/10 text-violet-500 h-fit">
                  <Globe size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-foreground">
                    {t.yourProfile}
                  </h4>
                  <p className="text-sm text-muted-foreground font-medium mt-2 leading-relaxed">
                    {t.yourProfileDesc}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-border">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">
                {t.interested}
              </p>
              <a
                href="mailto:micro-affiliate@iu.org"
                className="block w-full text-center py-5 bg-foreground text-background hover:bg-violet-500 hover:text-white font-bold rounded-2xl transition-all duration-300 uppercase tracking-widest text-sm shadow-xl"
              >
                micro-affiliate@iu.org
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

