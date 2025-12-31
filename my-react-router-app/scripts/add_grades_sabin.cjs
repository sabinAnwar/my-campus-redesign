const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Wirtschaftsinformatik courses for Semesters 1-6 (completed)
const COMPLETED_COURSES = [
  // Semester 1
  'Einführung Wirtschaftsinformatik',
  'Grundlagen BWL',
  'Buchführung',
  'Mathematik I',
  'Praxisprojekt I',
  
  // Semester 2
  'Programmierung I',
  'Kostenrechnung',
  'Statistik',
  'Wirtschaftsrecht',
  'Praxisprojekt II',
  
  // Semester 3
  'Datenbanken',
  'Projektmanagement',
  'Marketing',
  'Mathematik II',
  'Praxisprojekt III',
  
  // Semester 4
  'Software Engineering',
  'IT-Sicherheit',
  'Unternehmensführung',
  'Controlling',
  'Praxisprojekt IV',
  
  // Semester 5
  'Business Intelligence',
  'ERP-Systeme',
  'Digitale Transformation',
  'Personalmanagement',
  'Praxisprojekt V',
  
  // Semester 6
  'IT-Consulting',
  'Innovationsmanagement',
  'Wahlpflichtmodul I',
  'Wahlpflichtmodul II',
  'Praxisprojekt VI'
];

async function addGradesForSabin() {
  // Get Sabin's user
  const user = await prisma.user.findUnique({
    where: { email: 'sabinanwar6@gmail.com' },
    select: { id: true, name: true, semester: true }
  });

  if (!user) {
    console.log('❌ User not found');
    return;
  }

  console.log('✅ Found user:', user.name, '- Semester:', user.semester);

  // Get or create a default teacher
  let teacher = await prisma.teacher.findFirst();
  if (!teacher) {
    teacher = await prisma.teacher.create({
      data: {
        name: 'Prof. Dr. Schmidt',
        email: 'schmidt@iu.edu'
      }
    });
  }

  // Delete existing marks for this user
  await prisma.mark.deleteMany({
    where: { userId: user.id }
  });

  console.log('🗑️  Deleted old marks');

  // Create marks for all completed courses
  const marks = [];
  for (const courseName of COMPLETED_COURSES) {
    // Generate random good grades (1.0 - 2.3)
    const grade = Math.round((1.0 + Math.random() * 1.3) * 10) / 10;
    
    marks.push({
      userId: user.id,
      teacherId: teacher.id,
      course: courseName,
      value: grade
    });
  }

  // Bulk create all marks
  const created = await prisma.mark.createMany({
    data: marks
  });

  console.log(`✅ Created ${created.count} marks for Semester 1-6`);
  console.log('📊 Sample grades:');
  marks.slice(0, 10).forEach(m => console.log(`   ${m.course}: ${m.value}`));

  await prisma.$disconnect();
}

addGradesForSabin().catch(console.error);
