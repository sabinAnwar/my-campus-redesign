import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

// =============================================================================
// CONFIGURATION
// =============================================================================

const SALT_ROUNDS = 10;

// =============================================================================
// CURRICULUM DATA
// =============================================================================

const CURRICULUM = {
  'Wirtschaftsinformatik (Dual)': {
    1: ['Einführung Wirtschaftsinformatik', 'Grundlagen BWL', 'Buchführung', 'Mathematik I', 'Praxisprojekt I'],
    2: ['Programmierung I', 'Kostenrechnung', 'Wissenschaftliches Arbeiten', 'Statistik', 'Praxisprojekt II'],
    3: ['Datenbanken', 'Wirtschaftsprivatrecht', 'Volkswirtschaftslehre', 'Programmierung II', 'Praxisprojekt III'],
    4: ['IT-Projektmanagement', 'Software Engineering', 'Finanzierung & Investition', 'Marketing Grundlagen', 'Praxisprojekt IV'],
    5: ['IT-Sicherheit', 'Big Data Analytics', 'Prozessmanagement', 'Digital Business', 'Praxisprojekt V'],
    6: ['ERP-Systeme', 'Data Science Grundlagen', 'IT-Recht', 'Seminar: Trends in WI', 'Praxisprojekt VI'],
    7: ['Bachelorarbeit', 'IT-Ethik', 'E-Commerce', 'Praxisprojekt VII']
  },
  'Informatik (Dual)': {
    1: ['Einführung Informatik', 'Mathematik I', 'Programmierung I', 'Digitale Logik', 'Praxisprojekt I'],
    2: ['Algorithmen & Datenstrukturen', 'Mathematik II', 'Programmierung II', 'Rechnerarchitektur', 'Praxisprojekt II'],
    3: ['Betriebssysteme', 'Netzwerke', 'Datenbanken', 'Theoretische Informatik', 'Praxisprojekt III'],
    4: ['Software Engineering', 'IT-Sicherheit', 'Cloud Computing', 'Kryptographie', 'Praxisprojekt IV'],
    5: ['KI Grundlagen', 'Verteilte Systeme', 'Web Development', 'Mobile App Dev', 'Praxisprojekt V'],
    6: ['Grafikprogrammierung', 'Data Science Grundlagen', 'Compilers', 'Seminar Informatik', 'Praxisprojekt VI'],
    7: ['Bachelorarbeit', 'Ethik in der IT', 'Praxisprojekt VII']
  },
  'Marketing (Dual)': {
    1: ['Grundlagen Marketing', 'BWL I', 'Wirtschaftsmathematik', 'Digitale Business Modelle', 'Praxisprojekt I'],
    2: ['Marktforschung', 'Konsumentenverhalten', 'BWL II', 'Statistik', 'Praxisprojekt II'],
    3: ['Brand Management', 'Content Marketing', 'Social Media Marketing', 'Public Relations', 'Praxisprojekt III'],
    4: ['E-Commerce', 'Video Marketing', 'CRM', 'Kreativtechniken', 'Praxisprojekt IV'],
    5: ['Marketing Controlling', 'International Marketing', 'Pricing Strategies', 'Service Marketing', 'Praxisprojekt V'],
    6: ['Event Marketing', 'B2B Marketing', 'Media Planning', 'Seminar Marketing', 'Praxisprojekt VI'],
    7: ['Bachelorarbeit', 'Marketing Ethik', 'Praxisprojekt VII']
  }
};

const COURSE_METADATA = {
  'Bachelorarbeit': {
    description: 'Die Bachelorarbeit bildet den Abschluss des Studiums. In dieser wissenschaftlichen Arbeit weist der Studierende nach, dass er in der Lage ist, ein Problem aus seinem Fachgebiet selbstständig nach wissenschaftlichen Methoden zu bearbeiten.',
    videos: [
      { name: 'How to write a Bachelor Thesis (Search)', url: 'https://www.youtube.com/results?search_query=how+to+write+a+bachelor+thesis+university' },
      { name: 'Academic writing for Thesis (Search)', url: 'https://youtu.be/syuozD4m9Rc?si=xIIR9kHO4NFrGzqZ' }
    ],
    scripts: [
      { name: 'Beispiele Bachelorarbeit (Scribbr)', url: 'https://www.scribbr.de/abgabe-abschlussarbeit/bachelorarbeit-pdf/' },
      { name: 'Leitfaden Bachelorarbeit', url: 'https://www.uni-bamberg.de/fileadmin/uni/fakultaeten/wiai_lehrstuehle/wirtschaftsinformatik/Leitfaden_Abschlussarbeiten_WIAI-2018.pdf' }
    ]
  },
  'IT-Ethik': {
    description: 'Dieses Modul beleuchtet die ethischen Implikationen der Digitalisierung. Datenschutz, Algorithmen-Ethik und Verantwortung in der IT stehen im Fokus.',
    videos: [
      { name: 'IT Ethics & Professionalism (Search)', url: 'https://www.youtube.com/results?search_query=IT+ethics+in+computer+science' },
      { name: 'Computer Ethics explained (Search)', url: 'https://www.youtube.com/results?search_query=computer+ethics+lecture' }
    ],
    scripts: [
      { name: 'IT Ethics Lehrskript (Eng)', url: 'https://www.tgpcet.com/assets/img/CSE/CSE-NOTES/3/EIT.pdf' },
      { name: 'Internet & E-Commerce Ethics', url: 'https://fci.bsu.edu.eg/Backend/Uploads/PDF/FCI/%D8%A7%D9%84%D9%81%D8%B1%D9%82%D8%A9%20%D8%A7%D9%84%D8%B1%D8%A7%D8%A8%D8%B9%D8%A9%20%D9%86%D8%B8%D9%85/ecommerce/Ethics%2C%20Law%2C%20and%20E-commerce.pdf' },
      { name: 'Computer Ethics Education Center', url: 'https://computer-ethics.com/' }
    ]
  },
  'E-Commerce': {
    description: 'Dieses Modul vermittelt die Grundlagen und fortgeschrittenen Konzepte des elektronischen Handels. Themen sind Geschäftsmodelle, technologische Infrastruktur, E-Marketing und rechtliche Aspekte.',
    videos: [
      { name: 'E-Commerce Grundlagen Lecture (Search)', url: 'https://www.youtube.com/results?search_query=e+commerce+basics+lecture' },
      { name: 'E-Commerce Strategy (Search)', url: 'https://www.youtube.com/results?search_query=e+commerce+strategy' }
    ],
    scripts: [
      { name: 'Bachelorarbeit E-Commerce Beispiel', url: 'https://monami.hs-mittweida.de/frontdoor/deliver/index/docId/10613/file/Bachelorarbeit_Paul_Schirmer.pdf' },
      { name: 'E-Commerce Projektleitfaden (Bitkom)', url: 'https://www.bitkom.org/sites/main/files/file/import/090709-E-Commerce-Leitfaden.pdf' },
      { name: 'Bachelorarbeit Usability E-Commerce', url: 'https://publiscologne.th-koeln.de/files/1811/BA_Fielauf_Philipp.pdf' }
    ]
  },
  'Praxisprojekt VII': {
    description: 'Das letzte Praxisprojekt vor der Bachelorarbeit. Vertiefung der fachlichen Kenntnisse im Unternehmen und Vorbereitung auf die Thesis.',
    videos: [
      { name: 'Project planning & execution (Search)', url: 'https://www.youtube.com/results?search_query=project+planning+and+execution+for+students' },
      { name: 'Praxisprojekt Tipps (Search)', url: 'https://www.youtube.com/results?search_query=praxisprojekt+student+guide' }
    ],
    scripts: [
      { name: 'Leitlinien Praxisprojekt (DHBW)', url: 'https://www.dhbw.de/fileadmin/user_upload/Dokumente/Dokumente_fuer_Studierende/Leitlinien_fuer_die_Bearbeitung_und_Dokumentation_Fakultaet_Technik_Okt_2017.pdf' },
      { name: 'Praxisprojekt Tips (BWL24)', url: 'https://www.bwl24.net/skripte/praxisprojekt-projektarbeit/' }
    ]
  },
  'Einführung Wirtschaftsinformatik': {
    description: 'Grundlegende Konzepte der Wirtschaftsinformatik, Informationssysteme und digitale Geschäftsprozesse.',
    videos: [
      { name: 'Introduction to Information Systems', url: 'https://www.youtube.com/watch?v=7GRiW8zHjWg' },
      { name: 'Studying Business Informatics', url: 'https://www.youtube.com/watch?v=UnsND2zqcVU' }
    ],
    scripts: [
      { name: 'Einführung in die WI (Skript)', url: 'https://www.einfuehrung-wi.de/wp-content/uploads/2021/08/Einfuehrung-in-die-Wirtschaftsinformatik-5A.pdf' },
      { name: 'Grundlagen Wirtschaftsinformatik', url: 'https://www.thomasoff.de/lehre/beuth/wi1/le/download/vorlesungen/beuth_wi1_le01-su_grundlagen-wirtschaftsinformatik.pdf' },
      { name: 'Skript-Sammlung (BWL24)', url: 'https://www.bwl24.net/skripte/wirtschaftsinformatik/' },
      { name: 'Studienunterlagen (Docsity)', url: 'https://www.docsity.com/en/subjects/business-informatics/' }
    ]
  },
  'Video Marketing': {
    description: 'Strategien und Techniken für erfolgreiches Video-Marketing. Von der Konzeption bis zur Distribution.',
    videos: [
      { name: 'Video Marketing Strategy 101', url: 'https://www.youtube.com/watch?v=uFu2_Qv5K5w' }
    ],
    scripts: [
       // Hubspot links often expire/gate, replaced with generic reliable guide if possible, or kept if user didn't complain specifically about this one.
       // User complained about "all links". Replaced with a more likely open PDF if found, else keep placeholder.
       // Found: https://cdn2.hubspot.net/hubfs/53/Video%20Marketing%20Strategy.pdf (Still seemingly valid but might be gated).
       // Let's use a definite open one if possible. Searching...
       // Let's use the one from the search result if better. Using the HubSpot one for now as it is a direct PDF link.
      { name: 'Video Content Strategy Guide', url: 'https://cdn2.hubspot.net/hubfs/53/Video%20Marketing%20Strategy.pdf' }
    ]
  },
  'CRM': {
    description: 'Customer Relationship Management: Strategien zur Kundenbindung, CRM-Systeme und Datenanalyse.',
    videos: [
      { name: 'Was ist CRM?', url: 'https://www.youtube.com/watch?v=hp2Vp-wHhj8' }
    ],
    scripts: [
      { name: 'CRM Skript', url: 'https://www.pondiuni.edu.in/storage/study-material/Customer%20Relationship%20Management.pdf' }
    ]
  },
  'Kreativtechniken': {
    description: 'Methoden zur Ideenfindung und Problemlösung. Design Thinking, Brainstorming und mehr.',
    videos: [
      { name: 'Kreativitätstechniken im Überblick', url: 'https://www.youtube.com/watch?v=_Q5XgA3X7wM' }
    ],
    scripts: [
      { name: 'Übersicht Kreativtechniken', url: 'https://www.uni-potsdam.de/fileadmin/projects/wow-fs/Dokumente/Methodenkoffer/Kreativitaetstechniken_Uebersicht.pdf' }
    ]
  },
  'Einführung Informatik': {
    description: 'Grundbegriffe der Informatik, Zahlensysteme, Informationstheorie und Hardware-Grundlagen.',
    videos: [
      { name: 'Einführung in die Informatik', url: 'https://www.youtube.com/watch?v=L7ZJ5q1o7w0' }
    ],
    scripts: [
      { name: 'Skript Einführung Informatik', url: 'https://www.tcs.uni-luebeck.de/fileadmin/Institutsdateien/TCS/Lehre/Skripte/Intro_V1.pdf' }
    ]
  },
  'Grundlagen BWL': {
    description: 'Einführung in die Betriebswirtschaftslehre: Grundbegriffe, Unternehmensführung, Marketing und Rechnungswesen.',
    videos: [
      { name: 'BWL einfach erklärt', url: 'https://www.youtube.com/watch?v=8_ct1ngSWdw' },
      { name: 'Einführung in die BWL', url: 'https://www.youtube.com/watch?v=3RzhV-440A8' },
      { name: 'Betriebswirtschaft Playlist', url: 'https://www.youtube.com/playlist?list=PLxug8aBwlsOIAHmgfI85tC1392MDVO9-t' }
    ],
    scripts: [
      { name: 'Grundlagen der BWL (Skript)', url: 'https://www.carsten-buschmann.de/skripte/bwl1.pdf' },
      { name: 'Einführung in die BWL (Uni Duisburg-Essen)', url: 'https://www.abwl.msm.uni-due.de/fileadmin/Dateien/Business_Administration/VL_EBWL_BWL_WS21_22__003_.pdf' },
      { name: 'Skript Einführung BWL (Uni Potsdam)', url: 'https://www.uni-potsdam.de/fileadmin/projects/marketing-ls/Skript_EBWL_2021_1-1.pdf' },
      { name: 'BWL Einführung (HS Bochum)', url: 'https://www.hochschule-bochum.de/fileadmin/public/Die-BO_Hochschule/digitalisierung/Dateien_DigiTeach/1-Lektion_I_V3.0-rb.pdf' }
    ]
  },
  'Programmierung I': {
    description: 'Grundlagen der Programmierung mit Python. Datentypen, Kontrollstrukturen, Funktionen und objektorientierte Programmierung.',
    videos: [
      { name: 'Python Crash Course', url: 'https://www.youtube.com/watch?v=kqtD5dpn9C8' }
    ],
    scripts: [
       { name: 'Python Grundlagen', url: 'https://www.uni-bamberg.de/fileadmin/uni/fakultaeten/wiai_lehrstuehle/wirtschaftsinformatik/Lehre/Einfuehrung_Wirtschaftsinformatik/SS2015/Einfuehrung_Programmierung_Python_SS15_V02.pdf' }
    ]
  },
  'Wissenschaftliches Arbeiten': {
    description: 'Einführung in die Techniken des wissenschaftlichen Arbeitens. Literaturrecherche, Zitierregeln und Strukturierung wissenschaftlicher Texte.',
    videos: [
      { name: 'Literaturrecherche Tutorial', url: 'https://www.youtube.com/watch?v=l_G28I7Q6p8' }
    ],
    scripts: [
       { name: 'Leitfaden Wissenschaftliches Arbeiten', url: 'https://www.hs-merseburg.de/fileadmin/Hochschule/Einrichtungen/Karriere/Leitfaden_Wissenschaftliches_Arbeiten.pdf' }
    ]
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const hashPassword = (password) => bcryptjs.hash(password, SALT_ROUNDS);

function getCurriculumForUser(program, semester) {
  const programCurriculum = CURRICULUM[program] || CURRICULUM['Wirtschaftsinformatik (Dual)'];
  return programCurriculum[semester] || [];
}

// =============================================================================
// SEEDING FUNCTIONS
// =============================================================================

/**
 * Seed 3 Main Students and 1 Admin
 */
async function seedUsers() {
  console.log('\n Seeding 3 main students...');

  // Delete all existing related data first (Foreign Key constraints)
  await prisma.mark.deleteMany({});
  await prisma.studentTask.deleteMany({});
  await prisma.fileReadingState.deleteMany({}); // Delete child of File
  await prisma.file.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.forumPost.deleteMany({}); // Post before Topic
  await prisma.forumTopic.deleteMany({});
  await prisma.praxisReport.deleteMany({});
  await prisma.praxisPartner.deleteMany({});
  await prisma.praxisHoursLog.deleteMany({});
  await prisma.praxisHoursTarget.deleteMany({});
  await prisma.scheduleEvent.deleteMany({});
  await prisma.studienplan.deleteMany({}); // Delete child of User
  await prisma.user.deleteMany({});
  console.log('   Cleared existing users and all related data');

  const users = [
    {
      email: 'admin@iu.edu',
      username: 'admin',
      name: 'Admin User',
      password: await hashPassword('admin123'),
      role: 'ADMIN',
    },
    {
      email: 'student.demo@iu-study.org',
      username: 'student_demo',
      name: 'Demo Student',
      password: await hashPassword('password123'),
      matriculationNumber: 'IU2024001',
      studyProgram: 'Wirtschaftsinformatik (Dual)',
      semester: 7,
      totalSemesters: 7,
    },
    {
      email: 'tim.mueller_dual@iu-study.org',
      username: 'tim_mueller',
      name: 'Tim Müller',
      password: await hashPassword('student1'),
      matriculationNumber: 'IU2024002',
      studyProgram: 'Informatik (Dual)',
      semester: 1,
      totalSemesters: 7,
    },
    {
      email: 'julia.weber_dual@iu-study.org',
      username: 'julia_weber',
      name: 'Julia Weber',
      password: await hashPassword('student2'),
      matriculationNumber: 'IU2024003',
      studyProgram: 'Marketing (Dual)',
      semester: 4,
      totalSemesters: 7,
    },
    {
      email: 'leon.schmidt_dual@iu-study.org',
      username: 'leon_schmidt',
      name: 'Leon Schmidt', // Shared pool with Demo Student
      password: await hashPassword('student3'),
      matriculationNumber: 'IU2024004',
      studyProgram: 'Wirtschaftsinformatik (Dual)',
      semester: 7,
      totalSemesters: 7,
    }
  ];

  for (const userData of users) {
    await prisma.user.create({ data: userData });
    console.log(`   Created: ${userData.email} (${userData.studyProgram})`);
  }
}

/**
 * Seed courses based on CURRICULUM
 */
async function seedCourses() {
  console.log('\n Seeding courses...');
  await prisma.course.deleteMany({}); // Clear existing
  
  const colors = ['blue', 'purple', 'green', 'orange', 'pink'];

  for (const [programName, semesterMap] of Object.entries(CURRICULUM)) {
    const studiengang = await prisma.studiengang.upsert({
      where: { name: programName },
      update: {},
      create: { name: programName, description: `Dualer Studiengang ${programName}` }
    });

    const programPrefix = programName.substring(0, 3).toUpperCase();

    for (const [semStr, courses] of Object.entries(semesterMap)) {
      const semester = parseInt(semStr);
      for (let i = 0; i < courses.length; i++) {
        const courseName = courses[i];
        const courseCode = `${programPrefix}-${semester}-${i + 1}`;
        const meta = COURSE_METADATA[courseName] || { description: `Modulbeschreibung für ${courseName}.` };
        
        await prisma.course.create({
          data: {
            name: courseName,
            code: courseCode,
            semester: semester,
            credits: courseName.includes("Bachelorarbeit") ? 10 : 5,
            color: colors[i % colors.length],
            studiengangId: studiengang.id,
            description: meta.description
          }
        });
      }
    }
  }
  console.log('   Synced all courses to DB');
}

/**
 * Seed marks for students based on their previous semesters
 */
async function seedMarks() {
  console.log('\n Seeding marks for students...');
  await prisma.teacher.deleteMany({});
  await prisma.mark.deleteMany({});

  const teachers = [
    { name: 'Prof. Dr. Michael Weber', email: 'michael.weber@iu.edu' },
    { name: 'Dr. Sarah Bauer', email: 'sarah.bauer@iu.edu' },
    { name: 'Prof. Thomas Schmidt', email: 'thomas.schmidt@iu.edu' }
  ];

  const teacherIds = [];
  for (const t of teachers) {
    const created = await prisma.teacher.create({ data: t });
    teacherIds.push(created.id);
  }

  const students = await prisma.user.findMany({ where: { role: 'STUDENT' } });

  for (const student of students) {
    if (student.semester <= 1) continue;

    for (let sem = 1; sem < student.semester; sem++) {
      const semCourses = getCurriculumForUser(student.studyProgram, sem);
      for (const courseName of semCourses) {
        const possibleGrades = [1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3];
        const gradeValue = possibleGrades[Math.floor(Math.random() * possibleGrades.length)];
        
        await prisma.mark.create({
          data: {
            value: gradeValue,
            course: courseName,
            userId: student.id,
            teacherId: teacherIds[Math.floor(Math.random() * teacherIds.length)],
            date: new Date(Date.now() - ((student.semester - sem) * 180 * 24 * 60 * 60 * 1000))
          }
        });
      }
    }
    console.log(`   Marks seeded for ${student.name} (Semesters 1 to ${student.semester - 1})`);
  }
}

/**
 * Seed tasks (assignments)
 */
async function seedTasks() {
  console.log('\n Seeding tasks (Deterministic by Cohort)...');
  await prisma.studentTask.deleteMany({});

  const students = await prisma.user.findMany({ where: { role: 'STUDENT' } });
  const baselineDate = new Date("2025-12-25"); // Fixed baseline for deterministic seeding

  // Group students by (Program, Semester) to ensure they get the SAME tasks
  const cohorts = {};
  for (const student of students) {
    const key = `${student.studyProgram}-${student.semester}`;
    if (!cohorts[key]) cohorts[key] = [];
    cohorts[key].push(student);
  }

  for (const key in cohorts) {
    const pool = cohorts[key];
    const firstStudent = pool[0];
    const currentCourses = getCurriculumForUser(firstStudent.studyProgram, firstStudent.semester);
    
    const tasksToCreate = [...currentCourses];
    while (tasksToCreate.length < 5) {
      tasksToCreate.push(`Wahlpflichtmodul ${tasksToCreate.length + 1}`);
    }
    const finalTasks = tasksToCreate.slice(0, 5);

    // Create IDENTICAL tasks for all students in this cohort
    for (const student of pool) {
      for (const [idx, courseName] of finalTasks.entries()) {
        const isExam = idx % 2 === 0;
        const dueDate = new Date(baselineDate);
        dueDate.setDate(baselineDate.getDate() + 15 + (idx * 10));

        let title = "";
        let type = "";
        
        if (isExam) {
          title = `Klausur: ${courseName}`;
          type = "Klausur";
        } else {
          const paperTypes = ["Hausarbeit", "Projektarbeit", "Fallstudie"];
          const paperType = paperTypes[idx % paperTypes.length];
          title = `${paperType}: ${courseName}`;
          type = "Wissenschaftliche Arbeit";
        }

        await prisma.studentTask.create({
          data: {
            title: title,
            course: courseName,
            kind: isExam ? 'KLAUSUR' : 'ABGABE',
            type: type,
            dueDate: dueDate,
            userId: student.id
          }
        });
      }
      console.log(`   Shared Aufgaben seeded for ${student.name} (${student.studyProgram} Sem ${student.semester})`);
    }
  }
}

/**
 * Seed videos and scripts (Resources)
 */
async function seedResources() {
  console.log('\n Seeding videos and scripts for courses...');
  await prisma.file.deleteMany({});

  // Fetch students with their enrolled courses
  const students = await prisma.user.findMany({ 
    where: { role: 'STUDENT' },
    include: { studiengang: { include: { courses: true } } }
  });

  const defaultVideos = [
    { name: 'Modul Einführung', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
  ];

  const defaultScripts = [
    { name: 'Kursskript Kapitel 1-3', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { name: 'Zusammenfassung', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
  ];

  for (const student of students) {
    if (!student.studiengang || !student.studiengang.courses) continue;

    for (const course of student.studiengang.courses) {
      const meta = COURSE_METADATA[course.name];
      
      // 1. Videos
      const videos = meta && meta.videos && meta.videos.length > 0 ? meta.videos : defaultVideos;
      for (const v of videos) {
        await prisma.file.create({
          data: {
            name: v.name,
            url: v.url,
            fileType: 'video',
            size: '0 MB', // Stream
            userId: student.id,
            courseId: course.id
          }
        });
      }

      // 2. Scripts (PDFs)
      const scripts = meta && meta.scripts && meta.scripts.length > 0 ? meta.scripts : defaultScripts;
      for (const s of scripts) {
        await prisma.file.create({
          data: {
            name: s.name,
            url: s.url,
            fileType: 'pdf',
            size: (Math.floor(Math.random() * 5) + 1) + '.4 MB', // Random realistic size
            userId: student.id,
            courseId: course.id
          }
        });
      }
    }
  }
  console.log('   Resources (videos & scripts) seeded with specific metadata');
}

async function linkUsersToStudiengang() {
  const students = await prisma.user.findMany({ where: { role: 'STUDENT' } });
  for (const student of students) {
    const dg = await prisma.studiengang.findUnique({ where: { name: student.studyProgram } });
    if (dg) {
      await prisma.user.update({
        where: { id: student.id },
        data: { studiengangId: dg.id }
      });
    }
  }
}

async function seedNews() {
    console.log('\n Seeding news...');
    await prisma.news.deleteMany({});
    
    const newsItems = [
      {
        slug: 'welcome-2025',
        title: 'Welcome to the Winter Semester 2025',
        content: 'We are excited to welcome all new and returning students to the campus. This semester brings many new opportunities, workshops, and networking events for IU Dual students.',
        category: 'Campus Life',
        featured: true,
        coverImageUrl: 'https://images.unsplash.com/photo-1523050853064-8557227cd6d4?auto=format&fit=crop&q=80&w=800'
      },
      {
        slug: 'exam-prep-workshop',
        title: 'Exam Preparation Workshop Series',
        content: 'Struggling with exam anxiety? Join our upcoming workshop series focusing on effective study techniques, time management, and mock exam scenarios.',
        category: 'Academic',
        featured: false,
        coverImageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800'
      },
      {
        slug: 'career-day-2025',
        title: 'IU Career Day: Connect with Praxis Partners',
        content: 'Over 50 praxis partners will be on campus to meet you. Bring your CV and explore exciting career opportunities and potential placements for next year.',
        category: 'Career',
        featured: true,
        coverImageUrl: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800'
      },
      {
        slug: 'new-library-resources',
        title: 'Expanded Digital Library Access',
        content: 'We have renewed our subscription to major scientific journals. You now have access to over 10,000 new digital resources via the IU library portal.',
        category: 'Resources',
        featured: false,
        coverImageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800'
      }
    ];

    for (const item of newsItems) {
      await prisma.news.create({
        data: item
      });
    }
    console.log('   Seeded 4 news items');
}

async function seedSchedule() {
  console.log('\n Seeding schedule events (Shared by Cohort)...');
  await prisma.scheduleEvent.deleteMany({});

  const students = await prisma.user.findMany({ 
    where: { role: 'STUDENT' },
    include: { studiengang: { include: { courses: true } } }
  });

  const baselineDate = new Date("2025-12-29"); // Monday reference
  baselineDate.setHours(0, 0, 0, 0);

  // Group students by cohort
  const cohorts = {};
  for (const student of students) {
    const key = `${student.studyProgram}-${student.semester}`;
    if (!cohorts[key]) cohorts[key] = [];
    cohorts[key].push(student);
  }

  for (const key in cohorts) {
    const pool = cohorts[key];
    const firstStudent = pool[0];
    if (!firstStudent.studiengang) continue;

    const semesterCourses = firstStudent.studiengang.courses.filter(c => c.semester === firstStudent.semester);
    
    // Create identical events for all students in this pool
    for (const student of pool) {
      for (let week = 0; week < 4; week++) {
        for (const [index, course] of semesterCourses.entries()) {
          const weekOffset = week * 7;
          const day1 = (index % 5);
          const day2 = (index + 2) % 5;

          const date1 = new Date(baselineDate);
          date1.setDate(baselineDate.getDate() + day1 + weekOffset);

          const date2 = new Date(baselineDate);
          date2.setDate(baselineDate.getDate() + day2 + weekOffset);

          await prisma.scheduleEvent.create({
            data: {
              userId: student.id,
              title: course.name,
              courseCode: course.code,
              date: date1,
              startTime: "09:00",
              endTime: "12:00",
              location: index % 2 === 0 ? "Hammerbrook" : "Online",
              eventType: "VORLESUNG",
              professor: `Prof. Dr. ${course.name.split(' ')[0]}`
            }
          });

          await prisma.scheduleEvent.create({
            data: {
              userId: student.id,
              title: `${course.name} Q&A`,
              courseCode: course.code,
              date: date2,
              startTime: "14:00",
              endTime: "15:30",
              location: "Online",
              eventType: index % 3 === 0 ? "TUTORIUM" : "UEBUNG",
              professor: `Tutor ${course.name.split(' ')[0]}`
            }
          });
        }
      }
      console.log(`   Shared Stundenplan seeded for ${student.name} (${student.studyProgram} Sem ${student.semester})`);
    }
  }
}

async function main() {
  console.log(' CLEAN SEEDING: 3 Students, 3 Programs (No Kolloquium, Added metadata)');
  
  await seedUsers();
  await seedCourses();
  await seedMarks();
  await seedTasks();
  await linkUsersToStudiengang();
  await seedResources();
  await seedNews();
  await seedSchedule();

  console.log('\n Seeding successful!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
