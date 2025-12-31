const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'sabin.elanwar@iu-study.org' }
  });

  if (!user) return;

  // Find all E-Commerce exams
  const tasks = await prisma.studentTask.findMany({
    where: {
      userId: user.id,
      course: 'E-Commerce',
      OR: [
        { type: { contains: 'Klausur', mode: 'insensitive' } },
        { title: { contains: 'Klausur', mode: 'insensitive' } }
      ]
    },
    orderBy: { id: 'desc' } // Keep the latest/canonical one usually
  });

  if (tasks.length > 1) {
    // Keep 'Online-Klausur: E-Commerce Grundlagen' and delete the other
    const toDelete = tasks.filter(t => t.title !== 'Online-Klausur: E-Commerce Grundlagen');
    for (const t of toDelete) {
      await prisma.studentTask.delete({ where: { id: t.id } });
      console.log(`Deleted duplicate exam: ${t.title}`);
    }
  }

  console.log('Cleanup finished.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
