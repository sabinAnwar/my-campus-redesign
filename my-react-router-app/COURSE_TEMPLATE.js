// TEMPLATE: Wie man eine neue Datei/Ressource zu einem Kurs hinzufügt
// Dieses Beispiel zeigt alle möglichen Typen

const courseTemplate = {
  id: 10,
  code: "EXAMPLE101",
  title: "Beispielkurs",
  instructor: "Prof. Dr. Beispiel",
  credits: 5,
  semester: "Wintersemester 2024/25",
  startDate: "01.10.2024",
  endDate: "31.01.2025",
  description: "Ein Beispielkurs mit allen Ressourcentypen",
  progress: 0,
  active: true,
  modules: [],
  resources: [
    // ============================================
    // 1. SKRIPTE (Scripts) - Lehrbücher & PDFs
    // ============================================
    {
      id: 300,
      type: "script",
      title: "Hauptskript Teil 1.pdf",
      size: "5.2 MB",
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/Example101/skript/Hauptskript_Teil_1.pdf",
    },
    {
      id: 301,
      type: "script",
      title: "Übungsaufgaben.pdf",
      size: "2.8 MB",
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/Example101/skript/Uebungsaufgaben.pdf",
    },

    // ============================================
    // 2. MUSTERKLAUSUREN - Prüfungsaufgaben
    // ============================================
    {
      id: 302,
      type: "musterklausur",
      title: "Klausur Wintersemester 2023.pdf",
      size: "1.5 MB",
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/Example101/musterklausuren/Klausur_WS2023.pdf",
    },
    {
      id: 303,
      type: "musterklausur",
      title: "Musterlösung WS 2023.pdf",
      size: "2.1 MB",
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/Example101/musterklausuren/Musterlösung_WS2023.pdf",
    },

    // ============================================
    // 3. FOLIENSÄTZE - Präsentationen
    // ============================================
    {
      id: 304,
      type: "file",
      title: "Vorlesung Woche 1.pdf",
      size: "3.2 MB",
      teacher: "Prof. Dr. Beispiel",
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/Example101/foliensaetze/Vorlesung_Woche1.pdf",
    },
    {
      id: 305,
      type: "file",
      title: "Vorlesung Woche 2.xlsx",
      size: "1.8 MB",
      teacher: "Prof. Dr. Beispiel",
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/Example101/foliensaetze/Vorlesung_Woche2.xlsx",
    },

    // ============================================
    // 4. VIDEOS - Videoinhalte
    // ============================================
    {
      id: 306,
      type: "video",
      title: "Einführung in das Thema",
      duration: "45 min",
      url: "https://youtube.com/embed/example",
    },
    {
      id: 307,
      type: "video",
      title: "Vertiefung - Teil 1",
      duration: "52 min",
      url: "https://youtube.com/embed/example2",
    },

    // ============================================
    // 5. PODCASTS - Audio/Video-Materialien
    // ============================================
    {
      id: 308,
      type: "podcast",
      title: "Podcast Episode 1",
      duration: "30 min",
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/Example101/podcasts/Episode1.mp3",
    },
    {
      id: 309,
      type: "podcast",
      title: "Podcast Episode 2",
      duration: "28 min",
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/Example101/podcasts/Episode2.mp3",
    },

    // ============================================
    // 6. ONLINE TESTS - Wissensabfragen
    // ============================================
    {
      id: 310,
      type: "onlineTest",
      title: "Quiz: Grundlagen",
      size: "0.5 MB",
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/Example101/tests/Quiz_Grundlagen.pdf",
    },
    {
      id: 311,
      type: "onlineTest",
      title: "Test: Kapitel 1-3",
      size: "1.2 MB",
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/Example101/tests/Test_Kapitel_1_3.pdf",
    },

    // ============================================
    // 7. EVALUATIONEN - Selbsteinschätzungen
    // ============================================
    {
      id: 312,
      type: "evaluation",
      title: "Selbsteinschätzung vor Kurs",
      size: "0.8 MB",
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/Example101/tests/Selbsteinschaetzung_Vorher.pdf",
    },
    {
      id: 313,
      type: "evaluation",
      title: "Selbsteinschätzung nach Kurs",
      size: "0.8 MB",
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/Example101/tests/Selbsteinschaetzung_Nachher.pdf",
    },

    // ============================================
    // 8. WEITERFÜHRENDE LITERATUR - Zusatzliteratur
    // ============================================
    {
      id: 314,
      type: "furtherLiterature",
      title: "Smith, J. (2020): Advanced Topics in Example. Academic Press.",
      url: "#",
      isExternal: true,
    },
    {
      id: 315,
      type: "furtherLiterature",
      title: "Johnson, M. (2022): Practical Applications. Springer.",
      url: "#",
      isExternal: true,
    },
  ],
  assignments: [],
  forumTopics: [],
};

// ============================================
// DATEIORDNER für diesen Kurs
// ============================================

/*

public/uploads/studiengaenge/Wirtschaftsinformatik/Example101/
│
├── skript/
│   ├── Hauptskript_Teil_1.pdf
│   └── Uebungsaufgaben.pdf
│
├── musterklausuren/
│   ├── Klausur_WS2023.pdf
│   └── Musterlösung_WS2023.pdf
│
├── foliensaetze/
│   ├── Vorlesung_Woche1.pdf
│   └── Vorlesung_Woche2.xlsx
│
├── podcasts/
│   ├── Episode1.mp3
│   └── Episode2.mp3
│
└── toturium/
    └── (falls später hinzugefügt)

*/

// ============================================
// CHECKLISTE zum Hinzufügen einer neuen Datei:
// ============================================

/*

1. ✅ Datei in public/uploads/... speichern
   - Beispiel: public/uploads/studiengaenge/Wirtschaftsinformatik/CourseCode/skript/

2. ✅ In courses.jsx den Kurs finden (suche nach code: "EXAMPLE101")

3. ✅ Neue Ressource in den resources Array hinzufügen:
   {
     id: 316,  // <-- Neue eindeutige ID (höher als die letzte)
     type: "script",  // <-- Typ wählen (script, musterklausur, video, podcast, etc.)
     title: "Dateiname.pdf",  // <-- Anzeigename
     size: "1.2 MB",  // <-- Dateigröße
     url: "/uploads/studiengaenge/Wirtschaftsinformatik/CourseCode/skript/Dateiname.pdf",  // <-- Pfad
   }

4. ✅ Speichern & Testen im Browser

5. ✅ Datei sollte jetzt unter "Ressourcen" → [Kategorie] sichtbar sein

*/

// ============================================
// TIPPS FÜR DATEIPFADE
// ============================================

/*

STRUKTUR:
/uploads/studiengaenge/[STUDIENGANG]/[COURSE_CODE]/[CATEGORY]/[FILENAME]

BEISPIELE:
- /uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/skript/001-2024-0730_IMT102-01_Course_Book.pdf
- /uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/musterklausuren/IMT102-01 MK3.pdf
- /uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/foliensaetze/React_Basics.pdf

KATEGORIEN:
- /skript/ → Lehrbücher und Vorlesungsskripte
- /musterklausuren/ → Prüfungsaufgaben und Lösungen
- /foliensaetze/ → Präsentationsfolien und Handouts
- /podcasts/ → Audio- und Video-Materialien
- /toturium/ → Tutorium-Unterlagen
- /tests/ → Quizze und Wissensabfragen

*/
