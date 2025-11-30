import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding grades data...');

  // Get or create a user
  let user = await prisma.user.findFirst();
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'sabin.elanwar@iu-study.org',
        username: 'sabin.elanwar',
        password: 'hashed_password', // In production, this should be properly hashed
        name: 'Sabin El Anwar',
        matriculationNumber: '102203036',
        studyProgram: 'Wirtschaftsinformatik (B.Sc.)',
        role: 'STUDENT',
      },
    });
    console.log('✅ Created user:', user.name);
  } else {
    console.log('✅ Found existing user:', user.name);
  }

  // Get or create teachers
  const teachers = await Promise.all([
    prisma.teacher.upsert({
      where: { email: 'prof.mueller@iu.de' },
      update: {},
      create: {
        name: 'Prof. Dr. Müller',
        email: 'prof.mueller@iu.de',
      },
    }),
    prisma.teacher.upsert({
      where: { email: 'prof.schmidt@iu.de' },
      update: {},
      create: {
        name: 'Prof. Dr. Schmidt',
        email: 'prof.schmidt@iu.de',
      },
    }),
    prisma.teacher.upsert({
      where: { email: 'prof.weber@iu.de' },
      update: {},
      create: {
        name: 'Prof. Dr. Weber',
        email: 'prof.weber@iu.de',
      },
    }),
  ]);

  console.log('✅ Created/found teachers');

  // Delete existing marks for this user
  await prisma.mark.deleteMany({
    where: { userId: user.id },
  });

  // Grades data from notenverwaltung.tsx
  const gradesData = [
    // 1. Semester
    { course: 'Grundlagen der BWL', value: 1.3, date: '2023-03-31' },
    { course: 'Mathematik I', value: 2.3, date: '2023-02-21' },
    { course: 'Industrielle Softwaretechnik (MP)', value: 2.0, date: '2023-02-16' },
    { course: 'Wissenschaftliches Arbeiten', value: 1.0, date: '2023-03-26' },
    { course: 'Praxisprojekt I', value: 1.3, date: '2023-06-29' },
    
    // 2. Semester
    { course: 'Buchführung und Jahresabschluss', value: 1.7, date: '2023-08-21' },
    { course: 'Mathematik Grundlagen II', value: 4.0, date: '2023-08-25' },
    { course: 'Objektorientierte Programmierung I', value: 2.7, date: '2023-08-18' },
    { course: 'Fallstudie Digitale Business Modelle', value: 1.7, date: '2023-07-20' },
    { course: 'Praxisprojekt II', value: 1.0, date: '2023-10-24' },
    
    // 3. Semester
    { course: 'Kosten- und Leistungsrechnung', value: 1.3, date: '2024-02-06' },
    { course: 'Marketing', value: 2.0, date: '2024-02-01' },
    { course: 'Requirement Engineering (MP)', value: 2.3, date: '2024-02-14' },
    { course: 'Praxisprojekt III', value: 1.0, date: '2024-03-30' },
    { course: 'Objektorientierte Programmierung II', value: 2.3, date: '2024-03-15' },
    
    // 4. Semester
    { course: 'Datenschutz und IT-Sicherheit (MP)', value: 1.0, date: '2024-08-15' },
    { course: 'Fallstudie Software-Engineering (MP)', value: 1.3, date: '2024-08-10' },
    { course: 'IT-Consulting & Dienstleistungsmanagement', value: 1.7, date: '2024-09-30' },
    { course: 'Praxisprojekt IV', value: 1.0, date: '2024-10-01' },
    { course: 'Qualitätssicherung im Softwareprozess (MP)', value: 1.0, date: '2024-09-20' },
    
    // 5. Semester
    { course: 'Data Analytics und Big Data (MP)', value: 1.0, date: '2025-02-01' },
    { course: 'Design Thinking', value: 1.3, date: '2025-01-25' },
    { course: 'Betriebssysteme, Rechnernetze & verteilte Systeme', value: 1.7, date: '2025-02-11' },
    { course: 'Praxisprojekt V', value: 1.3, date: '2025-04-01' },
    
    // 6. Semester
    { course: 'IT-Architekturmanagement', value: 1.3, date: '2025-08-21' },
    { course: 'Planen und Entscheiden', value: 1.3, date: '2025-07-31' },
    
    // Vertiefung
    { course: 'Algorithmen, Datenstrukturen & Programmiersprachen I', value: 1.7, date: '2025-08-19' },
    { course: 'Business Intelligence I', value: 1.3, date: '2025-07-15' },
    { course: 'Business Intelligence II', value: 1.0, date: '2025-08-01' },
    
    // Zusatzmodule
    { course: 'Projekt: KI-Exzellenz mit kreativen Prompt-Techniken', value: 1.0, date: '2025-02-23' },
  ];

  // Insert grades
  for (const grade of gradesData) {
    const teacher = teachers[Math.floor(Math.random() * teachers.length)];
    
    await prisma.mark.create({
      data: {
        course: grade.course,
        value: grade.value,
        date: new Date(grade.date),
        userId: user.id,
        teacherId: teacher.id,
      },
    });
  }

  console.log(`✅ Created ${gradesData.length} grades`);
  
  // Calculate and display GPA
  const allMarks = await prisma.mark.findMany({
    where: { userId: user.id },
  });
  
  const gpa = allMarks.reduce((sum, mark) => sum + mark.value, 0) / allMarks.length;
  console.log(`📊 GPA: ${gpa.toFixed(2)}`);
  console.log(`📚 Total modules: ${allMarks.length}`);
  console.log(`✅ Passed modules: ${allMarks.filter(m => m.value <= 4.0).length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
