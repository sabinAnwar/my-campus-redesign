import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding courses...");

  // First, create Studiengang (study programs) if they don't exist
  const wirtschaftsinformatik = await prisma.studiengang.upsert({
    where: { name: "Wirtschaftsinformatik" },
    update: {},
    create: {
      name: "Wirtschaftsinformatik",
      description: "Bachelor of Science Wirtschaftsinformatik",
    },
  });

  console.log("✅ Created/Updated Studiengang:", wirtschaftsinformatik.name);

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
      description: "IT-Recht, Datenschutz und Vertragsrecht im digitalen Umfeld.",
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
      description: "Cloud Security, Identity und Compliance Kontrollen in verteilten Systemen.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-604",
      name: "Business Intelligence",
      description: "Business Intelligence mit Datenmodellen, KPIs und Visualisierung.",
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
      description: "Career Lab mit Fokus auf Profil, Pitch und Bewerbungsunterlagen.",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "WI-705",
      name: "Projektarbeit 7",
      description: "Projektarbeit 7 fuer duale Studierende.",
      studiengangId: wirtschaftsinformatik.id,
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
