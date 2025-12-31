import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "~/contexts/LanguageContext";

import {
  FileText,
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  Wrench,
} from "lucide-react";

export const loader = async () => null;

// Translations
const TRANSLATIONS = {
  de: {
    title: "Studienorganisation",
    subtitle: "Verwalten Sie Ihre Studienangelegenheiten online",
    applicationManagement: "Antragsverwaltung",
    applicationManagementDesc:
      "Verwalten Sie Ihre Anträge und Formulare online",
    gradeManagement: "Notenverwaltung",
    gradeManagementDesc: "Ihre Prüfungsergebnisse und Notenübersicht",
    specializationSelection: "Vertiefungswahl",
    specializationSelectionDesc: "Wählen Sie Ihre Vertiefungsrichtung",
    examRegistration: "Klausuranmeldung",
    examRegistrationDesc: "Melden Sie sich zu Prüfungen an",
  },
  en: {
    title: "Study Organization",
    subtitle: "Manage your academic affairs online",
    applicationManagement: "Application Management",
    applicationManagementDesc: "Manage your applications and forms online",
    gradeManagement: "Grade Management",
    gradeManagementDesc: "Your exam results and grade overview",
    specializationSelection: "Specialization Selection",
    specializationSelectionDesc: "Choose your specialization",
    examRegistration: "Additional Courses",
    examRegistrationDesc: "Apply for additional courses",
  },
};

export default function StudyOrganization() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const cards = [
    {
      to: "/antragsverwaltung",
      title: t.applicationManagement,
      desc: t.applicationManagementDesc,
      icon: FileText,
      color: "emerald",
      gradient: "from-iu-blue/20 to-teal-500/20",
      iconBg: "bg-iu-blue/10",
      iconColor: "text-iu-blue",
      hoverBorder: "hover:border-iu-blue/50",
      glow: "group-hover:bg-iu-blue/10",
    },
    {
      to: "/notenverwaltung",
      title: t.gradeManagement,
      desc: t.gradeManagementDesc,
      icon: Award,
      color: "blue",
      gradient: "from-blue-500/20 to-indigo-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      hoverBorder: "hover:border-blue-500/50",
      glow: "group-hover:bg-blue-500/10",
    },
    {
      to: "/vertiefungswahl",
      title: t.specializationSelection,
      desc: t.specializationSelectionDesc,
      icon: BookOpen,
      color: "violet",
      gradient: "from-violet-500/20 to-purple-500/20",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-500",
      hoverBorder: "hover:border-violet-500/50",
      glow: "group-hover:bg-violet-500/10",
    },
    {
      to: "/klausuranmeldung",
      title: t.examRegistration,
      desc: t.examRegistrationDesc,
      icon: Calendar,
      color: "amber",
      gradient: "from-amber-500/20 to-orange-500/20",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      hoverBorder: "hover:border-amber-500/50",
      glow: "group-hover:bg-amber-500/10",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                  <Wrench size={28} />
                </div>
                <h1 className="text-4xl font-black text-foreground tracking-tight">
                  {t.title}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {t.subtitle}
              </p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-iu-blue/20 bg-iu-blue/10 text-iu-blue dark:text-iu-blue text-sm font-bold w-fit">
                <Wrench size={16} />
                <span>
                  {language === "de" ? "Studierenden-Portal" : "Student Portal"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, index) => (
            <Link
              key={card.to}
              to={card.to}
              className={`group relative overflow-hidden rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl p-10 transition-all duration-500 hover:-translate-y-2 ${card.hoverBorder} animate-in fade-in slide-in-from-bottom-8 duration-700`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Gradient Glow */}
              <div
                className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-all duration-500 ${card.glow}`}
              />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-10">
                  <div
                    className={`p-5 ${card.iconBg} rounded-3xl transition-all duration-500 group-hover:scale-110`}
                  >
                    <card.icon className={`w-10 h-10 ${card.iconColor}`} />
                  </div>
                  <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-500">
                    <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-background transition-colors" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-foreground mb-4 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-lg text-muted-foreground font-medium leading-relaxed group-hover:text-foreground transition-colors">
                    {card.desc}
                  </p>
                </div>

                {/* Bottom Decorative Bar */}
                <div
                  className={`mt-10 h-1.5 w-20 rounded-full bg-gradient-to-r ${card.gradient} opacity-50 group-hover:w-full group-hover:opacity-100 transition-all duration-700`}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Links / Info Section */}
        <div className="mt-20 p-10 rounded-[3rem] bg-iu-blue/5 border border-iu-blue/10 animate-in fade-in duration-1000">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-foreground">
                {language === "de" ? "Hilfe & Support" : "Help & Support"}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {language === "de"
                  ? "Haben Sie Fragen zu Ihren Anträgen oder Noten? Unser Support-Team hilft Ihnen gerne weiter."
                  : "Do you have questions about your applications or grades? Our support team is happy to help."}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-iu-blue font-bold text-sm hover:underline"
              >
                {language === "de" ? "Zum Support" : "Go to Support"}
                <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-foreground">
                {language === "de" ? "Fristen & Termine" : "Deadlines & Dates"}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {language === "de"
                  ? "Verpassen Sie keine wichtigen Termine für die Klausuranmeldung oder Rückmeldung."
                  : "Don't miss any important deadlines for exam registration or re-registration."}
              </p>
              <Link
                to="/courses/schedule"
                className="inline-flex items-center gap-2 text-blue-500 font-bold text-sm hover:underline"
              >
                {language === "de" ? "Kalender öffnen" : "Open Calendar"}
                <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-foreground">
                {language === "de" ? "Dokumente" : "Documents"}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {language === "de"
                  ? "Laden Sie Ihre Immatrikulationsbescheinigung oder Ihren Notenspiegel direkt herunter."
                  : "Download your certificate of enrollment or transcript of records directly."}
              </p>
              <Link
                to="/certificates/immatriculation"
                className="inline-flex items-center gap-2 text-violet-500 font-bold text-sm hover:underline"
              >
                {language === "de"
                  ? "Zu den Zertifikaten"
                  : "Go to Certificates"}
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>
  );
}


