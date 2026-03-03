// IU Chatbot Knowledge Base
// This file contains all the pre-trained data for the IU Assistant chatbot

export interface KnowledgeEntry {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  synonyms?: string[];
  priority?: number; // Higher priority answers are preferred
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  //
  // PRÜFUNGEN / EXAMS
  //
  {
    id: "exam-when",
    category: "Prüfungen",
    question: "Wann sind die Prüfungen?",
    answer: ` **Prüfungszeiträume bei IU:**

**Klausurtermine:**
- Klausuren können jederzeit online über das Prüfungssystem gebucht werden
- Duales Studium: Klausuren werden am Ende jeder Theoriephase geschrieben
- Die genauen Termine findest du im MyCampus Plattform unter "Prüfungen" → "Klausurtermine"

**Wichtig zu beachten:**
- Anmeldung mindestens 7 Tage vor dem gewünschten Termin
- Abmeldung bis 24 Stunden vorher kostenlos möglich
- Bei dualen Studiengängen gelten feste Prüfungsphasen

Besuche MyCampus für deine individuellen Termine!`,
    keywords: [
      "prüfung",
      "prüfungen",
      "klausur",
      "klausuren",
      "wann",
      "termin",
      "termine",
      "exam",
      "exams",
      "when",
    ],
    synonyms: [
      "prüfungstermine",
      "klausurtermine",
      "prüfungszeit",
      "prüfungsphase",
    ],
    priority: 10,
  },
  {
    id: "exam-register",
    category: "Prüfungen",
    question: "Wie melde ich mich zu einer Prüfung an?",
    answer: ` **Prüfungsanmeldung bei IU:**

**Schritt für Schritt:**
1. Logge dich in MyCampus ein
2. Gehe zu "Prüfungen" → "Prüfungsanmeldung"
3. Wähle das Modul und den gewünschten Termin
4. Bestätige die Anmeldung

**Fristen:**
- Anmeldung: Spätestens 7 Tage vor dem Termin
- Abmeldung: Bis 24 Stunden vorher möglich

**Duales Studium:**
- Prüfungstermine werden automatisch zugeteilt
- Änderungen über die Studienberatung möglich

Bei Fragen wende dich an: pruefungsamt@iu.org`,
    keywords: [
      "anmelden",
      "anmeldung",
      "registrieren",
      "prüfung",
      "klausur",
      "register",
      "exam",
    ],
    synonyms: ["prüfungsanmeldung", "klausuranmeldung"],
    priority: 9,
  },
  {
    id: "exam-repeat",
    category: "Prüfungen",
    question: "Wie oft kann ich eine Prüfung wiederholen?",
    answer: ` **Prüfungswiederholungen bei IU:**

**Anzahl der Versuche:**
- Du hast insgesamt **3 Versuche** pro Prüfung
- 1. Versuch: Regulärer Erstversuch
- 2. Versuch: Erste Wiederholung
- 3. Versuch: Letzte Wiederholung (mündliche Ergänzungsprüfung möglich)

**Wichtig:**
- Zwischen den Versuchen müssen mind. 2 Wochen liegen
- Beim 3. Versuch kann eine mündliche Ergänzungsprüfung stattfinden
- Nach 3 nicht bestandenen Versuchen: Beratungsgespräch erforderlich

**Noten-Verbesserung:**
- Bestandene Prüfungen können zur Notenverbesserung wiederholt werden (einmalig)

Mehr Infos im Prüfungsamt!`,
    keywords: [
      "wiederholen",
      "wiederholung",
      "durchgefallen",
      "nicht bestanden",
      "versuche",
      "repeat",
      "fail",
      "failed",
    ],
    synonyms: ["nachprüfung", "zweitversuch", "drittversuch"],
    priority: 9,
  },
  {
    id: "exam-results",
    category: "Prüfungen",
    question: "Wann bekomme ich meine Prüfungsergebnisse?",
    answer: ` **Prüfungsergebnisse bei IU:**

**Bearbeitungszeiten:**
- **Online-Klausuren:** 2-4 Wochen nach Abgabe
- **Präsenz-Klausuren:** 4-6 Wochen nach Prüfung
- **Hausarbeiten/Projekte:** 4-8 Wochen nach Abgabe

**Wo finde ich die Ergebnisse?**
1. MyCampus → "Notenverwaltung"
2. Du erhältst zusätzlich eine E-Mail-Benachrichtigung

**Einspruch:**
- Bei Fragen zur Bewertung: Innerhalb von 4 Wochen "Online Einwand" stellen
- Einsichtnahme in die Prüfung über "Online Einsicht" beantragen

Die Noten werden in der Notenverwaltung gespeichert!`,
    keywords: [
      "ergebnis",
      "ergebnisse",
      "note",
      "noten",
      "wann",
      "results",
      "grade",
      "grades",
      "notenspiegel",
    ],
    synonyms: ["prüfungsergebnis", "klausurergebnis", "notendurchschnitt"],
    priority: 8,
  },
  {
    id: "exam-sick",
    category: "Prüfungen",
    question: "Was mache ich wenn ich zur Prüfung krank bin?",
    answer: ` **Prüfungsunfähigkeit bei Krankheit:**

**Sofort handeln:**
1. Melde dich **vor** der Prüfung krank (E-Mail an Prüfungsamt)
2. Besorge dir ein ärztliches Attest
3. Lade das Attest über MyCampus hoch: "Abgaben" → "Upload Bescheinigung der Prüfungsunfähigkeit"

**Fristen:**
- Attest muss innerhalb von **3 Werktagen** eingereicht werden
- Das Attest muss die Prüfungsunfähigkeit explizit bestätigen

**Bei verspäteter Meldung:**
- Der Versuch wird als "nicht bestanden" gewertet
- Ausnahmen nur in begründeten Härtefällen

Kontakt: pruefungsamt@iu.org`,
    keywords: [
      "krank",
      "krankheit",
      "attest",
      "prüfungsunfähig",
      "sick",
      "ill",
      "illness",
      "krankschreibung",
    ],
    synonyms: ["krankmeldung", "prüfung verpasst", "nicht erschienen"],
    priority: 9,
  },
  {
    id: "exam-tips",
    category: "Prüfungen",
    question: "Wie bereite ich mich auf Prüfungen vor?",
    answer: ` **Prüfungsvorbereitung - Tipps:**

**Lernmaterialien:**
-  **IU Skripte:** Alle Inhalte in MyCampus unter "Meine Kurse"
-  **IU Learn App:** Video-Tutorials und interaktive Inhalte
-  **Übungsklausuren:** In der Online-Bibliothek verfügbar
-  **Lernkarten:** Erstelle eigene oder nutze Anki

**Strategie:**
1. Lies zuerst die Modulbeschreibung und Lernziele
2. Arbeite das Skript kapitelweise durch
3. Löse Übungsaufgaben und alte Klausuren
4. Nutze Lerngruppen (über MyCampus Forums)

**Zeitplan:**
- Beginne mind. 2-3 Wochen vor der Prüfung
- Plane täglich 2-4 Stunden Lernzeit

**Vor der Prüfung:**
- Technischen Check bei Online-Klausuren
- Frühzeitig anmelden (7 Tage vorher)

Viel Erfolg! `,
    keywords: [
      "lernen",
      "vorbereiten",
      "vorbereitung",
      "tipps",
      "studieren",
      "prüfung",
      "klausur",
      "study",
      "prepare",
    ],
    synonyms: ["prüfungsvorbereitung", "lernplan", "lerntipps"],
    priority: 10,
  },
  {
    id: "dual-study-info",
    category: "Studienorganisation",
    question: "Ich bin dualer Student - was muss ich wissen?",
    answer: ` **Duales Studium bei IU - Überblick:**

**Theorie- und Praxisphasen:**
- Wechseln alle 2-3 Monate
- Genaue Termine in deinem studiengangsspezifischen Plan

**Deine Pflichten:**
-  Prüfungen am Ende der Theoriephase
-  Praxisberichte nach jeder Praxisphase (4 Wochen Frist)
-  Anwesenheit bei Präsenzveranstaltungen (falls vorgesehen)

**Vorteile:**
-  Studiengebühren zahlt dein Praxispartner
-  Du erhältst ein monatliches Gehalt
-  Alle Lernmaterialien inklusive

**Wichtige Anlaufstellen:**
- Studienberatung: studienberatung@iu.org
- Prüfungsamt: pruefungsamt@iu.org
- Praxispartner-Betreuung: Bei Fragen zu deinem Unternehmen

Was möchtest du genauer wissen?`,
    keywords: [
      "dual",
      "duales",
      "studium",
      "dualer",
      "student",
      "studentin",
      "praxispartner",
    ],
    synonyms: ["duales studium"],
    priority: 7,
  },
  {
    id: "additional-courses",
    category: "Studienorganisation",
    question: "Kann ich zusätzliche Kurse belegen?",
    answer: ` **Zusätzliche Weiterbildungskurse:**

**Kostenlose Kurse ab dem 3. Semester:**
- Du kannst zusätzlich zu deinem Studienplan Weiterbildungskurse belegen
- Kosten werden von der IU übernommen

**So geht's:**
1. MyCampus → "Studienorganisation" → "Zusatzkurs wählen"
2. Wähle einen Kurs aus dem Katalog
3. Gehe zu den "Abgaben"
4. Stelle den "Antrag auf kostenlose Online-Weiterbildung"

**Hinweis:**
- Pro Antrag nur 1 Kurs möglich
- Für mehrere Kurse: Separate Anträge stellen

**Beispiel-Kurse:**
- Projektmanagement
- Digital Skills
- Marketing
- und viele mehr!

Mehr Info in der Studienorganisation!`,
    keywords: [
      "weiterbildung",
      "weiterbildungskurse",
      "zusatzkurs",
      "zusatzkurse",
      "extra",
      "kurse",
      "linkedin",
    ],
    synonyms: ["zusätzliche kurse", "weitere kurse", "online weiterbildung"],
    priority: 8,
  },

  //
  // STUDIENORGANISATION / STUDY ORGANIZATION
  //
  {
    id: "semester-dates",
    category: "Studienorganisation",
    question: "Wann beginnt und endet das Semester?",
    answer: ` **Semesterzeiten bei IU Dual:**

**Wintersemester:**
- Start: 1. Oktober
- Ende: 31. März

**Sommersemester:**
- Start: 1. April
- Ende: 30. September

**Theorie- und Praxisphasen:**
- Wechseln alle 2-3 Monate
- Genaue Termine im Studienplan in MyCampus

**Wichtige Fristen:**
- Rückmeldung zum nächsten Semester beachten
- Urlaubssemester müssen rechtzeitig beantragt werden

Aktuelle Termine findest du in deinem MyCampus-Kalender!`,
    keywords: [
      "semester",
      "semesterstart",
      "semesterende",
      "beginn",
      "ende",
      "start",
      "term",
      "dates",
    ],
    synonyms: ["semesterzeiten", "vorlesungszeit", "vorlesungsbeginn"],
    priority: 8,
  },
  {
    id: "specialization",
    category: "Studienorganisation",
    question: "Wie wähle ich meine Vertiefung?",
    answer: ` **Vertiefungswahl bei IU:**

**Wann wählen?**
- Nach dem 4. Semester (vor Beginn des 5. Semesters)
- Die Kurse werden im 5. und 6. Semester belegt

**So geht's:**
1. MyCampus → "Studienorganisation" → "Vertiefungswahl"
2. Wähle deine gewünschte Vertiefungsrichtung
3. Bestätige die Auswahl

**Verfügbare Vertiefungen (je nach Studiengang):**
- Datenanalyse / Data Analytics
- Software Engineering
- Projektmanagement
- ... und weitere je nach Studiengang

**Änderungen:**
- Bis zum Semesterbeginn möglich
- Danach nur mit Antrag auf Vertiefungswechsel

Besuche die Vertiefungswahl-Seite für Details!`,
    keywords: [
      "vertiefung",
      "vertiefungswahl",
      "spezialisierung",
      "schwerpunkt",
      "specialization",
      "major",
    ],
    synonyms: ["vertiefungsrichtung", "schwerpunktwahl"],
    priority: 8,
  },
  {
    id: "practical-report",
    category: "Studienorganisation",
    question: "Wie reiche ich meinen Praxisbericht ein?",
    answer: ` **Praxisbericht einreichen:**

**Anforderungen:**
- Umfang: 8-12 Seiten (je nach Semester)
- Format: PDF
- Frist: Spätestens 4 Wochen nach Praxisphase

**Einreichung:**
1. MyCampus → "Meine Kurse" → "Praxisberichte"
2. Neuen Bericht hochladen
3. Vorlagen unter "Downloads" verfügbar

**Inhalt:**
- Beschreibung der Aufgaben
- Lernziele und -erfahrungen
- Reflexion der Praxisphase
- Unterschrift des Praxispartners erforderlich

**Bewertung:**
- Bestanden/Nicht bestanden
- Feedback innerhalb von 4 Wochen

Bei Fragen: studienberatung@iu.org`,
    keywords: [
      "praxisbericht",
      "einreichen",
      "praktikum",
      "praxis",
      "bericht",
      "report",
      "practical",
      "internship",
    ],
    synonyms: ["praktikumsbericht", "praxisphase"],
    priority: 8,
  },
  {
    id: "thesis-registration",
    category: "Studienorganisation",
    question: "Wie melde ich meine Bachelorarbeit an?",
    answer: ` **Bachelorarbeit Anmeldung:**

**Voraussetzungen:**
- Mindestens 150 ECTS erreicht
- Alle Pflichtmodule der ersten 5 Semester bestanden
- Thema und Betreuer gefunden

**Anmeldung:**
1. MyCampus → "Abgaben"
2. "Anmeldung zur Abschlussarbeit Erst-/Zweitversuch"
3. Formular ausfüllen mit:
   - Arbeitstitel
   - Betreuer (Erst- und Zweitprüfer)
   - Geplantes Startdatum

**Bearbeitungszeit:**
- 3 Monate (Vollzeit-Bearbeitung)
- Verlängerung möglich (max. 4 Wochen)

**Bei Fragen:**
abschlussarbeiten@iu.org`,
    keywords: [
      "bachelorarbeit",
      "thesis",
      "abschlussarbeit",
      "anmeldung",
      "bachelor",
      "anmelden",
    ],
    synonyms: ["ba-arbeit", "bachelor thesis", "abschluss"],
    priority: 9,
  },

  //
  // CAMPUS & SERVICES
  //
  {
    id: "email-setup",
    category: "IT & Services",
    question: "Wie nutze ich meine IU E-Mail-Adresse?",
    answer: ` **IU E-Mail einrichten:**

**Deine E-Mail-Adresse:**
- Format: vorname.nachname@iu-study.org
- Zugang über: mail.iu.org oder Outlook

**Erstanmeldung:**
1. Gehe zu: mail.iu.org
2. Login mit deiner Matrikelnummer
3. Erstpasswort: Dein Geburtsdatum (TTMMJJJJ)
4. Passwort beim ersten Login ändern

**Outlook App einrichten:**
- Server: outlook.office365.com
- E-Mail: deine IU-Adresse
- Passwort: dein IU-Passwort

**Wichtig:**
- Alle offiziellen IU-Nachrichten gehen an diese Adresse
- Regelmäßig prüfen!

IT-Support: it-support@iu.org`,
    keywords: [
      "email",
      "e-mail",
      "mail",
      "outlook",
      "einrichten",
      "setup",
      "passwort",
    ],
    synonyms: ["iu mail", "mailbox", "postfach"],
    priority: 8,
  },
  {
    id: "library",
    category: "IT & Services",
    question: "Wie nutze ich die Online-Bibliothek?",
    answer: ` **IU Online-Bibliothek:**

**Zugang:**
1. MyCampus → "Bibliothek"
2. Oder direkt: bibliothek.iu.org

**Verfügbare Ressourcen:**
-  E-Books (über 80.000 Titel)
-  Wissenschaftliche Journals
-  Springer, Statista, EBSCO
-  Hausarbeiten-Datenbank

**Springer Campus:** 
- Alle IU-Skripte als PDF
- Download für offline-Nutzung

**Fernleihe:**
- Bücher aus anderen Bibliotheken bestellen
- Kostenfrei für IU-Studierende

**Zitier-Tools:**
- Citavi, Zotero Integration
- Literaturverwaltung

Öffne die Bibliothek im MyCampus!`,
    keywords: [
      "bibliothek",
      "library",
      "bücher",
      "ebook",
      "springer",
      "literatur",
      "recherche",
    ],
    synonyms: ["online bibliothek", "bib", "bücherei"],
    priority: 7,
  },
  {
    id: "room-booking",
    category: "Campus",
    question: "Wie buche ich einen Raum am Campus?",
    answer: ` **Raumbuchung am Campus:**

**Online buchen:**
1. MyCampus → "Raumbuchung"
2. Campus und Datum wählen
3. Verfügbare Räume anzeigen
4. Timeslot auswählen und buchen

**Verfügbare Räume:**
-  Lernräume (1-4 Personen)
-  Gruppenräume (5-10 Personen)
-  PC-Räume
-  Präsentationsräume

**Buchungsregeln:**
- Max. 4 Stunden pro Tag
- Stornierung bis 2h vorher
- No-Show = 24h Sperre

**Öffnungszeiten:**
- Mo-Fr: 8:00 - 20:00 Uhr
- Sa: 9:00 - 17:00 Uhr

Fragen: campusservice@iu.org`,
    keywords: [
      "raum",
      "buchen",
      "buchung",
      "raumbuchung",
      "room",
      "booking",
      "campus",
      "lernraum",
    ],
    synonyms: ["raum reservieren", "gruppenraum", "studierraum"],
    priority: 7,
  },
  {
    id: "student-id",
    category: "Campus",
    question: "Wie bekomme ich meinen Studentenausweis?",
    answer: ` **Studentenausweis bei IU:**

**Digitaler Ausweis:**
- In der MyCampus App verfügbar
- QR-Code für Campus-Zugang
- Sofort nach Immatrikulation aktiv

**Physische Karte:**
- Am Campus-Automaten drucken
- Benötigt: Matrikelnummer + Foto
- Gültig für das gesamte Studium

**Funktionen:**
-  Semesterticket (je nach Campus)
-  Mensa-Bezahlung
-  Bibliotheksausweis
-  Campus-Zugang

**Verloren?**
- Digitaler Ausweis: Immer verfügbar
- Physisch: Am Automaten neu drucken

Fragen: studierendensekretariat@iu.org`,
    keywords: [
      "studentenausweis",
      "ausweis",
      "student id",
      "card",
      "karte",
      "semesterticket",
    ],
    synonyms: ["studierendenausweis", "campuscard", "iCard"],
    priority: 6,
  },

  //
  // FINANZEN / FINANCES
  //
  {
    id: "tuition-fees",
    category: "Finanzen",
    question: "Wie hoch sind die Studiengebühren?",
    answer: ` **Studiengebühren IU Dual:**

**Duales Studium:**
- Studiengebühren werden vom Praxispartner übernommen!
- Keine direkten Kosten für dich

**Was ist inklusive:**
- Alle Lernmaterialien
- E-Books und Online-Bibliothek
- iPad (je nach Modell)
- Prüfungsgebühren

**Optionale Kosten:**
- Semesterticket (Campus-abhängig)
- Zusätzliche Zertifikate

**Praxispartner-Vertrag:**
- Der Arbeitgeber zahlt die Gebühren
- Du erhältst zusätzlich ein Gehalt

Bei Fragen: studienfinanzierung@iu.org`,
    keywords: [
      "gebühren",
      "studiengebühren",
      "kosten",
      "geld",
      "bezahlen",
      "tuition",
      "fees",
      "payment",
    ],
    synonyms: ["semestergebühr", "studienkosten"],
    priority: 7,
  },

  //
  // ERASMUS & INTERNATIONAL
  //
  {
    id: "erasmus",
    category: "International",
    question: "Ist die IU Teil des Erasmus-Programms?",
    answer: ` **Erasmus+ an der IU:**

**Ja, die IU nimmt am Erasmus+ Programm teil!**

**Möglichkeiten:**
-  Auslandssemester (3-12 Monate)
-  Auslandspraktikum (2-12 Monate)
-  Partnerhochschulen in 30+ Ländern

**Voraussetzungen:**
- Mindestens 2 Semester abgeschlossen
- Ausreichende Sprachkenntnisse
- Genehmigung vom Studiengang

**Förderung:**
- Monatlicher Zuschuss (300-450€)
- Reisekostenpauschale
- Keine Gebühren an der Partnerhochschule

**Bewerbung:**
1. International Office kontaktieren
2. Spätestens 6 Monate vor Start

Kontakt: international@iu.org`,
    keywords: [
      "erasmus",
      "ausland",
      "international",
      "auslandssemester",
      "exchange",
      "abroad",
    ],
    synonyms: ["auslandsaufenthalt", "partnerhochschule", "semester abroad"],
    priority: 8,
  },

  //
  // HILFE & SUPPORT
  //
  {
    id: "contact-support",
    category: "Support",
    question: "Wie erreiche ich den Support?",
    answer: ` **IU Support Kontakte:**

**Studienberatung:**
-  studienberatung@iu.org
-  +49 30 31198810
- Mo-Fr: 8:00-20:00 Uhr

**Prüfungsamt:**
-  pruefungsamt@iu.org
- Für Prüfungsfragen und Anträge

**IT-Support:**
-  it-support@iu.org
- Technische Probleme mit MyCampus

**Career Service:**
-  career@iu.org
- Bewerbungen und Karriereberatung

**Studierendensekretariat:**
-  studierendensekretariat@iu.org
- Bescheinigungen und Dokumente

**Live-Chat:**
- Verfügbar in MyCampus (rechts unten)
- Mo-Fr: 9:00-18:00 Uhr`,
    keywords: [
      "support",
      "hilfe",
      "kontakt",
      "help",
      "contact",
      "telefon",
      "email",
      "erreichen",
    ],
    synonyms: ["ansprechpartner", "hotline", "beratung"],
    priority: 9,
  },
  {
    id: "mental-health",
    category: "Support",
    question: "Gibt es psychologische Beratung?",
    answer: ` **Psychologische Unterstützung bei IU:**

**Kostenlose Beratung:**
- Vertrauliche Gespräche
- Einzelberatung möglich
- Online und auf dem Campus

**Themen:**
-  Prüfungsangst
-  Stressmanagement
-  Motivationsprobleme
-  Work-Life-Balance

**Termin buchen:**
1. MyCampus → "Student Wellbeing"
2. Oder: wellbeing@iu.org

**Externe Hilfe:**
- Telefonseelsorge: 0800 111 0 111 (kostenlos, 24/7)
- Studierendenwerk: Psychologische Beratungsstelle

Du bist nicht allein! `,
    keywords: [
      "psychologisch",
      "mental",
      "beratung",
      "stress",
      "angst",
      "depression",
      "hilfe",
      "wellbeing",
    ],
    synonyms: ["psychologische beratung", "seelische gesundheit", "burnout"],
    priority: 8,
  },

  //
  // FALLBACK ANSWERS
  //
  {
    id: "greeting-hi",
    category: "Allgemein",
    question: "Hallo",
    answer: ` Hallo! Ich bin der IU Assistant und helfe dir gerne bei Fragen rund ums Studium.

**Beliebte Themen:**
-  Prüfungen & Termine
-  Studienorganisation
-  Campus & Services
-  Support & Hilfe

Was möchtest du wissen?`,
    keywords: ["hallo", "hi", "hey", "moin", "guten tag", "hello", "servus"],
    synonyms: ["grüß gott", "guten morgen", "guten abend"],
    priority: 1,
  },
  {
    id: "greeting-thanks",
    category: "Allgemein",
    question: "Danke",
    answer: `Gerne geschehen! 

Kann ich dir noch bei etwas anderem helfen?

**Weitere Themen:**
-  Prüfungstermine
-  E-Mail einrichten
-  Campus-Services
-  Bibliothek nutzen`,
    keywords: ["danke", "thanks", "vielen dank", "dankeschön", "thank you"],
    synonyms: ["thx", "merci"],
    priority: 1,
  },
];

// Function to find the best matching answer with smart intent detection
export function findBestAnswer(query: string, knowledgeBase: KnowledgeEntry[]): KnowledgeEntry | null {
  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 1);
  
  // If query is too short or vague, return null to use fallback
  if (normalizedQuery.length < 3 || queryWords.length === 0) {
    return null;
  }
  
  let bestMatch: KnowledgeEntry | null = null;
  let bestScore = 0;
  
  // Common stop words to ignore
  const stopWords = new Set([
    'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'bin', 'ist', 'sind', 'habe', 'hat',
    'mit', 'und', 'oder', 'der', 'die', 'das', 'ein', 'eine', 'einer', 'einem',
    'zu', 'von', 'in', 'an', 'auf', 'für', 'bei', 'nach', 'noch', 'was', 'wie',
    'wo', 'wer', 'soll', 'kann', 'muss', 'will', 'mir', 'mich', 'kein', 'keine',
    'the', 'a', 'an', 'is', 'are', 'have', 'has', 'my', 'me', 'i', 'you', 'it'
  ]);
  
  // Filter out stop words from query
  const meaningfulWords = queryWords.filter(w => !stopWords.has(w) && w.length > 2);
  
  for (const entry of knowledgeBase) {
    let score = 0;
    let keywordMatches = 0;
    
    // Skip greetings for non-greeting queries
    if (entry.id.startsWith('greeting-') && meaningfulWords.length > 1) {
      continue;
    }
    
    // 1. EXACT QUESTION MATCH (highest priority)
    if (entry.question.toLowerCase() === normalizedQuery) {
      return entry; // Perfect match, return immediately
    }
    
    // 2. Check if query is a substantial part of the question
    const entryQuestionLower = entry.question.toLowerCase();
    if (entryQuestionLower.includes(normalizedQuery) && normalizedQuery.length > 10) {
      score += 50;
    }
    
    // 3. KEYWORD MATCHING - require actual matches
    for (const keyword of entry.keywords) {
      const keywordLower = keyword.toLowerCase();
      
      // Exact keyword in query
      if (normalizedQuery.includes(keywordLower) && keywordLower.length > 2) {
        score += 15;
        keywordMatches++;
      }
      
      // Check if any meaningful word matches keyword
      for (const word of meaningfulWords) {
        if (word === keywordLower) {
          score += 20;
          keywordMatches++;
        } else if (keywordLower.startsWith(word) && word.length > 3) {
          // Word is beginning of keyword (e.g., "prüf" matches "prüfung")
          score += 10;
          keywordMatches++;
        }
      }
    }
    
    // 4. SYNONYM MATCHING
    if (entry.synonyms) {
      for (const synonym of entry.synonyms) {
        if (normalizedQuery.includes(synonym.toLowerCase())) {
          score += 20;
          keywordMatches++;
        }
      }
    }
    
    // 5. CONTEXT DETECTION - penalize wrong context
    // If query mentions "kein" or "nicht" + topic, it's likely a problem
    const hasNegation = normalizedQuery.includes('kein') || normalizedQuery.includes('nicht') || 
                        normalizedQuery.includes('ohne') || normalizedQuery.includes('fehlt');
    
    // If user says they DON'T have something, don't answer with how to submit it
    if (hasNegation && (entry.id === 'practical-report' || entry.id === 'thesis-registration')) {
      score = 0; // Reset score for these entries
    }
    
    // 6. INTENT DETECTION
    // "lernen" or "vorbereiten" → exam preparation (currently no entry for this)
    const studyKeywords = ['lernen', 'vorbereiten', 'vorbereitung', 'tipps', 'studying'];
    const hasStudyIntent = studyKeywords.some(k => normalizedQuery.includes(k));
    if (hasStudyIntent && entry.id !== 'exam-tips') {
      // Reduce score if we don't have study tips entry
      score *= 0.3;
    }
    
    // "dual" or "duales" without specific topic
    if (normalizedQuery.includes('dual') && keywordMatches < 2) {
      score *= 0.5;
    }
    
    // 7. Apply priority as a tiebreaker, not a multiplier
    score += (entry.priority || 0) * 0.5;
    
    // 8. MINIMUM KEYWORD REQUIREMENT
    // Require at least 1 meaningful keyword match for short queries
    // Require at least 2 for longer ambiguous queries
    const minKeywords = queryWords.length > 5 ? 2 : 1;
    if (keywordMatches < minKeywords) {
      score *= 0.3; // Heavily penalize low keyword matches
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }
  
  // Higher threshold - require meaningful matches
  const minThreshold = meaningfulWords.length > 3 ? 15 : 10;
  return bestScore >= minThreshold ? bestMatch : null;
}

// Function to get category-based suggestions
export function getCategorySuggestions(category: string, knowledgeBase: KnowledgeEntry[]): KnowledgeEntry[] {
  return knowledgeBase
    .filter(entry => entry.category === category)
    .slice(0, 3);
}

// Function to get random quick suggestions
export function getQuickSuggestions(count: number = 4): { text: string; question: string }[] {
  const suggestions = [
    { text: "Prüfungstermine", question: "Wann sind die Prüfungen?" },
    { text: "E-Mail einrichten", question: "Wie nutze ich meine IU E-Mail-Adresse?" },
    { text: "Prüfung wiederholen", question: "Wie oft kann ich eine Prüfung wiederholen?" },
    { text: "Bibliothek nutzen", question: "Wie nutze ich die Online-Bibliothek?" },
    { text: "Bachelorarbeit", question: "Wie melde ich meine Bachelorarbeit an?" },
    { text: "Erasmus", question: "Ist die IU Teil des Erasmus-Programms?" },
    { text: "Raum buchen", question: "Wie buche ich einen Raum am Campus?" },
    { text: "Support erreichen", question: "Wie erreiche ich den Support?" },
  ];
  
  // Shuffle and return
  return suggestions.sort(() => Math.random() - 0.5).slice(0, count);
}
