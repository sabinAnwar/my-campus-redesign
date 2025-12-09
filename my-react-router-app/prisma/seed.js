import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create test users - IU Dual Degree Students
  const users = [
    // Original users
    {
      email: 'sabin.elanwar@iu-study.org',
      username: 'sabin_elanwar',
      name: 'Sabin Elanwar',
      password: await bcryptjs.hash('password123', 10),
      matriculationNumber: 'IU2024001',
      studyProgram: 'Informatik (Dual)',
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
    // New IU Dual Degree Students
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
      email: 'julia.weber@iu-study.org',
      username: 'julia_weber',
      name: 'Julia Weber',
      password: await bcryptjs.hash('julia_iu_hamburg_dual', 10),
      matriculationNumber: 'IU2024005',
      studyProgram: 'BWL (Dual)',
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
    {
      email: 'paul.wagner@iu-study.org',
      username: 'paul_wagner',
      name: 'Paul Wagner',
      password: await bcryptjs.hash('paul_loves_coding_iu', 10),
      matriculationNumber: 'IU2024008',
      studyProgram: 'Informatik (Dual)',
    },
    {
      email: 'sophie.braun@iu-study.org',
      username: 'sophie_braun',
      name: 'Sophie Braun',
      password: await bcryptjs.hash('sophie_iu_student_2024', 10),
      matriculationNumber: 'IU2024009',
      studyProgram: 'Wirtschaftsinformatik (Dual)',
    },
    {
      email: 'david.hoffmann@iu-study.org',
      username: 'david_hoffmann',
      name: 'David Hoffmann',
      password: await bcryptjs.hash('david_hamburg_campus', 10),
      matriculationNumber: 'IU2024010',
      studyProgram: 'Data Science (Dual)',
    },
    {
      email: 'emma.schulz@iu-study.org',
      username: 'emma_schulz',
      name: 'Emma Schulz',
      password: await bcryptjs.hash('emma_studies_at_iu', 10),
      matriculationNumber: 'IU2024011',
      studyProgram: 'Informatik (Dual)',
    },
    {
      email: 'felix.koch@iu-study.org',
      username: 'felix_koch',
      name: 'Felix Koch',
      password: await bcryptjs.hash('felix_dual_developer', 10),
      matriculationNumber: 'IU2024012',
      studyProgram: 'Software Engineering (Dual)',
    },
    {
      email: 'mia.richter@iu-study.org',
      username: 'mia_richter',
      name: 'Mia Richter',
      password: await bcryptjs.hash('mia_iu_hamburg_2024', 10),
      matriculationNumber: 'IU2024013',
      studyProgram: 'UX Design (Dual)',
    },
    {
      email: 'noah.krueger@iu-study.org',
      username: 'noah_krueger',
      name: 'Noah Krüger',
      password: await bcryptjs.hash('noah_coding_master', 10),
      matriculationNumber: 'IU2024014',
      studyProgram: 'Informatik (Dual)',
    },
    {
      email: 'lena.klein@iu-study.org',
      username: 'lena_klein',
      name: 'Lena Klein',
      password: await bcryptjs.hash('lena_iu_student_girl', 10),
      matriculationNumber: 'IU2024015',
      studyProgram: 'Wirtschaftsinformatik (Dual)',
    },
    {
      email: 'lukas.wolf@iu-study.org',
      username: 'lukas_wolf',
      name: 'Lukas Wolf',
      password: await bcryptjs.hash('lukas_wolf_developer', 10),
      matriculationNumber: 'IU2024016',
      studyProgram: 'Informatik (Dual)',
    },
    {
      email: 'hannah.schroeder@iu-study.org',
      username: 'hannah_schroeder',
      name: 'Hannah Schröder',
      password: await bcryptjs.hash('hannah_iu_dual_study', 10),
      matriculationNumber: 'IU2024017',
      studyProgram: 'Marketing (Dual)',
    },
    {
      email: 'niklas.neumann@iu-study.org',
      username: 'niklas_neumann',
      name: 'Niklas Neumann',
      password: await bcryptjs.hash('niklas_hammerbrook_iu', 10),
      matriculationNumber: 'IU2024018',
      studyProgram: 'Data Science (Dual)',
    },
    {
      email: 'marie.schwarz@iu-study.org',
      username: 'marie_schwarz',
      name: 'Marie Schwarz',
      password: await bcryptjs.hash('marie_dual_degree_24', 10),
      matriculationNumber: 'IU2024019',
      studyProgram: 'BWL (Dual)',
    },
    {
      email: 'jan.zimmermann@iu-study.org',
      username: 'jan_zimmermann',
      name: 'Jan Zimmermann',
      password: await bcryptjs.hash('jan_programming_iu', 10),
      matriculationNumber: 'IU2024020',
      studyProgram: 'Software Engineering (Dual)',
    },
    {
      email: 'lisa.hartmann@iu-study.org',
      username: 'lisa_hartmann',
      name: 'Lisa Hartmann',
      password: await bcryptjs.hash('lisa_iu_praxis_dual', 10),
      matriculationNumber: 'IU2024021',
      studyProgram: 'Wirtschaftsinformatik (Dual)',
    },
    {
      email: 'tom.lange@iu-study.org',
      username: 'tom_lange',
      name: 'Tom Lange',
      password: await bcryptjs.hash('tom_lange_coder_dual', 10),
      matriculationNumber: 'IU2024022',
      studyProgram: 'Informatik (Dual)',
    },
    {
      email: 'sarah.maier@iu-study.org',
      username: 'sarah_maier',
      name: 'Sarah Maier',
      password: await bcryptjs.hash('sarah_iu_waterloohain', 10),
      matriculationNumber: 'IU2024023',
      studyProgram: 'UX Design (Dual)',
    },
    {
      email: 'jonas.huber@iu-study.org',
      username: 'jonas_huber',
      name: 'Jonas Huber',
      password: await bcryptjs.hash('jonas_dual_hamburg_iu', 10),
      matriculationNumber: 'IU2024024',
      studyProgram: 'Data Science (Dual)',
    },
    {
      email: 'amelie.schaefer@iu-study.org',
      username: 'amelie_schaefer',
      name: 'Amelie Schäfer',
      password: await bcryptjs.hash('amelie_student_iu_24', 10),
      matriculationNumber: 'IU2024025',
      studyProgram: 'Informatik (Dual)',
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

// Optional: seed sample news if the model exists
async function seedNews() {
  try {
    const count = await prisma.news.count();
    if (count > 0) return;
    const samples = [
      {
        slug: 'welcome-to-the-portal',
        title: 'Welcome to the IU Student Portal',
        excerpt:
          'Everything you need in one place: marks, applications, modules, and more.',
        content:
          'We are excited to launch the new IU Student Portal. Here you can manage your marks, upload your practical reports, and stay informed about the latest campus updates. Stay tuned for more features!',
        category: 'Announcements',
        tags: JSON.stringify(['announcement', 'portal']),
        author: 'IU Team',
        coverImageUrl: undefined,
        featured: true,
      },
      {
        slug: 'exam-schedule-winter',
        title: 'Winter Exam Schedule Published',
        excerpt: 'Check the dates and registration deadlines for the winter term.',
        content:
          'The winter exam schedule has been published. Please check your course-specific dates and make sure to register before the deadline. Good luck with your preparation!',
        category: 'Exams',
        tags: JSON.stringify(['exams', 'schedule']),
  author: 'Examination Office',
  coverImageUrl: undefined,
        featured: false,
      },
      {
        slug: 'campus-maintenance-november',
        title: 'Scheduled Campus Maintenance in November',
        excerpt: 'Short downtimes may occur on selected services next weekend.',
        content:
          'Our IT department will perform scheduled maintenance on campus systems this weekend. Short service interruptions may occur between 02:00 and 05:00. Thank you for your understanding.',
        category: 'IT',
        tags: JSON.stringify(['maintenance', 'it']),
  author: 'IT Services',
  coverImageUrl: undefined,
        featured: false,
      },
      {
        slug: 'new-module-data-analytics',
        title: 'New Module: Data Analytics with Python',
        excerpt: 'Enroll now for the upcoming semester to learn modern analytics.',
        content:
          'We are excited to offer a new module on Data Analytics with Python. The course covers NumPy, pandas, visualization, and basic ML. Enrollment opens next week.',
        category: 'Academics',
        tags: JSON.stringify(['module', 'python', 'analytics']),
  author: 'Faculty of Computer Science',
  coverImageUrl: undefined,
        featured: true,
      },
      {
        slug: 'scholarship-opportunities-2025',
        title: 'Scholarship Opportunities 2025',
        excerpt: 'Multiple scholarships for outstanding students now available.',
        content:
          'Applications are open for various scholarships for the 2025 academic year. Check eligibility criteria and submit your application before December 15.',
        category: 'Scholarships',
        tags: JSON.stringify(['scholarship', 'finance']),
  author: 'Student Office',
  coverImageUrl: undefined,
        featured: false,
      },
      {
        slug: 'library-extended-hours',
        title: 'Library Extends Opening Hours',
        excerpt: 'From next month, the library will be open until midnight.',
        content:
          'To support your studies, the campus library will extend opening hours to 00:00 from Monday to Friday. Weekend hours remain unchanged.',
        category: 'Library',
        tags: JSON.stringify(['library', 'hours']),
  author: 'Library Team',
  coverImageUrl: undefined,
        featured: false,
      },
      {
        slug: 'career-fair-2025',
        title: 'Join the 2025 Career Fair',
        excerpt: 'Meet employers, attend workshops, and grow your network.',
        content:
          'Our annual Career Fair brings top employers to campus. Prepare your CV and meet recruiters. Workshops on interview skills will be available throughout the day.',
        category: 'Careers',
        tags: JSON.stringify(['career', 'fair', 'jobs']),
  author: 'Career Services',
  coverImageUrl: undefined,
        featured: true,
      },
    ];
    await prisma.news.createMany({ data: samples });
    console.log('✓ Seeded sample news items');
  } catch (err) {
    // If News model not yet migrated, ignore
  }
}

// try to run news seeding without breaking user seeding
seedNews().catch(() => {});
