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

  // Delete 'Online-Klausur: E-Commerce Grundlagen' if it exists
  const deleted = await prisma.studentTask.deleteMany({
    where: {
      userId: user.id,
      title: 'Online-Klausur: E-Commerce Grundlagen'
    }
  });

  console.log(`Deleted ${deleted.count} extra tasks.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
