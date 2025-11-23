import { useState, useEffect } from "react";
import { FileText, AlertCircle, Download, ExternalLink, GraduationCap, BookOpen, Shield, PenTool, Layout, FileCheck, RefreshCw, ChevronDown, ChevronUp, Users, Lock, Cpu, Presentation, Info, X } from "lucide-react";
import { Link } from "react-router";
import { jsPDF } from "jspdf";

export default function ExamsPage() {
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

  const guidelines = [
    {
      id: "richtlinien-neu",
      title: "Richtlinien zur Gestaltung wissenschaftlicher Arbeiten",
      subtitle: "Gültig für Erstversuche ab 01.10.2025",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      content: (
        <div className="space-y-6">
          <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-8 mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Richtlinien zur Gestaltung wissenschaftlicher Arbeiten</h1>
            <p className="text-slate-500">Gültig ab 01.10.2025</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">1. Formale Anforderungen</h3>
            <p>Schriftliche Arbeiten sind im Format DIN A4 zu erstellen. Der Seitenrand beträgt links 2,5 cm, rechts 2,5 cm, oben 2,5 cm und unten 2,0 cm.</p>
            <h3 className="text-xl font-bold">2. Schriftart und -größe</h3>
            <p>Es wird eine gut lesbare Serifenschrift (z.B. Times New Roman) oder serifenlose Schrift (z.B. Arial) empfohlen. Schriftgröße: 11-12 pt, Zeilenabstand: 1,5-fach.</p>
            <h3 className="text-xl font-bold">3. Gliederung</h3>
            <p>Die Arbeit muss eine logische Gliederung aufweisen (Einleitung, Hauptteil, Schluss). Dezimalklassifikation wird empfohlen (1, 1.1, 1.1.1).</p>
          </div>
        </div>
      )
    },
    {
      id: "richtlinien-alt",
      title: "Richtlinien zur Gestaltung wissenschaftlicher Arbeiten",
      subtitle: "Gültig für Erstversuche vor 01.10.2025",
      icon: BookOpen,
      color: "text-slate-600",
      bgColor: "bg-slate-100 dark:bg-slate-800",
      content: (
        <div className="space-y-6">
          <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-8 mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Richtlinien zur Gestaltung wissenschaftlicher Arbeiten</h1>
            <p className="text-slate-500">Gültig bis 30.09.2025</p>
          </div>
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-6">
              <p className="text-amber-800 dark:text-amber-200 font-medium">Hinweis: Diese Version ist nur noch für Wiederholungsprüfungen von Erstversuchen vor dem Stichtag relevant.</p>
            </div>
            <h3 className="text-xl font-bold">1. Allgemeines</h3>
            <p>Die wissenschaftliche Arbeit dient dem Nachweis der Befähigung zur selbstständigen Bearbeitung eines Themas.</p>
            <h3 className="text-xl font-bold">2. Zitation</h3>
            <p>Es ist durchgängig ein einheitlicher Zitierstil zu verwenden (z.B. APA oder Harvard).</p>
          </div>
        </div>
      )
    },
    {
      id: "zitierleitfaden",
      title: "IU-weiter Zitierleitfaden",
      subtitle: "Gültig für Erstversuche ab 01.10.2025",
      icon: PenTool,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      content: (
        <div className="space-y-6">
          <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-8 mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Zitierleitfaden</h1>
            <p className="text-slate-500">Standard für wissenschaftliche Arbeiten</p>
          </div>
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-bold mb-2">Die APA-Zitierweise</h3>
              <p className="mb-4">Die IU Internationale Hochschule empfiehlt grundsätzlich die Verwendung des APA-Stils (American Psychological Association) in der jeweils aktuellen Auflage.</p>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg font-mono text-sm">
                <p className="mb-2 text-slate-500">// Beispiel im Text:</p>
                <p>Müller (2023) argumentiert, dass...</p>
                <p className="mt-2 text-slate-500">// Beispiel in Klammern:</p>
                <p>...dies wurde bereits mehrfach belegt (Müller, 2023, S. 15).</p>
              </div>
            </section>
            <section>
              <h3 className="text-xl font-bold mb-2">Literaturverzeichnis</h3>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg font-mono text-sm">
                <p>Müller, T. (2023). <em>Wissenschaftliches Arbeiten im digitalen Zeitalter</em>. Springer Gabler.</p>
              </div>
            </section>
          </div>
        </div>
      )
    },
    {
      id: "gender",
      title: "Leitfaden zur gendersensiblen und inklusiven Sprache",
      icon: Users,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
      content: (
        <div className="space-y-6">
           <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-8 mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Gendersensible Sprache</h1>
            <p className="text-slate-500">Leitfaden für Inklusion</p>
          </div>
          <p>Sprache schafft Realität. Eine gendersensible und inklusive Sprache trägt dazu bei, alle Menschen gleichermaßen anzusprechen und sichtbar zu machen.</p>
          <h3 className="text-xl font-bold mt-4">Empfohlene Schreibweisen</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Doppelnennung:</strong> Studentinnen und Studenten</li>
            <li><strong>Gender-Doppelpunkt:</strong> Student:innen</li>
            <li><strong>Neutrale Formulierungen:</strong> Studierende, Lehrkräfte</li>
          </ul>
        </div>
      )
    },
    {
      id: "plagiat",
      title: "Leitfaden zur Vermeidung eines Plagiats",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      content: (
        <div className="space-y-6">
           <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-8 mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Plagiatsvermeidung</h1>
            <p className="text-slate-500">Wissenschaftliche Redlichkeit</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-4">
            <h4 className="font-bold text-red-800 dark:text-red-200">Null-Toleranz-Politik</h4>
            <p className="text-sm text-red-700 dark:text-red-300">Jedes Plagiat wird als Täuschungsversuch gewertet und führt zum Nichtbestehen der Prüfungsleistung.</p>
          </div>
          <h3 className="text-xl font-bold">Was ist ein Plagiat?</h3>
          <p>Ein Plagiat liegt vor, wenn fremdes geistiges Eigentum ohne entsprechende Kenntlichmachung übernommen wird.</p>
          <h3 className="text-xl font-bold mt-4">Vermeidungsstrategien</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Jede Quelle sofort notieren</li>
            <li>Direkte Zitate immer in Anführungszeichen setzen</li>
            <li>Paraphrasen deutlich kennzeichnen</li>
          </ul>
        </div>
      )
    },
    {
      id: "vertraulichkeit",
      title: "Vertraulichkeitsvereinbarung für schriftliche Arbeiten",
      icon: Lock,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
      content: (
        <div className="space-y-6">
           <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-8 mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Vertraulichkeitsvereinbarung</h1>
            <p className="text-slate-500">Sperrvermerk</p>
          </div>
          <p>Diese Vereinbarung wird genutzt, wenn eine Abschlussarbeit vertrauliche Daten eines Unternehmens enthält.</p>
          <div className="border p-8 bg-white shadow-sm my-8 font-serif">
            <h2 className="text-center font-bold text-xl mb-8">SPERRVERMERK</h2>
            <p className="leading-loose text-justify">
              Die vorliegende Arbeit beinhaltet vertrauliche Informationen des Unternehmens [Name]. 
              Sie darf nur von den begutachtenden Personen sowie den Mitgliedern des Prüfungsausschusses eingesehen werden. 
              Eine Veröffentlichung oder Weitergabe an Dritte ist ohne ausdrückliche Genehmigung des Unternehmens nicht gestattet.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "ki",
      title: "Richtlinie für die Nutzung von KI im Studium",
      icon: Cpu,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
      content: (
        <div className="space-y-6">
           <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-8 mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">KI-Nutzung</h1>
            <p className="text-slate-500">Umgang mit ChatGPT & Co.</p>
          </div>
          <h3 className="text-xl font-bold">Grundsätze</h3>
          <p>KI-Tools dürfen als Hilfsmittel verwendet werden, müssen aber transparent gemacht werden. Die Verantwortung für den Inhalt bleibt vollständig bei den Studierenden.</p>
          <h3 className="text-xl font-bold mt-4">Kennzeichnungspflicht</h3>
          <p>Die Nutzung von KI zur Textgenerierung, Ideengebung oder Korrektur ist im Verzeichnis der Hilfsmittel anzugeben.</p>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 mt-4">
            <p className="font-bold text-indigo-800 dark:text-indigo-200">Wichtig:</p>
            <p className="text-sm text-indigo-700 dark:text-indigo-300">KI-generierte Texte sind keine eigene geistige Leistung und dürfen nicht als solche ausgegeben werden.</p>
          </div>
        </div>
      )
    }
  ];

  const templates = [
    {
      id: "deckblatt",
      title: "Vorlage Deckblatt für schriftliche Arbeiten",
      icon: Layout,
      type: "DOCX",
      content: (
        <div className="space-y-6">
          <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Deckblatt Vorlage</h1>
          </div>
          <div className="aspect-[1/1.414] bg-white text-black p-12 shadow-lg border border-slate-200 mx-auto max-w-[500px] flex flex-col items-center text-center">
            <div className="w-full flex justify-between mb-12">
              <span className="font-bold text-xl">IU Internationale Hochschule</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 mt-12">Titel der Arbeit</h2>
            <h3 className="text-xl mb-12">Untertitel der Arbeit</h3>
            
            <div className="mt-auto w-full text-left space-y-2 text-sm">
              <p><strong>Kurs:</strong> DLBWIR01</p>
              <p><strong>Tutor:</strong> Prof. Dr. Max Mustermann</p>
              <p><strong>Vorgelegt von:</strong> Max Student</p>
              <p><strong>Matrikelnummer:</strong> 1234567</p>
              <p><strong>Datum:</strong> 22.11.2025</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "ppt",
      title: "Vorlage PowerPoint-Präsentation",
      icon: Presentation,
      type: "PPTX",
      content: (
        <div className="space-y-6">
          <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">PowerPoint Master</h1>
          </div>
          <div className="aspect-video bg-white text-black p-8 shadow-lg border border-slate-200 mx-auto max-w-[600px] flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-bl-full"></div>
             <div className="absolute bottom-0 left-0 w-full h-2 bg-slate-900"></div>
             
             <div className="relative z-10 mt-12 ml-8">
               <h2 className="text-3xl font-bold text-slate-900 mb-2">Präsentationstitel</h2>
               <p className="text-xl text-slate-600">Untertitel oder Thema</p>
             </div>

             <div className="mt-auto ml-8 mb-4 text-xs text-slate-400">
               IU Internationale Hochschule | Max Student | 22.11.2025
             </div>
          </div>
        </div>
      )
    }
  ];

  const coreGuidelines = guidelines.slice(0, 3);
  const topicGuidelines = guidelines.slice(3);

  // Create a document object for the Wiederholungsprüfungen guide
  const repeatExamsDocument = {
    title: "Leitfaden zum Ablauf von Wiederholungsprüfungen",
    type: "PDF",
    content: (
      <div className="space-y-8">
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
                Klausuren können nur in den vorgegebenen Resit-Phasen (Juni/Dezember) wiederholt werden. Ausnahme ab 7. Semester: Wiederholung auch in regulären Phasen (Februar/August) möglich.
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
                <li>• Termin: Individueller Nachholtermin bis Ende der nächsten RESIT-Phase.</li>
                <li>• Thema: Gleiches Thema wie im Erstversuch (außer bei mündl. Prüfung: neue Fragen).</li>
                <li>• Status: Kein Fehlversuch.</li>
              </ul>
            </div>
            <div className="border-l-2 border-red-500 pl-4 py-1">
              <h4 className="font-bold text-sm text-red-700 dark:text-red-400">Nach unentschuldigtem Fehlen</h4>
              <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>• Termin: Neuer Termin im Folgesemester.</li>
                <li>• Thema: Neues Thema muss erfragt werden (4 Wochen vor Termin).</li>
                <li>• Status: Fehlversuch wird angerechnet.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  };

  const handleDownload = (title: string, type: string = "PDF", document?: any) => {
    try {
      // Extract content text from document if available
      let contentText = "";
      let htmlContent = "";
      
      // Check title to determine content (works even without document parameter)
      if (title === "Leitfaden_Wiederholungspruefungen" || title.includes("Wiederholungsprüfungen")) {
        contentText = `
Leitfaden zum Ablauf von Wiederholungsprüfungen
ZPA DS - Stand: 01.04.2025

1. Allgemeines
In diesem Leitfaden findest Du alle wichtigen Informationen zum Ablauf Deiner Wiederholungsprüfung für Klausuren, mündliche Prüfungsleistungen, schriftliche Arbeiten sowie Portfolios und Creative Workbooks. Genaue Informationen zu einzelnen Prüfungsformen findest du in den jeweiligen Prüfungsleitfäden in myCampus.

2. Klausur

Termin:
Klausuren können nur in den vorgegebenen Resit-Phasen (Juni/Dezember) wiederholt werden. Ausnahme ab 7. Semester: Wiederholung auch in regulären Phasen (Februar/August) möglich.

Durchführung & Krankheit:
Klausurenphasen können nicht übersprungen werden. Nichtantritt führt automatisch zum Fehlversuch, außer es liegt eine genehmigte Prüfungsunfähigkeit vor (Antrag binnen 3 Werktagen).

3. Mündliche Prüfungsleistungen

Nach genehmigter Prüfungsunfähigkeit:
• Termin: Individueller Nachholtermin bis Ende der nächsten RESIT-Phase.
• Thema: Gleiches Thema wie im Erstversuch (außer bei mündl. Prüfung: neue Fragen).
• Status: Kein Fehlversuch.

Nach unentschuldigtem Fehlen:
• Termin: Neuer Termin im Folgesemester.
• Thema: Neues Thema muss erfragt werden (4 Wochen vor Termin).
• Status: Fehlversuch wird angerechnet.
`;
          htmlContent = `
            <h1>Leitfaden zum Ablauf von Wiederholungsprüfungen</h1>
            <p><em>ZPA DS - Stand: 01.04.2025</em></p>
            
            <h2>1. Allgemeines</h2>
            <p>In diesem Leitfaden findest Du alle wichtigen Informationen zum Ablauf Deiner Wiederholungsprüfung für Klausuren, mündliche Prüfungsleistungen, schriftliche Arbeiten sowie Portfolios und Creative Workbooks. Genaue Informationen zu einzelnen Prüfungsformen findest du in den jeweiligen Prüfungsleitfäden in myCampus.</p>
            
            <h2>2. Klausur</h2>
            <h3>Termin:</h3>
            <p>Klausuren können nur in den vorgegebenen <strong>Resit-Phasen (Juni/Dezember)</strong> wiederholt werden.</p>
            <p><em>Ausnahme ab 7. Semester:</em> Wiederholung auch in regulären Phasen (Februar/August) möglich.</p>
            
            <h3>Durchführung & Krankheit:</h3>
            <p>Klausurenphasen können nicht übersprungen werden. Nichtantritt führt automatisch zum Fehlversuch, außer es liegt eine genehmigte Prüfungsunfähigkeit vor (Antrag binnen 3 Werktagen).</p>
            
            <h2>3. Mündliche Prüfungsleistungen</h2>
            <h3>Nach genehmigter Prüfungsunfähigkeit:</h3>
            <ul>
              <li><strong>Termin:</strong> Individueller Nachholtermin bis Ende der nächsten RESIT-Phase.</li>
              <li><strong>Thema:</strong> Gleiches Thema wie im Erstversuch (außer bei mündl. Prüfung: neue Fragen).</li>
              <li><strong>Status:</strong> Kein Fehlversuch.</li>
            </ul>
            
            <h3>Nach unentschuldigtem Fehlen:</h3>
            <ul>
              <li><strong>Termin:</strong> Neuer Termin im Folgesemester.</li>
              <li><strong>Thema:</strong> Neues Thema muss erfragt werden (4 Wochen vor Termin).</li>
              <li><strong>Status:</strong> Fehlversuch wird angerechnet.</li>
            </ul>
          `;
        } else if (title.includes("Richtlinien zur Gestaltung")) {
          contentText = `
${title}

1. Formale Anforderungen
Schriftliche Arbeiten sind im Format DIN A4 zu erstellen. Der Seitenrand beträgt links 2,5 cm, rechts 2,5 cm, oben 2,5 cm und unten 2,0 cm.

2. Schriftart und -größe
Es wird eine gut lesbare Serifenschrift (z.B. Times New Roman) oder serifenlose Schrift (z.B. Arial) empfohlen. Schriftgröße: 11-12 pt, Zeilenabstand: 1,5-fach.

3. Gliederung
Die Arbeit muss eine logische Gliederung aufweisen (Einleitung, Hauptteil, Schluss). Dezimalklassifikation wird empfohlen (1, 1.1, 1.1.1).

4. Zitation
Es ist durchgängig ein einheitlicher Zitierstil zu verwenden (z.B. APA oder Harvard). Alle verwendeten Quellen müssen im Literaturverzeichnis aufgeführt werden.

5. Literaturverzeichnis
Das Literaturverzeichnis enthält alle in der Arbeit zitierten Quellen in alphabetischer Reihenfolge nach Autorennamen.
`;
          htmlContent = `
            <h1>${title}</h1>
            
            <h2>1. Formale Anforderungen</h2>
            <p>Schriftliche Arbeiten sind im Format DIN A4 zu erstellen. Der Seitenrand beträgt links 2,5 cm, rechts 2,5 cm, oben 2,5 cm und unten 2,0 cm.</p>
            
            <h2>2. Schriftart und -größe</h2>
            <p>Es wird eine gut lesbare Serifenschrift (z.B. Times New Roman) oder serifenlose Schrift (z.B. Arial) empfohlen. Schriftgröße: 11-12 pt, Zeilenabstand: 1,5-fach.</p>
            
            <h2>3. Gliederung</h2>
            <p>Die Arbeit muss eine logische Gliederung aufweisen (Einleitung, Hauptteil, Schluss). Dezimalklassifikation wird empfohlen (1, 1.1, 1.1.1).</p>
            
            <h2>4. Zitation</h2>
            <p>Es ist durchgängig ein einheitlicher Zitierstil zu verwenden (z.B. APA oder Harvard). Alle verwendeten Quellen müssen im Literaturverzeichnis aufgeführt werden.</p>
            
            <h2>5. Literaturverzeichnis</h2>
            <p>Das Literaturverzeichnis enthält alle in der Arbeit zitierten Quellen in alphabetischer Reihenfolge nach Autorennamen.</p>
          `;
        } else if (title.includes("Deckblatt")) {
          // Template for cover page
          contentText = `
IU Internationale Hochschule

Titel der Arbeit
Untertitel der Arbeit

Kurs: DLBWIR01
Tutor: Prof. Dr. Max Mustermann
Vorgelegt von: Max Student
Matrikelnummer: 1234567
Datum: ${new Date().toLocaleDateString('de-DE')}
`;
          htmlContent = `
            <div style="text-align: center; margin-top: 100px;">
              <h1 style="font-size: 24pt; margin-bottom: 50px;">IU Internationale Hochschule</h1>
              
              <h2 style="font-size: 20pt; margin-top: 100px; margin-bottom: 10px;">Titel der Arbeit</h2>
              <h3 style="font-size: 16pt; margin-bottom: 100px;">Untertitel der Arbeit</h3>
              
              <div style="text-align: left; margin-top: 150px; margin-left: 50px;">
                <p><strong>Kurs:</strong> DLBWIR01</p>
                <p><strong>Tutor:</strong> Prof. Dr. Max Mustermann</p>
                <p><strong>Vorgelegt von:</strong> Max Student</p>
                <p><strong>Matrikelnummer:</strong> 1234567</p>
                <p><strong>Datum:</strong> ${new Date().toLocaleDateString('de-DE')}</p>
              </div>
            </div>
          `;
        } else if (title.includes("PowerPoint") || title.includes("Präsentation")) {
          // Template for PowerPoint
          contentText = `
Präsentationstitel
Untertitel oder Thema

IU Internationale Hochschule | Max Student | ${new Date().toLocaleDateString('de-DE')}
`;
          htmlContent = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 60px; color: white; height: 400px; position: relative;">
              <h1 style="font-size: 36pt; margin-top: 80px; margin-left: 40px;">Präsentationstitel</h1>
              <h2 style="font-size: 24pt; margin-left: 40px; color: #f0f0f0;">Untertitel oder Thema</h2>
              
              <div style="position: absolute; bottom: 20px; left: 40px; font-size: 10pt;">
                <p>IU Internationale Hochschule | Max Student | ${new Date().toLocaleDateString('de-DE')}</p>
              </div>
            </div>
          `;
        } else {
          contentText = `${title}\n\nDies ist ein Platzhalter-Dokument.\nIn einer echten Anwendung würde hier der vollständige Inhalt stehen.`;
          htmlContent = `<h1>${title}</h1><p>Dies ist ein Platzhalter-Dokument.</p><p>In einer echten Anwendung würde hier der vollständige Inhalt stehen.</p>`;
        }

      console.log("Download debug:", { title, type, contentText: contentText.substring(0, 50), htmlContent: htmlContent.substring(0, 50) });

      // Safety check
      if (!contentText || !htmlContent) {
        console.error("Content is empty!");
        alert("Fehler: Inhalt konnte nicht geladen werden.");
        return;
      }

      if (type === "PPTX") {
        // Use pptxgenjs for real PowerPoint generation
        import("pptxgenjs").then((module) => {
          const pptx = new module.default();
          
          // Add a slide
          const slide = pptx.addSlide();
          
          // Add title
          slide.addText(title, { 
            x: 1, y: 1, w: '80%', h: 1, 
            fontSize: 24, bold: true, color: '363636', align: 'center' 
          });
          
          // Add subtitle/content
          slide.addText("IU Internationale Hochschule", { 
            x: 1, y: 2.5, w: '80%', h: 1, 
            fontSize: 18, color: '666666', align: 'center' 
          });
          
          slide.addText(`Generiert am: ${new Date().toLocaleDateString()}`, { 
            x: 1, y: 4, w: '80%', h: 0.5, 
            fontSize: 12, color: 'AAAAAA', align: 'center' 
          });

          // Save the file
          pptx.writeFile({ fileName: `${title.replace(/\s+/g, '_')}.pptx` });
        }).catch(err => {
          console.error("Failed to load pptxgenjs", err);
          alert("Fehler beim Erstellen der PowerPoint-Datei.");
        });
        return;
      }

      if (type === "DOCX") {
        // For Word documents - use the original working method with proper HTML
        const fullHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head>
            <meta charset='utf-8'>
            <title>${title}</title>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>`;
        
        const blob = new Blob([fullHtml], { type: "application/msword" });
        const link = window.document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${title.replace(/\s+/g, '_')}.doc`;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(link.href), 100);
      } else {
        // For PDF, use jsPDF with actual content
        const doc = new jsPDF();
        let yPosition = 20;
        
        // Title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 20, yPosition);
        yPosition += 10;
        
        // Add content
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        const lines = doc.splitTextToSize(contentText, 170);
        lines.forEach((line: string) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 20, yPosition);
          yPosition += 6;
        });
        
        // Footer on all pages
        doc.setFontSize(9);
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.text(`Seite ${i} von ${pageCount} | Generiert am: ${new Date().toLocaleDateString()}`, 20, 285);
        }
        
        doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

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
          Prüfungsguide & Dokumente
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-3xl">
          Alles Wichtige zu Prüfungsabläufen, Krankmeldungen und wissenschaftlichem Arbeiten.
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
