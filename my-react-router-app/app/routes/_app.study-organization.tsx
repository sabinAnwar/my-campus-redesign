import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "~/contexts/LanguageContext";

import {
  FileText,
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
} from "lucide-react";

export const loader = async () => null;

// Translations
const TRANSLATIONS = {
  de: {
    title: "Studienorganisation",
    subtitle: "Verwalten Sie Ihre Studienangelegenheiten online",
    applicationManagement: "Antragsverwaltung",
    applicationManagementDesc: "Verwalten Sie Ihre Anträge und Formulare online",
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

  return (

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-black dark:text-white mb-3">
            {t.title}
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            {t.subtitle}
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
          {/* Antragsverwaltung */}
          <Link
            to="/antragsverwaltung"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 min-h-[200px]"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <ChevronRight className="w-6 h-6 text-white/80 group-hover:translate-x-2 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t.applicationManagement}
              </h3>
              <p className="text-base text-white/95 leading-relaxed">
                {t.applicationManagementDesc}
              </p>
            </div>
          </Link>

          {/* Notenverwaltung */}
          <Link
            to="/notenverwaltung"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 min-h-[200px]"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <ChevronRight className="w-6 h-6 text-white/80 group-hover:translate-x-2 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t.gradeManagement}
              </h3>
              <p className="text-base text-white/95 leading-relaxed">
                {t.gradeManagementDesc}
              </p>
            </div>
          </Link>

          {/* Vertiefungswahl */}
          <Link
            to="/vertiefungswahl"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 min-h-[200px]"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <ChevronRight className="w-6 h-6 text-white/80 group-hover:translate-x-2 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t.specializationSelection}
              </h3>
              <p className="text-base text-white/95 leading-relaxed">
                {t.specializationSelectionDesc}
              </p>
            </div>
          </Link>

          {/* Klausuranmeldung */}
          <Link
            to="/klausuranmeldung"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 min-h-[200px]"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <ChevronRight className="w-6 h-6 text-white/80 group-hover:translate-x-2 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t.examRegistration}
              </h3>
              <p className="text-base text-white/95 leading-relaxed">
                {t.examRegistrationDesc}
              </p>
            </div>
          </Link>
        </div>
      </main>

  );
}
