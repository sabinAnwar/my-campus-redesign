export const TRANSLATIONS = {
  de: {
    title: "KI Lernassistent",
    subtitle: "Dein intelligenter Begleiter für effektives Lernen",
    greeting: "Hallo!  Ich bin dein KI-Lernassistent. Ich helfe dir beim Lernen, erkläre Konzepte und gebe dir Tipps für effektives Studieren. Was möchtest du heute lernen?",
    placeholder: "Frag mich etwas zum Lernen...",
    pomodoroTitle: "Pomodoro Timer",
    focusTime: "Fokuszeit",
    breakTime: "Pause",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    minutes: "min",
    studyTipsTitle: "Prompt-Techniken",
    quickActionsTitle: "Schnellzugriff",
    streakTitle: "Lernstreak",
    days: "Tage",
    todayGoal: "Heutiges Ziel",
    completed: "abgeschlossen",
    resources: "Ressourcen",
    viewCourses: "Kurse öffnen",
    viewLibrary: "Bibliothek",
    viewSchedule: "Stundenplan",
    back: "Zurück",
    studyModes: {
      focus: "Fokus-Modus",
      review: "Wiederholung",
      practice: "Übung",
    },
    tips: [
      { title: "Pomodoro-Technik", desc: "25 Min lernen, 5 Min Pause", icon: "timer" },
      { title: "Aktives Erinnern", desc: "Teste dich selbst regelmäßig", icon: "brain" },
      { title: "Spaced Repetition", desc: "Wiederhole in Intervallen", icon: "repeat" },
      { title: "Feynman-Methode", desc: "Erkläre es einfach", icon: "lightbulb" },
    ],
    noAnswer: "Das ist eine interessante Frage! \n\nIch bin spezialisiert auf Lernthemen. Frag mich gerne:",
    commonQuestions: [
      "Wie lerne ich effektiv?",
      "Erkläre die Pomodoro-Technik",
      "Tipps gegen Prokrastination",
      "Prüfungsvorbereitung"
    ],
    fallbackSuffix: "Oder nutze den Pomodoro-Timer rechts, um direkt loszulegen! →"
  },
  en: {
    title: "AI Learning Assistant",
    subtitle: "Your intelligent companion for effective learning",
    greeting: "Hello!  I'm your AI learning assistant. I help you study, explain concepts, and give you tips for effective learning. What would you like to learn today?",
    placeholder: "Ask me something about learning...",
    pomodoroTitle: "Pomodoro Timer",
    focusTime: "Focus Time",
    breakTime: "Break",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    minutes: "min",
    studyTipsTitle: "Prompt Techniques",
    quickActionsTitle: "Quick Access",
    streakTitle: "Learning Streak",
    days: "days",
    todayGoal: "Today's Goal",
    completed: "completed",
    resources: "Resources",
    viewCourses: "Open Courses",
    viewLibrary: "Library",
    viewSchedule: "Schedule",
    back: "Back",
    studyModes: {
      focus: "Focus Mode",
      review: "Review",
      practice: "Practice",
    },
    tips: [
      { title: "Pomodoro Technique", desc: "25 min study, 5 min break", icon: "timer" },
      { title: "Active Recall", desc: "Test yourself regularly", icon: "brain" },
      { title: "Spaced Repetition", desc: "Review at intervals", icon: "repeat" },
      { title: "Feynman Method", desc: "Explain it simply", icon: "lightbulb" },
    ],
    noAnswer: "That's an interesting question! \n\nI specialize in study-related topics. Feel free to ask me about:",
    commonQuestions: [
      "How do I study effectively?",
      "Explain the Pomodoro technique",
      "Tips against procrastination",
      "Exam preparation"
    ],
    fallbackSuffix: "Or use the Pomodoro timer on the right to get started! →"
  },
};

export const LEARNING_KNOWLEDGE = {
  de: [
    {
      keywords: ["pomodoro", "timer", "pause", "konzentration", "fokus"],
      answer: ` **Die Pomodoro-Technik:**

Die Pomodoro-Technik ist eine bewährte Zeitmanagement-Methode:

**So funktioniert's:**
1. Wähle eine Aufgabe
2. Stelle den Timer auf **25 Minuten**
3. Arbeite konzentriert bis der Timer klingelt
4. Mache eine **5-Minuten-Pause**
5. Nach 4 Pomodoros: längere Pause (15-30 Min)

**Vorteile:**
•  Bessere Konzentration
•  Weniger Prokrastination
•  Messbare Fortschritte

Nutze den Timer rechts, um direkt loszulegen! →`
    },
    {
      keywords: ["lernen", "vorbereiten", "tipps", "effektiv", "strategie", "methode"],
      answer: ` **Effektive Lernstrategien:**

**Top 5 Lerntechniken:**

1. **Aktives Erinnern (Active Recall)**
   Teste dich selbst, anstatt nur zu lesen
   
2. **Spaced Repetition**
   Wiederhole in immer größeren Abständen
   
3. **Feynman-Methode**
   Erkläre das Thema so einfach wie möglich
   
4. **Mind Mapping**
   Visualisiere Zusammenhänge
   
5. **Interleaving**
   Mische verschiedene Themen beim Lernen

**Mein Tipp:** Starte mit der Pomodoro-Technik und kombiniere sie mit Active Recall!`
    },
    {
      keywords: ["motivation", "keine lust", "prokrastination", "aufschieben", "anfangen"],
      answer: ` **Motivation beim Lernen:**

**Wenn du keine Motivation hast:**

1. **2-Minuten-Regel**
   Fang nur 2 Minuten an - der Rest kommt von allein
   
2. **Kleine Ziele setzen**
   "Ich lerne 1 Seite" statt "Ich lerne alles"
   
3. **Belohnungssystem**
   Nach jeder Lerneinheit kleine Belohnung
   
4. **Lernumgebung ändern**
   Neuer Ort = neue Energie
   
5. **Warum erinnern**
   Was ist dein großes Ziel?

**Quick Win:** Starte JETZT einen 25-Min Pomodoro! `
    },
    {
      keywords: ["prüfung", "klausur", "vorbereitung", "angst", "stress"],
      answer: ` **Prüfungsvorbereitung:**

**2 Wochen vor der Prüfung:**
• Erstelle einen Lernplan
• Sammle alle Materialien
• Identifiziere Schwerpunkte

**1 Woche vorher:**
• Aktives Lernen (nicht nur Lesen!)
• Übungsaufgaben lösen
• Lerngruppe nutzen

**1 Tag vorher:**
• Nur leichte Wiederholung
• Früh schlafen gehen
• Materialien bereitlegen

**Am Prüfungstag:**
• Gutes Frühstück
• Früh da sein
• Ruhig atmen

**Bei Prüfungsangst:** 
Atme 4 Sekunden ein, halte 4 Sek., atme 4 Sek. aus `
    },
    {
      keywords: ["gedächtnis", "merken", "vergessen", "erinnern", "behalten"],
      answer: ` **Besser Merken:**

**Die Vergessenskurve überwinden:**

Nach 1 Tag vergisst du ~70% ohne Wiederholung!

**Strategien:**

1. **Wiederholungsintervalle**
   • Nach 1 Tag
   • Nach 3 Tagen
   • Nach 1 Woche
   • Nach 2 Wochen

2. **Verknüpfungen bilden**
   Verbinde Neues mit Bekanntem

3. **Visualisierung**
   Erstelle mentale Bilder

4. **Storytelling**
   Baue eine Geschichte

5. **Schlaf**
   Im Schlaf wird gelernt! 

**Tool-Tipp:** Nutze Anki für Spaced Repetition!`
    },
    {
      keywords: ["konzentration", "ablenkung", "fokus", "handy", "social media"],
      answer: ` **Konzentration verbessern:**

**Ablenkungen eliminieren:**

 **Handy:**
• Flugmodus aktivieren
• In anderen Raum legen
• App-Blocker nutzen

 **Computer:**
• Unnötige Tabs schließen
• Website-Blocker (z.B. Cold Turkey)
• Vollbild-Modus

 **Umgebung:**
• Aufgeräumter Schreibtisch
• Gute Beleuchtung
• Bequemer Stuhl

**Fokus-Booster:**
• Wasser trinken 
• Kurze Bewegung
• Tiefes Atmen

Starte jetzt den Fokus-Timer! →`
    },
    {
      keywords: ["hallo", "hi", "hey", "hilfe", "help"],
      answer: `Hallo!  Schön, dass du hier bist!

**Ich kann dir helfen mit:**

 **Lernstrategien**
"Wie lerne ich effektiv?"

 **Zeitmanagement**
"Erkläre die Pomodoro-Technik"

 **Motivation**
"Ich habe keine Motivation"

 **Prüfungsvorbereitung**
"Wie bereite ich mich auf Klausuren vor?"

 **Gedächtnistechniken**
"Wie merke ich mir Dinge besser?"

Was möchtest du wissen?`
    },
  ],
  en: [
    {
      keywords: ["pomodoro", "timer", "break", "concentration", "focus"],
      answer: ` **The Pomodoro Technique:**

The Pomodoro Technique is a proven time management method:

**How it works:**
1. Choose a task
2. Set the timer to **25 minutes**
3. Work focused until the timer rings
4. Take a **5-minute break**
5. After 4 Pomodoros: longer break (15-30 min)

**Benefits:**
•  Better concentration
•  Less procrastination
•  Measurable progress

Use the timer on the right to get started! →`
    },
    {
      keywords: ["study", "prepare", "tips", "effective", "strategy", "method"],
      answer: ` **Effective Study Strategies:**

**Top 5 Learning Techniques:**

1. **Active Recall**
   Test yourself instead of just reading
   
2. **Spaced Repetition**
   Review at increasing intervals
   
3. **Feynman Method**
   Explain the topic as simply as possible
   
4. **Mind Mapping**
   Visualize connections
   
5. **Interleaving**
   Mix different topics while studying

**My tip:** Start with the Pomodoro technique and combine it with active recall!`
    },
    {
      keywords: ["motivation", "not in the mood", "procrastination", "postpone", "start"],
      answer: ` **Motivation for Studying:**

**If you lack motivation:**

1. **2-Minute Rule**
   Just start for 2 minutes - the rest follows automatically
   
2. **Set Small Goals**
   "I'll study 1 page" instead of "I'll study everything"
   
3. **Reward System**
   A small reward after each study unit
   
4. **Change Environment**
   New place = new energy
   
5. **Remember Your Why**
   What is your big goal?

**Quick Win:** Start a 25-min Pomodoro NOW! `
    },
    {
      keywords: ["exam", "test", "preparation", "anxiety", "stress"],
      answer: ` **Exam Preparation:**

**2 weeks before the exam:**
• Create a study plan
• Gather all materials
• Identify key topics

**1 week before:**
• Active learning (not just reading!)
• Solve practice problems
• Use study groups

**1 day before:**
• Only light review
• Go to bed early
• Prepare your materials

**On exam day:**
• Good breakfast
• Arrive early
• Breathe deeply

**For exam anxiety:** 
Breathe in for 4 seconds, hold for 4, breathe out for 4 `
    },
    {
      keywords: ["memory", "remember", "forget", "recall", "retain"],
      answer: ` **Remembering Better:**

**Overcoming the Forgetting Curve:**

After 1 day, you forget ~70% without review!

**Strategies:**

1. **Repetition Intervals**
   • After 1 day
   • After 3 days
   • After 1 week
   • After 2 weeks

2. **Form Associations**
   Connect new info with what you already know

3. **Visualization**
   Create mental images

4. **Storytelling**
   Build a story

5. **Sleep**
   Your brain learns while you sleep! 

**Tool Tip:** Use Anki for spaced repetition!`
    },
    {
      keywords: ["concentration", "distraction", "focus", "phone", "social media"],
      answer: ` **Improving Concentration:**

**Eliminating Distractions:**

 **Phone:**
• Activate airplane mode
• Put it in another room
• Use app blockers

 **Computer:**
• Close unnecessary tabs
• Website blockers (e.g., Cold Turkey)
• Fullscreen mode

 **Environment:**
• Tidy desk
• Good lighting
• Comfortable chair

**Focus Booster:**
• Drink water 
• Quick movement
• Deep breathing

Start the focus timer now! →`
    },
    {
      keywords: ["hello", "hi", "hey", "help"],
      answer: `Hello!  Great to have you here!

**I can help you with:**

 **Study Strategies**
"How do I study effectively?"

 **Time Management**
"Explain the Pomodoro technique"

 **Motivation**
"I lack motivation"

 **Exam Preparation**
"How do I prepare for exams?"

 **Memory Techniques**
"How can I remember things better?"

What would you like to know?`
    },
  ],
};
