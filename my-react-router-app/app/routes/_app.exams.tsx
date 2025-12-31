import { useState, useEffect } from "react";
import { AlertCircle, Download, ExternalLink, RefreshCw, ChevronDown, ChevronUp, X, FileText, FileCheck, GraduationCap, Info } from "lucide-react";
import { Link } from "react-router";
import { handleDownload } from "../lib/download";
import { guidelines, templates, repeatExamsDocument } from "../data/documents";
import { useLanguage } from "~/contexts/LanguageContext";
import { type LoaderFunctionArgs, useLoaderData } from "react-router";
import { prisma } from "~/lib/prisma";
import { TaskKind } from "@prisma/client";

export const loader = async () => {
  try {
    const sabin = await prisma.user.findUnique({
      where: { email: "sabin.elanwar@iu-study.org" },
      select: { id: true },
    });
    const userId = sabin?.id;

    if (!userId) return { exams: [] };

    // Fetch unsubmitted exams/tasks
    const tasks = await prisma.studentTask.findMany({
      where: {
        userId,
        type: { in: ["Online-Klausur", "Klausur"] },
        kind: TaskKind.ABGABE, // Open tasks
      },
      orderBy: { dueDate: "asc" },
    });

    return {
      exams: tasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        dueDate: task.dueDate.toISOString(),
      })),
    };
  } catch {
    return { exams: [] };
  }
};

// ────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS
// ────────────────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  de: {
    title: "Prüfungsguide & Dokumente",
    subtitle:
      "Alles Wichtige zu Prüfungsabläufen, Krankmeldungen und wissenschaftlichem Arbeiten.",
    yourExams: "Deine anstehenden Klausuren",
    preview: "Vorschau",
    download: "Download",
    sickDuringExams: "Krankheit bei Prüfungen?",
    sickDuringExamsDesc: "Melde dich unverzüglich über die Abgaben.",
    extensionRequest: "Verlängerungsantrag (Schriftl. Arbeit)",
    certificate: "Attest (Klausur)",
    toApplicationManagement: "Zu den Abgaben",
    repeatExams: "Wiederholungsprüfungen",
    repeatExamsSubtitle: "Leitfaden für Zweit- und Drittversuche",
    scientificWork: "Wissenschaftliches Arbeiten",
    scientificWorkSubtitle: "Leitfäden, Richtlinien und Vorlagen",
    versionNote: "Wichtiger Hinweis zu Versionen:",
    versionNoteDesc:
      "Bitte beachte, dass es von einigen Leitfäden zwei verschiedene Versionen gibt. Welche Version für Deine schriftliche Arbeit maßgeblich ist, hängt davon ab, in welchem Semester Du den Erstversuch abgelegt hast.",
    basicsGuidelines: "Grundlagen & Richtlinien",
    specialTopics: "Spezielle Themen",
    templates: "Vorlagen",
    openDocument: "Dokument öffnen",
  },
  en: {
    title: "Exam Guide & Documents",
    subtitle:
      "Everything important about exam procedures, sick notes, and academic writing.",
    yourExams: "Your upcoming exams",
    preview: "Preview",
    download: "Download",
    sickDuringExams: "Sick during exams?",
    sickDuringExamsDesc: "Report immediately via the Submissions.",
    extensionRequest: "Extension Request (Written Work)",
    certificate: "Medical Certificate (Exam)",
    toApplicationManagement: "Go to Submissions",
    repeatExams: "Repeat Exams",
    repeatExamsSubtitle: "Guide for second and third attempts",
    scientificWork: "Academic Writing",
    scientificWorkSubtitle: "Guidelines, policies, and templates",
    versionNote: "Important note about versions:",
    versionNoteDesc:
      "Please note that some guidelines have two different versions. Which version applies to your written work depends on which semester you made the first attempt.",
    basicsGuidelines: "Basics & Guidelines",
    specialTopics: "Special Topics",
    templates: "Templates",
    openDocument: "Open Document",
  },
};

export default function ExamsPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const { exams } = useLoaderData<typeof loader>();
  const [isRepeatExamsOpen, setIsRepeatExamsOpen] = useState(true);
  const [isScientificWorkOpen, setIsScientificWorkOpen] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const coreGuidelines = guidelines.slice(0, 3);
  const topicGuidelines = guidelines.slice(3);

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                  <FileText size={28} />
                </div>
                <h1 className="text-4xl font-black text-foreground tracking-tight">
                  {t.title}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {t.subtitle}
              </p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-iu-blue/20 bg-iu-blue/10 text-iu-blue text-sm font-bold w-fit">
                <Info size={16} />
                <span>EXAM CENTER</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Exams List from DB */}
        {exams && exams.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-iu-blue rounded-full shadow-[0_0_10px_rgba(36,94,235,0.5)]" />
              <h2 className="text-3xl font-bold text-foreground tracking-tight">
                {t.yourExams}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam: any) => (
                <div
                  key={exam.id}
                  className="group p-8 bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] shadow-2xl hover:border-iu-blue/30 hover:bg-card transition-all duration-500 relative overflow-hidden"
                >
                  {/* Hover background effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-iu-blue/5 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -mr-16 -mt-16"></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className="p-4 rounded-2xl bg-iu-blue/10 text-iu-blue border border-iu-blue/20 shadow-lg group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-8 h-8" />
                      </div>
                      <span className="px-4 py-2 rounded-xl bg-iu-blue/10 border border-iu-blue/20 text-iu-blue text-[10px] font-black uppercase tracking-widest shadow-sm">
                        {new Date(exam.dueDate).toLocaleDateString(
                          language === "de" ? "de-DE" : "en-US"
                        )}
                      </span>
                    </div>
                    <h3 className="font-bold text-2xl mb-3 text-foreground tracking-tight group-hover:text-iu-blue transition-colors">
                      {exam.title}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">
                      {language === "de" ? "Klausur" : "Exam"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sick Note Section */}
        <section className="bg-gradient-to-br from-iu-blue/20 to-transparent border border-iu-blue/30 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl backdrop-blur-xl group hover:border-iu-blue transition-all duration-500 bg-card/40">
          <div className="absolute -top-12 -right-12 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertCircle className="w-64 h-64 text-iu-blue" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-iu-blue/20 rounded-2xl">
                  <AlertCircle className="w-8 h-8 text-iu-blue" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  {t.sickDuringExams}
                </h2>
              </div>
              <p className="text-muted-foreground text-lg max-w-xl font-medium leading-relaxed">
                {t.sickDuringExamsDesc}
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="flex items-center gap-2 bg-muted/50 px-5 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground uppercase tracking-widest hover:border-iu-blue/30 transition-colors">
                  <FileCheck className="w-4 h-4 text-iu-blue" />{" "}
                  {t.extensionRequest}
                </span>
                <span className="flex items-center gap-2 bg-muted/50 px-5 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground uppercase tracking-widest hover:border-iu-blue/30 transition-colors">
                  <FileCheck className="w-4 h-4 text-iu-blue" /> {t.certificate}
                </span>
              </div>
            </div>

            <Link
              to="/antragsverwaltung"
              className="shrink-0 inline-flex items-center gap-3 px-10 py-5 bg-foreground text-background rounded-2xl text-lg font-bold shadow-xl transition-all active:scale-95 group-hover:-translate-y-1 hover:opacity-90"
            >
              {t.toApplicationManagement}
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Repeat Exams Section */}
        <section className="bg-card/50 border border-border rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl transition-all hover:bg-card/80">
          <button
            onClick={() => setIsRepeatExamsOpen(!isRepeatExamsOpen)}
            className="w-full flex items-center justify-between p-8 hover:bg-muted/30 transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-6 pointer-events-none">
              <div className="p-4 bg-iu-blue/20 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <RefreshCw className="w-8 h-8 text-iu-blue" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {t.repeatExams}
                </h2>
                <p className="text-muted-foreground text-base font-medium opacity-70">
                  {t.repeatExamsSubtitle}
                </p>
              </div>
            </div>
            <div>
              {isRepeatExamsOpen ? (
                <ChevronUp className="w-8 h-8 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
          </button>

          {isRepeatExamsOpen && (
            <div className="p-8 border-t border-border bg-muted/10">
              <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-3xl">
                <div className="bg-muted/50 p-6 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-10 backdrop-blur-md">
                  <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                    <FileText className="w-6 h-6 text-iu-blue" />
                    Leitfaden_Wiederholungspruefungen.pdf
                  </div>
                  <button
                    onClick={() =>
                      handleDownload(
                        "Leitfaden_Wiederholungspruefungen",
                        "PDF",
                        repeatExamsDocument
                      )
                    }
                    className="flex items-center gap-2 text-xs font-black bg-foreground text-background px-6 py-3 rounded-xl hover:opacity-90 transition-all uppercase tracking-widest shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    {t.download}
                  </button>
                </div>

                <div className="p-10 max-h-[700px] overflow-y-auto bg-card text-muted-foreground space-y-12 scrollbar-thin scrollbar-thumb-border">
                  <div className="border-b border-border pb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight leading-tight">
                      Leitfaden zum Ablauf von Wiederholungsprüfungen
                    </h1>
                    <div className="flex justify-between text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.2em]">
                      <span>ZPA DS</span>
                      <span>Stand: 01.04.2025</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-4">
                      <span className="bg-iu-blue/10 text-iu-blue w-10 h-10 flex items-center justify-center rounded-xl text-lg font-bold border border-iu-blue/20">
                        1
                      </span>{" "}
                      Allgemeines
                    </h3>
                    <p className="text-lg leading-relaxed font-medium">
                      In diesem Leitfaden findest Du alle wichtigen
                      Informationen zum Ablauf Deiner Wiederholungsprüfung für
                      Klausuren, mündliche Prüfungsleistungen, schriftliche
                      Arbeiten sowie Portfolios und Creative Workbooks. Genaue
                      Informationen zu einzelnen Prüfungsformen findest du in
                      den jeweiligen Prüfungsleitfäden in myCampus.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-4">
                      <span className="bg-iu-blue/10 text-iu-blue w-10 h-10 flex items-center justify-center rounded-xl text-lg font-bold border border-iu-blue/20">
                        2
                      </span>{" "}
                      Klausur
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8 pl-2">
                      <div className="bg-muted/20 p-8 rounded-[2rem] border border-border shadow-inner">
                        <h4 className="font-bold text-lg mb-4 text-foreground">
                          Termin
                        </h4>
                        <p className="text-base leading-relaxed font-medium">
                          Klausuren können nur in den vorgegebenen{" "}
                          <strong className="text-foreground">
                            Resit-Phasen (Juni/Dezember)
                          </strong>{" "}
                          wiederholt werden.
                          <br />
                          <br />
                          <em className="text-iu-blue not-italic font-bold">
                            Ausnahme ab 7. Semester:
                          </em>{" "}
                          Wiederholung auch in regulären Phasen (Februar/August)
                          möglich.
                        </p>
                      </div>
                      <div className="bg-muted/20 p-8 rounded-[2rem] border border-border shadow-inner">
                        <h4 className="font-bold text-lg mb-4 text-foreground">
                          Durchführung & Krankheit
                        </h4>
                        <p className="text-base leading-relaxed font-medium">
                          Klausurenphasen können nicht übersprungen werden.
                          Nichtantritt führt automatisch zum Fehlversuch, außer
                          es liegt eine genehmigte Prüfungsunfähigkeit vor
                          (Antrag binnen 3 Werktagen).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-4">
                      <span className="bg-iu-blue/10 text-iu-blue w-10 h-10 flex items-center justify-center rounded-xl text-lg font-bold border border-iu-blue/20">
                        3
                      </span>{" "}
                      Mündliche Prüfungsleistungen
                    </h3>
                    <div className="space-y-6 pl-2">
                      <div className="border-l-4 border-iu-blue/40 pl-8 py-2 bg-iu-blue/5 rounded-r-[2rem] p-6 shadow-sm">
                        <h4 className="text-xl font-black text-iu-blue dark:text-iu-blue mb-2 uppercase tracking-tight">
                          Nach genehmigter Prüfungsunfähigkeit
                        </h4>
                        <ul className="mt-4 space-y-4 text-base font-medium">
                          <li className="flex items-start gap-3">
                            <span className="text-iu-blue mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current" />{" "}
                            <span>
                              <strong className="text-foreground font-black uppercase text-xs tracking-widest">
                                Termin:
                              </strong>{" "}
                              Individueller Nachholtermin bis Ende der nächsten
                              RESIT-Phase.
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-iu-blue mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current" />{" "}
                            <span>
                              <strong className="text-foreground font-black uppercase text-xs tracking-widest">
                                Thema:
                              </strong>{" "}
                              Gleiches Thema wie im Erstversuch (außer bei
                              mündl. Prüfung: neue Fragen).
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-iu-blue mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current" />{" "}
                            <span>
                              <strong className="text-foreground font-black uppercase text-xs tracking-widest">
                                Status:
                              </strong>{" "}
                              Kein Fehlversuch.
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="border-l-4 border-iu-orange/40 pl-8 py-2 bg-iu-orange/5 rounded-r-[2rem] p-6 shadow-sm">
                        <h4 className="text-xl font-bold text-iu-orange mb-2">
                          Nach unentschuldigtem Fehlen
                        </h4>
                        <ul className="mt-4 space-y-4 text-base font-medium">
                          <li className="flex items-start gap-3">
                            <span className="text-iu-orange mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current" />{" "}
                            <span>
                              <strong className="text-foreground">
                                Termin:
                              </strong>{" "}
                              Neuer Termin im Folgesemester.
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-iu-orange mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current" />{" "}
                            <span>
                              <strong className="text-foreground">
                                Thema:
                              </strong>{" "}
                              Neues Thema muss erfragt werden (4 Wochen vor
                              Termin).
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-iu-orange mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current" />{" "}
                            <span>
                              <strong className="text-foreground">
                                Status:
                              </strong>{" "}
                              Fehlversuch wird angerechnet.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Scientific Work Section */}
        <section className="bg-card/50 border border-border rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl transition-all hover:bg-card/80">
          <button
            onClick={() => setIsScientificWorkOpen(!isScientificWorkOpen)}
            className="w-full flex items-center justify-between p-8 hover:bg-muted/30 transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-6 pointer-events-none">
              <div className="p-4 bg-primary/20 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {t.scientificWork}
                </h2>
                <p className="text-muted-foreground text-base font-medium opacity-70">
                  {t.scientificWorkSubtitle}
                </p>
              </div>
            </div>
            <div>
              {isScientificWorkOpen ? (
                <ChevronUp className="w-8 h-8 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
          </button>

          {isScientificWorkOpen && (
            <div className="p-8 border-t border-border bg-muted/10 space-y-10">
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-base text-foreground leading-relaxed shadow-inner">
                <p className="font-bold mb-3 flex items-center gap-3 text-primary text-lg">
                  <Info className="w-6 h-6" />
                  {t.versionNote}
                </p>
                <p className="font-medium opacity-90">{t.versionNoteDesc}</p>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] px-1">
                  {t.basicsGuidelines}
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {coreGuidelines.map((item: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDocument(item)}
                      className="flex flex-col items-start gap-4 p-8 bg-card/60 border border-border rounded-[2.5rem] hover:border-primary/50 hover:bg-card transition-all cursor-pointer group text-left shadow-lg hover:-translate-y-1 duration-300"
                    >
                      <div
                        className={`p-4 rounded-2xl ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform shadow-xl`}
                      >
                        <item.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="text-sm text-muted-foreground mt-2 font-medium leading-relaxed opacity-70">
                            {item.subtitle}
                          </p>
                        )}
                        <div className="mt-6 flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
                          <FileText className="w-4 h-4 text-primary" />
                          <span>{t.openDocument}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] px-1">
                  {t.specialTopics}
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {topicGuidelines.map((item: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDocument(item)}
                      className="flex items-center gap-4 p-5 bg-card/50 border border-border rounded-2xl hover:border-primary/40 hover:bg-card transition-all cursor-pointer group text-left shadow-sm hover:-translate-y-0.5"
                    >
                      <div
                        className={`p-3 rounded-xl ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform shadow-md`}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm truncate">
                          {item.title}
                        </h3>
                      </div>
                      <FileText className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] px-1">
                  {t.templates}
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {templates.map((item: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDocument(item)}
                      className="flex items-center gap-4 p-5 bg-card/50 border border-border rounded-2xl hover:border-primary/40 hover:bg-card transition-all cursor-pointer group text-left shadow-sm hover:-translate-y-0.5"
                    >
                      <div className="p-3 bg-muted/50 rounded-xl text-muted-foreground group-hover:text-primary group-hover:bg-primary/20 transition-all border border-border/50">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm truncate">
                          {item.title}
                        </h3>
                      </div>
                      <span className="text-[10px] font-black bg-muted text-muted-foreground px-2 py-1 rounded border border-border uppercase tracking-widest">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Document Preview Modal */}
        {selectedDocument && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-card w-full max-w-5xl h-[90vh] rounded-[2.5rem] border border-border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between p-8 border-b border-border bg-background/40">
                <div className="flex items-center gap-6">
                  <div
                    className={`p-4 rounded-2xl ${selectedDocument.bgColor || "bg-muted"} ${selectedDocument.color || "text-foreground"} shadow-xl transition-transform hover:scale-110`}
                  >
                    {selectedDocument.icon ? (
                      <selectedDocument.icon className="w-8 h-8" />
                    ) : (
                      <FileText className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground line-clamp-1 tracking-tight">
                      {selectedDocument.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1 rounded-lg border border-border">
                        {selectedDocument.type}
                      </span>
                      <span className="text-xs text-muted-foreground font-bold opacity-60 uppercase tracking-widest">
                        {t.preview}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      handleDownload(
                        selectedDocument.title,
                        selectedDocument.type,
                        selectedDocument
                      )
                    }
                    className="hidden md:flex items-center gap-3 px-8 py-4 text-sm font-bold bg-foreground text-background rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-xl"
                  >
                    <Download className="w-5 h-5" />
                    {t.download}
                  </button>
                  <button
                    onClick={() => setSelectedDocument(null)}
                    className="p-4 hover:bg-muted rounded-2xl transition-all text-muted-foreground hover:text-iu-red shadow-lg border border-border"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-12 bg-background/20 scrollbar-thin scrollbar-thumb-border">
                <div className="max-w-3xl mx-auto bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-12 md:p-20 shadow-2xl text-foreground leading-relaxed whitespace-pre-wrap text-lg font-medium">
                  {selectedDocument.content}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
