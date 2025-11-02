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
