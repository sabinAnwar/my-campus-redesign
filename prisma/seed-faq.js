import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const faqData = [
  {
    question: "wie nutze ich meine iu e-mail-adresse",
    answer: "Deine IU-E-Mail-Adresse endet auf @iu-study.org. Du kannst dich über Outlook oder Office365 anmelden. Die Login-Daten findest du in deinem IU-Portal unter 'Mein Profil'.",
    category: "studium",
    keywords: JSON.stringify(["email", "e-mail", "outlook", "office365"])
  },
  {
    question: "wie setze ich mein office 365 passwort zurück",
    answer: "Über das IU-Portal unter 'Passwort zurücksetzen' findest du die entsprechende Anleitung. Du kannst auch direkt auf der Office365-Login-Seite auf 'Passwort vergessen' klicken.",
    category: "studium",
    keywords: JSON.stringify(["passwort", "password", "reset", "office365"])
  },
  {
    question: "ist die iu teil des erasmus-programms",
    answer: "Ja, die IU kooperiert mit verschiedenen Partnerhochschulen im Rahmen des Erasmus-Programms. Du kannst dich im International Office über aktuelle Partneruniversitäten informieren.",
    category: "beliebt",
    keywords: JSON.stringify(["erasmus", "ausland", "international", "partnerhochschule"])
  },
  {
    question: "wie melde ich mich zum iu-shop an",
    answer: "Du kannst dich über dein IU-Login im Shop anmelden und von exklusiven Angeboten profitieren. Der Shop ist direkt über das IU-Portal erreichbar.",
    category: "beliebt",
    keywords: JSON.stringify(["shop", "anmelden", "login"])
  },
  {
    question: "wie finde ich die e-mail-adresse meines lehrenden",
    answer: "Die Kontaktdaten deiner Lehrenden findest du im Kursbereich deiner Lernplattform. Klicke auf den jeweiligen Kurs und dann auf 'Lehrende'.",
    category: "kurse",
    keywords: JSON.stringify(["lehrende", "dozent", "professor", "email", "kontakt"])
  },
  {
    question: "wie oft kann ich eine prüfung wiederholen",
    answer: "In der Regel darfst du jede Prüfung zweimal wiederholen. Das bedeutet, du hast insgesamt drei Versuche für jede Prüfung. Bei speziellen Fällen wende dich bitte an das Prüfungsamt.",
    category: "prüfungen",
    keywords: JSON.stringify(["prüfung", "wiederholen", "versuche", "prüfungsamt"])
  },
  {
    question: "was passiert bei krankheit am prüfungstag",
    answer: "Reiche ein ärztliches Attest beim Prüfungsamt ein, um einen Nachholtermin zu beantragen. Das Attest muss spätestens 3 Tage nach dem Prüfungstermin eingereicht werden.",
    category: "prüfungen",
    keywords: JSON.stringify(["krank", "krankheit", "attest", "nachholtermin"])
  },
  {
    question: "wie viele wochenarbeitsstunden muss ich leisten",
    answer: "Die Wochenarbeitszeit wird individuell mit deinem Praxispartner vereinbart. In der Regel liegt sie zwischen 20 und 40 Stunden, abhängig von deinem Studienmodell.",
    category: "praxisphase",
    keywords: JSON.stringify(["arbeitsstunden", "wochenarbeitszeit", "praxispartner"])
  },
  {
    question: "wie reiche ich meinen praxisbericht ein",
    answer: "Du kannst den Bericht im IU Campus unter 'Praxisphase' hochladen. Achte darauf, dass der Bericht das richtige Format hat und alle erforderlichen Unterschriften enthält.",
    category: "praxisphase",
    keywords: JSON.stringify(["praxisbericht", "einreichen", "hochladen", "praxis"])
  },
  {
    question: "welche vorteile bietet bring a friend",
    answer: "Du erhältst attraktive Prämien, wenn du neue Studierende wirbst. Die genauen Konditionen findest du auf der IU-Website unter 'Bring a Friend'.",
    category: "angebote",
    keywords: JSON.stringify(["bring a friend", "werben", "prämie"])
  },
  {
    question: "wie nutze ich linkedin learning",
    answer: "Mit deinem IU-Account erhältst du kostenlosen Zugang zu allen Kursen auf LinkedIn Learning. Die Zugangsdaten findest du im IU-Portal unter 'Zusätzliche Services'.",
    category: "angebote",
    keywords: JSON.stringify(["linkedin", "learning", "kurse"])
  }
];

async function seedFAQ() {
  console.log('🌱 Seeding FAQ data...');

  try {
    // Delete existing FAQs
    await prisma.fAQ.deleteMany({});
    console.log('✅ Cleared existing FAQ data');

    // Create new FAQs
    for (const faq of faqData) {
      await prisma.fAQ.create({
        data: faq
      });
    }

    console.log(`✅ Created ${faqData.length} FAQ entries`);
    console.log('🎉 FAQ seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding FAQ:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedFAQ();
