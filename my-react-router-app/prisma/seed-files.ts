import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding files data...');

  // Get or create user
  let user = await prisma.user.findFirst();
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'student@iu-study.org',
        username: 'student',
        password: 'hashed_password',
        name: 'Max Mustermann',
        matriculationNumber: '12345678',
        studyProgram: 'Informatik (B.Sc.)',
        role: 'STUDENT',
      },
    });
    console.log('✅ Created user:', user.name);
  } else {
    console.log('✅ Found existing user:', user.name);
  }

  // Get or create Studiengang
  let studiengang = await prisma.studiengang.findFirst({
    where: { name: 'Informatik' },
  });

  if (!studiengang) {
    studiengang = await prisma.studiengang.create({
      data: {
        name: 'Informatik',
        description: 'Bachelor of Science in Informatik',
      },
    });
    console.log('✅ Created Studiengang:', studiengang.name);
  }

  // Get or create Courses
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { code: 'WEB101' },
      update: {},
      create: {
        code: 'WEB101',
        name: 'Webentwicklung',
        description: 'Grundlagen der Webentwicklung',
        studiengangId: studiengang.id,
      },
    }),
    prisma.course.upsert({
      where: { code: 'DB101' },
      update: {},
      create: {
        code: 'DB101',
        name: 'Datenbankdesign',
        description: 'Relationale Datenbanken',
        studiengangId: studiengang.id,
      },
    }),
    prisma.course.upsert({
      where: { code: 'CLOUD101' },
      update: {},
      create: {
        code: 'CLOUD101',
        name: 'Cloud Computing',
        description: 'Cloud-Technologien und Services',
        studiengangId: studiengang.id,
      },
    }),
    prisma.course.upsert({
      where: { code: 'PROG101' },
      update: {},
      create: {
        code: 'PROG101',
        name: 'Programmierung',
        description: 'Grundlagen der Programmierung',
        studiengangId: studiengang.id,
      },
    }),
  ]);

  console.log('✅ Created/found courses');

  // Delete existing files for this user
  await prisma.file.deleteMany({
    where: { userId: user.id },
  });

  // Sample files data
  const filesData = [
    // Webentwicklung
    { name: 'HTML_Basics.pdf', fileType: 'pdf', size: '2.5 MB', courseId: courses[0].id, url: 'https://example.com/html-basics.pdf' },
    { name: 'CSS_Advanced.pdf', fileType: 'pdf', size: '3.1 MB', courseId: courses[0].id, url: 'https://example.com/css-advanced.pdf' },
    { name: 'JavaScript_Tutorial.pdf', fileType: 'pdf', size: '4.2 MB', courseId: courses[0].id, url: 'https://example.com/js-tutorial.pdf' },
    { name: 'React_Grundlagen.pdf', fileType: 'pdf', size: '3.8 MB', courseId: courses[0].id, url: 'https://example.com/react-basics.pdf' },
    
    // Datenbankdesign
    { name: 'SQL_Queries.pdf', fileType: 'pdf', size: '1.8 MB', courseId: courses[1].id, url: 'https://example.com/sql-queries.pdf' },
    { name: 'Normalisierung.pdf', fileType: 'pdf', size: '2.1 MB', courseId: courses[1].id, url: 'https://example.com/normalisierung.pdf' },
    { name: 'ER_Diagramme.pdf', fileType: 'pdf', size: '1.5 MB', courseId: courses[1].id, url: 'https://example.com/er-diagramme.pdf' },
    
    // Cloud Computing
    { name: 'AWS_Guide.pdf', fileType: 'pdf', size: '4.2 MB', courseId: courses[2].id, url: 'https://example.com/aws-guide.pdf' },
    { name: 'Docker_Tutorial.pdf', fileType: 'pdf', size: '3.5 MB', courseId: courses[2].id, url: 'https://example.com/docker-tutorial.pdf' },
    { name: 'Kubernetes_Basics.pdf', fileType: 'pdf', size: '4.8 MB', courseId: courses[2].id, url: 'https://example.com/k8s-basics.pdf' },
    
    // Programmierung
    { name: 'Python_Grundlagen.pdf', fileType: 'pdf', size: '3.2 MB', courseId: courses[3].id, url: 'https://example.com/python-basics.pdf' },
    { name: 'Java_Tutorial.pdf', fileType: 'pdf', size: '5.1 MB', courseId: courses[3].id, url: 'https://example.com/java-tutorial.pdf' },
    { name: 'Algorithmen.pdf', fileType: 'pdf', size: '4.5 MB', courseId: courses[3].id, url: 'https://example.com/algorithmen.pdf' },
    
    // Excel Files
    { name: 'Notenliste.xlsx', fileType: 'xlsx', size: '0.5 MB', courseId: courses[0].id, url: 'https://example.com/notenliste.xlsx' },
    { name: 'Projektplan.xlsx', fileType: 'xlsx', size: '0.8 MB', courseId: courses[3].id, url: 'https://example.com/projektplan.xlsx' },
    
    // Videos
    { name: 'Vorlesung_01.mp4', fileType: 'video', size: '125 MB', courseId: courses[0].id, url: 'https://example.com/vorlesung-01.mp4' },
    { name: 'Tutorial_React.mp4', fileType: 'video', size: '98 MB', courseId: courses[0].id, url: 'https://example.com/tutorial-react.mp4' },
    
    // Podcasts
    { name: 'Tech_Talk_Episode_01.mp3', fileType: 'podcast', size: '45 MB', courseId: courses[2].id, url: 'https://example.com/tech-talk-01.mp3' },
  ];

  // Insert files
  for (const fileData of filesData) {
    await prisma.file.create({
      data: {
        name: fileData.name,
        url: fileData.url,
        fileType: fileData.fileType,
        size: fileData.size,
        userId: user.id,
        courseId: fileData.courseId,
        studiengangId: studiengang.id,
      },
    });
  }

  console.log(`✅ Created ${filesData.length} files`);
  
  const allFiles = await prisma.file.findMany({
    where: { userId: user.id },
    include: {
      course: true,
    },
  });
  
  console.log(`📁 Total files in database: ${allFiles.length}`);
  console.log('📚 Files by course:');
  courses.forEach(course => {
    const count = allFiles.filter(f => f.courseId === course.id).length;
    console.log(`   - ${course.name}: ${count} files`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
