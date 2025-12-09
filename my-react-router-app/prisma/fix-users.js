import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Check existing users
  const existingUsers = await prisma.user.findMany({
    select: { email: true, username: true }
  });
  
  console.log('=== Existing Users ===');
  existingUsers.forEach(u => console.log(`${u.email} (${u.username})`));
  console.log(`Total: ${existingUsers.length} users\n`);
  
  // Users to add if missing
  const usersToCreate = [
    {
      email: 'tim.dual@iu-study.org',
      username: 'tim_dual',
      name: 'Tim Müller',
      password: await bcryptjs.hash('tim_studiert_bei_der_uni_dual', 10),
      matriculationNumber: 'IU2024002',
      studyProgram: 'Informatik (Dual)',
    },
    {
      email: 'anna.bauer@iu-study.org',
      username: 'anna_bauer',
      name: 'Anna Bauer',
      password: await bcryptjs.hash('anna_liebt_iu_dual', 10),
      matriculationNumber: 'IU2024003',
      studyProgram: 'Wirtschaftsinformatik (Dual)',
    },
    {
      email: 'max.schmidt@iu-study.org',
      username: 'max_schmidt',
      name: 'Max Schmidt',
      password: await bcryptjs.hash('max_dual_student_2024', 10),
      matriculationNumber: 'IU2024004',
      studyProgram: 'Informatik (Dual)',
    },
    {
      email: 'leon.fischer@iu-study.org',
      username: 'leon_fischer',
      name: 'Leon Fischer',
      password: await bcryptjs.hash('leon_studiert_informatik', 10),
      matriculationNumber: 'IU2024006',
      studyProgram: 'Informatik (Dual)',
    },
    {
      email: 'laura.meyer@iu-study.org',
      username: 'laura_meyer',
      name: 'Laura Meyer',
      password: await bcryptjs.hash('laura_dual_degree_girl', 10),
      matriculationNumber: 'IU2024007',
      studyProgram: 'Marketing (Dual)',
    },
  ];
  
  console.log('=== Adding Missing Users ===');
  for (const userData of usersToCreate) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { username: userData.username }
        ]
      }
    });
    
    if (existing) {
      console.log(`✓ Already exists: ${userData.email}`);
    } else {
      try {
        await prisma.user.create({ data: userData });
        console.log(`✅ Created: ${userData.email}`);
      } catch (err) {
        console.error(`❌ Error creating ${userData.email}:`, err.message);
      }
    }
  }
  
  // Final count
  const finalCount = await prisma.user.count();
  console.log(`\n=== Final Count: ${finalCount} users ===`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
