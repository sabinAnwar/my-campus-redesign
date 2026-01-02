import { getQuickSuggestions } from "~/data/chatbotKnowledge";

export const TRANSLATIONS = {
  de: {
    heroLine1: "Dein Studium.",
    heroLine2: "Einfach erklärt.",
    heroSubtitle:
      "Der intelligente Begleiter für deinen Studienerfolg. Stelle Fragen zu Organisation, Prüfungen und Campusleben.",
    chatCta: "Chat starten",
    greeting:
      "Hallo! 👋 Ich bin dein IU Assistant. Ich kann dir bei Fragen zu Prüfungen, Studienorganisation, Campus-Services und vielem mehr helfen. Was möchtest du wissen?",
    noAnswer:
      "Hmm, dazu habe ich leider keine spezifischen Informationen gefunden. 🤔\n\n**Versuche es mit:**\n- Prüfungstermine\n- E-Mail einrichten\n- Bibliothek nutzen\n- Support kontaktieren\n\nOder wende dich an: studienberatung@iu.org",
    placeholder: "Frag mich etwas z.B. 'Wann sind die Prüfungen?'",
    suggestions: getQuickSuggestions(4),
    features: [
      {
        title: "Sofortige Antworten",
        body: "Verifizierte Antworten in Echtzeit.",
        color: "blue",
        delay: "0s",
        iconName: "Zap",
      },
      {
        title: "Intelligent",
        body: "KI-gestütztes IU-Wissen.",
        color: "violet",
        delay: "0.1s",
        iconName: "Cpu",
      },
      {
        title: "Umfassend",
        body: "Von Bewerbung bis Abschluss.",
        color: "emerald",
        delay: "0.2s",
        iconName: "Globe",
      },
      {
        title: "24/7 Support",
        body: "Rund um die Uhr für dich da.",
        color: "amber",
        delay: "0.3s",
        iconName: "Shield",
      },
    ],
  },
  en: {
    heroLine1: "Your studies.",
    heroLine2: "Simply explained.",
    heroSubtitle:
      "The intelligent companion for your academic success. Ask about organization, exams, and campus life.",
    chatCta: "Start chat",
    greeting:
      "Hi! 👋 I'm your IU Assistant. I can help you with questions about exams, study organization, campus services, and much more. What would you like to know?",
    noAnswer:
      "Hmm, I couldn't find specific information on that. 🤔\n\n**Try asking about:**\n- Exam dates\n- Email setup\n- Library access\n- Contact support\n\nOr reach out to: studienberatung@iu.org",
    placeholder: "Ask me something e.g. 'When are the exams?'",
    suggestions: [
      { text: "Exam dates", question: "Wann sind die Prüfungen?" },
      {
        text: "Setup email",
        question: "Wie nutze ich meine IU E-Mail-Adresse?",
      },
      {
        text: "Retake exams",
        question: "Wie oft kann ich eine Prüfung wiederholen?",
      },
      { text: "Use library", question: "Wie nutze ich die Online-Bibliothek?" },
    ],
    features: [
      {
        title: "Instant answers",
        body: "Verified responses in real time.",
        color: "blue",
        delay: "0s",
        iconName: "Zap",
      },
      {
        title: "Intelligent",
        body: "AI-powered IU knowledge.",
        color: "violet",
        delay: "0.1s",
        iconName: "Cpu",
      },
      {
        title: "Comprehensive",
        body: "From application to graduation.",
        color: "emerald",
        delay: "0.2s",
        iconName: "Globe",
      },
      {
        title: "24/7 support",
        body: "Always here to help.",
        color: "amber",
        delay: "0.3s",
        iconName: "Shield",
      },
    ],
  },
};
