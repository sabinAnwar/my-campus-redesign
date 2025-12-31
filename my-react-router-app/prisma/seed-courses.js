import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding courses...");

  // Create all Studiengang (study programs)
  const wirtschaftsinformatik = await prisma.studiengang.upsert({
    where: { name: "Wirtschaftsinformatik" },
    update: {},
    create: {
      name: "Wirtschaftsinformatik",
      description: "Bachelor of Science Wirtschaftsinformatik",
    },
  });

  const informatik = await prisma.studiengang.upsert({
    where: { name: "Informatik (Dual)" },
    update: {},
    create: {
      name: "Informatik (Dual)",
      description: "Bachelor of Science Informatik",
    },
  });

  const marketing = await prisma.studiengang.upsert({
    where: { name: "Marketing (Dual)" },
    update: {},
    create: {
      name: "Marketing (Dual)",
      description: "Bachelor of Arts Marketing",
    },
  });

  const bwl = await prisma.studiengang.upsert({
    where: { name: "BWL (Dual)" },
    update: {},
    create: {
      name: "BWL (Dual)",
      description: "Bachelor of Arts Betriebswirtschaftslehre",
    },
  });

  const dataScience = await prisma.studiengang.upsert({
    where: { name: "Data Science (Dual)" },
    update: {},
    create: {
      name: "Data Science (Dual)",
      description: "Bachelor of Science Data Science",
    },
  });

  console.log(
    "✅ Created/Updated Studiengänge:",
    wirtschaftsinformatik.name,
    informatik.name,
    marketing.name,
    bwl.name,
    dataScience.name
  );

  // Course data aligned with Modulhandbuch (Semester 1-7)
  const coursesData = [
    {
      code: "WI-101",
      name: "Programmierung & Software Engineering",
      description:
        "Grundlagen der Softwareentwicklung mit Fokus auf wartbare Architektur, Versionskontrolle und Testautomatisierung.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-102",
      name: "Mathematik & Statistik fuer Data Science",
      description:
        "Mathematische Werkzeuge fuer datengetriebene Entscheidungen und erste Schritte in der explorativen Datenanalyse.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-103",
      name: "Betriebswirtschaftliche Grundlagen",
      description: "BWL-Grundlagen fuer Wirtschaftsinformatiker.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-104",
      name: "Kommunikation & Teamarbeit",
      description: "Kommunikation, Teamarbeit und Praesentation.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-105",
      name: "Projektarbeit 1",
      description: "Projektarbeit 1 fuer duale Studierende.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-201",
      name: "Datenbanken & SQL Engineering",
      description:
        "Relationale Modellierung, Normalformen, Query-Optimierung und API-Anbindung mit praxisnahen Cases.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-202",
      name: "IT-Management & Governance",
      description:
        "Steuerung von IT-Landschaften, Service-Management und Risikobetrachtung fuer digitale Transformation.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-203",
      name: "Requirements Engineering",
      description: "Requirements Engineering und Spezifikationstechniken.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-204",
      name: "Statistik II",
      description: "Vertiefung Statistik mit Anwendungen in der Datenanalyse.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-205",
      name: "Projektarbeit 2",
      description: "Projektarbeit 2 fuer duale Studierende.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-301",
      name: "Data & Process Analytics",
      description:
        "Analytische Auswertung von Prozessen, KPI-Design und Visualisierung datenbasierter Handlungsempfehlungen.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-302",
      name: "Cloud Architekturen & DevOps",
      description:
        "Deployment-Strategien, Observability und Automatisierung fuer skalierbare Anwendungen in der Cloud.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-303",
      name: "IT-Recht & Compliance",
      description:
        "IT-Recht, Datenschutz und Vertragsrecht im digitalen Umfeld.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-304",
      name: "UX & Design Thinking",
      description: "UX und Design Thinking mit Prototyping.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-305",
      name: "Projektarbeit 3",
      description: "Projektarbeit 3 fuer duale Studierende.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-401",
      name: "Advanced Analytics & Machine Learning",
      description:
        "Modellierung, Evaluierung und Operationalisierung von ML-Loesungen mit Fokus auf Business Impact.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-402",
      name: "Digital Strategy & Product Leadership",
      description:
        "Nutzerzentrierte Produktentwicklung, Priorisierung und Go-to-Market-Plan im digitalen Kontext.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-403",
      name: "Data Warehousing",
      description: "Data Warehousing, ETL Pipelines und Modellierung.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-404",
      name: "Projektmanagement",
      description: "Projektmanagement mit Planung, Risiko und Steuerung.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-405",
      name: "Projektarbeit 4",
      description: "Projektarbeit 4 fuer duale Studierende.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-501",
      name: "Enterprise Architecture & BPM",
      description:
        "Architektur- und Prozessgestaltung fuer skalierende Organisationen inkl. BPMN und EA-Patterns.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-502",
      name: "IT-Consulting & Kommunikation",
      description:
        "IT-Consulting mit Fokus auf Workshops, Storylining und Umsetzungsplaene fuer Stakeholder.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-503",
      name: "Change Management",
      description: "Change Management in IT-Projekten.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-504",
      name: "Agile Leadership",
      description: "Agile Leadership, Moderation und Servant Leadership.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-505",
      name: "Projektarbeit 5",
      description: "Projektarbeit 5 fuer duale Studierende.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-601",
      name: "IT-Security & Compliance",
      description:
        "IT-Security, Datenschutz und Compliance mit Risikoanalyse und technischen Kontrollen.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-602",
      name: "Data Governance & Ethics",
      description:
        "Datenqualitaet, Governance-Modelle und ethische Leitplanken fuer datengetriebene Produkte.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-603",
      name: "Cloud Security",
      description:
        "Cloud Security, Identity und Compliance Kontrollen in verteilten Systemen.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-604",
      name: "Business Intelligence",
      description:
        "Business Intelligence mit Datenmodellen, KPIs und Visualisierung.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-605",
      name: "Projektarbeit 6",
      description: "Projektarbeit 6 fuer duale Studierende.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-701",
      name: "Bachelorarbeit",
      description:
        "Eigenstaendige wissenschaftliche Arbeit mit Kolloquium, Themenfokus Wirtschaftsinformatik.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-702",
      name: "Praxistransfer Projekt",
      description:
        "Praxisprojekt mit Unternehmensbezug, Abschluss durch schriftlichen Bericht und Praesentation.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-703",
      name: "Digital Strategy Lab",
      description:
        "Strategische Entwicklung digitaler Produkte, Team-Pitch und persoenliche Reflexion.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-704",
      name: "Career Lab",
      description:
        "Career Lab mit Fokus auf Profil, Pitch und Bewerbungsunterlagen.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-705",
      name: "Projektarbeit 7",
      description: "Projektarbeit 7 fuer duale Studierende.",
      studiengangId: wirtschaftsinformatik.id,
    },

    // ========================================
    // INFORMATIK (DUAL) COURSES
    // ========================================
    {
      code: "INF-101",
      name: "Programmierung I - Java",
      description:
        "Grundlagen der Programmierung mit Java, OOP und Datenstrukturen.",
      studiengangId: informatik.id,
    },
    {
      code: "INF-102",
      name: "Mathematik für Informatiker I",
      description: "Analysis und Lineare Algebra für Informatiker.",
      studiengangId: informatik.id,
    },
    {
      code: "INF-103",
      name: "Technische Informatik",
      description:
        "Hardware-Grundlagen, Rechnerarchitektur und Betriebssysteme.",
      studiengangId: informatik.id,
    },
    {
      code: "INF-201",
      name: "Programmierung II - C++",
      description:
        "Fortgeschrittene Programmierung mit C++, Templates und Memory Management.",
      studiengangId: informatik.id,
    },
    {
      code: "INF-202",
      name: "Algorithmen & Datenstrukturen",
      description: "Komplexitätsanalyse, Sortierverfahren, Graphen und Bäume.",
      studiengangId: informatik.id,
    },
    {
      code: "INF-301",
      name: "Softwaretechnik",
      description: "Software Engineering Methoden, UML und Clean Code.",
      studiengangId: informatik.id,
    },
    {
      code: "INF-302",
      name: "Datenbanksysteme",
      description: "Relationale und NoSQL Datenbanken, SQL und Transaktionen.",
      studiengangId: informatik.id,
    },
    {
      code: "INF-401",
      name: "Web-Technologien",
      description:
        "Frontend- und Backend-Entwicklung mit modernen Web-Frameworks.",
      studiengangId: informatik.id,
    },
    {
      code: "INF-402",
      name: "Verteilte Systeme",
      description: "Microservices, REST APIs und Cloud-native Entwicklung.",
      studiengangId: informatik.id,
    },
    {
      code: "INF-501",
      name: "Machine Learning",
      description: "Supervised und Unsupervised Learning, Neural Networks.",
      studiengangId: informatik.id,
    },
    {
      code: "INF-601",
      name: "IT-Security",
      description:
        "Kryptographie, Netzwerksicherheit und sichere Softwareentwicklung.",
      studiengangId: informatik.id,
    },
    {
      code: "INF-701",
      name: "Bachelorarbeit Informatik",
      description: "Wissenschaftliche Abschlussarbeit mit praktischem Fokus.",
      studiengangId: informatik.id,
    },

    // ========================================
    // MARKETING (DUAL) COURSES - Laura's Program
    // ========================================
    {
      code: "MKT-101",
      name: "Marketing Grundlagen",
      description: "Marketing-Mix, Marktforschung und Konsumentenverhalten.",
      studiengangId: marketing.id,
    },
    {
      code: "MKT-102",
      name: "BWL für Marketing",
      description:
        "Betriebswirtschaftliche Grundlagen für Marketing-Studierende.",
      studiengangId: marketing.id,
    },
    {
      code: "MKT-103",
      name: "Wirtschaftsmathematik",
      description: "Mathematische Methoden für Wirtschaftswissenschaften.",
      studiengangId: marketing.id,
    },
    {
      code: "MKT-201",
      name: "Digital Marketing",
      description: "Online-Marketing, SEO, SEA und Performance Marketing.",
      studiengangId: marketing.id,
    },
    {
      code: "MKT-202",
      name: "Content Marketing & Storytelling",
      description: "Content-Strategien, Storytelling und Brand Building.",
      studiengangId: marketing.id,
    },
    {
      code: "MKT-301",
      name: "Social Media Marketing",
      description:
        "Social Media Strategien, Influencer Marketing und Community Management.",
      studiengangId: marketing.id,
    },
    {
      code: "MKT-302",
      name: "Marktforschung & Analytics",
      description:
        "Quantitative und qualitative Marktforschung, Data Analytics.",
      studiengangId: marketing.id,
    },
    {
      code: "MKT-401",
      name: "Brand Management",
      description: "Markenführung, Markenpositionierung und Markenarchitektur.",
      studiengangId: marketing.id,
    },
    {
      code: "MKT-402",
      name: "Kampagnenmanagement",
      description:
        "Integrierte Marketingkampagnen, Media Planning und Budgetierung.",
      studiengangId: marketing.id,
    },
    {
      code: "MKT-501",
      name: "E-Commerce & Conversion",
      description:
        "Online-Shops, Customer Journey und Conversion Optimization.",
      studiengangId: marketing.id,
    },
    {
      code: "MKT-601",
      name: "Marketing Strategie",
      description:
        "Strategisches Marketing, Wettbewerbsanalyse und Positionierung.",
      studiengangId: marketing.id,
    },
    {
      code: "MKT-701",
      name: "Bachelorarbeit Marketing",
      description: "Wissenschaftliche Abschlussarbeit im Bereich Marketing.",
      studiengangId: marketing.id,
    },

    // ========================================
    // BWL (DUAL) COURSES
    // ========================================
    {
      code: "BWL-101",
      name: "Einführung in die BWL",
      description:
        "Grundlagen der Betriebswirtschaftslehre und Unternehmensführung.",
      studiengangId: bwl.id,
    },
    {
      code: "BWL-102",
      name: "Rechnungswesen & Buchführung",
      description: "Buchführung, Jahresabschluss und Bilanzierung.",
      studiengangId: bwl.id,
    },
    {
      code: "BWL-201",
      name: "Kostenrechnung & Controlling",
      description: "Kostenarten, Kostenstellen und Kostenträgerrechnung.",
      studiengangId: bwl.id,
    },
    {
      code: "BWL-202",
      name: "Investition & Finanzierung",
      description:
        "Investitionsrechnung, Finanzierungsformen und Kapitalmarkt.",
      studiengangId: bwl.id,
    },
    {
      code: "BWL-301",
      name: "Personal & Organisation",
      description:
        "Personalmanagement, Organisationstheorie und Change Management.",
      studiengangId: bwl.id,
    },
    {
      code: "BWL-302",
      name: "Produktion & Logistik",
      description: "Produktionsplanung, Supply Chain Management und Logistik.",
      studiengangId: bwl.id,
    },
    {
      code: "BWL-401",
      name: "Unternehmensrecht",
      description: "Handelsrecht, Gesellschaftsrecht und Arbeitsrecht.",
      studiengangId: bwl.id,
    },
    {
      code: "BWL-501",
      name: "Internationales Management",
      description:
        "Internationale Märkte, Globalisierung und Interkulturelles Management.",
      studiengangId: bwl.id,
    },
    {
      code: "BWL-601",
      name: "Strategisches Management",
      description: "Unternehmensstrategien, M&A und Unternehmensbewertung.",
      studiengangId: bwl.id,
    },
    {
      code: "BWL-701",
      name: "Bachelorarbeit BWL",
      description: "Wissenschaftliche Abschlussarbeit im Bereich BWL.",
      studiengangId: bwl.id,
    },

    // ========================================
    // DATA SCIENCE (DUAL) COURSES
    // ========================================
    {
      code: "DS-101",
      name: "Einführung in Data Science",
      description: "Grundlagen Data Science, Python und Jupyter Notebooks.",
      studiengangId: dataScience.id,
    },
    {
      code: "DS-102",
      name: "Statistik für Data Science",
      description: "Deskriptive und induktive Statistik, Hypothesentests.",
      studiengangId: dataScience.id,
    },
    {
      code: "DS-201",
      name: "Machine Learning Fundamentals",
      description:
        "Supervised Learning, Modellvalidierung und Feature Engineering.",
      studiengangId: dataScience.id,
    },
    {
      code: "DS-202",
      name: "Data Engineering",
      description: "ETL-Prozesse, Data Pipelines und Big Data Tools.",
      studiengangId: dataScience.id,
    },
    {
      code: "DS-301",
      name: "Deep Learning",
      description: "Neural Networks, CNNs, RNNs und Transfer Learning.",
      studiengangId: dataScience.id,
    },
    {
      code: "DS-302",
      name: "Natural Language Processing",
      description: "Text Mining, Sentiment Analysis und LLMs.",
      studiengangId: dataScience.id,
    },
    {
      code: "DS-401",
      name: "Big Data Analytics",
      description: "Hadoop, Spark und verteilte Datenverarbeitung.",
      studiengangId: dataScience.id,
    },
    {
      code: "DS-501",
      name: "MLOps & Deployment",
      description: "ML-Modelle deployen, Monitoring und A/B Testing.",
      studiengangId: dataScience.id,
    },
    {
      code: "DS-601",
      name: "AI Ethics & Governance",
      description: "Ethische Aspekte von KI, Bias und Fairness.",
      studiengangId: dataScience.id,
    },
    {
      code: "DS-701",
      name: "Bachelorarbeit Data Science",
      description: "Wissenschaftliche Abschlussarbeit im Bereich Data Science.",
      studiengangId: dataScience.id,
    },
  ];

  // Create courses
  let createdCount = 0;
  let updatedCount = 0;

  for (const courseData of coursesData) {
    const existingCourse = await prisma.course.findUnique({
      where: { code: courseData.code },
    });

    if (existingCourse) {
      await prisma.course.update({
        where: { code: courseData.code },
        data: {
          name: courseData.name,
          description: courseData.description,
        },
      });
      console.log(`🔄 Updated course: ${courseData.code} - ${courseData.name}`);
      updatedCount++;
    } else {
      await prisma.course.create({
        data: courseData,
      });
      console.log(`✅ Created course: ${courseData.code} - ${courseData.name}`);
      createdCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Created: ${createdCount} courses`);
  console.log(`   🔄 Updated: ${updatedCount} courses`);
  console.log(`   📚 Total: ${coursesData.length} courses in database`);
  console.log("✅ Course seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding courses:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
