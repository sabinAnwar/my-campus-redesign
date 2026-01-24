const now = new Date();
const daysAgo = (d: number) => {
  const t = new Date(now);
  t.setDate(now.getDate() - d);
  return t.toISOString();
};

export const FALLBACK_NEWS_ITEMS = [
  {
    id: 7,
    slug: "career-fair-2025",
    title: "Join the 2025 Career Fair",
    excerpt: "Meet employers, attend workshops, and grow your network.",
    content:
      "Our annual Career Fair brings top employers to campus. Prepare your CV and meet recruiters.",
    category: "Careers",
    tags: JSON.stringify(["career", "fair", "jobs"]),
    author: "Career Services",
    cover_image_url: undefined,
    featured: true,
    published_at: daysAgo(0),
  },
  {
    id: 4,
    slug: "new-module-data-analytics",
    title: "New Module: Data Analytics with Python",
    excerpt: "Enroll now for the upcoming semester to learn modern analytics.",
    content:
      "We are excited to offer a new module on Data Analytics with Python. The course covers NumPy, pandas, visualization, and basic ML.",
    category: "Academics",
    tags: JSON.stringify(["module", "python", "analytics"]),
    author: "Faculty of Computer Science",
    cover_image_url: undefined,
    featured: true,
    published_at: daysAgo(2),
  },
  {
    id: 1,
    slug: "welcome-to-the-portal",
    title: "Welcome to the IU Student Portal",
    excerpt:
      "Everything you need in one place: marks, applications, modules, and more.",
    content:
      "We are excited to launch the new IU Student Portal. Here you can manage your marks, upload your practical reports, and stay informed about the latest campus updates.",
    category: "Announcements",
    tags: JSON.stringify(["announcement", "portal"]),
    author: "IU Team",
    cover_image_url: undefined,
    featured: false,
    published_at: daysAgo(3),
  },
  {
    id: 2,
    slug: "exam-schedule-winter",
    title: "Winter Exam Schedule Published",
    excerpt: "Check the dates and registration deadlines for the winter term.",
    content:
      "The winter exam schedule has been published. Please check your course-specific dates and make sure to register before the deadline.",
    category: "Exams",
    tags: JSON.stringify(["exams", "schedule"]),
    author: "Examination Office",
    cover_image_url: undefined,
    featured: false,
    published_at: daysAgo(4),
  },
  {
    id: 3,
    slug: "campus-maintenance-november",
    title: "Scheduled Campus Maintenance in November",
    excerpt: "Short downtimes may occur on selected services next weekend.",
    content:
      "Our IT department will perform scheduled maintenance on campus systems this weekend. Short service interruptions may occur.",
    category: "IT",
    tags: JSON.stringify(["maintenance", "it"]),
    author: "IT Services",
    cover_image_url: undefined,
    featured: false,
    published_at: daysAgo(5),
  },
  {
    id: 5,
    slug: "scholarship-opportunities-2025",
    title: "Scholarship Opportunities 2025",
    excerpt: "Multiple scholarships for outstanding students now available.",
    content:
      "Applications are open for various scholarships for the 2025 academic year. Submit your application before December 15.",
    category: "Scholarships",
    tags: JSON.stringify(["scholarship", "finance"]),
    author: "Student Office",
    cover_image_url: undefined,
    featured: false,
    published_at: daysAgo(7),
  },
  {
    id: 6,
    slug: "library-extended-hours",
    title: "Library Extends Opening Hours",
    excerpt: "From next month, the library will be open until midnight.",
    content:
      "To support your studies, the campus library will extend opening hours to 00:00 from Monday to Friday.",
    category: "Library",
    tags: JSON.stringify(["library", "hours"]),
    author: "Library Team",
    cover_image_url: undefined,
    featured: false,
    published_at: daysAgo(9),
  },
];
