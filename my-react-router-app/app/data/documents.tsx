import React from "react";
import { BookOpen, PenTool, Users, Shield, Lock, Cpu, Layout, Presentation } from "lucide-react";

export const guidelines = [
  {
    id: "richtlinien-neu",
    title: "Richtlinien zur Gestaltung wissenschaftlicher Arbeiten",
    subtitle: "Gültig für Erstversuche ab 01.10.2025",
    icon: BookOpen,
    color: "text-blue-600 dark:text-white",
    bgColor: "bg-blue-100 dark:bg-iu-blue",
    content: (
      <div className="space-y-6">
        <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-8 mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Richtlinien zur Gestaltung wissenschaftlicher Arbeiten</h1>
          <p className="text-slate-700">Gültig ab 01.10.2025</p>
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
    color: "text-slate-700 dark:text-white",
    bgColor: "bg-slate-100 dark:bg-slate-800",
    content: (
      <div className="space-y-6">
        <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-8 mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Richtlinien zur Gestaltung wissenschaftlicher Arbeiten</h1>
          <p className="text-slate-700">Gültig bis 30.09.2025</p>
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
    color: "text-purple-600 dark:text-white",
    bgColor: "bg-purple-100 dark:bg-iu-purple",
    content: (
      <div className="space-y-6">
        <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-8 mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Zitierleitfaden</h1>
          <p className="text-slate-700">Standard für wissenschaftliche Arbeiten</p>
        </div>
        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-bold mb-2">Die APA-Zitierweise</h3>
            <p className="mb-4">Die IU Internationale Hochschule empfiehlt grundsätzlich die Verwendung des APA-Stils (American Psychological Association) in der jeweils aktuellen Auflage.</p>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg font-mono text-sm">
              <p className="mb-2 text-slate-700">// Beispiel im Text:</p>
              <p>Müller (2023) argumentiert, dass...</p>
              <p className="mt-2 text-slate-700">// Beispiel in Klammern:</p>
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
    color: "text-pink-600 dark:text-white",
    bgColor: "bg-pink-100 dark:bg-iu-pink",
    content: (
      <div className="space-y-6">
         <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-8 mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Gendersensible Sprache</h1>
          <p className="text-slate-700">Leitfaden für Inklusion</p>
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
    color: "text-red-600 dark:text-white",
    bgColor: "bg-red-100 dark:bg-iu-red",
    content: (
      <div className="space-y-6">
         <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-8 mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Plagiatsvermeidung</h1>
          <p className="text-slate-700">Wissenschaftliche Redlichkeit</p>
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
    color: "text-emerald-600 dark:text-white",
    bgColor: "bg-emerald-100 dark:bg-emerald-600",
    content: (
      <div className="space-y-6">
         <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-8 mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Vertraulichkeitsvereinbarung</h1>
          <p className="text-slate-700">Sperrvermerk</p>
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
    color: "text-indigo-600 dark:text-white",
    bgColor: "bg-indigo-100 dark:bg-indigo-600",
    content: (
      <div className="space-y-6">
         <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-8 mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">KI-Nutzung</h1>
          <p className="text-slate-700">Umgang mit ChatGPT & Co.</p>
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

export const templates = [
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
             <p className="text-xl text-slate-700">Untertitel oder Thema</p>
           </div>

           <div className="mt-auto ml-8 mb-4 text-xs text-slate-700">
             IU Internationale Hochschule | Max Student | 22.11.2025
           </div>
        </div>
      </div>
    )
  }
];

export const repeatExamsDocument = {
  id: "wiederholungspruefungen",
  title: "Leitfaden zum Ablauf von Wiederholungsprüfungen",
  type: "PDF",
  content: (
    <div className="space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Leitfaden zum Ablauf von Wiederholungsprüfungen</h1>
        <div className="flex justify-between text-xs text-slate-700 font-mono uppercase tracking-wider">
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
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              Klausuren können nur in den vorgegebenen Resit-Phasen (Juni/Dezember) wiederholt werden. Ausnahme ab 7. Semester: Wiederholung auch in regulären Phasen (Februar/August) möglich.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-sm mb-2 text-slate-900 dark:text-white">Durchführung & Krankheit</h4>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
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
            <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
              <li>• Termin: Individueller Nachholtermin bis Ende der nächsten RESIT-Phase.</li>
              <li>• Thema: Gleiches Thema wie im Erstversuch (außer bei mündl. Prüfung: neue Fragen).</li>
              <li>• Status: Kein Fehlversuch.</li>
            </ul>
          </div>
          <div className="border-l-2 border-red-500 pl-4 py-1">
            <h4 className="font-bold text-sm text-red-700 dark:text-red-400">Nach unentschuldigtem Fehlen</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
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
