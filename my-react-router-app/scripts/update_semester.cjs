const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateSemester() {
  const user = await prisma.user.update({
    where: { email: 'sabinanwar6@gmail.com' },
    data: { semester: 7 },
    select: { id: true, name: true, email: true, semester: true, studyProgram: true }
  });
  
  console.log('✅ Updated user semester:');
  console.log(JSON.stringify(user, null, 2));
  
  await prisma.$disconnect();
}

updateSemester().catch(console.error);
