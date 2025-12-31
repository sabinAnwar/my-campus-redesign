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

  console.log(`Tasks for ${user.email}:`);
  user.tasks.forEach(task => {
    console.log(`- [${task.id}] ${task.title} (Course: ${task.course}) Type: ${task.type}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
