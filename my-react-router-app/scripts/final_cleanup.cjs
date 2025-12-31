const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'sabin.elanwar@iu-study.org' }
  });

  if (!user) return;

  // 1. Delete nonsensical "Klausur: Bachelorarbeit"
  await prisma.studentTask.deleteMany({
    where: {
      userId: user.id,
      title: 'Klausur: Bachelorarbeit'
    }
  });

  // 2. Identify if there are any other direct duplicates for the same course
  const tasks = await prisma.studentTask.findMany({
    where: { userId: user.id }
  });

  console.log('Final task list for Sabin:');
  tasks.forEach(t => {
    console.log(`- [${t.id}] ${t.title} (${t.course}) Type: ${t.type} Kind: ${t.kind}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
