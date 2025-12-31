const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'sabin.elanwar@iu-study.org' }
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  // Delete all tasks for Sabin that are exams (Klausuren) 
  // because they are not "submitted" (abgegeben) through the tasks interface.
  const deleted = await prisma.studentTask.deleteMany({
    where: {
      userId: user.id,
      OR: [
        { type: { contains: 'Klausur', mode: 'insensitive' } },
        { kind: 'KLAUSUR' },
        { title: { contains: 'Klausur', mode: 'insensitive' } }
      ]
    }
  });

  console.log(`Deleted ${deleted.count} exam tasks for Sabin.`);

  // Also verify if there are any other duplicates for Bachelorarbeit
  const tasks = await prisma.studentTask.findMany({
    where: {
      userId: user.id
    }
  });

  console.log('Remaining tasks for Sabin:');
  tasks.forEach(task => {
    console.log(`- [${task.id}] ${task.title} (Course: ${task.course})`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
