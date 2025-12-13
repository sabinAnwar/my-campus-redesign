import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestFirstSemesterStudent() {
  console.log('Creating test first-semester student...');
  
  const email = 'tim.mueller@iu-study.org';
  const password = 'tim_studiert_bei_der_uni_dual';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    
    if (existing) {
      // Update semester to 1 (first semester)
      await prisma.user.update({
        where: { email },
        data: { semester: 1, totalSemesters: 7 }
      });
      console.log('✅ Updated existing user to semester 1');
    } else {
      // Create new user
      await prisma.user.create({
        data: {
          email,
          username: 'tim_mueller',
          name: 'Tim Müller',
          password: hashedPassword,
          matriculationNumber: 'IU2024002',
          studyProgram: 'Informatik (Dual)',
          semester: 1,
          totalSemesters: 7,
        }
      });
      console.log('✅ Created new first-semester student');
    }
    
    console.log(`\n📧 Email: ${email}`);
    console.log(`🔐 Password: ${password}`);
    console.log(`📚 Semester: 1 (shows onboarding)`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createTestFirstSemesterStudent()
  .finally(() => prisma.$disconnect());
