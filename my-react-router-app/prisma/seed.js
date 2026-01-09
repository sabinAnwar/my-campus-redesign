import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

//
// CONFIGURATION
//

const SALT_ROUNDS = 10;

//
// OFFICIAL IU CURRICULUM DATA (English + German)
// Based on IU Internationale Hochschule Wirtschaftsinformatik (Dual) 
// FIXED: Exactly 5 courses per semester for 7 semesters = 35 courses total
//

const CURRICULUM = {
  'Wirtschaftsinformatik (Dual)': {
    name_de: 'Wirtschaftsinformatik (Dual)',
    name_en: 'Business Informatics (Dual)',
    courses: {
      1: [
        { en: 'Mathematics Fundamentals I', de: 'Mathematik Grundlagen I' },
        { en: 'Data Modeling and Database Systems', de: 'Datenmodellierung und Datenbanksysteme' },
        { en: 'Business Administration', de: 'Betriebswirtschaftslehre' },
        { en: 'Introduction to Business Informatics', de: 'Einführung in die Wirtschaftsinformatik' },
        { en: 'Practical Project 1', de: 'Praxisprojekt 1' },
      ],
      2: [
        { en: 'Introduction to Academic Writing for IT', de: 'Einführung in das wissenschaftliche Arbeiten für IT' },
        { en: 'Requirements Engineering', de: 'Requirements Engineering' },
        { en: 'Object-Oriented Programming with Java', de: 'Objektorientierte Programmierung mit Java' },
        { en: 'Information Systems and Integration', de: 'Informationssysteme und Integration' },
        { en: 'Practical Project 2', de: 'Praxisprojekt 2' },
      ],
      3: [
        { en: 'IT Project Management', de: 'IT-Projektmanagement' },
        { en: 'Statistics', de: 'Statistik' },
        { en: 'Supply Chain Management', de: 'Supply Chain Management' },
        { en: 'Quality Assurance in Software Process', de: 'Qualitätssicherung im Softwareprozess' },
        { en: 'Practical Project 3', de: 'Praxisprojekt 3' },
      ],
      4: [
        { en: 'Data Analytics and Big Data', de: 'Data Analytics und Big Data' },
        { en: 'Marketing', de: 'Marketing' },
        { en: 'IT Service Management', de: 'IT Service Management' },
        { en: 'Collaborative Work', de: 'Kollaboratives Arbeiten' },
        { en: 'Practical Project 4', de: 'Praxisprojekt 4' },
      ],
      5: [
        { en: 'Investment and Finance', de: 'Investition und Finanzierung' },
        { en: 'Software Engineering', de: 'Software Engineering' },
        { en: 'Specialization A: Module 1', de: 'Spezialisierung A: Modul 1' },
        { en: 'Specialization A: Module 2', de: 'Spezialisierung A: Modul 2' },
        { en: 'Practical Project 5', de: 'Praxisprojekt 5' },
      ],
      6: [
        { en: 'IT and ERP Systems', de: 'IT- und ERP-Systeme' },
        { en: 'Current Topics in Digitalization', de: 'Aktuelle Themen der Digitalisierung' },
        { en: 'Specialization B: Module 1', de: 'Spezialisierung B: Modul 1' },
        { en: 'Specialization B: Module 2', de: 'Spezialisierung B: Modul 2' },
        { en: 'Practical Project 6', de: 'Praxisprojekt 6' },
      ],
      7: [
        { en: 'E-Commerce', de: 'E-Commerce' },
        { en: 'Entrepreneurship', de: 'Unternehmensgründung' },
        { en: 'Business Management', de: 'Unternehmensführung' },
        { en: 'Data Structures and Algorithms', de: 'Datenstrukturen und Algorithmen' },
        { en: 'Bachelor Thesis', de: 'Bachelorarbeit' },
      ]
    }
  },
  'Informatik (Dual)': {
    name_de: 'Informatik (Dual)',
    name_en: 'Computer Science (Dual)',
    courses: {
      1: [
        { en: 'Mathematics Fundamentals I', de: 'Mathematik Grundlagen I' },
        { en: 'Introduction to Programming', de: 'Einführung in die Programmierung' },
        { en: 'Theoretical Computer Science', de: 'Theoretische Informatik' },
        { en: 'Introduction to Computer Science', de: 'Einführung in die Informatik' },
        { en: 'Practical Project 1', de: 'Praxisprojekt 1' },
      ],
      2: [
        { en: 'Mathematics Fundamentals II', de: 'Mathematik Grundlagen II' },
        { en: 'Object-Oriented Programming with Java', de: 'Objektorientierte Programmierung mit Java' },
        { en: 'Data Structures and Algorithms', de: 'Datenstrukturen und Algorithmen' },
        { en: 'Academic Writing for IT', de: 'Wissenschaftliches Arbeiten für IT' },
        { en: 'Practical Project 2', de: 'Praxisprojekt 2' },
      ],
      3: [
        { en: 'Database Systems', de: 'Datenbanksysteme' },
        { en: 'Operating Systems', de: 'Betriebssysteme' },
        { en: 'Computer Networks', de: 'Rechnernetze' },
        { en: 'Statistics', de: 'Statistik' },
        { en: 'Practical Project 3', de: 'Praxisprojekt 3' },
      ],
      4: [
        { en: 'Software Engineering', de: 'Software Engineering' },
        { en: 'IT Security', de: 'IT-Sicherheit' },
        { en: 'Web Development', de: 'Web-Entwicklung' },
        { en: 'IT Project Management', de: 'IT-Projektmanagement' },
        { en: 'Practical Project 4', de: 'Praxisprojekt 4' },
      ],
      5: [
        { en: 'Distributed Systems', de: 'Verteilte Systeme' },
        { en: 'Machine Learning', de: 'Machine Learning' },
        { en: 'Specialization A: Module 1', de: 'Spezialisierung A: Modul 1' },
        { en: 'Specialization A: Module 2', de: 'Spezialisierung A: Modul 2' },
        { en: 'Practical Project 5', de: 'Praxisprojekt 5' },
      ],
      6: [
        { en: 'Cloud Computing', de: 'Cloud Computing' },
        { en: 'Mobile Application Development', de: 'Mobile App-Entwicklung' },
        { en: 'Specialization B: Module 1', de: 'Spezialisierung B: Modul 1' },
        { en: 'Specialization B: Module 2', de: 'Spezialisierung B: Modul 2' },
        { en: 'Practical Project 6', de: 'Praxisprojekt 6' },
      ],
      7: [
        { en: 'Bachelor Thesis', de: 'Bachelorarbeit' },
        { en: 'Thesis Colloquium', de: 'Kolloquium' },
        { en: 'Career Development', de: 'Karriereentwicklung' },
        { en: 'Final Practical Reflection', de: 'Abschließende Praxisreflexion' },
        { en: 'Practical Project 7', de: 'Praxisprojekt 7' },
      ]
    }
  }
};

// ... (helper functions)

const hashPassword = (password) => bcryptjs.hash(password, SALT_ROUNDS);

function getCurriculumForUser(program, semester) {
  const programCurriculum = CURRICULUM[program];
  if (!programCurriculum) return [];
  return programCurriculum.courses[semester] || [];
}

async function seedUsers() {
  console.log('\n🔄 Seeding users...');
  await prisma.mark.deleteMany({});
  await prisma.studentTask.deleteMany({});
  await prisma.fileReadingState.deleteMany({});
  await prisma.file.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.forumPost.deleteMany({});
  await prisma.forumTopic.deleteMany({});
  await prisma.practicalReport.deleteMany({});
  await prisma.practicalPartner.deleteMany({});
  await prisma.practicalHoursLog.deleteMany({});
  await prisma.practicalHoursTarget.deleteMany({});
  await prisma.scheduleEvent.deleteMany({});
  await prisma.studyPlan.deleteMany({});
  await prisma.user.deleteMany({});

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
      matriculation_number: 'IU2024001',
      study_program: 'Wirtschaftsinformatik (Dual)',
      semester: 7,
      total_semesters: 7,
    },
    {
      email: 'tim.mueller_dual@iu-study.org',
      username: 'tim_mueller',
      name: 'Tim Müller',
      password: await hashPassword('student1'),
      matriculation_number: 'IU2024002',
      study_program: 'Informatik (Dual)',
      semester: 1,
      total_semesters: 7,
    },
    {
      email: 'anna.schmidt@iu-study.org',
      username: 'anna_schmidt',
      name: 'Anna Schmidt',
      password: await hashPassword('student2'),
      matriculation_number: 'IU2024003',
      study_program: 'Wirtschaftsinformatik (Dual)',
      semester: 3,
      total_semesters: 7,
    }
  ];

  for (const userData of users) {
    await prisma.user.create({ data: userData });
    console.log(`   ✅ Created: ${userData.email}`);
  }
}

async function seedCourses() {
  console.log('\n🔄 Seeding bilingual courses...');
  await prisma.course.deleteMany({});
  await prisma.major.deleteMany({});
  
  const colors = ['blue', 'purple', 'green', 'orange', 'pink', 'cyan'];

  for (const [programName, programData] of Object.entries(CURRICULUM)) {
    const major = await prisma.major.upsert({
      where: { name: programName },
      update: {},
      create: { 
        name: programName, 
        description: `Dual study program: ${programName} / ${programData.name_de}` 
      }
    });
    console.log(`   📚 Major: ${programName}`);

    for (const [semStr, courses] of Object.entries(programData.courses)) {
      const semester = parseInt(semStr);
      for (let i = 0; i < courses.length; i++) {
        const courseData = courses[i];
        const courseCode = `${programName.substring(0,3).toUpperCase()}-${semester}-${i + 1}`;
        
        await prisma.course.create({
          data: {
            name: courseData.en, // Fallback English name
            name_en: courseData.en,
            name_de: courseData.de,
            code: courseCode,
            semester: semester,
            credits: 5,
            color: colors[i % colors.length],
            major_id: major.id,
            description: `${courseData.en} / ${courseData.de}`
          }
        });
      }
    }
  }
  console.log(`   ✅ Courses created with EN/DE names`);
}

async function seedStudyPlans() {
  console.log('\n🔄 Seeding study plans...');
  
  const students = await prisma.user.findMany({ where: { role: 'STUDENT' } });
  
  for (const student of students) {
    const programData = CURRICULUM[student.study_program];
    if (!programData) continue;

    // Create a study plan JSON with all semesters
    const planData = {
      program: student.study_program,
      program_de: programData.name_de,
      total_semesters: student.total_semesters,
      current_semester: student.semester,
      semesters: {}
    };

    for (const [semStr, courses] of Object.entries(programData.courses)) {
      const semester = parseInt(semStr);
      planData.semesters[semester] = courses.map((c, idx) => ({
        code: `${student.study_program.substring(0,3).toUpperCase()}-${semester}-${idx + 1}`,
        name_en: c.en,
        name_de: c.de,
        credits: 5,
        status: semester < student.semester ? 'completed' : semester === student.semester ? 'current' : 'upcoming'
      }));
    }

    await prisma.studyPlan.create({
      data: {
        user_id: student.id,
        plan: JSON.stringify(planData)
      }
    });
    console.log(`   ✅ Study plan for: ${student.name}`);
  }
}

async function seedTasks() {
  console.log('\n🔄 Seeding tasks...');
  await prisma.studentTask.deleteMany({});

  const students = await prisma.user.findMany({ where: { role: 'STUDENT' } });
  const baselineDate = new Date("2025-12-25");

  for (const student of students) {
    const currentCourses = getCurriculumForUser(student.study_program, student.semester);
    
    for (const [idx, courseData] of currentCourses.slice(0, 5).entries()) {
      const isExam = idx % 2 === 0;
      const dueDate = new Date(baselineDate);
      dueDate.setDate(baselineDate.getDate() + 15 + (idx * 10));

      let title = "";
      let type = "";
      
      if (isExam) {
        title = `Exam: ${courseData.en}`;
        type = "Exam";
      } else {
        const paperTypes = ["Paper", "Project", "Case Study"];
        const paperType = paperTypes[idx % paperTypes.length];
        title = `${paperType}: ${courseData.en}`;
        type = paperType;
      }

      await prisma.studentTask.create({
        data: {
          title: title,
          course: courseData.en,
          kind: isExam ? 'EXAM' : 'SUBMISSION',
          type: type,
          due_date: dueDate,
          user_id: student.id
        }
      });
    }
    console.log(`   ✅ Tasks for: ${student.name}`);
  }
}

async function linkUsersToMajor() {
  console.log('\n🔄 Linking users to majors...');
  const students = await prisma.user.findMany({ where: { role: 'STUDENT' } });
  for (const student of students) {
    const major = await prisma.major.findUnique({ where: { name: student.study_program } });
    if (major) {
      await prisma.user.update({
        where: { id: student.id },
        data: { major_id: major.id }
      });
      console.log(`   ✅ Linked: ${student.name} → ${major.name}`);
    }
  }
}

async function seedNews() {
  console.log('\n🔄 Seeding news...');
  await prisma.news.deleteMany({});
  const newsItems = [
    {
      slug: 'welcome-2025',
      title: 'Welcome to Winter Semester 2025',
      title_de: 'Willkommen zum Wintersemester 2025',
      title_en: 'Welcome to Winter Semester 2025',
      content: 'Excited to have you all on campus.',
      content_de: 'Wir freuen uns, euch alle auf dem Campus begrüßen zu dürfen.',
      content_en: 'Excited to have you all on campus.',
      category: 'Campus',
      category_de: 'Campus',
      category_en: 'Campus',
      featured: true,
    },
    {
      slug: 'exam-registration-open',
      title: 'Exam Registration Now Open',
      title_de: 'Klausuranmeldung jetzt offen',
      title_en: 'Exam Registration Now Open',
      content: 'Register for your exams in the student portal.',
      content_de: 'Melden Sie sich jetzt im Studierendenportal für Klausuren an.',
      content_en: 'Register for your exams in the student portal.',
      category: 'Academic',
      category_de: 'Studium',
      category_en: 'Academic',
      featured: false,
    }
  ];
  for (const item of newsItems) {
    await prisma.news.create({ data: item });
  }
  console.log(`   ✅ ${newsItems.length} news items created`);
}

async function seedMarks() {
  console.log('\n🔄 Seeding marks (grades)...');
  await prisma.mark.deleteMany({});
  
  const teachers = await prisma.teacher.findMany();
  const students = await prisma.user.findMany({ 
    where: { role: 'STUDENT' },
    include: { major: { include: { courses: true } } }
  });

  for (const student of students) {
    if (!student.major) continue;
    
    // Create marks for completed semesters (before current semester)
    const completedCourses = student.major.courses.filter(c => c.semester < student.semester);
    
    // Special logic for Demo Student: 3 failed courses
    let failedCourseIds = [];
    if (student.email === 'student.demo@iu-study.org' && completedCourses.length >= 3) {
      // Pick 3 unique indices to fail
      const indices = Array.from({ length: completedCourses.length }, (_, i) => i);
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * indices.length);
        failedCourseIds.push(completedCourses[indices.splice(randomIndex, 1)[0]].id);
      }
    }

    for (const course of completedCourses) {
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      
      let grade;
      if (failedCourseIds.includes(course.id)) {
        grade = 5.0; // Fail
      } else {
        // Generate realistic passing grades (1.0 - 4.0)
        const baseGrade = 1.3 + Math.random() * 2.7;
        grade = Math.round(Math.min(baseGrade, 4.0) * 10) / 10;
      }
      
      await prisma.mark.create({
        data: {
          value: grade,
          course: course.name,
          user_id: student.id,
          teacher_id: teacher.id,
          date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
        }
      });
    }
    const failCount = failedCourseIds.length;
    console.log(`   ✅ Marks for: ${student.name} (${completedCourses.length} courses, ${failCount} failed)`);
  }
}

async function seedSchedule() {
  console.log('\n🔄 Seeding schedule events (Jan-Jun 2026)...');
  await prisma.scheduleEvent.deleteMany({});
  
  const students = await prisma.user.findMany({ 
    where: { role: 'STUDENT' },
    include: { major: { include: { courses: true } } }
  });
  
  // Professors
  const professors = ['Prof. Dr. Schmidt', 'Prof. Dr. Müller', 'Prof. Dr. Weber', 'Prof. Dr. Fischer', 'Prof. Dr. Becker'];

  // Schedule Range
  const scheduleStart = new Date('2026-01-05');
  const scheduleEnd = new Date('2026-06-30');
  
  // Holidays 2026
  const holidays = [
    '2026-01-01', '2026-04-03', '2026-04-06', '2026-05-01', 
    '2026-05-14', '2026-05-25', '2026-10-03', '2026-12-25', '2026-12-26'
  ];

  // Exam weeks (Last full week of each month)
  const examWeeks = [
    { start: '2026-01-26', end: '2026-01-30' },
    { start: '2026-02-23', end: '2026-02-27' },
    { start: '2026-03-23', end: '2026-03-27' },
    { start: '2026-04-27', end: '2026-05-01' },
    { start: '2026-05-25', end: '2026-05-29' },
    { start: '2026-06-22', end: '2026-06-26' },
  ];

  // Nachprüfungsphasen (No regular lectures)
  const nachpruefungsPhases = [
    { start: '2026-03-10', end: '2026-03-20' },
    { start: '2026-06-15', end: '2026-06-19' }
  ];

  const isHoliday = (date) => holidays.includes(date.toISOString().split('T')[0]);
  const isExamWeek = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return examWeeks.some(w => dateStr >= w.start && dateStr <= w.end);
  };
  const isNachpruefung = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return nachpruefungsPhases.some(w => dateStr >= w.start && dateStr <= w.end);
  };
  const isAfterMarch = (date) => date >= new Date('2026-04-01');

  for (const student of students) {
    if (!student.major) continue;
    const semesterCourses = student.major.courses.filter(c => c.semester === student.semester);
    if (semesterCourses.length === 0) continue;
    
    let currentDate = new Date(scheduleStart);
    let eventCount = 0;
    
    while (currentDate <= scheduleEnd) {
      const dayOfWeek = currentDate.getDay(); 
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // 1. SKIP WEEKENDS
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // 2. SKIP HOLIDAYS
      if (isHoliday(currentDate)) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // 3. NACHPRÜFUNGSPHASE (No regular lectures or praxis)
      if (isNachpruefung(currentDate)) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // 4. EXAM WEEKS (Special treatment - Overrides Praxis/Lectures)
      if (isExamWeek(currentDate)) {
        const courseIndex = (currentDate.getDate() - 1) % semesterCourses.length;
        const course = semesterCourses[courseIndex];
        
        await prisma.scheduleEvent.create({
          data: {
            user_id: student.id,
            title: `Klausur: ${course.name_de || course.name}`,
            course_code: course.code,
            date: new Date(currentDate),
            start_time: '10:00',
            end_time: '12:00',
            location: 'Campus Prüfungszentrum',
            event_type: 'EXAM',
            professor: professors[courseIndex % professors.length]
          }
        });
        eventCount++;
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // 5. PRAXIS PHASE LOGIC / SPLIT WEEK (Mon-Wed)
      if (dayOfWeek >= 1 && dayOfWeek <= 3) {
         // User requested removal of Praxis Event Cards. 
         // Just skip the day (Background color handles visual indication).
         /* 
         await prisma.scheduleEvent.create({
          data: {
            user_id: student.id,
            title: 'Praxisphase im Unternehmen',
            course_code: 'PRAXIS',
            date: new Date(currentDate),
            start_time: '09:00',
            end_time: '17:00',
            location: 'Beim Praxispartner',
            event_type: 'PRAXIS',
            professor: 'Praxisanleiter'
          }
        });
        eventCount++; 
        */
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      
      // 6. REGULAR LECTURE DAYS (Thu-Fri)
      const timeSlots = [
        { start: '09:00', end: '10:30' },
        { start: '11:00', end: '12:30' },
        { start: '14:00', end: '15:30' },
      ];
      
      const coursesPerDay = isAfterMarch(currentDate) ? 2 : 3;
      
      for (let slot = 0; slot < coursesPerDay; slot++) {
        const weekNumber = Math.floor((currentDate - scheduleStart) / (7 * 24 * 60 * 60 * 1000));
        const courseIndex = (dayOfWeek + slot + weekNumber) % semesterCourses.length;
        const course = semesterCourses[courseIndex];
        
        const eventTypes = ['LECTURE', 'SEMINAR', 'OTHER'];
        const eventTypeLabels = ['Vorlesung', 'Sprint', 'Q&A'];
        const eventTypeIndex = (weekNumber + slot) % 3;
        const eventType = eventTypes[eventTypeIndex];
        const eventLabel = eventTypeLabels[eventTypeIndex];
        
        const courseName = course.name_de || course.name;
        const title = eventType === 'LECTURE' ? courseName : `${eventLabel}: ${courseName}`;
        
        await prisma.scheduleEvent.create({
          data: {
            user_id: student.id,
            title: title,
            course_code: course.code,
            date: new Date(currentDate),
            start_time: timeSlots[slot].start,
            end_time: timeSlots[slot].end,
            location: slot % 2 === 0 ? 'Campus Hammerbrook A1.03' : 'Online (Zoom)',
            event_type: eventType,
            professor: professors[courseIndex % professors.length]
          }
        });
        eventCount++;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    console.log(`   ✅ Schedule fixed for: ${student.name} (${eventCount} events)`);
  }
}

async function seedCourseFiles() {
  console.log('\n🔄 Seeding course files & videos...');
  await prisma.file.deleteMany({});

  const videoUrls = [
    "https://www.youtube.com/watch?v=H1elmMBnykA",
    "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
    "https://www.youtube.com/watch?v=Zftx68K-1D4",
    "https://www.youtube.com/watch?v=3qBXWUpoPHo",
  ];

  const pdfUrl = "/uploads/modulhandbuch-winfo.pdf";

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: { major: { include: { courses: true } } },
  });

  for (const student of students) {
    if (!student.major) continue;
    for (const course of student.major.courses) {
      const videoUrl = videoUrls[course.id % videoUrls.length];
      await prisma.file.create({
        data: {
          name: `${course.name} – Video Lecture`,
          url: videoUrl,
          file_type: "video",
          size: "12:45",
          user_id: student.id,
          course_id: course.id,
          major_id: student.major.id,
        },
      });
      await prisma.file.create({
        data: {
          name: `${course.name} – Skript`,
          url: pdfUrl,
          file_type: "pdf",
          size: "2.4 MB",
          user_id: student.id,
          course_id: course.id,
          major_id: student.major.id,
        },
      });
    }
    console.log(`   ✅ Files for: ${student.name}`);
  }
}

async function seedTeachers() {
  console.log('\n Seeding teachers...');
  await prisma.mark.deleteMany({});
  await prisma.teacher.deleteMany({});
  
  const teachers = [
    { name: 'Prof. Dr. Schmidt', email: 'schmidt@iu.edu' },
    { name: 'Prof. Dr. Müller', email: 'mueller@iu.edu' },
    { name: 'Prof. Dr. Weber', email: 'weber@iu.edu' },
    { name: 'Prof. Dr. Fischer', email: 'fischer@iu.edu' },
    { name: 'Prof. Dr. Becker', email: 'becker@iu.edu' },
  ];
  
  for (const t of teachers) {
    await prisma.teacher.create({ data: t });
  }
  console.log(`   ✅ ${teachers.length} teachers created`);
}

async function main() {
  console.log(' SEEDING: Full Bilingual Data (EN/DE)');
  await seedTeachers();
  await seedUsers();
  await seedCourses();
  await linkUsersToMajor();
  await seedStudyPlans();
  await seedTasks();
  await seedMarks();
  await seedNews();
  await seedSchedule();
  await seedCourseFiles();
  console.log('\n✅ Seeding completed successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
