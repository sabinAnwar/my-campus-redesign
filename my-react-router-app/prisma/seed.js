import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

// =============================================================================
// CONFIGURATION
// =============================================================================

const SALT_ROUNDS = 10;
const DEFAULT_ROLE = 'STUDENT';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Hash a password using bcrypt
 */
const hashPassword = (password) => bcryptjs.hash(password, SALT_ROUNDS);

/**
 * Generate a username from email
 */
const emailToUsername = (email) => email.split('@')[0].replace('.', '_');

/**
 * Create a dual student object with common defaults
 * @param {number} semester - Current semester (1 = first, higher = later)
 */
const createDualStudent = async (firstName, lastName, password, matrikelNr, program, semester = 3) => ({
  email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@iu-study.org`,
  username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
  name: `${firstName} ${lastName}`,
  password: await hashPassword(password),
  matriculationNumber: matrikelNr,
  studyProgram: program,
  semester: semester,
  totalSemesters: 7,  // 7-semester program
});

// =============================================================================
// USER DATA
// =============================================================================

const getUsersData = async () => {
  // Study programs available
  const PROGRAMS = {
    INFORMATIK: 'Informatik (Dual)',
    WIRTSCHAFTSINFORMATIK: 'Wirtschaftsinformatik (Dual)',
    BWL: 'BWL (Dual)',
    MARKETING: 'Marketing (Dual)',
    DATA_SCIENCE: 'Data Science (Dual)',
    SOFTWARE_ENGINEERING: 'Software Engineering (Dual)',
    UX_DESIGN: 'UX Design (Dual)',
  };

  return [
    // === Admin & Test Users ===
    {
      email: 'admin@iu.edu',
      username: 'admin',
      name: 'Admin User',
      password: await hashPassword('admin123'),
      role: 'ADMIN',
    },
    {
      email: 'student@iu.edu',
      username: 'student_001',
      name: 'Test Student',
      password: await hashPassword('password123'),
    },
    
    // === Main Users ===
    {
      email: 'sabin.elanwar@iu-study.org',
      username: 'sabin_elanwar',
      name: 'Sabin Elanwar',
      password: await hashPassword('password123'),
      matriculationNumber: 'IU2024001',
      studyProgram: PROGRAMS.INFORMATIK,
      semester: 7,  // Last semester - NO onboarding
      totalSemesters: 7,
    },
    {
      email: 'sabinanwar6@gmail.com',
      username: 'sabin_anwar',
      name: 'Sabin Anwar',
      password: await hashPassword('Test@1234'),
      semester: 3,  // Middle semester - NO onboarding
      totalSemesters: 7,
    },

    // === IU Dual Degree Students (verschiedene Semester für Testing) ===
    // Semester 1 = Erstsemester (zeigt Onboarding)
    // Semester 2-5 = Mitte (kein Onboarding)
    // Semester 6 = Letztes Semester (kein Onboarding)
    await createDualStudent('Tim', 'Müller', 'tim_studiert_bei_der_uni_dual', 'IU2024002', PROGRAMS.INFORMATIK, 1),      // Ersti!
    await createDualStudent('Anna', 'Bauer', 'anna_liebt_iu_dual', 'IU2024003', PROGRAMS.WIRTSCHAFTSINFORMATIK, 1),     // Ersti!
    await createDualStudent('Max', 'Schmidt', 'max_dual_student_2024', 'IU2024004', PROGRAMS.INFORMATIK, 2),
    await createDualStudent('Julia', 'Weber', 'julia_iu_hamburg_dual', 'IU2024005', PROGRAMS.BWL, 2),
    await createDualStudent('Leon', 'Fischer', 'leon_studiert_informatik', 'IU2024006', PROGRAMS.INFORMATIK, 3),
    await createDualStudent('Laura', 'Meyer', 'laura_dual_degree_girl', 'IU2024007', PROGRAMS.MARKETING, 3),
    await createDualStudent('Paul', 'Wagner', 'paul_loves_coding_iu', 'IU2024008', PROGRAMS.INFORMATIK, 3),
    await createDualStudent('Sophie', 'Braun', 'sophie_iu_student_2024', 'IU2024009', PROGRAMS.WIRTSCHAFTSINFORMATIK, 4),
    await createDualStudent('David', 'Hoffmann', 'david_hamburg_campus', 'IU2024010', PROGRAMS.DATA_SCIENCE, 4),
    await createDualStudent('Emma', 'Schulz', 'emma_studies_at_iu', 'IU2024011', PROGRAMS.INFORMATIK, 4),
    await createDualStudent('Felix', 'Koch', 'felix_dual_developer', 'IU2024012', PROGRAMS.SOFTWARE_ENGINEERING, 5),
    await createDualStudent('Mia', 'Richter', 'mia_iu_hamburg_2024', 'IU2024013', PROGRAMS.UX_DESIGN, 6),
    await createDualStudent('Noah', 'Krüger', 'noah_coding_master', 'IU2024014', PROGRAMS.INFORMATIK, 6),
    await createDualStudent('Lena', 'Klein', 'lena_iu_student_girl', 'IU2024015', PROGRAMS.WIRTSCHAFTSINFORMATIK, 7),   // Letztes! (Sem 7)
    await createDualStudent('Lukas', 'Wolf', 'lukas_wolf_developer', 'IU2024016', PROGRAMS.INFORMATIK, 7),              // Letztes! (Sem 7)
    await createDualStudent('Hannah', 'Schröder', 'hannah_iu_dual_study', 'IU2024017', PROGRAMS.MARKETING, 1),          // Ersti!
    await createDualStudent('Niklas', 'Neumann', 'niklas_hammerbrook_iu', 'IU2024018', PROGRAMS.DATA_SCIENCE, 2),
    await createDualStudent('Marie', 'Schwarz', 'marie_dual_degree_24', 'IU2024019', PROGRAMS.BWL, 4),
    await createDualStudent('Jan', 'Zimmermann', 'jan_programming_iu', 'IU2024020', PROGRAMS.SOFTWARE_ENGINEERING, 5),
    await createDualStudent('Lisa', 'Hartmann', 'lisa_iu_praxis_dual', 'IU2024021', PROGRAMS.WIRTSCHAFTSINFORMATIK, 6),
    await createDualStudent('Tom', 'Lange', 'tom_lange_coder_dual', 'IU2024022', PROGRAMS.INFORMATIK, 7),               // Letztes! (Sem 7)
    await createDualStudent('Sarah', 'Maier', 'sarah_iu_waterloohain', 'IU2024023', PROGRAMS.UX_DESIGN, 1),             // Ersti!
    await createDualStudent('Jonas', 'Huber', 'jonas_dual_hamburg_iu', 'IU2024024', PROGRAMS.DATA_SCIENCE, 3),
    await createDualStudent('Amelie', 'Schäfer', 'amelie_student_iu_24', 'IU2024025', PROGRAMS.INFORMATIK, 4),
  ];
};

// =============================================================================
// NEWS DATA
// =============================================================================

const NEWS_ITEMS = [
  {
    slug: 'welcome-to-the-portal',
    title: 'Welcome to the IU Student Portal',
    excerpt: 'Everything you need in one place: marks, applications, modules, and more.',
    content: 'We are excited to launch the new IU Student Portal. Here you can manage your marks, upload your practical reports, and stay informed about the latest campus updates. Stay tuned for more features!',
    category: 'Announcements',
    tags: JSON.stringify(['announcement', 'portal']),
    author: 'IU Team',
    featured: true,
  },
  {
    slug: 'exam-schedule-winter',
    title: 'Winter Exam Schedule Published',
    excerpt: 'Check the dates and registration deadlines for the winter term.',
    content: 'The winter exam schedule has been published. Please check your course-specific dates and make sure to register before the deadline. Good luck with your preparation!',
    category: 'Exams',
    tags: JSON.stringify(['exams', 'schedule']),
    author: 'Examination Office',
    featured: false,
  },
  {
    slug: 'campus-maintenance-november',
    title: 'Scheduled Campus Maintenance in November',
    excerpt: 'Short downtimes may occur on selected services next weekend.',
    content: 'Our IT department will perform scheduled maintenance on campus systems this weekend. Short service interruptions may occur between 02:00 and 05:00. Thank you for your understanding.',
    category: 'IT',
    tags: JSON.stringify(['maintenance', 'it']),
    author: 'IT Services',
    featured: false,
  },
  {
    slug: 'new-module-data-analytics',
    title: 'New Module: Data Analytics with Python',
    excerpt: 'Enroll now for the upcoming semester to learn modern analytics.',
    content: 'We are excited to offer a new module on Data Analytics with Python. The course covers NumPy, pandas, visualization, and basic ML. Enrollment opens next week.',
    category: 'Academics',
    tags: JSON.stringify(['module', 'python', 'analytics']),
    author: 'Faculty of Computer Science',
    featured: true,
  },
  {
    slug: 'scholarship-opportunities-2025',
    title: 'Scholarship Opportunities 2025',
    excerpt: 'Multiple scholarships for outstanding students now available.',
    content: 'Applications are open for various scholarships for the 2025 academic year. Check eligibility criteria and submit your application before December 15.',
    category: 'Scholarships',
    tags: JSON.stringify(['scholarship', 'finance']),
    author: 'Student Office',
    featured: false,
  },
  {
    slug: 'library-extended-hours',
    title: 'Library Extends Opening Hours',
    excerpt: 'From next month, the library will be open until midnight.',
    content: 'To support your studies, the campus library will extend opening hours to 00:00 from Monday to Friday. Weekend hours remain unchanged.',
    category: 'Library',
    tags: JSON.stringify(['library', 'hours']),
    author: 'Library Team',
    featured: false,
  },
  {
    slug: 'career-fair-2025',
    title: 'Join the 2025 Career Fair',
    excerpt: 'Meet employers, attend workshops, and grow your network.',
    content: 'Our annual Career Fair brings top employers to campus. Prepare your CV and meet recruiters. Workshops on interview skills will be available throughout the day.',
    category: 'Careers',
    tags: JSON.stringify(['career', 'fair', 'jobs']),
    author: 'Career Services',
    featured: true,
  },
];

// =============================================================================
// SEEDING FUNCTIONS
// =============================================================================

/**
 * Seed users into the database
 */
async function seedUsers() {
  console.log('\n📦 Seeding users...');
  
  const users = await getUsersData();
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const userData of users) {
    try {
      const existing = await prisma.user.findUnique({ 
        where: { email: userData.email } 
      });
      
      if (!existing) {
        await prisma.user.create({ data: userData });
        console.log(`  ✅ Created: ${userData.email}`);
        created++;
      } else {
        console.log(`  ⏭️  Exists: ${userData.email}`);
        skipped++;
      }
    } catch (error) {
      console.error(`  ❌ Error: ${userData.email} - ${error.message}`);
      errors++;
    }
  }

  console.log(`\n📊 Users Summary: ${created} created, ${skipped} skipped, ${errors} errors`);
  return { created, skipped, errors };
}

/**
 * Seed news items into the database
 */
async function seedNews() {
  console.log('\n📰 Seeding news...');
  
  try {
    const existingCount = await prisma.news.count();
    
    if (existingCount > 0) {
      console.log(`  ⏭️  News already seeded (${existingCount} items exist)`);
      return { created: 0, skipped: existingCount };
    }

    await prisma.news.createMany({ data: NEWS_ITEMS });
    console.log(`  ✅ Created ${NEWS_ITEMS.length} news items`);
    return { created: NEWS_ITEMS.length, skipped: 0 };
  } catch (error) {
    // News model might not exist yet
    console.log(`  ⚠️  News seeding skipped (model may not exist)`);
    return { created: 0, skipped: 0 };
  }
}

/**
 * Clean up expired sessions
 */
async function cleanupExpiredSessions() {
  console.log('\n🧹 Cleaning up expired sessions...');
  
  try {
    const deleted = await prisma.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    });
    console.log(`  ✅ Deleted ${deleted.count} expired sessions`);
    return deleted.count;
  } catch (error) {
    console.log(`  ⚠️  Session cleanup skipped`);
    return 0;
  }
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

async function main() {
  console.log('═'.repeat(60));
  console.log('🚀 IU Student Portal - Database Seeding');
  console.log('═'.repeat(60));

  const startTime = Date.now();

  // Run all seeding functions
  await seedUsers();
  await seedNews();
  await cleanupExpiredSessions();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('\n' + '═'.repeat(60));
  console.log(`✨ Seeding complete in ${duration}s`);
  console.log('═'.repeat(60) + '\n');
}

// Execute
main()
  .catch((error) => {
    console.error('\n❌ Fatal error during seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
