
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'sabin.elanwar@iu-study.org';
  const user = await prisma.user.findUnique({
    where: { email },
    include: { studiengang: true }
  });

  if (!user) {
    console.log(`User ${email} not found.`);
    return;
  }

  console.log(`User: ${user.name} (${user.email})`);
  console.log(`Program: ${user.studiengang?.name}`);

  // Check Bachelorarbeit course
  const coursesToCheck = ['Bachelorarbeit', 'Grundlagen BWL', 'Einführung Wirtschaftsinformatik'];

  for (const courseName of coursesToCheck) {
    const course = await prisma.course.findFirst({
      where: { 
        name: courseName,
        studiengangId: user.studiengangId
      }
    });

    if (!course) {
      console.log(`\nCourse "${courseName}" NOT found for this user's program.`);
      continue;
    }

    console.log(`\nCourse: ${course.name} (ID: ${course.id})`);
    
    // Check files for this user and course
    const files = await prisma.file.findMany({
      where: {
        userId: user.id,
        courseId: course.id
      }
    });

    console.log(`Found ${files.length} files:`);
    files.forEach(f => {
      console.log(` - [${f.fileType}] ${f.name} (URL: ${f.url})`);
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
