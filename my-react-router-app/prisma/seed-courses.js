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

  // Course data extracted from courses.jsx
  const coursesData = [
    {
      code: "WEB101",
      name: "Webentwicklung",
      description: "Grundlagen der modernen Webentwicklung mit React, HTML, CSS und JavaScript",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "DB101",
      name: "Datenbankdesign",
      description: "Design und Implementierung von relationalen Datenbanken mit SQL",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "ALGO201",
      name: "Algorithmen, Datenstrukturen und...",
      description: "Grundlagen effizienter Algorithmen und Datenstrukturen",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "ECOM301",
      name: "E-Commerce",
      description: "Online-Handel, Plattformen, Payment und Recht",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "PRJ601",
      name: "Praxisprojekt VI",
      description: "Praxisnahes Projekt mit Unternehmenspartnern",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "PUF401",
      name: "Personal- und Unternehmensführung",
      description: "Führung, Organisation und Change Management",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "ENTR201",
      name: "Unternehmensgründung und...",
      description: "Ideen, Businessplan und Finanzierung",
      studiengangId: wirtschaftsinformatik.id,
    },
    {
      code: "MATH101",
      name: "Mathematik Grundlagen",
      description: "Lineare Algebra, Analysis, Stochastik",
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
