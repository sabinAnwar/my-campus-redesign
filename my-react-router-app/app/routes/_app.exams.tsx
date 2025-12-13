import { useState, useEffect } from "react";
import { AlertCircle, Download, ExternalLink, RefreshCw, ChevronDown, ChevronUp, X, FileText, FileCheck, GraduationCap, Info } from "lucide-react";
import { Link } from "react-router";
import { handleDownload } from "../lib/download";
import { guidelines, templates, repeatExamsDocument } from "../data/documents";
import { useLanguage } from "~/contexts/LanguageContext";

// ────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS
// ────────────────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  de: {
    title: "Prüfungsguide & Dokumente",
    subtitle: "Alles Wichtige zu Prüfungsabläufen, Krankmeldungen und wissenschaftlichem Arbeiten.",
    preview: "Vorschau",
    download: "Download",
    sickDuringExams: "Krankheit bei Prüfungen?",
    sickDuringExamsDesc: "Melde dich unverzüglich über die Antragsverwaltung.",
    extensionRequest: "Verlängerungsantrag (Schriftl. Arbeit)",
    certificate: "Attest (Klausur)",
    toApplicationManagement: "Zur Antragsverwaltung",
    repeatExams: "Wiederholungsprüfungen",
    repeatExamsSubtitle: "Leitfaden für Zweit- und Drittversuche",
    scientificWork: "Wissenschaftliches Arbeiten",
    scientificWorkSubtitle: "Leitfäden, Richtlinien und Vorlagen",
    versionNote: "Wichtiger Hinweis zu Versionen:",
    versionNoteDesc: "Bitte beachte, dass es von einigen Leitfäden zwei verschiedene Versionen gibt. Welche Version für Deine schriftliche Arbeit maßgeblich ist, hängt davon ab, in welchem Semester Du den Erstversuch abgelegt hast.",
    basicsGuidelines: "Grundlagen & Richtlinien",
    specialTopics: "Spezielle Themen",
    templates: "Vorlagen",
    openDocument: "Dokument öffnen",
  },
  en: {
    title: "Exam Guide & Documents",
    subtitle: "Everything important about exam procedures, sick notes, and academic writing.",
    preview: "Preview",
    download: "Download",
    sickDuringExams: "Sick during exams?",
    sickDuringExamsDesc: "Report immediately via the application management.",
    extensionRequest: "Extension Request (Written Work)",
    certificate: "Medical Certificate (Exam)",
    toApplicationManagement: "Go to Application Management",
    repeatExams: "Repeat Exams",
    repeatExamsSubtitle: "Guide for second and third attempts",
    scientificWork: "Academic Writing",
    scientificWorkSubtitle: "Guidelines, policies, and templates",
    versionNote: "Important note about versions:",
    versionNoteDesc: "Please note that some guidelines have two different versions. Which version applies to your written work depends on which semester you made the first attempt.",
    basicsGuidelines: "Basics & Guidelines",
    specialTopics: "Special Topics",
    templates: "Templates",
    openDocument: "Open Document",
  },
};

export default function ExamsPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  
  const [isRepeatExamsOpen, setIsRepeatExamsOpen] = useState(true);
  const [isScientificWorkOpen, setIsScientificWorkOpen] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  // Use useEffect to attach event listeners after mount to avoid hydration issues
  useEffect(() => {
    const repeatBtn = document.getElementById('repeat-exams-btn');
    const scientificBtn = document.getElementById('scientific-work-btn');

    const handleRepeatClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Repeat exams clicked");
      setIsRepeatExamsOpen(prev => !prev);
    };

    const handleScientificClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Scientific work clicked");
      setIsScientificWorkOpen(prev => !prev);
    };

    if (repeatBtn) {
      repeatBtn.addEventListener('click', handleRepeatClick);
    }
    if (scientificBtn) {
      scientificBtn.addEventListener('click', handleScientificClick);
    }

    return () => {
      if (repeatBtn) {
        repeatBtn.removeEventListener('click', handleRepeatClick);
      }
      if (scientificBtn) {
        scientificBtn.removeEventListener('click', handleScientificClick);
      }
    };
  }, []);





  const coreGuidelines = guidelines.slice(0, 3);
  const topicGuidelines = guidelines.slice(3);





  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8">
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedDocument.bgColor} ${selectedDocument.color}`}>
                  <selectedDocument.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base line-clamp-1">
                    {selectedDocument.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Vorschau</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDownload(selectedDocument.title, selectedDocument.type, selectedDocument)}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors text-slate-700 dark:text-slate-200"
                >
                  <Download className="w-3 h-3" />
                  Download
                </button>
                <button 
                  onClick={() => setSelectedDocument(null)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-950/50">
              <div className="max-w-3xl mx-auto bg-white dark:bg-slate-950 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl p-8 md:p-12 min-h-full">
                {selectedDocument.content}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          {t.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-3xl">
          {t.subtitle}
        </p>
      </div>

      <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <AlertCircle className="w-32 h-32 text-amber-600" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              Krankheit bei Prüfungen?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
              Melde dich unverzüglich über die Antragsverwaltung.
            </p>
            <div className="flex flex-wrap gap-4 mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 bg-white dark:bg-black/20 px-2 py-1 rounded border border-amber-100 dark:border-amber-900/30">
                <FileCheck className="w-3 h-3" /> Verlängerungsantrag (Schriftl. Arbeit)
              </span>
              <span className="flex items-center gap-1 bg-white dark:bg-black/20 px-2 py-1 rounded border border-amber-100 dark:border-amber-900/30">
                <FileCheck className="w-3 h-3" /> Attest (Klausur)
              </span>
            </div>
          </div>
          
          <Link 
            to="/antragsverwaltung" 
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all"
          >
            Zur Antragsverwaltung
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Wiederholungsprüfungen Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button 
          id="repeat-exams-btn"
          type="button"
          className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-4 pointer-events-none">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <RefreshCw className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Wiederholungsprüfungen</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Leitfaden für Zweit- und Drittversuche</p>
            </div>
          </div>
          <div className="pointer-events-none">
            {isRepeatExamsOpen ? (
              <ChevronUp className="w-6 h-6 text-slate-400" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-400" />
            )}
          </div>
        </button>

        {isRepeatExamsOpen && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-100 dark:bg-slate-800 p-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <FileText className="w-4 h-4" />
                  Leitfaden_Wiederholungspruefungen.pdf
                </div>
                <button 
                  onClick={() => handleDownload("Leitfaden_Wiederholungspruefungen", "PDF", repeatExamsDocument)}
                  className="flex items-center gap-2 text-xs font-medium bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors text-slate-700 dark:text-slate-200"
                >
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>

              <div className="p-8 max-h-[600px] overflow-y-auto bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-300 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Leitfaden zum Ablauf von Wiederholungsprüfungen</h1>
                  <div className="flex justify-between text-xs text-slate-500 font-mono uppercase tracking-wider">
                    <span>ZPA DS</span>
                    <span>Stand: 01.04.2025</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm">1</span> Allgemeines
                  </h3>
                  <p className="text-sm leading-relaxed">
                    In diesem Leitfaden findest Du alle wichtigen Informationen zum Ablauf Deiner Wiederholungsprüfung für Klausuren, mündliche Prüfungsleistungen, schriftliche Arbeiten sowie Portfolios und Creative Workbooks. Genaue Informationen zu einzelnen Prüfungsformen findest du in den jeweiligen Prüfungsleitfäden in myCampus.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm">2</span> Klausur
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 pl-2">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                      <h4 className="font-bold text-sm mb-2 text-slate-900 dark:text-white">Termin</h4>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        Klausuren können nur in den vorgegebenen <strong>Resit-Phasen (Juni/Dezember)</strong> wiederholt werden.
                        <br/><br/>
                        <em>Ausnahme ab 7. Semester:</em> Wiederholung auch in regulären Phasen (Februar/August) möglich.
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                      <h4 className="font-bold text-sm mb-2 text-slate-900 dark:text-white">Durchführung & Krankheit</h4>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        Klausurenphasen können nicht übersprungen werden. Nichtantritt führt automatisch zum Fehlversuch, außer es liegt eine genehmigte Prüfungsunfähigkeit vor (Antrag binnen 3 Werktagen).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm">3</span> Mündliche Prüfungsleistungen
                  </h3>
                  <div className="space-y-4 pl-2">
                    <div className="border-l-2 border-emerald-500 pl-4 py-1">
                      <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400">Nach genehmigter Prüfungsunfähigkeit</h4>
                      <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li>• <strong>Termin:</strong> Individueller Nachholtermin bis Ende der nächsten RESIT-Phase.</li>
                        <li>• <strong>Thema:</strong> Gleiches Thema wie im Erstversuch (außer bei mündl. Prüfung: neue Fragen).</li>
                        <li>• <strong>Status:</strong> Kein Fehlversuch.</li>
                      </ul>
                    </div>
                    <div className="border-l-2 border-red-500 pl-4 py-1">
                      <h4 className="font-bold text-sm text-red-700 dark:text-red-400">Nach unentschuldigtem Fehlen</h4>
                      <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li>• <strong>Termin:</strong> Neuer Termin im Folgesemester.</li>
                        <li>• <strong>Thema:</strong> Neues Thema muss erfragt werden (4 Wochen vor Termin).</li>
                        <li>• <strong>Status:</strong> Fehlversuch wird angerechnet.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Wissenschaftliches Arbeiten Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button 
          id="scientific-work-btn"
          type="button"
          className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-4 pointer-events-none">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Wissenschaftliches Arbeiten</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Leitfäden, Richtlinien und Vorlagen</p>
            </div>
          </div>
          <div className="pointer-events-none">
            {isScientificWorkOpen ? (
              <ChevronUp className="w-6 h-6 text-slate-400" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-400" />
            )}
          </div>
        </button>

        {isScientificWorkOpen && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300">
              <p className="font-semibold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Wichtiger Hinweis zu Versionen:
              </p>
              <p>
                Bitte beachte, dass es von einigen Leitfäden zwei verschiedene Versionen gibt. Welche Version für Deine schriftliche Arbeit maßgeblich ist, hängt davon ab, in welchem Semester Du den Erstversuch abgelegt hast. Vergleiche dazu einfach die Gültigkeitsdaten der jeweiligen Leitfäden mit dem Zeitraum, in dem Du die Prüfungsleistung begonnen hast.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 pl-1">Grundlagen & Richtlinien</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {coreGuidelines.map((item, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedDocument(item)}
                    className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className={`p-3 rounded-lg ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          {item.subtitle}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                        <FileText className="w-3 h-3" />
                        <span>Dokument öffnen</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 pl-1">Spezielle Themen</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {topicGuidelines.map((item, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedDocument(item)}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className={`p-3 rounded-lg ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
                        {item.title}
                      </h3>
                    </div>
                    <FileText className="w-4 h-4 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-8 mb-4">Vorlagen</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {templates.map((item, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedDocument(item)}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
