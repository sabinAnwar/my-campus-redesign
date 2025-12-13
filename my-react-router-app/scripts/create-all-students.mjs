import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const STUDENTS = [
  // Erstsemester (Semester 1) - zeigen Onboarding
  { email: 'tim.mueller@iu-study.org', name: 'Tim Müller', password: 'tim_studiert_bei_der_uni_dual', semester: 1 },
  { email: 'anna.bauer@iu-study.org', name: 'Anna Bauer', password: 'anna_liebt_iu_dual', semester: 1 },
  { email: 'hannah.schroeder@iu-study.org', name: 'Hannah Schröder', password: 'hannah_iu_dual_study', semester: 1 },
  { email: 'sarah.maier@iu-study.org', name: 'Sarah Maier', password: 'sarah_iu_waterloohain', semester: 1 },
  
  // Mittlere Semester (2-6) - kein Onboarding
  { email: 'max.schmidt@iu-study.org', name: 'Max Schmidt', password: 'max_dual_student_2024', semester: 2 },
  { email: 'julia.weber@iu-study.org', name: 'Julia Weber', password: 'julia_iu_hamburg_dual', semester: 2 },
  { email: 'leon.fischer@iu-study.org', name: 'Leon Fischer', password: 'leon_studiert_informatik', semester: 3 },
  { email: 'laura.meyer@iu-study.org', name: 'Laura Meyer', password: 'laura_dual_degree_girl', semester: 3 },
  { email: 'paul.wagner@iu-study.org', name: 'Paul Wagner', password: 'paul_loves_coding_iu', semester: 3 },
  { email: 'sophie.braun@iu-study.org', name: 'Sophie Braun', password: 'sophie_iu_student_2024', semester: 4 },
  { email: 'david.hoffmann@iu-study.org', name: 'David Hoffmann', password: 'david_hamburg_campus', semester: 4 },
  { email: 'emma.schulz@iu-study.org', name: 'Emma Schulz', password: 'emma_studies_at_iu', semester: 4 },
  { email: 'felix.koch@iu-study.org', name: 'Felix Koch', password: 'felix_dual_developer', semester: 5 },
  { email: 'mia.richter@iu-study.org', name: 'Mia Richter', password: 'mia_iu_hamburg_2024', semester: 6 },
  { email: 'noah.krueger@iu-study.org', name: 'Noah Krüger', password: 'noah_coding_master', semester: 6 },
  
  // Letztes Semester (7) - kein Onboarding
  { email: 'lena.klein@iu-study.org', name: 'Lena Klein', password: 'lena_iu_student_girl', semester: 7 },
  { email: 'lukas.wolf@iu-study.org', name: 'Lukas Wolf', password: 'lukas_wolf_developer', semester: 7 },
  { email: 'tom.lange@iu-study.org', name: 'Tom Lange', password: 'tom_lange_coder_dual', semester: 7 },
];

async function createAllStudents() {
  console.log('═'.repeat(60));
  console.log('🎓 Creating test students for IU Portal');
  console.log('═'.repeat(60));
  
  let created = 0;
  let updated = 0;
  
  for (const student of STUDENTS) {
    const hashedPassword = await bcrypt.hash(student.password, 10);
    const username = student.email.split('@')[0].replace('.', '_');
    
    try {
      const existing = await prisma.user.findUnique({ 
        where: { email: student.email } 
      });
      
      if (existing) {
        await prisma.user.update({
          where: { email: student.email },
          data: { semester: student.semester, totalSemesters: 7 }
        });
        console.log(`⏭️  Updated: ${student.email} → Semester ${student.semester}`);
        updated++;
      } else {
        await prisma.user.create({
          data: {
            email: student.email,
            username,
            name: student.name,
            password: hashedPassword,
            studyProgram: 'Informatik (Dual)',
            semester: student.semester,
            totalSemesters: 7,
          }
        });
        console.log(`✅ Created: ${student.email} → Semester ${student.semester}`);
        created++;
      }
    } catch (error) {
      console.error(`❌ Error for ${student.email}:`, error.message);
    }
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log(`📊 Summary: ${created} created, ${updated} updated`);
  console.log('═'.repeat(60));
  
  console.log('\n📋 Test Accounts:\n');
  console.log('ERSTSEMESTER (zeigt Onboarding):');
  STUDENTS.filter(s => s.semester === 1).forEach(s => {
    console.log(`  📧 ${s.email}`);
    console.log(`  🔐 ${s.password}\n`);
  });
  
  console.log('LETZTES SEMESTER (kein Onboarding):');
  STUDENTS.filter(s => s.semester === 7).forEach(s => {
    console.log(`  📧 ${s.email}`);
    console.log(`  🔐 ${s.password}\n`);
  });
}

createAllStudents()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
