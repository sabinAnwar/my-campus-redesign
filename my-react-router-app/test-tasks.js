import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
  try {
    const demoUser = await prisma.user.findUnique({
      where: { email: 'student.demo@iu-study.org' }
    });
    
    if (demoUser) {
      console.log(`Checking tasks for: ${demoUser.email} (ID: ${demoUser.id})`);
      const tasks = await prisma.studentTask.findMany({
        where: { user_id: demoUser.id }
      });
      console.log(`Found ${tasks.length} tasks.`);
      tasks.forEach(t => {
        console.log(`- ${t.title} (${t.type}) [${t.kind}]`);
      });
    } else {
      console.log('Demo user not found!');
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
