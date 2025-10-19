import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create test users
  const users = [
    {
      email: 'sabin.elanwar@iu-study.org',
      username: 'sabin_elanwar',
      name: 'Sabin Elanwar',
      password: await bcryptjs.hash('password123', 10),
    },
    {
      email: 'student@iu.edu',
      username: 'student_001',
      name: 'Test Student',
      password: await bcryptjs.hash('password123', 10),
    },
    {
      email: 'sabinanwar6@gmail.com',
      username: 'sabin_anwar',
      name: 'Sabin Anwar',
      password: await bcryptjs.hash('Test@1234', 10),
    },
    {
      email: 'admin@iu.edu',
      username: 'admin',
      name: 'Admin User',
      password: await bcryptjs.hash('admin123', 10),
      role: 'ADMIN',
    },
  ];

  for (const user of users) {
    try {
      const existing = await prisma.user.findUnique({ 
        where: { email: user.email } 
      });
      
      if (!existing) {
        const created = await prisma.user.create({ data: user });
        console.log(`✓ Created user: ${created.email}`);
      } else {
        console.log(`✓ User already exists: ${user.email}`);
      }
    } catch (error) {
      console.error(`✗ Error creating user ${user.email}:`, error.message);
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch((error) => {
    console.error('Error during seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
