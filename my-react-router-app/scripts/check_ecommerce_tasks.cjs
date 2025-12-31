const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'sabin.elanwar@iu-study.org' },
    include: {
      tasks: true
    }
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  console.log(`E-Commerce related tasks for Sabin:`);
  user.tasks.filter(t => t.course.includes('E-Commerce') || t.title.includes('E-Commerce')).forEach(task => {
    console.log(`- [${task.id}] ${task.title} (Course: ${task.course})`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
