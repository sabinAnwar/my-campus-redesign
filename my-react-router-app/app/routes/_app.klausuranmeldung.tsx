import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "~/contexts/LanguageContext";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  X,
  Info,
  BookOpen,
  Building2,
  Briefcase,
  Users,
  Heart,
  Plane,
  Globe,
  Laptop,
  Palette,
  TrendingUp,
  Home,
  Check,
  PlusCircle,
  Sparkles,
  BookMarked,
  ArrowRight,
  ExternalLink,
  Award,
  Clock,
  AlertCircle,
} from "lucide-react";

export const loader = async () => null;

import {
  TRANSLATIONS,
  STUDENT_DATA,
  ZUSATZKURSE_CATEGORIES,
} from "~/constants/exam-registration";

import type {
  ExamCourseItem as CourseItem,
  ExamCategoryCourse as CategoryCourse,
} from "~/types/exam-registration";



export default function Klausuranmeldung() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["it"])
  );
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(
    new Set()
  );

  // Filter courses based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return ZUSATZKURSE_CATEGORIES;

    const query = searchQuery.toLowerCase();
    return ZUSATZKURSE_CATEGORIES.map((cat) => ({
      ...cat,
      courses: cat.courses.filter((course) =>
        course.name.toLowerCase().includes(query)
      ),
    })).filter((cat) => cat.courses.length > 0);
  }, [searchQuery]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const toggleCourse = (courseId: string) => {
    setSelectedCourses((prev) => {
      if (prev.has(courseId)) {
        return new Set();
      } else {
        return new Set([courseId]);
      }
    });
  };

  const selectedCourseDetails = useMemo(() => {
    const details: {
      id: string;
      name: string;
      credits: number;
      type: string;
      status?: string;
      grade?: string;
    }[] = [];
    ZUSATZKURSE_CATEGORIES.forEach((cat) => {
      cat.courses.forEach((course) => {
        if (selectedCourses.has(course.id)) {
          details.push(course);
        }
      });
    });
    return details;
  }, [selectedCourses]);

  const handleGoToAbgaben = () => {
    const coursesData = selectedCourseDetails.map((c) => ({
      id: c.id,
      name: c.name,
      credits: c.credits,
    }));
    localStorage.setItem(
      "selectedWeiterbildungskurse",
      JSON.stringify(coursesData)
    );
    navigate("/antragsverwaltung");
  };

  return (
    <main className="max-w-7xl mx-auto relative z-10">
      {/* Header Section */}
      <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <Link
          to="/study-organization"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-iu-blue font-bold transition-colors mb-8 group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>{t.back}</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue dark:text-iu-blue shadow-sm">
                <Sparkles size={28} />
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight">
                {t.title}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-[2rem] bg-card/50 backdrop-blur-xl border border-border focus:border-iu-blue/50 focus:ring-4 focus:ring-iu-blue/10 transition-all outline-none font-medium"
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column: Course Catalog */}
        <div className="lg:col-span-2 space-y-12">
          {/* How it works */}
          <div className="rounded-[2.5rem] border border-border bg-card/30 backdrop-blur-xl p-8">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Info size={20} className="text-iu-blue" />
              {t.howItWorks}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  text: t.step1,
                  icon: BookOpen,
                  color: "emerald",
                },
                {
                  step: "02",
                  text: t.step2,
                  icon: ArrowRight,
                  color: "blue",
                },
                {
                  step: "03",
                  text: t.step3,
                  icon: CheckCircle2,
                  color: "violet",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative p-6 rounded-3xl bg-background/50 border border-border/50"
                >
                  <div className="text-4xl font-black text-foreground/5 absolute top-4 right-4">
                    {item.step}
                  </div>
                  <item.icon
                    size={24}
                    className={`text-${item.color}-500 mb-4`}
                  />
                  <p className="text-sm font-bold text-foreground leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Categories & Courses */}
          <div className="space-y-8">
            {filteredCategories.map((category, catIdx) => (
              <div
                key={category.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${catIdx * 100}ms` }}
              >
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between mb-6 group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-2xl bg-iu-blue/10 text-iu-blue group-hover:scale-110 transition-transform`}
                    >
                      <category.icon size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-bold text-foreground">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`p-2 rounded-full bg-muted/50 text-muted-foreground transition-transform duration-300 ${expandedCategories.has(category.id) ? "rotate-180" : ""}`}
                  >
                    <ChevronDown size={20} />
                  </div>
                </button>

                {expandedCategories.has(category.id) && (
                  <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-300">
                    {category.courses.map((course) => {
                      const isSelected = selectedCourses.has(course.id);
                      const isPassed = course.status === "passed";
                      return (
                        <button
                          key={course.id}
                          disabled={isPassed}
                          onClick={() => toggleCourse(course.id)}
                          className={`group text-left p-6 rounded-[2rem] border transition-all duration-300 ${
                            isSelected
                              ? "bg-iu-blue border-iu-blue shadow-lg shadow-iu-blue/20"
                              : isPassed
                                ? "bg-muted/30 border-border opacity-60 cursor-not-allowed"
                                : "bg-card/50 backdrop-blur-xl border-border hover:border-iu-blue/30"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div
                              className={`p-2 rounded-xl ${isSelected ? "bg-white/20" : "bg-iu-blue/10"}`}
                            >
                              <BookMarked
                                size={18}
                                className={
                                  isSelected ? "text-white" : "text-iu-blue"
                                }
                              />
                            </div>
                            {isPassed && (
                              <span className="px-3 py-1 rounded-full bg-iu-blue/20 text-iu-blue text-[10px] font-black uppercase tracking-widest border border-iu-blue/20">
                                {language === "de"
                                  ? "Abgeschlossen"
                                  : "Completed"}
                              </span>
                            )}
                          </div>
                          <h4
                            className={`font-bold mb-2 leading-tight ${isSelected ? "text-white" : "text-foreground"}`}
                          >
                            {course.name}
                          </h4>
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-xs font-bold ${isSelected ? "text-white/70" : "text-muted-foreground"}`}
                            >
                              {course.credits} ECTS
                            </span>
                            <span
                              className={`w-1 h-1 rounded-full ${isSelected ? "bg-white/30" : "bg-border"}`}
                            />
                            <span
                              className={`text-xs font-bold ${isSelected ? "text-white/70" : "text-muted-foreground"}`}
                            >
                              {course.type}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selection Summary */}
        <div className="space-y-8">
          <div className="sticky top-32 space-y-8">
            {/* Student Info Card */}
            <div className="rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-iu-blue/10 flex items-center justify-center text-iu-blue">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">
                    {STUDENT_DATA.vorname} {STUDENT_DATA.nachname}
                  </h4>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {STUDENT_DATA.matrikelnummer}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-iu-blue dark:text-iu-blue">
                  {STUDENT_DATA.studiengang}
                </p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {STUDENT_DATA.semester}. {t.semester}
                </p>
              </div>
            </div>

            {/* Selection Card */}
            <div className="rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl p-8 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-iu-blue/10 blur-[50px] rounded-full -translate-y-16 translate-x-16" />

              <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2 relative z-10">
                <Award size={20} className="text-iu-blue" />
                {t.summary}
              </h3>

              {selectedCourseDetails.length > 0 ? (
                <div className="space-y-8 relative z-10">
                  {selectedCourseDetails.map((course) => (
                    <div
                      key={course.id}
                      className="p-6 rounded-3xl bg-iu-blue/5 border border-iu-blue/10"
                    >
                      <p className="text-[10px] font-black text-iu-blue uppercase tracking-widest mb-2">
                        {t.selectedCourse}
                      </p>
                      <h4 className="text-lg font-bold text-foreground mb-4">
                        {course.name}
                      </h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
                          <Clock size={14} />
                          <span>{course.credits} ECTS</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
                          <GraduationCap size={14} />
                          <span>{course.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-muted-foreground">
                        {t.firstName}
                      </span>
                      <span className="text-foreground">
                        {STUDENT_DATA.vorname}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-muted-foreground">
                        {t.lastName}
                      </span>
                      <span className="text-foreground">
                        {STUDENT_DATA.nachname}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-muted-foreground">
                        {t.matriculation}
                      </span>
                      <span className="text-foreground">
                        {STUDENT_DATA.matrikelnummer}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleGoToAbgaben}
                    className="w-full py-4 rounded-2xl bg-iu-blue text-white font-bold hover:bg-iu-blue transition-all shadow-lg shadow-iu-blue/20 flex items-center justify-center gap-2 group"
                  >
                    <span>{t.goToApplication}</span>
                    <ExternalLink
                      size={18}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 space-y-4 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <PlusCircle
                      size={32}
                      className="text-muted-foreground/30"
                    />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    {t.selectCourseHint}
                  </p>
                </div>
              )}
            </div>

            {/* Important Note */}
            <div className="rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 p-8">
              <div className="flex items-center gap-3 mb-4 text-amber-500">
                <AlertCircle size={20} />
                <h4 className="font-bold">{t.importantNote}</h4>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-400/80 font-medium leading-relaxed">
                {t.noteText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
