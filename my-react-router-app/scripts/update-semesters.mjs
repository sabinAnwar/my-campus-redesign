import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateSemesters() {
  console.log('Updating semester values for existing users...');
  
  // Update Sabin to semester 7
  await prisma.user.updateMany({
    where: { email: 'sabin.elanwar@iu-study.org' },
    data: { semester: 7, totalSemesters: 7 }
  });
  console.log('✅ Updated sabin.elanwar@iu-study.org to semester 7');

  // Update another user to semester 7 for testing
  await prisma.user.updateMany({
    where: { email: 'sabinanwar6@gmail.com' },
    data: { semester: 7, totalSemesters: 7 }
  });
  console.log('✅ Updated sabinanwar6@gmail.com to semester 7');

  // Update all other users who have default semester (1) to have varied semesters
  // This won't affect users who already have semester set
  
  console.log('Done!');
}

updateSemesters()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
