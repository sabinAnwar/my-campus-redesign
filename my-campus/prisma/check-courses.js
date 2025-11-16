import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking courses and their relationships...\n");

  // Get all Studiengänge with their courses
  const studiengaenge = await prisma.studiengang.findMany({
    include: {
      courses: true, // This is the JOIN - fetching related courses
    },
  });

  for (const studiengang of studiengaenge) {
    console.log(`📚 Studiengang: ${studiengang.name} (ID: ${studiengang.id})`);
    console.log(`   Beschreibung: ${studiengang.description}`);
    console.log(`   Anzahl Kurse: ${studiengang.courses.length}\n`);
    
    if (studiengang.courses.length > 0) {
      console.log(`   Kurse:`);
      studiengang.courses.forEach((course, index) => {
        console.log(`   ${index + 1}. [${course.code}] ${course.name}`);
        console.log(`      → ${course.description}`);
      });
    } else {
      console.log(`   ⚠️  Keine Kurse zugeordnet`);
    }
    console.log('\n' + '─'.repeat(80) + '\n');
  }

  // Alternative: Get courses with their Studiengang
  console.log("\n📖 Alternative Ansicht - Kurse mit ihrem Studiengang:\n");
  
  const courses = await prisma.course.findMany({
    include: {
      studiengang: true, // JOIN to get the related Studiengang
    },
  });

  courses.forEach((course, index) => {
    console.log(`${index + 1}. [${course.code}] ${course.name}`);
    console.log(`   Studiengang: ${course.studiengang.name}`);
    console.log(`   StudiengangId: ${course.studiengangId}`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
